import axios from "axios";

export const api = axios.create({
  baseURL: "https://mock.med4u.app",
  timeout: 12000,
  headers: {
    "Content-Type": "application/json",
  },
});
