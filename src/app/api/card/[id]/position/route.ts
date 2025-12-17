import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

// Update card position and/or list
export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: cardId } = params;
    const {
      boardId,
      listId: newListId,
      position: newPosition,
    } = await req.json();

    // Validate new position
    if (typeof newPosition !== "number" || newPosition < 0) {
      return NextResponse.json(
        { error: "Invalid position value" },
        { status: 400 }
      );
    }

    // Check board and membership
    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        members: {
          some: { id: session.user.id },
        },
      },
      select: { id: true },
    });

    if (!board) {
      return NextResponse.json(
        { error: "Forbidden or board not found" },
        { status: 403 }
      );
    }

    // Get the card and verify it belongs to this board
    const card = await prisma.card.findFirst({
      where: {
        id: cardId,
        List: {
          boardId,
        },
      },
      select: {
        id: true,
        position: true,
        listId: true,
      },
    });

    if (!card) {
      return NextResponse.json(
        { error: "Card not found or doesn't belong to this board" },
        { status: 404 }
      );
    }

    // Verify the new list belongs to this board
    const newList = await prisma.list.findFirst({
      where: {
        id: newListId,
        boardId,
      },
      select: { id: true },
    });

    if (!newList) {
      return NextResponse.json(
        { error: "Target list not found or doesn't belong to this board" },
        { status: 404 }
      );
    }

    const oldPosition = card.position;
    const oldListId = card.listId;
    const isMovingToNewList = oldListId !== newListId;

    // If nothing changed, return early
    if (!isMovingToNewList && oldPosition === newPosition) {
      return NextResponse.json(
        { message: "Card position unchanged" },
        { status: 200 }
      );
    }

    await prisma.$transaction(async (tx) => {
      if (isMovingToNewList) {
        // SCENARIO 1: Moving to a different list

        // 1. Close the gap in the old list
        await tx.card.updateMany({
          where: {
            listId: oldListId,
            position: {
              gt: oldPosition,
            },
          },
          data: {
            position: {
              decrement: 1,
            },
          },
        });

        // 2. Make space in the new list
        await tx.card.updateMany({
          where: {
            listId: newListId,
            position: {
              gte: newPosition,
            },
          },
          data: {
            position: {
              increment: 1,
            },
          },
        });

        // 3. Move the card to the new list and position
        await tx.card.update({
          where: { id: cardId },
          data: {
            listId: newListId,
            position: newPosition,
          },
        });
      } else {
        // SCENARIO 2: Reordering within the same list

        if (newPosition > oldPosition) {
          // Moving down: shift cards between old and new position up
          await tx.card.updateMany({
            where: {
              listId: newListId,
              position: {
                gt: oldPosition,
                lte: newPosition,
              },
            },
            data: {
              position: {
                decrement: 1,
              },
            },
          });
        } else {
          // Moving up: shift cards between new and old position down
          await tx.card.updateMany({
            where: {
              listId: newListId,
              position: {
                gte: newPosition,
                lt: oldPosition,
              },
            },
            data: {
              position: {
                increment: 1,
              },
            },
          });
        }

        // Update the card to its new position
        await tx.card.update({
          where: { id: cardId },
          data: { position: newPosition },
        });
      }
    });

    return NextResponse.json(
      {
        message: isMovingToNewList
          ? "Card moved to new list successfully"
          : "Card reordered successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reorder card error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
