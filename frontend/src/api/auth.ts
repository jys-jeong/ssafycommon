// src/api/auth.ts
import { api } from "./axios";

interface SignupPayload {
  email: string;
  password: string;
  name: string;
  nickname?: string;
  profile?: File | null;
  regions: { label: string; sido: string; sigungu: string; eupmyeondong: string; areaCode: string }[];
}

export async function signupRequest(data: SignupPayload) {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("name", data.name);
  if (data.nickname) formData.append("nickname", data.nickname);
  formData.append("regions", JSON.stringify(data.regions));
  if (data.profile) formData.append("profile", data.profile);

  const res = await api.post("/auth/signup", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data; // { user, accessToken }
}
