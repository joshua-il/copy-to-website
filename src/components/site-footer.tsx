import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Globe, ExternalLink } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="vb-footer" role="contentinfo">
      <div className="vb-footer-inner">
        <div className="vb-footer-top">
          <div className="vb-footer-brand-block">
            <Link to="/" className="vb-footer-brand">
              <span className="vb-footer-title">VISUAL BIBLE</span>
              <span className="vb-footer-sep">·</span>
              <span className="vb-footer-sub">A PRODUCTION OF NRIM</span>
            </Link>
            <p className="vb-footer-tagline">
              Until all hear: Every language, every nation. Bringing the Scripture to life through
              an AI-powered visual production pipeline.
            </p>
            <span className="vb-footer-domain">visualbible.tv</span>
          </div>

          <div className="vb-footer-links-grid">
            <div className="vb-footer-col">
              <h4>Platform</h4>
              <ul>
                <li>
                  <Link to="/">Home Broadcast</Link>
                </li>
                <li>
                  <Link to="/explore">Explore & Waitlist</Link>
                </li>
                <li>
                  <Link to="/watch">VOD Theater</Link>
                </li>
                <li>
                  <Link to="/about">About & Pipeline</Link>
                </li>
              </ul>
            </div>

            <div className="vb-footer-col">
              <h4>Network & Mission</h4>
              <ul>
                <li>
                  <a
                    href="https://nrim.org/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1"
                  >
                    <span>NRIM.org</span> <ArrowUpRight className="w-3 h-3 text-gold" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@nrim"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1"
                  >
                    <span>YouTube Channel</span>{" "}
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </a>
                </li>
                <li>
                  <Link to="/about">Press Kit & Logos</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="vb-footer-bottom">
          <p>
            © {new Date().getFullYear()} Nations Reach International Missions (NRIM). All rights
            reserved.
          </p>
          <div className="vb-footer-bottom-links">
            <a href="https://nrim.org/" target="_blank" rel="noreferrer">
              <Globe className="w-3 h-3 inline mr-1 text-gold" />
              Nations Reach International Missions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
