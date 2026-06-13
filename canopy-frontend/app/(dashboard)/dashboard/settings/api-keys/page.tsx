"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Trash2, Key } from "lucide-react";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  name: string;
  token: string;
  created: string;
  lastUsed: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [search, setSearch] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("canopy-api-keys-v2");
    if (saved) {
      try {
        setKeys(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved API keys:", e);
      }
    } else {
      setKeys([]);
      localStorage.setItem("canopy-api-keys-v2", JSON.stringify([]));
    }
  }, []);

  const filteredKeys = keys.filter(
    (k) =>
      k.name.toLowerCase().includes(search.toLowerCase()) ||
      k.token.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    const updated = keys.filter((k) => k.id !== id);
    setKeys(updated);
    localStorage.setItem("canopy-api-keys-v2", JSON.stringify(updated));
    toast.success(`API Key "${name}" successfully deleted`);
  };

  const handleCreateKey = () => {
    const newKeyName = prompt("Enter a name for the new API Key:");
    if (!newKeyName) return;

    const newKey: ApiKey = {
      id: `k_${Date.now()}`,
      name: newKeyName,
      token: `cnpy_live_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`,
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lastUsed: "Never",
    };

    const updated = [...keys, newKey];
    setKeys(updated);
    localStorage.setItem("canopy-api-keys-v2", JSON.stringify(updated));
    toast.success(`API Key "${newKeyName}" successfully created`);
  };

  const obscureToken = (token: string) => {
    const prefix = token.substring(0, 10);
    return `${prefix}••••••••••••••••••••`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="brand-font text-2xl font-bold text-[#1c3a2f]">API Keys</h1>
          <p className="text-xs text-canopy-text/70 mt-1">
            Keys for integrating the Canopy SDK into your applications
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-canopy-text/45" />
            <input
              type="text"
              placeholder="Search keys..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-white border border-canopy-border/20 rounded-lg focus:outline-none focus:border-[#1c3a2f] w-full md:w-60 text-canopy-text font-sans"
            />
          </div>

          <button
            onClick={handleCreateKey}
            className="flex items-center gap-1.5 bg-[#1c3a2f] text-white hover:bg-[#152c24] active:scale-95 transition-all text-xs font-semibold p-[9px_16px] rounded-lg"
          >
            <Plus className="w-4 h-4 text-[#6ee7b7]" />
            New Key
          </button>
        </div>
      </div>

      {/* Keys Table */}
      <div className="bg-white border border-canopy-border/20 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-5 p-[10px_16px] border-b border-canopy-border/20 bg-[#f7f7f2]">
          <span className="text-[11px] font-semibold text-canopy-text/60 uppercase tracking-wider col-span-2">Name / Token</span>
          <span className="text-[11px] font-semibold text-canopy-text/60 uppercase tracking-wider">Created</span>
          <span className="text-[11px] font-semibold text-canopy-text/60 uppercase tracking-wider">Last used</span>
          <span className="text-[11px] font-semibold text-canopy-text/60 uppercase tracking-wider text-right"></span>
        </div>

        {/* Table Rows */}
        {filteredKeys.length > 0 ? (
          filteredKeys.map((k) => (
            <div
              key={k.id}
              className="grid grid-cols-5 p-[12px_16px] border-b border-canopy-border/20 align-center items-center hover:bg-linen/20 transition-colors"
            >
              <div className="col-span-2">
                <div className="text-[13.5px] font-semibold text-[#1c3a2f] flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-canopy-text/50" />
                  {k.name}
                </div>
                <div
                  className="font-mono text-[11.5px] text-canopy-text/50 mt-0.5 cursor-pointer hover:text-[#1c3a2f]"
                  onClick={() => {
                    navigator.clipboard.writeText(k.token);
                    toast.success(`Copied key "${k.name}" to clipboard`);
                  }}
                  title="Click to copy full key"
                >
                  {obscureToken(k.token)}
                </div>
              </div>

              <div className="text-sm text-canopy-text/75">{k.created}</div>

              <div className="text-sm text-canopy-text/75">{k.lastUsed}</div>

              <div className="text-right">
                <button
                  onClick={() => handleDelete(k.id, k.name)}
                  className="bg-transparent border-none outline-none cursor-pointer text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-[16px] h-[16px] inline-block" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-sm text-canopy-text/50">No API keys found.</div>
        )}
      </div>
    </div>
  );
}
