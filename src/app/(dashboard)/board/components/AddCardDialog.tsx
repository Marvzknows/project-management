"use client";

import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useBoardMembersList } from "@/hooks/boardHooks";
import { AuthContext } from "@/context/auth/AuthContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardFormDataT } from "@/lib/axios/api/cardApi";

type AddCardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId: string;
};

const AddCardDialog = ({ open, onOpenChange, listId }: AddCardDialogProps) => {
  const { user } = useContext(AuthContext);
  const { data, isLoading } = useBoardMembersList(user?.activeBoardId);
  const initialFormData: CardFormDataT = {
    boardId: "",
    title: "",
    listId: "",
    priority: "",
    assigneeIds: [],
  };
  const [formData, setFormData] = useState<CardFormDataT>(initialFormData);
  const [openPopover, setOpenPopover] = useState(false);

  const toggleAssignee = (userId: string) => {
    setFormData((prev) => {
      const exists = prev.assigneeIds.includes(userId);
      const updated = exists
        ? prev.assigneeIds.filter((id) => id !== userId)
        : [...prev.assigneeIds, userId];
      return { ...prev, assigneeIds: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.activeBoardId) return;

    const payload: CardFormDataT = {
      boardId: user.activeBoardId,
      title: formData.title,
      listId: listId,
      priority: formData.priority,
      assigneeIds: formData.assigneeIds,
    };

    console.log(payload);
  };

  useEffect(() => {
    setFormData(initialFormData);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] flex flex-col p-0">
        {/* Fixed Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Add New Card</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new card.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6">
          <div id="add-card-form" className="grid gap-4 pb-4">
            {/* Title */}
            <div className="grid gap-3">
              <Label htmlFor="title">Card Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter card title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, title: e.target.value }))
                }
              />
            </div>

            {/* Assignees (multi-select combobox) */}
            <div className="grid gap-3">
              <Label>Assignees</Label>
              <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      formData.assigneeIds.length === 0 &&
                        "text-muted-foreground"
                    )}
                    disabled={isLoading}
                  >
                    {formData.assigneeIds.length > 0
                      ? `${formData.assigneeIds.length} selected`
                      : "Select users..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search users..." />
                    <CommandEmpty>No user found.</CommandEmpty>
                    <CommandGroup>
                      {data?.data.length === 0 ? (
                        <CommandEmpty>No board member.</CommandEmpty>
                      ) : (
                        data?.data?.map((user) => (
                          <CommandItem
                            key={user.id}
                            onSelect={() => toggleAssignee(user.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.assigneeIds.includes(user.id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {user.name}
                          </CommandItem>
                        ))
                      )}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {formData.assigneeIds.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.assigneeIds.map((id) => {
                    const user = data?.data.find((u) => u.id === id);
                    return (
                      <span
                        key={id}
                        className="px-2 py-0.5 bg-secondary text-sm rounded-md"
                      >
                        {user?.name}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Priority */}
            <div className="grid gap-3">
              <Label htmlFor="priority">Priority</Label>

              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData((p) => ({ ...p, priority: value }))
                }
              >
                <SelectTrigger id="priority" className="w-[180px]">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <SimpleEditor />
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="px-6 py-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} type="button" form="add-card-form">
            Add Card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCardDialog;
