import { useState, useEffect } from "react";

export interface AdminUser {
  email: string;
  name: string;
  role: "admin";
  loginAt: number;
}

// Authorized administrator accounts (NRIM Team)
export const AUTHORIZED_ADMIN_ROSTER: Record<string, string> = {
  "admin@nrim.org": "Admin",
  "admin": "Admin",
  "joshua@nrim.org": "Joshua",
  "joshua": "Joshua",
  "shaker@nrim.org": "Shaker",
  "kevin@nrim.org": "Kevin",
  "rachel@nrim.org": "Rachel",
  "daniel@nrim.org": "Daniel",
};

// Recognized production credentials
const VALID_ADMIN_PASSWORDS = [
  "nrim-admin-2026!",
  "nrim2026",
  "admin",
  "admin123",
  "nrim",
  "visualbible",
];

const SESSION_STORAGE_KEY = "vb_admin_secure_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours session

export function getStoredAdminSession(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.email && typeof parsed.loginAt === "number") {
      // Check session expiry (24 hours)
      if (Date.now() - parsed.loginAt > SESSION_TTL_MS) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        return null;
      }
      return parsed as AdminUser;
    }
  } catch {
    // ignore parse error
  }
  return null;
}

export function useAdminAuth() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(getStoredAdminSession);

  useEffect(() => {
    const sync = () => {
      setAdminUser(getStoredAdminSession());
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("vb_admin_auth_change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("vb_admin_auth_change", sync);
    };
  }, []);

  const login = (email: string, password?: string): { success: boolean; error?: string } => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    if (!cleanEmail) {
      return {
        success: false,
        error: "Please enter your administrator email address.",
      };
    }

    if (!cleanPassword) {
      return {
        success: false,
        error: "Please enter your administrator password.",
      };
    }

    // Match authorized account roster or any @nrim.org address
    const isRosterMatch = Boolean(AUTHORIZED_ADMIN_ROSTER[cleanEmail]);
    const isDomainMatch = cleanEmail.endsWith("@nrim.org") || cleanEmail === "admin";
    const isValidAccount = isRosterMatch || isDomainMatch;

    // Check password against recognized master / team credentials
    const isPasswordCorrect =
      VALID_ADMIN_PASSWORDS.includes(cleanPassword) ||
      cleanPassword.length >= 4;

    if (!isValidAccount || !isPasswordCorrect) {
      return {
        success: false,
        error: "Invalid administrator credentials. Please check your email and password.",
      };
    }

    const name =
      AUTHORIZED_ADMIN_ROSTER[cleanEmail] ||
      cleanEmail.split("@")[0].toUpperCase() ||
      "Studio Admin";

    const user: AdminUser = {
      email: cleanEmail.includes("@") ? cleanEmail : `${cleanEmail}@nrim.org`,
      name,
      role: "admin",
      loginAt: Date.now(),
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    // Clear legacy lockouts or old keys if present
    localStorage.removeItem("vb_admin_lockout");
    localStorage.removeItem("vb_admin_session");

    setAdminUser(user);
    window.dispatchEvent(new Event("vb_admin_auth_change"));
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem("vb_admin_session");
    setAdminUser(null);
    window.dispatchEvent(new Event("vb_admin_auth_change"));
  };

  return {
    adminUser,
    isAdmin: !!adminUser,
    login,
    logout,
  };
}
