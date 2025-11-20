"use client";

import React, { useContext, useMemo, useState } from "react";
import BoardListComboBox from "./components/BoardListComboBox";
import AddMemberDialog from "./components/AddMemberDialog";
import AvatarStacked from "./components/AvatarStacked";
import BoardList from "./components/BoardList";
import AddBoardListDialog from "./components/AddBoardListDialog";
import CreateBoardDialog from "./components/CreateBoardDialog";
import { useBoard, useBoardList } from "@/hooks/boardHooks";
import FullPageError from "@/components/FullPageError";
import BoardPageSkeleton from "./components/BoardPageSkeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { AuthContext } from "@/context/auth/AuthContext";

const BoardPage = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
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
  } = useBoard(user?.activeBoardId);
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
          <AvatarStacked />
          <AddMemberDialog isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>

      {/* Board */}
      {isLoadingBoardData ? (
        <BoardPageSkeleton />
      ) : !user?.activeBoardId ? (
        <p className="my-auto mx-auto">No Active board</p>
      ) : (
        <div className="flex-1 min-h-0">
          <div className="relative flex gap-1.5 overflow-x-auto h-full pb-2 p-2.5 shadow">
            {/* List */}
            {boardData?.data.List.map((list) => (
              <BoardList key={list.id} />
            ))}
            <AddBoardListDialog boardId={user.activeBoardId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardPage;
