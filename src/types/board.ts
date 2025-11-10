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
