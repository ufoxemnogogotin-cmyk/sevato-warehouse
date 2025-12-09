"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const STORAGE_KEY = "sevato_warehouse_auth";
const PASSWORD = process.env.NEXT_PUBLIC_WAREHOUSE_ADMIN_PASSWORD ?? "";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // /login е публичен
    if (pathname === "/login") {
      setReady(true);
      return;
    }

    if (typeof window === "undefined") return;

    const token = sessionStorage.getItem(STORAGE_KEY);

    if (!token || token !== PASSWORD) {
      router.replace(`/login?from=${encodeURIComponent(pathname || "/")}`);
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) return null;

  return <>{children}</>;
}
