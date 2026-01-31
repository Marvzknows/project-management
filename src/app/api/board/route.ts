import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

// Create Board
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await req.json();

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Invalid board title" },
        { status: 400 }
      );
    }

    const board = await prisma.board.create({
      data: {
        title: title,
        ownerId: session.user.id,
        // automatically add creator as a member too
        members: {
          connect: { id: session.user.id },
        },
      },
      select: {
        id: true,
        title: true,
        members: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Board created successfully",
        data: board,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Update Board
export const PATCH = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { boardId, title } = await req.json();

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    }

    // Verify board ownership
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: { ownerId: true },
    });

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    if (board.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update board title
    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: { title: title.trim() },
      select: {
        id: true,
        title: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Board updated successfully",
        data: updatedBoard,
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

// Get Board list
export const GET = async (req: Request) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse search params
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const isAll = searchParams.get("isAll") === "true";
    const per_page = parseInt(searchParams.get("per_page") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    // base query
    const where = {
      OR: [
        { ownerId: session.user.id },
        { members: { some: { id: session.user.id } } },
      ],
      ...(search.trim()
        ? {
            title: {
              contains: search.trim(),
              mode: "insensitive" as const,
            },
          }
        : {}),
    };

    // Handle full list (no pagination)
    if (isAll) {
      const boards = await prisma.board.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ data: boards });
    }

    // Handle paginated list
    const total = await prisma.board.count({ where });
    const boards = await prisma.board.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * per_page,
      take: per_page,
    });

    return NextResponse.json({
      data: boards,
      meta: {
        total,
        per_page,
        page,
        total_pages: Math.ceil(total / per_page),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
