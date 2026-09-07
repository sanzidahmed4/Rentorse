import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Back-Office — Apartmento",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {children}
    </div>
  );
}
