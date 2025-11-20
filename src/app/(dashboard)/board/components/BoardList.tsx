"use client";

import { useState } from "react";
import { CirclePlus, MoreHorizontalIcon, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import TaskCard from "./TaskCard";
import AddCardDialog from "./AddCardDialog";
import { ListT } from "@/types/list";

type Props = {
  list: ListT;
};
const BoardList = ({ list }: Props) => {
  const [openAddCard, setOpenAddCard] = useState(false);
  const membersOptions = [
    { id: "1", name: "Marvin Lim" },
    { id: "2", name: "John Doe" },
  ];

  return (
    <div className="min-w-[380px] max-w-[380px] h-full flex-shrink-0 flex flex-col gap-2 p-2.5 rounded shadow border bg-secondary overflow-y-auto">
      <div className="flex items-center justify-between sticky top-0 bg-secondary z-10 pb-2">
        <h2 className="text-lg">{list.title}</h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="bg-transparent text-white hover:bg-transparent"
              aria-label="Open menu"
              size="icon-sm"
            >
              <MoreHorizontalIcon className="cursor-pointer text-black dark:text-white" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuItem
              className="text-green-500 hover:text-white cursor-pointer"
              onClick={() => setOpenAddCard(true)}
            >
              <CirclePlus className="text-green-500 hover:text-white" />
              Add card
            </DropdownMenuItem>

            <DropdownMenuItem className="text-blue-500 hover:text-white">
              <Pencil className="text-blue-500 hover:text-white" />
              Edit list
            </DropdownMenuItem>

            <DropdownMenuItem className="text-red-500 hover:text-white">
              <Trash className="text-red-500 hover:text-white" />
              Delete list
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Example task cards */}
      {list.cards.length === 0 ? (
        <p className="border rounded p-2 text-xs dark:bg-black bg-slate-100">
          No task found
        </p>
      ) : (
        <TaskCard priority={"NONE"} />
      )}
      {/* <TaskCard priority={"LOW"} />
      <TaskCard priority={"HIGH"} />
      <TaskCard priority={"URGENT"} />
      <TaskCard priority={"VERY HIGH"} /> */}

      <AddCardDialog
        open={openAddCard}
        onOpenChange={setOpenAddCard}
        listId={""}
        users={membersOptions}
      />
    </div>
  );
};

export default BoardList;
