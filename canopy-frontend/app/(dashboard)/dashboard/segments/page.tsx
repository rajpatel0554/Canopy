import React from "react";
import { auth } from "@/auth";
import { segmentsApi } from "@/lib/api";
import SegmentsList from "./segments-list";
import type { Segment } from "@/types";

export default async function SegmentsPage() {
  const session = await auth();
  const token = session?.user ? (session.user as any).token : undefined;

  let segments: (Segment & { flagsCount?: number })[] = [];

  const fallbackSegments: (Segment & { flagsCount?: number })[] = [
    {
      segmentId: "s1",
      name: "Beta Testers",
      description: "Early access users group",
      rules: [
        { ruleId: "r1", segmentId: "s1", attribute: "email", operator: "CONTAINS", value: "@acme.com" },
        { ruleId: "r2", segmentId: "s1", attribute: "role", operator: "EQUALS", value: "beta" },
        { ruleId: "r3", segmentId: "s1", attribute: "id", operator: "STARTS_WITH", value: "usr_" }
      ],
      createdAt: new Date().toISOString(),
      flagsCount: 4,
    },
    {
      segmentId: "s2",
      name: "Premium Users",
      description: "Paying users cohort",
      rules: [
        { ruleId: "r4", segmentId: "s2", attribute: "plan", operator: "EQUALS", value: "premium" },
        { ruleId: "r5", segmentId: "s2", attribute: "billing", operator: "EQUALS", value: "active" }
      ],
      createdAt: new Date().toISOString(),
      flagsCount: 2,
    },
    {
      segmentId: "s3",
      name: "Internal Employees",
      description: "Canopy staff",
      rules: [
        { ruleId: "r6", segmentId: "s3", attribute: "email", operator: "ENDS_WITH", value: "@canopy.io" }
      ],
      createdAt: new Date().toISOString(),
      flagsCount: 6,
    },
  ];

  if (token) {
    try {
      const apiSegments = await segmentsApi.getAll(token);
      // Fetch detailed segments to load their rules list
      const detailedSegments = await Promise.all(
        apiSegments.map(async (seg) => {
          try {
            const detailed = await segmentsApi.getOne(seg.segmentId, token);
            return {
              ...detailed,
              flagsCount: detailed.flagsCount ?? 0,
            };
          } catch (err) {
            console.warn(`Failed to load details for segment ${seg.segmentId}`, err);
            return {
              ...seg,
              rules: [],
              flagsCount: seg.flagsCount ?? 0,
            };
          }
        })
      );
      segments = detailedSegments;
    } catch (err) {
      console.warn("Could not load segments from backend, using fallback data:", err);
      segments = fallbackSegments;
    }
  } else {
    segments = fallbackSegments;
  }

  return <SegmentsList initialSegments={segments} token={token} />;
}
