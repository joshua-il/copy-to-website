import { useState, useEffect } from "react";

export const activeLanguages = [
  { label: "English", value: "en" },
  { label: "Hindi (हिन्दी)", value: "hi" },
  { label: "Tamil (தமிழ்)", value: "ta" },
  { label: "Malayalam (മലയാളം)", value: "ml" },
  { label: "Persian (فارسی)", value: "fa" },
  { label: "Tagalog", value: "tl" },
  { label: "Chinese (中文)", value: "zh" },
  { label: "Malay (Bahasa Melayu)", value: "ms" },
];

export function useGlobalLanguage() {
  const [language, setLanguageState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("vb_regional_lang");
      if (saved) return saved;
    }
    return "en";
  });

  const setLanguage = (val: string) => {
    setLanguageState(val);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("vb_regional_lang", val);
    }
  };

  useEffect(() => {
    const handleStorage = () => {
      const saved = window.localStorage.getItem("vb_regional_lang");
      if (saved && saved !== language) {
        setLanguageState(saved);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [language]);

  return [language, setLanguage] as const;
}
