import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import type { User } from "@/generated/prisma";

// Update list title
export const PATCH = async (
  req: NextRequest,
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
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Missing title" }, { status: 400 });
    }

    // Find the list and its board
    const list = await prisma.list.findUnique({
      where: { id },
      include: { board: { include: { members: true } } },
    });

    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    // Check if user is a member of the board
    const isMember = list.board.members.some(
      (member: User) => member.id === session.user.id
    );

    if (!isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update the title
    const updatedList = await prisma.list.update({
      where: { id },
      data: { title },
      select: {
        id: true,
        title: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { message: "List title updated successfully", data: updatedList },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
