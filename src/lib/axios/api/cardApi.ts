import { apiClient } from "../apiClient";

export type CardFormDataT = {
  boardId: string;
  title: string;
  listId: string;
  priority: string;
  assignees: string[];
  description: string;
};

export type UpdateCardPositionT = {
  boardId: string;
  listId: string;
  position: number;
};

export type AddCardAssigneeT = {
  cardId: string;
  assigneeId: string;
};

export const createCardApi = async (payload: CardFormDataT) => {
  return await apiClient.post(`/card`, payload);
};

export const updateCardPosition = async (
  payload: UpdateCardPositionT,
  cardId: string
) => {
  return await apiClient.patch(`/card/${cardId}/position`, payload);
};

export const addCardAssigneeApi = async (payload: AddCardAssigneeT) => {
  return await apiClient.post(`/card/assignee`, payload);
};
