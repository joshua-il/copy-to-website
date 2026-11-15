import { useState, type FormEvent } from "react";
import { Lock, Mail, ShieldAlert, X, ArrowRight } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";

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
      setError(result.error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-heading"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-[#0b0b10] border border-white/20 rounded-none p-6 md:p-8 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white rounded-none border border-transparent hover:border-white/20 transition-colors"
          title="Close"
          aria-label="Close Admin Sign In"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-none bg-[#A11C28]/25 border border-[#A11C28]/60 flex items-center justify-center text-[#A11C28]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 id="admin-login-heading" className="text-lg font-black text-white tracking-wider uppercase">
              Visual Bible Studio CMS
            </h2>
            <p className="text-xs text-white/50 font-sans">Authorized Administrator Sign In</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-none bg-red-950/60 border border-red-500/50 flex items-center gap-2.5 text-xs text-red-200">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5 font-sans">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nrim.org"
                className="pl-9 h-11 bg-white/[0.05] border-white/20 text-white text-sm rounded-none focus:border-[#A11C28]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5 font-sans">
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
                className="pl-9 h-11 bg-white/[0.05] border-white/20 text-white text-sm rounded-none focus:border-[#A11C28]"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-[#A11C28] hover:bg-[#7F151F] text-white font-bold rounded-none shadow-lg uppercase tracking-wider text-xs mt-2 transition-all"
          >
            {isSubmitting ? "Authenticating..." : "Sign In to Studio CMS"}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
          <Link
            to="/admin"
            onClick={onClose}
            className="hover:text-white transition-colors inline-flex items-center gap-1 font-sans"
          >
            <span>Open Full Studio Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

