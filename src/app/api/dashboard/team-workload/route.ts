import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { DashboardTeamWorkloadT } from "@/types/dashboard";

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
    if (boardId.trim().toLowerCase() === "all" || boardId.trim() === " ") {
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

      // Get all cards from these boards with assignees
      const cards = await prisma.card.findMany({
        where: {
          deletedAt: null,
          List: {
            deletedAt: null,
            boardId: { in: boardIds },
          },
        },
        select: {
          id: true,
          status: true,
          assignees: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Aggregate data by user
      const userWorkloadMap = new Map<
        string,
        {
          name: string;
          assigned: number;
          completed: number;
          in_progress: number;
          todo: number;
        }
      >();

      cards.forEach((card) => {
        card.assignees.forEach((assignee) => {
          if (!userWorkloadMap.has(assignee.id)) {
            userWorkloadMap.set(assignee.id, {
              name: assignee.name,
              assigned: 0,
              completed: 0,
              in_progress: 0,
              todo: 0,
            });
          }

          const userWorkload = userWorkloadMap.get(assignee.id)!;
          userWorkload.assigned += 1;

          if (card.status === "COMPLETED") {
            userWorkload.completed += 1;
          } else if (card.status === "IN_PROGRESS") {
            userWorkload.in_progress += 1;
          } else if (card.status === "TODO") {
            userWorkload.todo += 1;
          }
        });
      });

      const data: DashboardTeamWorkloadT[] = Array.from(
        userWorkloadMap.values(),
      );

      return NextResponse.json({ data });
    }

    // Specific Board
    // Verify user has access to this board
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

    // Get all cards from this board with assignees
    const cards = await prisma.card.findMany({
      where: {
        deletedAt: null,
        List: {
          deletedAt: null,
          boardId: boardId,
        },
      },
      select: {
        id: true,
        status: true,
        assignees: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Aggregate data by user
    const userWorkloadMap = new Map<
      string,
      {
        name: string;
        assigned: number;
        completed: number;
        in_progress: number;
        todo: number;
      }
    >();

    cards.forEach((card) => {
      card.assignees.forEach((assignee) => {
        if (!userWorkloadMap.has(assignee.id)) {
          userWorkloadMap.set(assignee.id, {
            name: assignee.name,
            assigned: 0,
            completed: 0,
            in_progress: 0,
            todo: 0,
          });
        }

        const userWorkload = userWorkloadMap.get(assignee.id)!;
        userWorkload.assigned += 1;

        if (card.status === "COMPLETED") {
          userWorkload.completed += 1;
        } else if (card.status === "IN_PROGRESS") {
          userWorkload.in_progress += 1;
        } else if (card.status === "TODO") {
          userWorkload.todo += 1;
        }
      });
    });

    const data: DashboardTeamWorkloadT[] = Array.from(userWorkloadMap.values());

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Team workload API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
