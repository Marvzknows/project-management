import { ShowCardT } from "@/types/card";
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

export type RemoveCardAssigneeT = {
  cardId: string;
  assigneeId: string;
};

export type UpdateCardData = {
  title: string;
  description: string;
  priority: string;
  assignees: string[];
  status: string;
};

export const createCardApi = async (payload: CardFormDataT) => {
  return await apiClient.post(`/card`, payload);
};

export const updateCardApi = async (
  payload: UpdateCardData,
  cardId: string,
) => {
  return await apiClient.put(`/card/${cardId}`, payload);
};

export const showCardApi = async (cardId: string) => {
  return await apiClient.get<ShowCardT>(`/card/${cardId}`);
};

export const deleteCardApi = async (cardId: string) => {
  return await apiClient.delete(`/card/${cardId}`);
};

export const updateCardPosition = async (
  payload: UpdateCardPositionT,
  cardId: string,
) => {
  return await apiClient.patch(`/card/${cardId}/position`, payload);
};

export const addCardAssigneeApi = async (payload: AddCardAssigneeT) => {
  return await apiClient.post(`/card/assignee`, payload);
};

export const removeCardAssigneeApi = async (params: RemoveCardAssigneeT) => {
  return await apiClient.delete(
    `/card/${params.cardId}/assignee/${params.assigneeId}`,
  );
};
