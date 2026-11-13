import { useState, useEffect, useRef, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
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
} from "lucide-react";
import { RegionalSelector } from "@/components/site-header";
import { useGlobalLanguage } from "@/lib/language";
import { joinWaitlist } from "@/lib/waitlist.functions";
import GalleryTunnel from "@/components/originkit/ui/hero-13/gallery-tunnel";
import Globe from "@/components/originkit/ui/globe-custom-style";

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
  const [language, setLanguage] = useGlobalLanguage();
  const [activeNav, setActiveNav] = useState("home");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#E50914] selection:text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── EXPANDING SIDE NAVIGATION BAR (NETFLIX OTT TV STYLE) ──────── */}
      <aside
        aria-label="Sidebar Navigation"
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
        className={`hidden md:flex fixed left-0 top-0 bottom-0 bg-black/95 backdrop-blur-2xl border-r border-white/[0.1] flex-col justify-between py-6 z-50 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          sidebarExpanded
            ? "w-64 shadow-2xl shadow-black/95 px-4"
            : "w-18 lg:w-20 px-2 items-center"
        }`}
      >
        {/* Top: Logo & Toggle */}
        <div className="flex flex-col gap-6 w-full">
          <div className="flex items-center justify-between px-1">
            <a
              href="#hero"
              className="flex items-center gap-3 overflow-hidden group"
              title="Visual Bible TV"
            >
              <div className="w-9 h-9 shrink-0 rounded bg-[#E50914] flex items-center justify-center font-black text-white text-xs tracking-tighter shadow-lg shadow-red-950/60">
                VB
              </div>
              <div
                className={`flex flex-col transition-opacity duration-200 ${
                  sidebarExpanded ? "opacity-100" : "opacity-0 w-0 pointer-events-none"
                }`}
              >
                <span className="text-xs font-black tracking-[0.2em] text-white uppercase whitespace-nowrap">
                  Visual Bible
                </span>
                <span className="text-[9px] font-semibold text-white/50 tracking-widest uppercase">
                  TV Network
                </span>
              </div>
            </a>
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

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1.5 mt-2 w-full" aria-label="Main Menu">
            {[
              { id: "home", label: "Home Showcase", icon: Home, href: "#hero" },
              { id: "vault", label: "Existing Projects", icon: Tv, href: "#vault" },
              { id: "pitch", label: "The Pitch", icon: Compass, href: "#pitch" },
              { id: "workflow", label: "Technical Workflow", icon: Cpu, href: "#workflow" },
              { id: "upcoming", label: "Upcoming (YAHWEH)", icon: Film, href: "#upcoming-yahweh" },
              { id: "languages", label: "Languages Reached", icon: GlobeIcon, href: "#languages" },
              { id: "waitlist", label: "Join Waitlist", icon: Plus, href: "#waitlist" },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveNav(item.id)}
                  className={`relative flex items-center gap-3.5 h-11 rounded-lg px-2.5 transition-all duration-200 group ${
                    isActive
                      ? "bg-white/[0.08] text-white font-semibold"
                      : "text-white/55 hover:text-white hover:bg-white/[0.05]"
                  }`}
                  title={item.label}
                >
                  {/* Left Red Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#E50914] rounded-r" />
                  )}
                  <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
                  <span
                    className={`text-xs whitespace-nowrap transition-all duration-200 ${
                      sidebarExpanded
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-2 w-0 pointer-events-none"
                    }`}
                  >
                    {item.label}
                  </span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Organization Details */}
        <div className="w-full pt-4 border-t border-white/[0.08]">
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

      {/* ── MOBILE BOTTOM NAVIGATION BAR ──────────────────────────────── */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black/95 backdrop-blur-xl border-t border-white/[0.1] z-50 flex items-center justify-around px-2"
      >
        <a
          href="#hero"
          onClick={() => setActiveNav("home")}
          className={`flex flex-col items-center gap-1 ${
            activeNav === "home" ? "text-[#E50914]" : "text-white/60"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </a>
        <a
          href="#vault"
          onClick={() => setActiveNav("vault")}
          className={`flex flex-col items-center gap-1 ${
            activeNav === "vault" ? "text-[#E50914]" : "text-white/60"
          }`}
        >
          <Tv className="w-5 h-5" />
          <span className="text-[10px] font-medium">Projects</span>
        </a>
        <a
          href="#pitch"
          onClick={() => setActiveNav("pitch")}
          className={`flex flex-col items-center gap-1 ${
            activeNav === "pitch" ? "text-[#E50914]" : "text-white/60"
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium">Pitch</span>
        </a>
        <a
          href="#languages"
          onClick={() => setActiveNav("languages")}
          className={`flex flex-col items-center gap-1 ${
            activeNav === "languages" ? "text-[#E50914]" : "text-white/60"
          }`}
        >
          <GlobeIcon className="w-5 h-5" />
          <span className="text-[10px] font-medium">Languages</span>
        </a>
        <a
          href="#waitlist"
          onClick={() => setActiveNav("waitlist")}
          className={`flex flex-col items-center gap-1 ${
            activeNav === "waitlist" ? "text-[#E50914]" : "text-white/60"
          }`}
        >
          <Plus className="w-5 h-5" />
          <span className="text-[10px] font-medium">Waitlist</span>
        </a>
      </nav>

      {/* ── MAIN CONTENT CONTAINER (PADDED FOR COLLAPSED SIDEBAR) ─────── */}
      <div className="pl-0 md:pl-18 lg:pl-20 min-h-screen">
        {/* Floating Top Controls */}
        <header className="absolute top-0 left-0 md:left-18 lg:left-20 right-0 z-40 flex items-center justify-between px-6 md:px-10 py-5 pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/60 tracking-wider uppercase font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
              Nations Reach Network
            </span>
          </div>

          <div className="flex items-center gap-3 pointer-events-auto">
            <RegionalSelector value={language} onValueChange={setLanguage} />
            <a
              href="#waitlist"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#E50914] text-white text-xs font-bold px-4 py-2 rounded shadow-md hover:bg-[#c0070f] transition-colors uppercase tracking-wider"
            >
              Get Early Access
            </a>
          </div>
        </header>

        {/* ── 1. HERO SECTION: AUTOPLAYING GENESIS VIDEO FROM 4:25 (265s) ── */}
        <section
          id="hero"
          className="relative w-full overflow-hidden bg-black flex flex-col justify-between"
          style={{ minHeight: "100svh" }}
        >
          {/* YouTube Video Background (starts at 4:25 = 265s, autoplay, muted) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <iframe
              ref={iframeRef}
              src="https://www.youtube-nocookie.com/embed/z5abtVIszH8?start=265&autoplay=1&mute=1&controls=0&loop=1&playlist=z5abtVIszH8&playsinline=1&rel=0&modestbranding=1&enablejsapi=1"
              title="Visual Bible Background Stream"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160vw] h-[160vh] md:w-[130vw] md:h-[130vh] object-cover pointer-events-none select-none opacity-80"
              allow="autoplay; encrypted-media"
            />
            {/* Cinematic OTT Gradient Overlay: Deep left vignette for contrast + bottom fade */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(90deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.45) 65%, rgba(0,0,0,0.7) 100%),
                  linear-gradient(180deg, rgba(0,0,0,0.75) 0%, transparent 20%, transparent 60%, rgba(0,0,0,0.95) 85%, #000000 100%)
                `,
              }}
            />
          </div>

          {/* Hero Metadata & Show Info */}
          <div className="relative z-10 pt-24 md:pt-32 px-6 md:px-12 max-w-2xl">
            {/* Red Brand Pill */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rounded-sm bg-[#E50914] flex items-center justify-center font-black text-white text-[9px] leading-none">
                VB
              </div>
              <span className="text-[11px] font-bold tracking-[0.25em] text-white/90 uppercase">
                SERIES · VISUAL BIBLE
              </span>
            </div>

            {/* Tagline */}
            <div className="text-xs md:text-sm font-semibold tracking-[0.2em] text-[#A98B5A] uppercase mb-1">
              An NRIM Original Production
            </div>

            {/* Title */}
            <h1
              className="font-black tracking-tight text-white leading-none mb-3"
              style={{ fontSize: "clamp(44px, 6.5vw, 88px)" }}
            >
              IN THE BEGINNING
            </h1>

            {/* Subtitle */}
            <p className="text-white/90 text-sm md:text-base font-medium tracking-wide uppercase mb-4">
              The God Who Fulfills His Promise — The Book of Genesis
            </p>

            {/* Badges */}
            <div className="flex items-center gap-2.5 text-xs text-white/80 mb-4 flex-wrap">
              <span className="text-emerald-400 font-bold">50 Chapters Live</span>
              <span className="text-white/60">Season 1</span>
              <span className="border border-white/40 px-1.5 py-0.5 text-[10px] font-semibold text-white/80 rounded-[2px] leading-none">
                ALL AGES
              </span>
              <span className="text-white/60">8 Languages</span>
              <span className="border border-white/40 px-1.5 py-0.5 text-[9px] font-bold text-white/90 rounded-[2px] leading-none tracking-wider">
                VISION
              </span>
              <span className="border border-white/40 px-1.5 py-0.5 text-[9px] font-bold text-white/90 rounded-[2px] leading-none tracking-wider">
                5.1 AUDIO
              </span>
              <span className="border border-white/40 px-1.5 py-0.5 text-[9px] font-bold text-white/90 rounded-[2px] leading-none tracking-wider">
                4K HDR
              </span>
            </div>

            {/* Synopsis */}
            <p className="text-white/75 text-sm md:text-base leading-relaxed mb-6 max-w-xl">
              From Creation and the fall of man to Abraham's covenant, Jacob's wrestling, and
              Joseph's rise in Egypt. Experience the complete 50 chapters of Genesis brought to
              life through cinematic AI and real-actor performances.
            </p>

            {/* Action Buttons & Unmute Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                to="/watch"
                search={{ episode: "genesis" }}
                className="flex items-center gap-2.5 bg-white text-black text-sm font-bold px-6 py-2.5 rounded hover:bg-white/90 transition-all duration-200 hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-black" />
                Watch Genesis 1
              </Link>
              <a
                href="#vault"
                className="flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-sm font-semibold px-5 py-2.5 rounded hover:bg-white/25 transition-colors"
              >
                Explore Projects
              </a>
              <button
                type="button"
                onClick={toggleSound}
                className="flex items-center gap-2 border border-white/30 text-white/90 text-xs font-semibold px-3.5 py-2.5 rounded hover:bg-white/10 transition-colors"
                title={isMuted ? "Unmute Broadcast Audio" : "Mute Broadcast Audio"}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-white/60" />
                    <span>Unmute Broadcast</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>Mute Audio</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── 2. CAROUSEL: EXISTING PROJECTS (GENESIS, JOSEPH, & LANGUAGES) ── */}
          <div id="vault" className="relative z-10 px-6 md:px-12 pt-10 pb-8 mt-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#E50914] rounded-sm" />
                <h2 className="text-base md:text-lg font-bold text-white tracking-wide">
                  Existing Productions · The Genesis Vault & Languages
                </h2>
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
              {EXISTING_PRODUCTIONS.map((card) => (
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
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Corner Brand Badge */}
                    <div className="absolute top-2 left-2 w-5 h-5 rounded-sm bg-[#E50914] flex items-center justify-center font-black text-white text-[10px] shadow">
                      VB
                    </div>

                    {/* Bottom Banner */}
                    <div className="absolute bottom-0 left-0 right-0 bg-[#E50914] text-white text-center py-1 font-bold text-[10px] tracking-wider uppercase shadow-md truncate px-1">
                      {card.badge}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-3 text-center">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow">
                        <Play className="w-4 h-4 fill-black text-black ml-0.5" />
                      </div>
                      <span className="text-xs font-bold text-white leading-tight">
                        Watch Stream
                      </span>
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
          </div>
        </section>

        {/* ── 3. THE VISUAL BIBLE PITCH SECTION (ORIGINKIT 3D TUNNEL) ───── */}
        <section
          id="pitch"
          aria-label="The Visual Bible Pitch"
          className="relative isolate flex min-h-[750px] w-full items-center justify-center overflow-hidden bg-black py-20 px-6 md:px-12 border-t border-white/[0.08]"
        >
          {/* Originkit Three.js 3D Tunnel in Background */}
          {mounted && (
            <div aria-hidden="true" className="pointer-events-auto absolute inset-0 z-0 opacity-60">
              <GalleryTunnel
                images={PITCH_TUNNEL_IMAGES}
                background="#000000"
                lineColor="#222222"
                lineOpacity={20}
                grid={6}
                speed={40}
                boost={80}
                fade={90}
                label={false}
                cellMode="square"
              />
            </div>
          )}

          {/* Radial wash for contrast */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-[80vh] w-[90vw] md:w-[65vw] -translate-x-1/2 -translate-y-1/2 blur-[40px] bg-black/85"
          />

          {/* Pitch Content Overlay */}
          <div className="relative z-20 max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-bold tracking-[0.2em] uppercase mb-5 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
              The Pitch · Visual Bible Network
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight mb-5">
              Scripture Brought to Life for Every Nation.
            </h2>

            <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-10">
              The message remains eternal and unchanging. The medium has evolved. By pairing real
              dramatic actor performances with high-fidelity cinematic AI pipelines, NRIM is
              building the world's first complete, visual translation of the Bible — designed to
              cross language barriers, cultural borders, and technological divides.
            </p>

            {/* Highlights Bar: 1M+ views, 88 countries, 8 live languages, 100 Target */}
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/[0.12] shadow-2xl mb-10">
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-black text-white leading-none mb-1">
                  1M+
                </span>
                <span className="text-xs font-bold text-white/80">Views Worldwide</span>
                <span className="text-[10px] text-white/40 mt-0.5">Streaming Reach</span>
              </div>
              <div className="flex flex-col items-center border-l border-white/10">
                <span className="text-3xl md:text-4xl font-black text-white leading-none mb-1">
                  88
                </span>
                <span className="text-xs font-bold text-white/80">Countries</span>
                <span className="text-[10px] text-white/40 mt-0.5">Nations Watching</span>
              </div>
              <div className="flex flex-col items-center border-l border-white/10">
                <span className="text-3xl md:text-4xl font-black text-white leading-none mb-1">
                  8
                </span>
                <span className="text-xs font-bold text-white/80">Live Languages</span>
                <span className="text-[10px] text-white/40 mt-0.5">Genesis Released</span>
              </div>
              <div className="flex flex-col items-center border-l border-white/10">
                <span className="text-3xl md:text-4xl font-black text-[#E50914] leading-none mb-1">
                  100
                </span>
                <span className="text-xs font-bold text-white/90">Target Goal</span>
                <span className="text-[10px] text-white/50 mt-0.5">Global Vision</span>
              </div>
            </div>

            {/* Pitch CTAs */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <Link
                to="/watch"
                className="flex items-center gap-2 bg-[#E50914] hover:bg-[#c0070f] text-white text-xs md:text-sm font-bold px-6 py-3 rounded-full transition-transform hover:scale-105 shadow-lg shadow-red-950/50 uppercase tracking-wider"
              >
                <Play className="w-4 h-4 fill-white" />
                Watch Live Stream
              </Link>
              <a
                href="#workflow"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs md:text-sm font-semibold px-6 py-3 rounded-full transition-colors"
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

        {/* ── 4. TECHNICAL WORKFLOW & METHOD SECTION ────────────────────── */}
        <section
          id="workflow"
          className="py-20 px-6 md:px-12 bg-[#050505] border-t border-white/[0.08]"
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-4 bg-[#E50914] rounded-sm" />
                  <span className="text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
                    Our Production Method
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">
                  The Message is the Same.
                  <br />
                  <span className="text-white/40">The Medium is Different.</span>
                </h2>
                <p className="text-white/70 text-sm max-w-xl">
                  How we combine real human emotion with state-of-the-art AI to create an
                  authoritative, cinematic biblical catalog.
                </p>
              </div>

              <a
                href="https://www.youtube.com/watch?v=3DULIG3sDS8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white text-black text-xs font-bold px-5 py-3 rounded hover:bg-white/90 transition-colors uppercase tracking-wider shrink-0"
              >
                <Play className="w-4 h-4 fill-black" />
                Watch Workflow Video
              </a>
            </div>

            {/* 3 Pillars of the Technical Pipeline */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-[#101014] border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center text-[#E50914] font-black text-sm mb-4">
                    01
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Real Human Performances</h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    AI alone lacks heart. We direct real actors on camera to capture genuine tears,
                    grief, joy, and spiritual weight that algorithmically generated faces cannot
                    fabricate.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                  Raw Performance Capture
                </div>
              </div>

              <div className="bg-[#101014] border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-sm mb-4">
                    02
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    Generative World-Building
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Our proprietary neural workflows reconstruct ancient Egypt, the Red Sea, and
                    Sinai with museum-grade historical fidelity, lighting, and cinematic scale.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                  Neural VFX & Lighting
                </div>
              </div>

              <div className="bg-[#101014] border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#A98B5A]/20 border border-[#A98B5A]/40 flex items-center justify-center text-[#A98B5A] font-black text-sm mb-4">
                    03
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    100-Language Localization
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Neural voice dubbing and AI-driven lip synchronization allow actors to speak
                    fluently in Hindi, Tamil, Malayalam, Chinese, Persian, and dozens of regional
                    dialects.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                  Multilingual Lip-Sync
                </div>
              </div>
            </div>

            {/* Video Showcase Card */}
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] bg-black aspect-video max-w-4xl mx-auto shadow-2xl">
              <iframe
                src="https://www.youtube-nocookie.com/embed/3DULIG3sDS8?rel=0&modestbranding=1"
                title="Visual Bible AI Technical Workflow"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* ── 5. UPCOMING PREMIERE FEATURE: YAHWEH (EXODUS) ─────────────── */}
        <section
          id="upcoming-yahweh"
          className="py-20 px-6 md:px-12 bg-black border-t border-white/[0.08]"
        >
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E50914]/20 border border-[#E50914]/40 text-[#E50914] text-[11px] font-bold tracking-widest uppercase mb-4">
                  NOW IN PRODUCTION · COMING 2026
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3">
                  YAHWEH
                </h2>
                <h3 className="text-sm font-semibold tracking-widest text-white/80 uppercase mb-4">
                  The God Who Reveals His Power — The Book of Exodus
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  Following the monumental completion of Genesis, the visual saga advances to
                  Exodus. Witness the ten plagues, the roar of the parting waters, the pillar of
                  fire, and the giving of the law atop Mount Sinai.
                </p>
                <div className="flex items-center gap-4">
                  <a
                    href="#waitlist"
                    className="flex items-center gap-2 bg-[#E50914] text-white text-xs font-bold px-6 py-3 rounded uppercase tracking-wider hover:bg-[#c0070f] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Join The Waitlist
                  </a>
                  <Link
                    to="/watch"
                    className="text-xs font-semibold text-white/60 hover:text-white transition-colors"
                  >
                    Watch Genesis First →
                  </Link>
                </div>
              </div>

              {/* YAHWEH Poster Showcase */}
              <div className="relative group overflow-hidden rounded-xl border border-white/[0.1] shadow-2xl">
                <img
                  src="/assets/yahweh-tablets-poster.jpg"
                  alt="YAHWEH The Book of Exodus"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[10px] font-bold tracking-widest text-[#E50914] uppercase">
                    In Theatres & Streaming Worldwide
                  </span>
                  <div className="text-lg font-black text-white">YAHWEH · The Book of Exodus</div>
                </div>
              </div>
            </div>
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E50914]/20 border border-[#E50914]/40 text-[#E50914] text-[11px] font-bold tracking-widest uppercase mb-3">
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
                      color: "#E50914",
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
                    <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
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
                        <span className="text-base font-bold text-white group-hover:text-[#E50914] transition-colors truncate">
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
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#E50914]/20 via-[#E50914]/10 to-transparent border border-[#E50914]/40 flex items-center justify-between gap-3">
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

        {/* ── 7. WAITLIST FUNNEL ───────────────────────────────────────── */}
        <section
          id="languages"
          className="py-20 px-6 md:px-12 bg-gradient-to-b from-black via-[#08080c] to-black border-t border-white/[0.08]"
        >
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E50914]/20 border border-[#E50914]/40 text-[#E50914] text-[11px] font-bold tracking-widest uppercase mb-3">
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
                      color: "#E50914",
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
                    <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
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
                        <span className="text-base font-bold text-white group-hover:text-[#E50914] transition-colors truncate">
                          {lang.name}
                        </span>
                        <span className="text-xs text-white/40 font-normal">({lang.nativeName})</span>
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
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#E50914]/20 via-[#E50914]/10 to-transparent border border-[#E50914]/40 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black text-white uppercase tracking-wider">
                      Target: Reaching 100 Languages
                    </div>
                    <div className="text-[11px] text-white/70 mt-0.5">
                      Expanding across Africa, Latin America, Southeast Asia, and indigenous dialects.
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

        {/* ── 7. WAITLIST FUNNEL ───────────────────────────────────────── */}
        <section
          id="waitlist"
          className="py-20 px-6 md:px-12 bg-gradient-to-b from-black via-[#080808] to-black border-t border-white/[0.08] text-center"
        >
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E50914]/20 border border-[#E50914]/40 text-[#E50914] text-[11px] font-bold tracking-widest uppercase mb-4">
              Be First to Watch
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
              Join the Exclusive Premiere Waitlist
            </h2>
            <p className="text-white/65 text-sm leading-relaxed mb-8 max-w-md mx-auto">
              Get direct premiere links, behind-the-scenes production footage, and screening dates
              before anyone else.
            </p>

            {status === "success" ? (
              <div className="flex items-center justify-center gap-2 bg-[#141419] border border-emerald-500/40 rounded-lg p-5 text-emerald-400">
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
                  className="flex-1 bg-[#141419] border border-white/20 text-white text-sm placeholder:text-white/40 px-4 py-3 rounded focus:outline-none focus:border-[#E50914] transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-[#E50914] hover:bg-[#c0070f] text-white text-sm font-bold px-6 py-3 rounded transition-colors uppercase tracking-wider disabled:opacity-50 whitespace-nowrap"
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
        <footer className="border-t border-white/[0.08] bg-black py-12 px-6 md:px-12 text-xs text-white/40">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-white/70 font-bold uppercase tracking-wider mb-3">Ecosystem</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/watch" className="hover:text-white">
                      Watch Stream
                    </Link>
                  </li>
                  <li>
                    <a href="#hero" className="hover:text-white">
                      Genesis Broadcast
                    </a>
                  </li>
                  <li>
                    <a href="#vault" className="hover:text-white">
                      All Existing Projects
                    </a>
                  </li>
                  <li>
                    <a href="#languages" className="hover:text-white">
                      Languages & Globe
                    </a>
                  </li>
                  <li>
                    <a href="#upcoming-yahweh" className="hover:text-white">
                      YAHWEH (Exodus)
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white/70 font-bold uppercase tracking-wider mb-3">Organization</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://nrim.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white"
                    >
                      nrim.org (Parent Org)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://visualbible.nrim.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white"
                    >
                      visualbible.nrim.org
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/@NationsReach"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white"
                    >
                      YouTube Network
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white/70 font-bold uppercase tracking-wider mb-3">
                  Active Languages
                </h4>
                <p className="leading-relaxed">
                  English · Hindi · Tamil · Malayalam · Persian · Tagalog · Chinese · Malay
                </p>
                <p className="text-white/20 mt-2">Target: Reaching 100 Languages</p>
              </div>
              <div>
                <h4 className="text-white/70 font-bold uppercase tracking-wider mb-3">
                  Production House
                </h4>
                <p className="leading-relaxed">
                  A Prossiga Media Film / Nations Reach International Missions production.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-3">
              <p>© {new Date().getFullYear()} Visual Bible TV · Nations Reach International Missions</p>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-sm bg-[#E50914] flex items-center justify-center font-black text-white text-[10px]">
                  VB
                </div>
                <span className="text-white/60 font-semibold tracking-wider uppercase">
                  Visual Bible TV
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
