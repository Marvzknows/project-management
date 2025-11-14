import { getBoardApi, getBoardListApi } from "@/lib/axios/api/boardApi";
import { UseBoardParamsT } from "@/types/board";
import { useQuery } from "@tanstack/react-query";

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
