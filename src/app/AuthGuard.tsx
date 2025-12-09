"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const PUBLIC_PATHS = ["/login"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // /login е публичен
    if (PUBLIC_PATHS.includes(pathname)) {
      setReady(true);
      return;
    }

    // проверяваме дали има локално "логнат" потребител
    const isLoggedIn =
      typeof window !== "undefined" &&
      localStorage.getItem("sevato_auth") === "ok";

    if (!isLoggedIn) {
      router.replace(`/login?from=${encodeURIComponent(pathname || "/")}`);
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) {
    // докато проверяваме -> нищо (или loader ако искаш)
    return null;
  }

  return <>{children}</>;
}
