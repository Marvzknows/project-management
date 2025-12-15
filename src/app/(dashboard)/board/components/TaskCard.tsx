import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PriorityBadge, { Priority } from "./PriorityBadge";
import { MessageCircleMore, Users } from "lucide-react";
import { CardT } from "@/types/card";
import { motion } from "framer-motion";

type Props = {
  props: CardT;
  projectTitle: string;
};

export default function TaskCard({ props, projectTitle }: Props) {
  const { title, priority, assignees, commentsCount, createdBy } = props;

  return (
    <motion.div whileHover={{ scale: 1.015 }} transition={{ duration: 0.15 }}>
      <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <p className="text-[11px] text-muted-foreground truncate">
                {projectTitle}
              </p>
              <h3 className="text-sm font-medium leading-tight line-clamp-2">
                {title}
              </h3>
            </div>

            <Avatar className="h-6 w-6">
              <AvatarImage
                src={createdBy.image ?? "https://github.com/shadcn.png"}
              />
              <AvatarFallback className="text-[10px]">
                {createdBy.name?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <PriorityBadge priority={priority as Priority} />

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageCircleMore className="h-4 w-4" />
                <span>{commentsCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{assignees.length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
