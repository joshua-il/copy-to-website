import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Film,
  Play,
  Radio,
  RefreshCw,
  Share2,
  Tv,
  Edit3,
  Plus,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalSidebar } from "@/components/global-sidebar";
import { useGlobalLanguage } from "@/lib/language";
import { useAdminAuth } from "@/lib/admin-auth";
import { SiteFooter } from "@/components/site-footer";
import {
  useCmsContent,
  DEFAULT_BROADCAST_EPISODES,
  type BroadcastEpisodeItem,
} from "@/lib/cms-store";

// ─── Episode Matching & Fallback Resolution ──────────────────────────────────

function matchEpisode(
  query: string | undefined | null,
  list: BroadcastEpisodeItem[],
): BroadcastEpisodeItem {
  const fallbackList = list && list.length ? list : DEFAULT_BROADCAST_EPISODES;
  if (!fallbackList.length) return DEFAULT_BROADCAST_EPISODES[0];
  if (!query) return fallbackList[0];

  const q = query.toLowerCase().trim();

  // 1. Exact ID match
  const exact = fallbackList.find((ep) => ep.id.toLowerCase() === q);
  if (exact) return exact;

  // 2. Video ID match (e.g. z5abtVIszH8)
  const byVideo = fallbackList.find((ep) => ep.videoId.toLowerCase() === q);
  if (byVideo) return byVideo;

  // 3. Aliases and slug matches
  if (q.includes("46-50") || q.includes("journey") || q === "genesis" || q === "genesis-hindi") {
    const match = fallbackList.find((ep) => ep.id.includes("46-50") || ep.id === "genesis-46-50");
    if (match) return match;
  }
  if (
    q.includes("37-44") ||
    q.includes("joseph") ||
    q.includes("betrayal") ||
    q.includes("judah") ||
    q.includes("persian")
  ) {
    const match = fallbackList.find((ep) => ep.id.includes("37-44") || ep.id.includes("joseph"));
    if (match) return match;
  }
  if (q.includes("30-32") || q.includes("dreamer") || q.includes("malayalam")) {
    const match = fallbackList.find((ep) => ep.id.includes("30-32") || ep.id.includes("dreamer"));
    if (match) return match;
  }
  if (
    q.includes("45") ||
    q.includes("reconciliation") ||
    q.includes("brother") ||
    q.includes("tamil")
  ) {
    const match = fallbackList.find(
      (ep) => ep.id.includes("45") || ep.id.includes("reconciliation"),
    );
    if (match) return match;
  }
  if (q.includes("42") || q.includes("fire") || q.includes("faith")) {
    const match = fallbackList.find((ep) => ep.id.includes("42") || ep.id.includes("fire"));
    if (match) return match;
  }
  if (
    q.includes("yahweh") ||
    q.includes("exodus") ||
    q.includes("passover") ||
    q.includes("easter") ||
    q.includes("christ")
  ) {
    const match = fallbackList.find((ep) => ep.id.includes("yahweh") || ep.id.includes("exodus"));
    if (match) return match;
  }
  if (q.includes("trailer")) {
    const match = fallbackList.find((ep) => ep.id.includes("trailer"));
    if (match) return match;
  }

  // 4. Substring in ID or Title
  const partial = fallbackList.find(
    (ep) => ep.id.toLowerCase().includes(q) || ep.title.toLowerCase().includes(q),
  );
  if (partial) return partial;

  return fallbackList[0];
}

// ─── Multi-Language TV Channels Roster ──────────────────────────────────────

interface TvChannel {
  number: string;
  id: string;
  name: string;
  language: string;
  nativeLabel: string;
  status: "live" | "preview" | "coming_soon";
  badge: string;
}

const TV_CHANNELS: TvChannel[] = [
  {
    number: "01",
    id: "en-live",
    name: "Visual Bible English",
    language: "English",
    nativeLabel: "Global Master (Live 24/7)",
    status: "live",
    badge: "24/7 ON AIR",
  },
  {
    number: "02",
    id: "hi-live",
    name: "Visual Bible Hindi",
    language: "Hindi",
    nativeLabel: "हिंदी प्रसारण",
    status: "preview",
    badge: "EXPANDING NEXT",
  },
  {
    number: "03",
    id: "fa-live",
    name: "Visual Bible Persian",
    language: "Persian",
    nativeLabel: "پخش زنده فارسی",
    status: "preview",
    badge: "IN PIPELINE",
  },
  {
    number: "04",
    id: "ta-live",
    name: "Visual Bible Tamil",
    language: "Tamil",
    nativeLabel: "தமிழ் நேரலை",
    status: "preview",
    badge: "IN PIPELINE",
  },
  {
    number: "05",
    id: "ml-live",
    name: "Visual Bible Malayalam",
    language: "Malayalam",
    nativeLabel: "മലയാളം ചാനൽ",
    status: "preview",
    badge: "IN PIPELINE",
  },
  {
    number: "06",
    id: "tl-live",
    name: "Visual Bible Tagalog",
    language: "Tagalog",
    nativeLabel: "Pilipinas Broadcast",
    status: "preview",
    badge: "IN PIPELINE",
  },
];

// Helper: Format seconds to MM:SS or HH:MM:SS
function formatDuration(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.floor(totalSec % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Helper: Format clock time (e.g. "4:15 PM")
function formatClockTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
}

export const Route = createFileRoute("/watch")({
  validateSearch: (search: Record<string, unknown>) => ({
    episode: typeof search["episode"] === "string" ? search["episode"] : undefined,
    mode: typeof search["mode"] === "string" ? search["mode"] : "live",
  }),
  component: LiveTvPage,
  head: () => ({
    meta: [
      { title: "Live TV Broadcast · Visual Bible 24/7 Linear Stream & Guide" },
      {
        name: "description",
        content:
          "Watch the Visual Bible 24/7 continuous linear livestream with real-time electronic program guide (EPG). Stream Genesis and Joseph epics around the clock.",
      },
      { property: "og:title", content: "Visual Bible TV · 24/7 Global Livestream" },
      {
        property: "og:description",
        content:
          "Watch scripture brought to life with synchronized 24/7 live television scheduling and multi-channel regional broadcasting.",
      },
      { property: "og:type", content: "video.other" },
      { property: "og:url", content: "/watch" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function LiveTvPage() {
  const { episode: searchedEpisodeId, mode: initialMode } = Route.useSearch();
  const [globalLang, setGlobalLang] = useGlobalLanguage();
  const [copied, setCopied] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState("en-live");
  const [currentTimeSec, setCurrentTimeSec] = useState(() => Math.floor(Date.now() / 1000));
  const { isAdmin } = useAdminAuth();
  const { cmsData } = useCmsContent();

  // Dynamic episodes list from centralized CMS store (with factory fallback)
  const episodesList = useMemo(() => {
    return cmsData.broadcastEpisodes && cmsData.broadcastEpisodes.length
      ? cmsData.broadcastEpisodes
      : DEFAULT_BROADCAST_EPISODES;
  }, [cmsData.broadcastEpisodes]);

  // Total loop cycle in seconds
  const totalCycleSeconds = useMemo(() => {
    return episodesList.reduce((acc, ep) => acc + (ep.durationSeconds || 600), 0) || 3600;
  }, [episodesList]);

  // 1-second interval to drive the 24/7 broadcast clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeSec(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute live broadcast state based on wall-clock time
  const liveBroadcastState = useMemo(() => {
    const cycleOffset = currentTimeSec % totalCycleSeconds;
    let accumulated = 0;
    let activeIndex = 0;
    let elapsedInEpisode = 0;

    for (let i = 0; i < episodesList.length; i++) {
      const ep = episodesList[i];
      const duration = ep.durationSeconds || 600;
      if (accumulated + duration > cycleOffset) {
        activeIndex = i;
        elapsedInEpisode = cycleOffset - accumulated;
        break;
      }
      accumulated += duration;
    }

    const currentLiveEpisode = episodesList[activeIndex] || episodesList[0];
    const duration = currentLiveEpisode.durationSeconds || 600;
    const remainingInEpisode = Math.max(0, duration - elapsedInEpisode);
    const progressPercent = Math.min(100, Math.max(0, (elapsedInEpisode / duration) * 100));

    // Compute upcoming program schedule for the next 12 hours
    const currentEpisodeStartTimestamp = (currentTimeSec - elapsedInEpisode) * 1000;
    let scheduleCursor = currentEpisodeStartTimestamp;
    const scheduleGrid: Array<{
      episode: BroadcastEpisodeItem;
      indexInSchedule: number;
      startTime: Date;
      endTime: Date;
      isLiveNow: boolean;
      isUpNext: boolean;
    }> = [];

    // Build next 10 consecutive broadcast slots
    for (let slot = 0; slot < 10; slot++) {
      const epIndex = (activeIndex + slot) % episodesList.length;
      const ep = episodesList[epIndex];
      const epDuration = ep.durationSeconds || 600;
      const slotStart = new Date(scheduleCursor);
      const slotEnd = new Date(scheduleCursor + epDuration * 1000);

      scheduleGrid.push({
        episode: ep,
        indexInSchedule: slot,
        startTime: slotStart,
        endTime: slotEnd,
        isLiveNow: slot === 0,
        isUpNext: slot === 1,
      });

      scheduleCursor += epDuration * 1000;
    }

    return {
      activeIndex,
      currentLiveEpisode,
      elapsedInEpisode,
      remainingInEpisode,
      progressPercent,
      scheduleGrid,
    };
  }, [currentTimeSec, episodesList, totalCycleSeconds]);

  // STABLE PLAYBACK STATE: Only updates when switching episode or explicitly syncing
  const [activePlayback, setActivePlayback] = useState<{
    episodeId: string;
    videoId: string;
    isLive: boolean;
    startSeconds: number;
  }>(() => {
    const ep = matchEpisode(searchedEpisodeId, episodesList);
    return {
      episodeId: ep.id,
      videoId: ep.videoId,
      isLive: !searchedEpisodeId && initialMode === "live",
      startSeconds: 0,
    };
  });

  // Reactive Route Synchronization: When user clicks any homepage poster or changes URL params,
  // immediately update playback to the requested episode from beginning (00:00)!
  useEffect(() => {
    if (searchedEpisodeId) {
      const matched = matchEpisode(searchedEpisodeId, episodesList);
      setActivePlayback({
        episodeId: matched.id,
        videoId: matched.videoId,
        isLive: false,
        startSeconds: 0,
      });
    }
  }, [searchedEpisodeId, episodesList]);

  // When explicitly in Live 24/7 mode (and not on-demand), advance when on-air program naturally loops
  useEffect(() => {
    if (
      activePlayback.isLive &&
      !searchedEpisodeId &&
      liveBroadcastState.currentLiveEpisode.id !== activePlayback.episodeId
    ) {
      setActivePlayback({
        episodeId: liveBroadcastState.currentLiveEpisode.id,
        videoId: liveBroadcastState.currentLiveEpisode.videoId,
        isLive: true,
        startSeconds: 0,
      });
    }
  }, [
    activePlayback.isLive,
    activePlayback.episodeId,
    searchedEpisodeId,
    liveBroadcastState.currentLiveEpisode.id,
    liveBroadcastState.currentLiveEpisode.videoId,
  ]);

  // The episode metadata currently shown on screen
  const displayedEpisode = useMemo(() => {
    return (
      episodesList.find((ep) => ep.id === activePlayback.episodeId) ??
      matchEpisode(activePlayback.episodeId, episodesList)
    );
  }, [activePlayback.episodeId, episodesList]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const syncToLiveBroadcast = () => {
    const currentLive = liveBroadcastState.currentLiveEpisode;
    setActivePlayback({
      episodeId: currentLive.id,
      videoId: currentLive.videoId,
      startSeconds: Math.floor(liveBroadcastState.elapsedInEpisode),
      isLive: true,
    });
  };

  const playEpisodeOnDemand = (epId: string) => {
    const found = episodesList.find((ep) => ep.id === epId) ?? matchEpisode(epId, episodesList);
    setActivePlayback({
      episodeId: found.id,
      videoId: found.videoId,
      startSeconds: 0,
      isLive: false,
    });
  };

  return (
    <main
      className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#A11C28] selection:text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Global Sidebar Navigation (No Top Nav Bar) ── */}
      <GlobalSidebar />

      <div className="pl-0 md:pl-18 lg:pl-20 min-h-screen">
        {/* ── BROADCAST CONTROL UTILITY STRIP ── */}
        <div className="border-b border-white/[0.08] bg-[#07070a]/90 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-12 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pitch Home</span>
              </Link>

              <span className="h-3 w-px bg-white/10 hidden sm:inline-block" />

              {/* Live TV On-Air Badge */}
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
                </span>
                <span className="text-[11px] font-black tracking-[0.2em] text-white uppercase">
                  24/7 Live Stream
                </span>
                <span className="hidden md:inline-flex px-1.5 py-0.5 rounded bg-[#A11C28]/30 border border-[#A11C28]/50 text-[#ff4d5e] text-[9px] font-bold uppercase tracking-wider">
                  CH 01 · ENGLISH
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Live Sync Status Toggle */}
              {activePlayback.isLive ? (
                <div className="flex items-center gap-1.5 bg-red-950/40 border border-red-600/40 px-2.5 py-1 rounded text-[11px] font-bold text-red-400">
                  <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                  <span>SYNCED LIVE</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={syncToLiveBroadcast}
                  className="flex items-center gap-1.5 bg-[#A11C28] hover:bg-[#7F151F] text-white px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition-transform hover:scale-105 shadow-md shadow-red-950/60"
                >
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Jump to Live Point</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors px-2.5 py-1 rounded border border-white/10"
                title="Share broadcast link"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>

              {isAdmin && (
                <Link
                  to="/admin"
                  search={{ tab: "episodes" }}
                  className="inline-flex items-center gap-1.5 text-xs text-white bg-[#A11C28] hover:bg-[#7F151F] font-bold transition-colors px-2.5 py-1 rounded shadow"
                  title="Manage YouTube links and episodes in Studio CMS"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Studio CMS</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {/* ── CHANNEL SELECTOR RAIL (MULTI-LANGUAGE ARCHITECTURE) ── */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-[#A11C28]" />
                <span className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase">
                  Visual Bible Linear Channels
                </span>
              </div>
              <span className="text-[11px] text-white/40">
                Active: Channel 01 · Multi-language rollout in progress
              </span>
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
              {TV_CHANNELS.map((ch) => {
                const isSelected = selectedChannel === ch.id;
                const isLiveActive = ch.status === "live";
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setSelectedChannel(ch.id);
                      if (isLiveActive) syncToLiveBroadcast();
                    }}
                    className={`shrink-0 flex items-center gap-3 px-3.5 py-2 rounded-lg border text-left transition-all ${
                      isSelected
                        ? "bg-[#14141d] border-[#A11C28] text-white shadow-lg shadow-red-950/30"
                        : "bg-[#0a0a0f] border-white/[0.08] text-white/70 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-[10px] ${
                        isSelected ? "bg-[#A11C28] text-white" : "bg-white/10 text-white/60"
                      }`}
                    >
                      {ch.number}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold">{ch.name}</span>
                        {isLiveActive ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        ) : (
                          <span className="text-[9px] font-mono text-white/40 uppercase">
                            Preview
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-white/40 block leading-tight">
                        {ch.nativeLabel}
                      </span>
                    </div>

                    <span
                      className={`ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase ${
                        isLiveActive
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      {ch.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── MAIN CINEMA SCREEN FRAME (16:9 THEATER CONTAINER) ── */}
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.12] bg-black shadow-2xl shadow-black/90">
            <div className="relative aspect-video w-full bg-black">
              {/* Poster fallback backdrop */}
              <img
                src={displayedEpisode.poster}
                alt={displayedEpisode.title}
                className="absolute inset-0 h-full w-full object-cover opacity-20 pointer-events-none"
              />

              {/* YouTube Embed Player — Smooth & Continuous (Never resets or reloads on second ticks) */}
              <iframe
                key={activePlayback.videoId}
                className="absolute inset-0 h-full w-full border-0 z-10"
                src={`https://www.youtube.com/embed/${activePlayback.videoId}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1${
                  activePlayback.startSeconds > 0 ? `&start=${activePlayback.startSeconds}` : ""
                }`}
                title={displayedEpisode.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />

              {/* Corner Watermark Overlay */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className="text-[10px] font-black tracking-widest text-white uppercase">
                  {activePlayback.isLive ? "LIVE 24/7 BROADCAST" : "ON-DEMAND SELECTION"}
                </span>
                <span className="text-white/40 font-mono text-[10px]">· CH 01</span>
              </div>
            </div>

            {/* ── Live Playback Progress Scrubber (Synchronized Real-Time) ── */}
            {activePlayback.isLive && (
              <div className="bg-[#09090e] border-t border-white/[0.08] px-4 py-2.5 flex flex-col gap-1.5 select-none">
                <div className="flex items-center justify-between text-[11px] font-mono text-white/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-white/80 font-bold">ON AIR PROGRESS:</span>
                    <span className="text-white">
                      {formatDuration(liveBroadcastState.elapsedInEpisode)}
                    </span>
                    <span>/</span>
                    <span>{formatDuration(displayedEpisode.durationSeconds)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Remaining:</span>
                    <span className="text-amber-400 font-semibold">
                      {formatDuration(liveBroadcastState.remainingInEpisode)}
                    </span>
                  </div>
                </div>

                {/* Progress Track */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#A11C28] to-red-500 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${liveBroadcastState.progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── BROADCAST METADATA & NOW PLAYING DETAILS ── */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10 border-b border-white/[0.08]">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-[#A11C28] text-white">
                  {displayedEpisode.tag}
                </span>
                <span className="text-xs font-mono font-semibold tracking-wider text-amber-400">
                  {displayedEpisode.chapter}
                </span>
                <span className="text-white/40 text-xs">·</span>
                <span className="text-xs text-white/50">{displayedEpisode.book}</span>
                <span className="text-white/40 text-xs">·</span>
                <span className="text-xs text-white/50">{displayedEpisode.durationFormatted}</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 tracking-tight">
                {displayedEpisode.title}
              </h1>
              <p className="text-xs md:text-sm font-semibold tracking-wide text-white/60 mb-4">
                {displayedEpisode.subtitle}
              </p>

              <p className="text-xs md:text-sm text-white/75 leading-relaxed max-w-2xl">
                {displayedEpisode.synopsis}
              </p>
            </div>

            {/* Broadcast Status Card */}
            <div className="rounded-xl border border-white/[0.08] bg-[#0c0c12] p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-white/[0.06] pb-2">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                    <span className="text-xs font-bold tracking-wider uppercase text-white">
                      Broadcast Feed
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">STATUS: OPTIMAL</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-white/60">
                    <span>Feed Source</span>
                    <span className="text-white font-mono">NRIM Master 4K Feed</span>
                  </div>
                  <div className="flex items-center justify-between text-white/60">
                    <span>Audio Master</span>
                    <span className="text-white font-mono">5.1 Multichannel Dolby</span>
                  </div>
                  <div className="flex items-center justify-between text-white/60">
                    <span>Broadcast Schedule</span>
                    <span className="text-white font-mono">24/7 Linear Rotation</span>
                  </div>
                  <div className="flex items-center justify-between text-white/60">
                    <span>Global Languages</span>
                    <span className="text-amber-400 font-mono">English (Primary)</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.06]">
                {activePlayback.isLive ? (
                  <div className="text-[11px] text-white/50 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Viewing synchronized live stream</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={syncToLiveBroadcast}
                    className="w-full bg-[#A11C28] hover:bg-[#7F151F] text-white text-xs font-bold py-2.5 rounded uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Return to 24/7 Live Stream</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── 24/7 ELECTRONIC PROGRAM GUIDE (EPG / LIVE TV SCHEDULE) ── */}
          <div className="py-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-[#A11C28]" />
                  <h2 className="text-lg md:text-xl font-black text-white tracking-wide uppercase">
                    Linear TV Program Guide (EPG)
                  </h2>
                </div>
                <p className="text-xs text-white/50">
                  Continuous 24/7 synchronized broadcast schedule for Channel 01. All times shown in
                  your local timezone.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-white/60 font-mono bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Next Loop: ~1h 37m</span>
                </span>
              </div>
            </div>

            {/* Schedule Timeline Cards */}
            <div className="space-y-3">
              {liveBroadcastState.scheduleGrid.map((item, idx) => {
                const isCurrentPlaying = item.isLiveNow && activePlayback.isLive;
                const isSelectedManual =
                  !activePlayback.isLive && item.episode.id === activePlayback.episodeId;
                return (
                  <div
                    key={`${item.episode.id}-${idx}`}
                    className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border transition-all ${
                      isCurrentPlaying
                        ? "bg-red-950/20 border-red-600/50 shadow-lg shadow-red-950/20"
                        : isSelectedManual
                          ? "bg-white/[0.06] border-white/30"
                          : "bg-[#0b0b10] border-white/[0.06] hover:border-white/[0.15] hover:bg-[#101016]"
                    }`}
                  >
                    {/* Left: Time & Slot Badge */}
                    <div className="flex items-center gap-4 mb-2 md:mb-0 md:w-56 shrink-0">
                      <div className="flex flex-col">
                        <span className="text-sm font-mono font-bold text-white">
                          {formatClockTime(item.startTime)}
                        </span>
                        <span className="text-[10px] font-mono text-white/40">
                          Until {formatClockTime(item.endTime)}
                        </span>
                      </div>

                      {item.isLiveNow ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black tracking-wider uppercase shadow">
                          <Radio className="w-2.5 h-2.5 animate-pulse" /> LIVE
                        </span>
                      ) : item.isUpNext ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold tracking-wider uppercase">
                          UP NEXT
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-white/30 uppercase">
                          SCHEDULED
                        </span>
                      )}
                    </div>

                    {/* Center: Episode Title & Chapter */}
                    <div className="flex-1 md:px-4">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-mono font-semibold text-white/40 uppercase">
                          {item.episode.chapter}
                        </span>
                        <span className="text-white/20">·</span>
                        <span className="text-[10px] font-mono text-white/40">
                          {item.episode.durationFormatted}
                        </span>
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-white leading-snug">
                        {item.episode.title}
                      </h3>
                      <p className="text-xs text-white/50 line-clamp-1 mt-0.5">
                        {item.episode.subtitle}
                      </p>
                    </div>

                    {/* Right: Action Button */}
                    <div className="mt-3 md:mt-0 flex items-center gap-2 shrink-0 justify-end">
                      {item.isLiveNow ? (
                        <button
                          type="button"
                          onClick={syncToLiveBroadcast}
                          className={`text-xs font-bold px-4 py-2 rounded uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                            activePlayback.isLive
                              ? "bg-red-600 text-white shadow-md shadow-red-950/60"
                              : "bg-[#A11C28] hover:bg-[#7F151F] text-white"
                          }`}
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>{activePlayback.isLive ? "Watching Live" : "Tune In Live"}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => playEpisodeOnDemand(item.episode.id)}
                          className="text-xs font-semibold px-3 py-1.5 rounded border border-white/20 text-white/80 hover:text-white hover:border-white/40 hover:bg-white/[0.04] transition-colors flex items-center gap-1"
                        >
                          <span>Preview Episode</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── ON-DEMAND ARCHIVE (PLAY ANY EPISODE FROM BEGINNING) ── */}
          <div className="py-10 border-t border-white/[0.08]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Film className="w-4 h-4 text-[#A11C28]" />
                  <h2 className="text-lg md:text-xl font-black text-white tracking-wide uppercase">
                    On-Demand Episode Archive
                  </h2>
                </div>
                <p className="text-xs text-white/50">
                  Choose any release to stream on-demand from minute 00:00.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="/#waitlist"
                  className="inline-flex items-center gap-2 bg-[#A11C28] hover:bg-[#7F151F] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-red-950/40 uppercase tracking-wider"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Subscribe to watch on demand
                </a>
                <span className="text-xs font-mono text-white/40">
                  {episodesList.length} Releases
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {episodesList.map((ep, idx) => {
                const isSelected = displayedEpisode.id === ep.id;
                return (
                  <div
                    key={ep.id}
                    onClick={() => playEpisodeOnDemand(ep.id)}
                    className={`group rounded-xl overflow-hidden border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#14141d] border-[#A11C28] shadow-xl shadow-red-950/40"
                        : "bg-[#0a0a0f] border-white/[0.08] hover:border-white/20 hover:bg-[#101016]"
                    }`}
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-black">
                      <img
                        src={ep.poster}
                        alt={ep.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                          <Play className="w-4 h-4 fill-black text-black ml-0.5" />
                        </div>
                      </div>

                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-mono font-bold text-white">
                        EP {idx + 1}
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-mono text-white/80">
                        {ep.durationFormatted}
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-[#A11C28] uppercase font-bold tracking-wider">
                          {ep.chapter}
                        </span>
                        <h3 className="text-sm font-bold text-white mt-1 leading-snug group-hover:text-[#ff4d5e] transition-colors line-clamp-2">
                          {ep.title}
                        </h3>
                        <p className="text-xs text-white/50 mt-1 line-clamp-2">{ep.synopsis}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs gap-2">
                        <span className="text-[11px] font-mono text-white/40">{ep.tag}</span>
                        <div className="flex items-center gap-2.5">
                          <a
                            href="/#waitlist"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] font-bold tracking-wider text-amber-400/90 hover:text-amber-300 uppercase transition-colors"
                            title="Subscribe to watch on demand"
                          >
                            Subscribe on demand
                          </a>
                          <span className="text-white font-semibold flex items-center gap-1 group-hover:text-[#A11C28] transition-colors">
                            Stream <Play className="w-2.5 h-2.5 fill-current" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Dedicated Option Card: Subscribe to watch on demand */}
              <div className="rounded-xl overflow-hidden border border-[#A11C28]/40 bg-gradient-to-b from-red-950/30 via-[#0e0e14] to-[#0a0a0f] p-5 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#A11C28]/25 border border-[#A11C28]/40 text-[#ff4d5e] text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
                    <Sparkles className="w-3 h-3" /> All-Access Pass
                  </div>
                  <h3 className="text-base font-black text-white leading-snug">
                    Subscribe to watch on demand
                  </h3>
                  <p className="text-xs text-white/65 mt-2 leading-relaxed">
                    Get full on-demand streaming access to the entire Genesis archive, upcoming Exodus releases, and every regional language edition.
                  </p>
                  <div className="mt-4 space-y-1.5 text-[11px] text-white/70">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Instant 4K HDR On-Demand Streaming</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>All 8 Languages & 100-Language Pipeline</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Cinematic 5.1 Multichannel Dolby Audio</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/[0.08]">
                  <a
                    href="/#waitlist"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#A11C28] hover:bg-[#7F151F] text-white text-xs font-bold py-2.5 rounded uppercase tracking-wider transition-all shadow-md shadow-red-950/50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Subscribe to watch on demand
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── UPCOMING PREMIERE SAGA CALLOUT ── */}
          <div className="mt-12 rounded-2xl border border-white/[0.1] bg-gradient-to-r from-red-950/20 via-black to-black p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-2xl">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#A11C28] animate-pulse" />
                <span className="text-[11px] font-bold tracking-[0.25em] text-white/60 uppercase">
                  Next Major Television Event
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white">
                YAHWEH — The Book of Exodus
              </h3>
              <p className="text-xs md:text-sm text-white/65 mt-2 max-w-xl">
                Following the Genesis broadcast cycle, the epic saga advances to Exodus. Join the
                global premiere waitlist for priority access to live stream screening dates.
              </p>
            </div>
            <Button
              asChild
              className="bg-[#A11C28] hover:bg-[#7F151F] text-white font-bold whitespace-nowrap shadow-lg shadow-red-950/60 uppercase tracking-wider"
            >
              <Link to="/explore">Join Premiere Waitlist</Link>
            </Button>
          </div>
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
