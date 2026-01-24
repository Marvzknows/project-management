import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const boardId = searchParams.get("boardId");

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!boardId) {
      return NextResponse.json(
        { error: "boardId is required" },
        { status: 400 },
      );
    }

    // All Boards
    if (boardId.trim().toLowerCase() === "all") {
      // Get all boards where user is owner or member
      const userBoards = await prisma.board.findMany({
        where: {
          OR: [
            { ownerId: session.user.id },
            { members: { some: { id: session.user.id } } },
          ],
        },
        select: { id: true },
      });

      const boardIds = userBoards.map((board) => board.id);

      const allBoardsData = await prisma.card.groupBy({
        by: ["priority"],
        where: {
          List: {
            boardId: { in: boardIds },
          },
        },
        _count: {
          priority: true,
        },
      });

      // Transform data to match chart format
      const chartData = [
        {
          priority: "Low",
          tasks:
            allBoardsData.find((item) => item.priority === "LOW")?._count
              .priority || 0,
          fill: "hsl(142, 76%, 36%)",
        },
        {
          priority: "Medium",
          tasks:
            allBoardsData.find((item) => item.priority === "MEDIUM")?._count
              .priority || 0,
          fill: "hsl(48, 96%, 53%)",
        },
        {
          priority: "High",
          tasks:
            allBoardsData.find((item) => item.priority === "HIGH")?._count
              .priority || 0,
          fill: "hsl(25, 95%, 53%)",
        },
        {
          priority: "Urgent",
          tasks:
            allBoardsData.find((item) => item.priority === "URGENT")?._count
              .priority || 0,
          fill: "hsl(0, 84%, 60%)",
        },
      ];

      return NextResponse.json({ data: chartData });
    }

    // Specific board - verify user has access
    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        OR: [
          { ownerId: session.user.id },
          { members: { some: { id: session.user.id } } },
        ],
      },
    });

    if (!board) {
      return NextResponse.json(
        { error: "Board not found or access denied" },
        { status: 404 },
      );
    }

    const specificBoardData = await prisma.card.groupBy({
      by: ["priority"],
      where: {
        deletedAt: null,
        List: {
          deletedAt: null,
          boardId: boardId,
        },
      },
      _count: {
        priority: true,
      },
    });

    // Transform data to match chart format
    const chartData = [
      {
        priority: "Low",
        tasks:
          specificBoardData.find((item) => item.priority === "LOW")?._count
            .priority || 0,
        fill: "hsl(142, 76%, 36%)",
      },
      {
        priority: "Medium",
        tasks:
          specificBoardData.find((item) => item.priority === "MEDIUM")?._count
            .priority || 0,
        fill: "hsl(48, 96%, 53%)",
      },
      {
        priority: "High",
        tasks:
          specificBoardData.find((item) => item.priority === "HIGH")?._count
            .priority || 0,
        fill: "hsl(25, 95%, 53%)",
      },
      {
        priority: "Urgent",
        tasks:
          specificBoardData.find((item) => item.priority === "URGENT")?._count
            .priority || 0,
        fill: "hsl(0, 84%, 60%)",
      },
    ];

    return NextResponse.json({ data: chartData });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
