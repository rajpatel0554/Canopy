"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Search, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { segmentsApi } from "@/lib/api";
import type { Segment } from "@/types";

interface SegmentsListProps {
  initialSegments: (Segment & { flagsCount?: number })[];
  token?: string;
}

export default function SegmentsList({ initialSegments, token }: SegmentsListProps) {
  const [segments, setSegments] = useState(initialSegments);
  const [search, setSearch] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const filteredSegments = segments.filter(
    (seg) =>
      seg.name.toLowerCase().includes(search.toLowerCase()) ||
      (seg.description && seg.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (segmentId: string) => {
    setActiveDropdown(null);
    const originalSegments = [...segments];

    // Optimistic UI update
    setSegments((prev) => prev.filter((s) => s.segmentId !== segmentId));

    if (!token) {
      toast.success("Mock: Segment deleted successfully");
      return;
    }

    try {
      await segmentsApi.delete(segmentId, token);
      toast.success("Segment deleted successfully");
    } catch (err: any) {
      // Rollback on failure
      setSegments(originalSegments);
      toast.error(err.message || "Failed to delete segment");
    }
  };

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Click-outside layer to dismiss open actions menus */}
      {activeDropdown !== null && (
        <div 
          className="fixed inset-0 z-10 bg-transparent" 
          onClick={() => setActiveDropdown(null)} 
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="brand-font text-2xl font-bold text-[#1c3a2f]">Segments</h1>
          <p className="text-xs text-canopy-text/70 mt-1">
            Reusable user cohorts for targeting rules
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-canopy-text/45" />
            <input
              type="text"
              placeholder="Search segments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-white border border-canopy-border/20 rounded-lg focus:outline-none focus:border-[#1c3a2f] w-full md:w-60 text-canopy-text font-sans"
            />
          </div>

          <Link
            href="/dashboard/segments/new"
            className="flex items-center gap-1.5 bg-[#1c3a2f] text-white hover:bg-[#152c24] active:scale-95 transition-all text-xs font-semibold p-[9px_16px] rounded-lg cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#6ee7b7]" />
            New Segment
          </Link>
        </div>
      </div>

      {/* Segment Table */}
      <div className="bg-white border border-canopy-border/20 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-4 p-[10px_16px] border-b border-canopy-border/20 bg-[#f7f7f2]">
          <span className="text-[11px] font-semibold text-canopy-text/60 uppercase tracking-wider">Segment</span>
          <span className="text-[11px] font-semibold text-canopy-text/60 uppercase tracking-wider">Rules</span>
          <span className="text-[11px] font-semibold text-canopy-text/60 uppercase tracking-wider">Flags</span>
          <span className="text-[11px] font-semibold text-canopy-text/60 uppercase tracking-wider text-right"></span>
        </div>

        {/* Table Rows */}
        {filteredSegments.length > 0 ? (
          filteredSegments.map((seg) => (
            <div
              key={seg.segmentId}
              className="grid grid-cols-4 p-[12px_16px] border-b border-canopy-border/20 align-center items-center hover:bg-linen/20 transition-colors group"
            >
              <div>
                <div className="text-[13.5px] font-semibold text-[#1c3a2f]">{seg.name}</div>
                <div className="text-[11px] text-canopy-text/50 mt-0.5">
                  {seg.description || "No description"}
                </div>
              </div>

              <div>
                <span className="animate-badge-pop inline-block text-[10.5px] font-semibold p-[2px_7.5px] rounded-full bg-[#d1fae5] text-[#065f46]">
                  {seg.rules?.length || 0} rules
                </span>
              </div>

              <div>
                <span className="animate-badge-pop inline-block text-[10.5px] font-semibold p-[2px_7.5px] rounded-full bg-[#dbeafe] text-[#1e40af]">
                  {seg.flagsCount || 0} flags
                </span>
              </div>

              <div className="text-right relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === seg.segmentId ? null : seg.segmentId)}
                  className="bg-transparent border-none outline-none cursor-pointer text-canopy-text/40 hover:text-forest transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <MoreVertical className="w-4 h-4 inline-block" />
                </button>

                {activeDropdown === seg.segmentId && (
                  <div className="absolute right-12 top-1/2 -translate-y-1/2 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 text-left animate-in fade-in duration-150">
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete segment "${seg.name}"?`)) {
                          handleDelete(seg.segmentId);
                        }
                      }}
                      className="w-full px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Segment
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-sm text-canopy-text/50">No segments found.</div>
        )}
      </div>
    </div>
  );
}
