import { DashboardHeaderT } from "@/types/dashboard";
import { apiClient } from "../apiClient";

export const getDashboardHeaderApi = async () => {
  return await apiClient.get<DashboardHeaderT>("/dashboard");
};
