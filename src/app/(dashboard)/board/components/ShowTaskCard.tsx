"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, X } from "lucide-react";
import { useShowCard } from "@/hooks/cardHooks";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ShowTaskCardProps {
  cardId: string;
  trigger?: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const priorityConfig: Record<
  string,
  { bg: string; text: string; darkBg: string; darkText: string }
> = {
  LOW: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    darkBg: "dark:bg-emerald-950",
    darkText: "dark:text-emerald-300",
  },
  MEDIUM: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    darkBg: "dark:bg-amber-950",
    darkText: "dark:text-amber-300",
  },
  HIGH: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    darkBg: "dark:bg-orange-950",
    darkText: "dark:text-orange-300",
  },
  URGENT: {
    bg: "bg-rose-100",
    text: "text-rose-800",
    darkBg: "dark:bg-rose-950",
    darkText: "dark:text-rose-300",
  },
};

export function ShowTaskCard({ cardId, open, setOpen }: ShowTaskCardProps) {
  const {
    data: card,
    isLoading,
    isError,
  } = useShowCard(cardId, open && !!cardId);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerContent className="fixed right-0 top-0 mt-0 h-screen w-screen rounded-none border-l dark:border-gray-800">
        <VisuallyHidden>
          <DrawerTitle>Task details</DrawerTitle>
        </VisuallyHidden>

        {/* Header with close button */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-950">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Task Details
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="h-8 w-8 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isLoading && (
            <div className="flex h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />
            </div>
          )}

          {isError && (
            <div className="flex h-64 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/20">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Failed to load task details
              </p>
            </div>
          )}

          {card && (
            <div className="space-y-6">
              {/* Priority Badge */}
              <div className="flex justify-start">
                <Badge
                  variant="secondary"
                  className={`${priorityConfig[card.data.priority]?.bg} ${
                    priorityConfig[card.data.priority]?.text
                  } ${priorityConfig[card.data.priority]?.darkBg} ${
                    priorityConfig[card.data.priority]?.darkText
                  } border-0 px-3 py-1 text-xs font-semibold uppercase tracking-wide`}
                >
                  {card.data.priority}
                </Badge>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100">
                  {card.data.title}
                </h2>
              </div>

              {/* Description */}
              {card.data.description && (
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {card.data.description}
                  </p>
                </div>
              )}

              {/* Creator Info */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Created By
                </p>
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
                  <Avatar className="h-12 w-12 ring-2 ring-white dark:ring-gray-800">
                    <AvatarImage src={card.data.createdBy.image || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
                      {card.data.createdBy.name?.[0]?.toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {card.data.createdBy.name ?? "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                      {card.data.createdBy.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Assignees */}
              {card.data.assignees.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Assigned to {card.data.assignees.length}{" "}
                    {card.data.assignees.length === 1 ? "person" : "people"}
                  </p>
                  <div className="space-y-2">
                    {card.data.assignees.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800"
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.image || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-pink-600 text-xs font-semibold text-white">
                            {user.name?.[0]?.toUpperCase() ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Created on{" "}
                    {new Date(card.data.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {card && (
          <DrawerFooter className="border-t bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="w-full dark:border-gray-700 dark:hover:bg-gray-800"
              >
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
