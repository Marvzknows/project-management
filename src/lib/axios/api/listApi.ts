import { CreateListT } from "@/types/list";
import { apiClient } from "../apiClient";

export const createListApi = async (payload: CreateListT) => {
  return await apiClient.post(`/list`, payload);
};
