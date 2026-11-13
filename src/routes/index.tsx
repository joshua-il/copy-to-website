import { useState, useEffect, useRef, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, Plus, Star, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
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
    label: "In Theatres Worldwide",
  },
  {
    id: "y2",
    title: "The Deliverer",
    image: "/assets/yahweh-exodus-staff-poster.jpg",
    label: "The Book of Exodus",
  },
  {
    id: "y3",
    title: "The Waters Divide",
    image: "/assets/moses-parting-sea.jpg",
    label: "Red Sea Miracle",
  },
  {
    id: "y4",
    title: "YAHWEH · Monument",
    image: "/assets/yahweh-monument.jpg",
    label: "Covenant & Fire",
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
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Transparent → solid nav on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      className="min-h-screen bg-[#0a0a0a] text-white font-sans"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.07]"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-[4%] max-w-[1600px] mx-auto">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/assets/nrim-logo-white.png"
              alt="NRIM"
              className="h-7 w-auto object-contain"
            />
            <span className="text-white font-semibold text-sm tracking-[0.15em] uppercase hidden sm:block">
              Visual Bible
            </span>
          </a>

          {/* Nav links — desktop */}
          <div className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <a href="#hero" className="hover:text-white transition-colors">
              Home
            </a>
            <a href="#genesis" className="hover:text-white transition-colors">
              Genesis
            </a>
            <a href="#upcoming" className="hover:text-white transition-colors">
              Upcoming
            </a>
            <Link to="/watch" className="hover:text-white transition-colors">
              Watch
            </Link>
            <a
              href="https://nrim.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              NRIM
            </a>
          </div>

          {/* Right: CTA + language */}
          <div className="flex items-center gap-3">
            <RegionalSelector value={language} onValueChange={setLanguage} />
            <a
              href="#waitlist"
              className="hidden sm:inline-flex items-center gap-1.5 bg-white text-black text-xs font-semibold px-4 py-2 rounded-full hover:bg-white/90 transition-colors"
            >
              Join Waitlist
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO — full-bleed YAHWEH ───────────────────────────────────── */}
      <section
        id="hero"
        className="relative w-full overflow-hidden"
        style={{ height: "100svh", maxHeight: "920px", minHeight: "600px" }}
      >
        {/* Background image */}
        <img
          src="/assets/yahweh-tablets-poster.jpg"
          alt="YAHWEH — The Book of Exodus"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 15%" }}
          fetchPriority="high"
        />

        {/* 3-layer gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(77deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.6) 40%, rgba(10,10,10,0.1) 70%, transparent 100%),
              linear-gradient(180deg, transparent 50%, rgba(10,10,10,0.9) 80%, #0a0a0a 100%),
              linear-gradient(180deg, rgba(10,10,10,0.6) 0%, transparent 18%)
            `,
          }}
        />

        {/* Content — bottom-left anchor */}
        <div
          className="absolute left-[4%] right-[4%] md:right-auto"
          style={{ bottom: "14%", maxWidth: "520px" }}
        >
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-1.5 bg-[#E50914] text-white text-[10px] font-bold px-3 py-1.5 rounded-full tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Now In Production · 2026
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-black tracking-tight text-white leading-none mb-2"
            style={{ fontSize: "clamp(44px, 7vw, 96px)" }}
          >
            YAHWEH
          </h1>

          {/* Subtitle */}
          <p className="text-white/80 text-sm font-medium tracking-widest uppercase mb-4">
            The God Who Reveals His Power — The Book of Exodus
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-white/60 mb-5 flex-wrap">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#F5B301] text-[#F5B301]" />
              <span className="text-[#F5B301] font-semibold">9.9</span>
            </span>
            <span className="text-white/30">|</span>
            <span>Biblical Epic</span>
            <span className="text-white/30">·</span>
            <span>Cinematic AI</span>
            <span className="text-white/30">·</span>
            <span>4K · Global</span>
          </div>

          {/* Synopsis */}
          <p className="text-white/70 text-sm leading-relaxed mb-7 max-w-[460px]">
            Following the monumental journey of Genesis, witness the plagues, the parting of the
            waters, and the giving of the law — brought to life through revolutionary cinematic AI
            and real-actor performances.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.youtube.com/watch?v=3DULIG3sDS8"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-black text-sm font-semibold px-6 py-3 rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-black" />
              Watch Workflow
            </a>
            <a
              href="#waitlist"
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-white/20 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Join Waitlist
            </a>
          </div>
        </div>

        {/* Stats — bottom right, desktop only */}
        <div className="absolute right-[4%] bottom-[14%] hidden lg:flex flex-col gap-4 text-right">
          {[
            { num: "1M+", label: "Views Worldwide" },
            { num: "88", label: "Countries Reached" },
            { num: "8", label: "Live Languages" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-black text-white leading-none">{s.num}</div>
              <div className="text-[11px] text-white/50 font-medium tracking-wide mt-0.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ROW 1: UPCOMING PREMIERE — YAHWEH ─────────────────────────── */}
      <section id="upcoming" className="pt-10 pb-2 px-[4%]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.2em] text-[#E50914] uppercase mb-1">
              Upcoming Premiere
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              YAHWEH · The Book of Exodus
            </h2>
          </div>
          <a
            href="#waitlist"
            className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors"
          >
            Get notified <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Portrait card carousel */}
        <div
          className="flex gap-4 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {YAHWEH_CARDS.map((card) => (
            <a
              key={card.id}
              href="#waitlist"
              className="relative shrink-0 group cursor-pointer"
              style={{ width: "clamp(160px, 18vw, 220px)" }}
            >
              <div
                className="w-full overflow-hidden rounded-xl border border-white/[0.07] bg-[#141419]"
                style={{ aspectRatio: "2/3" }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                  <div className="flex items-center gap-2 bg-white text-black text-xs font-bold px-4 py-2 rounded-full">
                    <Plus className="w-3.5 h-3.5" />
                    Join Waitlist
                  </div>
                </div>
              </div>
              {/* Badge */}
              <div className="absolute top-2 left-2 bg-[#E50914] text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-widest">
                COMING SOON
              </div>
              {/* Label */}
              <p className="mt-2 text-xs text-white/60 truncate">{card.label}</p>
              <p className="text-xs font-semibold text-white truncate">{card.title}</p>
            </a>
          ))}
        </div>
      </section>

      {/* ── ROW 2: NOW STREAMING — GENESIS ARCHIVE ────────────────────── */}
      <section id="genesis" className="pt-10 pb-2 px-[4%]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.2em] text-emerald-400 uppercase mb-1">
              Now Streaming
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              In the Beginning · Genesis Archive
            </h2>
          </div>
          <Link
            to="/watch"
            className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors"
          >
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 16:9 card carousel */}
        <div
          className="flex gap-4 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {GENESIS_CARDS.map((card) => (
            <Link
              key={card.id}
              to="/watch"
              search={{ episode: card.episode }}
              className="relative shrink-0 group"
              style={{ width: "clamp(220px, 24vw, 300px)" }}
            >
              <div
                className="w-full overflow-hidden rounded-xl border border-white/[0.07] bg-[#141419]"
                style={{ aspectRatio: "16/9" }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Hover overlay — play button */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-5 h-5 fill-black text-black ml-0.5" />
                  </div>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-white/50 truncate">{card.label}</p>
              <p className="text-xs font-semibold text-white truncate">{card.title}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED: JOSEPH / PURPOSE OF GOD ────────────────────────── */}
      <section className="pt-10 pb-2 px-[4%]">
        <div className="mb-5">
          <div className="text-[11px] font-semibold tracking-[0.2em] text-[#A99B5A] uppercase mb-1">
            Special Feature
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Purpose of God · The Story of Joseph
          </h2>
        </div>

        <Link
          to="/watch"
          search={{ episode: "joseph" }}
          className="relative group block max-w-3xl rounded-2xl overflow-hidden border border-white/[0.07]"
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
                "linear-gradient(90deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.5) 50%, transparent 100%)",
            }}
          />
          <div className="absolute inset-0 flex flex-col justify-end p-7">
            <div className="text-[10px] tracking-[0.25em] text-[#A99B5A] uppercase font-semibold mb-2">
              From Genesis · Chapter 37–50
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
              PURPOSE OF GOD
            </h3>
            <p className="text-sm text-white/70 max-w-sm mb-5">
              Sold into slavery, elevated to ruler. Joseph's journey reveals how God works all
              things for good to preserve His covenant people.
            </p>
            <div className="flex items-center gap-2 bg-white text-black text-xs font-bold px-5 py-2.5 rounded-full w-fit group-hover:bg-white/90 transition-colors">
              <Play className="w-3.5 h-3.5 fill-black" />
              Watch Now · 26 min
            </div>
          </div>
        </Link>
      </section>

      {/* ── MISSION / VISION STRIP ────────────────────────────────────── */}
      <section className="mt-20 px-[4%] max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <div className="text-[11px] font-semibold tracking-[0.2em] text-white/40 uppercase mb-4">
              Our Mission
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-5">
              The Message is the Same.
              <br />
              <span className="text-white/50">The Medium is New.</span>
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              NRIM (Nations Reach International Missions) has pioneered a revolutionary AI-powered
              cinematic pipeline — capturing real human performances and transforming them into
              high-fidelity biblical narratives. The gospel doesn't change. The way we tell it does.
            </p>
            <p className="text-white/60 text-sm leading-relaxed mb-7">
              50 chapters of Genesis have already been released across 8 languages, reaching 88
              countries and crossing 1 million views. YAHWEH — The Book of Exodus — is next.
            </p>
            <a
              href="https://www.youtube.com/watch?v=3DULIG3sDS8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/20 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <Play className="w-4 h-4" />
              See Our Technical Workflow
            </a>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-2 gap-5">
            {[
              { num: "1M+", label: "Views Worldwide", color: "text-white" },
              { num: "88", label: "Countries Reached", color: "text-white" },
              { num: "50", label: "Genesis Chapters Released", color: "text-white" },
              { num: "8", label: "Live Languages", color: "text-white" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-[#141419] border border-white/[0.07] rounded-2xl p-5"
              >
                <div className={`text-3xl font-black ${s.color} leading-none mb-1`}>{s.num}</div>
                <div className="text-xs text-white/50 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXTERNAL LINKS STRIP ─────────────────────────────────────── */}
      <section className="mt-16 px-[4%] max-w-[1200px] mx-auto">
        <div className="text-[11px] font-semibold tracking-[0.2em] text-white/30 uppercase mb-5">
          Explore
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            {
              label: "Watch Genesis on YouTube",
              href: "https://www.youtube.com/watch?v=z5abtVIszH8",
              external: true,
              accent: false,
            },
            { label: "Visual Bible · Watch Page", href: "/watch", external: false, accent: true },
            {
              label: "visualbible.nrim.org",
              href: "https://visualbible.nrim.org",
              external: true,
              accent: false,
            },
            {
              label: "NRIM · Nations Reach",
              href: "https://nrim.org",
              external: true,
              accent: false,
            },
          ].map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 text-sm px-5 py-2.5 rounded-full border transition-colors ${
                  link.accent
                    ? "bg-[#E50914] border-[#E50914] text-white hover:bg-[#c0070f]"
                    : "border-white/20 text-white/70 hover:text-white hover:border-white/40"
                }`}
              >
                {link.label}
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href as "/watch"}
                className={`flex items-center gap-2 text-sm px-5 py-2.5 rounded-full border transition-colors ${
                  link.accent
                    ? "bg-[#E50914] border-[#E50914] text-white hover:bg-[#c0070f]"
                    : "border-white/20 text-white/70 hover:text-white hover:border-white/40"
                }`}
              >
                {link.label}
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            ),
          )}
        </div>
      </section>

      {/* ── WAITLIST SECTION ──────────────────────────────────────────── */}
      <section id="waitlist" className="mt-24 mb-20 px-[4%]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-[11px] font-semibold tracking-[0.2em] text-[#A99B5A] uppercase mb-4">
            Exclusive Premiere Access
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            Be First to Watch
            <br />
            <span className="text-white/40">YAHWEH</span>
          </h2>
          <p className="text-white/55 text-sm leading-relaxed mb-10 max-w-md mx-auto">
            Join thousands worldwide. Get premiere dates, behind-the-scenes content, and
            first-access to YAHWEH and upcoming Visual Bible releases before anyone else.
          </p>

          {status === "success" ? (
            <div className="flex items-center justify-center gap-2 bg-[#141419] border border-emerald-500/30 rounded-2xl p-5 text-emerald-400">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">
                You're on the list! We'll notify you the moment YAHWEH drops.
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleWaitlist}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                disabled={status === "loading"}
                aria-label="Email for waitlist"
                className="flex-1 bg-[#141419] border border-white/[0.1] text-white text-sm placeholder:text-white/30 px-5 py-3.5 rounded-full focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-[#E50914] hover:bg-[#c0070f] text-white text-sm font-bold px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 whitespace-nowrap"
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

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-10 border-t border-white/[0.07]">
            {[
              { num: "1M+", label: "Views Worldwide" },
              { num: "88", label: "Countries Reached" },
              { num: "8", label: "Live Languages" },
              { num: "100", label: "Language Goal" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-black text-white">{s.num}</div>
                <div className="text-[11px] text-white/40 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.07] bg-[#0a0a0a] py-12 px-[4%]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img
                  src="/assets/nrim-logo-white.png"
                  alt="NRIM"
                  className="h-6 w-auto object-contain"
                />
                <span className="text-white font-semibold text-sm tracking-[0.15em] uppercase">
                  Visual Bible
                </span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed">
                Until All Hear — Every Language, Every Nation.
                <br />A production of NRIM (Nations Reach International Missions).
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-[0.15em] mb-4">
                Navigate
              </h4>
              <ul className="space-y-2 text-sm text-white/40">
                <li>
                  <Link to="/watch" className="hover:text-white transition-colors">
                    Watch · Stream
                  </Link>
                </li>
                <li>
                  <a
                    href="https://nrim.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    NRIM · nrim.org
                  </a>
                </li>
                <li>
                  <a
                    href="https://visualbible.nrim.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    visualbible.nrim.org
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@NationsReach"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    YouTube · 50 Genesis Chapters
                  </a>
                </li>
              </ul>
            </div>

            {/* Languages */}
            <div>
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-[0.15em] mb-4">
                Languages
              </h4>
              <p className="text-xs text-white/40 leading-relaxed">
                English · Hindi · Tamil · Malayalam · Persian · Tagalog · Chinese · Malay
              </p>
              <p className="text-xs text-white/25 mt-2">Yoruba & Regional — Coming Soon</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-8 border-t border-white/[0.07] gap-3">
            <p className="text-xs text-white/25">
              © {new Date().getFullYear()} Visual Bible TV · A NRIM Production
            </p>
            <p className="text-xs text-white/25">visualbible.tv</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
