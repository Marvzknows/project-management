import {
  CreateListT,
  UpdateListPositionT,
  UpdateListTitleT,
} from "@/types/list";
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

export const updateListTitleApi = async (payload: UpdateListTitleT) => {
  return await apiClient.patch(`list/${payload.listId}/title`, {
    title: payload.title,
  });
};

export const deleteListApi = async (listId: string) => {
  return await apiClient.delete(`/list/${listId}`);
};
