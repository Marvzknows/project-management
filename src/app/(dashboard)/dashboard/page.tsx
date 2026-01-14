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
  // │TeamWorkloadChart│  Priority Distribution Chart  │
  // │  (Assigned)     │  (Timeline)                   │
  // │                 │                               │
  // ├─────────────────┴───────────────────────────────┤
  // ├─────────────────────────────────────────────────┤
  // │                                                 │
  // └─────────────────────────────────────────────────┘
  // -------------------------------------------------
};

export default Dashboard;
