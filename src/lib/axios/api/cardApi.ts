import { apiClient } from "../apiClient";

export type CardFormDataT = {
  boardId: string;
  title: string;
  listId: string;
  priority: string;
  assigneeIds: string[];
  // description
};

export const createCardApi = async (payload: CardFormDataT) => {
  return await apiClient.post(`/card`, payload);
};
