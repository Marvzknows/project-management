"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "A priority distribution bar chart";
export type Props = {
  boards: {
    id: string;
    title: string;
  }[];
};
// Mock data per board - replace with actual data
const boardData = {
  all: [
    { priority: "Low", tasks: 23, fill: "hsl(142, 76%, 36%)" },
    { priority: "Medium", tasks: 45, fill: "hsl(48, 96%, 53%)" },
    { priority: "High", tasks: 32, fill: "hsl(25, 95%, 53%)" },
    { priority: "Urgent", tasks: 12, fill: "hsl(0, 84%, 60%)" },
  ],
  "1": [
    { priority: "Low", tasks: 8, fill: "hsl(142, 76%, 36%)" },
    { priority: "Medium", tasks: 15, fill: "hsl(48, 96%, 53%)" },
    { priority: "High", tasks: 12, fill: "hsl(25, 95%, 53%)" },
    { priority: "Urgent", tasks: 5, fill: "hsl(0, 84%, 60%)" },
  ],
  "2": [
    { priority: "Low", tasks: 10, fill: "hsl(142, 76%, 36%)" },
    { priority: "Medium", tasks: 18, fill: "hsl(48, 96%, 53%)" },
    { priority: "High", tasks: 8, fill: "hsl(25, 95%, 53%)" },
    { priority: "Urgent", tasks: 3, fill: "hsl(0, 84%, 60%)" },
  ],
  "3": [
    { priority: "Low", tasks: 5, fill: "hsl(142, 76%, 36%)" },
    { priority: "Medium", tasks: 12, fill: "hsl(48, 96%, 53%)" },
    { priority: "High", tasks: 12, fill: "hsl(25, 95%, 53%)" },
    { priority: "Urgent", tasks: 4, fill: "hsl(0, 84%, 60%)" },
  ],
};

const chartConfig = {
  tasks: {
    label: "Tasks",
  },
  low: {
    label: "Low",
    color: "hsl(142, 76%, 36%)",
  },
  medium: {
    label: "Medium",
    color: "hsl(48, 96%, 53%)",
  },
  high: {
    label: "High",
    color: "hsl(25, 95%, 53%)",
  },
  urgent: {
    label: "Urgent",
    color: "hsl(0, 84%, 60%)",
  },
} satisfies ChartConfig;

const PriorityDistributionChart = ({ boards }: Props) => {
  const [selectedBoard, setSelectedBoard] = useState(" ");
  const chartData = boardData[selectedBoard as keyof typeof boardData];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Priority Distribution</CardTitle>
            <CardDescription>Task breakdown by priority level</CardDescription>
          </div>
          <Select value={selectedBoard} onValueChange={setSelectedBoard}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select board" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={" "}>All Boards</SelectItem>
              {boards.map((board) => (
                <SelectItem key={board.id} value={board.id}>
                  {board.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="priority"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="tasks" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Most tasks are medium priority <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          {selectedBoard === "all"
            ? "Showing all tasks across all boards"
            : `Showing tasks for ${
                boards.find((b) => b.id === selectedBoard)?.title
              }`}
        </div>
      </CardFooter>
    </Card>
  );
};
export default PriorityDistributionChart;
