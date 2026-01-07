"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCreateBoard } from "@/hooks/boardHooks";
import { toast } from "sonner";

type Props = {
  isLoading: boolean;
};
const CreateBoardDialog = ({ isLoading }: Props) => {
  const [open, setOpen] = React.useState(false);
  const { mutate, isPending } = useCreateBoard();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ title: string }>({
    defaultValues: { title: "" },
  });

  const onSubmit = (data: { title: string }) => {
    mutate(data.title, {
      onSuccess: () => {
        reset();
        setOpen(false);
        toast.success("Board created");
      },
      onError: () => toast.error("Creating board failed"),
    });
  };

  React.useEffect(() => {
    reset();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger disabled={isLoading || isPending} asChild>
        <Button>Create Board</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Board Title</Label>
            <Input
              id="title"
              placeholder="Enter board title"
              {...register("title", { required: "Board title is required" })}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading || isPending}
            >
              Cancel
            </Button>
            <Button disabled={isLoading || isPending} type="submit">
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoardDialog;
