import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Captions, Play, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiteFooter } from ".";
import genesisArt from "@/assets/genesis_pharaoh_prophet.png.asset.json";

const episodeOptions = [
  { value: "genesis", title: "Genesis · Chapter 1", videoId: "z5abtVIszH8", start: 2280, runtime: "Live broadcast" },
  { value: "teaser", title: "In the Beginning · Series teaser", videoId: "PD9gqRc8VTU", start: 0, runtime: "Official teaser" },
];
const languageOptions = ["English", "Hindi", "Tamil", "Malayalam", "Persian", "Tagalog", "Chinese", "Malay"];

export const Route = createFileRoute("/watch")({
  validateSearch: (search: Record<string, unknown>) => ({
    episode: typeof search.episode === "string" ? search.episode : "genesis",
  }),
  component: WatchPage,
  head: () => ({
    meta: [
      { title: "Watch Visual Bible | The VOD Theater" },
      { name: "description", content: "Watch stories from the Visual Bible, a production of NRIM." },
      { property: "og:title", content: "Watch Visual Bible" },
      { property: "og:description", content: "Stories from Scripture, brought to life." },
      { property: "og:type", content: "video.other" },
      { property: "og:url", content: "/watch" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function WatchPage() {
  const { episode } = Route.useSearch();
  const [language, setLanguage] = useState("English");
  const selectedEpisode = episodeOptions.find((item) => item.value === episode) ?? episodeOptions[0];
  const captionLanguage = ({ English: "en", Hindi: "hi", Tamil: "ta", Malayalam: "ml", Persian: "fa", Tagalog: "tl", Chinese: "zh", Malay: "ms" } as Record<string, string>)[language] ?? "en";

  return (
    <main className="vb-shell">
      <header className="vb-header">
        <div className="vb-header-inner">
          <Link to="/" className="vb-back-link"><ArrowLeft /> <span>VISUAL BIBLE</span></Link>
          <Link to="/explore" className="vb-watch-nav-link">Explore the stories <ArrowRight /></Link>
        </div>
      </header>
      <section className="vb-theater">
        <div className="vb-theater-main">
          <div className="vb-player-frame">
            <img src={genesisArt.url} alt="Genesis: Pharaoh and Prophet at Sunset" className="vb-player-poster" />
            <iframe
              key={`${selectedEpisode.value}-${captionLanguage}`}
              src={`https://www.youtube-nocookie.com/embed/${selectedEpisode.videoId}?start=${selectedEpisode.start}&autoplay=1&rel=0&modestbranding=1&cc_load_policy=1&cc_lang_pref=${captionLanguage}`}
              title={selectedEpisode.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="vb-player-info">
            <div>
              <p className="vb-eyebrow"><Radio /> VISUAL BIBLE · GENESIS</p>
              <h1>{selectedEpisode.title}</h1>
              <p className="vb-player-runtime">{selectedEpisode.runtime} <span>·</span> A production of NRIM</p>
            </div>
            <div className="vb-track-control">
              <label htmlFor="track-select"><Captions /> Regional track</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="track-select" aria-label="Choose audio and caption language"><SelectValue /></SelectTrigger>
                <SelectContent>{languageOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <aside className="vb-theater-queue" aria-label="More Visual Bible episodes">
          <p className="vb-eyebrow">CONTINUE WATCHING</p>
          <h2>From Genesis</h2>
          {episodeOptions.map((item, index) => (
            <Link key={item.value} to="/watch" search={{ episode: item.value }} className={`vb-queue-item ${item.value === selectedEpisode.value ? "is-current" : ""}`}>
              <div className="vb-queue-art"><img src={genesisArt.url} alt="" loading="lazy" /><span>{item.value === selectedEpisode.value ? <Radio /> : <Play fill="currentColor" />}</span></div>
              <div><span className="vb-queue-number">{index === 0 ? "NOW PLAYING" : "SERIES PREVIEW"}</span><strong>{item.title}</strong><span className="vb-queue-runtime">{item.runtime}</span></div>
            </Link>
          ))}
          <Button asChild variant="outline" className="vb-archive-link"><Link to="/">Browse all stories <ArrowRight /></Link></Button>
        </aside>
      </section>
      <SiteFooter />
    </main>
  );
}