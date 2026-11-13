import { useState, useEffect } from "react";

export interface AdminUser {
  email: string;
  name: string;
  role: "admin";
  loginAt: number;
}

// Authorized administrator accounts (NRIM Team)
const AUTHORIZED_ADMIN_ROSTER: Record<string, string> = {
  "shaker@nrim.org": "Shaker",
  "joshua@nrim.org": "Joshua",
  "kevin@nrim.org": "Kevin",
  "rachel@nrim.org": "Rachel",
  "daniel@nrim.org": "Daniel",
};

// Strict Master Team Credential
const MASTER_ADMIN_PASS = "nrim-admin-2026!";
const SESSION_STORAGE_KEY = "vb_admin_secure_session";
const LOCKOUT_KEY = "vb_admin_lockout";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 10 * 60 * 1000; // 10 minutes
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours max session

function checkLockout(): { locked: boolean; remainingMinutes?: number } {
  if (typeof window === "undefined") return { locked: false };
  try {
    const raw = localStorage.getItem(LOCKOUT_KEY);
    if (!raw) return { locked: false };
    const data = JSON.parse(raw);
    const now = Date.now();
    if (data.lockedUntil && data.lockedUntil > now) {
      const remainingMinutes = Math.ceil((data.lockedUntil - now) / 60000);
      return { locked: true, remainingMinutes };
    }
    // Lockout expired
    if (data.lockedUntil && data.lockedUntil <= now) {
      localStorage.removeItem(LOCKOUT_KEY);
    }
  } catch {
    // ignore
  }
  return { locked: false };
}

function recordFailedAttempt(): { locked: boolean; attemptsLeft: number } {
  if (typeof window === "undefined") return { locked: false, attemptsLeft: MAX_FAILED_ATTEMPTS };
  try {
    const raw = localStorage.getItem(LOCKOUT_KEY);
    const data = raw ? JSON.parse(raw) : { count: 0 };
    const count = (data.count || 0) + 1;
    if (count >= MAX_FAILED_ATTEMPTS) {
      const lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      localStorage.setItem(LOCKOUT_KEY, JSON.stringify({ count, lockedUntil }));
      return { locked: true, attemptsLeft: 0 };
    }
    localStorage.setItem(LOCKOUT_KEY, JSON.stringify({ count }));
    return { locked: false, attemptsLeft: MAX_FAILED_ATTEMPTS - count };
  } catch {
    return { locked: false, attemptsLeft: 1 };
  }
}

function clearLockout() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LOCKOUT_KEY);
  } catch {
    // ignore
  }
}

export function getStoredAdminSession(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      parsed.email &&
      AUTHORIZED_ADMIN_ROSTER[parsed.email.toLowerCase()] &&
      typeof parsed.loginAt === "number"
    ) {
      // Check session expiry (12 hours)
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
    const lockout = checkLockout();
    if (lockout.locked) {
      return {
        success: false,
        error: `Security lock active due to repeated failed attempts. Please try again in ${lockout.remainingMinutes} minutes.`,
      };
    }

    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    // Constant-time-like check: both email and password must strictly match
    const isValidAccount = Boolean(AUTHORIZED_ADMIN_ROSTER[cleanEmail]);
    const isPasswordCorrect = cleanPassword.length > 0 && cleanPassword === MASTER_ADMIN_PASS;

    if (!isValidAccount || !isPasswordCorrect) {
      const attempt = recordFailedAttempt();
      if (attempt.locked) {
        return {
          success: false,
          error: "Too many failed attempts. Login locked for 10 minutes for security.",
        };
      }
      return {
        success: false,
        error: `Invalid administrator credentials. (${attempt.attemptsLeft} attempts remaining)`,
      };
    }

    // Login successful: reset lockout counter
    clearLockout();

    const user: AdminUser = {
      email: cleanEmail,
      name: AUTHORIZED_ADMIN_ROSTER[cleanEmail],
      role: "admin",
      loginAt: Date.now(),
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    setAdminUser(user);
    window.dispatchEvent(new Event("vb_admin_auth_change"));
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    // Also clean up any legacy keys
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
