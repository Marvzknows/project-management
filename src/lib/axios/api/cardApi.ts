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

export const createCardApi = async (payload: CardFormDataT) => {
  return await apiClient.post(`/card`, payload);
};

export const updateCardPosition = async (
  payload: UpdateCardPositionT,
  cardId: string
) => {
  return await apiClient.patch(`/card/${cardId}/position`, payload);
};
