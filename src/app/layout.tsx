"use client"; // <<< ТРЯБВА ДА Е НА ПЪРВИЯ РЕД!

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

// Шрифтове
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SEVATO Warehouse",
  description: "Internal warehouse system",
};

// ----------------- AUTH GUARD -----------------
function Guard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isLogin = pathname === "/login";
    const auth = typeof window !== "undefined"
      ? localStorage.getItem("warehouse-auth")
      : null;

    console.log("GUARD RUN:", { pathname, auth });

    if (!auth && !isLogin) {
      router.replace(`/login?from=${encodeURIComponent(pathname || "/")}`);
    }
  }, [pathname, router]);

  return <>{children}</>;
}

// ----------------- ROOT LAYOUT -----------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: "#020617" }}
      >
        <Guard>{children}</Guard>
      </body>
    </html>
  );
}
