"use client";

import { Check, ChevronsUpDown, SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth/AuthContext";

export type BoardListComboBoxProps = {
  options: {
    label: string;
    value: string;
  }[];
  searchBoard: string;
  setSearchBoard: React.Dispatch<React.SetStateAction<string>>;
  isSearching: boolean;
  isLoading: boolean;
};

const BoardListComboBox = ({
  options,
  searchBoard,
  setSearchBoard,
  isSearching,
  isLoading,
}: BoardListComboBoxProps) => {
  const { user, setUserAuth } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const selectedLabel =
    options.find((b) => b.value === user?.activeBoardId)?.label ||
    "Select board...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={isLoading} asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedLabel}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          {/* Search Input */}
          <div
            data-slot="command-input-wrapper"
            className="flex h-9 items-center gap-2 border-b px-3"
          >
            <SearchIcon className="size-4 shrink-0 opacity-50" />
            <input
              data-slot="command-input"
              placeholder="Search board"
              className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
              value={searchBoard}
              onChange={(e) => setSearchBoard(e.target.value)}
            />
          </div>

          {/* Board Options */}
          <CommandList>
            {isSearching ? (
              <CommandEmpty>Searching board...</CommandEmpty>
            ) : (
              <>
                <CommandEmpty>No board found.</CommandEmpty>
                <CommandGroup>
                  {options.map((b) => (
                    <CommandItem
                      key={b.value}
                      value={b.value}
                      onSelect={(currentValue) => {
                        setUserAuth((prev) =>
                          prev ? { ...prev, activeBoardId: currentValue } : null
                        );
                        setOpen(false);
                      }}
                    >
                      {b.label}
                      <Check
                        className={cn(
                          "ml-auto transition-opacity",
                          user?.activeBoardId === b.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default BoardListComboBox;
