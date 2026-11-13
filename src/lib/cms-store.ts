import { useState, useEffect } from "react";

export interface HeroContent {
  title: string;
  tagline: string;
  subtitle: string;
  synopsis: string;
  heroImage: string;
  videoUrl: string;
  videoDelaySeconds: number;
}

export interface ProductionCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  language: string;
  episode: string;
}

export interface ProjectSlateItem {
  title: string;
  badge: string;
  claim: string;
  image: string;
  alt: string;
}

export interface BroadcastEpisodeItem {
  id: string;
  title: string;
  subtitle: string;
  book: string;
  chapter: string;
  durationSeconds: number;
  durationFormatted: string;
  videoId: string;
  synopsis: string;
  poster: string;
  tag: string;
}

export interface SiteCmsData {
  hero: HeroContent;
  vaultProductions: ProductionCard[];
  upcomingProjects: ProjectSlateItem[];
  broadcastEpisodes: BroadcastEpisodeItem[];
}

export const DEFAULT_CMS_DATA: SiteCmsData = {
  hero: {
    title: "YAHWEH",
    tagline: "An NRIM Theatrical & Streaming Production",
    subtitle: "The God Who Reveals His Power — The Book of Exodus",
    synopsis:
      "Following the monumental completion of Genesis, the visual saga advances to Exodus. Witness the clash of gods, the ten plagues of Egypt, the roaring waters of the Red Sea divided, and the law delivered in fire atop Mount Sinai.",
    heroImage: "/assets/yahweh-hero-mount-sinai.jpg",
    videoUrl:
      "https://www.youtube-nocookie.com/embed/PD9gqRc8VTU?autoplay=1&mute=1&loop=1&playlist=PD9gqRc8VTU&controls=0&showinfo=0&rel=0&playsinline=1&enablejsapi=1&modestbranding=1&start=60",
    videoDelaySeconds: 2.5,
  },
  vaultProductions: [
    {
      id: "genesis-main",
      title: "In the Beginning",
      subtitle: "The Book of Genesis · 50 Chapters",
      image: "/assets/genesis-shepherds-poster.jpg",
      badge: "Complete Series",
      language: "English",
      episode: "genesis",
    },
    {
      id: "joseph-feature",
      title: "The Purpose of God",
      subtitle: "The Story of Joseph · Betrayed by Brothers",
      image: "/assets/purpose-of-god-joseph-poster.jpg",
      badge: "Special Presentation",
      language: "English / Global",
      episode: "joseph",
    },
    {
      id: "genesis-hindi",
      title: "उत्पत्ति (Genesis)",
      subtitle: "Hindi Edition · Full Audio & Subtitles",
      image: "/assets/genesis-hindi-campfire-poster.jpg",
      badge: "Hindi Audio",
      language: "Hindi",
      episode: "genesis",
    },
    {
      id: "genesis-tamil",
      title: "ஆதியாகமம் (Genesis)",
      subtitle: "Tamil Edition · Complete Season",
      image: "/assets/genesis-tamil-poster.jpg",
      badge: "Tamil Audio",
      language: "Tamil",
      episode: "genesis",
    },
    {
      id: "genesis-malayalam",
      title: "ഉദ്ഭവം (Genesis)",
      subtitle: "Malayalam Edition · Complete Season",
      image: "/assets/genesis-malayalam-poster.jpg",
      badge: "Malayalam",
      language: "Malayalam",
      episode: "genesis",
    },
    {
      id: "genesis-persian",
      title: "پیدایش (Genesis)",
      subtitle: "Persian Edition · Judah & Joseph",
      image: "/assets/judas-chosen-by-god-persian.jpg",
      badge: "Farsi / Persian",
      language: "Persian",
      episode: "judah",
    },
    {
      id: "genesis-chinese",
      title: "创世记 (Genesis)",
      subtitle: "Mandarin Edition · Patriarch Chronicles",
      image: "/assets/genesis-pharaoh-prophet-sunset.jpg",
      badge: "Mandarin Audio",
      language: "Chinese",
      episode: "genesis",
    },
  ],
  upcomingProjects: [
    {
      title: "YAHWEH — The Book of Exodus",
      badge: "01 · EXODUS",
      claim:
        "The God Who Reveals His Power. The ten plagues of Egypt, the roaring waters of the Red Sea divided, the pillar of cloud and fire, and the giving of the Law atop Mount Sinai.",
      image: "/assets/yahweh-hero-parted-sea.jpg",
      alt: "YAHWEH The Book of Exodus",
    },
    {
      title: "In the Beginning — The Book of Genesis",
      badge: "02 · GENESIS",
      claim:
        "The God Who Fulfills His Promise. The complete 50-chapter foundational saga from Creation and the Garden of Eden to Abraham, Isaac, Jacob, and the patriarchs.",
      image: "/assets/genesis-shepherds-poster.jpg",
      alt: "In the Beginning Genesis",
    },
    {
      title: "Visual Bible TV Series",
      badge: "03 · SERIES",
      claim:
        "An episodic television broadcast network delivering chapter-by-chapter dramatizations with 4K HDR cinematography, spatial audio, and cinematic scoring.",
      image: "/assets/in-the-beginning-banner.png",
      alt: "Visual Bible TV Series",
    },
    {
      title: "The Purpose of God — The Story of Joseph",
      badge: "04 · JOSEPH",
      claim:
        "Betrayed by his brothers, sold into Egyptian bondage, and exalted to the throne. A masterclass in divine sovereignty, forgiveness, and salvation.",
      image: "/assets/purpose-of-god-joseph-poster.jpg",
      alt: "The Purpose of God Joseph",
    },
    {
      title: "100 Languages Global Initiative",
      badge: "05 · GLOBAL",
      claim:
        "Reaching unreached regional dialects and oral mother tongues without written scripture. Overcoming illiteracy so every nation hears the Word in their heart tongue.",
      image: "/assets/genesis-hindi-campfire-poster.jpg",
      alt: "100 Languages Global Initiative",
    },
  ],
  broadcastEpisodes: [
    {
      id: "genesis-37-joseph-betrayed-by-brothers",
      title: "Genesis 37 · Betrayed by Brothers, Destined for the Throne",
      subtitle: "The Coat of Many Colors & The Pit of Dothan",
      book: "Book of Genesis",
      chapter: "Chapter 37",
      durationSeconds: 1143,
      durationFormatted: "19m 03s",
      videoId: "z5abtVIszH8",
      synopsis:
        "Sold into slavery by his own brothers for twenty shekels of silver. Elevated through prison to ruler of Pharaoh's palace. Joseph tests his brothers' hearts when famine strikes Canaan to witness their true repentance.",
      poster: "/assets/genesis-shepherds-poster.jpg",
      tag: "SIGNATURE EPISODE",
    },
    {
      id: "genesis-45-sold-brother-only-hope",
      title: "Genesis 45 · The Brother They Sold Was Now Their Only Hope",
      subtitle: "Reconciliation, Brokenness & Divine Providence",
      book: "Book of Genesis",
      chapter: "Chapter 45",
      durationSeconds: 428,
      durationFormatted: "7m 08s",
      videoId: "oZXdI34N3Ik",
      synopsis:
        "Joseph weeps aloud so loudly that the house of Pharaoh hears: 'I am Joseph! Does my father still live?' The definitive revelation that what brothers plotted for evil, God sovereignly purposed to save many lives.",
      poster: "/assets/genesis-pharaoh-prophet-sunset.jpg",
      tag: "KEY REVELATION",
    },
    {
      id: "genesis-42-faith-through-the-fire",
      title: "Genesis 42 · Faith Through the Fire",
      subtitle: "Facing Adversity and the Testing of Conscience",
      book: "Book of Genesis",
      chapter: "Chapter 42",
      durationSeconds: 253,
      durationFormatted: "4m 13s",
      videoId: "xzdzeamlGjU",
      synopsis:
        "Famine tightens its grip across Canaan. Ten brothers travel down to Egypt to buy grain, unaware they are bowing before their long-lost sibling, awakening memories of guilt and the inexorable call of conscience.",
      poster: "/assets/genesis-warriors-fire.jpg",
      tag: "SCRIPTURE STUDY",
    },
    {
      id: "easter-special-crucified-christ",
      title: "Easter Theatrical Special · Who Crucified Christ?",
      subtitle: "The Prophetic Arc from the Passover Lamb to Calvary",
      book: "The Passion & Prophecy",
      chapter: "Special Theatrical Feature",
      durationSeconds: 279,
      durationFormatted: "4m 39s",
      videoId: "BZkNTze00VA",
      synopsis:
        "An exploration connecting the shadows of Exodus and the sacrifice of Isaac to the Cross. High-definition dramatic re-enactment of the judgment hall of Pilate and the road to Golgotha.",
      poster: "/assets/yahweh-tablets-poster.jpg",
      tag: "THEATRICAL SPECIAL",
    },
  ],
};

const CMS_STORAGE_KEY = "vb_cms_data";

export function getStoredCmsData(): SiteCmsData {
  if (typeof window === "undefined") return DEFAULT_CMS_DATA;
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) return DEFAULT_CMS_DATA;
    const parsed = JSON.parse(raw);
    return {
      hero: { ...DEFAULT_CMS_DATA.hero, ...(parsed.hero || {}) },
      vaultProductions: parsed.vaultProductions || DEFAULT_CMS_DATA.vaultProductions,
      upcomingProjects: parsed.upcomingProjects || DEFAULT_CMS_DATA.upcomingProjects,
      broadcastEpisodes: parsed.broadcastEpisodes || DEFAULT_CMS_DATA.broadcastEpisodes,
    };
  } catch {
    return DEFAULT_CMS_DATA;
  }
}

export function useCmsContent() {
  const [data, setData] = useState<SiteCmsData>(getStoredCmsData);

  useEffect(() => {
    const handleSync = () => {
      setData(getStoredCmsData());
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("vb_cms_data_change", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("vb_cms_data_change", handleSync);
    };
  }, []);

  const saveCmsData = (newData: SiteCmsData) => {
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(newData));
    setData(newData);
    window.dispatchEvent(new Event("vb_cms_data_change"));
  };

  const updateHero = (updates: Partial<HeroContent>) => {
    const next = { ...data, hero: { ...data.hero, ...updates } };
    saveCmsData(next);
  };

  const updateVaultProductions = (productions: ProductionCard[]) => {
    const next = { ...data, vaultProductions: productions };
    saveCmsData(next);
  };

  const updateUpcomingProjects = (projects: ProjectSlateItem[]) => {
    const next = { ...data, upcomingProjects: projects };
    saveCmsData(next);
  };

  const updateBroadcastEpisodes = (episodes: BroadcastEpisodeItem[]) => {
    const next = { ...data, broadcastEpisodes: episodes };
    saveCmsData(next);
  };

  const resetToDefaults = () => {
    localStorage.removeItem(CMS_STORAGE_KEY);
    setData(DEFAULT_CMS_DATA);
    window.dispatchEvent(new Event("vb_cms_data_change"));
  };

  return {
    cmsData: data,
    updateHero,
    updateVaultProductions,
    updateUpcomingProjects,
    updateBroadcastEpisodes,
    resetToDefaults,
  };
}
