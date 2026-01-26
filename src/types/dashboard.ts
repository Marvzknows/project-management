export type DashboardHeaderT = {
  data: {
    boards: {
      id: string;
      title: string;
    }[];
    assigned_cards: number;
    created_cards: number;
    urgent_cards: number;
  };
};

export type DashboardPriorityDistributionT = {
  data: {
    priority: string;
    tasks: number;
    fill: string;
  }[];
};

export type DashboardTeamWorkloadT = {
  name: string;
  assigned: number;
  completed: number;
  in_progress: number;
  todo: number;
};
