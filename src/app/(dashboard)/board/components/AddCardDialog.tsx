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
import { useCreateCard } from "@/hooks/cardHooks";
import { toast } from "sonner";

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
    assignees: [],
    description: "",
  };
  const [formData, setFormData] = useState<CardFormDataT>(initialFormData);
  const [openPopover, setOpenPopover] = useState(false);
  const { mutate: createCard, isPending } = useCreateCard();

  const toggleAssignee = (userId: string) => {
    setFormData((prev) => {
      const exists = prev.assignees.includes(userId);
      const updated = exists
        ? prev.assignees.filter((id) => id !== userId)
        : [...prev.assignees, userId];
      return { ...prev, assignees: updated };
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
      assignees: formData.assignees,
      description: formData.description,
    };

    createCard(payload, {
      onSuccess: () => {
        toast.success("Card created");
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(error.message || "Creating card failed");
      },
    });
  };

  useEffect(() => {
    setFormData(initialFormData);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
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
                      formData.assignees.length === 0 && "text-muted-foreground"
                    )}
                    disabled={isLoading}
                  >
                    {formData.assignees.length > 0
                      ? `${formData.assignees.length} selected`
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
                                formData.assignees.includes(user.id)
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
              {formData.assignees.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.assignees.map((id) => {
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
              <SimpleEditor
                content={formData.description}
                onChange={(content) =>
                  setFormData((p) => ({ ...p, description: content }))
                }
                editable={true}
              />
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="px-6 py-4 border-t">
          <DialogClose asChild>
            <Button disabled={isPending} variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={isPending}
            onClick={handleSubmit}
            type="button"
            form="add-card-form"
          >
            {isPending ? "Adding Card..." : "Add Card"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCardDialog;
