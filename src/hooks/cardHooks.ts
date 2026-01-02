import {
  addCardAssigneeApi,
  AddCardAssigneeT,
  CardFormDataT,
  createCardApi,
  removeCardAssigneeApi,
  RemoveCardAssigneeT,
  showCardApi,
  updateCardApi,
  UpdateCardData,
  updateCardPosition,
  UpdateCardPositionT,
} from "@/lib/axios/api/cardApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CardFormDataT) => {
      return await createCardApi(payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["boardData"] }),
  });
};

export const useUpdateCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { payload: UpdateCardData; cardId: string }) => {
      return await updateCardApi(data.payload, data.cardId);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["boardData", "showCard"] }),
  });
};

export const useShowCard = (cardId?: string, enabled?: boolean) => {
  return useQuery({
    queryKey: ["showCard", cardId],
    queryFn: () => showCardApi(cardId as string),
    enabled: Boolean(cardId) && Boolean(enabled),
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
