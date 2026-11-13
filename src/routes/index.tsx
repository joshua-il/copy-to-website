import { useState, useEffect, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Play,
  Plus,
  Star,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Search,
  Home,
  Tv,
  Film,
  LayoutGrid,
  Check,
  Info,
} from "lucide-react";
import { RegionalSelector } from "@/components/site-header";
import { useGlobalLanguage } from "@/lib/language";
import { joinWaitlist } from "@/lib/waitlist.functions";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "YAHWEH · The God Who Reveals His Power — Visual Bible TV" },
      {
        name: "description",
        content:
          "The Visual Bible: Bringing Scripture to life through cinematic AI and real-actor performances. 50 chapters of Genesis complete. Upcoming: YAHWEH — The Book of Exodus.",
      },
      { property: "og:title", content: "YAHWEH · Visual Bible TV" },
      {
        property: "og:description",
        content:
          "Witness the epic continue. After 50 chapters of Genesis across 8 languages — YAHWEH arrives. Join the waitlist for premiere access.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://visualbible.tv" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
} as Parameters<typeof createFileRoute<"/">>[0]);

// ─── Data ────────────────────────────────────────────────────────────────────

const YAHWEH_CARDS = [
  {
    id: "y1",
    title: "YAHWEH · The Tablets",
    image: "/assets/yahweh-tablets-poster.jpg",
    subtitle: "The Law & The Glory",
    badge: "In Production",
  },
  {
    id: "y2",
    title: "The Deliverer",
    image: "/assets/yahweh-exodus-staff-poster.jpg",
    subtitle: "The Book of Exodus",
    badge: "Coming Soon",
  },
  {
    id: "y3",
    title: "The Waters Divide",
    image: "/assets/moses-parting-sea.jpg",
    subtitle: "The Red Sea Miracle",
    badge: "Coming Soon",
  },
  {
    id: "y4",
    title: "YAHWEH · Monument",
    image: "/assets/yahweh-monument.jpg",
    subtitle: "Covenant & Fire",
    badge: "In Theatres",
  },
];

const GENESIS_CARDS = [
  {
    id: "g1",
    title: "In the Beginning · Genesis",
    image: "/assets/genesis-pharaoh-prophet-sunset.jpg",
    label: "S1 E1 · Chapter 1",
    episode: "genesis",
  },
  {
    id: "g2",
    title: "In the Beginning (TV)",
    image: "/assets/in-the-beginning-banner.png",
    label: "26-Episode Series",
    episode: "teaser",
  },
  {
    id: "g3",
    title: "Genesis sa Tagalog",
    image: "/assets/genesis-tagalog-poster.jpg",
    label: "Tagalog Edition",
    episode: "tagalog",
  },
  {
    id: "g4",
    title: "Warriors of Faith",
    image: "/assets/genesis-warriors-fire.jpg",
    label: "Hindi Track",
    episode: "genesis",
  },
  {
    id: "g5",
    title: "Judas, Chosen by God",
    image: "/assets/judas-chosen-by-god-persian.jpg",
    label: "S1 E38 · Persian",
    episode: "judas",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

function LandingPage() {
  const [language, setLanguage] = useGlobalLanguage();
  const [activeNav, setActiveNav] = useState("home");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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
      {/* ── LEFT SIDE NAVIGATION BAR (NETFLIX TV APP STYLE) ──────────── */}
      <aside
        aria-label="Sidebar Navigation"
        className="hidden md:flex fixed left-0 top-0 bottom-0 w-16 md:w-18 lg:w-20 bg-black/95 backdrop-blur-xl border-r border-white/[0.08] flex-col items-center justify-between py-6 z-50 transition-all duration-300"
      >
        {/* Top: Brand Mark */}
        <div className="flex flex-col items-center gap-6">
          <a
            href="/"
            className="group flex flex-col items-center justify-center w-11 h-11 rounded-lg hover:bg-white/10 transition-colors"
            title="Visual Bible TV"
          >
            <div className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center shadow-lg shadow-red-950/60 font-black text-white text-xs tracking-tighter">
              VB
            </div>
          </a>

          {/* Navigation Icons Rail */}
          <nav className="flex flex-col items-center gap-2 mt-4" aria-label="Main Menu">
            {/* Search */}
            <a
              href="#upcoming"
              onClick={() => setActiveNav("search")}
              className={`relative flex items-center justify-center w-12 h-12 rounded-lg transition-colors group ${
                activeNav === "search"
                  ? "text-white"
                  : "text-white/45 hover:text-white hover:bg-white/[0.06]"
              }`}
              title="Search Catalog"
            >
              {activeNav === "search" && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#E50914] rounded-r" />
              )}
              <Search className="w-5 h-5 transition-transform group-hover:scale-110" />
            </a>

            {/* Home (Active) */}
            <a
              href="#hero"
              onClick={() => setActiveNav("home")}
              className={`relative flex items-center justify-center w-12 h-12 rounded-lg transition-colors group ${
                activeNav === "home"
                  ? "text-white"
                  : "text-white/45 hover:text-white hover:bg-white/[0.06]"
              }`}
              title="Home"
            >
              {activeNav === "home" && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#E50914] rounded-r" />
              )}
              <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
            </a>

            {/* Series / TV */}
            <Link
              to="/watch"
              search={{ episode: "genesis" }}
              onClick={() => setActiveNav("tv")}
              className={`relative flex items-center justify-center w-12 h-12 rounded-lg transition-colors group ${
                activeNav === "tv"
                  ? "text-white"
                  : "text-white/45 hover:text-white hover:bg-white/[0.06]"
              }`}
              title="Genesis Series (50 Chapters)"
            >
              {activeNav === "tv" && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#E50914] rounded-r" />
              )}
              <Tv className="w-5 h-5 transition-transform group-hover:scale-110" />
            </Link>

            {/* Movies / Upcoming YAHWEH */}
            <a
              href="#upcoming"
              onClick={() => setActiveNav("films")}
              className={`relative flex items-center justify-center w-12 h-12 rounded-lg transition-colors group ${
                activeNav === "films"
                  ? "text-white"
                  : "text-white/45 hover:text-white hover:bg-white/[0.06]"
              }`}
              title="YAHWEH Exodus Feature"
            >
              {activeNav === "films" && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#E50914] rounded-r" />
              )}
              <Film className="w-5 h-5 transition-transform group-hover:scale-110" />
            </a>

            {/* My List / Waitlist */}
            <a
              href="#waitlist"
              onClick={() => setActiveNav("list")}
              className={`relative flex items-center justify-center w-12 h-12 rounded-lg transition-colors group ${
                activeNav === "list"
                  ? "text-white"
                  : "text-white/45 hover:text-white hover:bg-white/[0.06]"
              }`}
              title="Join Waitlist"
            >
              {activeNav === "list" && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#E50914] rounded-r" />
              )}
              <Plus className="w-5 h-5 transition-transform group-hover:scale-110" />
            </a>

            {/* Categories / Archive */}
            <a
              href="#genesis"
              onClick={() => setActiveNav("categories")}
              className={`relative flex items-center justify-center w-12 h-12 rounded-lg transition-colors group ${
                activeNav === "categories"
                  ? "text-white"
                  : "text-white/45 hover:text-white hover:bg-white/[0.06]"
              }`}
              title="Archive Categories"
            >
              {activeNav === "categories" && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#E50914] rounded-r" />
              )}
              <LayoutGrid className="w-5 h-5 transition-transform group-hover:scale-110" />
            </a>
          </nav>
        </div>

        {/* Bottom: Organization Logo */}
        <div className="flex flex-col items-center gap-3">
          <a
            href="https://nrim.org"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            title="Nations Reach International Missions"
          >
            <img
              src="/assets/nrim-logo-white.png"
              alt="NRIM"
              className="w-6 h-auto opacity-70 hover:opacity-100 transition-opacity"
            />
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
          href="#upcoming"
          onClick={() => setActiveNav("films")}
          className={`flex flex-col items-center gap-1 ${
            activeNav === "films" ? "text-[#E50914]" : "text-white/60"
          }`}
        >
          <Film className="w-5 h-5" />
          <span className="text-[10px] font-medium">Upcoming</span>
        </a>
        <Link
          to="/watch"
          search={{ episode: "genesis" }}
          onClick={() => setActiveNav("tv")}
          className={`flex flex-col items-center gap-1 ${
            activeNav === "tv" ? "text-[#E50914]" : "text-white/60"
          }`}
        >
          <Tv className="w-5 h-5" />
          <span className="text-[10px] font-medium">Watch</span>
        </Link>
        <a
          href="#waitlist"
          onClick={() => setActiveNav("list")}
          className={`flex flex-col items-center gap-1 ${
            activeNav === "list" ? "text-[#E50914]" : "text-white/60"
          }`}
        >
          <Plus className="w-5 h-5" />
          <span className="text-[10px] font-medium">Waitlist</span>
        </a>
      </nav>

      {/* ── MAIN CONTENT CONTAINER (OFFSET FOR SIDEBAR ON DESKTOP) ───── */}
      <div className="pl-0 md:pl-16 lg:pl-20 min-h-screen">
        {/* Floating Top Controls (Language Selector + Organization Links) */}
        <header className="absolute top-0 left-0 md:left-16 lg:left-20 right-0 z-40 flex items-center justify-between px-6 md:px-10 py-5 pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/50 tracking-wider uppercase font-semibold">
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

        {/* ── HERO SECTION: NETFLIX TV OTT VIBE ───────────────────────── */}
        <section
          id="hero"
          className="relative w-full overflow-hidden bg-black flex flex-col justify-between"
          style={{ minHeight: "100svh" }}
        >
          {/* Hero Backdrop (Right anchored subject, deep dark left gradient) */}
          <div className="absolute inset-0">
            <img
              src="/assets/yahweh-tablets-poster.jpg"
              alt="YAHWEH — The Book of Exodus"
              className="w-full h-full object-cover object-[70%_25%] md:object-[65%_20%]"
              fetchPriority="high"
            />
            {/* Multi-layered cinematic gradients matching the Netflix TV reference */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(90deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 60%, transparent 100%),
                  linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 25%, transparent 60%, rgba(0,0,0,0.95) 85%, #000000 100%)
                `,
              }}
            />
          </div>

          {/* Hero Content (Positioned cleanly like Netflix TV metadata) */}
          <div className="relative z-10 pt-24 md:pt-32 px-6 md:px-12 max-w-2xl">
            {/* Brand Pill: Red N / VB FILM */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rounded-sm bg-[#E50914] flex items-center justify-center font-black text-white text-[9px] leading-none">
                N
              </div>
              <span className="text-[11px] font-bold tracking-[0.25em] text-white/90 uppercase">
                FILM · VISUAL BIBLE
              </span>
            </div>

            {/* Above Title Tagline */}
            <div className="text-xs md:text-sm font-semibold tracking-[0.2em] text-white/70 uppercase mb-1">
              A Prossiga Media Production
            </div>

            {/* Main Show Title */}
            <h1
              className="font-black tracking-tight text-white leading-none mb-3"
              style={{ fontSize: "clamp(46px, 7vw, 92px)" }}
            >
              YAHWEH
            </h1>

            {/* Sub-Title */}
            <p className="text-white/90 text-sm md:text-base font-medium tracking-wide uppercase mb-4">
              The God Who Reveals His Power — The Book of Exodus
            </p>

            {/* Netflix-Style Spec Badges Row */}
            <div className="flex items-center gap-2.5 text-xs text-white/80 mb-4 flex-wrap">
              <span className="text-emerald-400 font-bold">New</span>
              <span className="text-white/60">2026</span>
              <span className="border border-white/40 px-1.5 py-0.5 text-[10px] font-semibold text-white/80 rounded-[2px] leading-none">
                16+
              </span>
              <span className="text-white/60">Feature Epic</span>
              <span className="border border-white/40 px-1.5 py-0.5 text-[9px] font-bold text-white/90 rounded-[2px] leading-none tracking-wider">
                VISION
              </span>
              <span className="border border-white/40 px-1.5 py-0.5 text-[9px] font-bold text-white/90 rounded-[2px] leading-none tracking-wider">
                5.1
              </span>
              <span className="border border-white/40 px-1.5 py-0.5 text-[9px] font-bold text-white/90 rounded-[2px] leading-none tracking-wider">
                4K UHD
              </span>
            </div>

            {/* Synopsis Description */}
            <p className="text-white/75 text-sm md:text-base leading-relaxed mb-6 max-w-xl">
              Following the monumental 50 chapters of Genesis, the epic continues into the Book of
              Exodus. Witness the plagues, the parting of the waters, and the giving of the law
              brought to life through revolutionary cinematic AI and real-actor performances.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.youtube.com/watch?v=3DULIG3sDS8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-white text-black text-sm font-bold px-6 py-2.5 rounded hover:bg-white/90 transition-all duration-200 hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-black" />
                Watch Workflow
              </a>
              <a
                href="#waitlist"
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-sm font-semibold px-5 py-2.5 rounded hover:bg-white/30 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Join Waitlist
              </a>
            </div>
          </div>

          {/* ── ROW 1: "ONLY ON VISUAL BIBLE" (CAROUSEL TUCKED DIRECTLY IN HERO) ── */}
          <div className="relative z-10 px-6 md:px-12 pt-10 pb-8 mt-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#E50914] rounded-sm" />
                <h2 className="text-base md:text-lg font-bold text-white tracking-wide">
                  Only on Visual Bible · Upcoming Premieres
                </h2>
              </div>
              <a
                href="#waitlist"
                className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors"
              >
                Explore all <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Netflix-Style Portrait Poster Carousel */}
            <div
              className="flex gap-4 overflow-x-auto pb-2 scrollbar-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
            >
              {YAHWEH_CARDS.map((card) => (
                <a
                  key={card.id}
                  href="#waitlist"
                  className="relative shrink-0 group cursor-pointer transition-transform duration-300 hover:scale-105"
                  style={{ width: "clamp(150px, 16vw, 210px)" }}
                >
                  {/* Poster Card Container */}
                  <div
                    className="w-full overflow-hidden rounded bg-[#141419] border border-white/[0.08] relative shadow-lg"
                    style={{ aspectRatio: "2/3" }}
                  >
                    <img src={card.image} alt={card.title} className="w-full h-full object-cover" />

                    {/* Netflix-Style Red Corner Brand Badge */}
                    <div className="absolute top-2 left-2 w-5 h-5 rounded-sm bg-[#E50914] flex items-center justify-center font-black text-white text-[10px] shadow">
                      N
                    </div>

                    {/* Bottom Red Banner: "Recently Added" / "In Production" Style */}
                    <div className="absolute bottom-0 left-0 right-0 bg-[#E50914] text-white text-center py-1 font-bold text-[10px] tracking-wider uppercase shadow-md">
                      {card.badge}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-3 text-center">
                      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center mb-2 shadow">
                        <Plus className="w-4 h-4 text-black" />
                      </div>
                      <span className="text-xs font-bold text-white leading-tight">
                        Join Waitlist
                      </span>
                      <span className="text-[10px] text-white/70 mt-1">{card.subtitle}</span>
                    </div>
                  </div>

                  {/* Title underneath */}
                  <p className="mt-1.5 text-xs font-medium text-white/90 truncate">{card.title}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── ROW 2: GENESIS VAULT ARCHIVE ───────────────────────────── */}
        <section id="genesis" className="pt-12 pb-4 px-6 md:px-12 bg-black">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-500 rounded-sm" />
              <div>
                <h2 className="text-base md:text-lg font-bold text-white tracking-wide">
                  Now Streaming · Genesis Vault (50 Chapters)
                </h2>
                <p className="text-xs text-white/50">
                  Completed series streaming across 8 live international languages
                </p>
              </div>
            </div>
            <Link
              to="/watch"
              search={{ episode: "genesis" }}
              className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors"
            >
              Watch full vault <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 16:9 Landscape Carousel */}
          <div
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
          >
            {GENESIS_CARDS.map((card) => (
              <Link
                key={card.id}
                to="/watch"
                search={{ episode: card.episode }}
                className="relative shrink-0 group transition-transform duration-300 hover:scale-105"
                style={{ width: "clamp(240px, 22vw, 320px)" }}
              >
                <div
                  className="w-full overflow-hidden rounded bg-[#141419] border border-white/[0.08] relative"
                  style={{ aspectRatio: "16/9" }}
                >
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                  {/* Top-left N icon */}
                  <div className="absolute top-2 left-2 w-4 h-4 rounded-sm bg-[#E50914] flex items-center justify-center font-black text-white text-[9px] shadow">
                    N
                  </div>
                  {/* Play Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-black text-black ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs font-semibold text-white truncate">{card.title}</p>
                  <span className="text-[10px] text-white/50 bg-white/10 px-1.5 py-0.5 rounded">
                    {card.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── ROW 3: FEATURED SPECIAL — PURPOSE OF GOD (JOSEPH) ──────── */}
        <section className="pt-8 pb-8 px-6 md:px-12 bg-black">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-4 bg-[#A99B5A] rounded-sm" />
            <h2 className="text-base md:text-lg font-bold text-white tracking-wide">
              Featured Special · Purpose of God
            </h2>
          </div>

          <Link
            to="/watch"
            search={{ episode: "joseph" }}
            className="relative group block max-w-4xl rounded-lg overflow-hidden border border-white/[0.08] transition-transform duration-300 hover:scale-[1.01]"
            style={{ aspectRatio: "21/9" }}
          >
            <img
              src="/assets/genesis-poster.jpg"
              alt="Purpose of God — The Story of Joseph"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)",
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-4 h-4 rounded-sm bg-[#E50914] flex items-center justify-center font-black text-white text-[9px]">
                  N
                </span>
                <span className="text-[10px] tracking-[0.2em] text-[#A99B5A] uppercase font-bold">
                  SPECIAL PRESENTATION · 26 MIN
                </span>
              </div>
              <h3 className="text-2xl md:text-4xl font-black text-white leading-tight mb-2">
                PURPOSE OF GOD
              </h3>
              <p className="text-xs md:text-sm text-white/70 max-w-md mb-4 line-clamp-2 md:line-clamp-3">
                From slavery to ruler of Egypt. Joseph's journey reveals how God orchestrates every
                trial to preserve a covenant remnant.
              </p>
              <div className="flex items-center gap-2 bg-white text-black text-xs font-bold px-5 py-2.5 rounded w-fit group-hover:bg-white/90 transition-colors">
                <Play className="w-3.5 h-3.5 fill-black" />
                Watch Feature Now
              </div>
            </div>
          </Link>
        </section>

        {/* ── VISION & WORKFLOW STRIP ─────────────────────────────────── */}
        <section className="py-16 px-6 md:px-12 bg-gradient-to-b from-black via-[#080808] to-black border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-4 bg-[#E50914] rounded-sm" />
                <span className="text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
                  Our Method & Mission
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-4">
                The Message is the Same.
                <br />
                <span className="text-white/40">The Medium is Revolutionary.</span>
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                NRIM (Nations Reach International Missions) has engineered a pioneering pipeline
                that marries real-actor human emotion with state-of-the-art AI rendering. We deliver
                epic biblical cinema with zero loss in scriptural fidelity.
              </p>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                50 chapters of Genesis have reached 88 countries across 8 languages. With YAHWEH, we
                are expanding into theatrical exhibition and global broadcast.
              </p>
              <a
                href="https://www.youtube.com/watch?v=3DULIG3sDS8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/20 text-white text-xs font-bold px-5 py-2.5 rounded hover:bg-white/10 transition-colors uppercase tracking-wider"
              >
                <Play className="w-3.5 h-3.5" />
                Watch Technical Workflow
              </a>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "1M+", label: "Views Worldwide", sub: "YouTube & Broadcast" },
                { num: "88", label: "Countries", sub: "Global reach" },
                { num: "50", label: "Chapters Live", sub: "Genesis Complete" },
                { num: "8 / 100", label: "Languages", sub: "Active & Target" },
              ].map((m) => (
                <div key={m.label} className="bg-[#121216] border border-white/[0.08] rounded p-5">
                  <div className="text-3xl font-black text-white leading-none mb-1">{m.num}</div>
                  <div className="text-xs font-bold text-white/80">{m.label}</div>
                  <div className="text-[11px] text-white/40 mt-0.5">{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WAITLIST FUNNEL ─────────────────────────────────────────── */}
        <section
          id="waitlist"
          className="py-20 px-6 md:px-12 bg-black border-t border-white/[0.06] text-center"
        >
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E50914]/20 border border-[#E50914]/40 text-[#E50914] text-[11px] font-bold tracking-widest uppercase mb-4">
              Exclusive Premiere Access
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
              Be the First to Watch YAHWEH
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-md mx-auto">
              Join our global premiere community. Receive private screening links, theatrical
              updates, and behind-the-scenes production reels.
            </p>

            {status === "success" ? (
              <div className="flex items-center justify-center gap-2 bg-[#141419] border border-emerald-500/40 rounded p-5 text-emerald-400">
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
                  {status === "loading" ? "Joining…" : "Join Waitlist"}
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

        {/* ── FOOTER (NETFLIX STYLE) ──────────────────────────────────── */}
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
                      Home Showcase
                    </a>
                  </li>
                  <li>
                    <a href="#upcoming" className="hover:text-white">
                      YAHWEH Premiere
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white/70 font-bold uppercase tracking-wider mb-3">
                  Organization
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://nrim.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white"
                    >
                      nrim.org
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
                      YouTube Channel
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white/70 font-bold uppercase tracking-wider mb-3">Languages</h4>
                <p className="leading-relaxed">
                  English · Hindi · Tamil · Malayalam · Persian · Tagalog · Chinese · Malay
                </p>
              </div>
              <div>
                <h4 className="text-white/70 font-bold uppercase tracking-wider mb-3">
                  Production
                </h4>
                <p className="leading-relaxed">
                  A Prossiga Media Film / Nations Reach International Missions production.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-3">
              <p>
                © {new Date().getFullYear()} Visual Bible TV · Nations Reach International Missions
              </p>
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
