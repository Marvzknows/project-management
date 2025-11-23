import {
  createListApi,
  updateListPositionApi,
  updateListTitleApi,
} from "@/lib/axios/api/listApi";
import {
  CreateListT,
  UpdateListPositionT,
  UpdateListTitleT,
} from "@/types/list";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateListT) => {
      return await createListApi(payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["boardData"] }),
  });
};

export const useUpdateListPosition = () => {
  return useMutation({
    mutationFn: async (payload: UpdateListPositionT) => {
      return await updateListPositionApi(payload);
    },
  });
};

export const useUpdateListTitle = () => {
  return useMutation({
    mutationFn: async (payload: UpdateListTitleT) => {
      return await updateListTitleApi(payload);
    },
  });
};
