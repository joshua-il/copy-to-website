import { useState } from "react";
import { Shield, Edit3, LogOut, Video, Film, Check } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";
import { AdminCmsModal } from "./admin-cms-modal";
import { AdminLoginModal } from "./admin-login-modal";

export function AdminBar() {
  const { adminUser, isAdmin, logout } = useAdminAuth();
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [cmsTab, setCmsTab] = useState<"hero" | "vault" | "projects" | "episodes">("hero");

  if (!isAdmin || !adminUser) return null;

  const openCms = (tab: "hero" | "vault" | "projects" | "episodes" = "hero") => {
    setCmsTab(tab);
    setIsCmsOpen(true);
  };

  return (
    <>
      {/* Sticky Top Admin Toolbar */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-[#0c0c14]/95 border-b border-[#A11C28]/40 backdrop-blur-xl px-4 py-2 flex items-center justify-between text-xs text-white shadow-2xl animate-in slide-in-from-top-2 duration-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#A11C28] text-white font-black tracking-widest text-[10px] uppercase shadow">
            <Shield className="w-3 h-3 fill-white" />
            ADMIN
          </div>
          <span className="text-white/80 hidden sm:inline">
            Logged in as <strong className="text-white">{adminUser.email}</strong> ({adminUser.name}
            )
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openCms("hero")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Edit Page Content</span>
          </button>

          <button
            onClick={() => openCms("episodes")}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
          >
            <Video className="w-3.5 h-3.5 text-red-400" />
            <span>YouTube & TV Manager</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition-colors"
            title="Sign Out of Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Live Content & Media Management Modal */}
      <AdminCmsModal isOpen={isCmsOpen} onClose={() => setIsCmsOpen(false)} defaultTab={cmsTab} />
    </>
  );
}
