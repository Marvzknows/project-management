"use client";

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
import { Calendar, X, Edit2, Save, XCircle } from "lucide-react";
import { useShowCard, useUpdateCard } from "@/hooks/cardHooks";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { UpdateCardData } from "@/lib/axios/api/cardApi";
import { useEffect, useState } from "react";
import { parseDescription } from "@/lib/utils";

interface ShowTaskCardProps {
  cardId: string;
  trigger?: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  boardMembers?: Array<{
    id: string;
    name: string;
    email: string;
    image: string | null;
  }>;
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

export function ShowTaskCard({
  cardId,
  open,
  setOpen,
  boardMembers = [],
}: ShowTaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState<any>(null);
  const [editedPriority, setEditedPriority] = useState("");
  const [editedAssignees, setEditedAssignees] = useState<string[]>([]);

  const {
    data: card,
    isLoading: isLoadingShow,
    isError,
    refetch,
  } = useShowCard(cardId, open && !!cardId);

  const { mutate: updateCard, isPending } = useUpdateCard();

  const isLoading = isPending || isLoadingShow;
  // Initialize edit form when card data loads OR when entering edit mode
  useEffect(() => {
    if (card?.data) {
      setEditedTitle(card.data.title);
      setEditedDescription(parseDescription(card.data.description));
      setEditedPriority(card.data.priority);
      setEditedAssignees(card.data.assignees.map((a) => a.id));
    }
  }, [card?.data]);

  const handleSave = () => {
    if (!editedTitle.trim()) {
      toast.error("Title is required");
      return;
    }

    const payload: UpdateCardData = {
      title: editedTitle,
      description: editedDescription || "",
      priority: editedPriority,
      assignees: editedAssignees,
    };

    updateCard(
      { payload: payload, cardId: cardId },
      {
        onSuccess: () => {
          toast.success("Card updated");
          setIsEditing(false);
          refetch();
        },
        onError: (error) => {
          toast.error(error.message || "Updating card failed");
        },
      }
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
    if (card?.data) {
      setEditedTitle(card.data.title);
      setEditedDescription(
        card.data.description ? JSON.parse(card.data.description) : null
      );
      setEditedPriority(card.data.priority);
      setEditedAssignees(card.data.assignees.map((a) => a.id));
    }
  };

  const toggleAssignee = (userId: string) => {
    setEditedAssignees((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerContent className="fixed right-0 top-0 mt-0 h-screen w-screen rounded-none border-l dark:border-gray-800">
        <VisuallyHidden>
          <DrawerTitle>Task details</DrawerTitle>
        </VisuallyHidden>

        {/* Header with close button */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-950">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {isEditing ? "Edit Task" : "Task Details"}
          </h3>
          <div className="flex items-center gap-2">
            {!isEditing && card && (
              <>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this task?")) {
                      // Replace this with your actual delete mutation / API call
                      toast.success(`Task "${card.data.title}" deleted`);
                      setOpen(false); // close the drawer after deletion
                    }
                  }}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Delete
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="h-8 w-8 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />
            </div>
          ) : (
            card && (
              <div className="space-y-6">
                {/* Priority Badge/Select */}
                {isEditing ? (
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={editedPriority}
                      onValueChange={setEditedPriority}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
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
                )}

                {/* Title */}
                {isEditing ? (
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      placeholder="Enter task title"
                      className="text-lg font-semibold"
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100">
                      {card.data.title}
                    </h2>
                  </div>
                )}

                {/* Description */}
                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  {isEditing ? (
                    <SimpleEditor
                      key={`editor-edit-${cardId}-${card.data.description}`}
                      content={editedDescription}
                      onChange={setEditedDescription}
                      editable={true}
                    />
                  ) : card.data.description ? (
                    <SimpleEditor
                      key={`editor-view-${cardId}-${card.data.description}`}
                      content={parseDescription(card.data.description)}
                      onChange={() => {}}
                      editable={false}
                    />
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No description provided
                    </p>
                  )}
                </div>

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
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {isEditing ? "Assign to" : "Assigned to"}{" "}
                    {isEditing
                      ? `${editedAssignees.length} ${
                          editedAssignees.length === 1 ? "person" : "people"
                        }`
                      : `${card.data.assignees.length} ${
                          card.data.assignees.length === 1 ? "person" : "people"
                        }`}
                  </p>
                  {isEditing ? (
                    <div className="space-y-2">
                      {boardMembers.map((member) => (
                        <div
                          key={member.id}
                          onClick={() => toggleAssignee(member.id)}
                          className={`flex items-center gap-3 rounded-lg p-3 cursor-pointer transition-colors ${
                            editedAssignees.includes(member.id)
                              ? "bg-blue-50 ring-2 ring-blue-500 dark:bg-blue-950 dark:ring-blue-600"
                              : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800"
                          }`}
                        >
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={member.image || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-pink-600 text-xs font-semibold text-white">
                              {member.name?.[0]?.toUpperCase() ?? "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {member.name}
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {member.email}
                            </p>
                          </div>
                          {editedAssignees.includes(member.id) && (
                            <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                              <svg
                                className="h-3 w-3 text-white"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : card.data.assignees.length > 0 ? (
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
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No assignees
                    </p>
                  )}
                </div>

                {/* Metadata */}
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Created on{" "}
                      {new Date(card.data.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )
          )}

          {!isLoading && isError && (
            <div className="flex h-64 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/20">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Failed to load task details
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {card && (
          <DrawerFooter className="border-t bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
            {isEditing ? (
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isLoading}
                  className="flex-1 gap-2 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            ) : (
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="w-full dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Close
                </Button>
              </DrawerClose>
            )}
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
