"use client";

import { useState } from "react";
import {
  CirclePlus,
  GripVertical,
  MoreHorizontalIcon,
  Pencil,
  Trash,
} from "lucide-react";
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
import EditListTitleDialog from "./EditListTitleDialog";
import DeleteListDialog from "./DeleteListDialog";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

type Props = {
  list: ListT;
  dragHandleListeners?: SyntheticListenerMap;
};

const BoardList = ({ list, dragHandleListeners }: Props) => {
  const [openAddCard, setOpenAddCard] = useState(false);
  const [openEditListTitle, setOpenEditListTitle] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <div className="min-w-[380px] max-w-[380px] h-full flex-shrink-0 flex flex-col gap-2 p-2.5 rounded shadow border bg-secondary overflow-y-auto">
      <div className="flex items-center justify-between sticky top-0 bg-secondary z-10 pb-2">
        {/* Drag Handle */}
        <div className="flex items-center gap-2">
          <div
            {...dragHandleListeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
          >
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </div>
          <h2 className="text-lg">{list.title}</h2>
        </div>

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

            <DropdownMenuItem
              className="text-blue-500 hover:text-white"
              onClick={() => setOpenEditListTitle(true)}
            >
              <Pencil className="text-blue-500 hover:text-white" />
              Edit list
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-red-500 hover:text-white"
              onClick={() => setOpenDelete(true)}
            >
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
        list.cards.map((a) => <TaskCard key={a.id} priority={a.priority} />)
      )}

      <AddCardDialog
        open={openAddCard}
        onOpenChange={setOpenAddCard}
        listId={list.id}
      />

      <EditListTitleDialog
        open={openEditListTitle}
        onOpenChange={setOpenEditListTitle}
        currentTitle={list.title}
        listId={list.id}
      />

      <DeleteListDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        listId={list.id}
      />
    </div>
  );
};

export default BoardList;
