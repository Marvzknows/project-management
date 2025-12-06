import { ListT } from "./list";

export type UseBoardParamsT = {
  isAll?: boolean;
  search?: string;
  page?: number;
  per_page?: number;
};

export type MetaT = {
  total: number;
  per_page: number;
  page: number;
  total_pages: number;
};

export type BoardIsAllT = {
  data: {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
  }[];
  meta?: MetaT;
};

export type BoardUsersT = {
  id: string;
  image: string;
  name: string;
  email: string;
};

export type BoardOwnerT = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
  activeBoardId: string;
};

export type UserBoardDataT = {
  data: {
    title: string;
    List: ListT[];
    activeUsers: BoardUsersT[];
    members: BoardUsersT[];
    owner: BoardOwnerT;
  };
};

export type AddMemberPayloadT = {
  boardId: string;
  email: string;
};
