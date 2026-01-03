import axios from "axios";

const baseUrl = "/api";

export const apiClient = axios.create({
  baseURL: baseUrl,
});

export default apiClient;
