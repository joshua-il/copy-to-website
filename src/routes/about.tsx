import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Globe2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter, SitePageHeader } from ".";
import mosesArt from "@/assets/moses_parting_sea.webp.asset.json";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "Our Mission | Visual Bible by NRIM" },
      { name: "description", content: "Meet the mission behind Visual Bible: bringing Scripture to life for every language and every nation." },
      { property: "og:title", content: "Our Mission | Visual Bible" },
      { property: "og:description", content: "Until all hear. Every language, every nation." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function AboutPage() {
  const [language, setLanguage] = useState("en");
  return (
    <main className="vb-shell">
      <SitePageHeader title="Until all hear." subtitle="Every language. Every nation. A production of NRIM." language={language} setLanguage={setLanguage} />
      <section className="vb-about-image">
        <img src={mosesArt.url} alt="Moses holding the tablets beside the parted sea" />
        <div className="vb-about-image-caption"><span>THE WORD, MADE VISIBLE</span><span>VISUAL BIBLE · NRIM</span></div>
      </section>
      <section className="vb-mission-grid">
        <div className="vb-mission-intro">
          <p className="vb-eyebrow">THE VISION</p>
          <h2>Scripture deserves<br />to be seen.</h2>
        </div>
        <div className="vb-mission-copy">
          <p>Visual Bible brings the Bible to life through an AI production pipeline — using real people and transforming them into characters from the Bible.</p>
          <p>Our vision is to make these stories vivid, compelling, and accessible to people everywhere, so that every nation can encounter the words that have shaped generations.</p>
        </div>
      </section>
      <section className="vb-production-band">
        <div className="vb-production-heading"><p className="vb-eyebrow">THE PRODUCTION</p><h2>People. Story.<br />Technology.</h2></div>
        <div className="vb-production-pillars">
          <article><Sparkles /><h3>Real people</h3><p>Live actors become the faces and voices of Biblical stories through an AI-assisted production process.</p></article>
          <article><Globe2 /><h3>Every language</h3><p>Stories are prepared for translation, with a vision to reach audiences in 100 languages.</p></article>
        </div>
      </section>
      <section className="vb-about-cta"><p className="vb-eyebrow">A STORY FOR THE WHOLE WORLD</p><h2>Come see what’s<br />being written.</h2><Button asChild className="vb-button-gold"><Link to="/explore">Join the waitlist <ArrowRight /></Link></Button></section>
      <SiteFooter />
    </main>
  );
}