"use client";

import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

type AddCardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId: string;
  users: { id: string; name: string }[];
};

const AddCardDialog = ({
  open,
  onOpenChange,
  listId,
  users,
}: AddCardDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigneeIds: [] as string[],
    priority: "",
  });

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

    alert(
      JSON.stringify({
        title: formData.title,
        description: formData.description,
        listId,
        assigneeIds: formData.assigneeIds,
        priority: formData.priority,
      })
    );

    console.log({
      title: formData.title,
      description: formData.description,
      listId,
      assigneeIds: formData.assigneeIds,
      priority: formData.priority,
    });
  };

  useEffect(() => {
    setFormData({
      title: "",
      description: "",
      assigneeIds: [] as string[],
      priority: "",
    });
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new card.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={handleSubmit}>
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

          {/* Description */}
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Optional description"
              className="min-h-24"
              value={formData.description}
              onChange={(e) =>
                setFormData((p) => ({ ...p, description: e.target.value }))
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
                    formData.assigneeIds.length === 0 && "text-muted-foreground"
                  )}
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
                    {users.map((user) => (
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
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {formData.assigneeIds.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.assigneeIds.map((id) => {
                  const user = users.find((u) => u.id === id);
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
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) =>
                setFormData((p) => ({ ...p, priority: e.target.value }))
              }
              className="border rounded-md px-3 py-2"
            >
              <option value="">Select priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add Card</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCardDialog;
