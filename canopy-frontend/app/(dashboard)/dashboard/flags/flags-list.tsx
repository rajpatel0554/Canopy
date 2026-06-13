"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  ArrowUpDown,
  Zap,
  Ban,
  Activity,
  ToggleLeft
} from "lucide-react";
import { toast } from "sonner";
import { flagsApi } from "@/lib/api";
import type { Flag } from "@/types";

interface FlagsListProps {
  initialFlags: Flag[];
  token?: string;
  segmentsCount?: number;
}

export default function FlagsList({ initialFlags, token, segmentsCount = 0 }: FlagsListProps) {
  const [flags, setFlags] = useState<Flag[]>(initialFlags);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [ripplingFlag, setRipplingFlag] = useState<string | null>(null);

  // Filter, sort, and actions states
  const [filter, setFilter] = useState<"ALL" | "ENABLED" | "DISABLED">("ALL");
  const [sortBy, setSortBy] = useState<"LATEST" | "KEY">("LATEST");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [flashingFlag, setFlashingFlag] = useState<{ key: string; isMint: boolean } | null>(null);

  const handleToggleClick = (flagKey: string, currentEnabled: boolean) => {
    setRipplingFlag(flagKey);
    setTimeout(() => setRipplingFlag(null), 300);
    
    // Trigger row highlight animation
    setFlashingFlag({ key: flagKey, isMint: !currentEnabled });
    setTimeout(() => setFlashingFlag(null), 600);

    handleToggle(flagKey, currentEnabled);
  };

  const handleToggle = async (flagKey: string, currentEnabled: boolean) => {
    // Optimistic UI update
    setFlags((prev) =>
      prev.map((f) => (f.key === flagKey ? { ...f, enabled: !currentEnabled } : f))
    );

    if (!token) {
      toast.success(`Mock: Flag "${flagKey}" ${!currentEnabled ? "enabled" : "disabled"}`);
      return;
    }

    try {
      await flagsApi.toggle(flagKey, token);
      toast.success(`Flag "${flagKey}" successfully ${!currentEnabled ? "enabled" : "disabled"}`);
    } catch (err: any) {
      // Revert change on failure
      setFlags((prev) =>
        prev.map((f) => (f.key === flagKey ? { ...f, enabled: currentEnabled } : f))
      );
      toast.error(err.message || `Failed to toggle flag "${flagKey}"`);
    }
  };

  const handleDelete = async (flagKey: string) => {
    setActiveDropdown(null);
    const originalFlags = [...flags];

    // Optimistic UI update
    setFlags((prev) => prev.filter((f) => f.key !== flagKey));

    if (!token) {
      toast.success(`Mock: Flag "${flagKey}" deleted successfully`);
      return;
    }

    try {
      await flagsApi.delete(flagKey, token);
      toast.success(`Flag "${flagKey}" deleted successfully`);
    } catch (err: any) {
      // Revert on failure
      setFlags(originalFlags);
      toast.error(err.message || `Failed to delete flag "${flagKey}"`);
    }
  };

  // Stats calculation
  const totalFlags = flags.length;
  const activeFlags = flags.filter((f) => f.enabled).length;
  const partialFlags = flags.filter((f) => f.enabled && f.rolloutPercentage > 0 && f.rolloutPercentage < 100).length;
  const disabledFlags = flags.filter((f) => !f.enabled).length;

  // Filter and sort flags dynamically
  const filteredFlags = flags
    .filter((flag) => {
      const matchesSearch = 
        flag.name.toLowerCase().includes(search.toLowerCase()) ||
        flag.key.toLowerCase().includes(search.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (filter === "ENABLED") return flag.enabled;
      if (filter === "DISABLED") return !flag.enabled;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "KEY") return a.key.localeCompare(b.key);
      // Default: Latest first
      return b.createdAt.localeCompare(a.createdAt);
    });

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Click-outside layer to dismiss open actions menus */}
      {activeDropdown !== null && (
        <div 
          className="fixed inset-0 z-10 bg-transparent" 
          onClick={() => setActiveDropdown(null)} 
        />
      )}

      {/* CSS Stylesheet Injector for Custom Animations */}
      <style>{`
        .toggle-thumb-spring {
          transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes rippleRing {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.6);
            opacity: 0;
          }
        }
        .animate-ripple-ring {
          animation: rippleRing 300ms ease-out forwards;
        }
        @keyframes flashMint {
          0% { background-color: rgba(209, 250, 229, 0.4); }
          100% { background-color: transparent; }
        }
        @keyframes flashLinen {
          0% { background-color: rgba(247, 247, 242, 0.6); }
          100% { background-color: transparent; }
        }
        .animate-flash-mint {
          animation: flashMint 600ms ease-out forwards;
        }
        .animate-flash-linen {
          animation: flashLinen 600ms ease-out forwards;
        }
      `}</style>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="brand-font text-2xl font-bold text-[#1c3a2f]">Feature Flags</h1>
          <p className="text-xs text-canopy-text/70 mt-1">
            Manage and control feature rollouts for your application
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-canopy-text/45" />
            <input
              type="text"
              placeholder="Search flags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-white border border-canopy-border/20 rounded-lg focus:outline-none focus:border-[#1c3a2f] w-full md:w-60 text-canopy-text font-sans"
            />
          </div>

          <Link
            href="/dashboard/flags/new"
            className="flex items-center gap-1.5 bg-[#1c3a2f] text-white hover:bg-[#152c24] active:scale-95 transition-all text-xs font-semibold p-[9px_16px] rounded-lg cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#6ee7b7]" />
            New Flag
          </Link>
        </div>
      </div>

      {/* Stats Cards (4 Columns bento-style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-stat-card bg-white border border-canopy-border/20 rounded-xl p-[14px_16px] shadow-sm">
          <div className="text-[11px] font-bold text-canopy-text/60 mb-1.5 uppercase tracking-wider">Total Flags</div>
          <div className="text-2xl font-semibold text-[#1c3a2f]">{totalFlags}</div>
        </div>
        <div className="animate-stat-card bg-white border border-canopy-border/20 rounded-xl p-[14px_16px] shadow-sm">
          <div className="text-[11px] font-bold text-canopy-text/60 mb-1.5 uppercase tracking-wider">Active</div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-semibold text-emerald-600">{activeFlags}</div>
            <span className="inline-block text-[9.5px] font-bold p-[1px_6px] rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-tight">
              Healthy
            </span>
          </div>
        </div>
        <div className="animate-stat-card bg-white border border-canopy-border/20 rounded-xl p-[14px_16px] shadow-sm">
          <div className="text-[11px] font-bold text-canopy-text/60 mb-1.5 uppercase tracking-wider">Partial Rollout</div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-semibold text-amber-600">{partialFlags}</div>
            <span className="inline-block text-[9.5px] font-bold p-[1px_6px] rounded-full bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-tight">
              Monitoring
            </span>
          </div>
        </div>
        <div className="animate-stat-card bg-white border border-canopy-border/20 rounded-xl p-[14px_16px] shadow-sm">
          <div className="text-[11px] font-bold text-canopy-text/60 mb-1.5 uppercase tracking-wider">Disabled</div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-semibold text-gray-500">{disabledFlags}</div>
            <span className="inline-block text-[9.5px] font-bold p-[1px_6px] rounded-full bg-gray-50 text-gray-600 border border-gray-100 uppercase tracking-tight">
              Inactive
            </span>
          </div>
        </div>
      </div>

      {/* Flags Table Card */}
      <div className="bg-white border border-canopy-border/20 rounded-xl shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="px-5 py-3 border-b border-canopy-border/10 flex items-center justify-between bg-white">
          <div className="flex gap-1.5">
            {[
              { id: "ALL", label: "All" },
              { id: "ENABLED", label: "Enabled" },
              { id: "DISABLED", label: "Disabled" }
            ].map((t) => {
              const isActive = filter === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setFilter(t.id as any)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-full cursor-pointer transition-colors ${
                    isActive 
                      ? "bg-[#e8f5ee] text-[#1c3a2f]" 
                      : "text-canopy-text/60 hover:bg-gray-50"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          
          <button 
            onClick={() => setSortBy(prev => prev === "LATEST" ? "KEY" : "LATEST")}
            className="flex items-center gap-1 text-[11px] font-bold text-canopy-text/60 hover:text-[#1c3a2f] transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortBy === "LATEST" ? "Latest First" : "Key A-Z"}
          </button>
        </div>

        {/* Semantic HTML Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f7f7f2]/60 border-b border-canopy-border/10">
                <th className="px-5 py-3 text-[10.5px] font-bold text-canopy-text/60 uppercase tracking-wider">Flag Key</th>
                <th className="px-5 py-3 text-[10.5px] font-bold text-canopy-text/60 uppercase tracking-wider">Description</th>
                <th className="px-5 py-3 text-[10.5px] font-bold text-canopy-text/60 uppercase tracking-wider">Type</th>
                <th className="px-5 py-3 text-[10.5px] font-bold text-canopy-text/60 uppercase tracking-wider">Rollout</th>
                <th className="px-5 py-3 text-[10.5px] font-bold text-canopy-text/60 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filteredFlags.length > 0 ? (
                filteredFlags.map((flag) => {
                  const isFlashing = flashingFlag?.key === flag.key;
                  const isPartial = flag.rolloutPercentage > 0 && flag.rolloutPercentage < 100;
                  return (
                    <tr
                      key={flag.flagId}
                      className={`group border-b border-canopy-border/15 hover:bg-[#f7f7f2]/25 transition-colors duration-150 align-middle ${
                        isFlashing 
                          ? (flashingFlag.isMint ? "animate-flash-mint" : "animate-flash-linen") 
                          : ""
                      }`}
                    >
                      <td className="px-5 py-4">
                        <Link href={`/dashboard/flags/${flag.key}`} className="hover:opacity-85 transition-opacity">
                          <span className="font-mono text-xs bg-[#e8f5ee] text-[#1c3a2f] border border-[#d1fae5] px-2 py-1 rounded select-all font-semibold max-w-[170px] truncate inline-block">
                            {flag.key}
                          </span>
                        </Link>
                      </td>
                      
                      <td className="px-5 py-4">
                        <div className="max-w-[280px]">
                          <Link href={`/dashboard/flags/${flag.key}`} className="hover:underline">
                            <p className="text-[13.5px] font-semibold text-[#1c3a2f] truncate">{flag.name}</p>
                          </Link>
                          <p className="text-xs text-canopy-text/60 truncate mt-0.5" title={flag.description || ""}>
                            {flag.description || "No description provided"}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`text-[9.5px] font-bold tracking-wider px-2 py-0.5 rounded border ${
                            flag.variationType === "BOOLEAN"
                              ? "bg-[#dbeafe] text-[#1e40af] border-blue-200"
                              : flag.variationType === "STRING"
                              ? "bg-[#f3e8ff] text-[#6b21a8] border-purple-200"
                              : flag.variationType === "NUMBER"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200"
                          }`}
                        >
                          {flag.variationType}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between items-center text-[9px] text-canopy-text/50">
                            <span className="font-semibold text-canopy-text/70">{flag.rolloutPercentage}%</span>
                            <span>100%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#059669] rounded-full transition-all duration-500" 
                              style={{ width: `${flag.rolloutPercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="relative flex items-center justify-start h-8 w-11">
                            <button
                              onClick={() => handleToggleClick(flag.key, flag.enabled)}
                              className={`relative inline-flex h-5 w-[36px] shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none ${
                                flag.enabled ? "bg-[#059669]" : "bg-gray-300"
                              }`}
                            >
                              {/* Ripple Ring */}
                              {ripplingFlag === flag.key && (
                                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[34px] h-[34px] rounded-full bg-[#6ee7b7]/40 animate-ripple-ring pointer-events-none" />
                              )}
                              {/* Thumb */}
                              <span
                                className={`pointer-events-none block h-3.5 w-3.5 rounded-full bg-white shadow-md transition-transform duration-220 ease-out toggle-thumb-spring ${
                                  flag.enabled ? "translate-x-[18px]" : "translate-x-[4px]"
                                }`}
                              />
                            </button>
                          </div>
                          <span className="text-xs font-bold text-canopy-text/75 select-none w-14">
                            {flag.enabled ? (isPartial ? "Partial" : "Enabled") : "Disabled"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right relative">
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === flag.key ? null : flag.key)}
                          className="material-symbols-outlined text-canopy-text/40 hover:text-primary transition-colors cursor-pointer select-none opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          more_vert
                        </button>
                        
                        {/* Dropdown Options Menu */}
                        {activeDropdown === flag.key && (
                          <div className="absolute right-12 top-1/2 -translate-y-1/2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 text-left animate-in fade-in duration-150">
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete feature flag "${flag.name}"?`)) {
                                  handleDelete(flag.key);
                                }
                              }}
                              className="w-full px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete Flag
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-canopy-text/50">
                    No feature flags found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
