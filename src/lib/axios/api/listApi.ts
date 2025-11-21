import { CreateListT, UpdateListPositionT } from "@/types/list";
import { apiClient } from "../apiClient";

export const createListApi = async (payload: CreateListT) => {
  return await apiClient.post(`/list`, payload);
};

export const updateListPositionApi = async ({
  position,
  listId,
}: UpdateListPositionT) => {
  return await apiClient.patch(`list/${listId}/position`, {
    position,
  });
};
