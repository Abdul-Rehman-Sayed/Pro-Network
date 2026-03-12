import axios from "axios";

export const baseURL = "https://pro-network-0xna.onrender.com";

export const clientServer = axios.create({
  baseURL: baseURL,
});
