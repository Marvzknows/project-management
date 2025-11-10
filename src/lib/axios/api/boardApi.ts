import { BoardIsAllT, UseBoardParamsT } from "@/types/board";
import { apiClient } from "../apiClient";

export const getBoardListApi = async (params: UseBoardParamsT) => {
  return await apiClient.get<BoardIsAllT>("/board", params);
};

export const getBoardApi = async (id: string) => {
  return await apiClient.get<BoardIsAllT>(`/board/${id}`);
};
