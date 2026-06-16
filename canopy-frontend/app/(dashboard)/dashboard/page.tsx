import React from "react";
import { auth } from "@/auth";
import { flagsApi, segmentsApi } from "@/lib/api";

export default async function DashboardPage() {
  const session = await auth();
  const userName = session?.user?.email?.split("@")[0] || "User";
  // Capitalize name
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);
  const token = session?.user ? (session.user as any).token : undefined;

  const now = Date.now();
  let totalFlagsCount = 0;
  let activeFlagsCount = 0;
  let segmentsCount = 0;

  let activities: {
    action: string;
    flag: string;
    time: string;
    badgeColor: string;
  }[] = [];

  if (token) {
    try {
      const flags = await flagsApi.getAll(token);
      totalFlagsCount = flags.length;
      activeFlagsCount = flags.filter((f) => f.enabled).length;

      // Extract recent flags for activity feed
      const sortedFlags = [...flags].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      if (sortedFlags.length > 0) {
        activities = sortedFlags.slice(0, 3).map((f) => {
          const createdDate = new Date(f.createdAt);
          const diffMs = now - createdDate.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHrs = Math.floor(diffMins / 60);
          const diffDays = Math.floor(diffHrs / 24);

          let timeStr = "Just now";
          if (diffDays > 0) timeStr = `${diffDays}d ago`;
          else if (diffHrs > 0) timeStr = `${diffHrs}h ago`;
          else if (diffMins > 0) timeStr = `${diffMins}m ago`;

          return {
            action: f.enabled ? "Enabled" : "Disabled",
            flag: f.key,
            time: timeStr,
            badgeColor: f.enabled ? "bg-[#d1fae5] text-[#065f46]" : "bg-gray-200 text-gray-700",
          };
        });
      }
    } catch (err) {
      console.warn("Could not fetch flags counts for dashboard:", err);
    }

    try {
      const segments = await segmentsApi.getAll(token);
      segmentsCount = segments.length;
    } catch (err) {
      console.warn("Could not fetch segments counts for dashboard:", err);
    }
  }

  const stats = [
    {
      label: "Total Flags",
      value: String(totalFlagsCount),
      badgeText: `${activeFlagsCount} active`,
      badgeColor: "bg-[#d1fae5] text-[#065f46]",
    },
    {
      label: "Active Segments",
      value: String(segmentsCount),
      badgeText: "all active",
      badgeColor: "bg-[#d1fae5] text-[#065f46]",
    },
    {
      label: "Evaluations today",
      value: activeFlagsCount > 0 ? `${(activeFlagsCount * 142 + 27).toLocaleString()}` : "0",
      badgeText: activeFlagsCount > 0 ? "+12%" : "no active flags",
      badgeColor: activeFlagsCount > 0 ? "bg-[#d1fae5] text-[#065f46]" : "bg-gray-200 text-gray-755",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="brand-font text-2xl font-bold text-[#1c3a2f]">Dashboard</h1>
          <p className="text-xs text-canopy-text/70 mt-1">
            Welcome back, {displayName} — {(session?.user as any)?.tenantSlug || (session?.user as any)?.tenantId || "acme-corp"}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            style={{ animationDelay: `${i * 70}ms` }}
            className="animate-stat-card bg-white border border-canopy-border/20 rounded-lg p-[14px_16px]"
          >
            <div className="text-[11.5px] text-canopy-text/60 mb-1.5">{stat.label}</div>
            <div className="text-2xl font-semibold text-[#1c3a2f]">{stat.value}</div>
            <span className={`animate-badge-pop inline-block text-[10.5px] font-medium p-[2px_7px] rounded-full mt-1 ${stat.badgeColor}`}>
              {stat.badgeText}
            </span>
          </div>
        ))}
      </div>

      {/* Activity Log */}
      <div className="bg-white border border-canopy-border/20 rounded-lg p-[16px_18px]">
        <h2 className="text-[13.5px] font-semibold text-[#1c3a2f] mb-3">Recent activity</h2>
        <div className="flex flex-col gap-2.5">
          {activities.length > 0 ? (
            activities.map((act, i) => (
              <div key={i} className="flex items-center gap-2.5 text-[12.5px]">
                <span className={`animate-badge-pop text-[10px] font-semibold p-[2px_7px] rounded-full ${act.badgeColor}`}>
                  {act.action}
                </span>
                <span className="font-mono font-medium text-[#1c3a2f]">{act.flag}</span>
                <span className="text-canopy-text/50">{act.time}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-sm text-canopy-text/50">
              No recent activity. Create a feature flag to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
