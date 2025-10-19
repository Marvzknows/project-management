import { CirclePlus, MoreHorizontalIcon, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import TaskCard from "./TaskCard";

const BoardList = () => {
  return (
    <div className="min-w-[280px] max-w-[280px] h-full flex-shrink-0 flex flex-col gap-2 p-2.5 rounded shadow border bg-secondary overflow-y-auto">
      <div className="flex items-center justify-between sticky top-0 bg-secondary z-10 pb-2">
        <h2 className="text-lg">List Name</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="bg-transparent text-white hover:bg-transparent"
              aria-label="Open menu"
              size="icon-sm"
            >
              <MoreHorizontalIcon className="cursor-pointer" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuItem className="text-green-500 hover:text-white">
              <CirclePlus className="text-green-500 hover:text-white" />
              Add Card
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500 hover:text-white">
              <Trash className="text-red-500 hover:text-white" />
              Delete Card
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Task Cards */}
      <TaskCard />
    </div>
  );
};

export default BoardList;
