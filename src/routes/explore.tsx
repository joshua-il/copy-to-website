import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clapperboard, Globe2, Sparkles, Film, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useServerFn } from "@tanstack/react-start";
import { joinWaitlist } from "@/lib/waitlist.functions";
import { GlobalSidebar } from "@/components/global-sidebar";
import { useGlobalLanguage } from "@/lib/language";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/explore")({
  component: ExploreWaitlistPage,
  head: () => ({
    meta: [
      { title: "Waitlist & Premiere Access | Visual Bible — YAHWEH" },
      {
        name: "description",
        content:
          "Join the waitlist for exclusive premiere access to YAHWEH, The God who Reveals His Power — The Book of Exodus. A production of NRIM.",
      },
      { property: "og:title", content: "YAHWEH: The Book of Exodus | Visual Bible Waitlist" },
      {
        property: "og:description",
        content:
          "Join the waitlist for exclusive premiere access. Streaming across 88 countries in 100 languages.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/explore" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ExploreWaitlistPage() {
  const join = useServerFn(joinWaitlist);
  const [language, setLanguage] = useGlobalLanguage();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{
    kind: "idle" | "sending" | "success" | "error";
    message: string;
  }>({ kind: "idle", message: "" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || state.kind === "sending") return;

    setState({ kind: "sending", message: "" });
    try {
      const result = await join({ data: { email } });
      if (result.ok) {
        setEmail("");
        setState({
          kind: "success",
          message: result.alreadyJoined
            ? "You're already on the exclusive list. We will send you premiere invitations as soon as screening links unlock."
            : "You're on the list! Watch your inbox for exclusive premiere access.",
        });
      } else {
        setState({ kind: "error", message: result.message });
      }
    } catch {
      setState({
        kind: "error",
        message: "Please enter a valid email address and try again.",
      });
    }
  }

  const upcomingPosters = [
    {
      title: "YAHWEH",
      subtitle: "The God who Reveals His Power — The Book of Exodus",
      credit: "A Fusion Edge Media Film",
      image: "/assets/yahweh-exodus-staff-poster.jpg",
      tag: "THE BOOK OF EXODUS",
    },
    {
      title: "YAHWEH: IN THEATRES WORLDWIDE",
      subtitle: "A Prossiga Media Film",
      credit: "Worldwide Theatrical Release",
      image: "/assets/yahweh-tablets-poster.jpg",
      tag: "UNDER PRODUCTION",
    },
    {
      title: "MOSES AT THE SEA",
      subtitle: "The Parting of the Waters",
      credit: "Visual Bible Cinematic Epic",
      image: "/assets/moses-parting-sea.jpg",
      tag: "AI PRODUCTION PIPELINE",
    },
    {
      title: "THE MONUMENT OF YAHWEH",
      subtitle: "The Eternal Covenant",
      credit: "Key Visual Artwork",
      image: "/assets/yahweh-monument.jpg",
      tag: "COMING 2026",
    },
  ];

  return (
    <main className="vb-shell vb-landing-page">
      <GlobalSidebar />

      <div className="pl-0 md:pl-18 lg:pl-20 min-h-screen">
        {/* Hero Full-viewport Looping Video Background with 60-70% Dark Gradient Overlay */}
        <section className="vb-landing-hero" aria-label="Waitlist and Premiere Hype Funnel">
          {/* Looping Cinematic Video */}
          <div className="vb-landing-video-container" aria-hidden="true">
            <img
              src="/assets/yahweh-monument.jpg"
              alt="Yahweh Monument Cinematic Backdrop"
              className="vb-landing-video-fallback"
            />
            <iframe
              className="vb-landing-bg-video"
              src="https://www.youtube-nocookie.com/embed/PD9gqRc8VTU?autoplay=1&mute=1&controls=0&loop=1&playlist=PD9gqRc8VTU&playsinline=1&rel=0&modestbranding=1&enablejsapi=1"
              title="Visual Bible Cinematic Loop"
              allow="autoplay; encrypted-media"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          {/* 60-70% Dark Gradient Overlay */}
          <div className="vb-landing-overlay" />

          {/* Center Focus: Frosted-glass, sharp-cornered modal box */}
          <div className="vb-landing-modal-wrapper">
            <div className="vb-waitlist-modal">
              <div className="vb-modal-header">
                <span className="vb-modal-badge">
                  <Clapperboard className="w-3.5 h-3.5 inline mr-1 text-gold" />
                  UNDER PRODUCTION
                </span>
                <span className="vb-modal-step">EXODUS · CHAPTER 1–15</span>
              </div>

              <div className="vb-modal-content">
                <h1 className="vb-modal-title">
                  YAHWEH
                  <span className="vb-modal-subheading">
                    The God who Reveals His Power — The Book of Exodus
                  </span>
                </h1>

                <p className="vb-modal-copy">Join the waitlist for exclusive premiere access.</p>

                <form className="vb-modal-form" onSubmit={handleSubmit}>
                  <div className="vb-modal-input-group">
                    <Input
                      id="waitlist-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={254}
                      required
                      disabled={state.kind === "sending"}
                      className="vb-modal-input"
                    />
                    <Button
                      type="submit"
                      disabled={state.kind === "sending"}
                      className="vb-modal-submit"
                    >
                      {state.kind === "sending" ? (
                        "Joining..."
                      ) : state.kind === "success" ? (
                        <>
                          <Check className="w-4 h-4 mr-1 text-emerald-500" /> Joined
                        </>
                      ) : (
                        <>
                          Get Early Access <ArrowRight className="w-4 h-4 ml-1.5" />
                        </>
                      )}
                    </Button>
                  </div>

                  {state.message && (
                    <p
                      className={`vb-form-feedback ${
                        state.kind === "error" ? "is-error" : "is-success"
                      }`}
                      role="status"
                      aria-live="polite"
                    >
                      {state.message}
                    </p>
                  )}

                  <p className="vb-modal-security-note">
                    Public waitlist signups are securely encrypted. Zero spam. Notification sent
                    exclusively upon premiere release.
                  </p>
                </form>
              </div>

              <div className="vb-modal-footer">
                <div className="vb-modal-stat-pill">
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span>Global Premiere Q3 2026</span>
                </div>
                <div className="vb-modal-stat-pill">
                  <Globe2 className="w-3 h-3 text-white" />
                  <span>Multi-Audio Track Release</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof / Mission Banner (Bottom Fixed/Anchored) */}
          <div className="vb-mission-banner" role="region" aria-label="Global Impact Metrics">
            <div className="vb-mission-banner-inner">
              <div className="vb-banner-metric">
                <span className="vb-metric-number">1 Million+</span>
                <span className="vb-metric-label">Views</span>
              </div>
              <div className="vb-metric-divider" />
              <div className="vb-banner-metric">
                <span className="vb-metric-number">Streaming in 88</span>
                <span className="vb-metric-label">Countries</span>
              </div>
              <div className="vb-metric-divider" />
              <div className="vb-banner-metric">
                <span className="vb-metric-number">Reaching the Nations in</span>
                <span className="vb-metric-label">100 Languages</span>
              </div>
              <div className="vb-metric-cta">
                <Link to="/watch" className="vb-banner-watch-link">
                  <Play className="w-3.5 h-3.5 inline mr-1 fill-current" />
                  Stream Current Broadcast
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Production Gallery & Film Teaser Section */}
        <section className="vb-landing-gallery" aria-label="Upcoming Production Gallery">
          <div className="vb-content-container">
            <div className="vb-section-header">
              <div>
                <p className="vb-eyebrow">
                  <Film className="w-3.5 h-3.5 mr-1.5 text-gold inline" />
                  EXCLUSIVE PREVIEW · THE BOOK OF EXODUS
                </p>
                <h2 className="vb-section-title">From Script to Screen: The AI Pipeline</h2>
              </div>
              <p className="vb-section-subtext">
                Transforming live actors with cinematic precision into the foundational historical
                figures of Scripture.
              </p>
            </div>

            <div className="vb-poster-grid">
              {upcomingPosters.map((item) => (
                <div key={item.title} className="vb-poster-card">
                  <div className="vb-poster-image-wrap">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="vb-poster-image"
                      loading="lazy"
                    />
                    <span className="vb-poster-tag">{item.tag}</span>
                  </div>
                  <div className="vb-poster-info">
                    <h3 className="vb-poster-title">{item.title}</h3>
                    <p className="vb-poster-subtitle">{item.subtitle}</p>
                    <span className="vb-poster-credit">{item.credit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Banner Spotlight */}
            <div className="vb-spotlight-banner">
              <div className="vb-spotlight-content">
                <p className="vb-eyebrow">A PRODUCTION OF NRIM</p>
                <h3 className="vb-spotlight-title">“Until All Hear”</h3>
                <p className="vb-spotlight-text">
                  The Visual Bible is committed to breaking language barriers so that every
                  soul—regardless of literacy or geographic isolation—can see and hear the Word of
                  God in their mother tongue.
                </p>
                <div className="vb-spotlight-actions">
                  <Button asChild className="vb-button-gold">
                    <a href="#waitlist-email">Join the Premiere Waitlist</a>
                  </Button>
                  <Button asChild variant="outline" className="vb-button-quiet">
                    <Link to="/about">Explore Production Pipeline</Link>
                  </Button>
                </div>
              </div>
              <div className="vb-spotlight-visual">
                <img
                  src="/assets/in-the-beginning-banner.png"
                  alt="In The Beginning: The God who fulfills His promise"
                  className="vb-spotlight-img"
                />
              </div>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
