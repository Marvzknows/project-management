"use client";

import React, { useState } from "react";
import BoardListComboBox from "./components/BoardListComboBox";
import AddMemberDialog from "./components/AddMemberDialog";
import AvatarStacked from "./components/AvatarStacked";

const Board = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="p-4 h-full flex flex-col border border-red-500">
      {/* Board name & board list */}
      <div className="flex items-center justify-between border-b pb-2">
        <BoardListComboBox />
        <div className="flex items-center gap-2">
          <AvatarStacked />
          <AddMemberDialog isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
    </div>
  );
};

export default Board;
