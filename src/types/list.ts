import { CardT } from "./card";

export type CreateListT = {
  boardId: string;
  title: string;
};

export type ListT = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  position: string;
  boardId: string;
  createdById: string;
  cards: CardT[];
};

export type UpdateListPositionT = {
  listId: string;
  position: number;
};

export type UpdateListTitleT = {
  listId: string;
  title: string;
};
