import {
  DashboardHeaderT,
  DashboardPriorityDistributionT,
  DashboardTeamWorkloadT,
} from "@/types/dashboard";
import { apiClient } from "../apiClient";

export const getDashboardHeaderApi = async () => {
  return await apiClient.get<DashboardHeaderT>("/dashboard");
};

export const getDashboardPriorityDistributionApi = async (params = {}) => {
  return await apiClient.get<DashboardPriorityDistributionT>(
    "/dashboard/priority-distribution",
    params,
  );
};

export const getDashboardTeamWorkLoadApi = async (params = {}) => {
  return await apiClient.get<{ data: DashboardTeamWorkloadT[] }>(
    "/dashboard/team-workload",
    params,
  );
};
