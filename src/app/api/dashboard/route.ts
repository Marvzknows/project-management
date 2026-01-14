import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export const GET = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [userBoards, createdCards, assignedCards, urgentCards] =
      await prisma.$transaction([
        prisma.board.findMany({
          where: {
            OR: [
              { ownerId: session.user.id },
              { members: { some: { id: session.user.id } } },
            ],
          },
          select: {
            id: true,
            title: true,
          },
        }),

        prisma.card.count({
          where: { createdById: session.user.id },
        }),

        prisma.card.count({
          where: {
            assignees: { some: { id: session.user.id } },
          },
        }),

        prisma.card.count({
          where: {
            priority: "URGENT",
            assignees: { some: { id: session.user.id } },
          },
        }),
      ]);

    return NextResponse.json({
      data: {
        boards: userBoards,
        assigned_cards: assignedCards,
        created_cards: createdCards,
        urgent_cards: urgentCards,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
