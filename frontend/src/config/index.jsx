import axios from "axios";

export const baseURL = "http://localhost:8000";

export const clientServer = axios.create({
  baseURL: baseURL,
});
