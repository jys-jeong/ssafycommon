import React, { useEffect } from "react";
import { useAuthStore } from "@/store/auth";

export default function PersistAuth({ children }: { children: React.ReactNode }) {
  const { isBootstrapping, bootstrap } = useAuthStore();

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (isBootstrapping) return <div className="p-8">로딩 중…</div>;
  return <>{children}</>;
}
