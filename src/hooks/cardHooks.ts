import {
  addCardAssigneeApi,
  AddCardAssigneeT,
  CardFormDataT,
  createCardApi,
  removeCardAssigneeApi,
  RemoveCardAssigneeT,
  updateCardPosition,
  UpdateCardPositionT,
} from "@/lib/axios/api/cardApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CardFormDataT) => {
      return await createCardApi(payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["boardData"] }),
  });
};

export const useUpdateCardPosition = () => {
  return useMutation({
    mutationFn: async ({
      payload,
      cardId,
    }: {
      payload: UpdateCardPositionT;
      cardId: string;
    }) => {
      return await updateCardPosition(payload, cardId);
    },
  });
};

export const useAddCardAssignee = () => {
  return useMutation({
    mutationFn: async (payload: AddCardAssigneeT) => {
      return await addCardAssigneeApi(payload);
    },
  });
};

export const useRemoveCardAssignee = () => {
  return useMutation({
    mutationFn: async (payload: RemoveCardAssigneeT) => {
      return await removeCardAssigneeApi(payload);
    },
  });
};
