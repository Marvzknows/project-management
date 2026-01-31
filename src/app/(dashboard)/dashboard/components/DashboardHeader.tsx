import React from "react";
import {
  LayoutDashboard,
  ListTodo,
  UserCheck,
  AlertCircle,
} from "lucide-react";

type StatsCardProps = {
  totalBoards: number;
  totalTasks: number;
  assignedTasks: number;
  urgentTasks: number;
  isLoading?: boolean;
};

const DashboardHeader = ({
  totalBoards = 0,
  totalTasks = 0,
  assignedTasks = 0,
  urgentTasks = 0,
  isLoading = false,
}: StatsCardProps) => {
  const stats = [
    {
      title: "Boards",
      value: totalBoards,
      hint: "Owned & joined",
      icon: LayoutDashboard,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Tasks",
      value: totalTasks,
      hint: "Cards you've created",
      icon: ListTodo,
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Assigned",
      value: assignedTasks,
      hint: "Your workload",
      icon: UserCheck,
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Urgent",
      value: urgentTasks,
      hint: "Needs attention",
      icon: AlertCircle,
      iconBg: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={`${stat.iconBg} p-2 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>

              {isLoading ? (
                <div className="mt-6 space-y-2">
                  <div className="h-8 w-20 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                </div>
              ) : (
                <div className="mt-6">
                  <div className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {stat.value}
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {stat.title}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">{stat.hint}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardHeader;
