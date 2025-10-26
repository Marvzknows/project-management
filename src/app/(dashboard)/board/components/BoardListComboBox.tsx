"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

const boards = [
  {
    value: "1",
    label: "Board One",
  },
  {
    value: "2",
    label: "Board Two",
  },
  {
    value: "3",
    label: "Board Three",
  },
  {
    value: "4",
    label: "Board Four",
  },
];

const BoardListComboBox = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? boards.find((b) => b.value === value)?.label
            : "Select board..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search board..." className="h-9" />
          <CommandList>
            <CommandEmpty>No board found.</CommandEmpty>
            <CommandGroup>
              {boards.map((b) => (
                <CommandItem
                  key={b.value}
                  value={b.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {b.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === b.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default BoardListComboBox;
