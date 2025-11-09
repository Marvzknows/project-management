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
import { ChevronsUpDown, Plus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddMemberDialog = ({ isOpen, setIsOpen }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full h-10 w-10 p-0" variant="outline">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add board member</DialogTitle>
          <DialogDescription>
            Add member to your project board here. Click add when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label
              htmlFor="member"
              className="text-sm font-medium flex items-center gap-1"
            >
              Member Name
            </Label>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isOpen}
                  className="justify-between"
                >
                  Select user
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search user..."
                    className="h-9"
                    //   onValueChange={setSearch} // Update search state directly
                  />
                  <CommandList>
                    <CommandEmpty>No user found.</CommandEmpty>
                    <CommandGroup>
                      {/* {data?.data.users?.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.id}
                            onSelect={(currentValue) => {
                              setValue(
                                currentValue === value ? "" : currentValue
                              );
                              setOpen(false);
                            }}
                          >
                            {user.first_name} {user.last_name}
                            <Check
                              className={cn(
                                "ml-auto",
                                value === user.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))} */}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Add user</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
