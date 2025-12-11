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
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ListT } from "@/types/list";
import SortableBoardList from "./components/dnd/SortableBoardList";
import { useUpdateListPosition } from "@/hooks/listHooks";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/supabaseClient";

const BoardPage = () => {
  const { user } = useContext(AuthContext);
  const [searchBoard, setSearchBoard] = useState("");
  const debouncedSearch = useDebounce(searchBoard, 500);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = lists.findIndex((l) => l.id === active.id);
    const newIndex = lists.findIndex((l) => l.id === over.id);

    const newOrder = arrayMove(lists, oldIndex, newIndex);
    setLists(newOrder);

    //update order in database
    updateBoardListOrderMutation(
      { listId: String(active.id), position: newIndex + 1 },
      { onError: () => toast.error("Updating list position failed") }
    );
  };

  const refetchTimeoutRef = useRef<NodeJS.Timeout>(null);

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

          // Set new timeout - only refetch after 300ms of no more events
          refetchTimeoutRef.current = setTimeout(async () => {
            await refetchBoard();
          }, 300);
        }
      )
      .subscribe();

    // Subscribe to Card changes for each list
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
            collisionDetection={closestCenter}
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
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default BoardPage;
