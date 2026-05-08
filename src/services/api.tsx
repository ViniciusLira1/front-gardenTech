import axios from "axios";

// Backend hospedado no Render.com — https://horta-back.onrender.com
export const api = axios.create({
  baseURL: "https://horta-back.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});