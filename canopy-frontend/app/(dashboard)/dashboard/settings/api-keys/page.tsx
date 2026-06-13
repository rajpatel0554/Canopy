"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Trash2, 
  Key, 
  Copy, 
  Check, 
  X, 
  Loader2,
  CheckCircle,
  AlertTriangle,
  FileCode,
  Shield,
  ArrowRight,
  Info,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  name: string;
  token: string;
  created: string;
  lastUsed: string;
  status?: "Active" | "Revoked";
  environment?: "Production" | "Development";
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"All" | "Active" | "Revoked">("All");

  // New key reveal card state
  const [newKeyReveal, setNewKeyReveal] = useState<ApiKey | null>(null);

  // Copy toast status
  const [copiedToast, setCopiedToast] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("canopy-api-keys-v2");
    if (saved) {
      try {
        const parsed: ApiKey[] = JSON.parse(saved);
        const mapped = parsed.map(k => ({
          ...k,
          status: k.status || "Active",
          environment: k.environment || (k.token.includes("_test") ? "Development" : "Production")
        }));
        setKeys(mapped);
      } catch (e) {
        console.error("Failed to parse saved API keys:", e);
      }
    } else {
      const defaultKeys: ApiKey[] = [
        {
          id: "k_prod",
          name: "Prod-Backend-Service",
          token: `ck_live_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`,
          created: "Oct 24, 2024",
          lastUsed: "2 mins ago",
          status: "Active",
          environment: "Production"
        },
        {
          id: "k_dev",
          name: "Dev-Local-Testing",
          token: `ck_test_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`,
          created: "Sep 12, 2024",
          lastUsed: "14 days ago",
          status: "Active",
          environment: "Development"
        }
      ];
      setKeys(defaultKeys);
      localStorage.setItem("canopy-api-keys-v2", JSON.stringify(defaultKeys));
    }
  }, []);

  const filteredKeys = keys.filter((k) => {
    const matchesSearch = 
      k.name.toLowerCase().includes(search.toLowerCase()) ||
      k.token.toLowerCase().includes(search.toLowerCase());

    const activeStatus = k.status || "Active";
    if (filterTab === "All") return matchesSearch;
    return matchesSearch && activeStatus === filterTab;
  });

  const handleRevoke = (id: string, name: string) => {
    const confirm = window.confirm(`Are you sure you want to revoke the API Key "${name}"?`);
    if (!confirm) return;

    const updated = keys.map((k) => {
      if (k.id === id) {
        return {
          ...k,
          status: "Revoked" as const
        };
      }
      return k;
    });

    setKeys(updated);
    localStorage.setItem("canopy-api-keys-v2", JSON.stringify(updated));
    toast.success(`API Key "${name}" successfully revoked`);
  };

  const handleCreateKey = () => {
    const newKeyName = prompt("Enter a name for the new API Key:");
    if (!newKeyName) return;

    const isProd = window.confirm("Is this key for the Production environment? (Click Cancel for Development)");
    const environment = isProd ? "Production" : "Development";
    const prefix = isProd ? "ck_live" : "ck_test";

    const newKey: ApiKey = {
      id: `k_${Date.now()}`,
      name: newKeyName,
      token: `${prefix}_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`,
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lastUsed: "Never",
      status: "Active",
      environment
    };

    const updated = [...keys, newKey];
    setKeys(updated);
    localStorage.setItem("canopy-api-keys-v2", JSON.stringify(updated));
    setNewKeyReveal(newKey);
    toast.success(`API Key "${newKeyName}" successfully created`);
  };

  const handleCopyKey = (tokenVal: string) => {
    navigator.clipboard.writeText(tokenVal);
    setCopiedToast(true);
    setTimeout(() => {
      setCopiedToast(false);
    }, 2500);
  };

  const downloadEnv = (key: ApiKey) => {
    const content = `# Canopy environment key\nCANOPY_API_KEY=${key.token}\n`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "canopy.env";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded canopy.env file successfully!");
  };

  const obscureToken = (token: string) => {
    const prefix = token.substring(0, 8);
    return `${prefix}••••${token.substring(token.length - 4)}`;
  };

  return (
    <div className="max-w-[800px] mx-auto flex flex-col gap-6 relative">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="brand-font text-2xl font-bold text-[#1c3a2f]">API Keys</h1>
          <p className="text-xs text-canopy-text/70 mt-1">
            Manage your environment-specific credentials to authenticate with the Canopy API.
          </p>
        </div>

        <button
          onClick={handleCreateKey}
          className="flex items-center gap-1.5 bg-[#1c3a2f] text-white hover:bg-[#152c24] active:scale-95 transition-all text-xs font-semibold p-[9px_16px] rounded-lg cursor-pointer border-none outline-none"
        >
          <Plus className="w-4 h-4 text-[#6ee7b7]" />
          Create API Key
        </button>
      </div>

      {/* 2. New Key Reveal Banner */}
      {newKeyReveal && (
        <div className="bg-[#e8f5ee] border border-[#a7f3d0] rounded-xl p-4 flex flex-col gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>API key created</span>
          </div>
          <div className="bg-white/50 border border-[#a7f3d0]/30 rounded-lg p-3 flex items-start gap-3 text-xs text-emerald-900">
            <Info className="w-4 h-4 text-[#1c3a2f] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">Copy this key now</p>
              <p className="text-emerald-800/80">For security reasons, we cannot show this key again once you leave this page.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 bg-white border border-[#a7f3d0] px-3 py-2 rounded-lg flex items-center justify-between font-mono text-xs select-all text-canopy-text">
              <code>{newKeyReveal.token}</code>
              <button
                onClick={() => handleCopyKey(newKeyReveal.token)}
                className="p-1 hover:bg-linen/50 text-canopy-text/50 hover:text-canopy-text rounded transition-colors border-none bg-transparent cursor-pointer"
                title="Copy full key"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => downloadEnv(newKeyReveal)}
              className="bg-[#1c3a2f] text-[#6ee7b7] hover:bg-[#152c24] text-xs font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 border-none cursor-pointer"
            >
              <FileCode className="w-4 h-4" />
              .env
            </button>
            <button
              onClick={() => setNewKeyReveal(null)}
              className="border border-[#1c3a2f]/20 hover:bg-white text-canopy-text px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer bg-transparent"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 3. Usage Banner */}
      <div className="bg-white border border-canopy-border/20 rounded-xl overflow-hidden flex flex-col md:flex-row shadow-[0px_4px_12px_rgba(28,58,47,0.03)]">
        <div className="md:w-1/2 bg-[#1c3a2f] p-4 font-mono text-[11px] text-white/90 overflow-x-auto">
          <div className="flex items-center gap-1.5 mb-3 opacity-30 select-none">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          </div>
          <pre className="leading-relaxed">
            <span className="text-[#6ee7b7]">curl</span> -X POST https://api.canopy.com/evaluate \<br/>
            {"  -H "}
            <span className="text-[#a6f2cf]">
              &quot;Authorization: Bearer <span className="bg-white/10 px-1.5 py-0.5 rounded font-bold">YOUR_KEY</span>&quot;
            </span>{" \\"}<br/>
            {"  -H "}
            <span className="text-[#a6f2cf]">&quot;Content-Type: application/json&quot;</span>{" \\"}<br/>
            {"  -d "}<span className="text-[#a6f2cf]">&#x27;{"{"}</span><br/>
            {"    "}<span className="text-[#a6f2cf]">&quot;flag&quot;:</span> <span className="text-[#6ee7b7]">&quot;new_dashboard_v2&quot;</span>,<br/>
            {"    "}<span className="text-[#a6f2cf]">&quot;user_id&quot;:</span> <span className="text-[#6ee7b7]">&quot;user_882&quot;</span><br/>
            {"  &#x27;"}
          </pre>
        </div>
        <div className="md:w-1/2 p-4 flex flex-col justify-center gap-1 bg-white">
          <h3 className="font-semibold text-[13.5px] text-[#1c3a2f]">Fast Integration</h3>
          <p className="text-xs text-canopy-text/60 leading-relaxed mb-2">
            Our lightweight evaluation API returns responses in less than 10 milliseconds.
          </p>
          <a className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:underline cursor-pointer">
            View Documentation
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 4. API Keys Table */}
      <div className="bg-white border border-canopy-border/20 rounded-xl shadow-[0px_4px_12px_rgba(28,58,47,0.03)] overflow-hidden">
        {/* Table Header Filter */}
        <div className="p-4 border-b border-canopy-border/10 flex justify-between items-center bg-white/50">
          <h3 className="font-semibold text-xs text-[#1c3a2f] uppercase tracking-wider">Your API Keys</h3>
          <div className="flex bg-[#f7f7f2] rounded-lg p-0.5 border border-canopy-border/20">
            {(["All", "Active", "Revoked"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1 font-semibold text-[11px] rounded-md transition-all border-none cursor-pointer ${
                  filterTab === tab
                    ? "bg-white text-[#1c3a2f] shadow-sm"
                    : "text-canopy-text/50 bg-transparent hover:text-canopy-text"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input bar */}
        <div className="p-4 border-b border-canopy-border/10 flex items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-canopy-text/45" />
            <input
              type="text"
              placeholder="Search keys..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs bg-white border border-canopy-border/20 rounded-lg focus:outline-none focus:border-[#1c3a2f] w-full text-canopy-text font-sans"
            />
          </div>
        </div>

        {/* Table Component */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#f7f7f2]/50 border-b border-canopy-border/20 text-[10.5px] font-bold text-canopy-text/50 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Key</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Last Used</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canopy-border/10 text-canopy-text">
              {filteredKeys.length > 0 ? (
                filteredKeys.map((k) => {
                  const statusVal = k.status || "Active";
                  const envVal = k.environment || "Production";
                  const isRevoked = statusVal === "Revoked";

                  return (
                    <tr key={k.id} className="hover:bg-linen/10 transition-colors group">
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className={`font-semibold ${isRevoked ? "line-through text-canopy-text/50" : "text-[#1c3a2f]"}`}>
                            {k.name}
                          </span>
                          <span className={`text-[9.5px] font-bold uppercase w-fit px-1.5 py-0.2 rounded border ${
                            envVal === "Production"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-blue-50 text-blue-700 border-blue-100"
                          }`}>
                            {envVal}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <code className="font-mono text-[10.5px] text-canopy-text/60 bg-linen/40 px-2 py-0.5 rounded border border-canopy-border/5">
                          {obscureToken(k.token)}
                        </code>
                      </td>
                      <td className="px-4 py-4 text-canopy-text/70">{k.created}</td>
                      <td className="px-4 py-4 text-canopy-text/70">{k.lastUsed}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${
                            isRevoked 
                              ? "bg-gray-300" 
                              : "bg-emerald-400 animate-pulse"
                          }`} />
                          <span className={`font-semibold text-[11px] ${
                            isRevoked ? "text-canopy-text/50" : "text-emerald-700"
                          }`}>
                            {statusVal}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!isRevoked ? (
                            <>
                              <button
                                onClick={() => handleCopyKey(k.token)}
                                className="p-1.5 hover:bg-linen/50 text-canopy-text/50 hover:text-canopy-text rounded transition-colors border-none bg-transparent cursor-pointer"
                                title="Copy Key"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleRevoke(k.id, k.name)}
                                className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded transition-colors border-none bg-transparent cursor-pointer"
                                title="Revoke Key"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <span className="p-1.5" title="No actions on revoked keys">
                              <Clock className="w-3.5 h-3.5 text-canopy-text/30" />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-canopy-text/50 bg-[#f7f7f2]/10">
                    No API keys found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 bg-[#f7f7f2]/30 border-t border-canopy-border/10 flex items-center justify-between text-xs text-canopy-text/60">
          <span>Showing {filteredKeys.length} of {keys.length} keys</span>
          <button className="font-bold text-emerald-800 hover:underline cursor-pointer border-none bg-transparent">
            View Audit Log
          </button>
        </div>
      </div>

      {/* 5. Security Notice */}
      <footer className="bg-white border border-canopy-border/20 rounded-xl p-4 shadow-[0px_4px_12px_rgba(28,58,47,0.03)] flex items-start gap-4">
        <div className="bg-[#e8f5ee] p-2.5 rounded-lg text-emerald-800 shrink-0">
          <Shield className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="font-semibold text-xs text-[#1c3a2f]">Best Practices for API Security</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-canopy-text/70">
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#6ee7b7]"></span>
              Never commit keys to version control.
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#6ee7b7]"></span>
              Use different keys for environments.
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#6ee7b7]"></span>
              Rotate keys at least every 90 days.
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#6ee7b7]"></span>
              Restrict keys to specific IP ranges.
            </li>
          </ul>
        </div>
      </footer>

      {/* Slide-in Copy Toast Component */}
      <div 
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1c3a2f] text-[#6ee7b7] px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 z-50 pointer-events-none border border-[#6ee7b7]/20 transition-all duration-300 transform ${
          copiedToast ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
        }`}
      >
        <Check className="w-4 h-4 text-[#6ee7b7]" />
        <span className="text-xs font-semibold">Key copied to clipboard</span>
      </div>
    </div>
  );
}
