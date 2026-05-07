import axios from "axios";

export const api = axios.create({
  baseURL: "https://horta-back.onrender.com", // 🔥 URL DO BACKEND
  headers: {
    "Content-Type": "application/json",
  },
});