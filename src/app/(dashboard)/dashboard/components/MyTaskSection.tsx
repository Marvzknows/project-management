"use client";
import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  MoreVertical,
  Eye,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Priority configuration
const priorityConfig = {
  LOW: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    darkBg: "dark:bg-emerald-950/50",
    darkText: "dark:text-emerald-300",
  },
  MEDIUM: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    darkBg: "dark:bg-amber-950/50",
    darkText: "dark:text-amber-300",
  },
  HIGH: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    darkBg: "dark:bg-orange-950/50",
    darkText: "dark:text-orange-300",
  },
  URGENT: {
    bg: "bg-rose-100",
    text: "text-rose-800",
    darkBg: "dark:bg-rose-950/50",
    darkText: "dark:text-rose-300",
  },
};

// Mock data for demonstration
const mockTasks = [
  {
    id: "1",
    title: "Design new dashboard layout",
    priority: "HIGH",
    board: { title: "Design System", id: "b1" },
    list: { title: "In Progress", id: "l1" },
    createdBy: {
      name: "John Doe",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    createdAt: new Date("2024-01-05"),
    assignees: [
      {
        name: "Jane Smith",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      },
      {
        name: "Bob Wilson",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
      },
    ],
  },
  {
    id: "2",
    title: "Fix authentication bug in login flow",
    priority: "URGENT",
    board: { title: "Backend Development", id: "b2" },
    list: { title: "To Do", id: "l2" },
    createdBy: {
      name: "Sarah Connor",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    createdAt: new Date("2024-01-06"),
    assignees: [
      {
        name: "You",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
      },
    ],
  },
  {
    id: "3",
    title: "Update documentation for API endpoints",
    priority: "MEDIUM",
    board: { title: "Documentation", id: "b3" },
    list: { title: "Review", id: "l3" },
    createdBy: {
      name: "Mike Johnson",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    },
    createdAt: new Date("2024-01-04"),
    assignees: [
      {
        name: "Alice Brown",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      },
    ],
  },
  {
    id: "4",
    title: "Refactor user profile component",
    priority: "LOW",
    board: { title: "Frontend Refactor", id: "b4" },
    list: { title: "Backlog", id: "l4" },
    createdBy: {
      name: "Emma Davis",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    },
    createdAt: new Date("2024-01-03"),
    assignees: [
      {
        name: "You",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
      },
      {
        name: "Tom Hardy",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
      },
    ],
  },
  {
    id: "5",
    title: "Implement dark mode toggle",
    priority: "HIGH",
    board: { title: "UI Improvements", id: "b5" },
    list: { title: "In Progress", id: "l5" },
    createdBy: {
      name: "Chris Evans",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
    },
    createdAt: new Date("2024-01-07"),
    assignees: [
      {
        name: "You",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
      },
    ],
  },
];

type Task = (typeof mockTasks)[0];

type MyTasksSectionProps = {
  tasks?: Task[];
  isLoading?: boolean;
  onViewTask?: (taskId: string) => void;
  onViewBoard?: (boardId: string) => void;
};

export default function MyTasksSection({
  tasks = mockTasks,
  isLoading = false,
  onViewTask,
  onViewBoard,
}: MyTasksSectionProps) {
  const [filter, setFilter] = useState<"all" | "urgent" | "high">("all");

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "urgent") return task.priority === "URGENT";
    if (filter === "high")
      return task.priority === "HIGH" || task.priority === "URGENT";
    return true;
  });

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
        <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              My Tasks
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {filteredTasks.length}{" "}
              {filteredTasks.length === 1 ? "task" : "tasks"} assigned to you
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="text-xs"
          >
            All Tasks
          </Button>
          <Button
            variant={filter === "urgent" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("urgent")}
            className="text-xs"
          >
            Urgent
          </Button>
          <Button
            variant={filter === "high" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("high")}
            className="text-xs"
          >
            High Priority
          </Button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="divide-y divide-neutral-200 dark:divide-neutral-800 max-h-[600px] overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              No tasks found
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const config =
              priorityConfig[task.priority as keyof typeof priorityConfig];

            return (
              <div
                key={task.id}
                className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title & Priority */}
                    <div className="flex items-start gap-2 mb-2">
                      <h3 className="font-medium text-neutral-900 dark:text-neutral-100 line-clamp-1 flex-1">
                        {task.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={`${config.bg} ${config.text} ${config.darkBg} ${config.darkText} border-0 text-[10px] font-semibold uppercase px-2 py-0.5 flex-shrink-0`}
                      >
                        {task.priority}
                      </Badge>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                      <span className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        {task.board.title}
                      </span>
                      <span>•</span>
                      <span>{task.list.title}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(task.createdAt)}
                      </span>
                    </div>

                    {/* Footer: Assignees & Created By */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {task.assignees.slice(0, 3).map((assignee, idx) => (
                            <Avatar
                              key={idx}
                              className="h-6 w-6 border-2 border-white dark:border-neutral-900"
                            >
                              <AvatarImage
                                src={assignee.image}
                                alt={assignee.name}
                              />
                              <AvatarFallback className="text-[10px] bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {assignee.name[0]}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {task.assignees.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-neutral-200 dark:bg-neutral-700 border-2 border-white dark:border-neutral-900 flex items-center justify-center">
                              <span className="text-[10px] font-medium text-neutral-600 dark:text-neutral-400">
                                +{task.assignees.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          Created by {task.createdBy.name}
                        </span>
                      </div>

                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onViewTask?.(task.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onViewBoard?.(task.board.id)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Go to Board
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {filteredTasks.length > 0 && (
        <div className="border-t border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-neutral-800/50">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            View All Tasks →
          </Button>
        </div>
      )}
    </div>
  );
}
