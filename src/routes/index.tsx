import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Play, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import genesisArt from "@/assets/genesis_pharaoh_prophet.png.asset.json";
import hindiArt from "@/assets/genesis_hindi.png.asset.json";
import inTheBeginningArt from "@/assets/in_the_beginning.png.asset.json";
import judasArt from "@/assets/judas_chosen_by_god.png.asset.json";
import nrimLogo from "@/assets/nrim_logo_white.png.asset.json";
import mosesArt from "@/assets/moses_parting_sea.webp.asset.json";
import yahwehMonumentArt from "@/assets/yahweh_monument.webp.asset.json";
import yahwehTabletsArt from "@/assets/yahweh_tablets.webp.asset.json";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Visual Bible | Until All Hear" },
      {
        name: "description",
        content: "Watch Scripture brought to life through the Visual Bible, a production of NRIM.",
      },
      { property: "og:title", content: "Visual Bible | Until All Hear" },
      {
        property: "og:description",
        content: "Stories from Scripture, brought to life for every language and every nation.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const languages = [
  { label: "English", value: "en" },
  { label: "Hindi", value: "hi" },
  { label: "Tamil", value: "ta" },
  { label: "Malayalam", value: "ml" },
  { label: "Persian", value: "fa" },
  { label: "Tagalog", value: "tl" },
  { label: "Chinese", value: "zh" },
  { label: "Malay", value: "ms" },
];

function RegionalSelector({ value, onValueChange }: { value: string; onValueChange: (value: string) => void }) {
  return (
    <div className="vb-regional">
      <span className="vb-regional-label">Regional</span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger aria-label="Choose language" className="vb-language-trigger">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.value} value={language.value}>
              {language.label}
            </SelectItem>
          ))}
          <SelectItem value="yo" disabled>
            Yoruba · Coming soon
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function SiteHeader({ language, setLanguage }: { language: string; setLanguage: (value: string) => void }) {
  return (
    <header className="vb-header">
      <div className="vb-header-inner">
        <Link to="/" className="vb-brand" aria-label="Visual Bible home">
          <img src={nrimLogo.url} alt="NRIM — Nations Reach International Missions" />
          <span className="vb-brand-divider" aria-hidden="true" />
          <span className="vb-brand-title">VISUAL<br />BIBLE</span>
        </Link>
        <nav className="vb-nav" aria-label="Main navigation">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "vb-nav-link is-active" }} className="vb-nav-link">Home</Link>
          <Link to="/explore" className="vb-nav-link">Explore</Link>
          <Link to="/about" className="vb-nav-link">About us</Link>
        </nav>
        <RegionalSelector value={language} onValueChange={setLanguage} />
      </div>
    </header>
  );
}

type Film = { title: string; subtitle: string; image: string; alt: string; episode: string; tag?: string };

function FilmRail({ title, eyebrow, films }: { title: string; eyebrow?: string; films: Film[] }) {
  return (
    <section className="vb-rail-section">
      <div className="vb-rail-heading">
        <div>
          {eyebrow && <p className="vb-eyebrow">{eyebrow}</p>}
          <h2>{title}</h2>
        </div>
        <ArrowRight className="vb-rail-arrow" aria-hidden="true" />
      </div>
      <div className="vb-film-rail">
        {films.map((film) => (
          <Link
            key={film.title}
            to="/watch"
            search={{ episode: film.episode }}
            className="vb-film-card"
          >
            <div className="vb-film-image-wrap">
              <img src={film.image} alt={film.alt} className="vb-film-image" loading="lazy" />
              {film.tag && <span className="vb-film-tag">{film.tag}</span>}
              <span className="vb-film-play" aria-hidden="true"><Play fill="currentColor" /></span>
            </div>
            <span className="vb-film-title">{film.title}</span>
            <span className="vb-film-subtitle">{film.subtitle}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function HomePage() {
  const [language, setLanguage] = useState("en");
  const [muted, setMuted] = useState(true);
  const languageLabel = languages.find((item) => item.value === language)?.label ?? "English";
  const upcomingFilms: Film[] = [
    { title: "Yahweh", subtitle: "The God Who Reveals His Power", image: yahwehTabletsArt.url, alt: "Moses holding the tablets beneath a storm-lit sky", episode: "exodus", tag: "UNDER PRODUCTION" },
    { title: "Moses at the Sea", subtitle: "The Book of Exodus", image: mosesArt.url, alt: "Moses with the tablets beside the parted sea", episode: "exodus" },
    { title: "The Promise", subtitle: "Coming to Visual Bible", image: yahwehMonumentArt.url, alt: "The word Yahweh above a sea and burning bush", episode: "exodus" },
  ];
  const genesisFilms: Film[] = [
    { title: "In the Beginning", subtitle: "The God Who Fulfills His Promise", image: genesisArt.url, alt: "Pharaoh and a prophet in an ancient Egyptian city", episode: "genesis" },
    { title: "In the Beginning · Hindi", subtitle: "उत्पत्ति — अग्नि और प्रभात", image: hindiArt.url, alt: "A family gathered around a fire at sunrise", episode: "genesis" },
    { title: "A Divine Promise", subtitle: "The complete Genesis archive", image: inTheBeginningArt.url, alt: "In the Beginning: The God Who Fulfills His Promise title artwork", episode: "genesis" },
  ];
  const seriesFilms: Film[] = [
    { title: "In the Beginning (TV)", subtitle: "26 episodes · 26 minutes", image: genesisArt.url, alt: "Genesis series artwork featuring a pharaoh and prophet", episode: "teaser", tag: "SERIES" },
    { title: "Genesis · Official teaser", subtitle: "Watch the series preview", image: judasArt.url, alt: "A biblical-era figure in a desert city", episode: "teaser" },
  ];

  return (
    <main className="vb-shell">
      <SiteHeader language={language} setLanguage={setLanguage} />
      <section className="vb-hero" aria-label="Live Visual Bible broadcast">
        <img className="vb-hero-poster" src={genesisArt.url} alt="Genesis: Pharaoh and Prophet at Sunset" />
        <iframe
          key={`${muted ? "muted" : "sound"}-${language}`}
          className="vb-hero-video"
          src={`https://www.youtube-nocookie.com/embed/z5abtVIszH8?start=2280&autoplay=1&mute=${muted ? 1 : 0}&controls=0&rel=0&modestbranding=1&loop=1&playlist=z5abtVIszH8&cc_load_policy=1&cc_lang_pref=${language}`}
          title="Visual Bible Genesis live broadcast"
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
        <div className="vb-hero-shade" />
        <div className="vb-hero-content">
          <div className="vb-live-label"><span className="vb-live-dot" /> LIVE BROADCAST <span className="vb-live-language">· {languageLabel.toUpperCase()}</span></div>
          <p className="vb-hero-kicker">THE VISUAL BIBLE · GENESIS</p>
          <h1>In the<br />Beginning</h1>
          <p className="vb-hero-description">The God who fulfills His promise. Step into the story that began it all.</p>
          <div className="vb-hero-actions">
            <Button asChild className="vb-button-gold">
              <Link to="/watch" search={{ episode: "genesis" }}><Play fill="currentColor" /> Watch now</Link>
            </Button>
            <Button variant="outline" className="vb-button-quiet" onClick={() => setMuted((current) => !current)}>
              {muted ? <VolumeX /> : <Volume2 />} {muted ? "Unmute" : "Mute"}
            </Button>
          </div>
          <p className="vb-hero-caption">THE STORY OF GENESIS · 50 CHAPTERS</p>
        </div>
        <div className="vb-hero-index" aria-hidden="true"><span>01</span><span className="vb-index-line" /><span>04</span></div>
      </section>

      <section className="vb-schedule" aria-label="Broadcast schedule">
        <div className="vb-schedule-current"><span className="vb-schedule-label">NOW ON AIR</span><strong>Genesis · Chapter 1</strong><span>From 38:00</span></div>
        <span className="vb-schedule-separator" aria-hidden="true" />
        <div className="vb-schedule-next"><span className="vb-schedule-label">UP NEXT</span><strong>In the Beginning · Series teaser</strong><Link to="/watch" search={{ episode: "teaser" }} aria-label="Watch the In the Beginning series teaser"><ArrowRight /></Link></div>
      </section>

      <div className="vb-content">
        <FilmRail title="Upcoming premieres" eyebrow="A STORY OF DELIVERANCE" films={upcomingFilms} />
        <FilmRail title="Visual Bible series" eyebrow="WATCH THE STORY UNFOLD" films={seriesFilms} />
        <FilmRail title="The complete archive" eyebrow="FROM THE FIRST CHAPTER" films={genesisFilms} />
        <section className="vb-feature-strip">
          <img src={judasArt.url} alt="A biblical figure standing in an ancient desert city" loading="lazy" />
          <div className="vb-feature-copy">
            <p className="vb-eyebrow">A SPECIAL FEATURE · FROM THE VISUAL BIBLE: GENESIS</p>
            <h2>Purpose<br />of God</h2>
            <p>The story of Joseph</p>
            <Button asChild variant="outline" className="vb-feature-button"><Link to="/watch" search={{ episode: "genesis" }}>Explore the story <ArrowRight /></Link></Button>
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}

export function SiteFooter() {
  return (
    <footer className="vb-footer">
      <Link to="/" className="vb-footer-brand">VISUAL BIBLE <span>·</span> A PRODUCTION OF NRIM</Link>
      <p>Until all hear. Every language, every nation.</p>
      <a href="https://nrim.org/" target="_blank" rel="noreferrer">NRIM.ORG <ArrowRight /></a>
      <span className="vb-footer-copy">© NRIM</span>
    </footer>
  );
}

export function SitePageHeader({ title, subtitle, language, setLanguage }: { title: string; subtitle: string; language: string; setLanguage: (value: string) => void }) {
  return <><SiteHeader language={language} setLanguage={setLanguage} /><div className="vb-page-heading"><p className="vb-eyebrow">VISUAL BIBLE · A PRODUCTION OF NRIM</p><h1>{title}</h1><p>{subtitle}</p></div></>;
}
