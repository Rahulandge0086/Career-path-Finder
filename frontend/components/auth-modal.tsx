"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    openAuthModal,
    login,
    register,
  } = useAuth();

  // Mode: "login" | "register"
  const isLogin = authModalMode === "login";

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset errors when mode switches
  const switchMode = (mode: "login" | "register") => {
    setError(null);
    setSuccess(null);
    openAuthModal(mode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    if (!isLogin) {
      const trimmedName = name.trim();
      if (!trimmedName) {
        setError("Please enter your full name");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      setIsSubmitting(true);
      const res = await register(trimmedName, trimmedEmail, password);
      setIsSubmitting(false);

      if (!res.success) {
        setError(res.error || "Registration failed");
      } else {
        setSuccess("Account created successfully! Welcome.");
        // Modal closes automatically via useAuth
      }
    } else {
      setIsSubmitting(true);
      const res = await login(trimmedEmail, password);
      setIsSubmitting(false);

      if (!res.success) {
        setError(res.error || "Login failed");
      } else {
        setSuccess("Signed in successfully!");
      }
    }
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-[440px] bg-zinc-950/95 border border-white/10 text-white shadow-2xl backdrop-blur-2xl p-0 overflow-hidden rounded-2xl">
        {/* Glow Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400">
              CareerPath Account
            </span>
          </div>

          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl font-bold tracking-tight text-white">
              {isLogin ? "Welcome back" : "Create your account"}
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-400">
              {isLogin
                ? "Enter your credentials to access your personalized career roadmaps."
                : "Join thousands discovering their ideal career trajectory today."}
            </DialogDescription>
          </DialogHeader>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 mt-4 rounded-xl bg-zinc-900/80 border border-white/5">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                isLogin
                  ? "bg-white/10 text-white shadow-sm shadow-black/50"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                !isLogin
                  ? "bg-white/10 text-white shadow-sm shadow-black/50"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          {!isLogin && (
            <div className="space-y-1.5">
              <Label htmlFor="auth-name" className="text-xs font-medium text-zinc-300">
                Full Name
              </Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <Input
                  id="auth-name"
                  type="text"
                  placeholder="Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 bg-zinc-900/60 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-cyan-500 rounded-lg text-sm h-10"
                  required={!isLogin}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="auth-email" className="text-xs font-medium text-zinc-300">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <Input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 bg-zinc-900/60 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-cyan-500 rounded-lg text-sm h-10"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="auth-password" className="text-xs font-medium text-zinc-300">
                Password
              </Label>
              {!isLogin && (
                <span className="text-[11px] text-zinc-500">Min 6 characters</span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <Input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-10 bg-zinc-900/60 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-cyan-500 rounded-lg text-sm h-10"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1.5">
              <Label htmlFor="auth-confirm-password" className="text-xs font-medium text-zinc-300">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <Input
                  id="auth-confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 bg-zinc-900/60 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-cyan-500 rounded-lg text-sm h-10"
                  required={!isLogin}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-lg shadow-lg shadow-cyan-500/20 transition-all duration-200 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isLogin ? "Signing in..." : "Creating account..."}
              </>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>

          {/* Quick toggle link */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => switchMode(isLogin ? "register" : "login")}
              className="text-xs text-zinc-400 hover:text-cyan-400 transition-colors"
            >
              {isLogin ? (
                <>
                  Don&apos;t have an account?{" "}
                  <span className="font-semibold text-white underline underline-offset-2">
                    Sign up
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span className="font-semibold text-white underline underline-offset-2">
                    Sign in
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
