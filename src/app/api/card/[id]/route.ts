import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

// Get Card by ID
export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id: cardId } = await params;
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const card = await prisma.card.findFirst({
      where: { id: cardId },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
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
        priority: true,
        comments: true,
        status: true,
      },
    });

    return NextResponse.json({
      data: card,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

// Updare Card
export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id: cardId } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, assignees, priority, status } = body;

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
      (m) => m.id === session.user.id,
    );

    if (!isMember) {
      return NextResponse.json(
        { error: "You must be a board member to remove assignees" },
        { status: 400 },
      );
    }

    // Validate assignees if they are board member or not
    if (assignees?.length) {
      const memberIds = card.List.board.members.map((m) => m.id);
      const invalidAssignees = assignees.filter(
        (id: string) => !memberIds.includes(id),
      );

      if (invalidAssignees.length > 0) {
        return NextResponse.json(
          { error: "Some assignees are not board members" },
          { status: 400 },
        );
      }
    }

    // Update query
    const updateCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        title,
        description,
        assignees: assignees?.length
          ? {
              set: assignees.map((id: string) => ({ id })),
            }
          : { set: [] },
        updatedAt: new Date(),
        priority,
        status,
      },
    });

    return NextResponse.json(
      { message: "Card successfully updated", data: updateCard },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

// Delete Card
export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const { id: cardId } = await params;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // must be member
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      select: {
        List: {
          select: {
            board: {
              select: {
                members: {
                  select: {
                    id: true,
                  },
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
      (m) => m.id === session.user.id,
    );

    if (!isMember) {
      return NextResponse.json(
        { error: "You must be a board member to delete this card" },
        { status: 400 },
      );
    }

    await prisma.card.delete({
      where: { id: cardId },
    });

    return NextResponse.json({
      message: "Card deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
