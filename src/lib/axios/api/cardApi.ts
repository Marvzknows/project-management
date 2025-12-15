import { apiClient } from "../apiClient";

export type CardFormDataT = {
  boardId: string;
  title: string;
  listId: string;
  priority: string;
  assignees: string[];
  description: string;
};

export const createCardApi = async (payload: CardFormDataT) => {
  return await apiClient.post(`/card`, payload);
};
