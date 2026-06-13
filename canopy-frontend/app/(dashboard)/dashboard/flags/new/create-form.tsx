"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  CheckCircle, 
  ToggleRight, 
  Type, 
  Hash, 
  Braces, 
  Percent, 
  Zap, 
  Ban, 
  Lightbulb, 
  Info, 
  Copy, 
  Loader2 
} from "lucide-react";
import { toast } from "sonner";
import { flagsApi } from "@/lib/api";
import type { VariationType } from "@/types";

interface CreateFlagFormProps {
  token?: string;
}

export default function CreateFlagForm({ token }: CreateFlagFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [variationType, setVariationType] = useState<VariationType>("BOOLEAN");
  const [rolloutPercentage, setRolloutPercentage] = useState(10);
  const [enabled, setEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const syncSlug = (val: string) => {
    setName(val);
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setKey(slug);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Flag name is required");
      return;
    }

    const flagKey = key || "flag-key-preview";

    startTransition(async () => {
      try {
        if (!token) {
          // Mock mode
          await new Promise((resolve) => setTimeout(resolve, 1000));
          toast.success(`Mock: Flag "${name}" created successfully!`);
          router.push("/dashboard/flags");
          router.refresh();
          return;
        }

        // 1. Create the feature flag (backend sets it to enabled: false initially)
        const createdFlag = await flagsApi.create(
          {
            key: flagKey,
            name,
            description: description || undefined,
            variationType,
            rolloutPercentage,
          },
          token
        );

        // 2. If user selected enabled: true, immediately toggle it to match desired state
        if (enabled) {
          await flagsApi.toggle(createdFlag.key, token);
        }

        toast.success(`Flag "${name}" created successfully!`);
        router.push("/dashboard/flags");
        router.refresh();
      } catch (err: any) {
        setError(err.message || "Failed to create feature flag.");
        toast.error(err.message || "Failed to create feature flag.");
      }
    });
  };

  const displayKey = key || "new-user-dashboard";

  return (
    <div className="max-w-[1100px] mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link 
            href="/dashboard/flags"
            className="flex items-center gap-1.5 text-xs font-bold text-canopy-text/60 hover:text-[#1c3a2f] transition-colors mb-2 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Flags
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[#1c3a2f]">Create Feature Flag</h1>
          <p className="text-xs text-canopy-text/70 mt-1">
            Define a new toggle to control features across your environments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => toast.info("Draft is saved to memory automatically")}
            className="px-4 py-2 text-xs font-bold text-[#1c3a2f] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
          >
            Save as Draft
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSubmit()}
            className="flex items-center gap-1.5 bg-[#1c3a2f] text-white hover:bg-[#152c24] active:scale-95 transition-all text-xs font-bold px-4 py-2 rounded-lg disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-[#6ee7b7]" />
                Create Flag
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Form */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-[680px] space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {/* 1. Basic Info */}
          <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#1c3a2f] border-b border-gray-50 pb-2">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-canopy-text/60 mb-1.5 uppercase tracking-wider">Flag Name</label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => syncSlug(e.target.value)}
                  placeholder="e.g. New User Dashboard"
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#1c3a2f] focus:ring-1 focus:ring-[#1c3a2f] text-canopy-text font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-canopy-text/60 mb-1.5 uppercase tracking-wider">Flag Key</label>
                <div className="flex items-center bg-[#f7f7f2] border border-gray-100 rounded-lg px-3 py-2">
                  <span className="font-mono text-xs text-[#1c3a2f]/80">{displayKey}</span>
                  <div className="group relative ml-auto flex items-center">
                    <Info className="w-4 h-4 text-canopy-text/40 cursor-help" />
                    <span className="absolute right-0 bottom-6 hidden group-hover:block bg-forest text-white text-[10px] p-1.5 rounded shadow-lg whitespace-nowrap z-10">
                      Immutable identifier used in code
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-canopy-text/60 mb-1.5 uppercase tracking-wider">Description (Optional)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the purpose of this flag..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#1c3a2f] focus:ring-1 focus:ring-[#1c3a2f] text-canopy-text font-sans"
                />
              </div>
            </div>
          </div>

          {/* 2. Variation Type */}
          <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#1c3a2f] border-b border-gray-50 pb-2">Variation Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "BOOLEAN", label: "Boolean", desc: "True or False toggle", icon: ToggleRight },
                { id: "STRING", label: "String", desc: "Plain text values", icon: Type },
                { id: "NUMBER", label: "Number", desc: "Numeric variations", icon: Hash },
                { id: "JSON", label: "JSON", desc: "Structured data", icon: Braces },
              ].map((t) => {
                const IconComponent = t.icon;
                const isActive = variationType === t.id;
                return (
                  <div 
                    key={t.id}
                    onClick={() => setVariationType(t.id as VariationType)}
                    className={`cursor-pointer border-2 p-3 rounded-lg transition-all flex flex-col gap-1 ${
                      isActive 
                        ? "border-[#1c3a2f] bg-[#e8f5ee]/40" 
                        : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className={`w-4 h-4 ${isActive ? "text-[#1c3a2f]" : "text-canopy-text/50"}`} />
                      <span className="text-xs font-bold text-canopy-text">{t.label}</span>
                    </div>
                    <p className="text-[10.5px] text-canopy-text/60 leading-tight">{t.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Initial Rollout */}
          <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-gray-50 pb-2">
              <h3 className="font-serif text-lg font-semibold text-[#1c3a2f]">Initial Rollout</h3>
              <span className="font-mono text-sm font-bold text-[#1c3a2f]">{rolloutPercentage}%</span>
            </div>
            <div className="space-y-4">
              <input 
                type="range"
                min="0"
                max="100"
                value={rolloutPercentage}
                onChange={(e) => setRolloutPercentage(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1c3a2f]"
              />
              <div className="flex gap-2">
                {[0, 10, 50, 100].map((pct) => (
                  <button 
                    key={pct}
                    type="button"
                    onClick={() => setRolloutPercentage(pct)}
                    className={`flex-1 py-1 text-[10.5px] font-bold border rounded transition-colors cursor-pointer ${
                      rolloutPercentage === pct
                        ? "border-[#1c3a2f] bg-[#e8f5ee]/40 text-[#1c3a2f]"
                        : "border-gray-200 hover:bg-gray-50 text-canopy-text/70"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
              <div className="flex items-start gap-2.5 p-3 bg-[#e8f5ee]/40 border border-[#6ee7b7]/15 rounded-lg">
                <Percent className="w-4 h-4 text-[#1c3a2f] mt-0.5" />
                <p className="text-xs text-canopy-text/80 leading-normal">
                  {rolloutPercentage === 0 ? (
                    "This flag is hidden from all users."
                  ) : rolloutPercentage === 100 ? (
                    "This flag is rolled out to 100% of your user base."
                  ) : (
                    `This flag will be active for ${rolloutPercentage}% of users based on consistent hashing.`
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* 4. Initial State */}
          <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#1c3a2f] border-b border-gray-50 pb-2">Initial State</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { active: true, label: "Enabled", desc: "Flag is live immediately", icon: Zap, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
                { active: false, label: "Disabled", desc: "Evaluation returns default", icon: Ban, iconBg: "bg-gray-50", iconColor: "text-gray-500" },
              ].map((s) => {
                const IconComponent = s.icon;
                const isActive = enabled === s.active;
                return (
                  <div 
                    key={s.label}
                    onClick={() => setEnabled(s.active)}
                    className={`cursor-pointer border-2 p-4 rounded-lg transition-all flex items-center gap-3 ${
                      isActive 
                        ? "border-[#1c3a2f] bg-[#e8f5ee]/40" 
                        : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/30"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? "bg-white border border-[#6ee7b7]/20" : s.iconBg}`}>
                      <IconComponent className={`w-4 h-4 ${isActive ? "text-[#1c3a2f]" : s.iconColor}`} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-canopy-text block">{s.label}</span>
                      <p className="text-[10px] text-canopy-text/60 leading-tight mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </form>

        {/* Right Column - Preview Sidebar */}
        <aside className="w-full lg:w-[320px] space-y-6">
          <div className="sticky top-6 space-y-6">
            {/* Live Preview */}
            <div className="bg-[#1c3a2f] text-white p-5 rounded-xl shadow-lg border border-white/5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] font-bold text-[#6ee7b7] tracking-wider uppercase">Live Preview</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#6ee7b7] animate-pulse"></span>
              </div>
              <div className="bg-black/20 p-3 rounded-lg overflow-x-auto font-mono text-[11px] text-[#6ee7b7]/90 leading-normal">
                <pre>
                  {JSON.stringify({
                    key: displayKey,
                    name: name || "Untitled Flag",
                    type: variationType,
                    enabled: enabled,
                    rollout: rolloutPercentage
                  }, null, 2)}
                </pre>
              </div>
            </div>

            {/* API Endpoint Hint */}
            <div className="bg-[#1e201d] text-white p-5 rounded-xl space-y-2">
              <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase block">Usage Endpoint</span>
              <div className="bg-black/20 p-2.5 rounded border border-white/10 flex items-center justify-between font-mono text-[11px]">
                <code className="text-gray-300 truncate pr-2">POST /api/v1/eval/{displayKey}</code>
                <button 
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`POST /api/v1/eval/${displayKey}`);
                    toast.success("Endpoint copied to clipboard!");
                  }}
                  className="text-gray-400 hover:text-white flex-shrink-0 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Canopy Tips */}
            <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm space-y-3">
              <div className="flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <Lightbulb className="w-4 h-4 text-[#1c3a2f]" />
                <h4 className="text-xs font-bold text-canopy-text">Canopy Tips</h4>
              </div>
              <ul className="space-y-2 text-[11px] text-canopy-text/70 leading-normal list-disc list-inside">
                <li>Use action-oriented keys like <code className="bg-linen px-1 py-0.5 rounded font-mono text-[10px]">enable-beta-checkout</code>.</li>
                <li>Boolean flags are perfect for simple on/off switches.</li>
                <li>Start with a <code className="bg-linen px-1 py-0.5 rounded font-mono text-[10px]">10%</code> rollout to safely canary-test new code.</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
