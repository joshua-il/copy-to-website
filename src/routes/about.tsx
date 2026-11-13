import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  Users,
  Layers,
  Globe2,
  Tv,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Play,
  Film,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalSidebar } from "@/components/global-sidebar";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/about")({
  component: AboutMissionPage,
  head: () => ({
    meta: [
      {
        title: "About Us & Production Pipeline · Visual Bible TV",
      },
      {
        name: "description",
        content:
          "VISUAL BIBLE: Until All Hear: Every Language, Every Nation. A production of NRIM bringing the Bible to life through an AI production pipeline using real people transformed into biblical characters.",
      },
      { property: "og:title", content: "Visual Bible TV · Mission & AI Pipeline" },
      {
        property: "og:description",
        content:
          "Until All Hear: Every Language, Every Nation. Transforming real people into living biblical avatars across 100 languages.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/about" },
    ],
  }),
});

function AboutMissionPage() {
  const productionGallery = [
    {
      title: "YAHWEH — Mount Sinai",
      context: "Exodus: The Giving of the Law",
      image: "/assets/yahweh-hero-mount-sinai.jpg",
      description:
        "Moses atop the thunderous crags of Mount Sinai carrying the stone tablets of the Covenant, grounded in historical Sinai topography and storm lighting.",
    },
    {
      title: "The Waters Divide",
      context: "Exodus 14: Red Sea Crossing",
      image: "/assets/yahweh-hero-parted-sea.jpg",
      description:
        "Colossal walls of divided sea waters and weathered desert textiles captured through living dramatic performers and cinematic composition.",
    },
    {
      title: "The Patriarchs of Genesis",
      context: "Genesis: The Shepherds of Canaan",
      image: "/assets/genesis-shepherds-poster.jpg",
      description:
        "Authentic hand-loomed wool garments, genuine facial inflections, and ancient pastoral encampments reconstructed with rigorous fidelity.",
    },
    {
      title: "The Purpose of God",
      context: "Genesis 37-50: The Story of Joseph",
      image: "/assets/purpose-of-god-joseph-poster.jpg",
      description:
        "From betrayal in Dothan to the royal courts of Egypt, capturing the emotional gravity of brokenness, reconciliation, and sovereignty.",
    },
    {
      title: "Pharaoh & The Prophet",
      context: "Genesis 41: Court of Antiquity",
      image: "/assets/genesis-pharaoh-prophet-sunset.jpg",
      description:
        "Historically accurate linen robes, golden pectoral regalia, and ancient architectural monuments reconstructed around live human performances.",
    },
    {
      title: "Genesis · उत्पत्ति",
      context: "Regional Editions: Campfire Council",
      image: "/assets/genesis-hindi-campfire-poster.jpg",
      description:
        "Dramatized oral storytelling around the fire, synchronized with regional native dialects to bypass literacy barriers for unreached communities.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#07070a] text-white font-sans selection:bg-[#A11C28] selection:text-white">
      {/* Global OTT Sidebar */}
      <GlobalSidebar />

      {/* Main Content Area */}
      <div className="pl-0 md:pl-18 lg:pl-20 min-h-screen flex flex-col justify-between">
        <main>
          {/* ── 1. HERO MANIFESTO HEADER ───────────────────────────── */}
          <section className="relative pt-24 pb-16 px-6 md:px-12 max-w-6xl mx-auto text-center flex flex-col items-center">
            {/* Ambient Background Radial Glow */}
            <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#A11C28]/10 rounded-full blur-[120px] -z-10" />

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white text-[11px] font-bold tracking-[0.2em] uppercase mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#A11C28] animate-pulse" />A Production of
              NRIM · Visual Bible Network
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight max-w-4xl mb-6">
              VISUAL BIBLE: Until All Hear: Every Language, Every Nation.
            </h1>

            <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-2xl mb-8 font-medium">
              Bringing the Bible to life through an AI production pipeline using real people and
              transforming them into characters from the Bible.
            </p>

            <div className="flex items-center gap-3.5 flex-wrap justify-center">
              <Link
                to="/watch"
                className="flex items-center gap-2 bg-[#A11C28] hover:bg-[#7F151F] text-white text-xs md:text-sm font-bold px-6 py-2.5 rounded-full transition-transform hover:scale-105 shadow-lg shadow-red-950/50 uppercase tracking-wider"
              >
                <Play className="w-4 h-4 fill-white" />
                Watch 24/7 Broadcast
              </Link>
              <Link
                to="/explore"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs md:text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
              >
                Join Premiere Waitlist
              </Link>
              <a
                href="https://nrim.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors px-3 py-2"
              >
                <span>About NRIM Organization</span>
                <ExternalLink className="w-3.5 h-3.5 text-white/40" />
              </a>
            </div>
          </section>

          {/* ── 2. PANORAMIC 35MM CINEMATIC STILL BANNER ─────────────── */}
          <section className="px-4 md:px-12 max-w-7xl mx-auto mb-20">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl">
              <div className="relative aspect-[21/9] md:aspect-[24/10] w-full overflow-hidden">
                <img
                  src="/assets/yahweh-hero-mount-sinai.jpg"
                  alt="Moses with the stone tablets on Mount Sinai"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-transparent to-black/40" />
              </div>

              {/* Celluloid Edge Label Overlay */}
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[10px] font-mono text-white/70 select-none">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#A11C28]" />
                  <span>NRIM 5219 · 35MM CINE EMULSION · SCRIPTURE VISUAL TRANSLATION</span>
                </span>
                <span className="hidden sm:inline text-white/50">
                  SACRED GEOGRAPHY &amp; LIVING LIKENESS
                </span>
              </div>
            </div>
          </section>

          {/* ── 3. THE CORE VISION & METRICS ────────────────────────── */}
          <section className="py-16 px-6 md:px-12 bg-[#09090e] border-y border-white/[0.08]">
            <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10 items-center">
              <div className="md:col-span-7 space-y-5 text-left">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#A11C28]" />
                  <span className="text-[11px] font-bold tracking-[0.25em] text-white/60 uppercase">
                    The Manifesto
                  </span>
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
                  The Message Remains Eternal.
                  <br />
                  <span className="text-white/40">The Medium Has Evolved.</span>
                </h2>
                <p className="text-white/80 text-xs md:text-sm leading-relaxed">
                  For centuries, the Word was translated exclusively into the written word. But over
                  a billion people worldwide belong to oral dialects or live in regions without
                  accessible written Scripture.
                </p>
                <p className="text-white/70 text-xs md:text-sm leading-relaxed">
                  By casting real people and transforming their living performances into authentic
                  biblical avatars through an advanced neural AI production pipeline, NRIM is
                  creating the world&apos;s first comprehensive, photorealistic cinematic
                  translation of the Bible.
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="md:col-span-5 grid grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
                  <span className="text-3xl font-black text-[#A11C28] block mb-1">100</span>
                  <span className="text-xs font-bold text-white block">Target Languages</span>
                  <span className="text-[10px] text-white/40">Global Production Pipeline</span>
                </div>
                <div className="p-5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
                  <span className="text-3xl font-black text-white block mb-1">88</span>
                  <span className="text-xs font-bold text-white block">Countries</span>
                  <span className="text-[10px] text-white/40">Nations Watching</span>
                </div>
                <div className="p-5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
                  <span className="text-3xl font-black text-white block mb-1">50</span>
                  <span className="text-xs font-bold text-white block">Genesis Chapters</span>
                  <span className="text-[10px] text-white/40">Foundational Saga Complete</span>
                </div>
                <div className="p-5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
                  <span className="text-3xl font-black text-white block mb-1">1M+</span>
                  <span className="text-xs font-bold text-white block">Views Worldwide</span>
                  <span className="text-[10px] text-white/40">Streaming Reach</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── 4. THE 3 PRODUCTION PILLARS ──────────────────────────── */}
          <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#A11C28] uppercase block mb-2">
                Production Pillars
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
                How the Pipeline Works
              </h2>
              <p className="text-xs md:text-sm text-white/60">
                Bridging physical human emotion with generative cinematic intelligence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {/* Pillar 01 */}
              <div className="p-6 rounded-2xl border border-white/10 bg-[#0c0c12] flex flex-col justify-between hover:border-[#A11C28]/50 transition-colors group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#A11C28]/20 border border-[#A11C28]/40 flex items-center justify-center text-[#A11C28] mb-4">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-white/40 tracking-widest uppercase block mb-1">
                    PILLAR 01 · EMBODIMENT
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#ff4d5e] transition-colors">
                    Real People as Living Avatars
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed font-medium">
                    We do not use CGI mannequins. We cast actual people, capturing their authentic
                    facial inflections, grief, joy, and emotional gravity, transforming their human
                    likeness into living biblical characters.
                  </p>
                </div>
              </div>

              {/* Pillar 02 */}
              <div className="p-6 rounded-2xl border border-white/10 bg-[#0c0c12] flex flex-col justify-between hover:border-[#A11C28]/50 transition-colors group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-white/40 tracking-widest uppercase block mb-1">
                    PILLAR 02 · ARCHEOLOGY
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#ff4d5e] transition-colors">
                    Ancient Worldbuilding
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed font-medium">
                    From Mesopotamian tents to the colossal courts of Pharaoh and the parted waters
                    of the Red Sea. We procedurally and historically reconstruct sacred geography,
                    ancient textiles, and topography with archaeological fidelity.
                  </p>
                </div>
              </div>

              {/* Pillar 03 */}
              <div className="p-6 rounded-2xl border border-white/10 bg-[#0c0c12] flex flex-col justify-between hover:border-[#A11C28]/50 transition-colors group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#A11C28]/20 border border-[#A11C28]/40 flex items-center justify-center text-[#A11C28] mb-4">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-white/40 tracking-widest uppercase block mb-1">
                    PILLAR 03 · LOCALIZATION
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#ff4d5e] transition-colors">
                    100 Spoken Languages
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed font-medium">
                    Engineered specifically for unreached oral traditions without written Scripture.
                    By synchronizing neural vocal translation with native oral delivery, we break
                    the literacy barrier so every community hears the Word in their heart tongue.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 5. PRODUCTION PORTFOLIO GALLERY ───────────────────────── */}
          <section className="py-20 px-6 md:px-12 bg-[#09090e] border-t border-white/[0.08]">
            <div className="max-w-6xl mx-auto">
              <div className="text-left mb-12">
                <span className="text-[11px] font-bold tracking-[0.25em] text-white/50 uppercase block mb-1">
                  Cinematic Archive
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white">
                  Visual Transformations in Action
                </h2>
                <p className="text-xs md:text-sm text-white/60 mt-1 max-w-xl">
                  High-fidelity stills from completed Genesis releases and the upcoming YAHWEH
                  theatrical and streaming production.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productionGallery.map((item) => (
                  <div
                    key={item.title}
                    className="group rounded-xl overflow-hidden border border-white/10 bg-black flex flex-col justify-between shadow-xl hover:border-white/30 transition-colors"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-black">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                      <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded bg-black/85 backdrop-blur-md text-[10px] font-mono text-white/90 border border-white/10">
                        {item.context}
                      </div>
                    </div>

                    <div className="p-4 space-y-1.5 text-left">
                      <h3 className="text-sm font-bold text-white group-hover:text-[#ff4d5e] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-white/60 leading-relaxed font-sans">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 6. PARENT MINISTRY & ORGANIZATIONAL MANDATE ──────────── */}
          <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto text-center">
            <div className="p-8 md:p-12 rounded-3xl border border-white/15 bg-gradient-to-b from-[#101018] to-black shadow-2xl space-y-6">
              <div className="inline-flex flex-col items-center gap-2">
                <img
                  src="/assets/nrim-logo-white.png"
                  alt="Nations Reach International Missions"
                  className="h-12 w-auto object-contain"
                />
                <span className="text-[10px] font-black tracking-[0.25em] text-white/80 uppercase">
                  VISUAL BIBLE TV
                </span>
              </div>

              <div className="max-w-xl mx-auto space-y-3">
                <h3 className="text-xl md:text-2xl font-black text-white">
                  Nations Reach International Missions (NRIM)
                </h3>
                <p className="text-xs md:text-sm text-white/70 italic font-serif">
                  &ldquo;Reaching The Nations Through Media, Mercy And Mission&rdquo;
                </p>
                <p className="text-xs text-white/60 leading-relaxed">
                  NRIM is a registered 501(c)(3) nonprofit ministry dedicated to bringing the
                  transformative truth of Jesus Christ to unreached people groups through cinematic
                  storytelling, broadcast media, and grassroots mission initiatives.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3.5 flex-wrap">
                <a
                  href="https://nrim.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#A11C28] hover:bg-[#7F151F] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-red-950/50"
                >
                  <span>Visit Official NRIM.org</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                </a>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Join Waitlist <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Global Footer */}
        <SiteFooter />
      </div>
    </div>
  );
}
