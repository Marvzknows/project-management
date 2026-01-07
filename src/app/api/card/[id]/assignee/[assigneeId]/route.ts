import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

type Params = {
  id: string;
  assigneeId: string;
};

// remove assigned user
export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<Params> }
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: cardId, assigneeId } = await params;

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      select: {
        List: {
          select: {
            board: {
              select: {
                members: {
                  select: { id: true },
                },
              },
            },
          },
        },
      },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const isMember = card.List.board.members.some(
      (m) => m.id === session.user.id
    );

    if (!isMember) {
      return NextResponse.json(
        { error: "You must be a board member to remove assignees" },
        { status: 400 }
      );
    }

    const isValidAssignee = await prisma.card.findFirst({
      where: {
        id: cardId,
        assignees: {
          some: { id: assigneeId },
        },
      },
    });

    if (!isValidAssignee) {
      return NextResponse.json(
        { error: "User is not assigned to this card" },
        { status: 400 }
      );
    }

    const updateCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        assignees: {
          disconnect: { id: assigneeId },
        },
        updatedAt: new Date(),
      },
      include: {
        assignees: true,
      },
    });

    return NextResponse.json(
      {
        message: "Assignee removed successfully",
        data: updateCard.assignees,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Deleting task assignee error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
