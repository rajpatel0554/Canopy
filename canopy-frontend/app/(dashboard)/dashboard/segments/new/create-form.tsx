"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Info, 
  Loader2, 
  Save, 
  AlertCircle 
} from "lucide-react";
import { toast } from "sonner";
import { segmentsApi } from "@/lib/api";
import type { RuleOperator } from "@/types";

interface RuleRow {
  attribute: string;
  operator: RuleOperator;
  value: string;
}

interface CreateSegmentFormProps {
  token?: string;
}

export default function CreateSegmentForm({ token }: CreateSegmentFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState<RuleRow[]>([
    { attribute: "plan", operator: "EQUALS", value: "enterprise" },
    { attribute: "country", operator: "EQUALS", value: "US" }
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const addRuleRow = () => {
    setRules((prev) => [...prev, { attribute: "", operator: "EQUALS", value: "" }]);
  };

  const removeRuleRow = (index: number) => {
    if (rules.length === 1) {
      toast.error("A segment must have at least one targeting rule.");
      return;
    }
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  const updateRuleField = (index: number, field: keyof RuleRow, val: string) => {
    setRules((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: val } : row))
    );
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Segment name is required.");
      return;
    }

    // Validate rules
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      if (!rule.attribute.trim() || !rule.value.trim()) {
        setError(`Rule #${i + 1} has empty fields. All rules must specify an attribute and value.`);
        return;
      }
    }

    startTransition(async () => {
      try {
        if (!token) {
          // Mock mode
          await new Promise((resolve) => setTimeout(resolve, 1200));
          toast.success(`Mock: Segment "${name}" with ${rules.length} rules created successfully!`);
          router.push("/dashboard/segments");
          router.refresh();
          return;
        }

        // Step 1: Create the base segment
        const createdSegment = await segmentsApi.create(
          {
            name,
            description: description || undefined,
          },
          token
        );

        // Step 2: Append each rule in parallel
        await Promise.all(
          rules.map((rule) =>
            segmentsApi.addRule(
              createdSegment.segmentId,
              {
                attribute: rule.attribute,
                operator: rule.operator,
                value: rule.value,
              },
              token
            )
          )
        );

        toast.success(`Segment "${name}" created successfully!`);
        router.push("/dashboard/segments");
        router.refresh();
      } catch (err: any) {
        setError(err.message || "Failed to create segment.");
        toast.error(err.message || "Failed to create segment.");
      }
    });
  };

  return (
    <div className="max-w-[800px] mx-auto flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link 
            href="/dashboard/segments"
            className="flex items-center gap-1.5 text-xs font-bold text-canopy-text/60 hover:text-[#1c3a2f] transition-colors mb-2 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Segments
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[#1c3a2f]">Add Segment</h1>
          <p className="text-xs text-canopy-text/70 mt-1">
            Define a reusable user cohort for targeting rules.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/segments"
            className="px-4 py-2 text-xs font-bold text-canopy-text/80 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 active:scale-95 transition-all"
          >
            Cancel
          </Link>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSubmit()}
            className="flex items-center gap-1.5 bg-[#1c3a2f] text-white hover:bg-[#152c24] active:scale-95 transition-all text-xs font-bold px-4 py-2 rounded-lg disabled:opacity-50 cursor-pointer min-w-[120px] justify-center"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-[#6ee7b7]" />
                Save Segment
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Basic Information */}
        <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm space-y-4">
          <h3 className="font-serif text-base font-semibold text-[#1c3a2f] border-b border-gray-50 pb-2">Basic Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-canopy-text/60 mb-1.5 uppercase tracking-wider">Segment Name</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. Beta Testers"
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#1c3a2f] focus:ring-1 focus:ring-[#1c3a2f] text-canopy-text font-sans"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-canopy-text/60 mb-1.5 uppercase tracking-wider">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional — describe who belongs in this segment..."
                rows={3}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#1c3a2f] focus:ring-1 focus:ring-[#1c3a2f] text-canopy-text font-sans"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Rules */}
        <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <h3 className="font-serif text-base font-semibold text-[#1c3a2f]">Rules</h3>
            <span className="px-2 py-0.5 bg-[#e8f5ee] text-[#1c3a2f] text-[10px] font-bold rounded-full border border-[#d1fae5]">
              {rules.length} {rules.length === 1 ? "RULE" : "RULES"}
            </span>
          </div>

          <div className="space-y-3">
            {rules.map((rule, idx) => (
              <div 
                key={idx} 
                className="bg-gray-50/50 border-l-[3px] border-[#6ee7b7] p-3 rounded-r-lg flex items-center gap-3 animate-in fade-in duration-200"
              >
                <div className="flex flex-1 gap-3">
                  <div className="w-[30%]">
                    <input 
                      type="text"
                      value={rule.attribute}
                      onChange={(e) => {
                        updateRuleField(idx, "attribute", e.target.value);
                        setError(null);
                      }}
                      placeholder="plan, email, country"
                      className="w-full h-9 px-3 bg-white border border-gray-200 rounded font-mono text-xs text-canopy-text focus:outline-none focus:border-[#1c3a2f] focus:ring-1 focus:ring-[#1c3a2f]"
                      required
                    />
                  </div>
                  <div className="w-[30%]">
                    <select
                      value={rule.operator}
                      onChange={(e) => updateRuleField(idx, "operator", e.target.value as RuleOperator)}
                      className="w-full h-9 px-2 bg-white border border-gray-200 rounded text-xs text-canopy-text focus:outline-none focus:border-[#1c3a2f] focus:ring-1 focus:ring-[#1c3a2f]"
                    >
                      <option value="EQUALS">EQUALS</option>
                      <option value="NOT_EQUALS">NOT EQUALS</option>
                      <option value="CONTAINS">CONTAINS</option>
                      <option value="NOT_CONTAINS">NOT CONTAINS</option>
                      <option value="STARTS_WITH">STARTS WITH</option>
                      <option value="ENDS_WITH">ENDS WITH</option>
                    </select>
                  </div>
                  <div className="w-[40%]">
                    <input 
                      type="text"
                      value={rule.value}
                      onChange={(e) => {
                        updateRuleField(idx, "value", e.target.value);
                        setError(null);
                      }}
                      placeholder="e.g. enterprise, US"
                      className="w-full h-9 px-3 bg-white border border-gray-200 rounded font-mono text-xs text-canopy-text focus:outline-none focus:border-[#1c3a2f] focus:ring-1 focus:ring-[#1c3a2f]"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => removeRuleRow(idx)}
                  className="text-canopy-text/40 hover:text-red-600 transition-colors p-1 cursor-pointer flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addRuleRow}
            className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-lg text-canopy-text/60 hover:border-[#1c3a2f] hover:text-[#1c3a2f] transition-all flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer mt-2"
          >
            <Plus className="w-4 h-4 text-[#6ee7b7]" />
            Add Rule
          </button>

          <div className="flex items-center gap-2 text-[11px] text-canopy-text/60 pt-3 border-t border-gray-50 mt-4 select-none">
            <Info className="w-4 h-4 text-canopy-text/40 flex-shrink-0" />
            <span>A user must match <strong className="text-canopy-text font-bold uppercase">ALL</strong> rules to be included in this segment.</span>
          </div>
        </div>
      </form>
    </div>
  );
}
