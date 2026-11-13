import { useState, type FormEvent } from "react";
import { Lock, Mail, ShieldAlert, CheckCircle2, X } from "lucide-react";
import { useAdminAuth, AUTHORIZED_ADMINS, DEFAULT_ADMIN_PASSWORD } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      onSuccess?.();
      onClose();
    } else {
      setError(result.error || "Login failed. Please check credentials.");
    }
  };

  const handleSelectAccount = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setPassword(DEFAULT_ADMIN_PASSWORD);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0c0c12] border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white rounded-lg transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#A11C28]/25 border border-[#A11C28]/50 flex items-center justify-center text-[#A11C28]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">NRIM Admin Sign In</h2>
            <p className="text-xs text-white/50">Production & Content Management Access</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/40 flex items-center gap-2.5 text-xs text-red-200">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@nrim.org"
                className="pl-9 h-11 bg-white/[0.05] border-white/15 text-white text-sm rounded-lg focus:border-[#A11C28]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="pl-9 h-11 bg-white/[0.05] border-white/15 text-white text-sm rounded-lg focus:border-[#A11C28]"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-[#A11C28] hover:bg-[#7F151F] text-white font-bold rounded-lg shadow-lg shadow-red-950/50 uppercase tracking-wider text-xs mt-2 transition-all"
          >
            {isSubmitting ? "Authenticating..." : "Sign In to Admin CMS"}
          </Button>
        </form>

        {/* Quick Account Selector for Configured Admins */}
        <div className="mt-6 pt-5 border-t border-white/[0.08]">
          <span className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
            Authorized Accounts (Click to auto-fill)
          </span>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(AUTHORIZED_ADMINS).map((adminEmail) => (
              <button
                key={adminEmail}
                type="button"
                onClick={() => handleSelectAccount(adminEmail)}
                className="text-[11px] px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-white/80 hover:text-white border border-white/10 transition-colors"
              >
                {adminEmail}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
