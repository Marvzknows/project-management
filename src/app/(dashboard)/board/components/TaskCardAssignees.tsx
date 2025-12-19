"use client";

import { CardT } from "@/types/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, Users, X } from "lucide-react";
import { useContext, useState } from "react";
import { useAddCardAssignee } from "@/hooks/cardHooks";
import { toast } from "sonner";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/tiptap-utils";
import { useBoard } from "@/hooks/boardHooks";
import { AuthContext } from "@/context/auth/AuthContext";
import { BoardUsersT } from "@/types/board";

type Props = {
  assignees: CardT["assignees"];
  cardId: string;
  cardTitle: string;
};

export default function TaskCardAssignees({
  cardTitle,
  assignees,
  cardId,
}: Props) {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<BoardUsersT | null>(null);

  const { data: boardData, isLoading: isLoadingBoardData } = useBoard(
    user?.activeBoardId
  );

  const { mutate, isPending } = useAddCardAssignee();
  const isLoading = isLoadingBoardData || isPending;

  const handleAddAssignee = () => {
    if (!selectedUser) return;
    mutate(
      { cardId, assigneeId: selectedUser.id },
      {
        onSuccess: () => {
          toast.success("New assignee added");
          setOpen(false);
          setSelectedUser(null);
        },
        onError: () => toast.error("Adding card assignee failed"),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer hover:text-slate-300">
          <Users className="h-4 w-4" />
          <span>{assignees.length}</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px] overflow-visible">
        <DialogHeader>
          <DialogTitle>Assignees</DialogTitle>
          <p className="text-sm text-muted-foreground truncate">{cardTitle}</p>
        </DialogHeader>

        {/* Assigned Users */}
        <div className="space-y-3">
          <Label className="text-xs text-muted-foreground">
            Assigned users
          </Label>

          {assignees.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              No assignees yet
            </p>
          ) : (
            <div className="space-y-2">
              {assignees.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.image ?? undefined} />
                      <AvatarFallback className="text-[10px]">
                        {user.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-xs">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Assignee */}
        <div className="space-y-2 pt-4 border-t">
          <Label className="text-xs text-muted-foreground">Add assignee</Label>

          <div className="grid grid-cols-[4fr_1fr] gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={isLoading}
                  className="w-full justify-between h-9"
                >
                  {selectedUser ? (
                    <span className="flex items-center gap-2 truncate">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={selectedUser.image ?? undefined} />
                        <AvatarFallback className="text-[9px]">
                          {selectedUser.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{selectedUser.name}</span>
                    </span>
                  ) : (
                    "Select member..."
                  )}
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0 w-[300px] z-[9999]" align="start">
                <Command>
                  <CommandInput placeholder="Search member..." />
                  <CommandEmpty>No member found.</CommandEmpty>
                  {boardData?.data.members.length !== 0 && (
                    <CommandGroup>
                      {boardData?.data.members.map((member) => {
                        const isAlreadyAssigned = assignees.some(
                          (a) => a.id === member.id
                        );
                        return (
                          <CommandItem
                            key={member.id}
                            onSelect={() => setSelectedUser(member)}
                            disabled={isAlreadyAssigned}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={member.image ?? undefined} />
                                <AvatarFallback className="text-[10px]">
                                  {member.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-xs">
                                <p className="font-medium">{member.name}</p>
                                <p className="text-muted-foreground">
                                  {member.email}
                                </p>
                              </div>
                            </div>

                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedUser?.id === member.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  )}
                </Command>
              </PopoverContent>
            </Popover>

            <Button
              disabled={!selectedUser || isLoading}
              onClick={handleAddAssignee}
              className="h-9"
            >
              Add
            </Button>
          </div>
        </div>

        <Button
          disabled={isLoading}
          onClick={() => setOpen(false)}
          variant="outline"
          className="mt-4 w-full"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
