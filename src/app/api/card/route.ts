import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { boardId, title, description, listId, priority } = body;

    if (!title || !listId || !boardId || !priority) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        members: {
          some: { id: session.user.id },
        },
      },
    });

    if (!board) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const lastCard = await prisma.card.findFirst({
      where: { listId },
      orderBy: { position: "desc" },
    });

    // check card position
    const nextPosition = lastCard ? lastCard.position + 1 : 1;

    const card = await prisma.card.create({
      data: {
        title,
        description,
        listId,
        priority,
        createdById: session.user.id,
        position: nextPosition,
      },
    });

    return NextResponse.json(
      { message: "Card successfully created", data: card },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
