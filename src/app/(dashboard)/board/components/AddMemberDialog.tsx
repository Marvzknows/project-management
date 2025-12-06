import { useContext, useState } from "react";
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
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAddBoardMember } from "@/hooks/boardHooks";
import { AddMemberPayloadT } from "@/types/board";
import { toast } from "sonner";
import { AuthContext } from "@/context/auth/AuthContext";

const AddMemberDialog = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { mutate, isPending } = useAddBoardMember();

  const handleSubmit = () => {
    if (!user?.activeBoardId) return;
    const payload: AddMemberPayloadT = {
      boardId: user?.activeBoardId,
      email,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("New member added");
        setOpen(false);
        setEmail("");
      },
      onError: () => toast.error("Adding new board member failed"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="rounded-full h-10 w-10 p-0"
          variant="outline"
          onClick={() => setOpen(true)}
        >
          <Plus />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add board member</DialogTitle>
          <DialogDescription>
            Add a member to your project board.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="member">Email</Label>
            <Input
              placeholder="Enter email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>

          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Adding..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
