import {
  DashboardHeaderT,
  DashboardPriorityDistributionT,
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
