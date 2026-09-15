"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, User, ShieldAlert, Loader2, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const redir = params.get("redirect");
      // Only allow redirects within /admin/* paths to prevent open redirect attacks
      if (redir && redir.startsWith("/admin") && !redir.includes("//") && !redir.includes("..")) {
        setRedirectUrl(redir);
      }
    } catch (_) {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        try {
          // 1. Wipe all stale cache from previous sessions immediately
          ["rentorce_admin_cache", "apartmento_admin_cache", "rentorce_admin_selected_row", "apartmento_admin_selected_row", "rentorce_admin_lead_modal", "apartmento_admin_lead_modal"].forEach((k) => {
            sessionStorage.removeItem(k);
            localStorage.removeItem(k);
          });

          // 2. Store authenticated role and user details immediately
          const userRole = data.role === "editor" ? "editor" : "admin";
          sessionStorage.setItem("rentorce_user_role", userRole);
          sessionStorage.setItem("rentorce_user_name", data.user || "");
          sessionStorage.setItem("rentorce_user_display_name", data.displayName || data.user || "");
          localStorage.setItem("rentorce_user_role", userRole);
          localStorage.setItem("rentorce_user_name", data.user || "");
          localStorage.setItem("rentorce_admin_active_tab", "overview");

          // Also set legacy apartmento_ keys
          sessionStorage.setItem("apartmento_user_role", userRole);
          sessionStorage.setItem("apartmento_user_name", data.user || "");
          sessionStorage.setItem("apartmento_user_display_name", data.displayName || data.user || "");
          localStorage.setItem("apartmento_user_role", userRole);
          localStorage.setItem("apartmento_user_name", data.user || "");
          localStorage.setItem("apartmento_admin_active_tab", "overview");
        } catch (_) {}
        // Navigate to the originally requested page, or overview as fallback
        const destination = redirectUrl || "/admin?tab=overview";
        window.location.href = destination;
      } else {
        setError(data.error || "Invalid username or password");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-slate-200/80 space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center pb-1">
            <Image
              src="/fulllogo.svg"
              alt="Rentorce"
              width={260}
              height={65}
              className="h-14 sm:h-16 w-auto object-contain"
              priority
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
            Admin Portal Access
          </div>
          <p className="text-xs text-slate-500">Sign in to manage rental leads and inventory</p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Enter username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-600 outline-none text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-600 outline-none text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In to Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
