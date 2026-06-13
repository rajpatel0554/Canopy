import React from "react";
import { auth } from "@/auth";
import AppShell from "@/components/app-shell";
import { Toaster } from "@/components/ui/sonner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <AppShell user={session?.user}>{children}</AppShell>
      <Toaster />
    </>
  );
}
