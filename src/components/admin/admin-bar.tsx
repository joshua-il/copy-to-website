import { Link } from "@tanstack/react-router";
import { Shield, Edit3, LogOut, Video, Film } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";

export function AdminBar() {
  const { adminUser, isAdmin, logout } = useAdminAuth();

  if (!isAdmin || !adminUser) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[#0c0c14]/95 border-b border-[#A11C28]/40 backdrop-blur-xl px-4 py-2 flex items-center justify-between text-xs text-white shadow-2xl animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#A11C28] text-white font-black tracking-widest text-[10px] uppercase shadow">
          <Shield className="w-3 h-3 fill-white" />
          ADMIN
        </div>
        <span className="text-white/80 hidden sm:inline">
          Logged in as <strong className="text-white">{adminUser.email}</strong> ({adminUser.name})
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/admin"
          search={{ tab: "episodes" }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#A11C28] hover:bg-[#7F151F] text-white font-semibold transition-colors shadow"
          title="Open Visual Bible Studio CMS"
        >
          <Video className="w-3.5 h-3.5" />
          <span>Episodes Studio CMS</span>
        </Link>

        <Link
          to="/admin"
          search={{ tab: "vault" }}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
          title="Edit Genesis Vault Posters"
        >
          <Film className="w-3.5 h-3.5 text-amber-400" />
          <span>Vault Posters</span>
        </Link>

        <Link
          to="/admin"
          search={{ tab: "hero" }}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
          title="Edit Hero & Video Trailer"
        >
          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
          <span>Hero Showcase</span>
        </Link>

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
  );
}
