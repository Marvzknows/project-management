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
