import { getDashboardHeaderApi } from "@/lib/axios/api/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboardHeader = () => {
  return useQuery({
    queryKey: ["dashboardHeader"],
    queryFn: () => getDashboardHeaderApi(),
  });
};
