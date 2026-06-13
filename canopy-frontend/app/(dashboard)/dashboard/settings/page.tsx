import React from "react";
import { auth } from "@/auth";

export default async function SettingsPage() {
  const session = await auth();
  const orgSlug = (((session?.user as any)?.tenantSlug || (session?.user as any)?.tenantId || "acme-corp") as string);
  const orgName = orgSlug
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Page Header */}
      <div>
        <h1 className="brand-font text-2xl font-bold text-[#1c3a2f]">Settings</h1>
        <p className="text-xs text-canopy-text/70 mt-1">
          Organization and account configuration
        </p>
      </div>

      {/* Organization Card */}
      <div className="bg-white border border-canopy-border/20 rounded-lg p-[18px_20px]">
        <h2 className="text-[13.5px] font-semibold text-[#1c3a2f]">Organization</h2>
        <p className="text-[12.5px] text-canopy-text/60 mb-3">
          Your organization slug and display name
        </p>
        <div className="flex gap-2.5 items-center">
          <div className="font-mono text-xs bg-[#f7f7f2] p-[6px_12px] rounded border border-canopy-border/30 text-[#1c3a2f]">
            {orgSlug}
          </div>
          <span className="text-xs text-canopy-text/80 font-medium">{orgName} Corporation</span>
        </div>
      </div>

      {/* API Keys Placeholder */}
      <div className="bg-white border border-canopy-border/20 rounded-lg p-[18px_20px]">
        <h2 className="text-[13.5px] font-semibold text-[#1c3a2f]">SDK Access</h2>
        <p className="text-[12.5px] text-canopy-text/60 mb-3">
          Primary authorization key for SDK client initialization
        </p>
        <div className="font-mono text-[11.5px] bg-[#f7f7f2] p-[8px_12px] rounded border border-canopy-border/30 text-canopy-text/40 select-all overflow-x-auto whitespace-nowrap">
          cnpy_live_••••••••••••••••••••••••••••••••
        </div>
      </div>
    </div>
  );
}
