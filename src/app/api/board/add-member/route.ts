import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, boardId } = await req.json();

    if (!email || !boardId) {
      return NextResponse.json(
        { error: "Email and boardId are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    const isAlreadyMember = await prisma.board.findFirst({
      where: {
        id: boardId,
        members: {
          some: { id: user.id },
        },
      },
    });

    if (isAlreadyMember) {
      return NextResponse.json(
        { error: "User is already a board member" },
        { status: 400 }
      );
    }

    const newMember = await prisma.board.update({
      where: { id: boardId },
      data: {
        members: {
          connect: { id: user.id },
        },
      },
      include: { members: true },
    });

    return NextResponse.json(
      {
        message: "User added successfully",
        data: newMember,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add member error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
