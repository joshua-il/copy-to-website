import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Shield,
  Lock,
  Mail,
  LogOut,
  Save,
  RotateCcw,
  Video,
  Film,
  Layers,
  Tv,
  Check,
  Plus,
  Trash2,
  ArrowLeft,
  ExternalLink,
  Play,
  Eye,
  EyeOff,
  Upload,
  Link2,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  Search,
  CheckCircle2,
  Globe,
} from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  useCmsContent,
  DEFAULT_BROADCAST_EPISODES,
  DEFAULT_CMS_DATA,
  type HeroContent,
  type ProductionCard,
  type ProjectSlateItem,
  type BroadcastEpisodeItem,
  type ArchiveGridItem,
} from "@/lib/cms-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadCmsMedia } from "@/lib/cms.functions";

function AdminRouteError({ error }: { error: unknown }) {
  return (
    <div className="min-h-screen bg-[#07070a] text-white flex flex-col items-center justify-center p-8 space-y-4">
      <div className="p-6 bg-red-950/40 border border-red-500/50 rounded-xl max-w-lg text-center space-y-3 shadow-2xl">
        <h2 className="text-lg font-bold text-red-300">Visual Bible Studio Error</h2>
        <p className="text-xs text-white/70">An error occurred while loading the studio interface.</p>
        <pre className="text-[11px] font-mono text-red-200 bg-black/60 p-3 rounded text-left overflow-x-auto whitespace-pre-wrap">
          {error instanceof Error ? error.message : String(error)}
        </pre>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#A11C28] text-white rounded text-xs font-bold hover:bg-[#851620]"
          >
            Reload Studio
          </button>
          <a
            href="/"
            className="px-4 py-2 bg-white/10 text-white rounded text-xs font-bold hover:bg-white/20"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/admin")({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: typeof search["tab"] === "string" ? search["tab"] : "episodes",
  }),
  component: AdminDashboardPage,
  errorComponent: AdminRouteError,
  head: () => ({
    meta: [
      { title: "Visual Bible TV Studio CMS · Content & YouTube Episodes" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

// ─── Cloud Image Field (Supabase Storage + URL Fallback) ─────────────────────

interface CloudImageFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  description?: string;
}

function CloudImageField({ label, value, onChange, description }: CloudImageFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const safeVal = typeof value === "string" ? value : "";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file (PNG, JPG, WebP).");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const res = await uploadCmsMedia({
          data: {
            filename: file.name,
            base64Data,
            mimeType: file.type,
          },
        });

        if (res && res.ok && res.publicUrl) {
          onChange(res.publicUrl);
        } else {
          setUploadError((res && res.error) || "Failed to upload image.");
        }
        setUploading(false);
      };
      reader.onerror = () => {
        setUploadError("Failed to read file.");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploadError(String(err));
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-white/80">{label}</label>
        {description && <span className="text-[10px] text-white/40">{description}</span>}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            value={safeVal}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste URL or upload image"
            className="h-9 text-xs bg-black/40 border-white/15 font-mono text-white/90 pl-7"
          />
          <Link2 className="w-3.5 h-3.5 text-white/30 absolute left-2 top-3" />
        </div>

        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-medium text-white transition-colors shrink-0">
          {uploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#A11C28]" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Image</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {uploadError && <p className="text-[11px] text-red-400">{uploadError}</p>}

      {safeVal ? (
        <div className="flex items-center gap-2.5 pt-1">
          <div className="w-12 h-8 rounded border border-white/20 overflow-hidden bg-black shrink-0">
            <img src={safeVal} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] text-emerald-400 font-mono truncate">
            Active: {safeVal.length > 55 ? `${safeVal.slice(0, 52)}...` : safeVal}
          </span>
        </div>
      ) : null}
    </div>
  );
}

// Helper: Extract YouTube 11-char Video ID
function parseYouTubeId(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
  );
  return match ? (match[1] as string) : trimmed;
}

// ─── Standalone Admin OTT Studio Page ────────────────────────────────────────

function AdminDashboardPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { adminUser, isAdmin, login, logout } = useAdminAuth();
  const {
    cmsData,
    saveAllCmsData,
    updateHero,
    updateVaultProductions,
    updateUpcomingProjects,
    updateBroadcastEpisodes,
    updateArchiveItems,
    resetToDefaults,
  } = useCmsContent();

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Studio tabs
  type TabId = "episodes" | "vault" | "archive" | "hero" | "projects" | "media";
  const initialTab = (search.tab as TabId) || "episodes";
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  // Sync route query param
  useEffect(() => {
    if (
      search.tab &&
      ["episodes", "vault", "archive", "hero", "projects", "media"].includes(search.tab)
    ) {
      setActiveTab(search.tab as TabId);
    }
  }, [search.tab]);

  // Working state forms
  const [heroForm, setHeroForm] = useState<HeroContent>({
    ...(cmsData?.hero || DEFAULT_CMS_DATA.hero),
  });
  const [vaultForm, setVaultForm] = useState<ProductionCard[]>([
    ...(cmsData?.vaultProductions && cmsData.vaultProductions.length
      ? cmsData.vaultProductions
      : DEFAULT_CMS_DATA.vaultProductions),
  ]);
  const [projectsForm, setProjectsForm] = useState<ProjectSlateItem[]>([
    ...(cmsData?.upcomingProjects && cmsData.upcomingProjects.length
      ? cmsData.upcomingProjects
      : DEFAULT_CMS_DATA.upcomingProjects),
  ]);
  const [episodesForm, setEpisodesForm] = useState<BroadcastEpisodeItem[]>([
    ...(cmsData?.broadcastEpisodes && cmsData.broadcastEpisodes.length
      ? cmsData.broadcastEpisodes
      : DEFAULT_BROADCAST_EPISODES),
  ]);
  const [archiveForm, setArchiveForm] = useState<ArchiveGridItem[]>([
    ...(cmsData?.archiveItems && cmsData.archiveItems.length
      ? cmsData.archiveItems
      : DEFAULT_CMS_DATA.archiveItems),
  ]);

  const [previewVideoId, setPreviewVideoId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  // Keep form data synchronized when cmsData updates
  useEffect(() => {
    if (!cmsData) return;
    setHeroForm({ ...(cmsData.hero || DEFAULT_CMS_DATA.hero) });
    setVaultForm([
      ...(cmsData.vaultProductions && cmsData.vaultProductions.length
        ? cmsData.vaultProductions
        : DEFAULT_CMS_DATA.vaultProductions),
    ]);
    setProjectsForm([
      ...(cmsData.upcomingProjects && cmsData.upcomingProjects.length
        ? cmsData.upcomingProjects
        : DEFAULT_CMS_DATA.upcomingProjects),
    ]);
    setEpisodesForm([
      ...(cmsData.broadcastEpisodes && cmsData.broadcastEpisodes.length
        ? cmsData.broadcastEpisodes
        : DEFAULT_BROADCAST_EPISODES),
    ]);
    setArchiveForm([
      ...(cmsData.archiveItems && cmsData.archiveItems.length
        ? cmsData.archiveItems
        : DEFAULT_CMS_DATA.archiveItems),
    ]);
  }, [cmsData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const result = login(email, password);
    if (!result.success) {
      setLoginError(result.error || "Login failed");
    }
  };

  const handleSave = () => {
    saveAllCmsData({
      hero: heroForm,
      vaultProductions: vaultForm,
      upcomingProjects: projectsForm,
      broadcastEpisodes: episodesForm,
      archiveItems: archiveForm,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (
      confirm("Reset all content back to factory defaults? Any custom links and text will revert.")
    ) {
      resetToDefaults();
      setHeroForm({ ...DEFAULT_CMS_DATA.hero });
      setVaultForm([...DEFAULT_CMS_DATA.vaultProductions]);
      setProjectsForm([...DEFAULT_CMS_DATA.upcomingProjects]);
      setEpisodesForm([...DEFAULT_BROADCAST_EPISODES]);
      setArchiveForm([...DEFAULT_CMS_DATA.archiveItems]);
    }
  };

  const switchTab = (tab: TabId) => {
    setActiveTab(tab);
    navigate({ to: "/admin", search: { tab } });
  };

  // ─── LOGIN SCREEN ──────────────────────────────────────────────────────────
  if (!isAdmin || !adminUser) {
    return (
      <div className="min-h-screen bg-[#07070a] text-white flex flex-col justify-center items-center p-6 selection:bg-[#A11C28]">
        <div className="w-full max-w-md bg-[#0e0e15] border border-white/15 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 bg-[#A11C28]/20 rounded-full blur-3xl" />

          <div className="flex items-center gap-3 mb-6">
            <img
              src="/assets/nrim-logo-white.png"
              alt="NRIM Logo"
              className="h-9 w-auto object-contain"
            />
            <div>
              <h1 className="text-lg font-black text-white tracking-wider uppercase">
                Visual Bible Studio CMS
              </h1>
              <p className="text-[11px] text-white/50">Admin Sign In & Content Management</p>
            </div>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-xs text-red-200">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">
                Authorized Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nrim.org"
                  className="pl-9 h-11 bg-white/[0.05] border-white/15 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="pl-9 h-11 bg-white/[0.05] border-white/15 text-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#A11C28] hover:bg-[#7F151F] text-white font-bold rounded-lg uppercase tracking-wider text-xs shadow-lg"
            >
              Sign In to Studio CMS
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-xs text-white/50 hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Live Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── FULL STANDALONE OTT STUDIO CMS LAYOUT ─────────────────────────────────

  const totalEpisodeDurationSec = episodesForm.reduce(
    (acc, ep) => acc + (ep.durationSeconds || 0),
    0,
  );
  const totalEpisodeHours = (totalEpisodeDurationSec / 3600).toFixed(1);

  return (
    <div className="min-h-screen bg-[#060609] text-white font-sans selection:bg-[#A11C28] selection:text-white flex flex-col md:flex-row">
      {/* ── Studio Navigation Sidebar ── */}
      <aside className="w-full md:w-64 lg:w-72 bg-[#09090f] border-r border-white/[0.08] flex flex-col shrink-0">
        {/* Brand & Studio Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/assets/nrim-logo-white.png"
              alt="NRIM Logo"
              className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-widest text-white uppercase">
                  Studio CMS
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#A11C28] text-white font-bold">
                  OTT
                </span>
              </div>
              <span className="text-[10px] text-white/40 block">Visual Bible Network</span>
            </div>
          </Link>
        </div>

        {/* Navigation Rail */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
            Broadcast & Content Modules
          </div>

          <button
            onClick={() => switchTab("episodes")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "episodes"
                ? "bg-[#A11C28] text-white shadow-lg shadow-red-950/40"
                : "text-white/70 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Tv className="w-4 h-4 shrink-0" />
              <span>Episodes Catalog</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                activeTab === "episodes" ? "bg-black/30 text-white" : "bg-white/10 text-white/60"
              }`}
            >
              {episodesForm.length}
            </span>
          </button>

          <button
            onClick={() => switchTab("vault")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "vault"
                ? "bg-[#A11C28] text-white shadow-lg shadow-red-950/40"
                : "text-white/70 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Film className="w-4 h-4 shrink-0" />
              <span>Vault Posters</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                activeTab === "vault" ? "bg-black/30 text-white" : "bg-white/10 text-white/60"
              }`}
            >
              {vaultForm.length}
            </span>
          </button>

          <button
            onClick={() => switchTab("archive")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "archive"
                ? "bg-[#A11C28] text-white shadow-lg shadow-red-950/40"
                : "text-white/70 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Infinite Canvas</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                activeTab === "archive" ? "bg-black/30 text-white" : "bg-white/10 text-white/60"
              }`}
            >
              {archiveForm.length}
            </span>
          </button>

          <div className="pt-3 px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
            Landing Presentation
          </div>

          <button
            onClick={() => switchTab("hero")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "hero"
                ? "bg-[#A11C28] text-white shadow-lg shadow-red-950/40"
                : "text-white/70 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Video className="w-4 h-4 shrink-0" />
              <span>Hero Premiere</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">Live</span>
          </button>

          <button
            onClick={() => switchTab("projects")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "projects"
                ? "bg-[#A11C28] text-white shadow-lg shadow-red-950/40"
                : "text-white/70 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 shrink-0" />
              <span>Upcoming Slate</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                activeTab === "projects" ? "bg-black/30 text-white" : "bg-white/10 text-white/60"
              }`}
            >
              {projectsForm.length}
            </span>
          </button>

          <button
            onClick={() => switchTab("media")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "media"
                ? "bg-[#A11C28] text-white shadow-lg shadow-red-950/40"
                : "text-white/70 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ImageIcon className="w-4 h-4 shrink-0" />
              <span>Cloud Media</span>
            </div>
            <span className="text-[10px] text-white/40 font-mono">Storage</span>
          </button>
        </nav>

        {/* Admin Profile & Team Quick Switcher */}
        <div className="p-4 border-t border-white/[0.08] bg-[#0c0c14]/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#A11C28] flex items-center justify-center font-bold text-xs uppercase text-white shrink-0">
                {adminUser?.email?.[0] || "A"}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate">
                  {adminUser?.name || "Admin"}
                </span>
                <span className="text-[10px] text-white/50 block truncate">
                  {adminUser?.email || ""}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-white/5 rounded transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              to="/watch"
              className="flex-1 py-1 px-2 rounded bg-white/[0.06] hover:bg-white/[0.12] text-[10px] text-center font-semibold text-white/80 transition-colors"
            >
              Live Theater
            </Link>
            <Link
              to="/"
              className="flex-1 py-1 px-2 rounded bg-white/[0.06] hover:bg-white/[0.12] text-[10px] text-center font-semibold text-white/80 transition-colors"
            >
              Pitch Home
            </Link>
          </div>
        </div>
      </aside>

      {/* ── Main Studio Workspace ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Sticky Studio Top Utility Strip */}
        <header className="sticky top-0 z-30 bg-[#08080d]/95 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-black uppercase tracking-wider text-white">
              {activeTab === "episodes" && "Episodes & YouTube Streaming Catalog"}
              {activeTab === "vault" && "Genesis Vault Poster Bindings"}
              {activeTab === "archive" && "Infinite Scripture Canvas Tiles"}
              {activeTab === "hero" && "Hero Showcase & Background Trailer"}
              {activeTab === "projects" && "Upcoming Production Slate"}
              {activeTab === "media" && "Cloud Media Asset Manager"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved & Live Across All Sites
              </span>
            )}

            <button
              onClick={handleReset}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-red-400 px-3 py-1.5 rounded transition-colors"
              title="Reset all content to factory original"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>

            <Link
              to="/"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1 text-xs text-white/70 hover:text-white px-3 py-1.5 rounded bg-white/10 hover:bg-white/15 transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3 text-white/50" />
            </Link>

            <Button
              onClick={handleSave}
              className="bg-[#A11C28] hover:bg-[#7F151F] text-white font-bold text-xs h-9 px-4 rounded-lg flex items-center gap-1.5 uppercase tracking-wider shadow-lg shadow-red-950/50"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </Button>
          </div>
        </header>

        {/* Studio Content Container */}
        <div className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* ══════════════════════════════════════════════════════════════════
              TAB 1: EPISODES CATALOG (CENTRAL STREAMING MODULE)
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "episodes" && (
            <div className="space-y-6">
              {/* OTT Overview Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#0d0d14] border border-white/10 rounded-xl p-4">
                <div>
                  <span className="text-[10px] text-white/40 uppercase font-mono block">
                    Catalog Size
                  </span>
                  <span className="text-xl font-black text-white">
                    {episodesForm.length} Episodes
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase font-mono block">
                    Total Airtime
                  </span>
                  <span className="text-xl font-black text-white">{totalEpisodeHours} Hours</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase font-mono block">
                    Video Source
                  </span>
                  <span className="text-xl font-black text-red-400">YouTube Embed</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase font-mono block">
                    24/7 Channel Loop
                  </span>
                  <span className="text-xl font-black text-emerald-400">Synchronized</span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3" />
                  <Input
                    placeholder="Search episodes by title, book, or video ID..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="h-9 text-xs bg-black/40 border-white/15 pl-8"
                  />
                </div>

                <Button
                  onClick={() => {
                    const newId = `episode-${Date.now()}`;
                    setEpisodesForm([
                      {
                        id: newId,
                        title: "New Scripture Episode Title",
                        subtitle: "Patriarchal Chronicles · Season 1",
                        book: "Book of Genesis",
                        chapter: "Chapter 1",
                        durationSeconds: 900,
                        durationFormatted: "15m 00s",
                        videoId: "z5abtVIszH8",
                        synopsis:
                          "Enter episode scripture context and dramatic narrative breakdown.",
                        poster: "/assets/genesis-shepherds-poster.jpg",
                        tag: "NEW RELEASE",
                        language: "English",
                      },
                      ...episodesForm,
                    ]);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold h-9"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Add New Episode
                </Button>
              </div>

              {/* Episodes List Grid */}
              <div className="space-y-4">
                {episodesForm
                  .filter((ep) => {
                    if (!searchFilter.trim()) return true;
                    const q = searchFilter.toLowerCase();
                    return (
                      ep.title.toLowerCase().includes(q) ||
                      ep.chapter.toLowerCase().includes(q) ||
                      ep.videoId.toLowerCase().includes(q) ||
                      ep.id.toLowerCase().includes(q)
                    );
                  })
                  .map((ep, idx) => {
                    const isPreviewing = previewVideoId === ep.videoId;
                    return (
                      <div
                        key={ep.id}
                        className="bg-[#0c0c14] border border-white/10 rounded-2xl p-5 space-y-4 hover:border-white/20 transition-all shadow-xl"
                      >
                        {/* Header Row: ID, Tag, Duration, Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="w-6 h-6 rounded-md bg-[#A11C28] text-white flex items-center justify-center font-mono font-bold text-xs">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-mono font-bold text-white/90">
                              ID: <code className="text-amber-400">{ep.id}</code>
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 font-bold uppercase tracking-wider text-white/70">
                              {ep.tag || "EPISODE"}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/50 border border-red-500/30 text-red-300 font-mono">
                              YT: {ep.videoId}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPreviewVideoId(isPreviewing ? null : ep.videoId)}
                              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded transition-colors ${
                                isPreviewing
                                  ? "bg-amber-400 text-black font-bold"
                                  : "bg-white/10 hover:bg-white/20 text-white"
                              }`}
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>{isPreviewing ? "Close Preview" : "Test Playback"}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete episode "${ep.title}"?`)) {
                                  setEpisodesForm(episodesForm.filter((item) => item.id !== ep.id));
                                }
                              }}
                              className="text-xs text-red-400 hover:text-red-300 p-1.5 hover:bg-white/5 rounded transition-colors"
                              title="Delete Episode"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* In-Place YouTube Video Player Preview */}
                        {isPreviewing && (
                          <div className="rounded-xl overflow-hidden border border-amber-400/50 bg-black aspect-video max-w-2xl mx-auto shadow-2xl">
                            <iframe
                              className="w-full h-full border-0"
                              src={`https://www.youtube.com/embed/${ep.videoId}?autoplay=1&controls=1&rel=0`}
                              title={ep.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        )}

                        {/* Title & Metadata Inputs */}
                        <div className="grid md:grid-cols-12 gap-3">
                          <div className="md:col-span-8 space-y-1">
                            <label className="text-[11px] font-semibold text-white/60">
                              Episode Title
                            </label>
                            <Input
                              value={ep.title}
                              onChange={(e) => {
                                const copy = [...episodesForm];
                                copy[idx] = { ...copy[idx], title: e.target.value };
                                setEpisodesForm(copy);
                              }}
                              className="h-9 text-xs bg-black/50 border-white/15"
                            />
                          </div>

                          <div className="md:col-span-4 space-y-1">
                            <label className="text-[11px] font-semibold text-white/60">
                              YouTube Video URL or ID
                            </label>
                            <div className="relative">
                              <Input
                                value={ep.videoId}
                                onChange={(e) => {
                                  const parsed = parseYouTubeId(e.target.value);
                                  const copy = [...episodesForm];
                                  copy[idx] = { ...copy[idx], videoId: parsed };
                                  setEpisodesForm(copy);
                                }}
                                placeholder="Paste YouTube link or ID"
                                className="h-9 text-xs bg-black/50 border-white/15 font-mono text-red-400 font-bold"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-12 gap-3">
                          <div className="md:col-span-4 space-y-1">
                            <label className="text-[11px] font-semibold text-white/60">
                              Book / Saga
                            </label>
                            <Input
                              value={ep.book}
                              onChange={(e) => {
                                const copy = [...episodesForm];
                                copy[idx] = { ...copy[idx], book: e.target.value };
                                setEpisodesForm(copy);
                              }}
                              className="h-8 text-xs bg-black/50 border-white/15"
                            />
                          </div>

                          <div className="md:col-span-4 space-y-1">
                            <label className="text-[11px] font-semibold text-white/60">
                              Chapter Reference
                            </label>
                            <Input
                              value={ep.chapter}
                              onChange={(e) => {
                                const copy = [...episodesForm];
                                copy[idx] = { ...copy[idx], chapter: e.target.value };
                                setEpisodesForm(copy);
                              }}
                              className="h-8 text-xs bg-black/50 border-white/15"
                            />
                          </div>

                          <div className="md:col-span-2 space-y-1">
                            <label className="text-[11px] font-semibold text-white/60">
                              Duration (Formatted)
                            </label>
                            <Input
                              value={ep.durationFormatted}
                              onChange={(e) => {
                                const copy = [...episodesForm];
                                copy[idx] = { ...copy[idx], durationFormatted: e.target.value };
                                setEpisodesForm(copy);
                              }}
                              placeholder="19m 03s"
                              className="h-8 text-xs bg-black/50 border-white/15 font-mono"
                            />
                          </div>

                          <div className="md:col-span-2 space-y-1">
                            <label className="text-[11px] font-semibold text-white/60">
                              Seconds
                            </label>
                            <Input
                              type="number"
                              value={ep.durationSeconds || 600}
                              onChange={(e) => {
                                const sec = parseInt(e.target.value, 10) || 600;
                                const copy = [...episodesForm];
                                copy[idx] = { ...copy[idx], durationSeconds: sec };
                                setEpisodesForm(copy);
                              }}
                              className="h-8 text-xs bg-black/50 border-white/15 font-mono"
                            />
                          </div>
                        </div>

                        {/* Synopsis & Poster Upload */}
                        <div className="grid md:grid-cols-12 gap-3">
                          <div className="md:col-span-7 space-y-1">
                            <label className="text-[11px] font-semibold text-white/60">
                              Scripture Synopsis
                            </label>
                            <textarea
                              rows={3}
                              value={ep.synopsis}
                              onChange={(e) => {
                                const copy = [...episodesForm];
                                copy[idx] = { ...copy[idx], synopsis: e.target.value };
                                setEpisodesForm(copy);
                              }}
                              className="w-full bg-black/50 border border-white/15 rounded-md p-2.5 text-xs text-white leading-relaxed outline-none focus:border-[#A11C28]"
                            />
                          </div>

                          <div className="md:col-span-5 space-y-2">
                            <CloudImageField
                              label="Episode Poster Graphic"
                              value={ep.poster}
                              onChange={(val) => {
                                const copy = [...episodesForm];
                                copy[idx] = { ...copy[idx], poster: val };
                                setEpisodesForm(copy);
                              }}
                              description="16:9 or 2:3 crop"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 2: VAULT POSTERS (HOMEPAGE CAROUSEL BINDINGS)
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "vault" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wider">
                    Homepage Genesis Vault Posters
                  </h2>
                  <p className="text-xs text-white/50">
                    These posters appear directly on the homepage carousel. Use the dropdown to
                    connect each poster directly to any episode from your catalog.
                  </p>
                </div>

                <Button
                  onClick={() => {
                    const firstEpId = episodesForm[0]?.id || "genesis-46-50";
                    setVaultForm([
                      {
                        id: `prod-${Date.now()}`,
                        title: "New Scripture Poster",
                        subtitle: "Book of Scripture · Premier Edition",
                        image: "/assets/yahweh-hero-mount-sinai.jpg",
                        badge: "New Release",
                        language: "English Audio",
                        episode: firstEpId,
                      },
                      ...vaultForm,
                    ]);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Add Vault Poster
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {vaultForm.map((card, idx) => (
                  <div
                    key={card.id || idx}
                    className="bg-[#0c0c14] border border-white/10 rounded-2xl p-5 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-20 h-28 rounded-lg overflow-hidden border border-white/15 bg-black shrink-0 relative">
                          <img
                            src={card.image}
                            alt={card.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 left-1 right-1 text-[8px] bg-[#A11C28] text-white text-center font-bold uppercase rounded-sm py-0.5 truncate">
                            {card.badge}
                          </span>
                        </div>

                        <div className="flex-1 space-y-2 min-w-0">
                          <div>
                            <label className="text-[10px] text-white/50 block">Title</label>
                            <Input
                              value={card.title}
                              onChange={(e) => {
                                const copy = [...vaultForm];
                                copy[idx] = { ...copy[idx], title: e.target.value };
                                setVaultForm(copy);
                              }}
                              className="h-8 text-xs bg-black/50 border-white/15 font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-white/50 block">Subtitle</label>
                            <Input
                              value={card.subtitle}
                              onChange={(e) => {
                                const copy = [...vaultForm];
                                copy[idx] = { ...copy[idx], subtitle: e.target.value };
                                setVaultForm(copy);
                              }}
                              className="h-8 text-xs bg-black/50 border-white/15"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Dropdown to Bind to Real Episode */}
                      <div className="space-y-1 bg-black/40 p-2.5 rounded-lg border border-white/10">
                        <label className="text-[10px] font-bold uppercase text-[#A11C28] tracking-wider block">
                          Plays in /watch player on click
                        </label>
                        <select
                          value={card.episode}
                          onChange={(e) => {
                            const copy = [...vaultForm];
                            copy[idx] = { ...copy[idx], episode: e.target.value };
                            setVaultForm(copy);
                          }}
                          className="w-full h-8 rounded bg-[#101018] border border-white/20 px-2 text-xs text-white outline-none focus:border-[#A11C28]"
                        >
                          {episodesForm.map((ep) => (
                            <option key={ep.id} value={ep.id} className="bg-[#101018] text-white">
                              {ep.title || "Episode"} ({ep.chapter || "Ch."})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-white/50 block">Badge Tag</label>
                          <Input
                            value={card.badge}
                            onChange={(e) => {
                              const copy = [...vaultForm];
                              copy[idx] = { ...copy[idx], badge: e.target.value };
                              setVaultForm(copy);
                            }}
                            className="h-7 text-xs bg-black/50 border-white/15"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-white/50 block">Language Track</label>
                          <Input
                            value={card.language}
                            onChange={(e) => {
                              const copy = [...vaultForm];
                              copy[idx] = { ...copy[idx], language: e.target.value };
                              setVaultForm(copy);
                            }}
                            className="h-7 text-xs bg-black/50 border-white/15"
                          />
                        </div>
                      </div>

                      <CloudImageField
                        label="Poster Artwork"
                        value={card.image}
                        onChange={(val) => {
                          const copy = [...vaultForm];
                          copy[idx] = { ...copy[idx], image: val };
                          setVaultForm(copy);
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
                      <span className="text-[10px] text-white/40 font-mono">Slot #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setVaultForm(vaultForm.filter((_, i) => i !== idx));
                        }}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 3: INFINITE CANVAS (3D POSTER GRID TILES)
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "archive" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wider">
                    Infinite 3D Canvas Posters & Click Actions
                  </h2>
                  <p className="text-xs text-white/50">
                    Configure the imagery and streaming actions for each tile in the interactive
                    infinite gallery.
                  </p>
                </div>

                <Button
                  onClick={() => {
                    const firstEpId = episodesForm[0]?.id || "genesis-46-50";
                    setArchiveForm([
                      {
                        id: `archive-${Date.now()}`,
                        title: "Scripture Showcase",
                        subtitle: "Exodus · Prophetic Feature",
                        imageUrl: "/assets/yahweh-hero-parted-sea.jpg",
                        episode: firstEpId,
                        linkUrl: `/watch?episode=${firstEpId}&mode=vod`,
                      },
                      ...archiveForm,
                    ]);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Add Canvas Tile
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {archiveForm.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="bg-[#0c0c14] border border-white/10 rounded-2xl p-5 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-20 h-28 rounded-lg overflow-hidden border border-white/15 bg-black shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 space-y-2 min-w-0">
                          <div>
                            <label className="text-[10px] text-white/50 block">Tile Title</label>
                            <Input
                              value={item.title}
                              onChange={(e) => {
                                const copy = [...archiveForm];
                                copy[idx] = { ...copy[idx], title: e.target.value };
                                setArchiveForm(copy);
                              }}
                              className="h-8 text-xs bg-black/50 border-white/15 font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-white/50 block">Subtitle</label>
                            <Input
                              value={item.subtitle}
                              onChange={(e) => {
                                const copy = [...archiveForm];
                                copy[idx] = { ...copy[idx], subtitle: e.target.value };
                                setArchiveForm(copy);
                              }}
                              className="h-8 text-xs bg-black/50 border-white/15"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Dropdown to Bind to Real Episode */}
                      <div className="space-y-1 bg-black/40 p-2.5 rounded-lg border border-white/10">
                        <label className="text-[10px] font-bold uppercase text-[#A11C28] tracking-wider block">
                          Link to Catalog Episode
                        </label>
                        <select
                          value={item.episode || "genesis-46-50"}
                          onChange={(e) => {
                            const chosenId = e.target.value;
                            const copy = [...archiveForm];
                            copy[idx] = {
                              ...copy[idx],
                              episode: chosenId,
                              linkUrl: `/watch?episode=${chosenId}&mode=vod`,
                            };
                            setArchiveForm(copy);
                          }}
                          className="w-full h-8 rounded bg-[#101018] border border-white/20 px-2 text-xs text-white outline-none focus:border-[#A11C28]"
                        >
                          {episodesForm.map((ep) => (
                            <option key={ep.id} value={ep.id} className="bg-[#101018] text-white">
                              {ep.title || "Episode"} ({ep.chapter || "Ch."})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-white/50 block">
                          Explicit Click Link (Optional Override)
                        </label>
                        <Input
                          value={item.linkUrl || ""}
                          placeholder={`/watch?episode=${item.episode || "genesis"}&mode=vod`}
                          onChange={(e) => {
                            const copy = [...archiveForm];
                            copy[idx] = { ...copy[idx], linkUrl: e.target.value };
                            setArchiveForm(copy);
                          }}
                          className="h-8 text-xs bg-black/50 border-white/15 font-mono"
                        />
                      </div>

                      <CloudImageField
                        label="Tile Artwork Graphic"
                        value={item.imageUrl}
                        onChange={(val) => {
                          const copy = [...archiveForm];
                          copy[idx] = { ...copy[idx], imageUrl: val };
                          setArchiveForm(copy);
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
                      <span className="text-[10px] text-white/40 font-mono">Tile #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setArchiveForm(archiveForm.filter((_, i) => i !== idx));
                        }}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 4: HERO PREMIERE & BACKGROUND TRAILER
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "hero" && (
            <div className="bg-[#0c0c14] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Hero Showcase Headline & YouTube Trailer
                </h2>
                <p className="text-xs text-white/50">
                  Configure the primary premiere headline, initial poster backdrop, and the
                  background YouTube trailer stream that plays behind the negative-margin poster
                  carousel.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/70">Main Title</label>
                  <Input
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    className="bg-black/50 border-white/15 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/70">Tagline</label>
                  <Input
                    value={heroForm.tagline}
                    onChange={(e) => setHeroForm({ ...heroForm, tagline: e.target.value })}
                    className="bg-black/50 border-white/15"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/70">Subtitle</label>
                <Input
                  value={heroForm.subtitle}
                  onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                  className="bg-black/50 border-white/15"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/70">Synopsis Copy</label>
                <textarea
                  rows={3}
                  value={heroForm.synopsis}
                  onChange={(e) => setHeroForm({ ...heroForm, synopsis: e.target.value })}
                  className="w-full bg-black/50 border border-white/15 rounded-md p-3 text-xs text-white leading-relaxed outline-none focus:border-[#A11C28]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <CloudImageField
                  label="Hero Poster Image Backdrop"
                  value={heroForm.heroImage}
                  onChange={(val) => setHeroForm({ ...heroForm, heroImage: val })}
                  description="Displays for the first 2-3 seconds before video"
                />

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/70">
                    Video Delay (seconds before trailer plays)
                  </label>
                  <Input
                    type="number"
                    step="0.5"
                    value={heroForm.videoDelaySeconds}
                    onChange={(e) =>
                      setHeroForm({
                        ...heroForm,
                        videoDelaySeconds: parseFloat(e.target.value) || 2.5,
                      })
                    }
                    className="h-9 bg-black/50 border-white/15"
                  />
                  <span className="text-[10px] text-white/40 block">
                    Default is 2.5s (allows users to see the high-resolution poster before motion
                    starts)
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/70">
                  Hero YouTube Embed URL (Muted Cinematic Loop)
                </label>
                <Input
                  value={heroForm.videoUrl}
                  onChange={(e) => setHeroForm({ ...heroForm, videoUrl: e.target.value })}
                  className="bg-black/50 border-white/15 font-mono text-xs text-amber-400"
                />
                <span className="text-[10px] text-white/40 block">
                  Includes start=60 to begin 1 minute into the dramatic sequence
                </span>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 5: UPCOMING PRODUCTION SLATE
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Upcoming Production Slate
                </h2>
                <p className="text-xs text-white/50">
                  Edit the items featured in the production roadmap accordion on the landing page.
                </p>
              </div>

              <div className="space-y-4">
                {projectsForm.map((proj, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0c0c14] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl"
                  >
                    <div className="grid md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-3">
                        <div className="aspect-video rounded-lg overflow-hidden border border-white/15 bg-black">
                          <img
                            src={proj.image}
                            alt={proj.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-9 space-y-3">
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] text-white/50 block">Project Title</label>
                            <Input
                              value={proj.title}
                              onChange={(e) => {
                                const copy = [...projectsForm];
                                copy[idx] = { ...copy[idx], title: e.target.value };
                                setProjectsForm(copy);
                              }}
                              className="h-8 text-xs bg-black/50 border-white/15 font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-white/50 block">Release Badge</label>
                            <Input
                              value={proj.badge}
                              onChange={(e) => {
                                const copy = [...projectsForm];
                                copy[idx] = { ...copy[idx], badge: e.target.value };
                                setProjectsForm(copy);
                              }}
                              className="h-8 text-xs bg-black/50 border-white/15"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-white/50 block">
                            Narrative Summary
                          </label>
                          <textarea
                            rows={2}
                            value={proj.claim}
                            onChange={(e) => {
                              const copy = [...projectsForm];
                              copy[idx] = { ...copy[idx], claim: e.target.value };
                              setProjectsForm(copy);
                            }}
                            className="w-full bg-black/50 border border-white/15 rounded p-2 text-xs text-white"
                          />
                        </div>

                        <CloudImageField
                          label="Artwork Image"
                          value={proj.image}
                          onChange={(val) => {
                            const copy = [...projectsForm];
                            copy[idx] = { ...copy[idx], image: val };
                            setProjectsForm(copy);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 6: CLOUD MEDIA STORAGE
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "media" && (
            <div className="bg-[#0c0c14] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Cloud Media Asset Storage (Supabase)
                </h2>
                <p className="text-xs text-white/50">
                  Upload graphics, posters, and production stills directly to cloud storage so they
                  are accessible everywhere without storing on a local disk.
                </p>
              </div>

              <div className="p-8 border-2 border-dashed border-white/15 rounded-2xl text-center space-y-3 bg-black/30">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto text-[#A11C28]">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">Upload New Asset</h3>
                <p className="text-xs text-white/50 max-w-sm mx-auto">
                  Files uploaded here are stored in Supabase cloud storage and generate instant
                  public URLs to copy into any episode or poster card.
                </p>
                <CloudImageField
                  label=""
                  value=""
                  onChange={(val) => {
                    alert(`Asset uploaded successfully!\nPublic URL: ${val}`);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
