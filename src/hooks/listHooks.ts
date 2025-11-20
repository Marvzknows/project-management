import { createListApi } from "@/lib/axios/api/listApi";
import { CreateListT } from "@/types/list";
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
