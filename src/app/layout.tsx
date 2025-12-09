import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

// ----------------------------
// CLIENT-SIDE AUTH GUARD
// ----------------------------
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

function Guard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // login страницата е публична
    if (pathname === "/login") return;

    // проверка за localStorage ключа
    const ok = localStorage.getItem("warehouse-auth");

    if (!ok) {
      router.replace(`/login?from=${encodeURIComponent(pathname ?? "/")}`);
    }
  }, [router, pathname]);

  return <>{children}</>;
}

// ----------------------------
// ROOT LAYOUT
// ----------------------------
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
