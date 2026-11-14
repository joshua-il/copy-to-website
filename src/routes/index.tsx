import { useState, useEffect, useRef, useMemo, useCallback, type FormEvent, type CSSProperties } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Play,
  Plus,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Search,
  Home,
  Tv,
  Film,
  Compass,
  Cpu,
  Bookmark,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronLeft,
  Menu,
  Globe as GlobeIcon,
  Check,
  Edit3,
  Users,
  TrendingUp,
  Sparkles,
  BookOpen,
  X,
} from "lucide-react";
import { GlobalSidebar } from "@/components/global-sidebar";
import { RegionalSelector } from "@/components/site-header";
import { useGlobalLanguage } from "@/lib/language";
import { useAdminAuth } from "@/lib/admin-auth";
import { useCmsContent } from "@/lib/cms-store";
import { joinWaitlist } from "@/lib/waitlist.functions";
import GalleryTunnel from "@/components/originkit/ui/hero-13/gallery-tunnel";
import Globe from "@/components/originkit/ui/globe-custom-style";
import InfiniteGrid from "@/components/originkit/ui/infinite-grid";
import AccordionOS from "@/components/originkit/ui/accordion-os";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "Visual Bible TV · The Network Hub — Until All Hear" },
      {
        name: "description",
        content:
          "Visual Bible: Scripture brought to life through cinematic AI and real-actor performances. 50 chapters of Genesis complete across 8 languages. Now in production: YAHWEH — The Book of Exodus.",
      },
      { property: "og:title", content: "Visual Bible TV · Until All Hear" },
      {
        property: "og:description",
        content:
          "Experience the biblical epic. 50 chapters of Genesis complete. Upcoming premiere: YAHWEH — The Book of Exodus.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://visualbible.tv" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
} as Parameters<typeof createFileRoute<"/">>[0]);

// ─── Data: Existing Productions (Genesis, Joseph, & Languages) ───────────────

const EXISTING_PRODUCTIONS = [
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
    subtitle: "Hindi Edition · Complete Release",
    image: "/assets/genesis-hindi-campfire-poster.jpg",
    badge: "Hindi",
    language: "Hindi",
    episode: "genesis",
  },
  {
    id: "genesis-tamil",
    title: "ஆதியாகமம் (Genesis)",
    subtitle: "Tamil Edition · Complete Season",
    image: "/assets/genesis-tamil-poster.jpg",
    badge: "Tamil",
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
    id: "genesis-yoruba",
    title: "Ìbẹ̀rẹ̀pẹ̀pẹ́ (Genesis)",
    subtitle: "Yoruba Edition · Sneak Peek Release",
    image: "/assets/genesis-shepherds-poster.jpg",
    badge: "Yoruba",
    language: "Yoruba",
    episode: "genesis",
  },
  {
    id: "genesis-chinese",
    title: "创世记 (Genesis)",
    subtitle: "Chinese Edition · The Joseph Story in Egypt",
    image: "/assets/genesis-chinese-poster.jpg",
    badge: "Mandarin",
    language: "Chinese",
    episode: "genesis",
  },
  {
    id: "genesis-persian",
    title: "یهودا، برگزیده خدا",
    subtitle: "Persian Edition · Judah Chosen by God",
    image: "/assets/genesis-persian-judah-poster.jpg",
    badge: "Persian / Farsi",
    language: "Persian",
    episode: "judas",
  },
];

const PITCH_TUNNEL_IMAGES = [
  "/assets/genesis-shepherds-poster.jpg",
  "/assets/purpose-of-god-joseph-poster.jpg",
  "/assets/genesis-chinese-poster.jpg",
  "/assets/genesis-persian-judah-poster.jpg",
  "/assets/genesis-hindi-campfire-poster.jpg",
  "/assets/genesis-malayalam-poster.jpg",
  "/assets/genesis-tamil-poster.jpg",
  "/assets/yahweh-tablets-poster.jpg",
  "/assets/yahweh-monument.jpg",
  "/assets/yahweh-exodus-staff-poster.jpg",
  "/assets/moses-parting-sea.jpg",
  "/assets/genesis-pharaoh-prophet-sunset.jpg",
  "/assets/genesis-poster.jpg",
  "/assets/genesis-tagalog-poster.jpg",
  "/assets/genesis-warriors-fire.jpg",
  "/assets/judas-chosen-by-god-persian.jpg",
];

// ─── Data: The Living Infinite Archive (Originkit Infinite Canvas) ────────────

interface ArchiveGridItem {
  title: string;
  subtitle: string;
  imageUrl: string;
  episode: string;
}

const INFINITE_ARCHIVE_ITEMS: ArchiveGridItem[] = [
  {
    title: "In the Beginning",
    subtitle: "Genesis · 50 Chapters Complete",
    imageUrl: "/assets/genesis-shepherds-poster.jpg",
    episode: "genesis",
  },
  {
    title: "The Purpose of God",
    subtitle: "The Story of Joseph in Egypt",
    imageUrl: "/assets/purpose-of-god-joseph-poster.jpg",
    episode: "joseph",
  },
  {
    title: "Genesis · उत्पत्ति",
    subtitle: "Hindi Edition · Campfire Council",
    imageUrl: "/assets/genesis-hindi-campfire-poster.jpg",
    episode: "genesis",
  },
  {
    title: "Genesis · ஆதியாகமம்",
    subtitle: "Tamil Edition · Complete Season",
    imageUrl: "/assets/genesis-tamil-poster.jpg",
    episode: "genesis",
  },
  {
    title: "Genesis · ഉദ്ഭവം",
    subtitle: "Malayalam Edition · Complete",
    imageUrl: "/assets/genesis-malayalam-poster.jpg",
    episode: "genesis",
  },
  {
    title: "Genesis · 创世记",
    subtitle: "Mandarin Chinese Edition",
    imageUrl: "/assets/genesis-chinese-poster.jpg",
    episode: "genesis",
  },
  {
    title: "یهودا، برگزیده خدا",
    subtitle: "Persian Edition · Judah Chosen",
    imageUrl: "/assets/genesis-persian-judah-poster.jpg",
    episode: "judas",
  },
  {
    title: "Genesis · Tagalog",
    subtitle: "Philippines & Southeast Asia",
    imageUrl: "/assets/genesis-tagalog-poster.jpg",
    episode: "genesis",
  },
  {
    title: "YAHWEH · Mount Sinai",
    subtitle: "The Tablets of the Law (Exodus)",
    imageUrl: "/assets/yahweh-tablets-poster.jpg",
    episode: "yahweh",
  },
  {
    title: "The Waters Divide",
    subtitle: "Exodus Chapter 14 · Feature",
    imageUrl: "/assets/moses-parting-sea.jpg",
    episode: "yahweh",
  },
  {
    title: "YAHWEH · The Deliverer",
    subtitle: "The Red Sea Staff Poster",
    imageUrl: "/assets/yahweh-exodus-staff-poster.jpg",
    episode: "yahweh",
  },
  {
    title: "Joseph Before Pharaoh",
    subtitle: "Genesis 41 Historical Study",
    imageUrl: "/assets/genesis-pharaoh-prophet-sunset.jpg",
    episode: "joseph",
  },
  {
    title: "Covenant in the Night",
    subtitle: "Genesis 15 Patriarch Council",
    imageUrl: "/assets/genesis-warriors-fire.jpg",
    episode: "genesis",
  },
  {
    title: "The Promise Fulfilled",
    subtitle: "The Patriarchs of Genesis",
    imageUrl: "/assets/genesis-poster.jpg",
    episode: "genesis",
  },
  {
    title: "The Mountain of God",
    subtitle: "Exodus Archaeological Study",
    imageUrl: "/assets/yahweh-monument.jpg",
    episode: "yahweh",
  },
  {
    title: "Creation to Abraham",
    subtitle: "Genesis Key Studio Art",
    imageUrl: "/assets/in-the-beginning-banner.png",
    episode: "genesis",
  },
];

// ─── Data: Workflow Steps (35mm Film Strip Layout) ──────────────────────────

interface WorkflowStep {
  id: string;
  stepNumber: string;
  code: string;
  frameCode: string;
  badge: string;
  pillarLabel: string;
  title: string;
  shortDesc: string;
  extendedDesc: string;
  image: string;
  readingNotes: {
    subtitle: string;
    overview: string;
    sections: { heading: string; body: string }[];
    theologicalMandate: string;
    scriptureReference: string;
    productionMetrics: { label: string; value: string }[];
  };
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "avatars",
    stepNumber: "01",
    code: "NRIM 5219 · 01",
    frameCode: "01A",
    badge: "AVATARS",
    pillarLabel: "HUMAN EMBODIMENT",
    title: "Real Humans as Biblical Avatars",
    shortDesc:
      "We cast living men and women and resurrect their raw human soul, grief, and faith directly into the ancient patriarchs.",
    extendedDesc:
      "No artificial CGI mannequins. No sterile digital puppets. We cast living actors—capturing the raw tremor in a father's eye, the weathered dust upon real skin, and the authentic tears of sacred sacrifice. Through state-of-the-art cinematic neural performance capture, living human likeness is woven directly into biblical history. When you look into the eyes of Abraham, Isaac, or Jacob, you witness the genuine weight of living souls wrestling with God.",
    image: "/assets/genesis-shepherds-poster.jpg",
    readingNotes: {
      subtitle: "The Philosophy of Embodied Scripture: Resurrecting Humanity, Not Artificial Puppets",
      overview:
        "At the core of the Visual Bible is an uncompromising conviction: Scripture was lived by flesh-and-blood men and women who grieved, trembled, prayed, and bled. We refuse to settle for sterile CGI mannequins or soulless digital avatars. We cast living actors—capturing the raw tremor in a father's eye, the weathered dust upon real skin, and the authentic tears of sacred sacrifice.",
      sections: [
        {
          heading: "Neural Volumetric Performance Capture",
          body: "Using high-resolution multi-angle photogrammetry and neural volumetric tracking, our pipeline captures micro-expressions, breathing cadences, and emotional weight without artificial smoothing. When Abraham gazes toward the altar or Isaac carries the wood, viewers witness real human tears and tremulous faith.",
        },
        {
          heading: "Authentic Heritage & Countenance Casting",
          body: "We deliberately avoid stylized Hollywood archetypes. Our casting directors recruit living men and women with authentic Semitic, Middle Eastern, and regional lineage. Their bone structures, skin textures, and natural gaze bring historical truth and reverent authenticity back to the sacred text.",
        },
        {
          heading: "The Theological Incarnational Mandate",
          body: "God did not communicate redemption through synthetic abstraction; He revealed Himself through living persons and ultimate incarnation. By preserving genuine human soul and vulnerability on screen, viewers across every culture experience biblical truth with visceral spiritual conviction.",
        },
      ],
      theologicalMandate:
        "By faith Abraham, when he was tested, offered up Isaac... He considered that God was able even to raise him from the dead.",
      scriptureReference: "Hebrews 11:8, 17–19 · Genesis 22:1–14",
      productionMetrics: [
        { label: "Capture Method", value: "Neural Volumetric 4K" },
        { label: "Cinematic Standard", value: "24 FPS Raw Embodiment" },
        { label: "Casting Principle", value: "Living Human Heritage" },
      ],
    },
  },
  {
    id: "worldbuilding",
    stepNumber: "02",
    code: "NRIM 5219 · 02",
    frameCode: "02A",
    badge: "WORLDBUILDING",
    pillarLabel: "SACRED VIRTUAL SETS",
    title: "Virtual Sets Created · Epic Worldbuilding",
    shortDesc:
      "Hollywood-grade virtual soundstages resurrecting the lost sacred architecture and colossal landscapes of Genesis and Exodus.",
    extendedDesc:
      "We refuse to settle for soundstage green screens or generic desert hills. Harnessing the same cutting-edge virtual production pipelines that power blockbuster cinema, we architect the ancient Near East with uncompromising archaeological fidelity. From the colossal, shadow-drenched throne rooms of Egyptian Pharaohs to the roaring, parted abyss of the Red Sea and the lightning-riven crags of Mount Sinai—we build living, immersive worlds so the awe-inspiring majesty of Scripture is felt in your bones.",
    image: "/assets/yahweh-hero-mount-sinai.jpg",
    readingNotes: {
      subtitle: "Archaeological Precision Meets Hollywood Real-Time Virtual Production",
      overview:
        "We reject generic desert dunes and low-budget greenscreens. Harnessing the same real-time virtual production soundstages used in groundbreaking cinema, our team reconstructs the sacred geography, monumental architecture, and atmospheric scale of Genesis and Exodus with uncompromising historical fidelity.",
      sections: [
        {
          heading: "Real-Time LED Volume Soundstages",
          body: "Actors perform inside massive curved LED volume soundstages where photorealistic environments rendered in Unreal Engine 5 project real physical light onto ancient linen, wool, and bronze armor. Camera tracking synchronizes parallax in real time, erasing the seam between physical actors and colossal biblical landscapes.",
        },
        {
          heading: "Rigorous Archaeological & Historical Restoration",
          body: "Our art department collaborates with Near Eastern historians and biblical archaeologists to resurrect lost monumental architecture: the tiered mudbrick ziggurats of Ur, the soaring lotus columns of Goshen, and the exact geological elevations of the Sinai wilderness. Every hieroglyph, pottery fragment, and architectural proportion is archaeologically verified.",
        },
        {
          heading: "Atmospheric Scale & Biblical Majesty",
          body: "Worldbuilding is never a visual gimmick—it is an amplifier of sacred truth. When the waters of the Red Sea divide or the cloud of glory descends atop Mount Sinai, the atmospheric scale, volumetric dust storms, and photorealistic physics convey the sheer, terrifying holiness of the living God.",
        },
      ],
      theologicalMandate:
        "And Moses stretched out his hand over the sea; and the Lord caused the sea to go back by a strong east wind all that night, and made the sea dry land, and the waters were divided.",
      scriptureReference: "Exodus 14:21–22 · Exodus 19:16–20",
      productionMetrics: [
        { label: "Engine", value: "Unreal Engine 5 Lumen/Nanite" },
        { label: "Color Science", value: "ACEScg Cinematic Pipeline" },
        { label: "Historical Scale", value: "1:1 Archaeological Fidelity" },
      ],
    },
  },
  {
    id: "languages",
    stepNumber: "03",
    code: "NRIM 5219 ▸ 03",
    frameCode: "03A",
    badge: "LANGUAGES",
    pillarLabel: "REACHING THE UNREACHED",
    title: "100 Languages for Every Tribe & Nation",
    shortDesc:
      "A relentless global localization engine producing across 100 regional and local languages to shatter illiteracy and reach the unreached.",
    extendedDesc:
      "Over one billion souls on Earth belong to oral traditions and regional dialects without a written Bible they can read. We are driven by an apostolic mandate: producing the Visual Bible in 100 regional and indigenous languages to truly reach the unreached. By fusing photorealistic cinematic dramatization with authentic native voice acting and cultural acoustic cadence, we bypass literacy barriers completely. Every tribe, every language, and every isolated village will witness and hear the living Word of God in their heart tongue.",
    image: "/assets/genesis-hindi-campfire-poster.jpg",
    readingNotes: {
      subtitle: "Shattering Orality & Literacy Barriers for Every Tribe & Nation",
      overview:
        "Over one billion souls on Earth belong to oral traditions and regional dialects without a written Bible they can read. We are driven by an apostolic mandate: producing the Visual Bible in 100 regional and indigenous languages to truly reach the unreached. By fusing photorealistic cinematic dramatization with authentic native voice acting and cultural acoustic cadence, we bypass literacy barriers completely.",
      sections: [
        {
          heading: "Native Heart-Language Voice Acting",
          body: "We strictly reject automated text-to-speech. We cast native voice actors in their home countries—recording the authentic cadence, poetic timbre, and musical intonation of languages like Yoruba, Hindi, Mandarin, Tamil, Malayalam, Tagalog, Farsi, and Arabic. Scripture penetrates deepest when spoken in the acoustic cadence of childhood and homeland.",
        },
        {
          heading: "Overcoming Orality & Illiteracy",
          body: "More than 70% of the unreached world cannot read or relies primarily on oral storytelling. By delivering Scripture as a cinematic, chapter-by-chapter audiovisual experience, illiterate and oral communities bypass written linguistic hurdles entirely. A village elder or a child can watch and understand redemption instantly.",
        },
        {
          heading: "Open Broadcast & Village Projector Distribution",
          body: "Every language master is engineered with 5.1 spatial audio and optimized for low-bandwidth mobile streaming, satellite broadcast, and offline micro-SD distribution for portable solar village projectors. Our mission will not stop until the full 100-language target is achieved across every continent.",
        },
      ],
      theologicalMandate:
        "After this I looked, and behold, a great multitude that no one could number, from every nation, from all tribes and peoples and languages, standing before the throne...",
      scriptureReference: "Revelation 7:9–10 · Matthew 24:14",
      productionMetrics: [
        { label: "Language Target", value: "100 Spoken Tongues" },
        { label: "Active Viewership", value: "88 Countries Worldwide" },
        { label: "Acoustic Standard", value: "5.1 Native Spatial Voice" },
      ],
    },
  },
];

// ─── Data: Upcoming Projects (Originkit AccordionOS) ─────────────────────────

const UPCOMING_PROJECTS_ITEMS = [
  {
    title: "YAHWEH — The Book of Exodus",
    badge: "01 · EXODUS",
    claim:
      "The God Who Reveals His Power. The ten plagues of Egypt, the roaring waters of the Red Sea divided, the pillar of cloud and fire, and the giving of the Law atop Mount Sinai.",
    image: "/assets/yahweh-hero-parted-sea.jpg",
    alt: "YAHWEH The Book of Exodus",
    offsetY: 0,
  },
  {
    title: "In the Beginning — The Book of Genesis",
    badge: "02 · GENESIS",
    claim:
      "The God Who Fulfills His Promise. The complete 50-chapter foundational saga from Creation and the Garden of Eden to Abraham, Isaac, Jacob, and the patriarchs.",
    image: "/assets/genesis-shepherds-poster.jpg",
    alt: "In the Beginning Genesis",
    offsetY: 0,
  },
  {
    title: "Visual Bible TV Series",
    badge: "03 · SERIES",
    claim:
      "An episodic television broadcast network delivering chapter-by-chapter dramatizations with 4K HDR cinematography, spatial audio, and cinematic scoring.",
    image: "/assets/in-the-beginning-banner.png",
    alt: "Visual Bible TV Series",
    offsetY: 0,
  },
  {
    title: "The Purpose of God — The Story of Joseph",
    badge: "04 · JOSEPH",
    claim:
      "Betrayed by his brothers, sold into Egyptian bondage, and exalted to the throne. A masterclass in divine sovereignty, forgiveness, and salvation.",
    image: "/assets/purpose-of-god-joseph-poster.jpg",
    alt: "The Purpose of God Joseph",
    offsetY: 0,
  },
  {
    title: "100 Languages Global Initiative",
    badge: "05 · GLOBAL",
    claim:
      "Reaching unreached regional dialects and oral mother tongues without written scripture. Overcoming illiteracy so every nation hears the Word in their heart tongue.",
    image: "/assets/genesis-hindi-campfire-poster.jpg",
    alt: "100 Languages Global Initiative",
    offsetY: 0,
  },
];

// ─── Data: Regional Demographic & Potential Reach Analysis ──────────────────

export interface RegionAnalysis {
  id: string;
  name: string;
  nativeName: string;
  badge: string;
  isUpcoming?: boolean;
  territory: string;
  totalPopulation: string;
  potentialReach: string;
  highlightStat: string; // e.g. "47 million yoruba speaking people"
  subStat: string;
  languages: string[];
  oralityInsight: string;
  activeRelease: string;
  releaseUrl: string;
  isExternal?: boolean;
  reachRatio: number;
}

export const REGIONAL_ANALYSIS_DATA: Record<string, RegionAnalysis> = {
  Nigeria: {
    id: "yoruba",
    name: "Yoruba (Nigeria & West Africa)",
    nativeName: "Èdè Yorùbá · Nàìjíríà",
    badge: "Sneak Peek Live",
    isUpcoming: false,
    territory: "Nigeria, Benin, Togo & Global African Diaspora",
    totalPopulation: "225 Million (Nigeria) / 430 Million (West Africa)",
    potentialReach: "47 million yoruba speaking people",
    highlightStat: "47 million yoruba speaking people",
    subStat: "Primary heart language across Yorubaland & West African diaspora",
    languages: ["Yoruba (Èdè Yorùbá)"],
    oralityInsight:
      "Yoruba is a vibrant Niger-Congo tonal language celebrated for rich oral poetry (Oriki), folklore, and spoken proverbs. The visual bible eliminates reading and literacy constraints, allowing 47 million people to experience Scripture in their authentic cultural heart-cadence.",
    activeRelease: "Genesis in the Yoruba Language (Sneak Peek 4K)",
    releaseUrl: "https://www.youtube.com/watch?v=DxNeDE-9J8A",
    isExternal: true,
    reachRatio: 21,
  },
  India: {
    id: "india",
    name: "India (Hindi · Tamil · Malayalam)",
    nativeName: "भारत · हिन्दी · தமிழ் · മലയാളം",
    badge: "3 Live Tracks",
    isUpcoming: false,
    territory: "Republic of India & South Asian Global Diaspora",
    totalPopulation: "1.43 Billion People",
    potentialReach: "728+ Million people",
    highlightStat: "728+ Million people",
    subStat: "Hindi (~600M+), Tamil (~77M+), Malayalam (~38M+)",
    languages: ["Hindi (हिन्दी)", "Tamil (தமிழ்)", "Malayalam (മലയാളം)"],
    oralityInsight:
      "India is home to the world's largest oral and visual storytelling culture. By delivering full chapter dramatizations in Hindi, Tamil, and Malayalam with authentic native voice acting and spatial score, the Visual Bible reaches over 728 million people across northern, southern, and diaspora communities.",
    activeRelease: "Genesis Chapters 1–50 (Hindi, Tamil & Malayalam)",
    releaseUrl: "/watch?episode=genesis-hindi",
    isExternal: false,
    reachRatio: 51,
  },
  China: {
    id: "china",
    name: "China (Mandarin Chinese)",
    nativeName: "中国 · 中文 / 普通话",
    badge: "Joseph Edition Live",
    isUpcoming: false,
    territory: "China, Taiwan, Singapore & Global Chinese Diaspora",
    totalPopulation: "1.41 Billion People",
    potentialReach: "1.18 Billion Mandarin speaking people",
    highlightStat: "1.18 Billion people",
    subStat: "World's largest spoken native language",
    languages: ["Mandarin Chinese (中文)"],
    oralityInsight:
      "Mandarin is spoken by over 1.18 billion people worldwide. Cinematic biblical visualization delivers profound spiritual and historical context that bypasses textual and ideological hurdles, communicating God's redemption through the universal medium of film.",
    activeRelease: "The Purpose of God: The Story of Joseph (Mandarin)",
    releaseUrl: "/watch?episode=joseph-mandarin",
    isExternal: false,
    reachRatio: 84,
  },
  Iran: {
    id: "persia",
    name: "Iran / Persia (Farsi)",
    nativeName: "ایران · فارسی",
    badge: "Judah (Gen 38) Live",
    isUpcoming: false,
    territory: "Iran, Afghanistan (Dari), Tajikistan (Tajiki) & Middle East Diaspora",
    totalPopulation: "89 Million (Iran) / 130 Million (Persian Plateau)",
    potentialReach: "127+ Million Farsi/Persian speaking people",
    highlightStat: "127+ Million people",
    subStat: "Major regional influence across Central Asia & Middle East",
    languages: ["Persian / Farsi (فارسی)", "Dari (دری)"],
    oralityInsight:
      "With millennia of poetic and oral recitation culture, Persian speakers connect deeply with acoustic and visual majesty. The Visual Bible provides unhindered, safe digital access for 127M+ people to witness the Word in their mother tongue.",
    activeRelease: "Judah's Redemption (Genesis Chapter 38 - Farsi)",
    releaseUrl: "/watch?episode=judah-persian",
    isExternal: false,
    reachRatio: 98,
  },
  Philippines: {
    id: "philippines",
    name: "Philippines (Tagalog)",
    nativeName: "Pilipinas · Wikang Tagalog",
    badge: "Genesis Series Live",
    isUpcoming: false,
    territory: "Philippines Archipelago & 10M+ Global Filipino Diaspora",
    totalPopulation: "117 Million People",
    potentialReach: "87+ Million Tagalog speaking people",
    highlightStat: "87+ Million people",
    subStat: "National lingua franca and worldwide OFW diaspora",
    languages: ["Tagalog (Wikang Tagalog)", "Filipino"],
    oralityInsight:
      "The Philippines has one of the highest digital media consumptions in the world. Tagalog visual scripture connects directly with multigenerational families and community viewing groups across the islands and international worker diaspora.",
    activeRelease: "Genesis Patriarchal Chronicles (Tagalog Edition)",
    releaseUrl: "/watch?episode=genesis-tagalog",
    isExternal: false,
    reachRatio: 74,
  },
  Egypt: {
    id: "egypt",
    name: "Egypt & Arab World (Arabic)",
    nativeName: "مصر · العربية",
    badge: "Exodus Sagas Pipeline",
    isUpcoming: true,
    territory: "Egypt, Levant, North Africa & Arabian Peninsula",
    totalPopulation: "112 Million (Egypt) / 450 Million (Arab World)",
    potentialReach: "400+ Million Arabic speaking people",
    highlightStat: "400+ Million people",
    subStat: "Native historical geography of the Exodus and Sinai narrative",
    languages: ["Modern Standard Arabic (العربية)", "Egyptian Colloquial"],
    oralityInsight:
      "Filmed with authentic archaeological fidelity to the landscapes of Goshen, the Nile, and Mount Sinai, this edition brings the historical Exodus narrative back to the 400 million people of the Arab world in their native Semitic acoustic heritage.",
    activeRelease: "YAHWEH: The Book of Exodus (Arabic Sagas)",
    releaseUrl: "/watch?episode=yahweh-exodus",
    isExternal: false,
    reachRatio: 89,
  },
  "United States of America": {
    id: "english",
    name: "Global English Master Catalog",
    nativeName: "United States · UK · Canada · Australia",
    badge: "Master 4K Catalog Live",
    isUpcoming: false,
    territory: "North America, British Isles, Australasia & Global Common Market",
    totalPopulation: "470 Million (Core Anglosphere)",
    potentialReach: "1.5+ Billion English speaking people worldwide",
    highlightStat: "1.5+ Billion people",
    subStat: "Global digital lingua franca across all continents",
    languages: ["English (Native 5.1 Spatial Audio)"],
    oralityInsight:
      "Serving as the flagship foundation of the entire Visual Bible initiative, the English master catalog sets the cinematic, acoustic, and theological benchmark, reaching 1.5 billion people across every continent.",
    activeRelease: "Complete 16-Episode Streaming Vault & 24/7 Channel",
    releaseUrl: "/watch",
    isExternal: false,
    reachRatio: 95,
  },
};

function getRegionAnalysis(cName: string | null | undefined): RegionAnalysis {
  if (!cName) return REGIONAL_ANALYSIS_DATA["Nigeria"];
  if (REGIONAL_ANALYSIS_DATA[cName]) return REGIONAL_ANALYSIS_DATA[cName];
  if (
    cName === "United Kingdom" ||
    cName === "Canada" ||
    cName === "Australia" ||
    cName === "United States"
  ) {
    return REGIONAL_ANALYSIS_DATA["United States of America"];
  }
  return REGIONAL_ANALYSIS_DATA["Nigeria"];
}

const GLOBE_MARKERS = [
  // India (Hindi, Tamil, Malayalam)
  { lat: 28.61, lng: 77.2 },
  { lat: 13.08, lng: 80.27 },
  { lat: 9.93, lng: 76.26 },
  // Persia (Farsi)
  { lat: 35.68, lng: 51.38 },
  // Philippines (Tagalog)
  { lat: 14.59, lng: 120.98 },
  // English (USA, UK, Canada, Australia)
  { lat: 38.9, lng: -77.03 },
  { lat: 34.05, lng: -118.24 },
  { lat: 51.5, lng: -0.12 },
  { lat: 45.42, lng: -75.69 },
  { lat: -33.86, lng: 151.2 },
  // Malay (Malaysia / Singapore)
  { lat: 3.13, lng: 101.68 },
  { lat: 1.35, lng: 103.81 },
  // Yoruba (Nigeria / West Africa)
  { lat: 6.52, lng: 3.37 },
  // China (Mandarin)
  { lat: 31.23, lng: 121.47 },
  { lat: 39.9, lng: 116.4 },
];

const GLOBE_STYLE_CONFIG: CSSProperties = { width: "100%", height: "100%", minHeight: "440px" };
const GLOBE_COVERED_CONFIG = {
  countries: [
    "India",
    "Iran",
    "Philippines",
    "Egypt",
    "China",
    "United States of America",
    "United Kingdom",
    "Canada",
    "Australia",
    "Nigeria",
  ],
  highlightColor: "#FFFFFF",
  indiaColor: "#FFFFFF",
};
const GLOBE_DOTS_CONFIG = {
  color: "#ffffff",
  size: 4,
  density: 7,
  allDots: false,
};
const GLOBE_MARKERS_CONFIG = {
  markers: [],
  color: "transparent",
  size: 0,
};

// ─── Component ───────────────────────────────────────────────────────────────

function LandingPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useGlobalLanguage();
  const { isAdmin } = useAdminAuth();
  const { cmsData } = useCmsContent();
  const [mounted, setMounted] = useState(false);
  const [selectedRegionKey, setSelectedRegionKey] = useState<string>("Nigeria");

  const handleGlobeHover = useCallback((cName: string | null) => {
    if (!cName) return;
    const mapped =
      cName === "United Kingdom" ||
      cName === "Canada" ||
      cName === "Australia" ||
      cName === "United States"
        ? "United States of America"
        : cName;
    if (REGIONAL_ANALYSIS_DATA[mapped]) {
      setSelectedRegionKey(mapped);
    }
  }, []);
  const [isMuted, setIsMuted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [activeReadingStep, setActiveReadingStep] = useState<WorkflowStep | null>(null);
  const [hoveredStrip, setHoveredStrip] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const heroIframeSrc = useMemo(() => {
    let url =
      cmsData.hero.videoUrl ||
      "https://www.youtube-nocookie.com/embed/PD9gqRc8VTU?autoplay=1&mute=1&loop=1&playlist=PD9gqRc8VTU&controls=0&showinfo=0&rel=0&playsinline=1&enablejsapi=1&modestbranding=1&start=60";
    // Always start with mute=1 in initial src so browser autoplay policy NEVER blocks video or shows the YouTube play button!
    if (url.includes("mute=0")) {
      url = url.replace(/mute=0/g, "mute=1");
    } else if (!url.includes("mute=1")) {
      url += (url.includes("?") ? "&" : "?") + "mute=1";
    }
    if (!url.includes("autoplay=1")) {
      url += (url.includes("?") ? "&" : "?") + "autoplay=1";
    }
    if (!url.includes("playsinline=1")) {
      url += (url.includes("?") ? "&" : "?") + "playsinline=1";
    }
    if (!url.includes("enablejsapi=1")) {
      url += (url.includes("?") ? "&" : "?") + "enablejsapi=1";
    }
    return url;
  }, [cmsData.hero.videoUrl]);

  useEffect(() => {
    setMounted(true);
    const delay = (cmsData.hero.videoDelaySeconds || 2.5) * 1000;
    const timer = setTimeout(() => {
      setVideoReady(true);
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*");
        if (!isMuted) {
          iframeRef.current.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', "*");
        }
      }
    }, delay);

    // On user's first interaction anywhere on page, guarantee play and unmute if unmuted mode is active
    const handleFirstInteraction = () => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*");
        if (!isMuted) {
          iframeRef.current.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', "*");
        }
      }
    };
    window.addEventListener("click", handleFirstInteraction, { passive: true });
    window.addEventListener("touchstart", handleFirstInteraction, { passive: true });
    window.addEventListener("keydown", handleFirstInteraction, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [cmsData.hero.videoDelaySeconds, isMuted]);

  // Close reader modal on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveReadingStep(null);
      }
    };
    if (activeReadingStep) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [activeReadingStep]);

  const toggleSound = () => {
    if (!iframeRef.current?.contentWindow) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    const command = nextMuted
      ? '{"event":"command","func":"mute","args":""}'
      : '{"event":"command","func":"unMute","args":""}';
    iframeRef.current.contentWindow.postMessage(command, "*");
    iframeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*");
  };

  async function handleWaitlist(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      await joinWaitlist({ data: { email: email.trim() } });
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div
      className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#A11C28] selection:text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── GLOBAL SIDEBAR & MOBILE NAVIGATION (NO TOP NAVBAR) ───────── */}
      <GlobalSidebar />

      {/* ── MAIN CONTENT CONTAINER (PADDED FOR COLLAPSED SIDEBAR) ─────── */}
      <div className="pl-0 md:pl-18 lg:pl-20 min-h-screen">
        {/* ── 1. HERO SECTION: YAHWEH THE GOD WHO REVEALS HIS POWER ────────── */}
        <section
          id="hero"
          className="relative w-full overflow-hidden bg-black flex flex-col justify-end min-h-[92vh] lg:min-h-screen pt-20 pb-28 md:pb-36 lg:pb-40 px-6 md:px-12"
        >
          {/* Admin Floating In-Place Edit Link */}
          {isAdmin && (
            <Link
              to="/admin"
              search={{ tab: "hero" }}
              className="absolute top-6 right-6 z-30 flex items-center gap-2 bg-[#A11C28] hover:bg-[#7F151F] text-white text-xs font-bold px-3 py-1.5 rounded-none shadow-xl shadow-black/80 uppercase tracking-wider transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Hero Showcase
            </Link>
          )}

          {/* Hero Media: Still Image (shows immediately) + YouTube Video (fades in after 2.5s) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Still hero image — always present, fades out as video loads */}
            <img
              src={cmsData.hero.heroImage}
              alt={cmsData.hero.title}
              className={`absolute inset-0 w-full h-full object-cover object-[70%_center] md:object-[65%_center] lg:object-center select-none transition-opacity duration-1000 ${videoReady ? "opacity-0" : "opacity-100"}`}
              loading="eager"
              decoding="async"
            />

            {/* YouTube background video — starts 1 min in (&start=60), fades in after delay */}
            <div
              className={`absolute inset-0 transition-opacity duration-1500 ${videoReady ? "opacity-100" : "opacity-0"}`}
            >
              <iframe
                ref={iframeRef}
                src={heroIframeSrc}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute w-[177.78%] h-[177.78%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ border: "none" }}
                title="Visual Bible Hero Video"
              />
            </div>

            {/* Directional Gradient: Darker on left behind text, transparent on right for image/video clarity */}
            <div
              className="absolute inset-0 z-10"
              style={{
                background: `
                  linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.65) 30%, rgba(0,0,0,0.15) 55%, transparent 70%),
                  linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 60%, rgba(0,0,0,0.85) 85%, #000000 100%)
                `,
              }}
            />
          </div>

          {/* Hero Metadata & Show Info (Refined, 25% smaller, premium OTT placement) */}
          <div className="relative z-10 max-w-lg md:max-w-xl">
            {/* Brand Pill */}
            <div className="flex items-center gap-2 mb-2.5">
              <img
                src="/assets/nrim-logo-white.png"
                alt="NRIM"
                className="h-4 w-auto object-contain"
              />
              <span className="text-[10px] font-bold tracking-[0.25em] text-white/90 uppercase">
                VISUAL BIBLE TV · UPCOMING PREMIERE
              </span>
            </div>

            {/* Tagline */}
            <div className="text-[11px] font-semibold tracking-[0.2em] text-[#C4A468] uppercase mb-1">
              {cmsData.hero.tagline}
            </div>

            {/* Title */}
            <h1
              className="font-black tracking-tight text-white leading-[1.08] mb-2"
              style={{ fontSize: "clamp(32px, 5vw, 60px)" }}
            >
              {cmsData.hero.title}
            </h1>

            {/* Subtitle */}
            <p className="text-white/85 text-xs md:text-sm font-semibold tracking-wider uppercase mb-3">
              {cmsData.hero.subtitle}
            </p>

            {/* Badges */}
            <div className="flex items-center gap-2 text-xs text-white/80 mb-3.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                In Production 2026
              </span>
              <span className="text-white/50 text-[11px]">Season 2</span>
              <span className="border border-white/30 px-1.5 py-0.5 text-[9px] font-semibold text-white/80 rounded-[2px] leading-none">
                ALL AGES
              </span>
              <span className="text-white/50 text-[11px]">Target: 100 Languages</span>
              <span className="border border-white/30 px-1.5 py-0.5 text-[9px] font-bold text-white/90 rounded-[2px] leading-none tracking-wider">
                VISION
              </span>
              <span className="border border-white/30 px-1.5 py-0.5 text-[9px] font-bold text-white/90 rounded-[2px] leading-none tracking-wider">
                5.1 AUDIO
              </span>
              <span className="border border-white/30 px-1.5 py-0.5 text-[9px] font-bold text-white/90 rounded-[2px] leading-none tracking-wider">
                4K HDR
              </span>
            </div>

            {/* Synopsis */}
            <p className="text-white/75 text-xs md:text-[13px] leading-relaxed mb-5 max-w-md line-clamp-3">
              {cmsData.hero.synopsis}
            </p>

            {/* Action Buttons & Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="#waitlist"
                className="flex items-center gap-2.5 bg-[#A11C28] hover:bg-[#7F151F] text-white text-sm font-bold px-6 py-2.5 rounded-none transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-red-950/50 uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" />
                Join The Premiere Waitlist
              </a>
              <Link
                to="/watch"
                search={{ episode: "genesis" }}
                className="flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-sm font-semibold px-5 py-2.5 rounded-none hover:bg-white/25 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Watch Genesis First
              </Link>
              {/* Sound toggle — only visible after video loads */}
              {videoReady && (
                <button
                  type="button"
                  onClick={toggleSound}
                  className="flex items-center gap-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 hover:border-white/40 text-white text-xs font-semibold px-3.5 py-2.5 rounded-none transition-all shadow-md"
                  aria-label={isMuted ? "Unmute video banner" : "Mute video banner"}
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-white/70" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>{isMuted ? "Unmute Audio" : "Mute Audio"}</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── 2. CAROUSEL: EXISTING PROJECTS (GENESIS, JOSEPH, & LANGUAGES) ── */}
        <section
          id="vault"
          className="-mt-20 md:-mt-28 lg:-mt-36 relative z-20 px-6 md:px-12 pt-8 pb-12 bg-gradient-to-t from-[#09090d] via-[#09090d]/95 to-transparent border-t border-white/[0.08]"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-bold text-white tracking-wide">
                Existing Productions · The Genesis Vault & Languages
              </h2>
              {isAdmin && (
                <Link
                  to="/admin"
                  search={{ tab: "vault" }}
                  className="ml-2 flex items-center gap-1.5 bg-[#A11C28]/25 hover:bg-[#A11C28] text-white border border-[#A11C28]/40 text-[11px] font-bold px-2.5 py-0.5 rounded transition-colors"
                >
                  <Edit3 className="w-3 h-3" /> Edit Posters
                </Link>
              )}
            </div>
            <Link
              to="/watch"
              className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors"
            >
              View all releases <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Vertical Poster Carousel */}
          <div
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
          >
            {cmsData.vaultProductions.map((card) => (
              <Link
                key={card.id}
                to="/watch"
                search={{ episode: card.episode, mode: "vod" }}
                className="relative shrink-0 group cursor-pointer transition-transform duration-300 hover:scale-105"
                style={{ width: "clamp(155px, 16vw, 215px)" }}
              >
                <div
                  className="w-full overflow-hidden rounded bg-[#141419] border border-white/[0.08] relative shadow-lg"
                  style={{ aspectRatio: "2/3" }}
                >
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover" />

                  {/* Corner Brand Badge */}
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-none bg-black/80 backdrop-blur-md border border-white/20 flex items-center gap-1 shadow">
                    <img
                      src="/assets/nrim-logo-white.png"
                      alt="NRIM"
                      className="h-3 w-auto object-contain"
                    />
                    <span className="text-[8px] font-black tracking-widest text-white uppercase">
                      TV
                    </span>
                  </div>

                  {/* Bottom Banner */}
                  <div className="absolute bottom-0 left-0 right-0 bg-[#A11C28] text-white text-center py-1 font-bold text-[10px] tracking-wider uppercase shadow-md truncate px-1">
                    {(card.badge || "").replace(/\s*audio\s*/gi, "").trim()}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-3 text-center">
                    <div className="w-10 h-10 rounded-none bg-white flex items-center justify-center mb-2 shadow">
                      <Play className="w-4 h-4 fill-black text-black ml-0.5" />
                    </div>
                    <span className="text-xs font-bold text-white leading-tight">Watch Stream</span>
                    <span className="text-[10px] text-white/70 mt-1 line-clamp-2">
                      {card.subtitle}
                    </span>
                  </div>
                </div>

                <p className="mt-1.5 text-xs font-semibold text-white/90 truncate">{card.title}</p>
                <p className="text-[10px] text-white/50 truncate">
                  {(card.language || "").replace(/\s*audio\s*/gi, "").trim()}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 3. THE VISUAL BIBLE PITCH SECTION (ORIGINKIT 3D TUNNEL) ───── */}
        <section
          id="pitch"
          aria-label="The Visual Bible Pitch"
          className="relative isolate flex min-h-[750px] w-full items-center justify-center overflow-hidden bg-black py-20 px-6 md:px-12 border-t border-white/[0.08]"
        >
          {/* Originkit Three.js 3D Tunnel in Background (Crisp, High-Opacity, Steady Speed) */}
          {mounted && (
            <div aria-hidden="true" className="pointer-events-auto absolute inset-0 z-0 opacity-95">
              <GalleryTunnel
                images={PITCH_TUNNEL_IMAGES}
                background="#000000"
                lineColor="#33333e"
                lineOpacity={25}
                grid={6}
                speed={14}
                boost={32}
                fade={95}
                label={false}
                cellMode="square"
              />
            </div>
          )}

          {/* Frosted Glass Pitch Card: Straight Cinema Bleed Card */}
          <div className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center bg-black/75 backdrop-blur-md p-6 md:p-12 rounded-none border border-white/15 shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-white/10 border border-white/20 text-white text-[11px] font-bold tracking-[0.2em] uppercase mb-4 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#A11C28] animate-pulse" />A Production of
              NRIM
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
              VISUAL BIBLE: Until All Hear: Every Language, Every Nation.
            </h2>

            <p className="text-white/80 text-xs md:text-sm leading-relaxed max-w-2xl mx-auto mb-8 font-medium">
              Bringing the Bible to life through an AI production pipeline using real people and
              transforming them into characters from the Bible.
            </p>

            {/* Highlights Bar: 1M+ views, 88 countries, 8 live languages, 100 Target */}
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/15 mb-8 rounded-none">
              <div className="flex flex-col items-center p-5 bg-[#0a0a0f] rounded-none">
                <span className="text-2xl md:text-3xl font-black text-white leading-none mb-1">
                  1M+
                </span>
                <span className="text-xs font-bold text-white/80">Views Worldwide</span>
                <span className="text-[10px] text-white/40 mt-0.5">Streaming Reach</span>
              </div>
              <div className="flex flex-col items-center p-5 bg-[#0a0a0f] rounded-none">
                <span className="text-2xl md:text-3xl font-black text-white leading-none mb-1">
                  88
                </span>
                <span className="text-xs font-bold text-white/80">Countries</span>
                <span className="text-[10px] text-white/40 mt-0.5">Global Viewership</span>
              </div>
              <div className="flex flex-col items-center p-5 bg-[#0a0a0f] rounded-none">
                <span className="text-2xl md:text-3xl font-black text-white leading-none mb-1">
                  8
                </span>
                <span className="text-xs font-bold text-white/80">Live Languages</span>
                <span className="text-[10px] text-white/40 mt-0.5">Current Broadcast</span>
              </div>
              <div className="flex flex-col items-center p-5 bg-[#0a0a0f] rounded-none">
                <span className="text-2xl md:text-3xl font-black text-[#A11C28] leading-none mb-1">
                  100
                </span>
                <span className="text-xs font-bold text-white/90">Target Languages</span>
                <span className="text-[10px] text-white/50 mt-0.5">Production Goal</span>
              </div>
            </div>

            {/* Pitch CTAs */}
            <div className="flex items-center gap-3.5 flex-wrap justify-center">
              <Link
                to="/watch"
                className="flex items-center gap-2 bg-[#A11C28] hover:bg-[#7F151F] text-white text-xs md:text-sm font-bold px-6 py-3 rounded-none transition-transform hover:scale-105 shadow-lg shadow-red-950/50 uppercase tracking-wider"
              >
                <Play className="w-4 h-4 fill-white" />
                Watch Live Stream
              </Link>
              <a
                href="#workflow"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs md:text-sm font-semibold px-5 py-3 rounded-none transition-colors"
              >
                <Cpu className="w-4 h-4" />
                Our Technical Workflow
              </a>
              <a
                href="https://nrim.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
              >
                About NRIM <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* ── 4. TECHNICAL WORKFLOW: HORIZONTAL 35MM FILM STRIP ───────── */}
        <section
          id="workflow"
          className="py-20 px-4 md:px-8 lg:px-12 w-full bg-[#08080c] border-t border-white/[0.08] relative overflow-hidden"
        >
          <div className="w-full">
            {/* Section Header */}
            <div className="mb-10 text-left">
              <span className="text-xs font-semibold tracking-widest text-white/50 uppercase block mb-2">
                Production Methodology · 35mm Film Archive
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.08] tracking-tight mb-3">
                The Message is the Same.
                <br />
                <span className="text-white/40">The Medium is Different.</span>
              </h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-3xl">
                Hollywood virtual production horsepower meets relentless apostolic passion. Hover over any celluloid frame below to reveal the methodology, or click to open full production notes.
              </p>
            </div>

            {/* ── CONTINUOUS 35MM HORIZONTAL FILM STRIP CHASSIS ── */}
            <div className="w-full overflow-hidden border-y border-white/20 bg-[#07070b] shadow-2xl mb-12 rounded-none">
              {/* Top Film Sprocket Row: High-Contrast Cinema Celluloid */}
              <div className="bg-[#050508] border-b border-white/10 px-4 py-2.5 flex items-center justify-between overflow-hidden select-none relative">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <div className="flex items-center gap-3 w-full justify-between">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-1.5 shrink-0">
                      <div className="w-4 h-2.5 bg-black border border-white/50 shadow-[inset_0_1px_3px_rgba(255,255,255,0.5),0_0_2px_rgba(0,0,0,0.9)]" />
                      {i % 4 === 0 && (
                        <span className="text-[7px] font-mono text-white/35 font-bold uppercase tracking-wider hidden sm:inline">
                          NRIM 5219
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Film Frames Side-by-Side Grid with Authentic Celluloid Border */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-[#0a0a0e]">
                {WORKFLOW_STEPS.map((step, idx) => {
                  const isHovered = hoveredStrip === step.id;
                  return (
                    <div
                      key={step.id}
                      onClick={() => setActiveReadingStep(step)}
                      onMouseEnter={() => setHoveredStrip(step.id)}
                      onMouseLeave={() => setHoveredStrip(null)}
                      className={`group relative flex flex-col rounded-none overflow-hidden border-b md:border-b-0 ${
                        idx < WORKFLOW_STEPS.length - 1 ? "md:border-r" : ""
                      } transition-all duration-300 bg-black cursor-pointer ${
                        isHovered ? "border-[#A11C28]" : "border-white/15"
                      }`}
                      role="button"
                      tabIndex={0}
                      aria-label={`Read story and production details for ${step.title}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveReadingStep(step);
                        }
                      }}
                    >
                      {/* Frame Header Stamp: Cinema Slate Designation */}
                      <div className="px-3.5 py-1.5 bg-[#09090f] flex items-center justify-between text-[10px] font-mono border-b border-white/10 select-none z-20 relative">
                        <span className="font-bold text-white/80 tracking-wide">{step.code}</span>
                        <span className="text-[#A11C28] font-black tracking-wider">
                          {step.frameCode}
                        </span>
                      </div>

                      {/* Frame Photo with smooth hover zoom & slide reveal overlay */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-20" />

                        {/* Default Visible Badge (slides away on hover) */}
                        <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-none bg-black/85 backdrop-blur-md text-[10px] font-mono font-bold text-white/95 border border-white/15 shadow transition-all duration-300 group-hover:opacity-0 group-hover:-translate-x-2">
                          {step.stepNumber} // {step.badge}
                        </div>

                        {/* ── HOVER SLIDE REVEAL OVERLAY (Left-to-Right Slide Animation) ── */}
                        <div className="absolute inset-0 bg-[#07070bee] backdrop-blur-md p-4 md:p-5 flex flex-col justify-between text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] -translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 z-10 rounded-none">
                          <div>
                            <span className="text-[10px] font-semibold tracking-widest text-[#ff6b78] uppercase block mb-1">
                              {step.stepNumber} · {step.pillarLabel}
                            </span>
                            <h4 className="text-sm md:text-base font-black text-white tracking-tight leading-snug mb-2">
                              {step.title}
                            </h4>
                            <p className="text-xs text-white/80 leading-relaxed font-sans line-clamp-3 md:line-clamp-4">
                              {step.extendedDesc}
                            </p>
                          </div>

                          <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
                            <span className="text-[10px] text-white/50 uppercase tracking-wider font-sans">
                              Visual Bible Pipeline
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveReadingStep(step);
                              }}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#A11C28] hover:bg-[#7F151F] px-3.5 py-1.5 shadow-lg transition-transform hover:scale-105 cursor-pointer uppercase tracking-wider rounded-none"
                            >
                              <span>Read More</span>
                              <BookOpen className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Frame Footer Stamp: Motion Picture Stock Markings */}
                      <div className="px-3.5 py-1 bg-[#09090f] flex items-center justify-between text-[9px] font-mono text-white/50 border-t border-white/10 select-none z-20 relative">
                        <span className="tracking-wider">24 FPS · RAW EMBODIMENT</span>
                        <span className="font-bold text-white/60">NRIM CINEMA 5219</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Film Sprocket Row: High-Contrast Cinema Celluloid */}
              <div className="bg-[#050508] border-t border-white/10 px-4 py-2.5 flex items-center justify-between overflow-hidden select-none relative">
                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <div className="flex items-center gap-3 w-full justify-between">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-1.5 shrink-0">
                      <div className="w-4 h-2.5 bg-black border border-white/50 shadow-[inset_0_1px_3px_rgba(255,255,255,0.5),0_0_2px_rgba(0,0,0,0.9)]" />
                      {i % 4 === 2 && (
                        <span className="text-[7px] font-mono text-white/35 font-bold uppercase tracking-wider hidden sm:inline">
                          SAFETY FILM
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── WORKFLOW PILLAR IN-DEPTH READING MODAL ── */}
            {activeReadingStep && (
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="reading-modal-title"
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
                onClick={() => setActiveReadingStep(null)}
              >
                <div
                  className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#08080c] border border-white/20 shadow-2xl overflow-hidden text-left rounded-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header Bar with Cinema Slate */}
                  <div className="flex items-center justify-between px-6 py-4 bg-[#050508] border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-white/80 tracking-wider">
                        {activeReadingStep.code} · {activeReadingStep.frameCode}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 border border-white/15 bg-white/10 text-white/90 rounded-none">
                        {activeReadingStep.badge}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveReadingStep(null)}
                      className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer rounded-none"
                      aria-label="Close reader"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modal Scrollable Body */}
                  <div className="overflow-y-auto p-6 md:p-8 space-y-8">
                    {/* Hero Visual & Headline */}
                    <div className="relative overflow-hidden aspect-[21/9] border border-white/15 bg-black rounded-none">
                      <img
                        src={activeReadingStep.image}
                        alt={activeReadingStep.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-black/40 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-xs font-semibold tracking-widest text-[#ff6b78] uppercase block mb-1">
                          {activeReadingStep.stepNumber} · {activeReadingStep.pillarLabel}
                        </span>
                        <h2
                          id="reading-modal-title"
                          className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight"
                        >
                          {activeReadingStep.title}
                        </h2>
                      </div>
                    </div>

                    {/* Subtitle & Theological Overview */}
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-white/90 mb-3 leading-snug">
                        {activeReadingStep.readingNotes.subtitle}
                      </h3>
                      <p className="text-sm md:text-base text-white/80 leading-relaxed font-sans font-normal">
                        {activeReadingStep.readingNotes.overview}
                      </p>
                    </div>

                    {/* Deep Dive Sections Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/15">
                      {activeReadingStep.readingNotes.sections.map((sec, idx) => (
                        <div
                          key={idx}
                          className="p-5 bg-[#08080c] flex flex-col justify-between rounded-none"
                        >
                          <div>
                            <span className="text-[11px] font-mono text-white/40 block mb-2 font-bold">
                              0{idx + 1} // ARCHITECTURE
                            </span>
                            <h4 className="text-base font-bold text-white mb-2 leading-snug">
                              {sec.heading}
                            </h4>
                            <p className="text-xs md:text-sm text-white/70 leading-relaxed font-sans">
                              {sec.body}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Theological Scripture Mandate Callout */}
                    <div className="p-6 bg-[#0c0c12] border border-white/15 text-left rounded-none">
                      <div className="flex items-center gap-2 mb-2 text-xs font-semibold tracking-wider uppercase text-white/50">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Scriptural Foundation</span>
                      </div>
                      <blockquote className="text-sm md:text-base italic text-white/90 leading-relaxed mb-3">
                        "{activeReadingStep.readingNotes.theologicalMandate}"
                      </blockquote>
                      <span className="text-xs font-bold text-white/60">
                        {activeReadingStep.readingNotes.scriptureReference}
                      </span>
                    </div>

                    {/* Production Metrics Row */}
                    <div className="grid grid-cols-3 gap-px bg-white/10 border border-white/15 text-center">
                      {activeReadingStep.readingNotes.productionMetrics.map((met, i) => (
                        <div key={i} className="p-4 bg-[#08080c] rounded-none">
                          <span className="text-[10px] uppercase tracking-wider text-white/40 block mb-1">
                            {met.label}
                          </span>
                          <span className="text-xs md:text-sm font-bold text-white block">
                            {met.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Modal Footer Controls */}
                  <div className="px-6 py-4 bg-[#050508] border-t border-white/10 flex items-center justify-between shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const currIdx = WORKFLOW_STEPS.findIndex((s) => s.id === activeReadingStep.id);
                        const nextIdx = (currIdx + 1) % WORKFLOW_STEPS.length;
                        setActiveReadingStep(WORKFLOW_STEPS[nextIdx]);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-white/80 transition-colors cursor-pointer rounded-none"
                    >
                      <span>Next Pillar</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveReadingStep(null)}
                      className="bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-5 py-2 transition-colors cursor-pointer uppercase tracking-wider rounded-none"
                    >
                      Close Reader
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── BEHIND THE SCENES VIDEO SHOWCASE ── */}
            <div className="w-full overflow-hidden border-y border-white/15 bg-[#07070b] p-6 md:p-10 lg:p-12 text-left rounded-none">
              <div className="mb-6">
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
                  Inside the Technology & Calling
                </h3>
                <p className="text-sm text-white/70 leading-relaxed font-sans max-w-4xl">
                  Witness how real human actors, photorealistic virtual sets, and neural multilingual vocalization converge to bring Scripture to life across 100 languages.
                </p>
              </div>

              {/* 16:9 Cinema Frame Embed */}
              <div className="relative aspect-video w-full rounded-none overflow-hidden border border-white/20 bg-black shadow-2xl">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/3DULIG3sDS8?rel=0&modestbranding=1"
                  title="Visual Bible Studio Production Reel"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              {/* Video Footer Metadata */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between flex-wrap gap-3 text-xs">
                <div className="text-white/50 text-xs font-sans">
                  Official Workflow Featurette · 4K HDR Broadcast Master
                </div>
                <a
                  href="https://www.youtube.com/watch?v=3DULIG3sDS8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-white hover:text-[#ff4d5e] transition-colors font-medium rounded-none"
                >
                  <span>Open in YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. THE INFINITE SCRIPTURE ARCHIVE (ORIGINKIT INFINITE GRID) ────── */}
        <section
          id="archive"
          className="py-24 px-6 md:px-12 bg-black border-t border-white/[0.08] relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto mb-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
              <div>
                <span className="text-xs font-semibold tracking-widest text-white/50 uppercase block mb-2">
                  The Living Universe · Infinite Canvas
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3">
                  Explore the Universe of the Visual Bible
                </h2>
                <p className="text-white/70 text-sm md:text-base max-w-4xl leading-relaxed">
                  An unbounded canvas of scripture. Drag in any direction to explore completed Genesis chapters, patriarch character studies, and upcoming releases across all languages.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 flex-wrap">
                {isAdmin && (
                  <Link
                    to="/admin"
                    search={{ tab: "archive" }}
                    className="flex items-center gap-1.5 bg-[#A11C28]/25 hover:bg-[#A11C28] text-white border border-[#A11C28]/40 text-xs font-bold px-3 py-2 rounded-none transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Canvas in Studio
                  </Link>
                )}
                <div className="hidden sm:flex items-center gap-2 text-xs font-sans text-white/50 bg-white/[0.04] border border-white/[0.08] px-3.5 py-2 rounded-none">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Drag canvas in any direction · Click poster to open</span>
                </div>
                <Link
                  to="/watch"
                  className="flex items-center gap-2 bg-[#A11C28] hover:bg-[#7F151F] text-white text-xs font-bold px-4 py-2 rounded-none transition-colors uppercase tracking-wider"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Watch Full Catalog
                </Link>
              </div>
            </div>
          </div>

          {/* Infinite Canvas Frame - Straight Bleed Into Frame */}
          <div className="relative w-full h-[640px] md:h-[720px] rounded-none overflow-hidden border-y border-white/15 bg-[#070709] select-none">
            {mounted && (
              <InfiniteGrid
                items={
                  (cmsData.archiveItems && cmsData.archiveItems.length
                    ? cmsData.archiveItems
                    : INFINITE_ARCHIVE_ITEMS) as unknown as GridItem[]
                }
                columns={5}
                cardWidth={200}
                radius={0}
                gap={28}
                background="#070709"
                textColor="#ffffff"
                mutedColor="#888894"
                aspectRatio="2 / 3"
                blobs={false}
                onItemClick={(item) => {
                  const archiveItem = item as unknown as ArchiveGridItem;
                  if (archiveItem.linkUrl) {
                    if (
                      archiveItem.linkUrl.startsWith("http://") ||
                      archiveItem.linkUrl.startsWith("https://")
                    ) {
                      window.open(archiveItem.linkUrl, "_blank", "noopener,noreferrer");
                    } else {
                      navigate({ to: archiveItem.linkUrl });
                    }
                  } else {
                    const ep = archiveItem.episode || "genesis-46-50";
                    navigate({ to: "/watch", search: { episode: ep, mode: "vod" } });
                  }
                }}
                style={{ width: "100%", height: "100%" }}
              />
            )}

            {/* Edge Vignette Overlays for seamless blending */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#070709] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#070709] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#070709] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#070709] to-transparent z-10" />

            {/* Bottom Floating Pill */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-2 bg-black/90 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-none text-[11px] text-white/80 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A11C28]" />
              <span>16 Productions & Regional Editions Loaded · Click any poster to watch</span>
            </div>
          </div>
        </section>

        {/* ── 6. UPCOMING PROJECTS & PRODUCTIONS (ORIGINKIT ACCORDION-OS) ── */}
        <section
          id="upcoming-projects"
          className="py-24 px-6 md:px-12 bg-black border-t border-white/[0.08] relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div>
              <span className="text-xs font-semibold tracking-widest text-white/50 uppercase block mb-2">
                Production Slate · What's Ahead
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-2">
                Upcoming Projects
              </h2>
              <p className="text-white/65 text-xs md:text-sm max-w-xl">
                The expanding cinematic universe of the Visual Bible. From the epic release of
                YAHWEH to the complete Genesis broadcast series, episodic television, and character
                chronicles.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {isAdmin && (
                <Link
                  to="/admin"
                  search={{ tab: "projects" }}
                  className="flex items-center gap-1.5 bg-[#A11C28]/25 hover:bg-[#A11C28] text-white border border-[#A11C28]/40 text-xs font-bold px-3 py-2 rounded-none transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Slate in Studio
                </Link>
              )}
              <a
                href="#waitlist"
                className="flex items-center gap-2 bg-[#A11C28] hover:bg-[#7F151F] text-white text-xs font-bold px-5 py-2.5 rounded-none transition-colors uppercase tracking-wider shadow-lg shadow-red-950/40"
              >
                <Plus className="w-4 h-4" />
                Join Premiere Waitlist
              </a>
            </div>
          </div>

          {/* Originkit AccordionOS Interactive Canvas Frame - Straight Bleed Into Frame */}
          <div className="relative w-full h-[540px] md:h-[620px] rounded-none overflow-hidden border-y border-white/15 bg-[#09090d]">
            {mounted && (
              <AccordionOS
                items={cmsData.upcomingProjects}
                defaultOpen={1}
                autoplay={true}
                interval={4.5}
                pauseOnHover={true}
                radius={0}
                scale={100}
                background="#09090d"
                font={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.01em" }}
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </div>
        </section>

        {/* ── 6. GLOBAL LANGUAGES REACHED (ORIGINKIT 3D GLOBE) ─────────── */}
        <section
          id="languages"
          className="py-16 md:py-24 w-full bg-black border-t border-white/15 overflow-hidden rounded-none"
        >
          <div className="w-full">
            {/* Header: Clean Cinema Framing */}
            <div className="w-full px-6 md:px-12 lg:px-16 text-left mb-10">
              <span className="text-[11px] font-semibold tracking-[0.25em] text-white/50 uppercase block mb-2 font-sans">
                Global Geospatial Telemetry · 88 Nations Reached
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-2 tracking-tight">
                Languages Reached Across the Earth
              </h2>
              <p className="text-white/65 text-sm md:text-base leading-relaxed max-w-4xl">
                Scripture released and streaming in 8 major native languages across Asia, the Middle
                East, the Pacific, and the Americas — advancing toward our goal of 100 languages.
              </p>
            </div>

            {/* Split Grid: Bleeds edge-to-edge into frame, straight borders, zero rounded corners */}
            <div className="w-full grid lg:grid-cols-12 border-y border-white/15 bg-black rounded-none">
              {/* Left Column: Originkit Interactive 3D Globe - Full Flush Bleed */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[640px] md:min-h-[720px] h-[640px] md:h-[720px] w-full overflow-hidden bg-[#050508] border-b lg:border-b-0 lg:border-r border-white/15 rounded-none">
                {mounted ? (
                  <Globe
                    focusCountry={selectedRegionKey}
                    style={GLOBE_STYLE_CONFIG}
                    direction="right"
                    speed={1.4}
                    scale={9}
                    stopOnHover={true}
                    fill="solid"
                    fillColor="#1c1c24"
                    oceanColor="#000000"
                    showOutline={true}
                    outlineColor="#444452"
                    showGrid={true}
                    graticuleColor="#14141c"
                    onHoverCountry={handleGlobeHover}
                    coveredRegions={GLOBE_COVERED_CONFIG}
                    dots={GLOBE_DOTS_CONFIG}
                    markerConfig={GLOBE_MARKERS_CONFIG}
                    initialLatitude={18}
                    initialLongitude={40}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30 text-xs font-sans uppercase tracking-widest">
                    Initializing Global Geospatial Telemetry...
                  </div>
                )}

                {/* Flush Straight Caption Bar */}
                <div className="absolute bottom-0 inset-x-0 flex items-center justify-between text-xs tracking-wider uppercase text-white/60 pointer-events-none px-6 py-3 bg-black/90 backdrop-blur-md border-t border-white/10 font-sans rounded-none">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white" />
                    Highlighted Territorials: Active Linguistic Productions
                  </span>
                  <span className="hidden sm:inline text-white/40">Drag to Orbit</span>
                </div>
              </div>

              {/* Right Column: Architectural Demographic Dossier - Straight & Flush */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-[#08080c] p-6 md:p-8 lg:p-10 text-left min-h-[640px] md:min-h-[720px] h-[640px] md:h-[720px] overflow-hidden rounded-none">
                {/* Dossier Header */}
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-6">
                    <span className="text-xs font-semibold tracking-widest text-white/60 uppercase font-sans">
                      Demographic Reach Analysis
                    </span>
                    <span className="text-xs text-white/40 uppercase tracking-wider font-sans">
                      Select or Hover Region
                    </span>
                  </div>

                  {/* Territory Selector Grid: Clean Technical Segmented Bar (Straight Flush Cuts) */}
                  <div className="grid grid-cols-4 gap-px bg-white/10 border border-white/15 mb-6 rounded-none">
                    {[
                      { key: "Nigeria", label: "Yorùbá", code: "47M" },
                      { key: "India", label: "India", code: "728M" },
                      { key: "China", label: "China", code: "1.18B" },
                      { key: "Iran", label: "Persia", code: "127M" },
                      { key: "Philippines", label: "Tagalog", code: "87M" },
                      { key: "Egypt", label: "Arabic", code: "400M" },
                      { key: "United States of America", label: "English", code: "1.5B" },
                    ].map((item) => {
                      const isSelected = selectedRegionKey === item.key;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setSelectedRegionKey(item.key)}
                          className={`px-3 py-2.5 text-left transition-all cursor-pointer rounded-none ${
                            isSelected
                              ? "bg-white text-black font-bold"
                              : "bg-[#0b0b10] text-white/70 hover:text-white hover:bg-white/[0.06]"
                          }`}
                        >
                          <div className="text-xs font-semibold truncate font-sans">
                            {item.label}
                          </div>
                          <div
                            className={`text-[11px] font-sans ${
                              isSelected ? "text-black/70 font-medium" : "text-white/40"
                            }`}
                          >
                            {item.code}
                          </div>
                        </button>
                      );
                    })}
                    {/* 8th Slot: 100 Languages Global Goal */}
                    <div className="px-3 py-2.5 text-left bg-[#0b0b10] flex flex-col justify-center rounded-none">
                      <div className="text-[10px] uppercase tracking-wider text-white/40 font-sans">
                        Target
                      </div>
                      <div className="text-xs text-white/90 font-bold font-sans">
                        100 Lang
                      </div>
                    </div>
                  </div>

                  {/* Active Dossier Content */}
                  {(() => {
                    const reg = getRegionAnalysis(selectedRegionKey);
                    return (
                      <div>
                        {/* Territory Title & Native Script */}
                        <div className="flex items-baseline justify-between gap-3 mb-1">
                          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                            {reg.name}
                          </h3>
                          <span className="text-xs text-white/40 shrink-0 font-sans">
                            {reg.nativeName}
                          </span>
                        </div>
                        <p className="text-xs text-white/50 tracking-wider uppercase mb-5 font-sans">
                          {reg.territory}
                        </p>

                        {/* Dual Data Terminal Cells: Pure Sharp Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/15 mb-5 font-sans rounded-none">
                          {/* Cell 1: Total Territory Population */}
                          <div className="p-4 bg-[#0b0b10] rounded-none">
                            <span className="text-[10px] font-semibold tracking-wider text-white/50 uppercase block mb-1">
                              Territory Population
                            </span>
                            <div className="text-base md:text-lg font-black text-white tracking-tight">
                              {reg.totalPopulation}
                            </div>
                            <span className="text-[11px] text-white/40 block mt-0.5">
                              Resident demographic base
                            </span>
                          </div>

                          {/* Cell 2: Potential Linguistic Reach */}
                          <div className="p-4 bg-[#0b0b10] rounded-none">
                            <span className="text-[10px] font-semibold tracking-wider text-white/50 uppercase block mb-1">
                              Potential Scripture Reach
                            </span>
                            <div className="text-base md:text-lg font-black text-white tracking-tight">
                              {reg.highlightStat}
                            </div>
                            <span className="text-[11px] text-white/40 block mt-0.5">
                              {reg.subStat}
                            </span>
                          </div>
                        </div>

                        {/* Editorial / Orality Breakdown (Straight Clean Box) */}
                        <div className="bg-[#0b0b10] border border-white/15 p-4 mb-5 rounded-none">
                          <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block mb-1 font-sans">
                            Orality & Visual Scripture Mission
                          </span>
                          <p className="text-xs text-white/80 leading-relaxed font-sans">
                            {reg.oralityInsight}
                          </p>
                        </div>

                        {/* Languages Covered Tags */}
                        <div className="flex items-center gap-2 flex-wrap mb-4">
                          <span className="text-xs text-white/40 font-sans">
                            Linguistic Tracks:
                          </span>
                          {reg.languages.map((l) => (
                            <span
                              key={l}
                              className="text-xs px-2.5 py-1 bg-white/[0.04] border border-white/15 text-white/90 font-medium font-sans rounded-none"
                            >
                              {l}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Dossier Footer Action Bar */}
                {(() => {
                  const reg = getRegionAnalysis(selectedRegionKey);
                  return (
                    <div className="pt-4 border-t border-white/15 flex items-center justify-between gap-4 flex-wrap">
                      <div className="min-w-0">
                        <span className="text-[10px] text-white/40 uppercase tracking-wider block font-sans">
                          Current Production
                        </span>
                        <span className="text-xs font-bold text-white block truncate font-sans">
                          {reg.activeRelease}
                        </span>
                      </div>

                      {reg.isExternal ? (
                        <a
                          href={reg.releaseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 bg-[#A11C28] hover:bg-[#7F151F] text-white text-xs font-bold px-5 py-2.5 uppercase tracking-wider transition-colors inline-flex items-center gap-2 rounded-none shadow-lg shadow-red-950/40"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          Watch Preview
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <Link
                          to={reg.releaseUrl as any}
                          className="shrink-0 bg-[#A11C28] hover:bg-[#7F151F] text-white text-xs font-bold px-5 py-2.5 uppercase tracking-wider transition-colors inline-flex items-center gap-2 rounded-none shadow-lg shadow-red-950/40"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          Watch Edition
                        </Link>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* ── SNEAK PEEK OF GENESIS IN THE YORUBA LANGUAGE SHOWCASE (Bleed Frame) ── */}
            <div className="w-full border-b border-white/15 bg-gradient-to-r from-red-950/30 via-[#0a0a10] to-[#050508] p-6 md:p-10 lg:p-12 relative overflow-hidden rounded-none">
              <div className="grid md:grid-cols-12 gap-8 items-center">
                {/* Left: Video Preview & Thumbnail - Straight Flush Frame */}
                <div className="md:col-span-5 relative overflow-hidden aspect-video border border-white/20 bg-black group shadow-2xl rounded-none">
                  <img
                    src="/assets/genesis-shepherds-poster.jpg"
                    alt="Sneak peek of Genesis in the Yoruba language"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Play Button Overlay linking to YouTube */}
                  <a
                    href="https://www.youtube.com/watch?v=DxNeDE-9J8A"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors"
                  >
                    <div className="w-14 h-14 bg-[#A11C28] text-white flex items-center justify-center shadow-2xl shadow-red-950/80 group-hover:scale-110 transition-transform rounded-none">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </a>

                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/90 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider border border-amber-500/40 rounded-none">
                    SNEAK PEEK LIVE
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/80">
                    <span className="font-semibold">Èdè Yorùbá · Nigeria</span>
                    <span className="font-mono text-white/50">YouTube 4K</span>
                  </div>
                </div>

                {/* Right: Description & Links */}
                <div className="md:col-span-7 flex flex-col justify-center text-left">
                  <span className="text-[11px] font-semibold tracking-[0.25em] text-[#C4A468] uppercase block mb-2 font-sans">
                    New Language Premiere · West Africa
                  </span>

                  <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-tight mb-3">
                    Sneak peek of Genesis in the Yoruba language
                  </h3>

                  <p className="text-xs md:text-sm text-white/75 leading-relaxed mb-6 max-w-3xl">
                    <strong className="text-white">The Yoruba Language (Èdè Yorùbá):</strong> Spoken by over 45 million native speakers primarily in southwestern and central Nigeria, southern Benin, and across the African diaspora in Brazil and the Caribbean. Yoruba is a musical, pluricentric Niger-Congo tonal language renowned for its vivid oral literature, poetry, and proverb traditions. This historic visual release translates the ancient creation account into the authentic cadence and acoustic depth of Yoruba storytelling.
                  </p>

                  <div className="flex items-center gap-3.5 flex-wrap">
                    <a
                      href="https://www.youtube.com/watch?v=DxNeDE-9J8A"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#A11C28] hover:bg-[#7F151F] text-white text-xs font-bold px-6 py-3 uppercase tracking-wider transition-all shadow-lg shadow-red-950/50 hover:scale-[1.02] rounded-none"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      Watch Yoruba Sneak Peek
                      <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                    </a>

                    <Link
                      to="/watch"
                      search={{ episode: "genesis-yoruba-sneak-peek" }}
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-5 py-3 transition-colors rounded-none"
                    >
                      <span>Stream in Episode Player</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. WAITLIST FUNNEL (STREAMING CATALOG MOSAIC SHOWCASE) ── */}
        <section
          id="waitlist"
          className="relative min-h-[640px] md:min-h-[720px] py-24 px-6 md:px-12 overflow-hidden border-t border-white/[0.1] flex items-center justify-center bg-black"
        >
          {/* Background Catalog Mosaic - User's Uploaded Streaming Catalog Grid (Image 3) */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="/assets/waitlist-catalog-mosaic.jpg"
              alt="Visual Bible Global Streaming Catalog Mosaic"
              className="w-full h-full object-cover object-center select-none opacity-85 scale-100"
              loading="lazy"
            />
            {/* Subtle Vignette Gradient: keeps catalog bright & clear, softly darkens edges for seamless page flow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  linear-gradient(180deg, #000000 0%, rgba(0,0,0,0.15) 15%, rgba(0,0,0,0.15) 85%, #000000 100%),
                  radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.55) 100%)
                `,
              }}
            />
          </div>

          {/* Centered Frosted Glass Waitlist Card - Straight Cinema Frame */}
          <div className="relative z-10 max-w-xl w-full mx-auto bg-black/90 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-none shadow-2xl shadow-black text-center">
            <span className="text-[11px] font-semibold tracking-[0.25em] text-white/50 uppercase block mb-3 font-sans">
              Be First to Watch · Official Broadcast Network
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
              Join the Exclusive Premiere Waitlist
            </h2>
            <p className="text-white/80 text-sm leading-relaxed mb-8 max-w-md mx-auto">
              Get direct premiere links, behind-the-scenes production footage, and screening dates
              before anyone else.
            </p>

            {status === "success" ? (
              <div className="flex items-center justify-center gap-2 bg-[#141419]/90 backdrop-blur-md border border-emerald-500/40 rounded-none p-5 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="text-sm font-semibold">
                  You're on the premiere list! We'll notify you as soon as YAHWEH drops.
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleWaitlist}
                className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={status === "loading"}
                  aria-label="Email for waitlist"
                  className="flex-1 bg-black/80 backdrop-blur-md border border-white/20 text-white text-sm placeholder:text-white/40 px-4 py-3 rounded-none focus:outline-none focus:border-[#A11C28] transition-colors shadow-inner"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-[#A11C28] hover:bg-[#7F151F] text-white text-sm font-bold px-6 py-3 rounded-none transition-colors uppercase tracking-wider disabled:opacity-50 whitespace-nowrap shadow-lg shadow-red-950/50"
                >
                  {status === "loading" ? "Joining…" : "Get Early Access"}
                </button>
              </form>
            )}

            {status === "error" && (
              <p className="mt-3 text-sm text-red-400 flex items-center justify-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                {errorMsg}
              </p>
            )}
          </div>
        </section>

        {/* ── 8. FOOTER ────────────────────────────────────────────────── */}
        <SiteFooter />
      </div>
    </div>
  );
}
