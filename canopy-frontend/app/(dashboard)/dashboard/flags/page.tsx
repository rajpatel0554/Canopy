import React from "react";
import { auth } from "@/auth";
import { flagsApi, segmentsApi } from "@/lib/api";
import FlagsList from "./flags-list";
import type { Flag } from "@/types";

export default async function FlagsPage() {
  const session = await auth();
  const token = session?.user ? (session.user as any).token : undefined;

  let flags: Flag[] = [];
  let segmentsCount = 0;

  const fallbackFlags: Flag[] = [
    {
      flagId: "1",
      key: "new-checkout-flow",
      name: "New Checkout Flow",
      description: "Toggles checkout layout",
      variationType: "BOOLEAN",
      enabled: true,
      rolloutPercentage: 100,
      createdAt: new Date().toISOString(),
    },
    {
      flagId: "2",
      key: "dark-mode-beta",
      name: "Dark Mode Beta",
      description: "Controls the new dark color scheme rollout",
      variationType: "STRING",
      enabled: true,
      rolloutPercentage: 50,
      createdAt: new Date().toISOString(),
    },
    {
      flagId: "3",
      key: "legacy-dashboard",
      name: "Legacy Dashboard",
      description: "Keep legacy dashboard accessible",
      variationType: "BOOLEAN",
      enabled: false,
      rolloutPercentage: 0,
      createdAt: new Date().toISOString(),
    },
  ];

  if (token) {
    try {
      flags = await flagsApi.getAll(token);
    } catch (err) {
      console.warn("Could not load flags from backend, using fallback data:", err);
      flags = fallbackFlags;
    }

    try {
      const segments = await segmentsApi.getAll(token);
      segmentsCount = segments.length;
    } catch (err) {
      console.warn("Could not load segments for flags page stats:", err);
    }
  } else {
    flags = fallbackFlags;
    segmentsCount = 5; // fallback matching segments placeholder count
  }

  return <FlagsList initialFlags={flags} token={token} segmentsCount={segmentsCount} />;
}
