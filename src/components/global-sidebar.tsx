import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Radio,
  Sparkles,
  Layers,
  Plus,
  ChevronLeft,
  Globe,
  Lock,
  Shield,
  Edit3,
} from "lucide-react";
import { RegionalSelector } from "@/components/site-header";
import { useGlobalLanguage } from "@/lib/language";
import { useAdminAuth } from "@/lib/admin-auth";
import { AdminBar } from "@/components/admin/admin-bar";
import { AdminLoginModal } from "@/components/admin/admin-login-modal";
import { AdminCmsModal } from "@/components/admin/admin-cms-modal";

export function GlobalSidebar() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [language, setLanguage] = useGlobalLanguage();
  const { adminUser, isAdmin } = useAdminAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [cmsModalOpen, setCmsModalOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const navItems = [
    {
      id: "home",
      label: "Home",
      to: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      id: "watch",
      label: "VOD Live",
      to: "/watch",
      icon: Radio,
      isLive: true,
      isActive: pathname.startsWith("/watch"),
    },
    {
      id: "about",
      label: "About Us",
      to: "/about",
      icon: Sparkles,
      isActive: pathname.startsWith("/about"),
    },
    {
      id: "workflow",
      label: "Workflow",
      to: "/#workflow",
      isAnchor: true,
      icon: Layers,
      isActive: false,
    },
    {
      id: "waitlist",
      label: "Join Waitlist",
      to: "/explore",
      icon: Plus,
      isBadge: true,
      isActive: pathname.startsWith("/explore"),
    },
  ];

  return (
    <>
      {/* ── DESKTOP EXPANDING SIDEBAR NAVIGATION (NETFLIX OTT STYLE) ──────── */}
      <aside
        aria-label="Global Sidebar Navigation"
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
        className={`hidden md:flex fixed left-0 top-0 bottom-0 bg-black/95 backdrop-blur-2xl border-r border-white/[0.1] flex-col justify-between py-6 z-50 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          sidebarExpanded
            ? "w-64 shadow-2xl shadow-black/95 px-4"
            : "w-18 lg:w-20 px-2 items-center"
        }`}
      >
        {/* Top: Brand Logo & Title */}
        <div className="flex flex-col gap-6 w-full">
          <div className="flex items-center justify-between px-1">
            <Link
              to="/"
              className={`flex flex-col items-center gap-1 overflow-hidden group py-1 ${
                sidebarExpanded ? "items-start px-2" : "items-center"
              }`}
              title="Visual Bible TV"
            >
              <img
                src="/assets/nrim-logo-white.png"
                alt="NRIM Logo"
                className="h-7 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform drop-shadow"
              />
              <span className="text-[8px] font-black tracking-[0.22em] text-white/90 uppercase whitespace-nowrap">
                VISUAL BIBLE TV
              </span>
            </Link>
            {sidebarExpanded && (
              <button
                onClick={() => setSidebarExpanded(false)}
                className="text-white/40 hover:text-white p-1 rounded transition-colors"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Navigation Items (Home, VOD Live, About, Workflow, Waitlist) */}
          <nav className="flex flex-col gap-1.5 mt-2 w-full" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.isActive;

              const content = (
                <>
                  {/* Left Red Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#A11C28] rounded-r" />
                  )}
                  <div className="relative shrink-0">
                    <Icon
                      className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                        isActive ? "text-[#A11C28]" : item.isLive ? "text-red-400" : "text-white/70"
                      }`}
                    />
                    {item.isLive && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </div>
                  <span
                    className={`text-xs whitespace-nowrap transition-all duration-200 ${
                      sidebarExpanded
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-2 w-0 pointer-events-none"
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.isBadge && sidebarExpanded && (
                    <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#A11C28]/25 text-[#A11C28] border border-[#A11C28]/40 uppercase tracking-widest">
                      WAITLIST
                    </span>
                  )}
                  {item.isLive && sidebarExpanded && (
                    <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-widest">
                      24/7 LIVE
                    </span>
                  )}
                </>
              );

              const className = `relative flex items-center gap-3.5 h-11 rounded-lg px-2.5 transition-all duration-200 group ${
                isActive
                  ? "bg-white/[0.08] text-white font-semibold"
                  : "text-white/60 hover:text-white hover:bg-white/[0.05]"
              }`;

              if (item.isAnchor) {
                return (
                  <a key={item.id} href={item.to} className={className} title={item.label}>
                    {content}
                  </a>
                );
              }

              return (
                <Link key={item.id} to={item.to} className={className} title={item.label}>
                  {content}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Regional Language Selector, Admin CMS Trigger, & NRIM Org */}
        <div className="w-full flex flex-col gap-2 pt-4 border-t border-white/[0.08]">
          {/* Regional Selector in Sidebar */}
          {sidebarExpanded ? (
            <div className="px-1">
              <RegionalSelector value={language} onValueChange={setLanguage} />
            </div>
          ) : (
            <div
              className="flex justify-center p-2 rounded hover:bg-white/[0.06] transition-colors cursor-pointer text-white/50 hover:text-white"
              title={`Current Language: ${language.toUpperCase()}`}
            >
              <Globe className="w-5 h-5 text-amber-400" />
            </div>
          )}

          {/* Admin CMS Access Button */}
          {isAdmin ? (
            <button
              onClick={() => setCmsModalOpen(true)}
              className="flex items-center gap-2 p-2 rounded-lg bg-[#A11C28]/20 hover:bg-[#A11C28]/35 border border-[#A11C28]/40 text-[#A11C28] hover:text-white transition-colors"
              title="Admin CMS & YouTube Manager"
            >
              <Shield className="w-4 h-4 shrink-0 fill-current" />
              {sidebarExpanded && (
                <span className="text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                  Admin CMS
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={() => setLoginModalOpen(true)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white transition-colors"
              title="Admin Sign In"
            >
              <Lock className="w-4 h-4 shrink-0" />
              {sidebarExpanded && (
                <span className="text-[11px] font-medium whitespace-nowrap">Admin Sign In</span>
              )}
            </button>
          )}

          {/* NRIM Brand Link */}
          <a
            href="https://nrim.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.06] transition-colors overflow-hidden group"
            title="Nations Reach International Missions"
          >
            <img
              src="/assets/nrim-logo-white.png"
              alt="NRIM"
              className="w-6 h-auto shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
            />
            <div
              className={`flex flex-col transition-opacity duration-200 ${
                sidebarExpanded ? "opacity-100" : "opacity-0 w-0 pointer-events-none"
              }`}
            >
              <span className="text-[11px] font-bold text-white/90 whitespace-nowrap">
                NRIM Organization
              </span>
              <span className="text-[9px] text-white/40 tracking-wider">nrim.org</span>
            </div>
          </a>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAVIGATION BAR (NO TOP NAVBAR) ─────────────── */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black/95 backdrop-blur-xl border-t border-white/[0.1] z-50 flex items-center justify-around px-2"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;
          const className = `flex flex-col items-center gap-1 py-1 px-2 ${
            isActive ? "text-[#A11C28] font-semibold" : "text-white/60 hover:text-white"
          }`;

          if (item.isAnchor) {
            return (
              <a key={item.id} href={item.to} className={className}>
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{item.label}</span>
              </a>
            );
          }

          return (
            <Link key={item.id} to={item.to} className={className}>
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.isLive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </div>
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      {/* ── GLOBAL ADMIN STATUS BAR & MODALS ────────────────────────── */}
      <AdminBar />
      <AdminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={() => setCmsModalOpen(true)}
      />
      <AdminCmsModal isOpen={cmsModalOpen} onClose={() => setCmsModalOpen(false)} />
    </>
  );
}
