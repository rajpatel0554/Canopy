import React from "react";
import { auth } from "@/auth";
import SettingsClient from "./settings-client";

export default async function SettingsPage() {
  const session = await auth();
  const orgSlug = (((session?.user as any)?.tenantSlug || (session?.user as any)?.tenantId || "acme-corp") as string);
  const orgName = orgSlug
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const user = {
    name: session?.user?.name || "Canopy User",
    email: session?.user?.email || "user@canopy.io",
    role: (session?.user as any)?.role || "ADMIN"
  };

  return (
    <SettingsClient
      initialOrgName={orgName}
      initialOrgSlug={orgSlug}
      user={user}
      initialSection="organization"
      token={session?.user ? (session.user as any).token : undefined}
    />
  );
}
