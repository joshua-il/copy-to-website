import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Cpu,
  Globe2,
  Layers,
  Sparkles,
  Users,
  Video,
  Download,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { useGlobalLanguage } from "@/lib/language";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/about")({
  component: AboutMissionPage,
  head: () => ({
    meta: [
      {
        title: "About Us & AI Production Pipeline | Visual Bible — An NRIM Production",
      },
      {
        name: "description",
        content:
          "VISUAL BIBLE: Until All Hear: Every Language, Every Nation. Bringing the Bible to life through an AI production pipeline using real people and transforming them into biblical characters.",
      },
      { property: "og:title", content: "Visual Bible: Mission & AI Production Pipeline" },
      {
        property: "og:description",
        content:
          "Until All Hear: Every Language, Every Nation. An innovative AI-powered biblical production by NRIM.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function AboutMissionPage() {
  const [language, setLanguage] = useGlobalLanguage();

  const transformations = [
    {
      title: "Pharaoh & The Prophet",
      context: "Genesis: The Royal Court of Egypt",
      image: "/assets/genesis-pharaoh-prophet-sunset.jpg",
      description:
        "Historical Egyptian court garments, golden pectoral jewelry, and ancient obelisk landscapes reconstructed with photorealistic fidelity around live performances.",
    },
    {
      title: "Moses: Deliverer of Israel",
      context: "Exodus: Mount Sinai & Red Sea",
      image: "/assets/yahweh-exodus-staff-poster.jpg",
      description:
        "Weathered desert robes, hand-carved acacia wood staff, and atmospheric storm lighting grounded in historical Middle Eastern topography.",
    },
    {
      title: "Judah: The Desert Covenant",
      context: "Genesis 38: An NRIM Production",
      image: "/assets/judas-chosen-by-god-persian.jpg",
      description:
        "Intricate woven wool textures, bronze medallions, and ancient stone ramparts, captured for regional Persian and universal distribution.",
    },
    {
      title: "Warriors of the Promise",
      context: "Patriarchal Era & Faith Through Trial",
      image: "/assets/genesis-warriors-fire.jpg",
      description:
        "Torchlight scattering, authentic leather armor scale plates, and cinematic smoke particles rendered through neural composition.",
    },
  ];

  return (
    <main className="vb-shell vb-about-shell">
      <SiteHeader language={language} setLanguage={setLanguage} />

      {/* Hero Mission Header as specified in Blueprint */}
      <section className="vb-about-hero" aria-label="About Visual Bible and NRIM">
        <div className="vb-content-container">
          <p className="vb-eyebrow">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-gold inline" />
            MISSION & PRODUCTION MANIFESTO
          </p>

          <h1 className="vb-about-headline">
            VISUAL BIBLE: Until All Hear: Every Language, Every Nation.
            <span className="vb-about-subheadline">A production of NRIM.</span>
          </h1>

          <p className="vb-about-lead-copy">
            Bringing the Bible to life through an AI production pipeline using real people and
            transforming them into characters from the Bible.
          </p>
        </div>
      </section>

      {/* Panoramic Feature Visual */}
      <section className="vb-about-visual-banner" aria-label="Cinematic Moses Banner">
        <img
          src="/assets/moses-parting-sea.jpg"
          alt="Moses holding the stone tablets as the sea parts"
          className="vb-about-banner-img"
        />
        <div className="vb-about-banner-shade" />
        <div className="vb-about-banner-caption">
          <div className="vb-content-container flex justify-between items-center text-xs text-neutral-300">
            <span>THE LIVING WORD, BROUGHT TO LIFE FOR EVERY TRIBE AND TONGUE</span>
            <span className="font-mono text-gold">NRIM · VISUALBIBLE.TV</span>
          </div>
        </div>
      </section>

      {/* The Vision Section */}
      <section className="vb-vision-section" aria-label="The Vision">
        <div className="vb-content-container vb-vision-grid">
          <div className="vb-vision-title-col">
            <span className="vb-eyebrow">THE CORE VISION</span>
            <h2 className="vb-vision-title">Scripture That Speaks to the Eyes of the World</h2>
          </div>

          <div className="vb-vision-copy-col">
            <p className="vb-vision-highlight">
              The mission of the Visual Bible is simple yet eternal: to bring the Bible to life
              through an AI production pipeline using real people and transforming them into
              characters from the Bible.
            </p>
            <p className="vb-vision-body">
              For generations, biblical epics required hundreds of millions of dollars and decades
              of studio time, often inaccessible to oral communities and unreached languages.
              Through cutting-edge neural workflows, NRIM merges high-caliber cinematography with
              advanced generative pipelines to faithfully represent the narrative of Scripture with
              speed, precision, and cultural resonance.
            </p>
            <p className="vb-vision-body">
              Every garment, every landscape, and every tear is crafted to honor the sacred text
              while speaking clearly to contemporary audiences across 88 countries and over 100
              languages.
            </p>
          </div>
        </div>
      </section>

      {/* The Technology Section: AI Production Pipeline */}
      <section className="vb-tech-section" aria-label="The AI Technology Pipeline">
        <div className="vb-content-container">
          <div className="vb-section-header">
            <div>
              <p className="vb-eyebrow">
                <Cpu className="w-3.5 h-3.5 mr-1.5 text-gold inline" />
                THE TECHNOLOGY & PIPELINE
              </p>
              <h2 className="vb-section-title">
                The Intersection of Live Actors, AI & 100 Languages
              </h2>
            </div>
            <p className="vb-section-subtext">
              How our television production pipeline turns physical studio sets into ancient
              biblical worlds.
            </p>
          </div>

          <div className="vb-pipeline-pillars-grid">
            <div className="vb-pipeline-card">
              <div className="vb-pipeline-icon">
                <Users className="w-6 h-6 text-gold" />
              </div>
              <span className="vb-pipeline-step">PILLAR 01</span>
              <h3 className="vb-pipeline-heading">Real Live Performers</h3>
              <p className="vb-pipeline-text">
                Real actors provide the raw human emotion, subtle facial inflections, and kinetic
                presence. Nothing replaces genuine emotional authenticity and heartfelt delivery on
                set.
              </p>
            </div>

            <div className="vb-pipeline-card">
              <div className="vb-pipeline-icon">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <span className="vb-pipeline-step">PILLAR 02</span>
              <h3 className="vb-pipeline-heading">AI Character Transformation</h3>
              <p className="vb-pipeline-text">
                Neural style and volumetric transformation engines cast performers into historically
                accurate biblical figures, weaving historically vetted woven textiles, ancient
                architecture, and weathered environments.
              </p>
            </div>

            <div className="vb-pipeline-card">
              <div className="vb-pipeline-icon">
                <Globe2 className="w-6 h-6 text-gold" />
              </div>
              <span className="vb-pipeline-step">PILLAR 03</span>
              <h3 className="vb-pipeline-heading">100-Language Translation Goal</h3>
              <p className="vb-pipeline-text">
                Equipped with native-speaker audio recording and localized regional tracks (English,
                Hindi, Tamil, Malayalam, Persian, Tagalog, Chinese, Malay, Yoruba, and beyond) so
                every person hears in their mother tongue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation Gallery Showcase */}
      <section className="vb-transformations-section" aria-label="Character Transformations">
        <div className="vb-content-container">
          <div className="vb-section-header">
            <div>
              <p className="vb-eyebrow">PRODUCTION PORTFOLIO</p>
              <h2 className="vb-section-title">Visual Transformations in Action</h2>
            </div>
            <p className="vb-section-subtext">
              Examine the historical richness achieved through our unified AI production pipeline.
            </p>
          </div>

          <div className="vb-transform-grid">
            {transformations.map((item) => (
              <div key={item.title} className="vb-transform-card">
                <div className="vb-transform-media-wrap">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="vb-transform-img"
                    loading="lazy"
                  />
                  <span className="vb-transform-context-badge">{item.context}</span>
                </div>
                <div className="vb-transform-details">
                  <h3 className="vb-transform-card-title">{item.title}</h3>
                  <p className="vb-transform-card-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branding Assets & Press Kit Section as specified in blueprint */}
      <section className="vb-branding-section" aria-label="Brand Assets & Press Kit">
        <div className="vb-content-container">
          <div className="vb-section-header">
            <div>
              <p className="vb-eyebrow">OFFICIAL ASSETS & REPOSITORY</p>
              <h2 className="vb-section-title">Brand Assets & Identity</h2>
            </div>
            <p className="vb-section-subtext">
              Official logos and brand identifiers for NRIM and the Visual Bible OTT platform.
            </p>
          </div>

          <div className="vb-brand-assets-grid">
            {/* Dark Mode UI Logo */}
            <div className="vb-brand-card is-dark-kit">
              <span className="vb-brand-card-tag">DARK MODE UI LOGO</span>
              <div className="vb-brand-preview-dark">
                <img
                  src="/assets/nrim-logo-white.png"
                  alt="NRIM Dark Mode UI Logo (nrim logo white.png)"
                  className="vb-brand-preview-img"
                />
              </div>
              <div className="vb-brand-card-footer">
                <strong>nrim logo white.png</strong>
                <p>Primary logo utilized for true-dark OTT header, streaming UI, and posters.</p>
                <a
                  href="/assets/nrim-logo-white.png"
                  download="nrim-logo-white.png"
                  className="vb-brand-download-link"
                >
                  <Download className="w-3.5 h-3.5 mr-1 text-gold" /> Download Asset (PNG)
                </a>
              </div>
            </div>

            {/* Light Mode / Press Kit Logo */}
            <div className="vb-brand-card is-light-kit">
              <span className="vb-brand-card-tag text-neutral-800">
                LIGHT MODE / PRESS KIT LOGO
              </span>
              <div className="vb-brand-preview-light">
                <img
                  src="/assets/nrim-logo-blue.png"
                  alt="NRIM Light Mode / Press Kit Logo (nrim logo blue.png)"
                  className="vb-brand-preview-img"
                />
              </div>
              <div className="vb-brand-card-footer">
                <strong className="text-white">nrim logo blue.png</strong>
                <p>
                  High-resolution blue identity asset for printed materials, media packets, and
                  press releases.
                </p>
                <a
                  href="/assets/nrim-logo-blue.png"
                  download="nrim-logo-blue.png"
                  className="vb-brand-download-link"
                >
                  <Download className="w-3.5 h-3.5 mr-1 text-gold" /> Download Asset (PNG)
                </a>
              </div>
            </div>
          </div>

          {/* Organization Verification Bar */}
          <div className="vb-org-verify-bar">
            <div>
              <p className="vb-eyebrow">PARENT ORGANIZATION & GLOBAL INITIATIVE</p>
              <h3 className="vb-verify-title">Nations Reach International Missions (NRIM)</h3>
              <p className="vb-verify-copy">
                NRIM is an international mission organization focused on taking the Gospel to the
                unreached through media, digital networks, and grassroots ministry.
              </p>
            </div>
            <div className="vb-verify-actions">
              <Button asChild className="vb-btn-primary-white">
                <a href="https://nrim.org/" target="_blank" rel="noreferrer">
                  Visit NRIM.org <ArrowUpRight className="w-4 h-4 ml-1.5" />
                </a>
              </Button>
              <Button asChild variant="outline" className="vb-btn-secondary-border">
                <Link to="/explore">
                  Join The Waitlist <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
