import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
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
} from "lucide-react";
import { useAdminAuth, AUTHORIZED_ADMINS, DEFAULT_ADMIN_PASSWORD } from "@/lib/admin-auth";
import {
  useCmsContent,
  type HeroContent,
  type ProductionCard,
  type ProjectSlateItem,
  type BroadcastEpisodeItem,
} from "@/lib/cms-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin")({
  component: AdminDashboardPage,
  head: () => ({
    meta: [
      { title: "NRIM Admin Portal · Visual Bible CMS" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminDashboardPage() {
  const { adminUser, isAdmin, login, logout } = useAdminAuth();
  const {
    cmsData,
    updateHero,
    updateVaultProductions,
    updateUpcomingProjects,
    updateBroadcastEpisodes,
    resetToDefaults,
  } = useCmsContent();

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Editor states
  const [activeTab, setActiveTab] = useState<"hero" | "vault" | "projects" | "episodes">("hero");
  const [heroForm, setHeroForm] = useState<HeroContent>({ ...cmsData.hero });
  const [vaultForm, setVaultForm] = useState<ProductionCard[]>([...cmsData.vaultProductions]);
  const [projectsForm, setProjectsForm] = useState<ProjectSlateItem[]>([
    ...cmsData.upcomingProjects,
  ]);
  const [episodesForm, setEpisodesForm] = useState<BroadcastEpisodeItem[]>([
    ...cmsData.broadcastEpisodes,
  ]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const result = login(email, password);
    if (!result.success) {
      setLoginError(result.error || "Login failed");
    }
  };

  const handleSave = () => {
    updateHero(heroForm);
    updateVaultProductions(vaultForm);
    updateUpcomingProjects(projectsForm);
    updateBroadcastEpisodes(episodesForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleReset = () => {
    if (confirm("Reset all content back to factory defaults?")) {
      resetToDefaults();
      setHeroForm({ ...cmsData.hero });
      setVaultForm([...cmsData.vaultProductions]);
      setProjectsForm([...cmsData.upcomingProjects]);
      setEpisodesForm([...cmsData.broadcastEpisodes]);
    }
  };

  // If NOT logged in, show the Admin Login Screen
  if (!isAdmin || !adminUser) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-6 selection:bg-[#A11C28]">
        <div className="w-full max-w-md bg-[#0b0b10] border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-[#A11C28] flex items-center justify-center font-black text-white text-sm shadow-lg shadow-red-950/60">
              VB
            </div>
            <div>
              <h1 className="text-xl font-black text-white">NRIM Admin Portal</h1>
              <p className="text-xs text-white/50">Visual Bible Content Management</p>
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
              className="w-full h-11 bg-[#A11C28] hover:bg-[#7F151F] text-white font-bold rounded-lg uppercase tracking-wider text-xs"
            >
              Sign In as Administrator
            </Button>
          </form>

          {/* Quick Select for Authorized Team Members */}
          <div className="mt-8 pt-6 border-t border-white/[0.08]">
            <span className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
              Authorized Team Accounts
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(AUTHORIZED_ADMINS).map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setEmail(item);
                    setPassword(DEFAULT_ADMIN_PASSWORD);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-white/80 border border-white/10"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-xs text-white/50 hover:text-white inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Main Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#07070a] text-white font-sans selection:bg-[#A11C28] selection:text-white">
      {/* Top Bar */}
      <header className="border-b border-white/[0.08] bg-[#0c0c14] sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#A11C28] flex items-center justify-center font-black text-white text-xs">
              VB
            </div>
            <div>
              <span className="text-xs font-black tracking-wider uppercase block">
                Visual Bible CMS
              </span>
              <span className="text-[10px] text-white/50">Admin Panel</span>
            </div>
          </Link>
          <span className="h-4 w-px bg-white/10 hidden sm:inline-block" />
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/70">
            <Shield className="w-3.5 h-3.5 text-[#A11C28]" />
            <span>
              Signed in: <strong className="text-white">{adminUser.email}</strong> ({adminUser.name}
              )
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
              <Check className="w-3.5 h-3.5" /> Saved & Live
            </span>
          )}
          <Button
            onClick={handleSave}
            className="bg-[#A11C28] hover:bg-[#7F151F] text-white font-bold text-xs h-9 px-4 rounded-lg flex items-center gap-1.5 uppercase tracking-wider"
          >
            <Save className="w-3.5 h-3.5" /> Save Changes
          </Button>
          <Link
            to="/"
            className="text-xs text-white/70 hover:text-white px-3 py-1.5 rounded bg-white/10"
          >
            View Live Site
          </Link>
          <button
            onClick={logout}
            className="p-2 text-red-400 hover:text-red-300 rounded hover:bg-white/5"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-white/[0.08] gap-4 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab("hero")}
            className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 ${
              activeTab === "hero"
                ? "border-[#A11C28] text-white"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Video className="w-4 h-4" /> Hero Showcase & Video
          </button>
          <button
            onClick={() => setActiveTab("vault")}
            className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 ${
              activeTab === "vault"
                ? "border-[#A11C28] text-white"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Film className="w-4 h-4" /> Vault Posters ({vaultForm.length})
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 ${
              activeTab === "projects"
                ? "border-[#A11C28] text-white"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" /> Upcoming Projects Slate
          </button>
          <button
            onClick={() => setActiveTab("episodes")}
            className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 ${
              activeTab === "episodes"
                ? "border-[#A11C28] text-white"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Tv className="w-4 h-4" /> 24/7 TV & YouTube Links ({episodesForm.length})
          </button>
        </div>

        {/* Tab 1: HERO */}
        {activeTab === "hero" && (
          <div className="bg-[#0e0e15] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Hero Section Headline & YouTube Video
              </h2>
              <p className="text-xs text-white/50">
                Configure the primary premiere title, backdrop photo, and background YouTube
                trailer.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">Title</label>
                <Input
                  value={heroForm.title}
                  onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                  className="bg-black/50 border-white/15"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">Tagline</label>
                <Input
                  value={heroForm.tagline}
                  onChange={(e) => setHeroForm({ ...heroForm, tagline: e.target.value })}
                  className="bg-black/50 border-white/15"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">Subtitle</label>
              <Input
                value={heroForm.subtitle}
                onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                className="bg-black/50 border-white/15"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">Synopsis</label>
              <textarea
                rows={3}
                value={heroForm.synopsis}
                onChange={(e) => setHeroForm({ ...heroForm, synopsis: e.target.value })}
                className="w-full bg-black/50 border border-white/15 rounded-md p-3 text-xs text-white leading-relaxed outline-none focus:border-[#A11C28]"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Hero Image Path / URL
                </label>
                <Input
                  value={heroForm.heroImage}
                  onChange={(e) => setHeroForm({ ...heroForm, heroImage: e.target.value })}
                  className="bg-black/50 border-white/15 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Video Delay (seconds before trailer starts)
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
                  className="bg-black/50 border-white/15"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                Hero YouTube Embed URL
              </label>
              <Input
                value={heroForm.videoUrl}
                onChange={(e) => setHeroForm({ ...heroForm, videoUrl: e.target.value })}
                className="bg-black/50 border-white/15 font-mono text-xs text-amber-400"
              />
            </div>
          </div>
        )}

        {/* Tab 2: VAULT POSTERS */}
        {activeTab === "vault" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Genesis Vault Posters
                </h2>
                <p className="text-xs text-white/50">
                  Update poster imagery, titles, language tracks, and badges.
                </p>
              </div>
              <Button
                onClick={() =>
                  setVaultForm([
                    {
                      id: `prod-${Date.now()}`,
                      title: "New Production",
                      subtitle: "Book of Scripture",
                      image: "/assets/yahweh-hero-mount-sinai.jpg",
                      badge: "New Release",
                      language: "English",
                      episode: "genesis",
                    },
                    ...vaultForm,
                  ])
                }
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add New Poster
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vaultForm.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-[#0e0e15] border border-white/10 rounded-xl p-4 space-y-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-24 object-cover rounded border border-white/15 shrink-0 bg-black"
                    />
                    <div className="flex-1 space-y-2 min-w-0">
                      <Input
                        value={item.title}
                        onChange={(e) => {
                          const copy = [...vaultForm];
                          copy[idx].title = e.target.value;
                          setVaultForm(copy);
                        }}
                        placeholder="Title"
                        className="h-8 text-xs bg-black/50 border-white/15"
                      />
                      <Input
                        value={item.subtitle}
                        onChange={(e) => {
                          const copy = [...vaultForm];
                          copy[idx].subtitle = e.target.value;
                          setVaultForm(copy);
                        }}
                        placeholder="Subtitle"
                        className="h-8 text-xs bg-black/50 border-white/15"
                      />
                      <Input
                        value={item.badge}
                        onChange={(e) => {
                          const copy = [...vaultForm];
                          copy[idx].badge = e.target.value;
                          setVaultForm(copy);
                        }}
                        placeholder="Badge"
                        className="h-8 text-xs bg-black/50 border-white/15"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/50 mb-1">Image URL</label>
                    <Input
                      value={item.image}
                      onChange={(e) => {
                        const copy = [...vaultForm];
                        copy[idx].image = e.target.value;
                        setVaultForm(copy);
                      }}
                      className="h-7 text-[11px] font-mono bg-black/50 border-white/15"
                    />
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/[0.06]">
                    <span className="text-[10px] text-white/40">{item.language}</span>
                    <button
                      onClick={() => setVaultForm(vaultForm.filter((_, i) => i !== idx))}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: PROJECTS SLATE */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Upcoming Projects Slate
              </h2>
              <p className="text-xs text-white/50">
                Edit items presented in the upcoming projects accordion.
              </p>
            </div>

            <div className="space-y-4">
              {projectsForm.map((proj, idx) => (
                <div
                  key={idx}
                  className="bg-[#0e0e15] border border-white/10 rounded-xl p-5 grid md:grid-cols-12 gap-4 items-center"
                >
                  <div className="md:col-span-2">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-24 object-cover rounded border border-white/15"
                    />
                  </div>
                  <div className="md:col-span-10 space-y-2">
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input
                        value={proj.title}
                        onChange={(e) => {
                          const copy = [...projectsForm];
                          copy[idx].title = e.target.value;
                          setProjectsForm(copy);
                        }}
                        className="h-9 text-xs bg-black/50 border-white/15"
                      />
                      <Input
                        value={proj.badge}
                        onChange={(e) => {
                          const copy = [...projectsForm];
                          copy[idx].badge = e.target.value;
                          setProjectsForm(copy);
                        }}
                        className="h-9 text-xs bg-black/50 border-white/15"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={proj.claim}
                      onChange={(e) => {
                        const copy = [...projectsForm];
                        copy[idx].claim = e.target.value;
                        setProjectsForm(copy);
                      }}
                      className="w-full bg-black/50 border border-white/15 rounded p-2 text-xs text-white"
                    />
                    <Input
                      value={proj.image}
                      onChange={(e) => {
                        const copy = [...projectsForm];
                        copy[idx].image = e.target.value;
                        setProjectsForm(copy);
                      }}
                      className="h-7 text-[11px] font-mono bg-black/50 border-white/15"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: BROADCAST & YOUTUBE */}
        {activeTab === "episodes" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  24/7 Linear Broadcast Schedule & YouTube Episodes
                </h2>
                <p className="text-xs text-white/50">
                  Update YouTube video IDs, episode titles, durations, and synopses without code
                  edits.
                </p>
              </div>
              <Button
                onClick={() =>
                  setEpisodesForm([
                    {
                      id: `ep-${Date.now()}`,
                      title: "New Episode Title",
                      subtitle: "Scripture Lesson",
                      book: "Book of Genesis",
                      chapter: "Chapter 1",
                      durationSeconds: 600,
                      durationFormatted: "10m 00s",
                      videoId: "z5abtVIszH8",
                      synopsis: "New episode synopsis.",
                      poster: "/assets/genesis-shepherds-poster.jpg",
                      tag: "NEW EPISODE",
                    },
                    ...episodesForm,
                  ])
                }
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add YouTube Episode
              </Button>
            </div>

            <div className="space-y-4">
              {episodesForm.map((ep, idx) => (
                <div
                  key={ep.id}
                  className="bg-[#0e0e15] border border-white/10 rounded-xl p-5 space-y-3"
                >
                  <div className="grid md:grid-cols-12 gap-3">
                    <div className="md:col-span-6">
                      <label className="block text-[10px] text-white/50 mb-1">Title</label>
                      <Input
                        value={ep.title}
                        onChange={(e) => {
                          const copy = [...episodesForm];
                          copy[idx].title = e.target.value;
                          setEpisodesForm(copy);
                        }}
                        className="h-8 text-xs bg-black/50 border-white/15"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[10px] text-white/50 mb-1">
                        YouTube Video ID
                      </label>
                      <Input
                        value={ep.videoId}
                        onChange={(e) => {
                          const copy = [...episodesForm];
                          copy[idx].videoId = e.target.value;
                          setEpisodesForm(copy);
                        }}
                        className="h-8 text-xs bg-black/50 border-white/15 font-mono text-red-400 font-bold"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[10px] text-white/50 mb-1">
                        Duration (e.g. 19m 03s)
                      </label>
                      <Input
                        value={ep.durationFormatted}
                        onChange={(e) => {
                          const copy = [...episodesForm];
                          copy[idx].durationFormatted = e.target.value;
                          setEpisodesForm(copy);
                        }}
                        className="h-8 text-xs bg-black/50 border-white/15"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-12 gap-3">
                    <div className="md:col-span-8">
                      <label className="block text-[10px] text-white/50 mb-1">Synopsis</label>
                      <textarea
                        rows={2}
                        value={ep.synopsis}
                        onChange={(e) => {
                          const copy = [...episodesForm];
                          copy[idx].synopsis = e.target.value;
                          setEpisodesForm(copy);
                        }}
                        className="w-full bg-black/50 border border-white/15 rounded p-2 text-xs text-white"
                      />
                    </div>
                    <div className="md:col-span-4 space-y-2">
                      <div>
                        <label className="block text-[10px] text-white/50 mb-1">Poster Image</label>
                        <Input
                          value={ep.poster}
                          onChange={(e) => {
                            const copy = [...episodesForm];
                            copy[idx].poster = e.target.value;
                            setEpisodesForm(copy);
                          }}
                          className="h-8 text-xs bg-black/50 border-white/15 font-mono text-[11px]"
                        />
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => setEpisodesForm(episodesForm.filter((_, i) => i !== idx))}
                          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove Episode
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
          <button
            onClick={handleReset}
            className="text-xs text-white/40 hover:text-red-400 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Original Defaults
          </button>
          <Button
            onClick={handleSave}
            className="bg-[#A11C28] hover:bg-[#7F151F] text-white font-bold text-xs h-10 px-6 rounded-lg flex items-center gap-2 shadow-lg uppercase tracking-wider"
          >
            <Save className="w-4 h-4" /> Save All Content
          </Button>
        </div>
      </div>
    </div>
  );
}
