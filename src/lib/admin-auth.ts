import { useState, useEffect } from "react";

export interface AdminUser {
  email: string;
  name: string;
  role: "admin";
}

// Allowed Admin Accounts
export const AUTHORIZED_ADMINS: Record<string, string> = {
  "shaker@nrim.org": "Shaker",
  "joshua@nrim.org": "Joshua",
  "kevin@nrim.org": "Kevin",
  "rachel@nrim.org": "Rachel",
  "daniel@nrim.org": "Daniel",
};

// Common initial password for authorized accounts
export const DEFAULT_ADMIN_PASSWORD = "nrim-admin-2026!";
const SESSION_STORAGE_KEY = "vb_admin_session";

export function getStoredAdminSession(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.email && AUTHORIZED_ADMINS[parsed.email.toLowerCase()]) {
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
    window.addEventListener("storage", sync);
    window.addEventListener("vb_admin_auth_change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("vb_admin_auth_change", sync);
    };
  }, []);

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!AUTHORIZED_ADMINS[cleanEmail]) {
      return {
        success: false,
        error: "This email is not authorized as an NRIM administrator.",
      };
    }

    if (cleanPassword !== DEFAULT_ADMIN_PASSWORD) {
      return {
        success: false,
        error: "Incorrect password. Please verify the administrator password.",
      };
    }

    const user: AdminUser = {
      email: cleanEmail,
      name: AUTHORIZED_ADMINS[cleanEmail],
      role: "admin",
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    setAdminUser(user);
    window.dispatchEvent(new Event("vb_admin_auth_change"));
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
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
