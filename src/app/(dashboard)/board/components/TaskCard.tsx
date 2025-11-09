import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PriorityBadge, { Priority } from "./PriorityBadge";
import { MessageCircleMore, Users } from "lucide-react";

type Props = {
  priority: Priority;
};
const TaskCard = ({ priority }: Props) => {
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
        <CardTitle className="text-sm">Task title</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        <div className="flex justify-between items-center">
          <PriorityBadge priority={priority} />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 hover:text-slate-600 cursor-pointer">
              <MessageCircleMore className="w-4 h-4" />
              <span>3</span>
            </div>
            <div className="flex items-center gap-1 hover:text-slate-600 cursor-pointer">
              <Users className="w-4 h-4" />
              <span>3</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
