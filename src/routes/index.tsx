import { useState, useEffect, useRef, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Play,
  Plus,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Search,
  Home,
  Tv,
  Film,
  Compass,
  Cpu,
  Bookmark,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronLeft,
  Menu,
  Globe as GlobeIcon,
  Check,
  Edit3,
} from "lucide-react";
import { GlobalSidebar } from "@/components/global-sidebar";
import { RegionalSelector } from "@/components/site-header";
import { useGlobalLanguage } from "@/lib/language";
import { useAdminAuth } from "@/lib/admin-auth";
import { useCmsContent } from "@/lib/cms-store";
import { AdminCmsModal } from "@/components/admin/admin-cms-modal";
import { joinWaitlist } from "@/lib/waitlist.functions";
import GalleryTunnel from "@/components/originkit/ui/hero-13/gallery-tunnel";
import Globe from "@/components/originkit/ui/globe-custom-style";
import InfiniteGrid from "@/components/originkit/ui/infinite-grid";
import AccordionOS from "@/components/originkit/ui/accordion-os";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "Visual Bible TV · The Network Hub — Until All Hear" },
      {
        name: "description",
        content:
          "Visual Bible: Scripture brought to life through cinematic AI and real-actor performances. 50 chapters of Genesis complete across 8 languages. Now in production: YAHWEH — The Book of Exodus.",
      },
      { property: "og:title", content: "Visual Bible TV · Until All Hear" },
      {
        property: "og:description",
        content:
          "Experience the biblical epic. 50 chapters of Genesis complete. Upcoming premiere: YAHWEH — The Book of Exodus.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://visualbible.tv" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
} as Parameters<typeof createFileRoute<"/">>[0]);

// ─── Data: Existing Productions (Genesis, Joseph, & Languages) ───────────────

const EXISTING_PRODUCTIONS = [
  {
    id: "genesis-main",
    title: "In the Beginning",
    subtitle: "The Book of Genesis · 50 Chapters",
    image: "/assets/genesis-shepherds-poster.jpg",
    badge: "Complete Series",
    language: "English",
    episode: "genesis",
  },
  {
    id: "joseph-feature",
    title: "The Purpose of God",
    subtitle: "The Story of Joseph · Betrayed by Brothers",
    image: "/assets/purpose-of-god-joseph-poster.jpg",
    badge: "Special Presentation",
    language: "English / Global",
    episode: "joseph",
  },
  {
    id: "genesis-hindi",
    title: "उत्पत्ति (Genesis)",
    subtitle: "Hindi Edition · Full Audio & Subtitles",
    image: "/assets/genesis-hindi-campfire-poster.jpg",
    badge: "Hindi Audio",
    language: "Hindi",
    episode: "genesis",
  },
  {
    id: "genesis-tamil",
    title: "ஆதியாகமம் (Genesis)",
    subtitle: "Tamil Edition · Complete Season",
    image: "/assets/genesis-tamil-poster.jpg",
    badge: "Tamil Audio",
    language: "Tamil",
    episode: "genesis",
  },
  {
    id: "genesis-malayalam",
    title: "ഉദ്ഭവം (Genesis)",
    subtitle: "Malayalam Edition · Complete Season",
    image: "/assets/genesis-malayalam-poster.jpg",
    badge: "Malayalam",
    language: "Malayalam",
    episode: "genesis",
  },
  {
    id: "genesis-chinese",
    title: "创世记 (Genesis)",
    subtitle: "Chinese Edition · The Joseph Story in Egypt",
    image: "/assets/genesis-chinese-poster.jpg",
    badge: "Mandarin",
    language: "Chinese",
    episode: "genesis",
  },
  {
    id: "genesis-persian",
    title: "یهودا، برگزیده خدا",
    subtitle: "Persian Edition · Judah Chosen by God",
    image: "/assets/genesis-persian-judah-poster.jpg",
    badge: "Persian / Farsi",
    language: "Persian",
    episode: "judas",
  },
];

const PITCH_TUNNEL_IMAGES = [
  "/assets/genesis-shepherds-poster.jpg",
  "/assets/purpose-of-god-joseph-poster.jpg",
  "/assets/genesis-chinese-poster.jpg",
  "/assets/genesis-persian-judah-poster.jpg",
  "/assets/genesis-hindi-campfire-poster.jpg",
  "/assets/genesis-malayalam-poster.jpg",
  "/assets/genesis-tamil-poster.jpg",
  "/assets/yahweh-tablets-poster.jpg",
  "/assets/yahweh-monument.jpg",
  "/assets/yahweh-exodus-staff-poster.jpg",
  "/assets/moses-parting-sea.jpg",
  "/assets/genesis-pharaoh-prophet-sunset.jpg",
  "/assets/genesis-poster.jpg",
  "/assets/genesis-tagalog-poster.jpg",
  "/assets/genesis-warriors-fire.jpg",
  "/assets/judas-chosen-by-god-persian.jpg",
];

// ─── Data: The Living Infinite Archive (Originkit Infinite Canvas) ────────────

interface ArchiveGridItem {
  title: string;
  subtitle: string;
  imageUrl: string;
  episode: string;
}

const INFINITE_ARCHIVE_ITEMS: ArchiveGridItem[] = [
  {
    title: "In the Beginning",
    subtitle: "Genesis · 50 Chapters Complete",
    imageUrl: "/assets/genesis-shepherds-poster.jpg",
    episode: "genesis",
  },
  {
    title: "The Purpose of God",
    subtitle: "The Story of Joseph in Egypt",
    imageUrl: "/assets/purpose-of-god-joseph-poster.jpg",
    episode: "joseph",
  },
  {
    title: "Genesis · उत्पत्ति",
    subtitle: "Hindi Edition · Campfire Council",
    imageUrl: "/assets/genesis-hindi-campfire-poster.jpg",
    episode: "genesis",
  },
  {
    title: "Genesis · ஆதியாகமம்",
    subtitle: "Tamil Edition · Complete Season",
    imageUrl: "/assets/genesis-tamil-poster.jpg",
    episode: "genesis",
  },
  {
    title: "Genesis · ഉദ്ഭവം",
    subtitle: "Malayalam Edition · Complete",
    imageUrl: "/assets/genesis-malayalam-poster.jpg",
    episode: "genesis",
  },
  {
    title: "Genesis · 创世记",
    subtitle: "Mandarin Chinese Edition",
    imageUrl: "/assets/genesis-chinese-poster.jpg",
    episode: "genesis",
  },
  {
    title: "یهودا، برگزیده خدا",
    subtitle: "Persian Edition · Judah Chosen",
    imageUrl: "/assets/genesis-persian-judah-poster.jpg",
    episode: "judas",
  },
  {
    title: "Genesis · Tagalog",
    subtitle: "Philippines & Southeast Asia",
    imageUrl: "/assets/genesis-tagalog-poster.jpg",
    episode: "genesis",
  },
  {
    title: "YAHWEH · Mount Sinai",
    subtitle: "The Tablets of the Law (Exodus)",
    imageUrl: "/assets/yahweh-tablets-poster.jpg",
    episode: "yahweh",
  },
  {
    title: "The Waters Divide",
    subtitle: "Exodus Chapter 14 · Feature",
    imageUrl: "/assets/moses-parting-sea.jpg",
    episode: "yahweh",
  },
  {
    title: "YAHWEH · The Deliverer",
    subtitle: "The Red Sea Staff Poster",
    imageUrl: "/assets/yahweh-exodus-staff-poster.jpg",
    episode: "yahweh",
  },
  {
    title: "Joseph Before Pharaoh",
    subtitle: "Genesis 41 Historical Study",
    imageUrl: "/assets/genesis-pharaoh-prophet-sunset.jpg",
    episode: "joseph",
  },
  {
    title: "Covenant in the Night",
    subtitle: "Genesis 15 Patriarch Council",
    imageUrl: "/assets/genesis-warriors-fire.jpg",
    episode: "genesis",
  },
  {
    title: "The Promise Fulfilled",
    subtitle: "The Patriarchs of Genesis",
    imageUrl: "/assets/genesis-poster.jpg",
    episode: "genesis",
  },
  {
    title: "The Mountain of God",
    subtitle: "Exodus Archaeological Study",
    imageUrl: "/assets/yahweh-monument.jpg",
    episode: "yahweh",
  },
  {
    title: "Creation to Abraham",
    subtitle: "Genesis Key Studio Art",
    imageUrl: "/assets/in-the-beginning-banner.png",
    episode: "genesis",
  },
];

// ─── Data: Workflow Steps (35mm Film Strip Layout) ──────────────────────────

interface WorkflowStep {
  id: string;
  stepNumber: string;
  code: string;
  frameCode: string;
  title: string;
  shortDesc: string;
  extendedDesc: string;
  image: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "avatars",
    stepNumber: "01",
    code: "NRIM 5219 ▸ 01",
    frameCode: "01A",
    title: "Real Humans as Biblical Avatars",
    shortDesc:
      "We cast real people and translate their living human likeness, emotion, and presence directly into biblical characters.",
    extendedDesc:
      "Rather than artificial CGI mannequins or standard Hollywood dramatization, we capture the raw human emotion, facial nuances, and spiritual weight of living individuals. Through our proprietary AI performance pipeline, their physical likeness is transformed into living, historically grounded biblical avatars for the patriarchs, prophets, and witnesses of Scripture.",
    image: "/assets/genesis-shepherds-poster.jpg",
  },
  {
    id: "worldbuilding",
    stepNumber: "02",
    code: "NRIM 5219 ▸ 02",
    frameCode: "02A",
    title: "Building the Ancient Biblical World",
    shortDesc:
      "We reconstruct the sacred geography, ancient architecture, and monumental world of Genesis and Exodus.",
    extendedDesc:
      "From the primordial expanse of Eden and Abraham's encampments across Mesopotamia to the colossal courts of Pharaoh, the parted waters of the Red Sea, and the thunderous crags of Mount Sinai. We procedurally and historically reconstruct the sacred geography, architecture, textiles, and atmospheric lighting of antiquity with rigorous archaeological fidelity.",
    image: "/assets/yahweh-hero-mount-sinai.jpg",
  },
  {
    id: "languages",
    stepNumber: "03",
    code: "NRIM 5219 ▸ 03",
    frameCode: "03A",
    title: "100 Languages for Every Tribe & Nation",
    shortDesc:
      "A dedicated global pipeline to produce Visual Bible in 100 spoken languages — reaching oral cultures and unreached communities without written Scripture.",
    extendedDesc:
      "Over a billion people belong to oral traditions and regional dialects that lack accessible biblical translations. By pairing neural voice translation with authentic oral delivery, our localization pipeline overcomes the literacy barrier — delivering Scripture visually and acoustically so every people group hears God's Word in the dialect of their heart.",
    image: "/assets/genesis-hindi-campfire-poster.jpg",
  },
];

// ─── Data: Upcoming Projects (Originkit AccordionOS) ─────────────────────────

const UPCOMING_PROJECTS_ITEMS = [
  {
    title: "YAHWEH — The Book of Exodus",
    badge: "01 · EXODUS",
    claim:
      "The God Who Reveals His Power. The ten plagues of Egypt, the roaring waters of the Red Sea divided, the pillar of cloud and fire, and the giving of the Law atop Mount Sinai.",
    image: "/assets/yahweh-hero-parted-sea.jpg",
    alt: "YAHWEH The Book of Exodus",
    offsetY: 0,
  },
  {
    title: "In the Beginning — The Book of Genesis",
    badge: "02 · GENESIS",
    claim:
      "The God Who Fulfills His Promise. The complete 50-chapter foundational saga from Creation and the Garden of Eden to Abraham, Isaac, Jacob, and the patriarchs.",
    image: "/assets/genesis-shepherds-poster.jpg",
    alt: "In the Beginning Genesis",
    offsetY: 0,
  },
  {
    title: "Visual Bible TV Series",
    badge: "03 · SERIES",
    claim:
      "An episodic television broadcast network delivering chapter-by-chapter dramatizations with 4K HDR cinematography, spatial audio, and cinematic scoring.",
    image: "/assets/in-the-beginning-banner.png",
    alt: "Visual Bible TV Series",
    offsetY: 0,
  },
  {
    title: "The Purpose of God — The Story of Joseph",
    badge: "04 · JOSEPH",
    claim:
      "Betrayed by his brothers, sold into Egyptian bondage, and exalted to the throne. A masterclass in divine sovereignty, forgiveness, and salvation.",
    image: "/assets/purpose-of-god-joseph-poster.jpg",
    alt: "The Purpose of God Joseph",
    offsetY: 0,
  },
  {
    title: "100 Languages Global Initiative",
    badge: "05 · GLOBAL",
    claim:
      "Reaching unreached regional dialects and oral mother tongues without written scripture. Overcoming illiteracy so every nation hears the Word in their heart tongue.",
    image: "/assets/genesis-hindi-campfire-poster.jpg",
    alt: "100 Languages Global Initiative",
    offsetY: 0,
  },
];

// ─── Data: Languages & Regions Reached (3D Globe Markers) ────────────────────

interface ReachedLanguage {
  id: string;
  name: string;
  nativeName: string;
  regions: string;
  badge: string;
  isUpcoming?: boolean;
  lat: number;
  lng: number;
}

const REACHED_LANGUAGES: ReachedLanguage[] = [
  {
    id: "india",
    name: "Hindi · Tamil · Malayalam",
    nativeName: "हिन्दी · தமிழ் · മലയാളം",
    regions: "India, South Asia & Global Diaspora",
    badge: "3 Live Tracks",
    lat: 20.59,
    lng: 78.96,
  },
  {
    id: "persian",
    name: "Persian (Farsi)",
    nativeName: "فارسی",
    regions: "Iran, Middle East & Farsi Diaspora",
    badge: "Judah (Gen 38) Live",
    lat: 35.68,
    lng: 51.38,
  },
  {
    id: "tagalog",
    name: "Tagalog",
    nativeName: "Wikang Tagalog",
    regions: "Philippines & Southeast Asia",
    badge: "Genesis Series Live",
    lat: 14.59,
    lng: 120.98,
  },
  {
    id: "english",
    name: "English (Native)",
    nativeName: "English",
    regions: "USA, UK, Canada, Australia, New Zealand",
    badge: "Full Catalog Live",
    lat: 38.9,
    lng: -77.03,
  },
  {
    id: "malay",
    name: "Malay",
    nativeName: "Bahasa Melayu",
    regions: "Malaysia, Singapore, Brunei",
    badge: "Genesis Live",
    lat: 3.13,
    lng: 101.68,
  },
  {
    id: "chinese",
    name: "Chinese (Mandarin)",
    nativeName: "中文 / 创世记",
    regions: "China, Taiwan, East Asia Diaspora",
    badge: "Joseph in Egypt Live",
    lat: 31.23,
    lng: 121.47,
  },
  {
    id: "yoruba",
    name: "Yoruba",
    nativeName: "Èdè Yorùbá",
    regions: "Nigeria & West Africa",
    badge: "In Production",
    isUpcoming: true,
    lat: 6.52,
    lng: 3.37,
  },
];

const GLOBE_MARKERS = [
  // India (Hindi, Tamil, Malayalam)
  { lat: 28.61, lng: 77.2 },
  { lat: 13.08, lng: 80.27 },
  { lat: 9.93, lng: 76.26 },
  // Persia (Farsi)
  { lat: 35.68, lng: 51.38 },
  // Philippines (Tagalog)
  { lat: 14.59, lng: 120.98 },
  // English (USA, UK, Canada, Australia)
  { lat: 38.9, lng: -77.03 },
  { lat: 34.05, lng: -118.24 },
  { lat: 51.5, lng: -0.12 },
  { lat: 45.42, lng: -75.69 },
  { lat: -33.86, lng: 151.2 },
  // Malay (Malaysia / Singapore)
  { lat: 3.13, lng: 101.68 },
  { lat: 1.35, lng: 103.81 },
  // Yoruba (Nigeria / West Africa)
  { lat: 6.52, lng: 3.37 },
  // China (Mandarin)
  { lat: 31.23, lng: 121.47 },
  { lat: 39.9, lng: 116.4 },
];

// ─── Component ───────────────────────────────────────────────────────────────

function LandingPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useGlobalLanguage();
  const { isAdmin } = useAdminAuth();
  const { cmsData } = useCmsContent();
  const [adminCmsTab, setAdminCmsTab] = useState<
    "hero" | "vault" | "projects" | "episodes" | "archive" | null
  >(null);
  const [mounted, setMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [hoveredStrip, setHoveredStrip] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setMounted(true);
    const delay = (cmsData.hero.videoDelaySeconds || 2.5) * 1000;
    const timer = setTimeout(() => {
      setVideoReady(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [cmsData.hero.videoDelaySeconds]);

  const toggleSound = () => {
    if (!iframeRef.current?.contentWindow) return;
    const command = isMuted
      ? '{"event":"command","func":"unMute","args":""}'
      : '{"event":"command","func":"mute","args":""}';
    iframeRef.current.contentWindow.postMessage(command, "*");
    setIsMuted(!isMuted);
  };

  async function handleWaitlist(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      await joinWaitlist({ data: { email: email.trim() } });
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div
      className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#A11C28] selection:text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── GLOBAL SIDEBAR & MOBILE NAVIGATION (NO TOP NAVBAR) ───────── */}
      <GlobalSidebar />

      {/* ── MAIN CONTENT CONTAINER (PADDED FOR COLLAPSED SIDEBAR) ─────── */}
      <div className="pl-0 md:pl-18 lg:pl-20 min-h-screen">
        {/* ── 1. HERO SECTION: YAHWEH THE GOD WHO REVEALS HIS POWER ────────── */}
        <section
          id="hero"
          className="relative w-full overflow-hidden bg-black flex flex-col justify-end min-h-[92vh] lg:min-h-screen pt-20 pb-28 md:pb-36 lg:pb-40 px-6 md:px-12"
        >
          {/* Admin Floating In-Place Edit Button */}
          {isAdmin && (
            <button
              onClick={() => setAdminCmsTab("hero")}
              className="absolute top-6 right-6 z-30 flex items-center gap-2 bg-[#A11C28] hover:bg-[#7F151F] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl shadow-black/80 uppercase tracking-wider transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Hero Showcase
            </button>
          )}

          {/* Hero Media: Still Image (shows immediately) + YouTube Video (fades in after 2.5s) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Still hero image — always present, fades out as video loads */}
            <img
              src={cmsData.hero.heroImage}
              alt={cmsData.hero.title}
              className={`absolute inset-0 w-full h-full object-cover object-[70%_center] md:object-[65%_center] lg:object-center select-none transition-opacity duration-1000 ${videoReady ? "opacity-0" : "opacity-100"}`}
              loading="eager"
              decoding="async"
            />

            {/* YouTube background video — starts 1 min in (&start=60), fades in after delay */}
            <div
              className={`absolute inset-0 transition-opacity duration-1500 ${videoReady ? "opacity-100" : "opacity-0"}`}
            >
              <iframe
                ref={iframeRef}
                src={cmsData.hero.videoUrl}
                allow="autoplay; fullscreen"
                allowFullScreen
                className="absolute w-[177.78%] h-[177.78%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ border: "none" }}
                title="Visual Bible Hero Video"
              />
            </div>

            {/* Directional Gradient: Darker on left behind text, transparent on right for image/video clarity */}
            <div
              className="absolute inset-0 z-10"
              style={{
                background: `
                  linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.65) 30%, rgba(0,0,0,0.15) 55%, transparent 70%),
                  linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 60%, rgba(0,0,0,0.85) 85%, #000000 100%)
                `,
              }}
            />
          </div>

          {/* Hero Metadata & Show Info (Refined, 25% smaller, premium OTT placement) */}
          <div className="relative z-10 max-w-lg md:max-w-xl">
            {/* Brand Pill */}
            <div className="flex items-center gap-2 mb-2.5">
              <img
                src="/assets/nrim-logo-white.png"
                alt="NRIM"
                className="h-4 w-auto object-contain"
              />
              <span className="text-[10px] font-bold tracking-[0.25em] text-white/90 uppercase">
                VISUAL BIBLE TV · UPCOMING PREMIERE
              </span>
            </div>

            {/* Tagline */}
            <div className="text-[11px] font-semibold tracking-[0.2em] text-[#C4A468] uppercase mb-1">
              {cmsData.hero.tagline}
            </div>

            {/* Title */}
            <h1
              className="font-black tracking-tight text-white leading-[1.08] mb-2"
              style={{ fontSize: "clamp(32px, 5vw, 60px)" }}
            >
              {cmsData.hero.title}
            </h1>

            {/* Subtitle */}
            <p className="text-white/85 text-xs md:text-sm font-semibold tracking-wider uppercase mb-3">
              {cmsData.hero.subtitle}
            </p>

            {/* Badges */}
            <div className="flex items-center gap-2 text-xs text-white/80 mb-3.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                In Production 2026
              </span>
              <span className="text-white/50 text-[11px]">Season 2</span>
              <span className="border border-white/30 px-1.5 py-0.5 text-[9px] font-semibold text-white/80 rounded-[2px] leading-none">
                ALL AGES
              </span>
              <span className="text-white/50 text-[11px]">Target: 100 Languages</span>
              <span className="border border-white/30 px-1.5 py-0.5 text-[9px] font-bold text-white/90 rounded-[2px] leading-none tracking-wider">
                VISION
              </span>
              <span className="border border-white/30 px-1.5 py-0.5 text-[9px] font-bold text-white/90 rounded-[2px] leading-none tracking-wider">
                5.1 AUDIO
              </span>
              <span className="border border-white/30 px-1.5 py-0.5 text-[9px] font-bold text-white/90 rounded-[2px] leading-none tracking-wider">
                4K HDR
              </span>
            </div>

            {/* Synopsis */}
            <p className="text-white/75 text-xs md:text-[13px] leading-relaxed mb-5 max-w-md line-clamp-3">
              {cmsData.hero.synopsis}
            </p>

            {/* Action Buttons & Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="#waitlist"
                className="flex items-center gap-2.5 bg-[#A11C28] hover:bg-[#7F151F] text-white text-sm font-bold px-6 py-2.5 rounded transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-red-950/50 uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" />
                Join The Premiere Waitlist
              </a>
              <Link
                to="/watch"
                search={{ episode: "genesis" }}
                className="flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-sm font-semibold px-5 py-2.5 rounded hover:bg-white/25 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Watch Genesis First
              </Link>
              {/* Sound toggle — only visible after video loads */}
              {videoReady && (
                <button
                  onClick={toggleSound}
                  className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/20 text-white/80 hover:text-white text-xs font-semibold px-3 py-2.5 rounded transition-colors"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                  {isMuted ? "Unmute" : "Mute"}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── 2. CAROUSEL: EXISTING PROJECTS (GENESIS, JOSEPH, & LANGUAGES) ── */}
        <section
          id="vault"
          className="-mt-20 md:-mt-28 lg:-mt-36 relative z-20 px-6 md:px-12 pt-8 pb-12 bg-gradient-to-t from-[#09090d] via-[#09090d]/95 to-transparent border-t border-white/[0.08]"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#A11C28] rounded-sm" />
              <h2 className="text-base md:text-lg font-bold text-white tracking-wide">
                Existing Productions · The Genesis Vault & Languages
              </h2>
              {isAdmin && (
                <button
                  onClick={() => setAdminCmsTab("vault")}
                  className="ml-2 flex items-center gap-1.5 bg-[#A11C28]/25 hover:bg-[#A11C28] text-white border border-[#A11C28]/40 text-[11px] font-bold px-2.5 py-0.5 rounded transition-colors"
                >
                  <Edit3 className="w-3 h-3" /> Edit Posters
                </button>
              )}
            </div>
            <Link
              to="/watch"
              className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors"
            >
              View all releases <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Vertical Poster Carousel */}
          <div
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
          >
            {cmsData.vaultProductions.map((card) => (
              <Link
                key={card.id}
                to="/watch"
                search={{ episode: card.episode }}
                className="relative shrink-0 group cursor-pointer transition-transform duration-300 hover:scale-105"
                style={{ width: "clamp(155px, 16vw, 215px)" }}
              >
                <div
                  className="w-full overflow-hidden rounded bg-[#141419] border border-white/[0.08] relative shadow-lg"
                  style={{ aspectRatio: "2/3" }}
                >
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover" />

                  {/* Corner Brand Badge */}
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-sm bg-black/80 backdrop-blur-md border border-white/20 flex items-center gap-1 shadow">
                    <img
                      src="/assets/nrim-logo-white.png"
                      alt="NRIM"
                      className="h-3 w-auto object-contain"
                    />
                    <span className="text-[8px] font-black tracking-widest text-white uppercase">
                      TV
                    </span>
                  </div>

                  {/* Bottom Banner */}
                  <div className="absolute bottom-0 left-0 right-0 bg-[#A11C28] text-white text-center py-1 font-bold text-[10px] tracking-wider uppercase shadow-md truncate px-1">
                    {card.badge}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-3 text-center">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow">
                      <Play className="w-4 h-4 fill-black text-black ml-0.5" />
                    </div>
                    <span className="text-xs font-bold text-white leading-tight">Watch Stream</span>
                    <span className="text-[10px] text-white/70 mt-1 line-clamp-2">
                      {card.subtitle}
                    </span>
                  </div>
                </div>

                <p className="mt-1.5 text-xs font-semibold text-white/90 truncate">{card.title}</p>
                <p className="text-[10px] text-white/50 truncate">{card.language}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 3. THE VISUAL BIBLE PITCH SECTION (ORIGINKIT 3D TUNNEL) ───── */}
        <section
          id="pitch"
          aria-label="The Visual Bible Pitch"
          className="relative isolate flex min-h-[750px] w-full items-center justify-center overflow-hidden bg-black py-20 px-6 md:px-12 border-t border-white/[0.08]"
        >
          {/* Originkit Three.js 3D Tunnel in Background (Crisp, High-Opacity, Steady Speed) */}
          {mounted && (
            <div aria-hidden="true" className="pointer-events-auto absolute inset-0 z-0 opacity-95">
              <GalleryTunnel
                images={PITCH_TUNNEL_IMAGES}
                background="#000000"
                lineColor="#33333e"
                lineOpacity={25}
                grid={6}
                speed={14}
                boost={32}
                fade={95}
                label={false}
                cellMode="square"
              />
            </div>
          )}

          {/* Frosted Glass Pitch Card: Tunnel is fully visible all around and through the section */}
          <div className="relative z-20 max-w-3xl mx-auto text-center flex flex-col items-center bg-black/50 backdrop-blur-md p-6 md:p-10 rounded-2xl border border-white/10 shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-bold tracking-[0.2em] uppercase mb-4 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#A11C28] animate-pulse" />A Production of
              NRIM
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
              VISUAL BIBLE: Until All Hear: Every Language, Every Nation.
            </h2>

            <p className="text-white/80 text-xs md:text-sm leading-relaxed max-w-xl mx-auto mb-8 font-medium">
              Bringing the Bible to life through an AI production pipeline using real people and
              transforming them into characters from the Bible.
            </p>

            {/* Highlights Bar: 1M+ views, 88 countries, 8 live languages, 100 Target */}
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/[0.1] shadow-xl mb-8">
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-black text-white leading-none mb-1">
                  1M+
                </span>
                <span className="text-xs font-bold text-white/80">Views Worldwide</span>
                <span className="text-[10px] text-white/40 mt-0.5">Streaming Reach</span>
              </div>
              <div className="flex flex-col items-center border-l border-white/10">
                <span className="text-2xl md:text-3xl font-black text-white leading-none mb-1">
                  88
                </span>
                <span className="text-xs font-bold text-white/80">Countries</span>
                <span className="text-[10px] text-white/40 mt-0.5">Global Viewership</span>
              </div>
              <div className="flex flex-col items-center border-l border-white/10">
                <span className="text-2xl md:text-3xl font-black text-white leading-none mb-1">
                  8
                </span>
                <span className="text-xs font-bold text-white/80">Live Languages</span>
                <span className="text-[10px] text-white/40 mt-0.5">Current Broadcast</span>
              </div>
              <div className="flex flex-col items-center border-l border-white/10">
                <span className="text-2xl md:text-3xl font-black text-[#A11C28] leading-none mb-1">
                  100
                </span>
                <span className="text-xs font-bold text-white/90">Target Languages</span>
                <span className="text-[10px] text-white/50 mt-0.5">Production Goal</span>
              </div>
            </div>

            {/* Pitch CTAs */}
            <div className="flex items-center gap-3.5 flex-wrap justify-center">
              <Link
                to="/watch"
                className="flex items-center gap-2 bg-[#A11C28] hover:bg-[#7F151F] text-white text-xs md:text-sm font-bold px-6 py-2.5 rounded-full transition-transform hover:scale-105 shadow-lg shadow-red-950/50 uppercase tracking-wider"
              >
                <Play className="w-4 h-4 fill-white" />
                Watch Live Stream
              </Link>
              <a
                href="#workflow"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs md:text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
              >
                <Cpu className="w-4 h-4" />
                Our Technical Workflow
              </a>
              <a
                href="https://nrim.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
              >
                About NRIM <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* ── 4. TECHNICAL WORKFLOW: HORIZONTAL 35MM FILM STRIP ───────── */}
        <section
          id="workflow"
          className="py-20 px-6 md:px-12 bg-[#08080c] border-t border-white/[0.08] relative overflow-hidden"
        >
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-10 text-left">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-[#A11C28] animate-pulse" />
                <span className="text-[11px] font-bold tracking-[0.25em] text-white/60 uppercase">
                  Production Methodology · 35mm Film Archive
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.08] tracking-tight mb-3">
                The Message is the Same.
                <br />
                <span className="text-white/40">The Medium is Different.</span>
              </h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-2xl">
                How we combine real human emotion with state-of-the-art AI to create an
                authoritative, cinematic biblical catalog. Hover over any stage below to inspect our
                production process.
              </p>
            </div>

            {/* ── CONTINUOUS 35MM HORIZONTAL FILM STRIP CHASSIS ── */}
            <div className="rounded-2xl overflow-hidden border border-white/20 bg-[#07070b] shadow-2xl mb-8">
              {/* Top Film Sprocket Row: High-Contrast Cinema Celluloid */}
              <div className="bg-[#050508] border-b border-white/10 px-4 py-2.5 flex items-center justify-between overflow-hidden select-none relative">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <div className="flex items-center gap-3 w-full justify-between">
                  {Array.from({ length: 26 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-1.5 shrink-0">
                      <div className="w-4 h-2.5 rounded-[2px] bg-black border border-white/50 shadow-[inset_0_1px_3px_rgba(255,255,255,0.5),0_0_2px_rgba(0,0,0,0.9)]" />
                      {i % 4 === 0 && (
                        <span className="text-[7px] font-mono text-white/35 font-bold uppercase tracking-wider hidden sm:inline">
                          NRIM 5219
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Film Frames Side-by-Side Grid with Authentic Celluloid Border */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 p-3 md:p-4 bg-[#0a0a0e]">
                {WORKFLOW_STEPS.map((step) => (
                  <div
                    key={step.id}
                    className="group flex flex-col rounded-lg overflow-hidden border border-white/15 bg-black relative shadow-xl hover:border-white/35 transition-colors"
                  >
                    {/* Frame Header Stamp: Cinema Slate Designation */}
                    <div className="px-3.5 py-1.5 bg-[#09090f] flex items-center justify-between text-[10px] font-mono border-b border-white/10 select-none">
                      <span className="font-bold text-white/80 tracking-wide">{step.code}</span>
                      <span className="text-[#A11C28] font-black tracking-wider">
                        {step.frameCode}
                      </span>
                    </div>

                    {/* Frame Photo with smooth hover zoom */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
                      <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded bg-black/85 backdrop-blur-md text-[10px] font-mono font-bold text-white/95 border border-white/15 shadow">
                        {step.stepNumber} // {step.id.toUpperCase()}
                      </div>
                    </div>

                    {/* Frame Footer Stamp: Motion Picture Stock Markings */}
                    <div className="px-3.5 py-1 bg-[#09090f] flex items-center justify-between text-[9px] font-mono text-white/50 border-t border-white/10 select-none">
                      <span className="tracking-wider">24 FPS · RAW EMBODIMENT</span>
                      <span className="font-bold text-white/60">NRIM CINEMA 5219</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Film Sprocket Row: High-Contrast Cinema Celluloid */}
              <div className="bg-[#050508] border-t border-white/10 px-4 py-2.5 flex items-center justify-between overflow-hidden select-none relative">
                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <div className="flex items-center gap-3 w-full justify-between">
                  {Array.from({ length: 26 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-1.5 shrink-0">
                      <div className="w-4 h-2.5 rounded-[2px] bg-black border border-white/50 shadow-[inset_0_1px_3px_rgba(255,255,255,0.5),0_0_2px_rgba(0,0,0,0.9)]" />
                      {i % 4 === 2 && (
                        <span className="text-[7px] font-mono text-white/35 font-bold uppercase tracking-wider hidden sm:inline">
                          SAFETY FILM
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── 3 HORIZONTAL COLUMNS WITH SMOOTH HOVER EXPANSION ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {WORKFLOW_STEPS.map((step) => (
                <div
                  key={step.id}
                  className="group/col p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#A11C28]/40 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-baseline gap-2.5 mb-2">
                      <span className="text-base font-mono font-black text-[#A11C28]">
                        {step.stepNumber}
                      </span>
                      <h3 className="text-base md:text-lg font-bold text-white group-hover/col:text-[#ff4d5e] transition-colors leading-snug">
                        {step.title}
                      </h3>
                    </div>

                    {/* Short Description (Always Visible) */}
                    <p className="text-xs md:text-sm text-white/70 leading-relaxed font-sans font-medium mb-2">
                      {step.shortDesc}
                    </p>

                    {/* Extended Description (Smooth Pure CSS Expand on Hover) */}
                    <div className="overflow-hidden transition-all duration-300 ease-out max-h-0 opacity-0 group-hover/col:max-h-72 group-hover/col:opacity-100 group-hover/col:pt-3 group-hover/col:border-t group-hover/col:border-white/10">
                      <p className="text-xs text-white/55 leading-relaxed font-sans">
                        {step.extendedDesc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 text-[10px] font-mono text-white/35 flex items-center gap-1 group-hover/col:text-[#A11C28] transition-colors">
                    <span>Hover to reveal process details</span>
                    <span className="group-hover/col:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. THE INFINITE SCRIPTURE ARCHIVE (ORIGINKIT INFINITE GRID) ────── */}
        <section
          id="archive"
          className="py-24 px-6 md:px-12 bg-black border-t border-white/[0.08] relative overflow-hidden"
        >
          <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-4 bg-[#A11C28] rounded-sm" />
                <span className="text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
                  The Living Universe · Infinite Canvas
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-2">
                Explore the Universe of the Visual Bible
              </h2>
              <p className="text-white/65 text-xs md:text-sm max-w-xl">
                An unbounded canvas of scripture. Drag in any direction to explore completed Genesis
                chapters, patriarch character studies, and upcoming releases across all languages.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {isAdmin && (
                <button
                  onClick={() => setAdminCmsTab("archive")}
                  className="flex items-center gap-1.5 bg-[#A11C28]/25 hover:bg-[#A11C28] text-white border border-[#A11C28]/40 text-xs font-bold px-3 py-2 rounded transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Archive Posters
                </button>
              )}
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-white/50 bg-white/[0.04] border border-white/[0.08] px-3.5 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Drag canvas in any direction · Click poster to open</span>
              </div>
              <Link
                to="/watch"
                className="flex items-center gap-2 bg-[#A11C28] hover:bg-[#7F151F] text-white text-xs font-bold px-4 py-2 rounded transition-colors uppercase tracking-wider"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Watch Full Catalog
              </Link>
            </div>
          </div>

          {/* Infinite Canvas Frame */}
          <div className="relative w-full h-[620px] md:h-[680px] rounded-2xl overflow-hidden border border-white/[0.1] bg-[#070709] shadow-2xl select-none">
            {mounted && (
              <InfiniteGrid
                items={
                  (cmsData.archiveItems && cmsData.archiveItems.length
                    ? cmsData.archiveItems
                    : INFINITE_ARCHIVE_ITEMS) as unknown as GridItem[]
                }
                columns={5}
                cardWidth={200}
                radius={8}
                gap={28}
                background="#070709"
                textColor="#ffffff"
                mutedColor="#888894"
                aspectRatio="2 / 3"
                blobs={false}
                onItemClick={(item) => {
                  const archiveItem = item as unknown as ArchiveGridItem;
                  if (archiveItem.linkUrl) {
                    if (
                      archiveItem.linkUrl.startsWith("http://") ||
                      archiveItem.linkUrl.startsWith("https://")
                    ) {
                      window.open(archiveItem.linkUrl, "_blank", "noopener,noreferrer");
                    } else {
                      navigate({ to: archiveItem.linkUrl });
                    }
                  } else {
                    const ep = archiveItem.episode || "genesis";
                    navigate({ to: "/watch", search: { episode: ep } });
                  }
                }}
                style={{ width: "100%", height: "100%" }}
              />
            )}

            {/* Edge Vignette Overlays for seamless blending */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#070709] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#070709] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#070709] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#070709] to-transparent z-10" />

            {/* Bottom Floating Pill */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-2 bg-black/80 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full text-[11px] text-white/70 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A11C28]" />
              <span>16 Productions & Regional Editions Loaded · Click any poster to watch</span>
            </div>
          </div>
        </section>

        {/* ── 6. UPCOMING PROJECTS & PRODUCTIONS (ORIGINKIT ACCORDION-OS) ── */}
        <section
          id="upcoming-projects"
          className="py-24 px-6 md:px-12 bg-black border-t border-white/[0.08] relative overflow-hidden"
        >
          <div className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-4 bg-[#A11C28] rounded-sm" />
                <span className="text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
                  Production Slate · What's Ahead
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-2">
                Upcoming Projects
              </h2>
              <p className="text-white/65 text-xs md:text-sm max-w-xl">
                The expanding cinematic universe of the Visual Bible. From the epic release of
                YAHWEH to the complete Genesis broadcast series, episodic television, and character
                chronicles.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {isAdmin && (
                <button
                  onClick={() => setAdminCmsTab("projects")}
                  className="flex items-center gap-1.5 bg-[#A11C28]/25 hover:bg-[#A11C28] text-white border border-[#A11C28]/40 text-xs font-bold px-3 py-2 rounded transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Slate
                </button>
              )}
              <a
                href="#waitlist"
                className="flex items-center gap-2 bg-[#A11C28] hover:bg-[#7F151F] text-white text-xs font-bold px-5 py-2.5 rounded transition-colors uppercase tracking-wider shadow-lg shadow-red-950/40"
              >
                <Plus className="w-4 h-4" />
                Join Premiere Waitlist
              </a>
            </div>
          </div>

          {/* Originkit AccordionOS Interactive Canvas Frame */}
          <div className="relative w-full h-[520px] md:h-[580px] rounded-2xl overflow-hidden border border-white/[0.1] bg-[#09090d] shadow-2xl">
            {mounted && (
              <AccordionOS
                items={cmsData.upcomingProjects}
                defaultOpen={1}
                autoplay={true}
                interval={4.5}
                pauseOnHover={true}
                radius={16}
                scale={100}
                background="#09090d"
                font={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.01em" }}
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </div>
        </section>

        {/* ── 6. GLOBAL LANGUAGES REACHED (ORIGINKIT 3D GLOBE) ─────────── */}
        <section
          id="languages"
          className="py-20 px-6 md:px-12 bg-gradient-to-b from-black via-[#08080c] to-black border-t border-white/[0.08]"
        >
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#A11C28]/20 border border-[#A11C28]/40 text-[#A11C28] text-[11px] font-bold tracking-widest uppercase mb-3">
                Global Network · 88 Nations
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3">
                Languages Reached Across the Earth
              </h2>
              <p className="text-white/65 text-sm md:text-base leading-relaxed">
                Scripture released and streaming in 8 major native languages across Asia, the Middle
                East, the Pacific, and the Americas — advancing toward our goal of 100 languages.
              </p>
            </div>

            {/* Split Grid: 3D Globe on Left, Language List on Right */}
            <div className="grid lg:grid-cols-12 gap-8 items-center bg-[#0d0d12] border border-white/[0.08] rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden">
              {/* Left Column: Originkit Interactive 3D Globe */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[420px] md:min-h-[480px] w-full overflow-hidden rounded-xl bg-black/60 border border-white/[0.06]">
                {mounted ? (
                  <Globe
                    style={{ width: "100%", height: "100%", minHeight: "440px" }}
                    direction="right"
                    speed={1.6}
                    scale={9}
                    stopOnHover={true}
                    fill="solid"
                    fillColor="#2a2a32"
                    oceanColor="#000000"
                    showOutline={true}
                    outlineColor="#666675"
                    showGrid={true}
                    graticuleColor="#1c1c24"
                    markerConfig={{
                      markers: GLOBE_MARKERS,
                      color: "#A11C28",
                      size: 40,
                    }}
                    initialLatitude={20}
                    initialLongitude={55}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">
                    Loading Global Network...
                  </div>
                )}

                {/* Globe Caption / Control Tip */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/40 pointer-events-none px-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#A11C28] animate-pulse" />
                    Glowing Red Nodes = Active Regional Productions
                  </span>
                  <span className="hidden sm:inline">Drag to rotate globe</span>
                </div>
              </div>

              {/* Right Column: Cards of Languages & Regions */}
              <div className="lg:col-span-5 flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1 scrollbar-none">
                {REACHED_LANGUAGES.map((lang) => (
                  <div
                    key={lang.id}
                    className="p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white group-hover:text-[#A11C28] transition-colors truncate">
                          {lang.name}
                        </span>
                        <span className="text-xs text-white/40 font-normal">
                          ({lang.nativeName})
                        </span>
                      </div>
                      <span className="text-[11px] text-white/50 truncate mt-0.5">
                        {lang.regions}
                      </span>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase ${
                          lang.isUpcoming
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {lang.badge}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Target to reach 100 Languages Card */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#A11C28]/20 via-[#A11C28]/10 to-transparent border border-[#A11C28]/40 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black text-white uppercase tracking-wider">
                      Target: Reaching 100 Languages
                    </div>
                    <div className="text-[11px] text-white/70 mt-0.5">
                      Expanding across Africa, Latin America, Southeast Asia, and indigenous
                      dialects.
                    </div>
                  </div>
                  <Link
                    to="/watch"
                    className="shrink-0 text-xs font-bold bg-white text-black px-3 py-1.5 rounded hover:bg-white/90 transition-colors uppercase tracking-wider"
                  >
                    Watch All
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. WAITLIST FUNNEL (STREAMING CATALOG MOSAIC SHOWCASE) ── */}
        <section
          id="waitlist"
          className="relative min-h-[640px] md:min-h-[720px] py-24 px-6 md:px-12 overflow-hidden border-t border-white/[0.1] flex items-center justify-center bg-black"
        >
          {/* Background Catalog Mosaic - User's Uploaded Streaming Catalog Grid (Image 3) */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="/assets/waitlist-catalog-mosaic.jpg"
              alt="Visual Bible Global Streaming Catalog Mosaic"
              className="w-full h-full object-cover object-center select-none opacity-85 scale-100"
              loading="lazy"
            />
            {/* Subtle Vignette Gradient: keeps catalog bright & clear, softly darkens edges for seamless page flow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  linear-gradient(180deg, #000000 0%, rgba(0,0,0,0.15) 15%, rgba(0,0,0,0.15) 85%, #000000 100%),
                  radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.55) 100%)
                `,
              }}
            />
          </div>

          {/* Centered Frosted Glass Waitlist Card */}
          <div className="relative z-10 max-w-xl w-full mx-auto bg-black/85 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl shadow-black text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A11C28]/25 border border-[#A11C28]/50 text-white text-[11px] font-bold tracking-widest uppercase mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#A11C28] animate-pulse" />
              Be First to Watch
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
              Join the Exclusive Premiere Waitlist
            </h2>
            <p className="text-white/80 text-sm leading-relaxed mb-8 max-w-md mx-auto">
              Get direct premiere links, behind-the-scenes production footage, and screening dates
              before anyone else.
            </p>

            {status === "success" ? (
              <div className="flex items-center justify-center gap-2 bg-[#141419]/90 backdrop-blur-md border border-emerald-500/40 rounded-lg p-5 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="text-sm font-semibold">
                  You're on the premiere list! We'll notify you as soon as YAHWEH drops.
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleWaitlist}
                className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={status === "loading"}
                  aria-label="Email for waitlist"
                  className="flex-1 bg-black/80 backdrop-blur-md border border-white/20 text-white text-sm placeholder:text-white/40 px-4 py-3 rounded focus:outline-none focus:border-[#A11C28] transition-colors shadow-inner"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-[#A11C28] hover:bg-[#7F151F] text-white text-sm font-bold px-6 py-3 rounded transition-colors uppercase tracking-wider disabled:opacity-50 whitespace-nowrap shadow-lg shadow-red-950/50"
                >
                  {status === "loading" ? "Joining…" : "Get Early Access"}
                </button>
              </form>
            )}

            {status === "error" && (
              <p className="mt-3 text-sm text-red-400 flex items-center justify-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                {errorMsg}
              </p>
            )}
          </div>
        </section>

        {/* ── 8. FOOTER ────────────────────────────────────────────────── */}
        <SiteFooter />
      </div>

      {/* Admin CMS In-Place Modal */}
      {adminCmsTab && (
        <AdminCmsModal
          isOpen={adminCmsTab !== null}
          onClose={() => setAdminCmsTab(null)}
          defaultTab={adminCmsTab}
        />
      )}
    </div>
  );
}
