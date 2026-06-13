"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Building, 
  User, 
  Key, 
  AlertTriangle, 
  AlertCircle, 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  Lock, 
  Loader2,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { flagsApi } from "@/lib/api";

interface ApiKey {
  id: string;
  name: string;
  token: string;
  created: string;
  lastUsed: string;
}

interface SettingsClientProps {
  initialOrgName: string;
  initialOrgSlug: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
  initialSection: "organization" | "profile" | "api-keys" | "danger-zone";
  token?: string;
}

export default function SettingsClient({
  initialOrgName,
  initialOrgSlug,
  user,
  initialSection,
  token
}: SettingsClientProps) {
  // Org Form
  const [orgName, setOrgName] = useState(initialOrgName);
  
  // Profile Form
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  
  // Passwords
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // API Keys
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [search, setSearch] = useState("");
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Active Nav Section
  const [activeSec, setActiveSec] = useState<"organization" | "profile" | "api-keys" | "danger-zone">(initialSection);

  // Modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmSlug, setConfirmSlug] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Load API Keys from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("canopy-api-keys-v2");
    if (saved) {
      try {
        setKeys(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved API keys:", e);
      }
    } else {
      const defaultKeys: ApiKey[] = [
        {
          id: "k_prod",
          name: "Production Key",
          token: `cnpy_live_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`,
          created: "Jan 15, 2026",
          lastUsed: "Never",
        },
        {
          id: "k_dev",
          name: "Development Key",
          token: `cnpy_test_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`,
          created: "Jan 15, 2026",
          lastUsed: "Never",
        }
      ];
      setKeys(defaultKeys);
      localStorage.setItem("canopy-api-keys-v2", JSON.stringify(defaultKeys));
    }
  }, []);

  // Smooth Scroll on mount or click
  const scrollToSection = (id: typeof activeSec) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Header offset
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSec(id);
    }
  };

  useEffect(() => {
    if (initialSection) {
      const timer = setTimeout(() => {
        const element = document.getElementById(initialSection);
        if (element) {
          const yOffset = -80;
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "instant" as any });
          setActiveSec(initialSection);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [initialSection]);

  // Track scroll position to update active sub-navigation state
  useEffect(() => {
    const sections = ["organization", "profile", "api-keys", "danger-zone"];
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSec(entry.target.id as any);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Password strength logic
  const getPasswordStrength = () => {
    if (!newPassword) return { percent: 0, text: "", color: "bg-gray-200" };
    if (newPassword.length < 6) return { percent: 25, text: "Weak password", color: "bg-red-500" };
    if (newPassword.length < 10) return { percent: 60, text: "Good password", color: "bg-amber-500" };
    return { percent: 100, text: "Strong password", color: "bg-emerald-500" };
  };
  const passwordStrength = getPasswordStrength();

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    toast.success("Password updated successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) {
      toast.error("Organization name cannot be empty");
      return;
    }
    toast.success("Organization settings saved successfully");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profileEmail.trim()) {
      toast.error("Name and Email are required");
      return;
    }
    toast.success("Profile settings saved successfully");
  };

  // API Key handlers
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

  const handleDeleteKey = (id: string, name: string) => {
    const updated = keys.filter((k) => k.id !== id);
    setKeys(updated);
    localStorage.setItem("canopy-api-keys-v2", JSON.stringify(updated));
    toast.success(`API Key "${name}" successfully deleted`);
  };

  const handleCopyKey = (id: string, tokenVal: string, name: string) => {
    navigator.clipboard.writeText(tokenVal);
    toast.success(`Copied key "${name}" to clipboard`);
    setCopiedKeyId(id);
    setTimeout(() => {
      setCopiedKeyId(null);
    }, 2000);
  };

  const obscureToken = (token: string) => {
    const prefix = token.substring(0, 10);
    return `${prefix}••••••••••••••••••••`;
  };

  const filteredKeys = keys.filter(
    (k) =>
      k.name.toLowerCase().includes(search.toLowerCase()) ||
      k.token.toLowerCase().includes(search.toLowerCase())
  );

  // Danger Zone Handlers
  const handlePurgeFlags = async () => {
    const confirm = window.confirm("Are you absolutely sure you want to purge all feature flags? This cannot be undone.");
    if (!confirm) return;

    if (!token) {
      toast.success("Mock: All feature flags successfully purged");
      return;
    }

    try {
      const list = await flagsApi.getAll(token);
      if (list.length === 0) {
        toast.info("No feature flags found to purge.");
        return;
      }
      await Promise.all(list.map(f => flagsApi.delete(f.key, token)));
      toast.success("All feature flags purged successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to purge flags");
    }
  };

  const openDeleteModal = () => {
    setConfirmSlug("");
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteOrg = () => {
    if (confirmSlug.toLowerCase() !== initialOrgSlug.toLowerCase()) {
      toast.error(`Please type "${initialOrgSlug}" to confirm.`);
      return;
    }
    setDeleting(true);
    setTimeout(() => {
      toast.success("Organization successfully deleted.");
      localStorage.clear();
      window.location.href = "/register";
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] relative">
      {/* Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Column Navigation (Local Nav) */}
        <aside className="w-full lg:w-[220px] sticky top-[80px] z-10 bg-[#f7f7f2] py-2 lg:py-0">
          <div className="bg-white rounded-xl border border-canopy-border/20 overflow-hidden shadow-[0px_4px_12px_rgba(28,58,47,0.05)]">
            <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible">
              <button 
                onClick={() => scrollToSection("organization")}
                className={`flex-1 lg:flex-initial px-5 py-3 text-left font-semibold text-xs flex items-center gap-2.5 transition-all border-b-2 lg:border-b-0 lg:border-r-4 ${
                  activeSec === "organization" 
                    ? "bg-[#f1f3ff] text-[#1c3a2f] border-[#1c3a2f]" 
                    : "text-canopy-text/60 border-transparent hover:bg-linen/30"
                }`}
              >
                <Building className="w-4 h-4" />
                Organization
              </button>
              <button 
                onClick={() => scrollToSection("profile")}
                className={`flex-1 lg:flex-initial px-5 py-3 text-left font-semibold text-xs flex items-center gap-2.5 transition-all border-b-2 lg:border-b-0 lg:border-r-4 ${
                  activeSec === "profile" 
                    ? "bg-[#f1f3ff] text-[#1c3a2f] border-[#1c3a2f]" 
                    : "text-canopy-text/60 border-transparent hover:bg-linen/30"
                }`}
              >
                <User className="w-4 h-4" />
                Profile
              </button>
              <button 
                onClick={() => scrollToSection("api-keys")}
                className={`flex-1 lg:flex-initial px-5 py-3 text-left font-semibold text-xs flex items-center gap-2.5 transition-all border-b-2 lg:border-b-0 lg:border-r-4 ${
                  activeSec === "api-keys" 
                    ? "bg-[#f1f3ff] text-[#1c3a2f] border-[#1c3a2f]" 
                    : "text-canopy-text/60 border-transparent hover:bg-linen/30"
                }`}
              >
                <Key className="w-4 h-4" />
                API Keys
              </button>
              <div className="hidden lg:block h-[1px] bg-canopy-border/20 my-1" />
              <button 
                onClick={openDeleteModal}
                className="flex-1 lg:flex-initial px-5 py-3 text-left font-semibold text-xs text-red-600 flex items-center gap-2.5 transition-all border-b-2 lg:border-b-0 lg:border-r-4 border-transparent hover:bg-red-50"
              >
                <AlertTriangle className="w-4 h-4" />
                Danger Zone
              </button>
            </nav>
          </div>
        </aside>

        {/* Right Column Content */}
        <div className="flex-1 w-full space-y-6 pb-24">
          
          {/* SECTION: ORGANIZATION */}
          <section id="organization" className="bg-white rounded-xl border border-canopy-border/20 shadow-[0px_4px_12px_rgba(28,58,47,0.05)] overflow-hidden">
            <div className="px-6 py-4 border-b border-canopy-border/10 flex justify-between items-center bg-[#f7f7f2]/40">
              <h2 className="font-semibold text-[13.5px] text-[#1c3a2f] flex items-center gap-2">
                <Building className="w-4 h-4 text-canopy-text/50" />
                Organization
              </h2>
              <button 
                onClick={handleSaveOrg}
                className="bg-[#1c3a2f] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#152c24] transition-colors cursor-pointer border-none"
              >
                Save Changes
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-canopy-text/80">Organization Name</label>
                  <input 
                    type="text" 
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full bg-white border border-canopy-border/30 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1c3a2f] text-canopy-text font-sans"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-canopy-text/80">Slug</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={initialOrgSlug}
                      readOnly
                      className="w-full bg-[#f7f7f2] border border-canopy-border/10 text-canopy-text/50 rounded-lg px-3 py-2 text-xs cursor-not-allowed italic font-sans focus:outline-none"
                    />
                    <Lock className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-canopy-text/30" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-canopy-border/10">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-canopy-text/80">Active Plan</label>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Free Plan
                    </span>
                    <a className="text-emerald-700 font-semibold text-[11px] hover:underline" href="#">
                      Upgrade Plan →
                    </a>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-canopy-text/80">Created</label>
                  <span className="text-xs text-canopy-text/65 py-1">January 2026</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: PROFILE */}
          <section id="profile" className="bg-white rounded-xl border border-canopy-border/20 shadow-[0px_4px_12px_rgba(28,58,47,0.05)] overflow-hidden">
            <div className="px-6 py-4 border-b border-canopy-border/10 flex justify-between items-center bg-[#f7f7f2]/40">
              <h2 className="font-semibold text-[13.5px] text-[#1c3a2f] flex items-center gap-2">
                <User className="w-4 h-4 text-canopy-text/50" />
                Profile
              </h2>
              <button 
                onClick={handleSaveProfile}
                className="bg-[#1c3a2f] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#152c24] transition-colors cursor-pointer border-none"
              >
                Save Changes
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-canopy-text/80">Full Name</label>
                  <input 
                    type="text" 
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-white border border-canopy-border/30 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1c3a2f] text-canopy-text font-sans"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-canopy-text/80">Email Address</label>
                  <input 
                    type="email" 
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full bg-white border border-canopy-border/30 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1c3a2f] text-canopy-text font-sans"
                  />
                </div>
              </div>

              {/* Change Password Sub-section */}
              <div className="pt-6 border-t border-canopy-border/10">
                <h3 className="font-bold text-[#1c3a2f] text-[12.5px] mb-4">Change Password</h3>
                <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-canopy-text/80">Current Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-white border border-canopy-border/30 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1c3a2f] text-canopy-text"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-canopy-text/80">New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white border border-canopy-border/30 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1c3a2f] text-canopy-text"
                    />
                    {newPassword && (
                      <div className="space-y-1.5 mt-1">
                        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${passwordStrength.color} transition-all duration-300`} 
                            style={{ width: `${passwordStrength.percent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-canopy-text/50 font-bold uppercase">
                          {passwordStrength.text}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-canopy-text/80">Confirm New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white border border-canopy-border/30 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1c3a2f] text-canopy-text"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="border border-[#1c3a2f] text-[#1c3a2f] hover:bg-[#1c3a2f]/5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer bg-white"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* SECTION: API KEYS */}
          <section id="api-keys" className="bg-white rounded-xl border border-canopy-border/20 shadow-[0px_4px_12px_rgba(28,58,47,0.05)] overflow-hidden">
            <div className="px-6 py-4 border-b border-canopy-border/10 flex justify-between items-center bg-[#f7f7f2]/40">
              <h2 className="font-semibold text-[13.5px] text-[#1c3a2f] flex items-center gap-2">
                <Key className="w-4 h-4 text-canopy-text/50" />
                API Keys
              </h2>
              <button 
                onClick={handleCreateKey}
                className="bg-[#1c3a2f] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#152c24] transition-colors flex items-center gap-1.5 cursor-pointer border-none"
              >
                <Plus className="w-3.5 h-3.5 text-[#6ee7b7]" />
                Generate New Key
              </button>
            </div>
            <div className="p-6 space-y-4">
              
              {/* Search Bar for Keys */}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search API keys..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-3 pr-4 py-1.5 text-xs bg-white border border-canopy-border/20 rounded-lg focus:outline-none focus:border-[#1c3a2f] w-full md:w-60 text-canopy-text font-sans"
                />
              </div>

              {/* API Key Rows */}
              <div className="space-y-3">
                {filteredKeys.length > 0 ? (
                  filteredKeys.map((k) => (
                    <div 
                      key={k.id} 
                      className="flex items-center justify-between p-4 bg-[#f7f7f2]/40 rounded-lg border border-canopy-border/10 group"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-xs text-canopy-text">{k.name}</span>
                        <code className="font-mono text-[10.5px] text-canopy-text/60 bg-white px-2 py-1 rounded border border-canopy-border/5">
                          {obscureToken(k.token)}
                        </code>
                      </div>
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleCopyKey(k.id, k.token, k.name)}
                          className="p-2 hover:bg-emerald-50 text-emerald-700 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                          title="Copy Key"
                        >
                          {copiedKeyId === k.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-emerald-700" />
                          )}
                        </button>
                        <button 
                          onClick={() => handleDeleteKey(k.id, k.name)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                          title="Delete Key"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-canopy-text/50 bg-[#f7f7f2]/20 border border-dashed border-canopy-border/15 rounded-lg">
                    No API keys found.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SECTION: DANGER ZONE */}
          <section id="danger-zone" className="bg-white rounded-xl border border-red-200 shadow-[0px_4px_12px_rgba(220,38,38,0.05)] overflow-hidden">
            <div className="px-6 py-4 border-b border-red-100 flex items-center gap-2 bg-red-50/20">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <h2 className="font-bold text-[13.5px] text-red-600">Danger Zone</h2>
            </div>
            <div className="p-6 space-y-4">
              
              {/* Purge Flags */}
              <div className="flex items-center justify-between py-4 border-b border-canopy-border/10">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-xs text-canopy-text">Delete All Feature Flags</span>
                  <span className="text-[11px] text-canopy-text/55">Immediately disable and permanently remove all flags in this organization.</span>
                </div>
                <button 
                  onClick={handlePurgeFlags}
                  className="border border-red-600 text-red-600 px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors uppercase tracking-wider cursor-pointer bg-white"
                >
                  Purge Flags
                </button>
              </div>

              {/* Delete Organization */}
              <div className="flex items-center justify-between py-4">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-xs text-canopy-text">Delete Organization</span>
                  <span className="text-[11px] text-canopy-text/55">This action is permanent and cannot be undone. All data will be lost.</span>
                </div>
                <button 
                  onClick={openDeleteModal}
                  className="bg-red-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors uppercase tracking-wider cursor-pointer border-none"
                >
                  Delete Forever
                </button>
              </div>

              {/* Warning Alert */}
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-700 mt-0.5 shrink-0" />
                <p className="text-[10.5px] text-red-800 leading-relaxed">
                  <strong>Warning:</strong> Deleting an organization will terminate all active API keys and clear all configurations. Please ensure you have exported any critical data before proceeding.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={closeDeleteModal}
          />

          {/* Modal Container */}
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#1c3a2f] text-lg mb-2">Delete Organization</h3>
              <p className="text-canopy-text/70 text-xs leading-relaxed mb-6">
                This will permanently delete the organization <span className="font-bold text-canopy-text">{initialOrgSlug}</span> and all associated data. This action is irreversible.
              </p>
              
              <div className="w-full text-left space-y-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-canopy-text uppercase tracking-wider">Confirm Name</label>
                  <p className="text-[11px] text-canopy-text/50">
                    To confirm, please type <span className="font-mono bg-[#f7f7f2] px-1.5 py-0.5 rounded text-[#1c3a2f] font-semibold">{initialOrgSlug}</span> below:
                  </p>
                  <input 
                    type="text"
                    placeholder="Type organization slug here"
                    value={confirmSlug}
                    onChange={(e) => setConfirmSlug(e.target.value)}
                    className="w-full border border-canopy-border/20 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-600 text-canopy-text font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 w-full mt-6">
                <button 
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 rounded-lg border border-canopy-border/20 font-semibold text-xs hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 bg-white"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteOrg}
                  disabled={deleting || confirmSlug.toLowerCase() !== initialOrgSlug.toLowerCase()}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 border-none"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Forever"
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
