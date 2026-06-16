import React from "react";
import { auth } from "@/auth";
import { flagsApi } from "@/lib/api";
import FlagDetailClient from "./flag-detail-client";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ key: string }>;
}

export default async function FlagDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const key = resolvedParams.key;

  const session = await auth();
  const token = session?.user ? (session.user as any).token : undefined;

  if (!token) {
    const mockFlag = {
      flagId: "mock-id",
      key: key,
      name: key.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      description: `Mock description for ${key}`,
      variationType: "BOOLEAN" as const,
      enabled: true,
      rolloutPercentage: 50,
      createdAt: new Date().toISOString()
    };
    return <FlagDetailClient initialFlag={mockFlag} token={token} />;
  }

  let flag;
  try {
    flag = await flagsApi.getOne(key, token);
  } catch (err) {
    console.error("Failed to load flag details:", err);
    return notFound();
  }

  return <FlagDetailClient initialFlag={flag} token={token} />;

}
