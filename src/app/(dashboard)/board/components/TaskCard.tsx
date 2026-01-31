"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import PriorityBadge, { Priority } from "./PriorityBadge";
import { MessageCircleMore } from "lucide-react";
import { CardT } from "@/types/card";
import { motion } from "framer-motion";
import { formatDateTime } from "@/lib/utils";
import TaskCardAssignees from "./TaskCardAssignees";
import { ShowTaskCard } from "./ShowTaskCard";
import { useState } from "react";

type Props = {
  props: CardT;
  projectTitle: string;
};

type CardStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

const statusConfig: Record<
  CardStatus,
  { label: string; variant: string; className: string }
> = {
  TODO: {
    label: "To Do",
    variant: "secondary",
    className: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  },
  IN_PROGRESS: {
    label: "In Progress",
    variant: "default",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
  COMPLETED: {
    label: "Completed",
    variant: "default",
    className: "bg-green-100 text-green-700 hover:bg-green-100",
  },
};

export default function TaskCard({ props, projectTitle }: Props) {
  const [open, setOpen] = useState(false);
  const {
    id,
    title,
    priority,
    assignees,
    commentsCount,
    createdBy,
    createdAt,
    status,
  } = props;

  const handleOnClickCard = () => {
    setOpen(true);
  };

  const statusInfo = statusConfig[status as CardStatus] || statusConfig.TODO;

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.015 }}
        transition={{ duration: 0.15 }}
        onClick={handleOnClickCard}
      >
        <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 flex-1">
                <p className="text-[11px] text-muted-foreground truncate">
                  {projectTitle}
                </p>
                <h3 className="text-sm font-medium leading-tight line-clamp-2">
                  {title}
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Created {formatDateTime(createdAt)}
                </p>
              </div>

              <Avatar className="h-6 w-6 flex-shrink-0">
                <AvatarImage
                  src={createdBy.image ?? "https://github.com/shadcn.png"}
                />
                <AvatarFallback className="text-[10px]">
                  {createdBy.name?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <PriorityBadge priority={priority as Priority} />
                <Badge
                  className={`text-xs font-medium rounded-sm px-2 py-0.5 leading-tight ${statusInfo.className}`}
                >
                  {statusInfo.label}
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageCircleMore className="h-4 w-4" />
                  <span>{commentsCount}</span>
                </div>
                <TaskCardAssignees
                  assignees={assignees}
                  cardId={id}
                  cardTitle={title}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <ShowTaskCard cardId={id} open={open} setOpen={setOpen} />
    </>
  );
}
