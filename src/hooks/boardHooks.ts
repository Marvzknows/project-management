"use client";
import {
  addBoardMemberApi,
  createBoardApi,
  getBoardApi,
  getBoardListApi,
  getBoardMembersApi,
  updateUserActiveBoardApi,
} from "@/lib/axios/api/boardApi";
import { AddMemberPayloadT, UseBoardParamsT } from "@/types/board";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (boardName: string) => {
      return await createBoardApi(boardName);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["boardList"] }),
  });
};

export const useAddBoardMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AddMemberPayloadT) => {
      return await addBoardMemberApi(payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["boardData"] }),
  });
};

export const useBoardMembersList = (boardId: string | undefined | null) => {
  return useQuery({
    queryKey: ["boardMembersList", boardId],
    queryFn: async () => {
      return await getBoardMembersApi(boardId!);
    },
    enabled: !!boardId,
  });
};
