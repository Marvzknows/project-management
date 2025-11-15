import {
  getBoardApi,
  getBoardListApi,
  updateUserActiveBoardApi,
} from "@/lib/axios/api/boardApi";
import { UseBoardParamsT } from "@/types/board";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useBoardList = (params: UseBoardParamsT) => {
  return useQuery({
    queryKey: ["boardList", params],
    queryFn: async () => {
      return await getBoardListApi(params);
    },
  });
};

export const useBoard = (boardId: string | null | undefined) => {
  return useQuery({
    queryKey: ["boardData", boardId],
    queryFn: async () => {
      return await getBoardApi(boardId!);
    },
    enabled: !!boardId,
  });
};

export const useUpdateUserActiveBoard = () => {
  return useMutation({
    mutationFn: async (boardId: string) => {
      return await updateUserActiveBoardApi(boardId);
    },
  });
};
