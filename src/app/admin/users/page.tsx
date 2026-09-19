"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  ShieldCheck,
  UserPlus,
  Trash2,
  Loader2,
  Building2,
  Search,
  CheckCircle2,
  X,
  RefreshCw,
  Filter,
  Eye,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { IAdminUserSummary, AdminUserRole } from "@/types";
import TablePagination from "@/components/admin/TablePagination";

export default function AdminUsersPage() {
  const router = useRouter();

  // Data State
  const [adminUsers, setAdminUsers] = useState<IAdminUserSummary[]>([]);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [currentUserDisplayName, setCurrentUserDisplayName] = useState<string>("");
  const [currentUserRole, setCurrentUserRole] = useState<"admin" | "editor">(() => {
    if (typeof window !== "undefined") {
      try {
        const storedRole =
          sessionStorage.getItem("rentorce_user_role") ||
          sessionStorage.getItem("apartmento_user_role") ||
          localStorage.getItem("rentorce_user_role") ||
          localStorage.getItem("apartmento_user_role");
        if (storedRole === "admin" || storedRole === "editor") return storedRole;
      } catch (_) {}
    }
    return "editor";
  });

  // Loading & Action State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState("");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "admin" | "editor" | "ACTIVE">("ALL");

  // Table Pagination States (50 items per page)
  const ITEMS_PER_PAGE = 50;
  const [usersPage, setUsersPage] = useState(1);

  // Reset page on search or filter change
  useEffect(() => {
    setUsersPage(1);
  }, [searchQuery, roleFilter]);

  // User Role Updating
  const [updatingUserRole, setUpdatingUserRole] = useState<string | null>(null);

  // User Deletion State
  const [userToDelete, setUserToDelete] = useState<IAdminUserSummary | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);
  const [deleteUserError, setDeleteUserError] = useState("");

  // Register New User Modal
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: "",
    displayName: "",
    password: "",
    role: "editor" as "admin" | "editor",
  });
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);
  const [userRegistrationError, setUserRegistrationError] = useState("");

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    try {
      const storedRole =
        sessionStorage.getItem("rentorce_user_role") ||
        sessionStorage.getItem("apartmento_user_role") ||
        localStorage.getItem("rentorce_user_role") ||
        localStorage.getItem("apartmento_user_role");
      if (storedRole === "editor") {
        router.replace("/admin?tab=apartments");
        return;
      }
    } catch (_) {}
    return () => {
      isMountedRef.current = false;
    };
  }, [router]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const fetchData = useCallback(async (isBackground = false) => {
    if (!isBackground) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.status === 401) {
        router.replace("/admin/login?redirect=%2Fadmin%2Fusers");
        return;
      }
      const data = await res.json();
      if (!isMountedRef.current) return;
      if (data.success) {
        if (data.currentUserRole === "editor") {
          router.replace("/admin?tab=apartments");
          return;
        }
        if (data.adminUsers) setAdminUsers(data.adminUsers);
        if (data.currentUser) setCurrentUser(data.currentUser);
        if (data.currentUserRole) setCurrentUserRole(data.currentUserRole);
        if (data.currentUserDisplayName) setCurrentUserDisplayName(data.currentUserDisplayName);
      }
    } catch (err) {
      console.error("Failed to load users list:", err);
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
  }, [fetchData]);

  const handleUpdateUserRole = async (username: string, newRole: AdminUserRole) => {
    setUpdatingUserRole(username);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update user role");
      }
      showToast(data.message || `Role for @${username} changed to ${newRole.toUpperCase()}!`);
      setAdminUsers((prev) =>
        prev.map((u) =>
          u.username.toLowerCase() === username.toLowerCase()
            ? { ...u, role: newRole }
            : u
        )
      );
      fetchData(true);
    } catch (err: any) {
      showToast(err?.message || "Failed to update user role");
    } finally {
      setUpdatingUserRole(null);
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;
    setDeletingUser(true);
    setDeleteUserError("");
    try {
      const res = await fetch(`/api/admin/users?username=${encodeURIComponent(userToDelete.username)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete user");
      }
      showToast(data.message || `User @${userToDelete.username} deleted successfully`);
      setAdminUsers((prev) => prev.filter((u) => u.username.toLowerCase() !== userToDelete.username.toLowerCase()));
      setUserToDelete(null);
      fetchData(true);
    } catch (err: any) {
      setDeleteUserError(err?.message || "Failed to delete user");
    } finally {
      setDeletingUser(false);
    }
  };

  const handleRegisterNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserRegistrationError("");
    setIsSubmittingUser(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setUserRegistrationError(data.error || "Failed to register user");
        setIsSubmittingUser(false);
        return;
      }
      showToast(data.message || `User registered successfully as ${newUserData.role.toUpperCase()}!`);
      setIsNewUserModalOpen(false);
      setNewUserData({ username: "", displayName: "", password: "", role: "editor" });
      fetchData(true);
    } catch (err: any) {
      setUserRegistrationError(err?.message || "An unexpected error occurred");
    } finally {
      setIsSubmittingUser(false);
    }
  };

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

  const formatDateSafe = (date: Date | string | number | undefined | null, fallback = "—") => {
    if (!date) return fallback;
    const d = new Date(date);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTimeSafe = (date: Date | string | number | undefined | null, fallback = "Offline") => {
    if (!date) return fallback;
    const d = new Date(date);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleString();
  };

  // Filtered Users
  const filteredUsers = adminUsers.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.lastIp && user.lastIp.includes(searchQuery));

    if (!matchesSearch) return false;

    if (roleFilter === "ACTIVE") return user.isActive;
    if (roleFilter !== "ALL") return user.role === roleFilter;

    return true;
  });

  const totalUsersPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
  const paginatedUsers = filteredUsers.slice(
    (usersPage - 1) * ITEMS_PER_PAGE,
    usersPage * ITEMS_PER_PAGE
  );

  const totalAdmins = adminUsers.filter((u) => u.role === "admin").length;
  const totalEditors = adminUsers.filter((u) => u.role === "editor").length;
  const totalActive = adminUsers.filter((u) => u.isActive).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin?tab=admins"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Admin</span>
            </Link>

            <div className="hidden sm:block h-5 w-px bg-slate-200" />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  User Accounts Directory
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                  {adminUsers.length} Registered
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Logged in User indicator */}
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

            {currentUserRole === "admin" && (
              <button
                type="button"
                onClick={() => {
                  setNewUserData({ username: "", displayName: "", password: "", role: "editor" });
                  setUserRegistrationError("");
                  setIsNewUserModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register User</span>
              </button>
            )}
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

      {/* Main Body */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        {/* Metric Overview Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Accounts</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{adminUsers.length}</span>
              <span className="text-[11px] text-slate-500 font-medium">Configured in system</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Administrators</span>
              <span className="text-2xl font-black text-purple-700 mt-1 block">{totalAdmins}</span>
              <span className="text-[11px] text-purple-600 font-medium">Full system access</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Editors</span>
              <span className="text-2xl font-black text-blue-700 mt-1 block">{totalEditors}</span>
              <span className="text-[11px] text-blue-600 font-medium">Content & inventory</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Now</span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">{totalActive}</span>
              <span className="text-[11px] text-emerald-600 font-medium">Live sessions running</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Search Controls */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user by name, @username, or IP..."
              className="w-full pl-9 pr-4 py-2 rounded-2xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:border-blue-500 outline-none transition"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            <span className="text-xs font-bold text-slate-400 uppercase mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {(
              [
                { id: "ALL", label: "All Users" },
                { id: "admin", label: `Admins (${totalAdmins})` },
                { id: "editor", label: `Editors (${totalEditors})` },
                { id: "ACTIVE", label: `Active (${totalActive})` },
              ] as const
            ).map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setRoleFilter(filter.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  roleFilter === filter.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table / List */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3 text-slate-900">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-xs font-semibold text-slate-500">Loading user accounts list...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No users found</h3>
            <p className="text-xs text-slate-400">No accounts match your current search query or filter.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-6">User / Name</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Joined Date</th>
                    <th className="py-4 px-6">Active Status</th>
                    <th className="py-4 px-6">Role Action</th>
                    <th className="py-4 px-6 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {paginatedUsers.map((user) => {
                    const isSelf = user.username.toLowerCase() === currentUser.toLowerCase();
                    const isRootFounder = ["sanzid", "sihabali"].includes(user.username.toLowerCase());
                    const isProtected = isRootFounder || isSelf;

                    return (
                      <tr
                        key={user.username}
                        className="hover:bg-blue-50/30 transition group"
                      >
                        {/* 1. Name & Avatar (Clickable to view detailed page) */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <Link
                              href={`/admin/users/${user.username}`}
                              className={`w-10 h-10 rounded-2xl text-white flex items-center justify-center font-black text-sm uppercase shadow-xs transition hover:scale-105 flex-shrink-0 ${
                                user.role === "admin"
                                  ? "bg-gradient-to-tr from-blue-600 to-indigo-500"
                                  : "bg-gradient-to-tr from-slate-700 to-slate-600"
                              }`}
                            >
                              {user.username.charAt(0)}
                            </Link>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Link
                                  href={`/admin/users/${user.username}`}
                                  className="font-black text-slate-900 hover:text-blue-600 transition flex items-center gap-1 group/link"
                                  title={`Click to view full details for @${user.username}`}
                                >
                                  <span>{user.displayName || user.username}</span>
                                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-600 opacity-0 group-hover/link:opacity-100 transition" />
                                </Link>

                                {isSelf && (
                                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold">
                                    You
                                  </span>
                                )}
                                {isRootFounder && (
                                  <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-bold border border-purple-200 flex items-center gap-1">
                                    <ShieldCheck className="w-2.5 h-2.5" />
                                    Founder
                                  </span>
                                )}
                              </div>
                              <Link
                                href={`/admin/users/${user.username}`}
                                className="text-[11px] font-mono text-slate-400 hover:text-blue-600 block mt-0.5 transition"
                              >
                                @{user.username}
                              </Link>
                            </div>
                          </div>
                        </td>

                        {/* 2. Role */}
                        <td className="py-4 px-6 font-semibold text-slate-700 text-xs">
                          {user.role === "admin" ? "Admin" : "Editor"}
                        </td>

                        {/* 3. Joined Date */}
                        <td className="py-4 px-6 font-medium text-slate-600">
                          {formatDateSafe(user.createdAt, "—")}
                        </td>

                        {/* 4. Active Status */}
                        <td className="py-4 px-6">
                          {user.isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-xs">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                              Active Now
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold"
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
                        </td>

                        {/* 5. Role Dropdown */}
                        <td className="py-4 px-6">
                          {isProtected ? (
                            <span className="text-xs font-semibold text-slate-400 italic">
                              Locked ({isRootFounder ? "Root Founder" : "Your Account"})
                            </span>
                          ) : currentUserRole === "admin" ? (
                            <div className="flex items-center gap-1.5">
                              <select
                                value={user.role}
                                disabled={updatingUserRole === user.username}
                                onChange={(e) =>
                                  handleUpdateUserRole(user.username, e.target.value as AdminUserRole)
                                }
                                className={`text-xs font-bold py-1 px-2.5 rounded-xl border outline-none transition cursor-pointer ${
                                  user.role === "admin"
                                    ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                                    : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                }`}
                                title="Change User Role"
                              >
                                <option value="admin">Role: Admin</option>
                                <option value="editor">Role: Editor</option>
                              </select>
                              {updatingUserRole === user.username && (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                              )}
                            </div>
                          ) : (
                            <span className="text-xs font-medium text-slate-500 capitalize">{user.role}</span>
                          )}
                        </td>

                        {/* 6. Action / Delete Button */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/admin/users/${user.username}`}
                              className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition cursor-pointer"
                              title="View Full Content Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            {currentUserRole === "admin" && !isProtected && (
                              <button
                                type="button"
                                onClick={() => {
                                  setUserToDelete(user);
                                  setDeleteUserError("");
                                }}
                                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition cursor-pointer"
                                title={`Delete user @${user.username}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <TablePagination
              currentPage={usersPage}
              totalPages={totalUsersPages}
              totalItems={filteredUsers.length}
              itemsPerPage={ITEMS_PER_PAGE}
              itemName="users"
              onPageChange={setUsersPage}
            />

            <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
              <span className="font-medium">
                Tip: Click on any user's name or the eye (<Eye className="w-3.5 h-3.5 inline mx-0.5 text-blue-600" />) icon to view their complete profile, listed apartments, and audit trail.
              </span>
              <span className="font-bold text-slate-700">
                {filteredUsers.length} account{filteredUsers.length === 1 ? "" : "s"} shown
              </span>
            </div>
          </div>
        )}
      </main>

      {/* REGISTER NEW USER MODAL */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Register New User</h3>
                  <p className="text-xs text-slate-500">Create an authorized account with role-based access</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewUserModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterNewUser} className="p-6 space-y-4 overflow-y-auto">
              {userRegistrationError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {userRegistrationError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Display Name</label>
                  <input
                    type="text"
                    required
                    value={newUserData.displayName}
                    onChange={(e) => setNewUserData({ ...newUserData, displayName: e.target.value })}
                    placeholder="Enter display name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Username (Login ID)</label>
                  <input
                    type="text"
                    required
                    value={newUserData.username}
                    onChange={(e) =>
                      setNewUserData({
                        ...newUserData,
                        username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
                      })
                    }
                    placeholder="Enter username"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-slate-700 block">Select Access Role</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setNewUserData({ ...newUserData, role: "editor" })}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                      newUserData.role === "editor"
                        ? "border-blue-600 bg-blue-50/50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-blue-600" />
                          Editor
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Can list new apartments and manage leads CRM. Cannot delete records or access admin settings.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setNewUserData({ ...newUserData, role: "admin" })}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                      newUserData.role === "admin"
                        ? "border-purple-600 bg-purple-50/50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                          Admin
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Full access across all tabs. Can register users, delete apartments, and modify system settings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUser}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmittingUser && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSubmittingUser ? "Registering..." : "Register User"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE USER CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-slate-900">Delete User Account?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-800">{userToDelete.displayName}</strong> (<code className="text-slate-700 font-mono">@{userToDelete.username}</code>)?
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
                  setUserToDelete(null);
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
    </div>
  );
}
