"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Loader2, 
  Layers, 
  Sliders, 
  Zap, 
  HelpCircle, 
  Check, 
  X,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { flagsApi, segmentsApi, rulesApi } from "@/lib/api";
import type { Flag, FlagVariation, FlagSegment, Segment, TargetingRule } from "@/types";

interface FlagDetailClientProps {
  initialFlag: Flag;
  token?: string;
}

export default function FlagDetailClient({ initialFlag, token }: FlagDetailClientProps) {
  const router = useRouter();
  const [flag, setFlag] = useState<Flag>(initialFlag);
  const [isPending, startTransition] = useTransition();

  // Active Tab: "rules" | "segments"
  const [activeTab, setActiveTab] = useState<"rules" | "segments">("rules");

  // State for data fetched client-side
  const [variations, setVariations] = useState<FlagVariation[]>([]);
  const [attachedSegments, setAttachedSegments] = useState<FlagSegment[]>([]);
  const [rules, setRules] = useState<TargetingRule[]>([]);
  const [allSegments, setAllSegments] = useState<Segment[]>([]);

  // Loading States
  const [loadingVariations, setLoadingVariations] = useState(true);
  const [loadingSegments, setLoadingSegments] = useState(true);
  const [loadingRules, setLoadingRules] = useState(true);

  // Modal State
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [selectedSegmentId, setSelectedSegmentId] = useState("");
  const [selectedVariationId, setSelectedVariationId] = useState("");
  const [attaching, setAttaching] = useState(false);

  // New Rule Form State
  const [ruleAttribute, setRuleAttribute] = useState("");
  const [ruleOperator, setRuleOperator] = useState<"EQUALS" | "NOT_EQUALS" | "CONTAINS" | "NOT_CONTAINS" | "STARTS_WITH" | "ENDS_WITH">("EQUALS");
  const [ruleValue, setRuleValue] = useState("");
  const [ruleVariationId, setRuleVariationId] = useState("");
  const [rulePriority, setRulePriority] = useState(0);
  const [addingRule, setAddingRule] = useState(false);

  // Load variations, segments, and rules
  useEffect(() => {
    async function loadData() {
      if (!token) {
        // Mock data fallback
        const mockVariations = [
          { variationId: "v1", flagId: flag.flagId, value: "true", isDefault: false },
          { variationId: "v2", flagId: flag.flagId, value: "false", isDefault: true }
        ];
        setVariations(mockVariations);
        setRuleVariationId(mockVariations[0].variationId);
        setSelectedVariationId(mockVariations[0].variationId);
        setLoadingVariations(false);

        setAttachedSegments([]);
        setLoadingSegments(false);

        setRules([]);
        setLoadingRules(false);

        setAllSegments([
          { 
            segmentId: "s1", 
            name: "Beta Testers", 
            description: "Users in beta plan", 
            rules: [
              { ruleId: "r1", segmentId: "s1", attribute: "plan", operator: "EQUALS", value: "beta" }
            ], 
            createdAt: new Date().toISOString() 
          },
          { 
            segmentId: "s2", 
            name: "Enterprise Accounts", 
            description: "Premium tier clients", 
            rules: [
              { ruleId: "r2", segmentId: "s2", attribute: "tier", operator: "EQUALS", value: "enterprise" }
            ], 
            createdAt: new Date().toISOString() 
          }
        ]);
        return;
      }

      try {
        const vars = await flagsApi.getVariations(flag.key, token);
        setVariations(vars);
        if (vars.length > 0) {
          setRuleVariationId(vars[0].variationId);
          setSelectedVariationId(vars[0].variationId);
        }
      } catch (err) {
        toast.error("Failed to load variations");
      } finally {
        setLoadingVariations(false);
      }

      try {
        const attached = await flagsApi.getAttachedSegments(flag.key, token);
        setAttachedSegments(attached);
      } catch (err) {
        toast.error("Failed to load attached segments");
      } finally {
        setLoadingSegments(false);
      }

      try {
        const directRules = await rulesApi.getAll(flag.key, token);
        setRules(directRules);
      } catch (err) {
        toast.error("Failed to load targeting rules");
      } finally {
        setLoadingRules(false);
      }

      try {
        const segs = await segmentsApi.getAll(token);
        setAllSegments(segs);
      } catch (err) {
        console.warn("Could not load all segments:", err);
      }
    }

    loadData();
  }, [flag.key, token, flag.flagId]);

  // Handle toggle enabled status
  const handleToggleStatus = async () => {
    const nextEnabled = !flag.enabled;
    setFlag(prev => ({ ...prev, enabled: nextEnabled }));

    if (!token) {
      toast.success(`Mock: Flag toggle set to ${nextEnabled ? "enabled" : "disabled"}`);
      return;
    }

    try {
      await flagsApi.toggle(flag.key, token);
      toast.success(`Flag successfully ${nextEnabled ? "enabled" : "disabled"}`);
    } catch (err: any) {
      setFlag(prev => ({ ...prev, enabled: !nextEnabled }));
      toast.error(err.message || "Failed to toggle status");
    }
  };

  // Add Direct Targeting Rule
  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleAttribute || !ruleValue || !ruleVariationId) {
      toast.error("Please fill in all rule fields");
      return;
    }

    setAddingRule(true);
    const newPayload = {
      attribute: ruleAttribute,
      operator: ruleOperator,
      value: ruleValue,
      variationId: ruleVariationId,
      priority: rulePriority
    };

    if (!token) {
      // Mock addition
      const mockRule: TargetingRule = {
        ruleId: Math.random().toString(),
        flagId: flag.flagId,
        ...newPayload
      };
      setRules(prev => [...prev, mockRule].sort((a, b) => a.priority - b.priority));
      setRuleAttribute("");
      setRuleValue("");
      setAddingRule(false);
      toast.success("Mock: Rule added successfully");
      return;
    }

    try {
      const addedRule = await rulesApi.create(flag.key, newPayload, token);
      setRules(prev => [...prev, addedRule].sort((a, b) => a.priority - b.priority));
      setRuleAttribute("");
      setRuleValue("");
      toast.success("Targeting rule created");
    } catch (err: any) {
      toast.error(err.message || "Failed to add targeting rule");
    } finally {
      setAddingRule(false);
    }
  };

  // Delete Direct Targeting Rule
  const handleDeleteRule = async (ruleId: string) => {
    const originalRules = [...rules];
    setRules(prev => prev.filter(r => r.ruleId !== ruleId));

    if (!token) {
      toast.success("Mock: Rule removed");
      return;
    }

    try {
      await rulesApi.delete(flag.key, ruleId, token);
      toast.success("Targeting rule removed");
    } catch (err: any) {
      setRules(originalRules);
      toast.error(err.message || "Failed to remove targeting rule");
    }
  };

  // Attach Segment to Flag
  const handleAttachSegment = async () => {
    if (!selectedSegmentId) {
      toast.error("Please select a segment");
      return;
    }

    // Check if already attached
    if (attachedSegments.some(s => s.segmentId === selectedSegmentId)) {
      toast.error("Segment is already attached to this flag");
      return;
    }

    setAttaching(true);

    if (!token) {
      const selected = allSegments.find(s => s.segmentId === selectedSegmentId);
      if (selected) {
        const mockAttached: FlagSegment = {
          segmentId: selected.segmentId,
          name: selected.name,
          description: selected.description,
          rules: selected.rules || [],
          variationId: selectedVariationId || null
        };
        setAttachedSegments(prev => [...prev, mockAttached]);
      }
      setIsAttachModalOpen(false);
      setSelectedSegmentId("");
      setAttaching(false);
      toast.success("Mock: Segment attached to flag");
      return;
    }

    try {
      await segmentsApi.attachToFlag(flag.key, selectedSegmentId, selectedVariationId || null, token);
      
      // Reload attached segments
      const attached = await flagsApi.getAttachedSegments(flag.key, token);
      setAttachedSegments(attached);

      setIsAttachModalOpen(false);
      setSelectedSegmentId("");
      toast.success("Segment successfully attached to flag");
    } catch (err: any) {
      toast.error(err.message || "Failed to attach segment");
    } finally {
      setAttaching(false);
    }
  };

  // Detach Segment from Flag
  const handleDetachSegment = async (segmentId: string) => {
    if (!confirm("Are you sure you want to detach this segment from this flag?")) {
      return;
    }

    const originalSegments = [...attachedSegments];
    setAttachedSegments(prev => prev.filter(s => s.segmentId !== segmentId));

    if (!token) {
      toast.success("Mock: Segment detached");
      return;
    }

    try {
      await segmentsApi.detachFromFlag(flag.key, segmentId, token);
      toast.success("Segment detached from flag");
    } catch (err: any) {
      setAttachedSegments(originalSegments);
      toast.error(err.message || "Failed to detach segment");
    }
  };

  return (
    <div className="flex flex-col gap-6 relative max-w-5xl mx-auto">
      {/* Back to Flags Dashboard */}
      <div>
        <Link 
          href="/dashboard/flags"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-canopy-text/60 hover:text-[#1c3a2f] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Flags
        </Link>
      </div>

      {/* Flag Header Card */}
      <div className="bg-white border border-canopy-border/20 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] font-bold bg-[#e8f5ee] text-[#1c3a2f] border border-[#d1fae5] px-2 py-0.5 rounded uppercase">
              {flag.variationType}
            </span>
            <span className="font-mono text-xs text-canopy-text/50">
              key: {flag.key}
            </span>
          </div>
          <h1 className="brand-font text-2xl font-bold text-[#1c3a2f]">{flag.name}</h1>
          <p className="text-sm text-canopy-text/75">{flag.description || "No description provided."}</p>
        </div>

        <div className="flex items-center gap-6 border-l border-canopy-border/10 pl-6 h-full min-w-[150px]">
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-canopy-text/50 uppercase tracking-wider">Status</div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleStatus}
                className={`relative inline-flex h-5 w-[36px] shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none ${
                  flag.enabled ? "bg-[#059669]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none block h-3.5 w-3.5 rounded-full bg-white shadow-md transition-transform duration-200 ease-out ${
                    flag.enabled ? "translate-x-[18px]" : "translate-x-[4px]"
                  }`}
                />
              </button>
              <span className="text-xs font-bold text-canopy-text/75 select-none">
                {flag.enabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-canopy-border/10 flex gap-6">
        <button
          onClick={() => setActiveTab("rules")}
          className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "rules"
              ? "border-[#1c3a2f] text-[#1c3a2f]"
              : "border-transparent text-canopy-text/50 hover:text-[#1c3a2f]"
          }`}
        >
          <Sliders className="w-4 h-4" />
          Targeting Rules
        </button>
        <button
          onClick={() => setActiveTab("segments")}
          className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "segments"
              ? "border-[#1c3a2f] text-[#1c3a2f]"
              : "border-transparent text-canopy-text/50 hover:text-[#1c3a2f]"
          }`}
        >
          <Layers className="w-4 h-4" />
          Segment Targeting
        </button>
      </div>

      {/* Tab Content Panels */}
      <div className="min-h-[250px]">
        {activeTab === "rules" && (
          <div className="space-y-6">
            {/* Rules List Card */}
            <div className="bg-white border border-canopy-border/20 rounded-xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-canopy-border/10 bg-[#f7f7f2]/50 flex justify-between items-center">
                <h3 className="text-xs font-bold text-[#1c3a2f] uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  Direct Targeting Rules
                </h3>
                <span className="text-[10px] font-bold text-canopy-text/40">Evaluated in priority order</span>
              </div>

              {loadingRules ? (
                <div className="p-12 flex justify-center items-center">
                  <Loader2 className="w-6 h-6 animate-spin text-[#1c3a2f]" />
                </div>
              ) : rules.length > 0 ? (
                <div className="divide-y divide-canopy-border/10">
                  {rules.map((rule) => {
                    const matchedVar = variations.find(v => v.variationId === rule.variationId);
                    return (
                      <div key={rule.ruleId} className="px-5 py-4 flex items-center justify-between hover:bg-[#f7f7f2]/20 transition-colors">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-semibold text-canopy-text/60">If</span>
                          <span className="font-mono bg-gray-50 border border-gray-200 px-2 py-0.5 rounded font-semibold text-gray-700">{rule.attribute}</span>
                          <span className="font-semibold text-amber-700 uppercase">{rule.operator}</span>
                          <span className="font-mono bg-gray-50 border border-gray-200 px-2 py-0.5 rounded font-semibold text-gray-700">"{rule.value}"</span>
                          <span className="font-semibold text-canopy-text/60">→ serve variation</span>
                          <span className="font-mono bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded font-bold">
                            {matchedVar ? matchedVar.value : "ON variation"}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] text-canopy-text/40 font-semibold bg-gray-100 px-2 py-0.5 rounded">
                            Priority: {rule.priority}
                          </span>
                          <button
                            onClick={() => handleDeleteRule(rule.ruleId)}
                            className="text-canopy-text/30 hover:text-red-600 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
                  <Sliders className="w-10 h-10 text-canopy-text/30" />
                  <div>
                    <h4 className="text-sm font-semibold text-canopy-text/75">No direct targeting rules</h4>
                    <p className="text-xs text-canopy-text/50 mt-1">Add rules to serve specific variations to segments of users.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Add Rule Form */}
            <div className="bg-white border border-canopy-border/20 rounded-xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-[#1c3a2f] uppercase tracking-wider mb-4">Add Direct Rule</h3>
              <form onSubmit={handleAddRule} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-canopy-text/60 uppercase">Attribute</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. plan, country"
                    value={ruleAttribute}
                    onChange={(e) => setRuleAttribute(e.target.value)}
                    className="p-2 border border-canopy-border/20 rounded-lg text-xs focus:outline-none focus:border-[#1c3a2f]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-canopy-text/60 uppercase">Operator</label>
                  <select
                    value={ruleOperator}
                    onChange={(e) => setRuleOperator(e.target.value as any)}
                    className="p-2 border border-canopy-border/20 rounded-lg text-xs bg-white focus:outline-none focus:border-[#1c3a2f] font-semibold text-canopy-text/80 cursor-pointer"
                  >
                    <option value="EQUALS">EQUALS</option>
                    <option value="NOT_EQUALS">NOT_EQUALS</option>
                    <option value="CONTAINS">CONTAINS</option>
                    <option value="NOT_CONTAINS">NOT_CONTAINS</option>
                    <option value="STARTS_WITH">STARTS_WITH</option>
                    <option value="ENDS_WITH">ENDS_WITH</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-canopy-text/60 uppercase">Value</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. beta, US"
                    value={ruleValue}
                    onChange={(e) => setRuleValue(e.target.value)}
                    className="p-2 border border-canopy-border/20 rounded-lg text-xs focus:outline-none focus:border-[#1c3a2f]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-canopy-text/60 uppercase">Serve Variation</label>
                  <select
                    value={ruleVariationId}
                    onChange={(e) => setRuleVariationId(e.target.value)}
                    className="p-2 border border-canopy-border/20 rounded-lg text-xs bg-white focus:outline-none focus:border-[#1c3a2f] font-semibold text-canopy-text/80 cursor-pointer"
                  >
                    {variations.map(v => (
                      <option key={v.variationId} value={v.variationId}>
                        {v.value} {v.isDefault ? "(default)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={addingRule}
                  className="bg-[#1c3a2f] text-white hover:bg-[#152c24] text-xs font-semibold p-[10px_16px] rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {addingRule ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-[#6ee7b7]" />
                  )}
                  Add Rule
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "segments" && (
          <div className="space-y-6">
            {/* Attached Segments List */}
            <div className="bg-white border border-canopy-border/20 rounded-xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-canopy-border/10 bg-[#f7f7f2]/50 flex justify-between items-center">
                <h3 className="text-xs font-bold text-[#1c3a2f] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-forest" />
                  Targeting Segments
                </h3>
                <button
                  onClick={() => setIsAttachModalOpen(true)}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-[#1c3a2f] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Attach Segment
                </button>
              </div>

              {loadingSegments ? (
                /* Skeleton Loader */
                <div className="p-6 space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between animate-pulse">
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-100 rounded w-1/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                      <div className="h-6 bg-gray-100 rounded-full w-20" />
                    </div>
                  ))}
                </div>
              ) : attachedSegments.length > 0 ? (
                <div className="divide-y divide-canopy-border/10">
                  {attachedSegments.map((segment) => {
                    const matchedVar = variations.find(v => v.variationId === segment.variationId);
                    return (
                      <div key={segment.segmentId} className="px-5 py-4 flex items-center justify-between hover:bg-[#f7f7f2]/10 transition-colors">
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-semibold text-[#1c3a2f]">{segment.name}</span>
                            {segment.description && (
                              <span className="text-[11px] text-canopy-text/50 ml-3">({segment.description})</span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-canopy-text/60">
                            <span className="font-semibold text-[10.5px]">Rules:</span>
                            {segment.rules && segment.rules.length > 0 ? (
                              segment.rules.map(r => (
                                <span key={r.ruleId} className="inline-block font-mono text-[10px] bg-linen/50 text-[#1c3a2f] border border-canopy-border/15 px-1.5 py-0.5 rounded">
                                  {r.attribute} {r.operator} "{r.value}"
                                </span>
                              ))
                            ) : (
                              <span className="text-canopy-text/40 italic text-[11px]">No rules configured</span>
                            )}
                          </div>
                          <div className="text-[11px] font-semibold text-[#1c3a2f]/85 flex items-center gap-1">
                            <span className="text-canopy-text/50">Serves variation:</span>
                            <span className="font-mono bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded text-[10px] font-bold">
                              {matchedVar ? matchedVar.value : "ON variation"}
                            </span>
                          </div>
                        </div>

                        <div>
                          <button
                            onClick={() => handleDetachSegment(segment.segmentId)}
                            className="text-canopy-text/30 hover:text-red-600 transition-colors p-2 cursor-pointer"
                            title="Detach Segment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty State */
                <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
                  <Layers className="w-12 h-12 text-canopy-text/30" />
                  <div>
                    <h4 className="text-sm font-semibold text-canopy-text/75">No segments attached</h4>
                    <p className="text-xs text-canopy-text/50 mt-1 max-w-sm mx-auto">
                      Define a segment once on the Segments tab, and link it here to dynamically target user cohorts.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAttachModalOpen(true)}
                    className="flex items-center gap-1.5 border border-canopy-border/25 text-[#1c3a2f] hover:bg-gray-50 text-xs font-semibold p-[8px_16px] rounded-lg transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Attach First Segment
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Attach Segment Modal */}
      {isAttachModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-canopy-border/15 rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-5 py-4 border-b border-canopy-border/10 flex justify-between items-center bg-[#f7f7f2]/40">
              <h3 className="font-bold text-sm text-[#1c3a2f]">Attach Segment to Flag</h3>
              <button 
                onClick={() => {
                  setIsAttachModalOpen(false);
                  setSelectedSegmentId("");
                }}
                className="text-canopy-text/40 hover:text-canopy-text transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10.5px] font-bold text-canopy-text/60 uppercase">Targeting Segment</label>
                <select
                  value={selectedSegmentId}
                  onChange={(e) => setSelectedSegmentId(e.target.value)}
                  className="p-2 border border-canopy-border/20 rounded-lg text-xs bg-white focus:outline-none focus:border-[#1c3a2f] font-semibold text-canopy-text/80 cursor-pointer"
                >
                  <option value="">-- Select a Segment --</option>
                  {allSegments
                    .filter(s => !attachedSegments.some(as => as.segmentId === s.segmentId))
                    .map(s => (
                      <option key={s.segmentId} value={s.segmentId}>
                        {s.name} ({s.rules?.length || 0} rules)
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10.5px] font-bold text-canopy-text/60 uppercase">Served Variation</label>
                <select
                  value={selectedVariationId}
                  onChange={(e) => setSelectedVariationId(e.target.value)}
                  className="p-2 border border-canopy-border/20 rounded-lg text-xs bg-white focus:outline-none focus:border-[#1c3a2f] font-semibold text-canopy-text/80 cursor-pointer"
                >
                  {variations.map(v => (
                    <option key={v.variationId} value={v.variationId}>
                      {v.value} {v.isDefault ? "(default)" : ""}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-canopy-text/50">
                  Users matching all of this segment's rules will be served this variation value.
                </p>
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-canopy-border/10 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsAttachModalOpen(false);
                  setSelectedSegmentId("");
                }}
                className="px-4 py-2 border border-canopy-border/25 rounded-lg text-xs font-semibold text-canopy-text hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAttachSegment}
                disabled={attaching || !selectedSegmentId}
                className="px-4 py-2 bg-[#1c3a2f] text-white hover:bg-[#152c24] text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {attaching && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Attach Segment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
