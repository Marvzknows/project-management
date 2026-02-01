"use client";
import {
  getDashboardHeaderApi,
  getDashboardPriorityDistributionApi,
  getDashboardTeamWorkLoadApi,
} from "@/lib/axios/api/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboardHeader = () => {
  return useQuery({
    queryKey: ["dashboardHeader"],
    queryFn: () => getDashboardHeaderApi(),
  });
};

export const useGetDashboardPriorityDistribution = (boardId: string) => {
  return useQuery({
    queryKey: ["dashboardPriorityDistribution", boardId],
    queryFn: () => getDashboardPriorityDistributionApi({ boardId }),
  });
};

export const useGetDashboardTeamWorkload = (boardId: string) => {
  return useQuery({
    queryKey: ["dashboardTeamWorkload", boardId],
    queryFn: () => getDashboardTeamWorkLoadApi({ boardId }),
  });
};
