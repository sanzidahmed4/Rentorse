"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  ShieldCheck,
  Trash2,
  Loader2,
  Building2,
  ExternalLink,
  Clock,
  Globe,
  Laptop,
  Calendar,
  CheckCircle2,
  X,
  RefreshCw,
  Eye,
  BedDouble,
  Bath,
  Maximize2,
  Shield,
  ArrowUpRight,
  AlertCircle,
  LayoutGrid,
  List,
  Table,
  Search,
  Lock,
  EyeOff,
  Key,
} from "lucide-react";
import { IApartment, IAdminUserSummary, IAdminLoginLog, AdminUserRole } from "@/types";

export default function AdminUserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const usernameParam = (params && params.username ? (Array.isArray(params.username) ? params.username[0] : params.username) : "") || "";
  const targetUsername = decodeURIComponent(usernameParam).toLowerCase();

  // Data State
  const [adminUsers, setAdminUsers] = useState<IAdminUserSummary[]>([]);
  const [apartments, setApartments] = useState<IApartment[]>([]);
  const [adminLogs, setAdminLogs] = useState<IAdminLoginLog[]>([]);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [currentUserRole, setCurrentUserRole] = useState<"admin" | "editor">("admin");
  const [currentUserDisplayName, setCurrentUserDisplayName] = useState<string>("");
  const [fromSource, setFromSource] = useState<string | null>(null);

  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const from = sp.get("from");
      if (from) setFromSource(from);
    } catch (_) {}
  }, []);

  // Loading & UI State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState("");

  // Role Switcher & Delete States
  const [updatingUserRole, setUpdatingUserRole] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);
  const [deleteUserError, setDeleteUserError] = useState("");

  // Apartment View Controls State ("Show item as icon", "In list", "Compact")
  const [aptViewMode, setAptViewMode] = useState<"icons" | "list" | "compact">("icons");
  const [aptSearch, setAptSearch] = useState("");
  const [aptStatusFilter, setAptStatusFilter] = useState<"ALL" | "LIVE" | "DRAFT">("ALL");
  const [aptSortBy, setAptSortBy] = useState<"newest" | "rent_asc" | "rent_desc">("newest");

  // Edit User Credentials State (Username / Display Name / Password)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    displayName: "",
    username: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [updatingCredentials, setUpdatingCredentials] = useState(false);
  const [editError, setEditError] = useState("");

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const fetchData = useCallback(async (isBackground = false) => {
    if (!isBackground) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.status === 401) {
        const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
        const loginUrl = currentPath
          ? `/admin/login?redirect=${encodeURIComponent(currentPath)}`
          : "/admin/login";
        router.replace(loginUrl);
        return;
      }
      const data = await res.json();
      if (!isMountedRef.current) return;
      if (data.success) {
        if (data.adminUsers) setAdminUsers(data.adminUsers);
        if (data.apartments) setApartments(data.apartments);
        if (data.adminLogs) setAdminLogs(data.adminLogs);
        if (data.currentUser) setCurrentUser(data.currentUser);
        if (data.currentUserRole) setCurrentUserRole(data.currentUserRole);
        if (data.currentUserDisplayName) setCurrentUserDisplayName(data.currentUserDisplayName);
      }
    } catch (err) {
      console.error("Failed to fetch user details:", err);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [router]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, [fetchData, targetUsername]);

  // Matching user object
  const user = adminUsers.find((u) => u.username && u.username.toLowerCase() === targetUsername);

  // Protection checks
  const isSelf = user ? user.username.toLowerCase() === (currentUser || "").toLowerCase() : false;
  const isRootFounder = user ? ["sanzid", "sihabali"].includes((user.username || "").toLowerCase()) : false;
  const isProtected = isRootFounder || isSelf;

  // Filter user's listed apartments
  const userApartments = apartments.filter((apt) => {
    const creator = (apt.createdBy || "").toLowerCase();
    return creator === targetUsername;
  });

  const totalUserApartments = userApartments.length;
  const liveAptCount = userApartments.filter((a) => a.isActive).length;
  const draftAptCount = userApartments.filter((a) => !a.isActive).length;

  const filteredUserApartments = userApartments
    .filter((apt) => {
      if (aptStatusFilter === "LIVE" && !apt.isActive) return false;
      if (aptStatusFilter === "DRAFT" && apt.isActive) return false;
      if (aptSearch.trim()) {
        const q = aptSearch.toLowerCase().trim();
        const matchTitle = (apt.title || "").toLowerCase().includes(q);
        const matchLoc = (apt.cityState || apt.addressTemplate || "").toLowerCase().includes(q);
        const matchCat = (apt.category || "").toLowerCase().includes(q);
        if (!matchTitle && !matchLoc && !matchCat) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (aptSortBy === "rent_asc") return (a.baseRent || 0) - (b.baseRent || 0);
      if (aptSortBy === "rent_desc") return (b.baseRent || 0) - (a.baseRent || 0);
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  // Filter user's audit logs
  const userLogs = adminLogs.filter((log) => log.username && log.username.toLowerCase() === targetUsername);

  const formatTimeAgo = (date: Date | string | number | undefined | null) => {
    if (!date) return "Offline";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Offline";
    const seconds = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}hr ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatDateSafe = (date: Date | string | number | undefined | null, fallback = "Configured Account") => {
    if (!date) return fallback;
    const d = new Date(date);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTimeSafe = (date: Date | string | number | undefined | null, fallback = "N/A") => {
    if (!date) return fallback;
    const d = new Date(date);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleUpdateUserRole = async (newRole: AdminUserRole) => {
    if (!user) return;
    setUpdatingUserRole(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update user role");
      }
      showToast(data.message || `Role for @${user.username} changed to ${newRole.toUpperCase()}!`);
      setAdminUsers((prev) =>
        prev.map((u) =>
          u.username.toLowerCase() === user.username.toLowerCase() ? { ...u, role: newRole } : u
        )
      );
      fetchData(true);
    } catch (err: any) {
      showToast(err?.message || "Failed to update user role");
    } finally {
      setUpdatingUserRole(false);
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (!user) return;
    setDeletingUser(true);
    setDeleteUserError("");
    try {
      const res = await fetch(`/api/admin/users?username=${encodeURIComponent(user.username)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete user");
      }
      setIsDeleteModalOpen(false);
      router.push("/admin/users");
    } catch (err: any) {
      setDeleteUserError(err?.message || "Failed to delete user");
      setDeletingUser(false);
    }
  };

  const handleOpenEditModal = () => {
    if (!user) return;
    setEditFormData({
      displayName: user.displayName || user.username,
      username: user.username,
      newPassword: "",
      confirmPassword: "",
    });
    setShowPassword(false);
    setEditError("");
    setIsEditModalOpen(true);
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setEditError("");

    if (!editFormData.displayName.trim() || editFormData.displayName.trim().length < 2) {
      setEditError("Display Name must be at least 2 characters.");
      return;
    }

    if (editFormData.newPassword) {
      if (editFormData.newPassword.length < 6) {
        setEditError("Password must be at least 6 characters long.");
        return;
      }
      if (editFormData.newPassword !== editFormData.confirmPassword) {
        setEditError("New Password and Confirm Password do not match.");
        return;
      }
    }

    setUpdatingCredentials(true);
    try {
      const payload: any = {
        username: user.username,
        displayName: editFormData.displayName.trim(),
      };

      // Only allow changing username if not root founder and actually changed
      if (!isRootFounder && editFormData.username.trim().toLowerCase() !== user.username.toLowerCase()) {
        payload.newUsername = editFormData.username.trim().toLowerCase();
      }

      if (editFormData.newPassword.trim()) {
        payload.password = editFormData.newPassword.trim();
      }

      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update user profile");
      }

      showToast(data.message || "Profile credentials updated successfully!");
      setIsEditModalOpen(false);

      await fetchData(true);

      if (data.usernameChanged && data.user?.username) {
        router.push(`/admin/users/${data.user.username}`);
      }
    } catch (err: any) {
      setEditError(err?.message || "Failed to update profile");
    } finally {
      setUpdatingCredentials(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {currentUserRole === "editor" || fromSource === "apartments" ? (
              <Link
                href="/admin?tab=apartments"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition cursor-pointer"
                title="Return to Apartment Inventory"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Apartment Inventory</span>
              </Link>
            ) : (
              <Link
                href="/admin/users"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition cursor-pointer"
                title="Return to User Accounts Directory"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Users List</span>
              </Link>
            )}

            <div className="hidden sm:block h-5 w-px bg-slate-200" />

            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h1 className="text-base font-black text-slate-900">User Profile & Content Details</h1>
                <span className="text-xs font-mono text-slate-400">@{targetUsername}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Current Logged in User indicator */}
            <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black uppercase shadow-xs">
                {currentUser ? currentUser.charAt(0) : "A"}
              </div>
              <div className="text-left leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800">{currentUser}</span>
                  <span className="relative flex h-2 w-2" title="Active Session">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  {currentUserRole === "editor" ? "Active Editor" : "Active Admin"}
                </span>
              </div>
            </div>

            <button
              onClick={() => fetchData()}
              disabled={refreshing}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition cursor-pointer disabled:cursor-not-allowed"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-blue-600 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3 text-slate-900">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-xs font-semibold text-slate-500">Loading user profile details...</p>
          </div>
        ) : !user ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4 max-w-md mx-auto my-12">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-slate-800">User Not Found</h3>
            <p className="text-xs text-slate-500">
              No account registered with username <code className="font-mono text-slate-700">@{targetUsername}</code>.
            </p>
            <div className="pt-2">
              <Link
                href={currentUserRole === "editor" || fromSource === "apartments" ? "/admin?tab=apartments" : "/admin/users"}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{currentUserRole === "editor" || fromSource === "apartments" ? "Return to Apartment Inventory" : "Return to Users Directory"}</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* User Profile Header Card */}
            <div
              className={`rounded-3xl bg-white border transition shadow-sm overflow-hidden ${
                user.isActive
                  ? "border-emerald-300 ring-2 ring-emerald-500/10 shadow-emerald-500/5"
                  : "border-slate-200"
              }`}
            >
              <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-50/70 to-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div
                    className={`w-20 h-20 rounded-3xl text-white flex items-center justify-center font-black text-3xl uppercase shadow-md flex-shrink-0 ${
                      user.role === "admin"
                        ? "bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-blue-500/20"
                        : "bg-gradient-to-tr from-slate-700 to-slate-600"
                    }`}
                  >
                    {user.username.charAt(0)}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-black text-slate-900">{user.displayName || user.username}</h2>
                      <code className="text-xs font-mono text-slate-600 bg-slate-200/70 px-2.5 py-1 rounded-lg">
                        @{user.username}
                      </code>
                      {isSelf && (
                        <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">
                          You (Current)
                        </span>
                      )}
                      {isRootFounder && (
                        <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold flex items-center gap-1 border border-purple-200">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Founder
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">
                        {user.role === "admin" ? "Admin" : "Editor"}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Joined {formatDateSafe(user.createdAt, "Configured Account")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action Controls: Status, Role Switcher & Delete */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Live Status Badge */}
                  {user.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-xs">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      Active Now
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold"
                      title={
                        user.lastActiveAt
                          ? `Last active: ${formatDateTimeSafe(user.lastActiveAt)}`
                          : "Offline"
                      }
                    >
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                      {user.lastActiveAt ? formatTimeAgo(user.lastActiveAt) : "Offline"}
                    </span>
                  )}

                  {/* Role Selector */}
                  {isProtected ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      {user.role === "admin" ? "Role: Admin" : "Role: Editor"}
                    </span>
                  ) : currentUserRole === "admin" ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={user.role}
                        disabled={updatingUserRole}
                        onChange={(e) => handleUpdateUserRole(e.target.value as AdminUserRole)}
                        className={`text-xs font-bold py-2 px-3.5 rounded-xl border outline-none transition cursor-pointer ${
                          user.role === "admin"
                            ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                            : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                        }`}
                        title="Change User Role"
                      >
                        <option value="admin">Role: Admin</option>
                        <option value="editor">Role: Editor</option>
                      </select>
                      {updatingUserRole && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                    </div>
                  ) : null}

                  {/* Change User / Password Button */}
                  {(currentUserRole === "admin" || isSelf) && (
                    <button
                      type="button"
                      onClick={handleOpenEditModal}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition cursor-pointer shadow-2xs"
                      title="Change username, display name, or password"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Change User / Password</span>
                    </button>
                  )}

                  {/* Delete User Button */}
                  {currentUserRole === "admin" && !isProtected && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                        setDeleteUserError("");
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition cursor-pointer"
                      title={`Delete user @${user.username}`}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete User</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 4 Overview Metrics */}
              <div className="p-6 border-t border-slate-100 bg-white grid grid-cols-2 sm:grid-cols-4 gap-4">
                {currentUserRole === "admin" ? (
                  <>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Total Logins
                      </span>
                      <p className="text-base font-black text-slate-800">
                        {user.totalLogins} session{user.totalLogins === 1 ? "" : "s"}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Last Login Date
                      </span>
                      <p className="text-xs font-bold text-slate-800 truncate" title={user.lastLogin || "—"}>
                        {formatDateTimeSafe(user.lastLogin, "No login recorded")}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Last Known IP
                      </span>
                      <p className="text-xs font-mono font-bold text-slate-700">
                        {user.lastIp || "127.0.0.1"}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Device / Browser
                      </span>
                      <p className="text-xs font-bold text-slate-700 truncate" title={user.lastDevice || "—"}>
                        {user.lastDevice || "Mac (Chrome)"}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Total Listings
                      </span>
                      <p className="text-base font-black text-slate-800">
                        {totalUserApartments} listing{totalUserApartments === 1 ? "" : "s"}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Active Listings
                      </span>
                      <p className="text-base font-black text-emerald-600">
                        {liveAptCount}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Offline / Draft
                      </span>
                      <p className="text-base font-black text-slate-600">
                        {draftAptCount}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Role
                      </span>
                      <p className="text-xs font-black uppercase text-blue-600 tracking-wider">
                        {user.role}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Section 1: Apartments Listed by this User */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Apartments Listed by {user.displayName || user.username}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Properties added to inventory and managed by this account
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                    {totalUserApartments} Total Listing{totalUserApartments === 1 ? "" : "s"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    {liveAptCount} Live
                  </span>
                  {draftAptCount > 0 && (
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                      {draftAptCount} Draft
                    </span>
                  )}
                </div>
              </div>

              {/* View Options & Filter Toolbar */}
              {userApartments.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-3">
                  {/* Left: Search, Filter, and Sort */}
                  <div className="flex flex-1 flex-wrap items-center gap-2.5 w-full md:w-auto">
                    {/* Live Search */}
                    <div className="relative flex-1 min-w-[170px] max-w-xs">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={aptSearch}
                        onChange={(e) => setAptSearch(e.target.value)}
                        placeholder="Search listings..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:border-blue-500 outline-none transition"
                      />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
                      {(
                        [
                          { id: "ALL", label: "All" },
                          { id: "LIVE", label: `Live (${liveAptCount})` },
                          { id: "DRAFT", label: `Draft (${draftAptCount})` },
                        ] as const
                      ).map((filter) => (
                        <button
                          key={filter.id}
                          type="button"
                          onClick={() => setAptStatusFilter(filter.id)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                            aptStatusFilter === filter.id
                              ? "bg-blue-600 text-white shadow-2xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>

                    {/* Sort Dropdown */}
                    <select
                      value={aptSortBy}
                      onChange={(e) => setAptSortBy(e.target.value as any)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                      title="Sort Listings"
                    >
                      <option value="newest">Newest First</option>
                      <option value="rent_asc">Rent: Low to High</option>
                      <option value="rent_desc">Rent: High to Low</option>
                    </select>
                  </div>

                  {/* Right: View Mode Toggle ("Show as Icon", "In List", "Compact") */}
                  <div className="flex items-center gap-1.5 self-end md:self-auto">
                    <span className="text-[11px] font-bold text-slate-400 uppercase mr-1 hidden sm:inline">
                      View:
                    </span>
                    <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setAptViewMode("icons")}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          aptViewMode === "icons"
                            ? "bg-blue-600 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                        title="Show item as Icon (Grid cards)"
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span>Icons</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAptViewMode("list")}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          aptViewMode === "list"
                            ? "bg-blue-600 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                        title="Show in List (Structured table)"
                      >
                        <List className="w-3.5 h-3.5" />
                        <span>In List</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAptViewMode("compact")}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          aptViewMode === "compact"
                            ? "bg-blue-600 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                        title="Show as Compact rows"
                      >
                        <Table className="w-3.5 h-3.5" />
                        <span>Compact</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* View Renderings */}
              {userApartments.length === 0 ? (
                <div className="py-12 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-3">
                  <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-600">No apartments listed yet</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    When @{user.username} creates or publishes apartments from the back-office, they will appear here with live preview links.
                  </p>
                </div>
              ) : filteredUserApartments.length === 0 ? (
                <div className="py-10 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
                  <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No listings match your search or filter</p>
                  <button
                    type="button"
                    onClick={() => {
                      setAptSearch("");
                      setAptStatusFilter("ALL");
                    }}
                    className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <>
                  {/* VIEW 1: Show as Icon (Grid Cards) */}
                  {aptViewMode === "icons" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredUserApartments.map((apt) => (
                        <div
                          key={apt._id || apt.id}
                          className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition group flex flex-col justify-between space-y-3"
                        >
                          <div className="space-y-3">
                            {/* Thumbnail & Badges */}
                            <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-200">
                              {apt.images && apt.images[0] ? (
                                <Image
                                  src={apt.images[0]}
                                  alt={apt.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  <Building2 className="w-8 h-8" />
                                </div>
                              )}
                              <div className="absolute top-2.5 left-2.5">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs ${
                                    apt.isActive
                                      ? "bg-emerald-500 text-white"
                                      : "bg-amber-500 text-white"
                                  }`}
                                >
                                  {apt.isActive ? "Live" : "Draft"}
                                </span>
                              </div>
                              <div className="absolute bottom-2.5 right-2.5 bg-slate-900/85 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-xs font-black">
                                ${apt.baseRent}/mo
                              </div>
                            </div>

                            {/* Title & Address */}
                            <div>
                              <h4 className="text-sm font-black text-slate-900 truncate" title={apt.title}>
                                {apt.title}
                              </h4>
                              <p className="text-xs text-slate-500 truncate mt-0.5">
                                {apt.cityState || apt.addressTemplate || "Apartmento Property"}
                              </p>
                            </div>

                            {/* Specs */}
                            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium pt-1">
                              <span className="flex items-center gap-1">
                                <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                                {apt.bedrooms} Bed{apt.bedrooms === 1 ? "" : "s"}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Bath className="w-3.5 h-3.5 text-slate-400" />
                                {apt.bathrooms} Bath{apt.bathrooms === 1 ? "" : "s"}
                              </span>
                              {apt.squareFeet ? (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                                    {apt.squareFeet} sqft
                                  </span>
                                </>
                              ) : null}
                            </div>
                          </div>

                          {/* Card Action Link */}
                          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                            <span className="text-[11px] font-mono text-slate-400">
                              ID: {(apt.id || apt._id || "").slice(-6)}
                            </span>
                            <Link
                              href={`/apartments/${apt.id || apt._id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer"
                            >
                              <span>View Public Page</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* VIEW 2: In List (Structured Table / Row List) */}
                  {aptViewMode === "list" && (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-3.5 px-4">Property</th>
                            <th className="py-3.5 px-4">Rent</th>
                            <th className="py-3.5 px-4">Specs</th>
                            <th className="py-3.5 px-4">Status</th>
                            <th className="py-3.5 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {filteredUserApartments.map((apt) => (
                            <tr key={apt._id || apt.id} className="hover:bg-blue-50/30 transition group">
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                                    {apt.images && apt.images[0] ? (
                                      <Image
                                        src={apt.images[0]}
                                        alt={apt.title}
                                        fill
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <Building2 className="w-5 h-5" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <Link
                                      href={`/apartments/${apt.id || apt._id}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="font-bold text-slate-900 hover:text-blue-600 transition block truncate max-w-xs sm:max-w-md"
                                      title={apt.title}
                                    >
                                      {apt.title}
                                    </Link>
                                    <p className="text-[11px] text-slate-400 truncate">
                                      {apt.cityState || apt.addressTemplate || "Apartmento Property"} • ID: {(apt.id || apt._id || "").slice(-6)}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap">
                                ${apt.baseRent}/mo
                              </td>

                              <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <span>{apt.bedrooms} Bed</span>
                                  <span>•</span>
                                  <span>{apt.bathrooms} Bath</span>
                                  {apt.squareFeet ? (
                                    <>
                                      <span>•</span>
                                      <span>{apt.squareFeet} sqft</span>
                                    </>
                                  ) : null}
                                </div>
                              </td>

                              <td className="py-3.5 px-4 whitespace-nowrap">
                                {apt.isActive ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Live
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    Draft
                                  </span>
                                )}
                              </td>

                              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                <Link
                                  href={`/apartments/${apt.id || apt._id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-bold text-xs border border-slate-200 hover:border-blue-200 transition cursor-pointer"
                                >
                                  <span>View</span>
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* VIEW 3: Compact Rows View */}
                  {aptViewMode === "compact" && (
                    <div className="space-y-2">
                      {filteredUserApartments.map((apt) => (
                        <div
                          key={apt._id || apt.id}
                          className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                              {apt.images && apt.images[0] ? (
                                <Image
                                  src={apt.images[0]}
                                  alt={apt.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  <Building2 className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/apartments/${apt.id || apt._id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="font-bold text-xs text-slate-900 hover:text-blue-600 transition truncate max-w-xs sm:max-w-md"
                                  title={apt.title}
                                >
                                  {apt.title}
                                </Link>
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                    apt.isActive
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-amber-100 text-amber-700"
                                  }`}
                                >
                                  {apt.isActive ? "Live" : "Draft"}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                {apt.cityState || apt.addressTemplate || "Apartmento Property"} • {apt.bedrooms}B/{apt.bathrooms}Ba • ${apt.baseRent}/mo
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="font-black text-xs text-slate-900 hidden sm:inline">
                              ${apt.baseRent}/mo
                            </span>
                            <Link
                              href={`/apartments/${apt.id || apt._id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                              title="View Public Page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>
                      Showing {filteredUserApartments.length} of {totalUserApartments} listing{totalUserApartments === 1 ? "" : "s"}
                    </span>
                    <span>
                      View mode: <strong className="capitalize text-slate-600">{aptViewMode === "icons" ? "Icons" : aptViewMode === "list" ? "In List" : "Compact"}</strong>
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Section 2: Login Activity & Audit Trail for this User (Admin Only) */}
            {currentUserRole === "admin" && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Login Activity & Security Audit Trail
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Recent authentication attempts and session IP tracking for @{user.username}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                    {userLogs.length} Audit Record{userLogs.length === 1 ? "" : "s"}
                  </span>
                </div>

                {userLogs.length === 0 ? (
                  <div className="py-8 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
                    <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">No login records logged yet</p>
                    <p className="text-xs text-slate-400">
                      Audit records will be recorded when this user logs in through the admin authentication portal.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Timestamp</th>
                          <th className="py-3 px-4">IP Address</th>
                          <th className="py-3 px-4">Device / Client</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {userLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-4">
                              {log.status === "SUCCESS" ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  Success
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                  Failed
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-slate-700 font-medium">
                              <div>
                                <span>
                                  {formatDateTimeSafe(log.createdAt)}
                                </span>
                                <span className="text-[10px] text-slate-400 ml-2">
                                  ({formatTimeAgo(log.createdAt)})
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-700">{log.ip}</td>
                            <td className="py-3 px-4 text-slate-500 max-w-xs truncate" title={log.device}>
                              {log.device}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-slate-900">Delete User Account?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-800">{user.displayName}</strong> (<code className="text-slate-700 font-mono">@{user.username}</code>)?
                This user will permanently lose access to the admin back-office.
              </p>
            </div>
            {deleteUserError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
                {deleteUserError}
              </div>
            )}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteUserError("");
                }}
                disabled={deletingUser}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                disabled={deletingUser}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deletingUser ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER CREDENTIALS MODAL */}
      {isEditModalOpen && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit User & Password</h3>
                  <p className="text-xs text-slate-500">Update account credentials for @{user.username}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCredentials} className="p-6 space-y-4 overflow-y-auto">
              {editError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {editError}
                </div>
              )}

              {/* Display Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Display Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.displayName}
                  onChange={(e) => setEditFormData({ ...editFormData, displayName: e.target.value })}
                  placeholder="e.g. Sanzid Ahmed"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500 transition"
                />
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Username (Login ID)</label>
                  {isRootFounder && (
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200">
                      Protected Root
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">@</span>
                  <input
                    type="text"
                    required
                    disabled={isRootFounder}
                    value={editFormData.username}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
                      })
                    }
                    placeholder="username"
                    className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl border text-xs font-mono outline-none transition ${
                      isRootFounder
                        ? "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                        : "bg-white border-slate-200 focus:border-blue-500"
                    }`}
                  />
                </div>
                {isRootFounder && (
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Root administrator usernames (<code>sanzid</code>, <code>sihabali</code>) are permanently locked to preserve system integrity. Password and display name can be changed anytime.
                  </p>
                )}
              </div>

              {/* Password Section */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                    Change Password
                  </span>
                  <span className="text-[10px] text-slate-400">Leave blank to keep unchanged</span>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={editFormData.newPassword}
                      onChange={(e) => setEditFormData({ ...editFormData, newPassword: e.target.value })}
                      placeholder="Enter new password (min 6 chars)"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                {editFormData.newPassword.length > 0 && (
                  <div className="space-y-1.5 animate-in fade-in">
                    <label className="text-[11px] font-semibold text-slate-600">Confirm New Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={editFormData.confirmPassword}
                      onChange={(e) => setEditFormData({ ...editFormData, confirmPassword: e.target.value })}
                      placeholder="Re-type new password"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition ${
                        editFormData.confirmPassword && editFormData.confirmPassword !== editFormData.newPassword
                          ? "border-rose-400 bg-rose-50/40"
                          : "border-slate-200 focus:border-blue-500"
                      }`}
                    />
                    {editFormData.confirmPassword && editFormData.confirmPassword !== editFormData.newPassword && (
                      <p className="text-[11px] text-rose-600 font-medium">Passwords do not match</p>
                    )}
                  </div>
                )}
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingCredentials}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {updatingCredentials && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{updatingCredentials ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
