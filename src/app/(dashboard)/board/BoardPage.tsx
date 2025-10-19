"use client";

import React, { useState } from "react";
import BoardListComboBox from "./components/BoardListComboBox";
import AddMemberDialog from "./components/AddMemberDialog";
import AvatarStacked from "./components/AvatarStacked";
import BoardList from "./components/BoardList";

const BoardPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="p-4 h-full flex flex-col">
      {/* Board name & board list */}
      <div className="flex items-center justify-between border-b pb-2">
        <BoardListComboBox />
        <div className="flex items-center gap-2">
          <AvatarStacked />
          <AddMemberDialog isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 min-h-0">
        <div className="flex gap-1.5 overflow-x-auto h-full pb-2 p-2.5 shadow">
          {/* List */}
          <BoardList />
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
