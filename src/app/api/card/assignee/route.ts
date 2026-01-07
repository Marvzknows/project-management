import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

// Add Card assignee
export const POST = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { cardId, assigneeId } = body;

    if (!cardId || !assigneeId) {
      return NextResponse.json(
        { error: "cardId and assigneeId are required" },
        { status: 400 }
      );
    }

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      select: {
        id: true,
        List: {
          select: {
            board: {
              select: {
                ownerId: true,
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
        { error: "Assignee must be a board member" },
        { status: 400 }
      );
    }

    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        assignees: {
          connect: {
            id: assigneeId,
          },
        },
        updatedAt: new Date(),
      },
      include: {
        assignees: true,
      },
    });

    return NextResponse.json(
      {
        message: "Assignee added successfully",
        data: updatedCard.assignees,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Add task assignee error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
