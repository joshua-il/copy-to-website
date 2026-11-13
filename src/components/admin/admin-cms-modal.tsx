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
  Upload,
  Link2,
  Loader2,
  Grid,
} from "lucide-react";
import {
  useCmsContent,
  type HeroContent,
  type ProductionCard,
  type ProjectSlateItem,
  type BroadcastEpisodeItem,
  type ArchiveGridItem,
} from "@/lib/cms-store";
import { useAdminAuth } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadCmsMedia } from "@/lib/cms.functions";

interface AdminCmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "hero" | "vault" | "projects" | "episodes" | "archive";
}

interface CloudImageFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  description?: string;
}

function CloudImageField({ label, value, onChange, description }: CloudImageFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste URL or upload image"
            className="h-8 text-xs bg-black/40 border-white/15 font-mono text-white/90 pl-7"
          />
          <Link2 className="w-3.5 h-3.5 text-white/30 absolute left-2 top-2.5" />
        </div>

        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-medium text-white transition-colors shrink-0">
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

      {value && (
        <div className="flex items-center gap-2 pt-1">
          <div className="w-10 h-7 rounded border border-white/20 overflow-hidden bg-black shrink-0">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] text-emerald-400 font-mono truncate">
            Active: {value.length > 50 ? `${value.slice(0, 47)}...` : value}
          </span>
        </div>
      )}
    </div>
  );
}

export function AdminCmsModal({ isOpen, onClose, defaultTab = "hero" }: AdminCmsModalProps) {
  const { adminUser } = useAdminAuth();
  const {
    cmsData,
    updateHero,
    updateVaultProductions,
    updateUpcomingProjects,
    updateBroadcastEpisodes,
    updateArchiveItems,
    resetToDefaults,
  } = useCmsContent();

  const [activeTab, setActiveTab] = useState<
    "hero" | "vault" | "projects" | "episodes" | "archive"
  >(defaultTab);
  const [heroForm, setHeroForm] = useState<HeroContent>({ ...cmsData.hero });
  const [vaultForm, setVaultForm] = useState<ProductionCard[]>([...cmsData.vaultProductions]);
  const [projectsForm, setProjectsForm] = useState<ProjectSlateItem[]>([
    ...cmsData.upcomingProjects,
  ]);
  const [episodesForm, setEpisodesForm] = useState<BroadcastEpisodeItem[]>([
    ...cmsData.broadcastEpisodes,
  ]);
  const [archiveForm, setArchiveForm] = useState<ArchiveGridItem[]>([
    ...(cmsData.archiveItems || []),
  ]);
  const [saveNotice, setSaveNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    updateHero(heroForm);
    updateVaultProductions(vaultForm);
    updateUpcomingProjects(projectsForm);
    updateBroadcastEpisodes(episodesForm);
    updateArchiveItems(archiveForm);
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

  const addProjectItem = () => {
    const newItem: ProjectSlateItem = {
      title: "New Project Slate",
      badge: "COMING SOON",
      claim: "Description of the upcoming production and scriptural focus.",
      image: "/assets/yahweh-hero-mount-sinai.jpg",
      alt: "New Project",
    };
    setProjectsForm([...projectsForm, newItem]);
  };

  const removeProjectItem = (index: number) => {
    setProjectsForm(projectsForm.filter((_, i) => i !== index));
  };

  // Archive Canvas Grid Helpers
  const updateArchiveItem = (index: number, field: keyof ArchiveGridItem, value: string) => {
    const copy = [...archiveForm];
    copy[index] = { ...copy[index], [field]: value };
    setArchiveForm(copy);
  };

  const addArchiveItem = () => {
    const newItem: ArchiveGridItem = {
      id: `archive-${Date.now()}`,
      title: "New Poster Feature",
      subtitle: "Special Edition · Chapter Study",
      imageUrl: "/assets/yahweh-hero-parted-sea.jpg",
      episode: "genesis",
      linkUrl: "/watch?episode=genesis",
    };
    setArchiveForm([...archiveForm, newItem]);
  };

  const removeArchiveItem = (index: number) => {
    setArchiveForm(archiveForm.filter((_, i) => i !== index));
  };

  // YouTube Broadcast Episode Helpers
  const addEpisodeItem = () => {
    const newItem: BroadcastEpisodeItem = {
      id: `ep-${Date.now()}`,
      title: "Genesis Chapter Special",
      subtitle: "Scripture Study & Narration",
      book: "Book of Genesis",
      chapter: "Chapter 1",
      durationSeconds: 600,
      durationFormatted: "10m 00s",
      videoId: "z5abtVIszH8",
      synopsis: "Episode description...",
      poster: "/assets/genesis-shepherds-poster.jpg",
      tag: "NEW EPISODE",
    };
    setEpisodesForm([...episodesForm, newItem]);
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
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0c0c12] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0a0a0f]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#A11C28]/20 border border-[#A11C28]/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#A11C28]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Visual Bible Admin CMS</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/60">
                  {adminUser?.email}
                </span>
              </h2>
              <p className="text-xs text-white/50">
                Update showrunner banners, poster artworks, video streams, and infinite canvas links
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {saveNotice && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full animate-fade-in">
                <Check className="w-3.5 h-3.5" /> Saved & Persisted
              </span>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-white/[0.08] bg-[#09090e] overflow-x-auto select-none">
          <button
            onClick={() => setActiveTab("hero")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === "hero"
                ? "text-white border-[#A11C28] bg-white/[0.04]"
                : "text-white/50 border-transparent hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <Film className="w-3.5 h-3.5" /> Hero Showcase
          </button>
          <button
            onClick={() => setActiveTab("vault")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === "vault"
                ? "text-white border-[#A11C28] bg-white/[0.04]"
                : "text-white/50 border-transparent hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Vault Posters ({vaultForm.length})
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === "projects"
                ? "text-white border-[#A11C28] bg-white/[0.04]"
                : "text-white/50 border-transparent hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Upcoming Slate ({projectsForm.length})
          </button>
          <button
            onClick={() => setActiveTab("archive")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === "archive"
                ? "text-white border-[#A11C28] bg-white/[0.04]"
                : "text-white/50 border-transparent hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <Grid className="w-3.5 h-3.5" /> Archive Canvas ({archiveForm.length})
          </button>
          <button
            onClick={() => setActiveTab("episodes")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === "episodes"
                ? "text-white border-[#A11C28] bg-white/[0.04]"
                : "text-white/50 border-transparent hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <Tv className="w-3.5 h-3.5" /> 24/7 TV Episodes ({episodesForm.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: HERO */}
          {activeTab === "hero" && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Showcase Title
                  </label>
                  <Input
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    className="bg-black/40 border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Tagline (Top Pill)
                  </label>
                  <Input
                    value={heroForm.tagline}
                    onChange={(e) => setHeroForm({ ...heroForm, tagline: e.target.value })}
                    className="bg-black/40 border-white/15 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Subtitle</label>
                <Input
                  value={heroForm.subtitle}
                  onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                  className="bg-black/40 border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Synopsis Description
                </label>
                <textarea
                  rows={3}
                  value={heroForm.synopsis}
                  onChange={(e) => setHeroForm({ ...heroForm, synopsis: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-md p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-[#A11C28]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <CloudImageField
                  label="Hero Poster Image"
                  value={heroForm.heroImage}
                  onChange={(val) => setHeroForm({ ...heroForm, heroImage: val })}
                  description="Initial still displayed before video loads"
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-white/80">
                    Video Delay (Seconds)
                  </label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    max="15"
                    value={heroForm.videoDelaySeconds}
                    onChange={(e) =>
                      setHeroForm({
                        ...heroForm,
                        videoDelaySeconds: parseFloat(e.target.value) || 2.5,
                      })
                    }
                    className="h-8 bg-black/40 border-white/15 text-white font-mono text-xs"
                  />
                  <p className="text-[10px] text-white/40">
                    Seconds to hold the still hero image before transitioning to video playback.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Embed Video URL (YouTube / Direct Stream)
                </label>
                <Input
                  value={heroForm.videoUrl}
                  onChange={(e) => setHeroForm({ ...heroForm, videoUrl: e.target.value })}
                  className="bg-black/40 border-white/15 text-white font-mono text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 2: VAULT POSTERS */}
          {activeTab === "vault" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/60">
                  Manage production cards visible in the Catalog Vault showcase strip.
                </p>
                <Button
                  onClick={addVaultItem}
                  className="h-8 text-xs bg-[#A11C28] hover:bg-[#7F151F] text-white gap-1 rounded-md"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Poster
                </Button>
              </div>

              <div className="space-y-3">
                {vaultForm.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#A11C28]">
                        Card #{idx + 1} · {item.title}
                      </span>
                      <button
                        onClick={() => removeVaultItem(idx)}
                        className="text-white/40 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] text-white/50 mb-1">Title</label>
                        <Input
                          value={item.title}
                          onChange={(e) => updateVaultItem(idx, "title", e.target.value)}
                          className="h-8 text-xs bg-black/40 border-white/15 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/50 mb-1">Subtitle</label>
                        <Input
                          value={item.subtitle}
                          onChange={(e) => updateVaultItem(idx, "subtitle", e.target.value)}
                          className="h-8 text-xs bg-black/40 border-white/15 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/50 mb-1">Badge Tag</label>
                        <Input
                          value={item.badge}
                          onChange={(e) => updateVaultItem(idx, "badge", e.target.value)}
                          className="h-8 text-xs bg-black/40 border-white/15 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-12 gap-3">
                      <div className="md:col-span-8">
                        <CloudImageField
                          label="Poster Image"
                          value={item.image}
                          onChange={(val) => updateVaultItem(idx, "image", val)}
                        />
                      </div>
                      <div className="md:col-span-4">
                        <label className="block text-[10px] text-white/50 mb-1">
                          Watch Episode ID
                        </label>
                        <Input
                          value={item.episode}
                          onChange={(e) => updateVaultItem(idx, "episode", e.target.value)}
                          className="h-8 text-xs bg-black/40 border-white/15 text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: UPCOMING PROJECTS SLATE */}
          {activeTab === "projects" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/60">
                  Update projects in the interactive AccordionOS upcoming production slate.
                </p>
                <Button
                  onClick={addProjectItem}
                  className="h-8 text-xs bg-[#A11C28] hover:bg-[#7F151F] text-white gap-1 rounded-md"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Slate Project
                </Button>
              </div>

              <div className="space-y-3">
                {projectsForm.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#A11C28]">
                        Project #{idx + 1} · {proj.title}
                      </span>
                      <button
                        onClick={() => removeProjectItem(idx)}
                        className="text-white/40 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-white/50 mb-1">Title</label>
                        <Input
                          value={proj.title}
                          onChange={(e) => updateProjectItem(idx, "title", e.target.value)}
                          className="h-8 text-xs bg-black/40 border-white/15 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/50 mb-1">Badge</label>
                        <Input
                          value={proj.badge}
                          onChange={(e) => updateProjectItem(idx, "badge", e.target.value)}
                          className="h-8 text-xs bg-black/40 border-white/15 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-white/50 mb-1">
                        Synopsis / Claim
                      </label>
                      <textarea
                        rows={2}
                        value={proj.claim}
                        onChange={(e) => updateProjectItem(idx, "claim", e.target.value)}
                        className="w-full bg-black/40 border border-white/15 rounded p-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <CloudImageField
                        label="Teaser Background Image"
                        value={proj.image}
                        onChange={(val) => updateProjectItem(idx, "image", val)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ARCHIVE CANVAS GRID */}
          {activeTab === "archive" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white">Infinite Archive Canvas Posters</h3>
                  <p className="text-[11px] text-white/50">
                    Posters rendered on the infinite 3D draggable canvas. Set custom click link or
                    episode!
                  </p>
                </div>
                <Button
                  onClick={addArchiveItem}
                  className="h-8 text-xs bg-[#A11C28] hover:bg-[#7F151F] text-white gap-1 rounded-md"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Canvas Poster
                </Button>
              </div>

              <div className="space-y-3">
                {archiveForm.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#A11C28]">
                        Poster #{idx + 1} · {item.title}
                      </span>
                      <button
                        onClick={() => removeArchiveItem(idx)}
                        className="text-white/40 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-white/50 mb-1">Poster Title</label>
                        <Input
                          value={item.title}
                          onChange={(e) => updateArchiveItem(idx, "title", e.target.value)}
                          className="h-8 text-xs bg-black/40 border-white/15 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/50 mb-1">Subtitle</label>
                        <Input
                          value={item.subtitle}
                          onChange={(e) => updateArchiveItem(idx, "subtitle", e.target.value)}
                          className="h-8 text-xs bg-black/40 border-white/15 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-white/50 mb-1">
                          Click Target Link (URL or Path)
                        </label>
                        <Input
                          value={item.linkUrl || ""}
                          placeholder="/watch?episode=genesis or https://..."
                          onChange={(e) => updateArchiveItem(idx, "linkUrl", e.target.value)}
                          className="h-8 text-xs bg-black/40 border-white/15 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/50 mb-1">
                          Episode ID Fallback
                        </label>
                        <Input
                          value={item.episode || "genesis"}
                          placeholder="genesis, yahweh, joseph..."
                          onChange={(e) => updateArchiveItem(idx, "episode", e.target.value)}
                          className="h-8 text-xs bg-black/40 border-white/15 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <CloudImageField
                        label="Poster Artwork"
                        value={item.imageUrl}
                        onChange={(val) => updateArchiveItem(idx, "imageUrl", val)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: 24/7 TV EPISODES */}
          {activeTab === "episodes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white">24/7 TV Broadcast Rotation</h3>
                  <p className="text-[11px] text-white/50">
                    Episodes cycle continuously in universal sync. Update YouTube IDs, titles, and
                    runtimes.
                  </p>
                </div>
                <Button
                  onClick={addEpisodeItem}
                  className="h-8 text-xs bg-[#A11C28] hover:bg-[#7F151F] text-white gap-1 rounded-md"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Episode
                </Button>
              </div>

              <div className="space-y-4">
                {episodesForm.map((ep, idx) => (
                  <div
                    key={ep.id}
                    className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#A11C28]/20 text-[#A11C28] text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-white">{ep.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        YouTube: {ep.videoId}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-white/50 mb-1">
                          Episode Title
                        </label>
                        <Input
                          value={ep.title}
                          onChange={(e) => updateEpisodeItem(idx, "title", e.target.value)}
                          className="h-8 text-xs bg-black/40 border-white/15 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/50 mb-1">Subtitle</label>
                        <Input
                          value={ep.subtitle}
                          onChange={(e) => updateEpisodeItem(idx, "subtitle", e.target.value)}
                          className="h-8 text-xs bg-black/40 border-white/15 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-12 gap-3">
                      <div className="md:col-span-5">
                        <label className="block text-[10px] text-white/50 mb-1">
                          YouTube Video ID or Link (e.g. z5abtVIszH8)
                        </label>
                        <Input
                          value={ep.videoId}
                          onChange={(e) => {
                            let val = e.target.value.trim();
                            // If full YouTube URL is pasted, extract the ID
                            const match = val.match(
                              /(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
                            );
                            if (match) val = match[1];
                            updateEpisodeItem(idx, "videoId", val);
                          }}
                          className="h-8 text-xs bg-black/40 border-white/15 font-mono text-red-400 font-bold"
                        />
                      </div>
                      <div className="md:col-span-4">
                        <label className="block text-[10px] text-white/50 mb-1">
                          Duration (Formatted, e.g. 19m 03s)
                        </label>
                        <Input
                          value={ep.durationFormatted}
                          onChange={(e) =>
                            updateEpisodeItem(idx, "durationFormatted", e.target.value)
                          }
                          className="h-8 text-xs bg-black/40 border-white/15"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-[10px] text-white/50 mb-1">
                          Total Seconds
                        </label>
                        <Input
                          type="number"
                          value={ep.durationSeconds}
                          onChange={(e) =>
                            updateEpisodeItem(
                              idx,
                              "durationSeconds",
                              parseInt(e.target.value, 10) || 600,
                            )
                          }
                          className="h-8 text-xs bg-black/40 border-white/15 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-12 gap-3">
                      <div className="md:col-span-7">
                        <label className="block text-[10px] text-white/50 mb-1">Synopsis</label>
                        <textarea
                          rows={2}
                          value={ep.synopsis}
                          onChange={(e) => updateEpisodeItem(idx, "synopsis", e.target.value)}
                          className="w-full bg-black/40 border border-white/15 rounded p-2 text-xs text-white"
                        />
                      </div>
                      <div className="md:col-span-5 space-y-2">
                        <CloudImageField
                          label="Poster Thumbnail"
                          value={ep.poster}
                          onChange={(val) => updateEpisodeItem(idx, "poster", val)}
                        />
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
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Factory Defaults
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
