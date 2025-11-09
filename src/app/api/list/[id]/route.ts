import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

// Get list by ID
export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const list = await prisma.list.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        position: true,
        board: {
          select: {
            id: true,
            title: true,
            owner: { select: { id: true, name: true } },
            members: { select: { id: true, name: true } },
          },
        },
        cards: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    const isMember = list.board.members.some((m) => m.id === session.user.id);

    if (!isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ data: list });
  } catch (error) {
    console.error("Get list error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
