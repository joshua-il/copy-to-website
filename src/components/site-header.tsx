import { Link, useRouterState } from "@tanstack/react-router";
import { Globe, Radio } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { activeLanguages } from "@/lib/language";

export function RegionalSelector({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="vb-regional" aria-label="Regional language selector">
      <span className="vb-regional-label">
        <Globe className="w-3 h-3 text-gold inline mr-1" />
        Regional
      </span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger aria-label="Choose language" className="vb-language-trigger">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-black border border-white/20 text-white rounded-none">
          {activeLanguages.map((lang) => (
            <SelectItem
              key={lang.value}
              value={lang.value}
              className="text-xs hover:bg-white/10 rounded-none cursor-pointer"
            >
              {lang.label}
            </SelectItem>
          ))}
          <SelectItem value="yo" disabled className="text-xs opacity-40 cursor-not-allowed">
            Yoruba · Coming soon
          </SelectItem>
          <SelectItem
            value="regional_soon"
            disabled
            className="text-xs opacity-40 cursor-not-allowed"
          >
            Other Regional · Coming soon
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function SiteHeader({
  language,
  setLanguage,
}: {
  language: string;
  setLanguage: (value: string) => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="vb-header" role="banner">
      <div className="vb-header-inner">
        <Link to="/" className="vb-brand" aria-label="Visual Bible Home">
          <img
            src="/assets/nrim-logo-white.png"
            alt="NRIM — Nations Reach International Missions"
            className="vb-brand-logo"
          />
          <span className="vb-brand-divider" aria-hidden="true" />
          <div className="vb-brand-text">
            <span className="vb-brand-title">VISUAL BIBLE</span>
            <span className="vb-brand-domain">visualbible.tv</span>
          </div>
        </Link>

        <nav className="vb-nav" aria-label="Main navigation">
          <Link to="/" className={`vb-nav-link ${pathname === "/" ? "is-active" : ""}`}>
            Home
          </Link>
          <Link
            to="/explore"
            className={`vb-nav-link ${pathname === "/explore" ? "is-active" : ""}`}
          >
            Explore <span className="vb-nav-badge">Waitlist</span>
          </Link>
          <Link to="/about" className={`vb-nav-link ${pathname === "/about" ? "is-active" : ""}`}>
            About Us
          </Link>
          <Link
            to="/watch"
            className={`vb-nav-link vb-nav-theater ${pathname === "/watch" ? "is-active" : ""}`}
          >
            <Radio className="w-3 h-3 text-red-500 animate-pulse mr-1 inline" />
            VOD Theater
          </Link>
        </nav>

        <RegionalSelector value={language} onValueChange={setLanguage} />
      </div>
    </header>
  );
}
