import { useState } from "react";
import {
  X,
  Save,
  RotateCcw,
  Film,
  Tv,
  Sparkles,
  Layers,
  Plus,
  Trash2,
  Check,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import {
  useCmsContent,
  type HeroContent,
  type ProductionCard,
  type ProjectSlateItem,
  type BroadcastEpisodeItem,
} from "@/lib/cms-store";
import { useAdminAuth } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminCmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "hero" | "vault" | "projects" | "episodes";
}

export function AdminCmsModal({ isOpen, onClose, defaultTab = "hero" }: AdminCmsModalProps) {
  const { adminUser } = useAdminAuth();
  const {
    cmsData,
    updateHero,
    updateVaultProductions,
    updateUpcomingProjects,
    updateBroadcastEpisodes,
    resetToDefaults,
  } = useCmsContent();

  const [activeTab, setActiveTab] = useState<"hero" | "vault" | "projects" | "episodes">(
    defaultTab,
  );
  const [heroForm, setHeroForm] = useState<HeroContent>({ ...cmsData.hero });
  const [vaultForm, setVaultForm] = useState<ProductionCard[]>([...cmsData.vaultProductions]);
  const [projectsForm, setProjectsForm] = useState<ProjectSlateItem[]>([
    ...cmsData.upcomingProjects,
  ]);
  const [episodesForm, setEpisodesForm] = useState<BroadcastEpisodeItem[]>([
    ...cmsData.broadcastEpisodes,
  ]);
  const [saveNotice, setSaveNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    updateHero(heroForm);
    updateVaultProductions(vaultForm);
    updateUpcomingProjects(projectsForm);
    updateBroadcastEpisodes(episodesForm);
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 2500);
  };

  const handleReset = () => {
    if (confirm("Reset all content back to factory defaults? Any custom edits will be cleared.")) {
      resetToDefaults();
      onClose();
    }
  };

  // Vault Item Helpers
  const addVaultItem = () => {
    const newItem: ProductionCard = {
      id: `prod-${Date.now()}`,
      title: "New Production Title",
      subtitle: "Scripture Study · Season 1",
      image: "/assets/yahweh-hero-mount-sinai.jpg",
      badge: "New Release",
      language: "English",
      episode: "genesis",
    };
    setVaultForm([newItem, ...vaultForm]);
  };

  const removeVaultItem = (index: number) => {
    setVaultForm(vaultForm.filter((_, i) => i !== index));
  };

  const updateVaultItem = (index: number, field: keyof ProductionCard, value: string) => {
    const copy = [...vaultForm];
    copy[index] = { ...copy[index], [field]: value };
    setVaultForm(copy);
  };

  // Projects Slate Helpers
  const updateProjectItem = (index: number, field: keyof ProjectSlateItem, value: string) => {
    const copy = [...projectsForm];
    copy[index] = { ...copy[index], [field]: value };
    setProjectsForm(copy);
  };

  // Broadcast Episodes Helpers
  const addEpisodeItem = () => {
    const newEp: BroadcastEpisodeItem = {
      id: `ep-${Date.now()}`,
      title: "New Broadcast Episode",
      subtitle: "Scripture Revelation",
      book: "Book of Genesis",
      chapter: "Chapter 1",
      durationSeconds: 600,
      durationFormatted: "10m 00s",
      videoId: "z5abtVIszH8",
      synopsis: "Episode description for broadcast streaming.",
      poster: "/assets/genesis-shepherds-poster.jpg",
      tag: "NEW EPISODE",
    };
    setEpisodesForm([newEp, ...episodesForm]);
  };

  const removeEpisodeItem = (index: number) => {
    setEpisodesForm(episodesForm.filter((_, i) => i !== index));
  };

  const updateEpisodeItem = (
    index: number,
    field: keyof BroadcastEpisodeItem,
    value: string | number,
  ) => {
    const copy = [...episodesForm];
    copy[index] = { ...copy[index], [field]: value };
    setEpisodesForm(copy);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#0d0d14] border border-white/20 rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#08080c]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#A11C28] flex items-center justify-center font-black text-white text-xs">
              CMS
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                NRIM Content & Media Manager
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                  {adminUser?.email}
                </span>
              </h2>
              <p className="text-xs text-white/50">Edit photos, copy, posters & YouTube videos</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveNotice && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-3 py-1 bg-emerald-500/10 rounded border border-emerald-500/20">
                <Check className="w-3.5 h-3.5" /> Saved & Live!
              </span>
            )}
            <Button
              onClick={handleSave}
              className="bg-[#A11C28] hover:bg-[#7F151F] text-white font-bold text-xs h-9 px-4 rounded-lg flex items-center gap-1.5 shadow-md uppercase tracking-wider"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </Button>
            <button
              onClick={onClose}
              className="p-2 text-white/50 hover:text-white rounded-lg transition-colors ml-2"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/[0.08] bg-black/40 px-6 gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("hero")}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "hero"
                ? "border-[#A11C28] text-white"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Video className="w-4 h-4" /> Hero & Trailer
          </button>
          <button
            onClick={() => setActiveTab("vault")}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "vault"
                ? "border-[#A11C28] text-white"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Film className="w-4 h-4" /> Vault Posters ({vaultForm.length})
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "projects"
                ? "border-[#A11C28] text-white"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" /> Upcoming Projects Slate
          </button>
          <button
            onClick={() => setActiveTab("episodes")}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "episodes"
                ? "border-[#A11C28] text-white"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Tv className="w-4 h-4" /> Live TV Episodes & YouTube ({episodesForm.length})
          </button>
        </div>

        {/* Tab Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: HERO & TEASER */}
          {activeTab === "hero" && (
            <div className="space-y-5 max-w-3xl">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  Hero Showcase Details
                </h3>
                <p className="text-xs text-white/50">
                  Update the main theatrical headline, synopsis, background photo, and YouTube
                  trailer loop.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Title</label>
                  <Input
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    className="bg-white/[0.05] border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Tagline</label>
                  <Input
                    value={heroForm.tagline}
                    onChange={(e) => setHeroForm({ ...heroForm, tagline: e.target.value })}
                    className="bg-white/[0.05] border-white/15 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">Subtitle</label>
                <Input
                  value={heroForm.subtitle}
                  onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                  className="bg-white/[0.05] border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Synopsis / Narrative Summary
                </label>
                <textarea
                  rows={3}
                  value={heroForm.synopsis}
                  onChange={(e) => setHeroForm({ ...heroForm, synopsis: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-md p-2.5 text-white text-xs leading-relaxed focus:border-[#A11C28] outline-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Hero Still Photo URL
                  </label>
                  <Input
                    value={heroForm.heroImage}
                    onChange={(e) => setHeroForm({ ...heroForm, heroImage: e.target.value })}
                    className="bg-white/[0.05] border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Video Start Delay (seconds)
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
                    className="bg-white/[0.05] border-white/15 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Hero YouTube Embed URL (with autoplay, loop, & start time)
                </label>
                <Input
                  value={heroForm.videoUrl}
                  onChange={(e) => setHeroForm({ ...heroForm, videoUrl: e.target.value })}
                  className="bg-white/[0.05] border-white/15 text-white text-xs font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 2: VAULT POSTERS */}
          {activeTab === "vault" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                    Genesis Vault Productions & Posters
                  </h3>
                  <p className="text-xs text-white/50">
                    Add or update production posters, titles, and localized language cards.
                  </p>
                </div>
                <Button
                  onClick={addVaultItem}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold h-8 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Production Poster
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vaultForm.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col justify-between gap-3"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-24 object-cover rounded border border-white/15 shrink-0 bg-black"
                      />
                      <div className="flex-1 space-y-2 min-w-0">
                        <Input
                          placeholder="Title"
                          value={item.title}
                          onChange={(e) => updateVaultItem(idx, "title", e.target.value)}
                          className="h-8 text-xs bg-black/40 border-white/15"
                        />
                        <Input
                          placeholder="Subtitle"
                          value={item.subtitle}
                          onChange={(e) => updateVaultItem(idx, "subtitle", e.target.value)}
                          className="h-8 text-xs bg-black/40 border-white/15"
                        />
                        <Input
                          placeholder="Badge (e.g. Complete Series)"
                          value={item.badge}
                          onChange={(e) => updateVaultItem(idx, "badge", e.target.value)}
                          className="h-8 text-xs bg-black/40 border-white/15"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-white/50 mb-1">Image URL</label>
                      <Input
                        value={item.image}
                        onChange={(e) => updateVaultItem(idx, "image", e.target.value)}
                        className="h-7 text-[11px] bg-black/40 border-white/15 font-mono"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                      <span className="text-[10px] font-mono text-white/40">{item.language}</span>
                      <button
                        onClick={() => removeVaultItem(idx)}
                        className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: UPCOMING PROJECTS SLATE */}
          {activeTab === "projects" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  Upcoming Projects Accordion Slate
                </h3>
                <p className="text-xs text-white/50">
                  Manage the cards shown in the upcoming projects accordion on the landing page.
                </p>
              </div>

              <div className="space-y-4">
                {projectsForm.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/[0.04] border border-white/10 grid md:grid-cols-12 gap-4 items-center"
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
                          placeholder="Project Title"
                          value={proj.title}
                          onChange={(e) => updateProjectItem(idx, "title", e.target.value)}
                          className="h-9 text-xs bg-black/40 border-white/15"
                        />
                        <Input
                          placeholder="Badge (e.g. 01 · EXODUS)"
                          value={proj.badge}
                          onChange={(e) => updateProjectItem(idx, "badge", e.target.value)}
                          className="h-9 text-xs bg-black/40 border-white/15"
                        />
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Description / Claim"
                        value={proj.claim}
                        onChange={(e) => updateProjectItem(idx, "claim", e.target.value)}
                        className="w-full bg-black/40 border border-white/15 rounded p-2 text-xs text-white/90"
                      />
                      <Input
                        placeholder="Backdrop Image URL"
                        value={proj.image}
                        onChange={(e) => updateProjectItem(idx, "image", e.target.value)}
                        className="h-7 text-[11px] bg-black/40 border-white/15 font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BROADCAST EPISODES (YOUTUBE MANAGER) */}
          {activeTab === "episodes" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                    24/7 Linear Live TV Broadcast Schedule & On-Demand Episodes
                  </h3>
                  <p className="text-xs text-white/50">
                    Add or update YouTube video links, chapters, and descriptions for the live
                    broadcast channel.
                  </p>
                </div>
                <Button
                  onClick={addEpisodeItem}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold h-8 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add YouTube Episode
                </Button>
              </div>

              <div className="space-y-4">
                {episodesForm.map((ep, idx) => (
                  <div
                    key={ep.id}
                    className="p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-3"
                  >
                    <div className="grid md:grid-cols-12 gap-3 items-center">
                      <div className="md:col-span-6">
                        <label className="block text-[10px] text-white/50 mb-1">
                          Episode Title
                        </label>
                        <Input
                          value={ep.title}
                          onChange={(e) => updateEpisodeItem(idx, "title", e.target.value)}
                          className="h-8 text-xs bg-black/40 border-white/15"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-[10px] text-white/50 mb-1">
                          YouTube Video ID (e.g. z5abtVIszH8)
                        </label>
                        <Input
                          value={ep.videoId}
                          onChange={(e) => updateEpisodeItem(idx, "videoId", e.target.value)}
                          className="h-8 text-xs bg-black/40 border-white/15 font-mono text-red-400 font-bold"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-[10px] text-white/50 mb-1">
                          Duration (Formatted)
                        </label>
                        <Input
                          value={ep.durationFormatted}
                          onChange={(e) =>
                            updateEpisodeItem(idx, "durationFormatted", e.target.value)
                          }
                          className="h-8 text-xs bg-black/40 border-white/15"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-12 gap-3">
                      <div className="md:col-span-8">
                        <label className="block text-[10px] text-white/50 mb-1">Synopsis</label>
                        <textarea
                          rows={2}
                          value={ep.synopsis}
                          onChange={(e) => updateEpisodeItem(idx, "synopsis", e.target.value)}
                          className="w-full bg-black/40 border border-white/15 rounded p-2 text-xs text-white"
                        />
                      </div>
                      <div className="md:col-span-4 space-y-2">
                        <div>
                          <label className="block text-[10px] text-white/50 mb-1">
                            Poster Image
                          </label>
                          <Input
                            value={ep.poster}
                            onChange={(e) => updateEpisodeItem(idx, "poster", e.target.value)}
                            className="h-8 text-xs bg-black/40 border-white/15 font-mono text-[11px]"
                          />
                        </div>
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => removeEpisodeItem(idx)}
                            className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition-colors"
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
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-[#08080c]">
          <button
            onClick={handleReset}
            className="text-white/40 hover:text-red-400 text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Original Defaults
          </button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-white/20 text-white hover:bg-white/10 text-xs h-9 px-4 rounded-lg"
            >
              Close
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#A11C28] hover:bg-[#7F151F] text-white font-bold text-xs h-9 px-5 rounded-lg flex items-center gap-1.5 shadow-md uppercase tracking-wider"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
