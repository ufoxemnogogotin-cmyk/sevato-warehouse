"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isLogin = pathname === "/login";

    const auth =
      typeof window !== "undefined"
        ? localStorage.getItem("warehouse-auth")
        : null;

    if (!auth && !isLogin) {
      router.replace(`/login?from=${encodeURIComponent(pathname || "/")}`);
    }
  }, [pathname, router]);

  return <>{children}</>;
}
