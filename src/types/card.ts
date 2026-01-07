export type CardT = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  listId: string;
  position: number;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
  priority: string;
  assignees: {
    id: string;
    name: string;
    email: string;
    image: string;
  }[];
  commentsCount: number;
};

type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export type ShowCardT = {
  data: {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    createdBy: User;
    assignees: User[];
    priority: string;
    comment: string[];
  };
};
