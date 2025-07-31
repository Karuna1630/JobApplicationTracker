// src/Utils/axiosInstance.jsx
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // already has https://localhost:7047/
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

export default axiosInstance;
