import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

// Create list
export const POST = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get list title and board id
    const { title, boardId } = await req.json();
    if (!title || !boardId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // check if the user is member of the board
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

    // create list with automated default position
    const lastList = await prisma.list.findFirst({
      where: { boardId },
      orderBy: { position: "desc" },
    });

    const nextPosition = lastList ? lastList.position + 1 : 1;

    const list = await prisma.list.create({
      data: {
        title: title,
        position: nextPosition,
        boardId: boardId,
        createdById: session.user.id,
      },
      select: {
        id: true,
        title: true,
        position: true,
        createdAt: true,
      },
    });

    // return created list
    return NextResponse.json(
      { message: "Board list successfully created", data: list },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
