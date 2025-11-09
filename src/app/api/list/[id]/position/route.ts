import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

// Update list position
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

    const { id: listId } = await params;
    const { position } = await req.json();

    if (position === undefined) {
      return NextResponse.json(
        { error: "Position is required" },
        { status: 400 }
      );
    }

    // Find the list
    const currentList = await prisma.list.findUnique({
      where: { id: listId },
    });

    if (!currentList) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    // Fetch all lists under the same board
    const allLists = await prisma.list.findMany({
      where: { boardId: currentList.boardId },
      orderBy: { position: "asc" },
    });

    // Find current index and target index
    const currentIndex = allLists.findIndex((l) => l.id === listId);
    const targetIndex = position - 1; // because position starts at 1

    if (targetIndex < 0 || targetIndex >= allLists.length) {
      return NextResponse.json(
        { error: "Invalid target position" },
        { status: 400 }
      );
    }

    // Remove list from current position and reinsert at target position
    const reordered = [...allLists];
    const [movedList] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, movedList);

    // Update all positions
    await Promise.all(
      reordered.map((list, index) =>
        prisma.list.update({
          where: { id: list.id },
          data: { position: index + 1 },
        })
      )
    );

    return NextResponse.json(
      { message: "List reordered successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reorder list error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
