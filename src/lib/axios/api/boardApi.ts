import { BoardIsAllT, UseBoardParamsT, UserBoardDataT } from "@/types/board";
import { apiClient } from "../apiClient";

export const getBoardListApi = async (params: UseBoardParamsT) => {
  return await apiClient.get<BoardIsAllT>("/board", params);
};

export const getBoardApi = async (id: string) => {
  return await apiClient.get<UserBoardDataT>(`/board/${id}`);
};

export const updateUserActiveBoardApi = async (boardId: string) => {
  return await apiClient.put(`/board/${boardId}`);
};

export const createBoardApi = async (boardName: string) => {
  return await apiClient.post(`/board`, { title: boardName });
};
