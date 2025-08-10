// src/api/axios.ts
import axios from "axios";
import { useAuthStore } from "@/store/auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // .env에서 API 주소 관리
  withCredentials: true, // refreshToken 쿠키 쓰는 경우
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
