"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2,
  X,
  Loader2,
  ChevronRight,
  Layers,
  Sliders
} from "lucide-react";
import { toast } from "sonner";
import { segmentsApi } from "@/lib/api";
import type { Segment } from "@/types";

interface SegmentsListProps {
  initialSegments: Segment[];
  token?: string;
}

export default function SegmentsList({ initialSegments, token }: SegmentsListProps) {
  const [segments, setSegments] = useState<Segment[]>(initialSegments);
  const [search, setSearch] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Slide-out Drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailedSegment, setDetailedSegment] = useState<Segment | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // New rule form states
  const [newRuleAttr, setNewRuleAttr] = useState("");
  const [newRuleOp, setNewRuleOp] = useState<"EQUALS" | "NOT_EQUALS" | "CONTAINS" | "NOT_CONTAINS" | "STARTS_WITH" | "ENDS_WITH">("EQUALS");
  const [newRuleVal, setNewRuleVal] = useState("");
  const [addingRule, setAddingRule] = useState(false);

  const filteredSegments = segments.filter(
    (seg) =>
      seg.name.toLowerCase().includes(search.toLowerCase()) ||
      (seg.description && seg.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (segmentId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening drawer
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
      if (detailedSegment?.segmentId === segmentId) {
        setDrawerOpen(false);
      }
    } catch (err: any) {
      // Rollback on failure
      setSegments(originalSegments);
      toast.error(err.message || "Failed to delete segment");
    }
  };

  const handleOpenDrawer = async (segmentId: string) => {
    setDrawerOpen(true);
    setLoadingDetail(true);
    setDetailedSegment(null);

    if (!token) {
      // Mock details fallback
      setTimeout(() => {
        const mockSeg = segments.find(s => s.segmentId === segmentId);
        if (mockSeg) {
          setDetailedSegment({
            ...mockSeg,
            linkedFlags: [
              { flagId: "1", key: "new-checkout-flow", name: "New Checkout Flow", enabled: true, variationId: "v1", variationValue: "true" }
            ]
          });
        }
        setLoadingDetail(false);
      }, 300);
      return;
    }

    try {
      const detail = await segmentsApi.getOne(segmentId, token);
      setDetailedSegment(detail);
    } catch (err) {
      toast.error("Failed to load segment details");
      setDrawerOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!detailedSegment) return;
    
    // Check if it's the last rule
    if (detailedSegment.rules && detailedSegment.rules.length <= 1) {
      toast.error("A segment must have at least one targeting rule.");
      return;
    }

    const originalRules = detailedSegment.rules;
    const updatedRules = originalRules.filter((r) => r.ruleId !== ruleId);

    // Optimistic UI updates
    setDetailedSegment({
      ...detailedSegment,
      rules: updatedRules,
    });

    setSegments((prev) =>
      prev.map((s) => {
        if (s.segmentId === detailedSegment.segmentId) {
          return {
            ...s,
            rules: updatedRules,
          };
        }
        return s;
      })
    );

    if (!token) {
      toast.success("Mock: Rule removed");
      return;
    }

    try {
      await segmentsApi.deleteRule(detailedSegment.segmentId, ruleId, token);
      toast.success("Rule removed successfully");
    } catch (err: any) {
      // Revert states
      setDetailedSegment({
        ...detailedSegment,
        rules: originalRules,
      });
      setSegments((prev) =>
        prev.map((s) => {
          if (s.segmentId === detailedSegment.segmentId) {
            return {
              ...s,
              rules: originalRules,
            };
          }
          return s;
        })
      );
      toast.error(err.message || "Failed to remove rule");
    }
  };

  const handleAddRule = async () => {
    if (!detailedSegment) return;
    if (!newRuleAttr.trim() || !newRuleVal.trim()) {
      toast.error("Rule attribute and value are required.");
      return;
    }

    setAddingRule(true);

    const newRulePayload = {
      attribute: newRuleAttr.trim(),
      operator: newRuleOp,
      value: newRuleVal.trim(),
    };

    if (!token) {
      setTimeout(() => {
        const mockRule = {
          ruleId: Math.random().toString(),
          segmentId: detailedSegment.segmentId,
          ...newRulePayload,
        };
        const updatedRules = [...(detailedSegment.rules || []), mockRule];

        setDetailedSegment({
          ...detailedSegment,
          rules: updatedRules,
        });

        setSegments((prev) =>
          prev.map((s) => {
            if (s.segmentId === detailedSegment.segmentId) {
              return {
                ...s,
                rules: updatedRules,
              };
            }
            return s;
          })
        );

        setNewRuleAttr("");
        setNewRuleVal("");
        setAddingRule(false);
        toast.success("Mock: Rule added successfully");
      }, 500);
      return;
    }

    try {
      await segmentsApi.addRule(detailedSegment.segmentId, newRulePayload, token);

      // Fetch the updated segment to display the complete list with newly generated IDs
      const updated = await segmentsApi.getOne(detailedSegment.segmentId, token);
      setDetailedSegment(updated);

      setSegments((prev) =>
        prev.map((s) => {
          if (s.segmentId === detailedSegment.segmentId) {
            return {
              ...s,
              rules: updated.rules,
            };
          }
          return s;
        })
      );

      setNewRuleAttr("");
      setNewRuleVal("");
      toast.success("Rule added successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to add rule");
    } finally {
      setAddingRule(false);
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
              onClick={() => handleOpenDrawer(seg.segmentId)}
              className="grid grid-cols-4 p-[12px_16px] border-b border-canopy-border/20 align-center items-center hover:bg-linen/20 transition-colors group cursor-pointer"
            >
              <div>
                <div className="text-[13.5px] font-semibold text-[#1c3a2f]">{seg.name}</div>
                <div className="text-[11px] text-canopy-text/50 mt-0.5">
                  {seg.description || "No description"}
                </div>
              </div>

              <div>
                <span className="animate-badge-pop inline-block text-[10.5px] font-semibold p-[2px_7.5px] rounded-full bg-[#d1fae5] text-[#065f46]">
                  {seg.rules?.length || 0} {seg.rules?.length === 1 ? "rule" : "rules"}
                </span>
              </div>

              <div>
                <span className="animate-badge-pop inline-block text-[10.5px] font-semibold p-[2px_7.5px] rounded-full bg-[#dbeafe] text-[#1e40af]">
                  {seg.flagsCount === 1 ? "1 flag" : `${seg.flagsCount || 0} flags`}
                </span>
              </div>

              <div className="text-right relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setActiveDropdown(activeDropdown === seg.segmentId ? null : seg.segmentId)}
                  className="bg-transparent border-none outline-none cursor-pointer text-canopy-text/40 hover:text-forest transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <MoreVertical className="w-4 h-4 inline-block" />
                </button>

                {activeDropdown === seg.segmentId && (
                  <div className="absolute right-12 top-1/2 -translate-y-1/2 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 text-left animate-in fade-in duration-150">
                    <button
                      onClick={(e) => handleDelete(seg.segmentId, e)}
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

      {/* Slide-out Drawer Backdrop */}
      {drawerOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity animate-in fade-in duration-200"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Slide-out Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-[460px] bg-white shadow-2xl z-50 border-l border-canopy-border/10 flex flex-col transform transition-transform duration-300 ease-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-canopy-border/10 flex justify-between items-start bg-[#f7f7f2]/50">
          <div className="space-y-1">
            <h3 className="font-bold text-[#1c3a2f] text-base leading-tight">
              {detailedSegment ? detailedSegment.name : "Segment Details"}
            </h3>
            {detailedSegment && (
              <p className="text-[10px] text-canopy-text/50 font-medium">
                Created on {new Date(detailedSegment.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <button 
            onClick={() => setDrawerOpen(false)}
            className="text-canopy-text/40 hover:text-[#1c3a2f] transition-colors p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loadingDetail ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#1c3a2f]" />
              <p className="text-xs text-canopy-text/50">Fetching segment rules & attached flags...</p>
            </div>
          ) : detailedSegment ? (
            <>
              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-canopy-text/50 uppercase tracking-wider">Description</h4>
                <p className="text-xs text-canopy-text/80 leading-relaxed bg-[#f7f7f2]/40 p-3 rounded-lg border border-canopy-border/5">
                  {detailedSegment.description || "No description provided for this segment."}
                </p>
              </div>

              {/* Targeting Rules */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-canopy-text/50 uppercase tracking-wider">Targeting Rules</h4>
                {detailedSegment.rules && detailedSegment.rules.length > 0 ? (
                  <div className="space-y-2">
                    {detailedSegment.rules.map((rule, idx) => (
                      <div key={rule.ruleId} className="flex items-center justify-between gap-2 text-xs bg-gray-50 border border-canopy-border/10 p-2.5 rounded-lg group/rule">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-canopy-text/30 bg-gray-200/50 w-5 h-5 rounded-full flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-mono bg-white border border-canopy-border/20 px-1.5 py-0.5 rounded font-semibold text-gray-700">
                            {rule.attribute}
                          </span>
                          <span className="font-semibold text-amber-700 uppercase text-[10px]">{rule.operator}</span>
                          <span className="font-mono bg-white border border-canopy-border/20 px-1.5 py-0.5 rounded font-semibold text-gray-700">
                            "{rule.value}"
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteRule(rule.ruleId)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 opacity-0 group-hover/rule:opacity-100 focus:opacity-100 transition-opacity cursor-pointer border-none bg-transparent"
                          title="Delete rule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-canopy-text/45 italic">No targeting rules configured for this segment.</div>
                )}

                {/* Inline Add Rule Form */}
                <div className="mt-3 p-3 bg-[#f7f7f2] border border-dashed border-canopy-border/20 rounded-lg space-y-3">
                  <div className="text-[10px] font-bold text-[#1c3a2f] uppercase tracking-wider">Add New Rule</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-bold text-canopy-text/50 uppercase tracking-wider block mb-1">Attribute</label>
                      <input
                        type="text"
                        placeholder="e.g. email"
                        value={newRuleAttr}
                        onChange={(e) => setNewRuleAttr(e.target.value)}
                        className="w-full text-xs p-1.5 bg-white border border-canopy-border/20 rounded focus:outline-none focus:border-[#1c3a2f] text-canopy-text"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-canopy-text/50 uppercase tracking-wider block mb-1">Operator</label>
                      <select
                        value={newRuleOp}
                        onChange={(e) => setNewRuleOp(e.target.value as any)}
                        className="w-full text-xs p-1.5 bg-white border border-canopy-border/20 rounded focus:outline-none focus:border-[#1c3a2f] text-canopy-text"
                      >
                        <option value="EQUALS">EQUALS</option>
                        <option value="NOT_EQUALS">NOT EQUALS</option>
                        <option value="CONTAINS">CONTAINS</option>
                        <option value="NOT_CONTAINS">NOT CONTAINS</option>
                        <option value="STARTS_WITH">STARTS WITH</option>
                        <option value="ENDS_WITH">ENDS WITH</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-canopy-text/50 uppercase tracking-wider block mb-1">Value</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. beta"
                        value={newRuleVal}
                        onChange={(e) => setNewRuleVal(e.target.value)}
                        className="flex-1 text-xs p-1.5 bg-white border border-canopy-border/20 rounded focus:outline-none focus:border-[#1c3a2f] text-canopy-text"
                      />
                      <button
                        onClick={handleAddRule}
                        disabled={addingRule}
                        className="bg-[#1c3a2f] text-white hover:bg-[#152c24] text-xs font-bold px-3 py-1.5 rounded active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1 cursor-pointer border-none outline-none"
                      >
                        {addingRule ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-[#6ee7b7]" />
                        )}
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Linked Feature Flags */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-canopy-text/50 uppercase tracking-wider">Attached to Feature Flags</h4>
                {detailedSegment.linkedFlags && detailedSegment.linkedFlags.length > 0 ? (
                  <div className="border border-canopy-border/10 rounded-lg overflow-hidden divide-y divide-canopy-border/10">
                    {detailedSegment.linkedFlags.map((flag) => (
                      <div key={flag.flagId} className="p-3 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between text-xs">
                        <div className="space-y-1">
                          <Link 
                            href={`/dashboard/flags/${flag.key}`}
                            className="font-semibold text-[#1c3a2f] hover:underline flex items-center gap-1"
                          >
                            {flag.name}
                            <ChevronRight className="w-3.5 h-3.5 text-canopy-text/30" />
                          </Link>
                          <div className="font-mono text-[10px] text-canopy-text/50">key: {flag.key}</div>
                        </div>

                        <div className="flex items-center gap-3">
                          {flag.variationValue && (
                            <span className="font-mono text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded font-bold">
                              Serves: {flag.variationValue}
                            </span>
                          )}
                          <div className="flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${flag.enabled ? "bg-emerald-500" : "bg-gray-300"}`} />
                            <span className="text-[10px] font-medium text-canopy-text/60">
                              {flag.enabled ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-canopy-text/45 italic p-3 bg-linen/20 border border-dashed border-canopy-border/20 rounded-lg text-center">
                    This segment is not attached to any feature flags.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-xs text-canopy-text/40">Select a segment to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
