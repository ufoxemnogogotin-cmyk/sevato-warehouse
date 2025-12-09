import type { Metadata } from "next";
import "./globals.css";
import AuthGuard from "./AuthGuard";

export const metadata: Metadata = {
  title: "SEVATO Warehouse",
  description: "Internal panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg">
      <body>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
