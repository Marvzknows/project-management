import { apiClient } from "../apiClient";

export const getBoardApi = async (params = {}) => {
  return await apiClient.get("/board", params);
};
