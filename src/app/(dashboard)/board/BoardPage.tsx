"use client";

import React, { useMemo, useState } from "react";
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

const BoardPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchBoard, setSearchBoard] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("");
  const debouncedSearch = useDebounce(searchBoard, 500);

  // #region API
  const {
    data: boardListData,
    isLoading: isLoadingBoardList,
    isError: isErrorBoardList,
  } = useBoardList({ isAll: true, search: debouncedSearch });

  const {
    data: _boardData,
    isLoading: isLoadingBoardData,
    isError: isErrorBoardData,
  } = useBoard(selectedBoard);
  // #endregion

  const boardOptions = useMemo(() => {
    return (
      boardListData?.data.map((b) => ({
        label: b.title,
        value: b.id,
      })) ?? []
    );
  }, [boardListData]);

  if (isLoadingBoardData) return <BoardPageSkeleton />;

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
            selectedBoard={selectedBoard}
            setSelectedBoard={setSelectedBoard}
          />
          <CreateBoardDialog />
        </div>
        <div className="flex items-center gap-2">
          <AvatarStacked />
          <AddMemberDialog isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 min-h-0">
        <div className="relative flex gap-1.5 overflow-x-auto h-full pb-2 p-2.5 shadow">
          {/* List */}
          <BoardList />
          <BoardList />
          <AddBoardListDialog />
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
