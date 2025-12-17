import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

// Update card position
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
    const { boardId, listId, position: newPosition } = await req.json();

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

    // Check card belongs to the list & board
    const card = await prisma.card.findFirst({
      where: {
        id: cardId,
        listId,
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
        { error: "Invalid card or list" },
        { status: 404 }
      );
    }

    const oldPosition = card.position;

    if (oldPosition === newPosition) {
      return NextResponse.json(
        { message: "Card position unchanged" },
        { status: 200 }
      );
    }

    await prisma.$transaction(async (tx) => {
      if (newPosition > oldPosition) {
        // Moving down: shift cards between old and new position up
        await tx.card.updateMany({
          where: {
            listId: listId,
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
            listId,
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

      // Update the target card to its new position
      await tx.card.update({
        where: { id: cardId },
        data: { position: newPosition },
      });
    });

    return NextResponse.json(
      { message: "Card reordered successfully" },
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
