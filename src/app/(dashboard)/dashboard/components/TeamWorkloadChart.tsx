"use client";

import { Users } from "lucide-react";
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
import { useState } from "react";
import { useGetDashboardTeamWorkload } from "@/hooks/dashboardHooks";
export type Props = {
  boards: {
    id: string;
    title: string;
  }[];
};

const chartConfig = {
  assigned: {
    label: "Assigned",
    color: "hsl(221, 83%, 53%)",
  },
  todo: {
    label: "To do",
    color: "hsl(25, 95%, 53%)",
  },
  in_progress: {
    label: "In Progress",
    color: "hsl(48, 96%, 53%)",
  },
  completed: {
    label: "Completed",
    color: "hsl(142, 76%, 36%)",
  },
} satisfies ChartConfig;

const TeamWorkloadChart = ({ boards }: Props) => {
  const [selectedBoard, setSelectedBoard] = useState("all");
  const { data: chartData, isLoading } =
    useGetDashboardTeamWorkload(selectedBoard);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Team Workload</CardTitle>
            <CardDescription>
              Current task assignments per member
            </CardDescription>
          </div>
          <Select
            disabled={isLoading}
            value={selectedBoard}
            onValueChange={setSelectedBoard}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select board" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"all"}>All Boards</SelectItem>
              {boards.map((board) => (
                <SelectItem key={board.id} value={board.id}>
                  {board.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={chartData?.data ?? []}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="assigned" fill="var(--color-assigned)" radius={4} />
            <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
            <Bar
              dataKey="in_progress"
              fill="var(--color-in_progress)"
              radius={4}
            />
            <Bar dataKey="todo" fill="var(--color-todo)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Workload is balanced across team <Users className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Bob has the most active tasks
        </div>
      </CardFooter>
    </Card>
  );
};

export default TeamWorkloadChart;
