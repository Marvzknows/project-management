import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteList } from "@/hooks/listHooks";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId: string;
};

const DeleteListDialog = ({ open, onOpenChange, listId }: Props) => {
  const { mutate, isPending } = useDeleteList();

  const handleDelete = () => {
    mutate(listId, {
      onSuccess: () => {
        toast.success("List successfully deleted");
        onOpenChange(false);
      },
      onError: () => toast.error("Deleting list failed"),
    });
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the list
            from the assigned project board.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            disabled={isPending}
            onClick={() => onOpenChange(false)}
            variant={"outline"}
          >
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={handleDelete}
            variant={"default"}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteListDialog;
