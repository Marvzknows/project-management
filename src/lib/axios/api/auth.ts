import { apiClient } from "../apiClient";
import { MeApi } from "@/lib/auth";

export const meApi = async () => {
  return await apiClient.get<MeApi>("/auth/me");
};
