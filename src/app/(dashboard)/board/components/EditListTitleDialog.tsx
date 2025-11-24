"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateListTitle } from "@/hooks/listHooks";
import { toast } from "sonner";

type EditListTitleDialogProps = {
  listId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTitle: string;
};

const EditListTitleDialog = ({
  listId,
  open,
  onOpenChange,
  currentTitle,
}: EditListTitleDialogProps) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const { mutate, isPending } = useUpdateListTitle();

  useEffect(() => {
    setError("");
    setTitle(currentTitle);
  }, [open]);

  const validateTitle = (value: string): string => {
    if (!value.trim()) {
      return "List title is required";
    }
    if (value.trim().length < 3) {
      return "List title must be at least 3 characters";
    }
    if (value.trim().length > 50) {
      return "List title must not exceed 50 characters";
    }
    return "";
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (error) {
      setError("");
    }
  };

  const handleSave = () => {
    const validationError = validateTitle(title);

    if (validationError) {
      setError(validationError);
      return;
    }

    mutate(
      {
        listId: listId,
        title: title,
      },
      {
        onSuccess: () => {
          toast.success("Update list title successfully");
          onOpenChange(false);
        },
        onError: () => toast.error("Updating list title failed"),
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit List Title</DialogTitle>
          <DialogDescription>
            Make changes to your list title here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">List Title</Label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter list title"
              className={
                error ? "border-red-500 focus-visible:ring-red-500" : ""
              }
              autoFocus
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button disabled={isPending} type="button" onClick={handleSave}>
            {isPending ? "Saving... " : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditListTitleDialog;
