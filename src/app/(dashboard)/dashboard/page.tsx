"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import DashboardHeader from "./components/DashboardHeader";
import PriorityDistributionChart from "./components/charts/PriorityDistributionChart";
import TeamWorkloadChart from "./components/TeamWorkloadChart";
import { useGetDashboardHeader } from "@/hooks/dashboardHooks";
import { useSession } from "@/lib/auth-client";

const Dashboard = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { data: dashboardHeaderData, isLoading: isLoadingDashboardHeader } =
    useGetDashboardHeader();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  const isLoading = isLoadingDashboardHeader;

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader
        totalBoards={dashboardHeaderData?.data?.boards.length ?? 0}
        totalTasks={dashboardHeaderData?.data?.created_cards ?? 0}
        assignedTasks={dashboardHeaderData?.data?.assigned_cards ?? 0}
        urgentTasks={dashboardHeaderData?.data?.urgent_cards ?? 0}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div>
          <PriorityDistributionChart
            boards={dashboardHeaderData?.data.boards ?? []}
          />
        </div>
        <div>
          <TeamWorkloadChart boards={dashboardHeaderData?.data.boards ?? []} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
