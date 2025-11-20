"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateList } from "@/hooks/listHooks";
import { CreateListT } from "@/types/list";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AddBoardListDialog = ({ boardId }: { boardId: string }) => {
  const [open, setOpen] = useState(false);
  const [listName, setListname] = useState("");
  const [error, setError] = useState("");
  const { mutate, isPending } = useCreateList();

  const handleSubmit = () => {
    if (!listName.trim()) {
      setError("List name is required.");
      return;
    }

    const payload: CreateListT = {
      boardId,
      title: listName,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("List created");
        setError("");
        setListname("");
        setOpen(false);
      },
      onError: () => toast.error("Create list failed"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={isPending}
          size="icon"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold sticky z-10 top-1 right-1"
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add board list</DialogTitle>
          <DialogDescription>
            Make changes to your new board list name here. Click add when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1">Name</Label>
            <Input
              id="name-1"
              name="name"
              value={listName}
              onChange={(e) => {
                setListname(e.target.value);
                if (error) setError("");
              }}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={isPending} variant="outline">
              Cancel
            </Button>
          </DialogClose>

          <Button disabled={isPending} onClick={handleSubmit}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBoardListDialog;
