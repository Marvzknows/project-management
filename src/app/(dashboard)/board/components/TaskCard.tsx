import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const TaskCard = () => {
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
        Created: June 28 2001
      </CardContent>
    </Card>
  );
};

export default TaskCard;
