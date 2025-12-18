"use client";

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import BoardListComboBox from "./components/BoardListComboBox";
import AddMemberDialog from "./components/AddMemberDialog";
import AvatarStacked from "./components/AvatarStacked";
import AddBoardListDialog from "./components/AddBoardListDialog";
import CreateBoardDialog from "./components/CreateBoardDialog";
import { useBoard, useBoardList } from "@/hooks/boardHooks";
import FullPageError from "@/components/FullPageError";
import BoardPageSkeleton from "./components/BoardPageSkeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { AuthContext } from "@/context/auth/AuthContext";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ListT } from "@/types/list";
import { CardT } from "@/types/card";
import SortableBoardList from "./components/dnd/SortableBoardList";
import { useUpdateListPosition } from "@/hooks/listHooks";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/supabaseClient";
import TaskCard from "./components/TaskCard";
import { useUpdateCardPosition } from "@/hooks/cardHooks";
import { UpdateCardPositionT } from "@/lib/axios/api/cardApi";

const BoardPage = () => {
  const { user } = useContext(AuthContext);
  const [searchBoard, setSearchBoard] = useState("");
  const debouncedSearch = useDebounce(searchBoard, 500);
  const [activeCard, setActiveCard] = useState<CardT | null>(null);
  const [activeList, setActiveList] = useState<ListT | null>(null);

  // #region API
  const {
    data: boardListData,
    isLoading: isLoadingBoardList,
    isError: isErrorBoardList,
  } = useBoardList({ isAll: true, search: debouncedSearch });

  const {
    data: boardData,
    isLoading: isLoadingBoardData,
    isError: isErrorBoardData,
    refetch: refetchBoard,
  } = useBoard(user?.activeBoardId);

  const { mutate: updateBoardListOrderMutation } = useUpdateListPosition();
  const { mutate: updateCardPositionMutation } = useUpdateCardPosition();
  // #endregion
  const boardOptions = useMemo(() => {
    return (
      boardListData?.data.map((b) => ({
        label: b.title,
        value: b.id,
      })) ?? []
    );
  }, [boardListData]);

  if (isErrorBoardList || isErrorBoardData) return <FullPageError />;

  const [lists, setLists] = useState<ListT[]>([]);

  useEffect(() => {
    if (boardData?.data.List) {
      setLists(boardData.data.List);
    }
  }, [boardData]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    // Check if dragging a list
    const list = lists.find((l) => l.id === active.id);
    if (list) {
      setActiveList(list);
      return;
    }

    // Check if dragging a card
    const sourceList = lists.find((list) =>
      list.cards.some((card) => card.id === active.id)
    );

    if (sourceList) {
      const card = sourceList.cards.find((card) => card.id === active.id);
      setActiveCard(card || null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // If dragging a list, don't handle card logic
    if (activeList) return;

    if (activeId === overId) return;

    // Determine if we're dragging a card
    const sourceList = lists.find((list) =>
      list.cards.some((card) => card.id === activeId)
    );

    if (!sourceList) return; // Not dragging a card

    // Find the list that contains the over item (could be a card or list drop zone)
    let targetList = lists.find((list) =>
      list.cards.some((card) => card.id === overId)
    );

    // If over item is not a card, check if it's a list drop zone
    if (!targetList) {
      const listId = String(overId).replace("list-", "");
      targetList = lists.find((list) => String(list.id) === listId);
    }

    if (!targetList) return;

    const activeListIndex = lists.findIndex(
      (list) => list.id === sourceList.id
    );
    const overListIndex = lists.findIndex((list) => list.id === targetList.id);

    if (activeListIndex === overListIndex) {
      // Moving within the same list
      const oldIndex = sourceList.cards.findIndex(
        (card) => card.id === activeId
      );
      const overCard = targetList.cards.find((card) => card.id === overId);
      const newIndex = overCard
        ? targetList.cards.findIndex((card) => card.id === overId)
        : targetList.cards.length;

      if (oldIndex !== newIndex) {
        const newCards = arrayMove(sourceList.cards, oldIndex, newIndex);
        const newLists = [...lists];
        newLists[activeListIndex] = { ...sourceList, cards: newCards };
        setLists(newLists);
      }
    } else {
      // Moving to a different list
      const movedCard = sourceList.cards.find((card) => card.id === activeId);
      if (!movedCard) return;

      const newActiveCards = sourceList.cards.filter(
        (card) => card.id !== activeId
      );

      const overCard = targetList.cards.find((card) => card.id === overId);
      const insertIndex = overCard
        ? targetList.cards.findIndex((card) => card.id === overId)
        : targetList.cards.length;

      const newOverCards = [...targetList.cards];
      newOverCards.splice(insertIndex, 0, movedCard);

      const newLists = [...lists];
      newLists[activeListIndex] = { ...sourceList, cards: newActiveCards };
      newLists[overListIndex] = { ...targetList, cards: newOverCards };
      setLists(newLists);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveCard(null);
    setActiveList(null);

    if (!over) return;

    // Handle list reordering
    if (activeList) {
      const oldIndex = lists.findIndex((l) => l.id === active.id);
      const newIndex = lists.findIndex((l) => l.id === over.id);

      if (oldIndex !== newIndex) {
        const newOrder = arrayMove(lists, oldIndex, newIndex);
        setLists(newOrder);

        updateBoardListOrderMutation(
          { listId: String(active.id), position: newIndex + 1 },
          { onError: () => toast.error("Updating list position failed") }
        );
      }
      return;
    }

    // Handle card drop
    const sourceList = lists.find((list) =>
      list.cards.some((card) => card.id === active.id)
    );

    if (!sourceList) return;

    let targetList = lists.find((list) =>
      list.cards.some((card) => card.id === over.id)
    );

    if (!targetList) {
      const listId = String(over.id).replace("list-", "");
      targetList = lists.find((list) => String(list.id) === listId);
    }

    if (!targetList) return;

    const card = sourceList.cards.find((card) => card.id === active.id);
    if (!card) return;

    const targetCardIndex = targetList.cards.findIndex((c) => c.id === card.id);
    const newPosition = targetCardIndex + 1;

    const payload: UpdateCardPositionT = {
      boardId: user?.activeBoardId ?? "N/A",
      listId: String(targetList.id),
      position: newPosition,
    };
    updateCardPositionMutation(
      { payload: payload, cardId: String(card.id) },
      { onError: () => toast.error("Updating card position failed") }
    );

    console.log("Card moved:", {
      cardId: card.id,
      fromList: sourceList.id,
      toList: targetList.id,
      newPosition,
    });
  };

  const refetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user?.activeBoardId || lists.length === 0) return;

    const listChannel = supabase
      .channel(`board-list-${user.activeBoardId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "List",
          filter: `boardId=eq.${user.activeBoardId}`,
        },
        async (_payload) => {
          if (refetchTimeoutRef.current) {
            clearTimeout(refetchTimeoutRef.current);
          }

          refetchTimeoutRef.current = setTimeout(async () => {
            await refetchBoard();
          }, 300);
        }
      )
      .subscribe();

    const cardChannels = lists.map((list) =>
      supabase
        .channel(`card-${list.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "Card",
            filter: `listId=eq.${list.id}`,
          },
          async (_payload) => {
            if (refetchTimeoutRef.current) {
              clearTimeout(refetchTimeoutRef.current);
            }
            refetchTimeoutRef.current = setTimeout(async () => {
              await refetchBoard();
            }, 300);
          }
        )
        .subscribe()
    );

    return () => {
      if (refetchTimeoutRef.current) {
        clearTimeout(refetchTimeoutRef.current);
      }
      listChannel.unsubscribe();
      cardChannels.forEach((channel) => channel.unsubscribe());
    };
  }, [user?.activeBoardId, refetchBoard, lists]);

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Board name & board list */}
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2">
          <BoardListComboBox
            options={boardOptions}
            searchBoard={searchBoard}
            setSearchBoard={setSearchBoard}
            isSearching={isLoadingBoardList}
            isLoading={isLoadingBoardData || isLoadingBoardList}
          />
          <CreateBoardDialog
            isLoading={isLoadingBoardData || isLoadingBoardList}
          />
        </div>
        <div className="flex items-center gap-2">
          <AvatarStacked users={boardData?.data.members || []} />
          <AddMemberDialog />
        </div>
      </div>

      {/* Board */}
      {isLoadingBoardData ? (
        <BoardPageSkeleton />
      ) : !user?.activeBoardId ? (
        <p className="my-auto mx-auto">No Active board</p>
      ) : (
        <div className="flex-1 min-h-0">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={lists.map((l) => l.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="relative flex gap-1.5 overflow-x-auto h-full pb-2 p-2.5 shadow">
                {lists.map((list) => (
                  <SortableBoardList key={list.id} list={list} />
                ))}

                <AddBoardListDialog boardId={user.activeBoardId} />
              </div>
            </SortableContext>

            <DragOverlay>
              {activeCard ? (
                <TaskCard
                  props={activeCard}
                  projectTitle={user?.activeBoard?.title ?? "N/A"}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default BoardPage;
