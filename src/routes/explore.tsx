import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useServerFn } from "@tanstack/react-start";
import { joinWaitlist } from "@/lib/waitlist.functions";
import { SiteFooter, SitePageHeader } from ".";
import yahwehMonumentArt from "@/assets/yahweh_monument.webp.asset.json";
import yahwehTabletsArt from "@/assets/yahweh_tablets.webp.asset.json";

export const Route = createFileRoute("/explore")({
  component: ExplorePage,
  head: () => ({
    meta: [
      { title: "Explore & Join the Waitlist | Visual Bible" },
      { name: "description", content: "Get premiere access to Yahweh, the upcoming Visual Bible story from Exodus." },
      { property: "og:title", content: "Join the Visual Bible Waitlist" },
      { property: "og:description", content: "Be first to watch Yahweh: The God Who Reveals His Power." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/explore" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ExplorePage() {
  const join = useServerFn(joinWaitlist);
  const [language, setLanguage] = useState("en");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ kind: "idle" | "sending" | "success" | "error"; message: string }>({ kind: "idle", message: "" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ kind: "sending", message: "" });
    try {
      const result = await join({ data: { email } });
      if (result.ok) {
        setEmail("");
        setState({ kind: "success", message: result.alreadyJoined ? "You're already on the list. We'll be in touch." : "You're on the list. We'll be in touch." });
      } else {
        setState({ kind: "error", message: result.message });
      }
    } catch {
      setState({ kind: "error", message: "Please enter a valid email address and try again." });
    }
  }

  return (
    <main className="vb-shell">
      <SitePageHeader title="Stories that reach every nation." subtitle="Discover the Visual Bible, a production of NRIM." language={language} setLanguage={setLanguage} />
      <section className="vb-waitlist-feature">
        <img className="vb-waitlist-backdrop" src={yahwehMonumentArt.url} alt="Yahweh: The God Who Reveals His Power" />
        <div className="vb-waitlist-shade" />
        <div className="vb-waitlist-layout">
          <div className="vb-waitlist-copy">
            <p className="vb-eyebrow"><Clapperboard /> THE BOOK OF EXODUS · UNDER PRODUCTION</p>
            <h2>Yahweh</h2>
            <p className="vb-waitlist-subtitle">The God Who Reveals His Power</p>
            <p className="vb-waitlist-description">A story of deliverance, courage, and the power of God — brought to life for a new generation.</p>
            <div className="vb-waitlist-status"><span className="vb-status-line" /> PREMIERE ACCESS</div>
          </div>
          <form className="vb-waitlist-form" onSubmit={handleSubmit}>
            <span className="vb-waitlist-step">01 <span>/</span> 02</span>
            <p className="vb-eyebrow">THE NEXT STORY IS ALMOST HERE</p>
            <h3>Be there<br />from the beginning.</h3>
            <p>Join the waitlist for exclusive premiere access.</p>
            <label htmlFor="waitlist-email">Email address</label>
            <div className="vb-email-row">
              <Input id="waitlist-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={254} required disabled={state.kind === "sending"} />
              <Button type="submit" className="vb-button-gold" disabled={state.kind === "sending"} aria-label="Join waitlist">
                {state.kind === "success" ? <Check /> : <ArrowRight />}
              </Button>
            </div>
            <p className={`vb-form-message ${state.kind}`} role="status" aria-live="polite">{state.message || ""}</p>
            <span className="vb-form-privacy">One message when it’s ready. No noise.</span>
          </form>
        </div>
      </section>
      <section className="vb-impact" aria-label="Our reach">
        <div><strong>1M+</strong><span>VIEWS</span></div>
        <span className="vb-impact-rule" />
        <div><strong>88</strong><span>COUNTRIES</span></div>
        <span className="vb-impact-rule" />
        <div className="vb-impact-message"><strong>100 languages</strong><span>REACHING THE NATIONS</span></div>
      </section>
      <section className="vb-premiere-tease">
        <div className="vb-premiere-art"><img src={yahwehTabletsArt.url} alt="Moses holding the tablets in Yahweh: The God Who Reveals His Power" loading="lazy" /></div>
        <div><p className="vb-eyebrow">THE NEXT CHAPTER</p><h2>Faith. Freedom.<br />The power to deliver.</h2><p>Experience the Book of Exodus as never before.</p></div>
      </section>
      <SiteFooter />
    </main>
  );
}