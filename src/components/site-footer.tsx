import { Link } from "@tanstack/react-router";
import { Mail, Globe, ExternalLink, Heart, ShieldCheck } from "lucide-react";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative bg-[#050508] text-white border-t border-white/[0.08] overflow-hidden select-none"
      role="contentinfo"
      aria-label="Site Footer"
    >
      {/* Subtle Ambient Glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/4 w-96 h-96 bg-[#A11C28]/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        {/* Main Grid: NRIM Branding, Quick Navigation, and Non-Profit Legal Identity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-white/[0.08]">
          {/* Col 1: Left Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="inline-flex flex-col items-start gap-1 group">
              <img
                src="/assets/nrim-logo-white.png"
                alt="NRIM · Nations Reach International Missions"
                className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <span className="text-[9px] font-black tracking-[0.25em] text-white/90 uppercase mt-1">
                VISUAL BIBLE TV
              </span>
            </Link>

            <h3 className="text-sm font-bold text-white tracking-wide">
              Nations Reach International Missions
            </h3>

            <p className="text-xs text-white/70 italic font-serif leading-relaxed">
              &ldquo;Reaching The Nations Through Media, Mercy And Mission&rdquo;
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-white/60">
              <Mail className="w-3.5 h-3.5 text-[#A11C28]" />
              <a
                href="mailto:admin@nrim.org"
                className="hover:text-white font-mono text-[11px] transition-colors"
              >
                admin@nrim.org
              </a>
            </div>

            <p className="text-[10px] text-white/40 tracking-wider pt-2">
              Association With Noble Purpose Inc., The International Christian Church
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[11px] font-bold tracking-[0.2em] text-white/50 uppercase block">
              Network Platform
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-white/70 hover:text-white transition-colors">
                  Home Premiere
                </Link>
              </li>
              <li>
                <Link to="/watch" className="text-white/70 hover:text-white transition-colors">
                  24/7 Live Broadcast & VOD
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/70 hover:text-white transition-colors">
                  About NRIM & AI Pipeline
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-white/70 hover:text-white transition-colors">
                  Join Waitlist & Languages
                </Link>
              </li>
              <li>
                <a
                  href="https://nrim.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Official NRIM.org</span>
                  <ExternalLink className="w-3 h-3 text-white/40" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Right Non-Profit Regulatory & Tax Column */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-white/60 uppercase">
                501(c)(3) Nonprofit Ministry
              </span>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              Nations Reach International Missions is a registered 501(c)(3) nonprofit organization
              (EIN: 81-3789134).
            </p>

            <p className="text-xs text-white/60 leading-relaxed font-medium">
              Donations are tax-deductible to the fullest extent permitted by law.
            </p>

            <div className="pt-2">
              <a
                href="https://nrim.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#A11C28] hover:bg-[#7F151F] text-white text-xs font-bold tracking-wider uppercase transition-colors shadow-lg shadow-red-950/40"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Support the Mission · Donate</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal Strip */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-white/50">
          <p>© {currentYear} Nations Reach International Missions. All Rights Reserved.</p>

          <div className="flex flex-wrap items-center gap-6">
            <Link to="/about" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/about" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <a
              href="https://nrim.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Donation Disclaimer
            </a>
            <a
              href="https://nrim.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ff4d5e] font-semibold transition-colors"
            >
              Donate
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
