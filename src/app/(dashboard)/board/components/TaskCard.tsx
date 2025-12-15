import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PriorityBadge, { Priority } from "./PriorityBadge";
import { MessageCircleMore, Users } from "lucide-react";
import { CardT } from "@/types/card";

type Props = {
  props: CardT;
};
const TaskCard = ({ props }: Props) => {
  const {
    title,
    // description,
    // createdAt,
    // updatedAt,
    // listId,
    // position,
    // createdById,
    priority,
    assignees,
    commentsCount,
  } = props;
  console.log(props);
  return (
    <Card className="shadow-none rounded-lg">
      <CardHeader>
        <div className="flex justify-between items-center border-b pb-2">
          <p className="text-xs text-muted-foreground">Project title</p>
          <Avatar className="w-5 h-5 rounded-full">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback className="text-[10px]">CN</AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        <div className="flex justify-between items-center">
          <PriorityBadge priority={priority as Priority} />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 hover:text-slate-600 cursor-pointer">
              <MessageCircleMore className="w-4 h-4" />
              <span>{commentsCount}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-slate-600 cursor-pointer">
              <Users className="w-4 h-4" />
              <span>{assignees.length || 0}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
