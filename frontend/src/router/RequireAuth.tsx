import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

export default function RequireAuth() {
  const { user, isBootstrapping } = useAuthStore();
  const location = useLocation();

  if (isBootstrapping) return <div className="p-8">세션 확인 중…</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return <Outlet />;
}
