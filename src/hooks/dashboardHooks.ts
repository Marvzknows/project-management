import {
  getDashboardHeaderApi,
  getDashboardPriorityDistributionApi,
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
