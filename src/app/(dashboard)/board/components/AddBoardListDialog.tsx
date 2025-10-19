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
import { Plus } from "lucide-react";
import { useState } from "react";

const AddBoardListDialog = () => {
  const [listName, setListname] = useState("");
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className=" bg-green-600 hover:bg-green-700 text-white font-semibold sticky z-10 top-1 right-1"
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
                onChange={(e) => setListname(e.target.value)}
                defaultValue="Pending"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AddBoardListDialog;
