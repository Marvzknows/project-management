import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

// Get Board by ID
export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const board = await prisma.board.findUnique({
      where: { id: id },
      select: {
        title: true,
        owner: true,
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        List: {
          orderBy: { position: "asc" },
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
            position: true,
            boardId: true,
            createdById: true,
            cards: {
              orderBy: { position: "asc" },
              select: {
                id: true,
                title: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                listId: true,
                position: true,
                createdById: true,
                createdBy: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
                priority: true,
                _count: {
                  select: {
                    comments: true,
                  },
                },
                assignees: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
        activeUsers: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    const isMember = board.members.some(
      (member) => member.id === session.user.id
    );
    if (!isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formattedBoard = {
      ...board,
      List: board.List.map((list) => ({
        ...list,
        cards: list.cards.map((card) => ({
          ...card,
          commentsCount: card._count.comments,
          _count: undefined, // optional cleanup
        })),
      })),
    };

    return NextResponse.json({
      data: formattedBoard,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

// Delete Board by ID
export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const board = await prisma.board.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        ownerId: true,
      },
    });

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    if (board.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the board
    await prisma.board.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      {
        message: "Board deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete board error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

// Update user active board
export const PUT = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // check if user is member of the board
    const board = await prisma.board.findUnique({
      where: { id: id },
      select: { id: true, members: { select: { id: true } } },
    });

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    const isMember = board.members.some((m) => m.id === session.user.id);

    if (!isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // update user "activeBoardId"
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        activeBoardId: board.id,
      },
    });

    return NextResponse.json(
      {
        message: "Set active board successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
