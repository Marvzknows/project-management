import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import DashboardHeader from "./components/DashboardHeader";
import PriorityDistributionChart from "./components/charts/PriorityDistributionChart";
import TeamWorkloadChart from "./components/TeamWorkloadChart";

const Dashboard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <div className="p-6 space-y-6">
      <DashboardHeader
        totalBoards={0}
        totalTasks={0}
        assignedTasks={0}
        urgentTasks={0}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="h-[600px]">
          <PriorityDistributionChart />
        </div>
        <div className="h-[600px]">
          <TeamWorkloadChart />
        </div>
      </div>
    </div>
  );

  // ┌─────────────────────────────────────────────────┐
  // │  Stats Cards (4 across)                         │
  // │  [Boards] [Tasks] [Assigned] [Urgent]           │
  // ├─────────────────┬───────────────────────────────┤
  // │                 │                               │
  // │  My Tasks       │  Priority Distribution Chart  │
  // │  (Assigned)     │  (Timeline)                   │
  // │                 │                               │
  // ├─────────────────┴───────────────────────────────┤
  // ├─────────────────────────────────────────────────┤
  // │  My Boards (Grid or List View)                  │
  // │  [Board 1] [Board 2] [Board 3]                  │
  // └─────────────────────────────────────────────────┘
  // -------------------------------------------------

  // Stats Cards:
  // - Total Boards (owned + member)
  // - Total Active Tasks (cards without deletedAt)
  // - Tasks Assigned to You
  // - Urgent Priority Count

  // Recent Activity
  // - Recently created cards (last 7 days)
  // - Recently updated cards
  // - Comments you've made
  // - Cards you've been assigned to
  // - New boards you've been added to

  // Priority Distribution Chart
  // - Pie chart or bar chart showing LOW/MEDIUM/HIGH/URGENT
  // - Filter by: All boards, specific board, or assigned to me
};

export default Dashboard;
