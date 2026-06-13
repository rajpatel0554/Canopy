"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ToggleRight,
  Users,
  Key,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Sprout,
  Menu,
  X,
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
  user?: {
    email?: string | null;
    role?: string | null;
    tenantId?: string | null;
  };
}

export default function AppShell({ children, user }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const pathname = usePathname();
  const [animationKey, setAnimationKey] = useState(pathname);

  useEffect(() => {
    setAnimationKey(pathname);
  }, [pathname]);

  const userEmail = user?.email || "raj@acme-corp.io";
  const userRole = user?.role || "Admin";
  const tenantSlug = (user as any)?.tenantSlug || user?.tenantId || "acme-corp";
  const orgName = tenantSlug
    .split(/[-_]/)
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Load sidebar collapse preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setCollapsed(saved === "true");
    }
  }, []);

  const handleCollapseToggle = () => {
    const nextState = !collapsed;
    setCollapsed(nextState);
    localStorage.setItem("sidebar-collapsed", String(nextState));
  };

  const getInitials = (email: string) => {
    const parts = email.split("@")[0].split(/[._-]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(userEmail);

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      shortLabel: "DASH",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      id: "flags",
      label: "Feature Flags",
      shortLabel: "FLAGS",
      href: "/dashboard/flags",
      icon: ToggleRight,
      exact: false,
    },
    {
      id: "segments",
      label: "Segments",
      shortLabel: "SEGS",
      href: "/dashboard/segments",
      icon: Users,
      exact: false,
    },
    {
      id: "keys",
      label: "API Keys",
      shortLabel: "KEYS",
      href: "/dashboard/settings/api-keys",
      icon: Key,
      exact: true,
    },
    {
      id: "settings",
      label: "Settings",
      shortLabel: "CONF",
      href: "/dashboard/settings",
      icon: Settings,
      exact: true,
    },
  ];

  // Check if link is active
  const isLinkActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-linen select-none font-sans">
      {/* CSS Stylesheet Injector for Custom Spring Curve Animations */}
      <style>{`
        .sidebar-spring {
          transition: width 320ms cubic-bezier(0.34, 1.1, 0.64, 1), min-width 320ms cubic-bezier(0.34, 1.1, 0.64, 1);
        }
        .chevron-spring {
          transition: transform 320ms cubic-bezier(0.34, 1.1, 0.64, 1);
        }
        .label-full-fade {
          transition: opacity 160ms ease, width 220ms ease;
        }
        .label-short-fade {
          transition: opacity 180ms ease 80ms;
        }
        .mobile-drawer-transition {
          transition: transform 280ms cubic-bezier(0.34, 1.1, 0.64, 1);
        }
        
        /* Animation #3: Page content fade + lift */
        @keyframes fadeLift {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-lift {
          animation: fadeLift 220ms ease-out forwards;
        }

        /* Animation #5: Staggered stat cards */
        @keyframes statCardLift {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-stat-card {
          opacity: 0;
          animation: statCardLift 280ms ease-out forwards;
        }

        /* Animation #8: Badge status pop */
        @keyframes badgePop {
          0% {
            transform: scale(0.7);
          }
          70% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-badge-pop {
          animation: badgePop 320ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          display: inline-block;
        }

        /* Animation #7: Skeleton shimmer */
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .shimmer {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite linear;
        }
      `}</style>

      {/* DESKTOP SIDEBAR */}
      <div className="relative hidden md:flex h-full">
        <aside
          className={`sidebar-spring bg-[#1c3a2f] flex flex-col h-full border-r border-[#6ee7b7]/10 ${
            collapsed ? "w-[76px]" : "w-[200px]"
          }`}
        >
          {/* Zone 1 — Brand */}
          <div className="p-[16px_14px_12px] border-b border-[#6ee7b7]/12 flex items-center h-[54px] min-h-[54px]">
            <Link href="/dashboard" className="flex items-center gap-2.5 whitespace-nowrap overflow-hidden w-full">
              <div className="w-[30px] h-[30px] min-w-[30px] rounded-lg bg-[#6ee7b7]/15 flex items-center justify-center">
                <Sprout className="w-4 h-4 text-[#6ee7b7]" />
              </div>
              <span
                className={`label-full-fade brand-font text-base font-bold text-white tracking-[0.01em] ${
                  collapsed ? "opacity-0 w-0 pointer-events-none" : "opacity-100 w-auto"
                }`}
              >
                Can<span className="text-[#6ee7b7]">opy</span>
              </span>
            </Link>
          </div>

          {/* Zone 2 — Org Section */}
          <div className="p-[12px_14px] border-b border-[#6ee7b7]/12 flex flex-col justify-center min-h-[58px]">
            {!collapsed && (
              <div className="text-[10px] text-[#6ee7b7]/55 uppercase tracking-[0.08em] mb-1.5 whitespace-nowrap overflow-hidden">
                Organization
              </div>
            )}
            <div
              className={`flex items-center bg-[#6ee7b7]/10 rounded-[7px] overflow-hidden ${
                collapsed ? "p-1.5 justify-center" : "p-[7px_10px] gap-2"
              }`}
            >
              <div className="w-[7px] h-[7px] min-w-[7px] rounded-full bg-[#6ee7b7]" />
              <span
                className={`label-full-fade font-sans text-xs font-semibold text-[#a7f3d0] tracking-wide overflow-hidden text-overflow-ellipsis whitespace-nowrap ${
                  collapsed ? "opacity-0 w-0 pointer-events-none" : "opacity-100 w-auto"
                }`}
              >
                {orgName}
              </span>
            </div>
          </div>

          {/* Zone 3 — Navigation */}
          <nav className="flex-grow p-[10px_6px] flex flex-col gap-1 overflow-y-auto">
            {!collapsed && (
              <div className="text-[10px] text-[#6ee7b7]/40 uppercase tracking-[0.08em] p-[8px_8px_4px] whitespace-nowrap overflow-hidden">
                Menu
              </div>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isLinkActive(item);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex rounded-lg cursor-pointer transition-colors duration-[180ms] ${
                    collapsed ? "flex-col items-center justify-center p-2.5 gap-1" : "flex-row items-center p-[9px_10px] gap-[11px]"
                  } ${
                    isActive
                      ? "bg-white text-[#1c3a2f]"
                      : "text-white/65 hover:bg-[#6ee7b7]/8 hover:text-white"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-[18px] h-[18px] min-w-[18px] transition-colors ${
                      isActive ? "text-[#1c3a2f]" : "text-[#6ee7b7]/60"
                    }`}
                  />
                  
                  {/* Expanded Nav Label */}
                  <span
                    className={`label-full-fade text-[13.5px] whitespace-nowrap overflow-hidden ${
                      collapsed ? "opacity-0 w-0 h-0 pointer-events-none" : "opacity-100 w-auto"
                    } ${isActive ? "font-medium" : ""}`}
                  >
                    {item.label}
                  </span>

                  {/* Collapsed Nav Short Label */}
                  {collapsed && (
                    <span className="label-short-fade text-[9px] font-bold tracking-wider text-current opacity-100">
                      {item.shortLabel}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 4 — User Profile + Sign Out */}
          <div className="p-[12px_14px] border-t border-[#6ee7b7]/12 flex flex-col gap-2.5">
            <div className={`flex items-center gap-2.5 overflow-hidden ${collapsed ? "justify-center" : ""}`}>
              <div className="w-[26px] h-[26px] min-w-[26px] rounded-full bg-[#6ee7b7]/20 flex items-center justify-center text-[11px] text-[#6ee7b7] font-semibold">
                {initials}
              </div>
              <div
                className={`label-full-fade overflow-hidden flex flex-col ${
                  collapsed ? "opacity-0 w-0 pointer-events-none" : "opacity-100 w-auto"
                }`}
              >
                <span className="text-[11.5px] text-white/75 overflow-hidden text-overflow-ellipsis whitespace-nowrap" title={userEmail}>
                  {userEmail}
                </span>
                <span className="text-[10px] text-[#6ee7b7]/50">{userRole}</span>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className={`flex items-center rounded-md cursor-pointer text-white/45 hover:bg-red-500/12 hover:text-red-300 transition-colors w-full border-none bg-transparent ${
                collapsed ? "p-1.5 justify-center" : "p-[7px_10px] gap-2 text-left"
              }`}
            >
              <LogOut className="w-4 h-4 text-current min-w-[16px]" />
              <span
                className={`label-full-fade text-[12.5px] font-medium text-current whitespace-nowrap overflow-hidden ${
                  collapsed ? "opacity-0 w-0 pointer-events-none" : "opacity-100 w-auto"
                }`}
              >
                Sign out
              </span>
            </button>
          </div>
        </aside>

        {/* Collapse Toggle Button */}
        <button
          onClick={handleCollapseToggle}
          className="absolute top-1/2 -translate-y-1/2 -right-2.5 w-[22px] h-[22px] rounded-full bg-[#1c3a2f] border border-[#6ee7b7]/30 flex items-center justify-center cursor-pointer z-10 hover:bg-[#152c24] active:scale-95 transition-all text-[#6ee7b7]"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            className={`chevron-spring w-3.5 h-3.5 ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* MOBILE DRAWER SIDEBAR */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`mobile-drawer-transition fixed top-0 bottom-0 left-0 w-[240px] bg-[#1c3a2f] border-r border-[#6ee7b7]/10 flex flex-col z-50 md:hidden ${
          mobileOpen ? "transform translate-x-0" : "transform -translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="p-4 border-b border-[#6ee7b7]/12 flex items-center justify-between h-[54px]">
          <div className="flex items-center gap-2.5">
            <Sprout className="w-[18px] h-[18px] text-[#6ee7b7]" />
            <span className="brand-font text-[17px] font-bold text-white tracking-[0.01em]">
              Can<span className="text-[#6ee7b7]">opy</span>
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-[#6ee7b7] hover:bg-[#6ee7b7]/10 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Org name */}
        <div className="p-4 border-b border-[#6ee7b7]/12">
          <div className="text-[10px] text-[#6ee7b7]/55 uppercase tracking-[0.08em] mb-1.5">
            Organization
          </div>
          <div className="flex items-center gap-2 bg-[#6ee7b7]/10 rounded-md p-2">
            <div className="w-[7px] h-[7px] rounded-full bg-[#6ee7b7]" />
            <span className="font-sans text-xs font-semibold text-[#a7f3d0] tracking-wide">{orgName}</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-grow p-3 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isLinkActive(item);
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-[11px] rounded-lg p-[9px_10px] transition-colors duration-[180ms] ${
                  isActive
                    ? "bg-white text-[#1c3a2f]"
                    : "text-white/65 hover:bg-[#6ee7b7]/8 hover:text-white"
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${isActive ? "text-[#1c3a2f]" : "text-[#6ee7b7]/60"}`} />
                <span className={`text-[13.5px] ${isActive ? "font-semibold" : ""}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-[#6ee7b7]/12 flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#6ee7b7]/20 flex items-center justify-center text-[11px] text-[#6ee7b7] font-semibold">
              {initials}
            </div>
            <div>
              <div className="text-[12px] text-white/75 truncate w-[160px]">{userEmail}</div>
              <div className="text-[10.5px] text-[#6ee7b7]/55">{userRole}</div>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 rounded-md p-2 text-white/45 hover:bg-red-500/12 hover:text-red-300 transition-colors w-full border-none bg-transparent text-left"
          >
            <LogOut className="w-4 h-4 text-current" />
            <span className="text-[12.5px] font-medium text-current">Sign out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col bg-[#f7f7f2] h-full overflow-hidden">
        {/* Top Bar */}
        <header className="h-[54px] min-h-[54px] bg-white border-b border-canopy-border/20 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-[#1c3a2f] p-1 hover:bg-linen/40 rounded-md"
              aria-label="Open sidebar"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            <span className="text-sm md:text-base font-semibold text-[#1c3a2f]">
              {navItems.find((item) => isLinkActive(item))?.label || "Canopy"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`hidden md:flex items-center gap-2 bg-[#f7f7f2] border rounded-md p-[5px_10px] transition-all duration-280 ease-in-out cursor-text ${
                searchFocused ? "w-[190px] border-[#6ee7b7]" : "w-[120px] border-canopy-border/20"
              }`}
              onClick={() => document.getElementById("topbar-search-input")?.focus()}
            >
              <Search className="w-3.5 h-3.5 text-canopy-text/60 shrink-0" />
              <input
                id="topbar-search-input"
                type="text"
                placeholder="Search..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="bg-transparent border-none outline-none text-[12.5px] text-canopy-text w-full placeholder-canopy-text/60 font-sans"
              />
              {!searchFocused && (
                <kbd className="text-[10px] text-canopy-text/60 bg-linen border border-canopy-border/40 rounded px-1 ml-1 font-sans select-none shrink-0">
                  ⌘K
                </kbd>
              )}
            </div>

            <div className="relative">
              <button className="w-[34px] h-[34px] rounded-md flex items-center justify-center bg-transparent border border-canopy-border/20 hover:bg-[#f7f7f2] text-canopy-text/75 transition-colors">
                <Bell className="w-[17px] h-[17px]" />
              </button>
              <div className="absolute top-[-2px] right-[-2px] w-[7px] h-[7px] rounded-full bg-[#dc2626] border-1.5 border-white" />
            </div>

            <div className="w-[30px] h-[30px] rounded-full bg-[#1c3a2f] flex items-center justify-center text-[11px] text-[#6ee7b7] font-semibold">
              {initials}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main key={animationKey} className="flex-1 overflow-auto p-6 md:p-8 animate-fade-lift">
          {children}
        </main>
      </div>
    </div>
  );
}
