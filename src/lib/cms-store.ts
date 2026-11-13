import { useState, useEffect } from "react";
import { saveCmsContent, fetchCmsContent } from "./cms.functions";

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
  language?: string;
}

export interface ArchiveGridItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  episode: string;
  linkUrl?: string;
}

export interface SiteCmsData {
  hero: HeroContent;
  vaultProductions: ProductionCard[];
  upcomingProjects: ProjectSlateItem[];
  broadcastEpisodes: BroadcastEpisodeItem[];
  archiveItems: ArchiveGridItem[];
}

export const DEFAULT_BROADCAST_EPISODES: BroadcastEpisodeItem[] = [
  {
    id: "genesis-46-50",
    title: "The Journey to Egypt, The Final Blessing & The Beginning of a Nation",
    subtitle: "Genesis 46–50 · The Climactic Patriarchal Finale",
    book: "Book of Genesis",
    chapter: "Chapters 46–50",
    durationSeconds: 2459, // 40m 59s
    durationFormatted: "40m 59s",
    videoId: "z5abtVIszH8",
    synopsis:
      "Jacob hears God's voice in night visions: 'Fear not to go down to Egypt.' Reunited with Joseph, Jacob blesses Pharaoh and delivers the prophetic destiny of the twelve tribes of Israel before resting with his fathers.",
    poster: "/assets/genesis-shepherds-poster.jpg",
    tag: "FEATURE BROADCAST",
    language: "English",
  },
  {
    id: "genesis-37-44-joseph",
    title: "Betrayal, Testing & Forgiveness · The Story of Joseph",
    subtitle: "The Sovereign Purpose of God in Egyptian Captivity",
    book: "Book of Genesis",
    chapter: "Chapters 37–44",
    durationSeconds: 1143, // 19m 03s
    durationFormatted: "19m 03s",
    videoId: "kutfZZlzDWA",
    synopsis:
      "Sold into slavery by his own brothers for twenty shekels of silver. Elevated through prison to ruler of Pharaoh's palace. Joseph tests his brothers' hearts when famine strikes Canaan to witness their true repentance.",
    poster: "/assets/purpose-of-god-joseph-poster.jpg",
    tag: "SIGNATURE EPISODE",
    language: "English",
  },
  {
    id: "genesis-30-32-dreamer",
    title: "The Story of Joseph — Genesis 30, 31 & 32",
    subtitle: "The Origins of the Covenant Dreamer & Jacob at Peniel",
    book: "Book of Genesis",
    chapter: "Chapters 30–32",
    durationSeconds: 1247, // 20m 47s
    durationFormatted: "20m 47s",
    videoId: "BZkNTze00VA",
    synopsis:
      "Witness Rachel giving birth to Joseph, Jacob prospering through divine favor despite Laban's deception, the dramatic flight to Gilead, and Jacob wrestling with the angel of God until daybreak at Peniel.",
    poster: "/assets/genesis-poster.jpg",
    tag: "PATRIARCHAL SAGA",
    language: "English",
  },
  {
    id: "genesis-45-reconciliation",
    title: "Genesis 45 · The Brother They Sold Was Now Their Only Hope",
    subtitle: "Reconciliation, Brokenness & Divine Providence",
    book: "Book of Genesis",
    chapter: "Chapter 45",
    durationSeconds: 428, // 7m 08s
    durationFormatted: "7m 08s",
    videoId: "oZXdI34N3Ik",
    synopsis:
      "Joseph weeps aloud so loudly that the house of Pharaoh hears: 'I am Joseph! Does my father still live?' The definitive revelation that what brothers plotted for evil, God sovereignly purposed to save many lives.",
    poster: "/assets/genesis-pharaoh-prophet-sunset.jpg",
    tag: "KEY REVELATION",
    language: "English",
  },
  {
    id: "genesis-42-fire",
    title: "Genesis 42 · Faith Through the Fire",
    subtitle: "Facing Adversity and the Testing of Conscience",
    book: "Book of Genesis",
    chapter: "Chapter 42",
    durationSeconds: 253, // 4m 13s
    durationFormatted: "4m 13s",
    videoId: "xzdzeamlGjU",
    synopsis:
      "Famine tightens its grip across Canaan. Ten brothers travel down to Egypt to buy grain, unaware they are bowing before their long-lost sibling, awakening memories of guilt and the inexorable call of conscience.",
    poster: "/assets/genesis-warriors-fire.jpg",
    tag: "SCRIPTURE STUDY",
    language: "English / Hindi",
  },
  {
    id: "yahweh-exodus-theatrical",
    title: "YAHWEH & The Passover · Prophecy of the Lamb",
    subtitle: "The Prophetic Arc from the Passover Lamb to Calvary",
    book: "The Book of Exodus",
    chapter: "Exodus & Passion",
    durationSeconds: 279, // 4m 39s
    durationFormatted: "4m 39s",
    videoId: "ZoealOqy0Kg",
    synopsis:
      "Connecting the ancient sacrificial covenants of Genesis and Exodus to the ultimate drama of Golgotha. An authoritative visual breakdown of the prophecies fulfilled on the Cross and the dawn of the resurrection.",
    poster: "/assets/yahweh-tablets-poster.jpg",
    tag: "SPECIAL FEATURE",
    language: "English",
  },
  {
    id: "yahweh-premiere-trailer",
    title: "YAHWEH — The God Who Reveals His Power",
    subtitle: "Official Theatrical & Streaming Trailer (Book of Exodus)",
    book: "The Book of Exodus",
    chapter: "Exodus Chapters 1–20",
    durationSeconds: 154, // 2m 34s
    durationFormatted: "2m 34s",
    videoId: "PD9gqRc8VTU",
    synopsis:
      "Witness the clash of gods, the ten plagues of Egypt, the roaring waters of the Red Sea divided, the pillar of cloud and fire, and the Law delivered in fire atop Mount Sinai.",
    poster: "/assets/yahweh-hero-mount-sinai.jpg",
    tag: "OFFICIAL TRAILER",
    language: "Global",
  },
];

export const DEFAULT_ARCHIVE_ITEMS: ArchiveGridItem[] = [
  {
    id: "genesis-in-the-beginning",
    title: "In the Beginning",
    subtitle: "Genesis · 50 Chapters Complete",
    imageUrl: "/assets/genesis-shepherds-poster.jpg",
    episode: "genesis-46-50",
    linkUrl: "/watch?episode=genesis-46-50&mode=vod",
  },
  {
    id: "the-purpose-of-god",
    title: "The Purpose of God",
    subtitle: "The Story of Joseph in Egypt",
    imageUrl: "/assets/purpose-of-god-joseph-poster.jpg",
    episode: "genesis-37-44-joseph",
    linkUrl: "/watch?episode=genesis-37-44-joseph&mode=vod",
  },
  {
    id: "genesis-hindi",
    title: "Genesis · उत्पत्ति",
    subtitle: "Hindi Edition · Campfire Council",
    imageUrl: "/assets/genesis-hindi-campfire-poster.jpg",
    episode: "genesis-42-fire",
    linkUrl: "/watch?episode=genesis-42-fire&mode=vod",
  },
  {
    id: "genesis-tamil",
    title: "Genesis · ஆதியாகமம்",
    subtitle: "Tamil Edition · Complete Season",
    imageUrl: "/assets/genesis-tamil-poster.jpg",
    episode: "genesis-45-reconciliation",
    linkUrl: "/watch?episode=genesis-45-reconciliation&mode=vod",
  },
  {
    id: "genesis-malayalam",
    title: "Genesis · ഉദ്ഭവം",
    subtitle: "Malayalam Edition · Complete",
    imageUrl: "/assets/genesis-malayalam-poster.jpg",
    episode: "genesis-30-32-dreamer",
    linkUrl: "/watch?episode=genesis-30-32-dreamer&mode=vod",
  },
  {
    id: "genesis-chinese",
    title: "Genesis · 创世记",
    subtitle: "Mandarin Chinese Edition",
    imageUrl: "/assets/genesis-chinese-poster.jpg",
    episode: "genesis-46-50",
    linkUrl: "/watch?episode=genesis-46-50&mode=vod",
  },
  {
    id: "genesis-persian",
    title: "یهودا، برگزیده خدا",
    subtitle: "Persian Edition · Judah Chosen",
    imageUrl: "/assets/genesis-persian-judah-poster.jpg",
    episode: "genesis-37-44-joseph",
    linkUrl: "/watch?episode=genesis-37-44-joseph&mode=vod",
  },
  {
    id: "genesis-tagalog",
    title: "Genesis · Tagalog",
    subtitle: "Philippines & Southeast Asia",
    imageUrl: "/assets/genesis-tagalog-poster.jpg",
    episode: "genesis-46-50",
    linkUrl: "/watch?episode=genesis-46-50&mode=vod",
  },
  {
    id: "yahweh-mount-sinai",
    title: "YAHWEH · Mount Sinai",
    subtitle: "The Tablets of the Law (Exodus)",
    imageUrl: "/assets/yahweh-tablets-poster.jpg",
    episode: "yahweh-exodus-theatrical",
    linkUrl: "/watch?episode=yahweh-exodus-theatrical&mode=vod",
  },
  {
    id: "the-waters-divide",
    title: "The Waters Divide",
    subtitle: "Exodus Chapter 14 · Feature",
    imageUrl: "/assets/moses-parting-sea.jpg",
    episode: "yahweh-exodus-theatrical",
    linkUrl: "/watch?episode=yahweh-exodus-theatrical&mode=vod",
  },
  {
    id: "yahweh-the-deliverer",
    title: "YAHWEH · The Deliverer",
    subtitle: "The Red Sea Staff Poster",
    imageUrl: "/assets/yahweh-exodus-staff-poster.jpg",
    episode: "yahweh-premiere-trailer",
    linkUrl: "/watch?episode=yahweh-premiere-trailer&mode=vod",
  },
  {
    id: "joseph-before-pharaoh",
    title: "Joseph Before Pharaoh",
    subtitle: "Genesis 41 Historical Study",
    imageUrl: "/assets/genesis-pharaoh-prophet-sunset.jpg",
    episode: "genesis-37-44-joseph",
    linkUrl: "/watch?episode=genesis-37-44-joseph&mode=vod",
  },
  {
    id: "covenant-night",
    title: "Covenant in the Night",
    subtitle: "Abraham Under the Stars",
    imageUrl: "/assets/genesis-poster.jpg",
    episode: "genesis-46-50",
    linkUrl: "/watch?episode=genesis-46-50&mode=vod",
  },
  {
    id: "judah-the-intercessor",
    title: "Judah · The Intercessor",
    subtitle: "Pledge of Life for Benjamin",
    imageUrl: "/assets/judas-chosen-by-god-persian.jpg",
    episode: "genesis-37-44-joseph",
    linkUrl: "/watch?episode=genesis-37-44-joseph&mode=vod",
  },
  {
    id: "pharaohs-decree",
    title: "Pharaoh's Decree",
    subtitle: "The Golden Chariots of Egypt",
    imageUrl: "/assets/genesis-pharaoh-prophet-sunset.jpg",
    episode: "yahweh-premiere-trailer",
    linkUrl: "/watch?episode=yahweh-premiere-trailer&mode=vod",
  },
  {
    id: "the-plagues-of-egypt",
    title: "The Ten Plagues",
    subtitle: "Exodus Chapters 7-12",
    imageUrl: "/assets/yahweh-monument.jpg",
    episode: "yahweh-exodus-theatrical",
    linkUrl: "/watch?episode=yahweh-exodus-theatrical&mode=vod",
  },
];

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
      subtitle: "The Book of Genesis · 50 Chapters Complete",
      image: "/assets/genesis-shepherds-poster.jpg",
      badge: "Complete Series",
      language: "English",
      episode: "genesis-46-50",
    },
    {
      id: "joseph-feature",
      title: "The Purpose of God",
      subtitle: "The Story of Joseph · Betrayed by Brothers",
      image: "/assets/purpose-of-god-joseph-poster.jpg",
      badge: "Special Presentation",
      language: "English / Global",
      episode: "genesis-37-44-joseph",
    },
    {
      id: "genesis-hindi",
      title: "उत्पत्ति (Genesis)",
      subtitle: "Hindi Edition · Full Audio & Subtitles",
      image: "/assets/genesis-hindi-campfire-poster.jpg",
      badge: "Hindi Audio",
      language: "Hindi",
      episode: "genesis-42-fire",
    },
    {
      id: "genesis-tamil",
      title: "ஆதியாகமம் (Genesis)",
      subtitle: "Tamil Edition · Complete Season",
      image: "/assets/genesis-tamil-poster.jpg",
      badge: "Tamil Audio",
      language: "Tamil",
      episode: "genesis-45-reconciliation",
    },
    {
      id: "genesis-malayalam",
      title: "ഉദ്ഭവം (Genesis)",
      subtitle: "Malayalam Edition · Complete Season",
      image: "/assets/genesis-malayalam-poster.jpg",
      badge: "Malayalam Audio",
      language: "Malayalam",
      episode: "genesis-30-32-dreamer",
    },
    {
      id: "genesis-persian",
      title: "پیدایش (Genesis)",
      subtitle: "Persian Edition · Judah & Joseph",
      image: "/assets/judas-chosen-by-god-persian.jpg",
      badge: "Farsi / Persian",
      language: "Persian",
      episode: "genesis-37-44-joseph",
    },
    {
      id: "yahweh-vault-card",
      title: "YAHWEH — Exodus",
      subtitle: "The God Who Reveals His Power",
      image: "/assets/yahweh-hero-parted-sea.jpg",
      badge: "Upcoming Premiere",
      language: "English / Global",
      episode: "yahweh-exodus-theatrical",
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
        "Reaching unreached regional spoken languages and oral cultures without written Scripture. Overcoming the literacy barrier so every community hears the Word in their native spoken tongue.",
      image: "/assets/genesis-hindi-campfire-poster.jpg",
      alt: "100 Languages Global Initiative",
    },
  ],
  broadcastEpisodes: DEFAULT_BROADCAST_EPISODES,
  archiveItems: DEFAULT_ARCHIVE_ITEMS,
};

const CMS_STORAGE_KEY = "vb_cms_data_v4";

export function getStoredCmsData(): SiteCmsData {
  if (typeof window === "undefined") return DEFAULT_CMS_DATA;
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) return DEFAULT_CMS_DATA;
    const parsed = JSON.parse(raw);
    const episodes =
      Array.isArray(parsed.broadcastEpisodes) &&
      parsed.broadcastEpisodes.length >= DEFAULT_BROADCAST_EPISODES.length
        ? parsed.broadcastEpisodes
        : DEFAULT_BROADCAST_EPISODES;
    const vault =
      Array.isArray(parsed.vaultProductions) && parsed.vaultProductions.length
        ? parsed.vaultProductions
        : DEFAULT_CMS_DATA.vaultProductions;
    return {
      hero: { ...DEFAULT_CMS_DATA.hero, ...(parsed.hero || {}) },
      vaultProductions: vault,
      upcomingProjects: parsed.upcomingProjects || DEFAULT_CMS_DATA.upcomingProjects,
      broadcastEpisodes: episodes,
      archiveItems: parsed.archiveItems || DEFAULT_CMS_DATA.archiveItems,
    };
  } catch {
    return DEFAULT_CMS_DATA;
  }
}

export function useCmsContent() {
  const [data, setData] = useState<SiteCmsData>(getStoredCmsData);

  // Sync from server on mount
  useEffect(() => {
    fetchCmsContent()
      .then((res) => {
        if (res && res.ok && res.data) {
          const serverData = res.data as SiteCmsData;
          const merged: SiteCmsData = {
            hero: { ...DEFAULT_CMS_DATA.hero, ...(serverData.hero || {}) },
            vaultProductions: serverData.vaultProductions || DEFAULT_CMS_DATA.vaultProductions,
            upcomingProjects: serverData.upcomingProjects || DEFAULT_CMS_DATA.upcomingProjects,
            broadcastEpisodes: serverData.broadcastEpisodes || DEFAULT_CMS_DATA.broadcastEpisodes,
            archiveItems: serverData.archiveItems || DEFAULT_CMS_DATA.archiveItems,
          };
          setData(merged);
          localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(merged));
        }
      })
      .catch((e) => {
        console.warn("Could not fetch server CMS content:", e);
      });
  }, []);

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

    // Also persist to server in the background so all visitors and admin teammates see it
    saveCmsContent({ data: { cmsData: newData } }).catch((err) => {
      console.warn("Server CMS sync failed (using local storage):", err);
    });
  };

  const saveAllCmsData = (newData: SiteCmsData) => {
    saveCmsData(newData);
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

  const updateArchiveItems = (items: ArchiveGridItem[]) => {
    const next = { ...data, archiveItems: items };
    saveCmsData(next);
  };

  const resetToDefaults = () => {
    localStorage.removeItem(CMS_STORAGE_KEY);
    setData(DEFAULT_CMS_DATA);
    window.dispatchEvent(new Event("vb_cms_data_change"));
    saveCmsContent({ data: { cmsData: DEFAULT_CMS_DATA } }).catch(() => {});
  };

  return {
    cmsData: data,
    saveAllCmsData,
    updateHero,
    updateVaultProductions,
    updateUpcomingProjects,
    updateBroadcastEpisodes,
    updateArchiveItems,
    resetToDefaults,
  };
}
