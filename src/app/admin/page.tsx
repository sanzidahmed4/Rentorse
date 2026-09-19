"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Users,
  Building2,
  Home,
  TrendingUp,
  Search,
  Filter,
  Download,
  Plus,
  RefreshCw,
  Edit2,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  PawPrint,
  LogOut,
  Sliders,
  LayoutDashboard,
  Calendar,
  X,
  Check,
  Save,
  Loader2,
  Shield,
  Eye,
  Upload,
  Trash2,
  ImageIcon,
  Star,
  ImagePlus,
  Link2,
  Clipboard,
  BedDouble,
  Bath,
  Maximize2,
  Camera,
  ExternalLink,
  ShieldCheck,
  Laptop,
  Globe,
  Activity,
  UserCheck,
  UserPlus,
  User,
  ArrowUpRight,
} from "lucide-react";
import { IApartment, ILead, ISiteStat, LeadStatus, IAdminUserSummary, IAdminLoginLog } from "@/types";
import TablePagination from "@/components/admin/TablePagination";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "apartments" | "stats" | "admins">(() => {
    if (typeof window !== "undefined") {
      try {
        const sp = new URLSearchParams(window.location.search);
        const urlTab = sp.get("tab");
        const storedRole = sessionStorage.getItem("apartmento_user_role") || localStorage.getItem("apartmento_user_role");
        const allowed = storedRole === "admin"
          ? ["overview", "leads", "apartments", "stats", "admins"]
          : ["overview", "leads", "apartments"];
        if (urlTab && allowed.includes(urlTab)) {
          return urlTab as any;
        }
      } catch (_) {}
    }
    return "overview";
  });

  const handleTabChange = (tab: "overview" | "leads" | "apartments" | "stats" | "admins") => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("apartmento_admin_active_tab", tab);
        const url = new URL(window.location.href);
        url.searchParams.set("tab", tab);
        window.history.replaceState(null, "", url.toString());
      } catch (_) {}
    }
  };

  // Current Logged In Admin & Audit State
  const [currentUser, setCurrentUser] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem("apartmento_user_name") || localStorage.getItem("apartmento_user_name") || "";
      } catch (_) {}
    }
    return "";
  });
  const [adminUsers, setAdminUsers] = useState<IAdminUserSummary[]>([]);
  const [adminLogs, setAdminLogs] = useState<IAdminLoginLog[]>([]);
  const [adminLogSearch, setAdminLogSearch] = useState("");
  const [adminLogStatusFilter, setAdminLogStatusFilter] = useState<"ALL" | "SUCCESS" | "FAILED">("ALL");
  const [adminLogUserFilter, setAdminLogUserFilter] = useState<string>("ALL");

  // RBAC & Creator Tracking State — Default to "editor" to prevent any flash of admin settings
  const [currentUserRole, setCurrentUserRole] = useState<"admin" | "editor">(() => {
    if (typeof window !== "undefined") {
      try {
        const storedRole = sessionStorage.getItem("apartmento_user_role") || localStorage.getItem("apartmento_user_role");
        if (storedRole === "admin" || storedRole === "editor") {
          return storedRole;
        }
        const cached = sessionStorage.getItem("apartmento_admin_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.currentUserRole === "admin" || parsed.currentUserRole === "editor") {
            return parsed.currentUserRole;
          }
        }
      } catch (_) {}
    }
    return "editor";
  });
  const [currentUserDisplayName, setCurrentUserDisplayName] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem("apartmento_user_display_name") || "";
      } catch (_) {}
    }
    return "";
  });
  const [aptCreatorFilter, setAptCreatorFilter] = useState<string>("ALL");
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: "",
    displayName: "",
    password: "",
    role: "editor" as "admin" | "editor",
  });
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);
  const [userRegistrationError, setUserRegistrationError] = useState("");
  const [userToDelete, setUserToDelete] = useState<IAdminUserSummary | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);
  const [deleteUserError, setDeleteUserError] = useState("");
  const [updatingUserRole, setUpdatingUserRole] = useState<string | null>(null);

  // State
  const [leads, setLeads] = useState<ILead[]>([]);
  const [apartments, setApartments] = useState<IApartment[]>([]);
  const [stats, setStats] = useState<ISiteStat>({
    activeApartments: "3,250+",
    activeRenters: "12,500+",
    propertiesListed: "4,200+",
    customersServed: "9,800+",
    satisfactionRate: "99.4%",
    supportEmail: "support@rentorce.com",
    supportPhone: "+1 (800) 492-7836",
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingStats, setSavingStats] = useState(false);
  const [notification, setNotification] = useState("");

  const copyToClipboard = async (text: string) => {
    if (!text) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Filters & Search
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>("ALL");
  const [leadSearchQuery, setLeadSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<ILead | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const urlLead = new URLSearchParams(window.location.search).get("lead");
      const storedLead = sessionStorage.getItem("apartmento_admin_selected_row");
      return urlLead || storedLead || null;
    } catch (_) {
      return null;
    }
  });

  const getLeadRowId = (lead: ILead, fallbackIdx: number): string => {
    return String(lead._id || lead.id || `lead_${lead.serialNumber || fallbackIdx}`);
  };

  const formatDuration = (ms: number): string => {
    if (isNaN(ms) || ms <= 0) return "Just now";
    if (ms < 60 * 1000) {
      return `${Math.max(1, Math.floor(ms / 1000))}s`;
    }
    const minutes = Math.floor(ms / (60 * 1000));
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remMinutes = minutes % 60;
    if (hours < 24) {
      return remMinutes > 0 ? `${hours}h ${remMinutes}m` : `${hours}h`;
    }
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const formatTimeAgo = (date: Date | string | number | undefined | null): string => {
    if (!date) return "Offline";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Offline";
    const diffMs = Math.max(0, Date.now() - d.getTime());
    if (diffMs < 60 * 1000) return "Just now";
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}hr ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };


  const handleSelectRow = (rowId: string | null) => {
    setSelectedRowId(rowId);
    if (typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href);
        if (rowId) {
          url.searchParams.set("lead", rowId);
          sessionStorage.setItem("apartmento_admin_selected_row", rowId);
        } else {
          url.searchParams.delete("lead");
          url.searchParams.delete("leadModal");
          sessionStorage.removeItem("apartmento_admin_selected_row");
          sessionStorage.removeItem("apartmento_admin_lead_modal");
          setSelectedLead(null);
        }
        window.history.replaceState(null, "", url.toString());
      } catch (_) {}
    }
  };

  const handleOpenLeadModal = (lead: ILead, rowId?: string) => {
    const targetId = rowId || getLeadRowId(lead, 0);
    setSelectedLead(lead);
    setSelectedRowId(targetId);
    if (typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("lead", targetId);
        url.searchParams.set("leadModal", "1");
        sessionStorage.setItem("apartmento_admin_selected_row", targetId);
        sessionStorage.setItem("apartmento_admin_lead_modal", targetId);
        window.history.replaceState(null, "", url.toString());
      } catch (_) {}
    }
  };

  const handleCloseLeadModal = () => {
    setSelectedLead(null);
    if (typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("leadModal");
        sessionStorage.removeItem("apartmento_admin_lead_modal");
        window.history.replaceState(null, "", url.toString());
      } catch (_) {}
    }
  };

  // Apartment Editing
  const [editingApt, setEditingApt] = useState<IApartment | null>(null);
  const [isNewAptModal, setIsNewAptModal] = useState(false);
  const [imageInputUrl, setImageInputUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apartment Filters & Search
  const [aptCategoryFilter, setAptCategoryFilter] = useState<string>("ALL");
  const [aptFurnishedFilter, setAptFurnishedFilter] = useState<string>("ALL");
  const [aptStatusFilter, setAptStatusFilter] = useState<string>("ALL");
  const [aptTypeFilter, setAptTypeFilter] = useState<string>("ALL");
  const [aptSearchQuery, setAptSearchQuery] = useState("");

  // Table Pagination States (50 items per page)
  const ITEMS_PER_PAGE = 50;
  const [leadsPage, setLeadsPage] = useState(1);
  const [aptsPage, setAptsPage] = useState(1);
  const [auditLogsPage, setAuditLogsPage] = useState(1);

  // Reset leads page when filters or search change
  useEffect(() => {
    setLeadsPage(1);
  }, [leadSearchQuery, leadStatusFilter]);

  // Reset apartments page when filters or search change
  useEffect(() => {
    setAptsPage(1);
  }, [aptCategoryFilter, aptFurnishedFilter, aptStatusFilter, aptTypeFilter, aptCreatorFilter, aptSearchQuery]);

  // Reset audit logs page when filters or search change
  useEffect(() => {
    setAuditLogsPage(1);
  }, [adminLogSearch, adminLogStatusFilter, adminLogUserFilter]);

  useEffect(() => {
    // Default active tab to "overview" unless explicitly specified via URL param (?tab=...)
    try {
      const urlTab = new URLSearchParams(window.location.search).get("tab");
      const storedRole = (typeof window !== "undefined"
        ? (sessionStorage.getItem("apartmento_user_role") || localStorage.getItem("apartmento_user_role"))
        : null) || currentUserRole;

      const allowedTabs = storedRole === "admin"
        ? ["overview", "leads", "apartments", "stats", "admins"]
        : ["overview", "leads", "apartments"];

      const targetTab = (urlTab && allowedTabs.includes(urlTab))
        ? (urlTab as "overview" | "leads" | "apartments" | "stats" | "admins")
        : "overview";

      setActiveTab(targetTab);
      localStorage.setItem("apartmento_admin_active_tab", targetTab);
      if (!urlTab || urlTab !== targetTab) {
        const url = new URL(window.location.href);
        url.searchParams.set("tab", targetTab);
        window.history.replaceState(null, "", url.toString());
      }
    } catch (_) {}

    const onPopState = () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const urlTab = searchParams.get("tab") as any;
        const allowedTabs = currentUserRole === "admin"
          ? ["overview", "leads", "apartments", "stats", "admins"]
          : ["overview", "leads", "apartments"];
        if (urlTab && allowedTabs.includes(urlTab)) {
          setActiveTab(urlTab);
        }
        const urlLead = searchParams.get("lead");
        setSelectedRowId(urlLead || null);
        const hasModal = searchParams.get("leadModal") === "1" || searchParams.get("modal") === "1";
        if (!hasModal) {
          setSelectedLead(null);
        } else if (urlLead) {
          setSelectedLead((curr) => {
            if (curr && String(curr._id || curr.id) === urlLead) return curr;
            try {
              const cached = sessionStorage.getItem("apartmento_admin_cache");
              if (cached) {
                const parsed = JSON.parse(cached);
                const found = parsed.leads?.find((l: ILead) => String(l._id || l.id) === urlLead);
                if (found) return found;
              }
            } catch (_) {}
            return curr;
          });
        }
      } catch (_) {}
    };
    window.addEventListener("popstate", onPopState);

    // Instant display from session cache ONLY if it matches the current user & role
    try {
      const cached = sessionStorage.getItem("apartmento_admin_cache") || localStorage.getItem("apartmento_admin_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        const storedRole = sessionStorage.getItem("apartmento_user_role") || localStorage.getItem("apartmento_user_role");
        const storedUser = sessionStorage.getItem("apartmento_user_name") || localStorage.getItem("apartmento_user_name");

        const matchesUser = !storedUser || !parsed.currentUser || parsed.currentUser.toLowerCase() === storedUser.toLowerCase();
        const matchesRole = !storedRole || parsed.currentUserRole === storedRole;

        if (matchesUser && matchesRole) {
          if (parsed.leads && Array.isArray(parsed.leads)) {
            setLeads(parsed.leads);
            const searchParams = new URLSearchParams(window.location.search);
            const urlLead = searchParams.get("lead");
            const hasModal = searchParams.get("leadModal") === "1" || searchParams.get("modal") === "1";
            const storedModal = sessionStorage.getItem("apartmento_admin_lead_modal") || localStorage.getItem("apartmento_admin_lead_modal");
            const targetModal = (hasModal && urlLead) ? urlLead : storedModal;
            if (targetModal) {
              const found = parsed.leads.find((l: ILead) => String(l._id || l.id) === targetModal);
              if (found) setSelectedLead(found);
            }
          }
          if (parsed.apartments) setApartments(parsed.apartments);
          if (parsed.stats) setStats(parsed.stats);
          if (parsed.adminUsers) setAdminUsers(parsed.adminUsers);
          if (parsed.adminLogs) setAdminLogs(parsed.adminLogs);
          if (parsed.currentUser && parsed.currentUser.toLowerCase() !== "admin") {
            setCurrentUser(parsed.currentUser);
          }
          if (parsed.currentUserRole) setCurrentUserRole(parsed.currentUserRole);
          if (parsed.currentUserDisplayName) setCurrentUserDisplayName(parsed.currentUserDisplayName);
          setLoading(false);
        } else {
          sessionStorage.removeItem("apartmento_admin_cache");
          localStorage.removeItem("apartmento_admin_cache");
        }
      }
    } catch (_) {}

    fetchDashboardData();

    // Auto-refresh every 12 seconds so newly booked apartments and active statuses appear automatically!
    const timer = setInterval(() => {
      fetchDashboardData(true);
    }, 12000);

    return () => {
      window.removeEventListener("popstate", onPopState);
      clearInterval(timer);
    };
  }, []);

  // Restore or keep selectedLead synced when leads data updates
  useEffect(() => {
    if (!leads || leads.length === 0) return;
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlLead = searchParams.get("lead");
      const hasModal = searchParams.get("leadModal") === "1" || searchParams.get("modal") === "1";
      const storedModal = sessionStorage.getItem("apartmento_admin_lead_modal") || localStorage.getItem("apartmento_admin_lead_modal");
      const targetModalLeadId = (hasModal && urlLead) ? urlLead : storedModal;

      if (targetModalLeadId) {
        setSelectedLead((current) => {
          if (current && String(current._id || current.id) === targetModalLeadId) {
            const updated = leads.find((l) => String(l._id || l.id) === targetModalLeadId);
            return updated || current;
          }
          const match = leads.find((l) => String(l._id || l.id) === targetModalLeadId);
          return match || current;
        });
      }

      const storedRow = urlLead || sessionStorage.getItem("apartmento_admin_selected_row") || localStorage.getItem("apartmento_admin_selected_row");
      if (storedRow && !selectedRowId) {
        setSelectedRowId(storedRow);
      }
    } catch (_) {}
  }, [leads]);

  // Restrict editor role strictly to overview, leads, and apartments
  useEffect(() => {
    if (currentUserRole === "editor" && (activeTab === "stats" || activeTab === "admins")) {
      handleTabChange("overview");
    }
  }, [currentUserRole, activeTab]);

  const fetchDashboardData = async (isBackground = false) => {
    if (!isBackground) setRefreshing(true);
    try {
      // Single unified call to fetch leads, apartments, stats, and audit data concurrently
      const res = await fetch("/api/admin/dashboard");
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!res.ok && res.status >= 500) {
        // Server error: don't crash, let finally run to clear loading state
        console.warn("Dashboard API server error:", res.status);
        return;
      }

      const data = await res.json();
      if (data.success) {
        if (data.leads) {
          setLeads(data.leads);
          setSelectedLead((current) => {
            if (!current) return null;
            const currentId = String(current._id || current.id);
            const fresh = data.leads.find((l: ILead) => String(l._id || l.id) === currentId);
            return fresh || current;
          });
        }
        if (data.apartments) setApartments(data.apartments);
        if (data.stats) setStats(data.stats);
        if (data.currentUser) {
          setCurrentUser(data.currentUser);
          try {
            sessionStorage.setItem("apartmento_user_name", data.currentUser);
            localStorage.setItem("apartmento_user_name", data.currentUser);
          } catch (_) {}
        }
        if (data.currentUserRole) {
          setCurrentUserRole(data.currentUserRole);
          try {
            sessionStorage.setItem("apartmento_user_role", data.currentUserRole);
            localStorage.setItem("apartmento_user_role", data.currentUserRole);
          } catch (_) {}
        }
        if (data.currentUserDisplayName) {
          setCurrentUserDisplayName(data.currentUserDisplayName);
          try {
            sessionStorage.setItem("apartmento_user_display_name", data.currentUserDisplayName);
          } catch (_) {}
        }
        if (data.adminUsers) setAdminUsers(data.adminUsers);
        if (data.adminLogs) setAdminLogs(data.adminLogs);

        try {
          sessionStorage.setItem(
            "apartmento_admin_cache",
            JSON.stringify({
              leads: data.leads,
              apartments: data.apartments,
              stats: data.stats,
              currentUser: data.currentUser,
              currentUserRole: data.currentUserRole,
              currentUserDisplayName: data.currentUserDisplayName,
              adminUsers: data.adminUsers,
              adminLogs: data.adminLogs,
            })
          );
        } catch (_) {}

        try {
          const pendingToast = sessionStorage.getItem("apartmento_toast");
          if (pendingToast) {
            sessionStorage.removeItem("apartmento_toast");
            showToast(pendingToast);
          }
        } catch (_) {}
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      if (!isBackground) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const [revokingSessions, setRevokingSessions] = useState(false);
  const [resettingLogs, setResettingLogs] = useState(false);

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("apartmento_admin_cache");
      sessionStorage.removeItem("apartmento_user_role");
      sessionStorage.removeItem("apartmento_user_name");
      sessionStorage.removeItem("apartmento_user_display_name");
      localStorage.removeItem("apartmento_user_role");
      localStorage.removeItem("apartmento_user_name");
      sessionStorage.removeItem("apartmento_admin_selected_row");
      localStorage.removeItem("apartmento_admin_selected_row");
      localStorage.removeItem("apartmento_admin_lead_modal");
      localStorage.removeItem("apartmento_admin_active_tab");
      document.cookie = "apartmento_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } catch (_) {}
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const handleLogoutAllDevices = async () => {
    if (
      !confirm(
        "Are you sure you want to log out all devices? This will invalidate all active admin sessions across every computer and mobile device immediately."
      )
    ) {
      return;
    }
    setRevokingSessions(true);
    try {
      const res = await fetch("/api/admin/logout-all", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showToast("All admin sessions across all devices have been terminated.");
        try {
          sessionStorage.clear();
          localStorage.removeItem("apartmento_user_role");
          localStorage.removeItem("apartmento_user_name");
          localStorage.removeItem("apartmento_admin_selected_row");
          localStorage.removeItem("apartmento_admin_active_tab");
          document.cookie = "apartmento_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        } catch (_) {}
        setTimeout(() => {
          router.replace("/admin/login");
          router.refresh();
        }, 800);
      } else {
        showToast(data.error || "Failed to revoke sessions");
      }
    } catch (e) {
      console.error(e);
      showToast("Network error while revoking sessions");
    } finally {
      setRevokingSessions(false);
    }
  };

  const handleResetAllLogs = async () => {
    if (currentUserRole !== "admin") return;
    if (
      !confirm(
        "Are you sure you want to reset and clear all login activity and audit trail records? This action cannot be undone."
      )
    ) {
      return;
    }

    setResettingLogs(true);
    try {
      const res = await fetch("/api/admin/logs", { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminLogs([]);
        try {
          const cached = sessionStorage.getItem("apartmento_admin_cache");
          if (cached) {
            const parsed = JSON.parse(cached);
            parsed.adminLogs = [];
            sessionStorage.setItem("apartmento_admin_cache", JSON.stringify(parsed));
          }
        } catch (_) {}
        showToast("All login activity and audit trail records have been reset successfully.");
      } else {
        showToast(data.error || "Failed to reset login activity logs.");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error while resetting login activity logs.");
    } finally {
      setResettingLogs(false);
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l._id === leadId || l.id === leadId ? { ...l, status: newStatus } : l))
        );
        if (selectedLead && (selectedLead._id === leadId || selectedLead.id === leadId)) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
        showToast(`Lead status updated to ${newStatus}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateLeadNotes = async (leadId: string, notes: string) => {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId || l.id === leadId ? { ...l, notes } : l))
      );
      showToast("Lead notes saved.");
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStats(true);
    try {
      const res = await fetch("/api/stats", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stats),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Site statistics & footer contact info updated live!");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("apartmento_stats_updated"));
        }
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to update site settings.");
    } finally {
      setSavingStats(false);
    }
  };

  const handleSaveApartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApt) return;

    try {
      const trimmedAddress = editingApt.addressTemplate ? editingApt.addressTemplate.trim() : "";
      const hasAddress = trimmedAddress.length > 0;
      const payload = {
        ...editingApt,
        addressTemplate: trimmedAddress,
        cityState: hasAddress ? trimmedAddress : "",
        isManual: hasAddress,
      };

      if (isNewAptModal) {
        const res = await fetch("/api/apartments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          showToast(hasAddress ? "New real apartment created!" : "New chameleon apartment created!");
          setIsNewAptModal(false);
          setEditingApt(null);
          fetchDashboardData();
        }
      } else {
        const aptId = editingApt._id || editingApt.id;
        const res = await fetch(`/api/apartments/${aptId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast(hasAddress ? "Apartment updated with real location!" : "Apartment updated (Chameleon mode active)!");
          setEditingApt(null);
          fetchDashboardData();
        }
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to save apartment.");
    }
  };

  const uploadFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0 || !editingApt) return;
    setIsUploadingImage(true);
    try {
      const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (fileArray.length === 0) {
        showToast("Please select valid image files.");
        return;
      }

      const uploadedUrls: string[] = [];
      for (const file of fileArray) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        const currentImages = editingApt.images || [];
        setEditingApt({
          ...editingApt,
          images: [...currentImages, ...uploadedUrls],
        });
        showToast(`Added ${uploadedUrls.length} photo(s)!`);
      } else {
        showToast("Failed to upload photo(s).");
      }
    } catch (err) {
      console.error(err);
      showToast("Error uploading photo(s).");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const handlePasteImage = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile();
        if (file) imageFiles.push(file);
      }
    }

    if (imageFiles.length > 0) {
      e.preventDefault();
      uploadFiles(imageFiles);
    }
  };

  const handlePasteFromClipboardBtn = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const clipboardItems = await navigator.clipboard.read();
        const files: File[] = [];
        for (const item of clipboardItems) {
          for (const type of item.types) {
            if (type.startsWith("image/")) {
              const blob = await item.getType(type);
              const file = new File([blob], `clipboard-${Date.now()}.${type.split("/")[1] || "png"}`, { type });
              files.push(file);
            }
          }
        }
        if (files.length > 0) {
          await uploadFiles(files);
          return;
        }
      }

      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = (await navigator.clipboard.readText()).trim();
        if (text && /^https?:\/\/.+/i.test(text)) {
          const current = editingApt?.images || [];
          setEditingApt({
            ...editingApt!,
            images: [...current, text],
          });
          showToast("Added image URL from clipboard!");
          return;
        }
      }
      showToast("No image in clipboard. Copy an image or URL first.");
    } catch (_) {
      showToast("Press Ctrl+V / Cmd+V to paste your image directly.");
    }
  };

  const handleAddImageUrl = () => {
    if (!imageInputUrl.trim() || !editingApt) return;
    const url = imageInputUrl.trim();
    const currentImages = editingApt.images || [];
    setEditingApt({
      ...editingApt,
      images: [...currentImages, url],
    });
    setImageInputUrl("");
    showToast("Photo URL added!");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (!editingApt) return;
    const currentImages = editingApt.images || [];
    setEditingApt({
      ...editingApt,
      images: currentImages.filter((_, idx) => idx !== indexToRemove),
    });
  };

  const handleSetPrimaryImage = (indexToPrimary: number) => {
    if (!editingApt) return;
    const currentImages = editingApt.images || [];
    const selected = currentImages[indexToPrimary];
    const others = currentImages.filter((_, idx) => idx !== indexToPrimary);
    setEditingApt({
      ...editingApt,
      images: [selected, ...others],
    });
    showToast("Set as primary cover photo!");
  };

  const handleTogglePublish = async (apt: IApartment) => {
    const aptId = apt._id || apt.id;
    const newStatus = !apt.isActive;
    try {
      const res = await fetch(`/api/apartments/${aptId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (res.ok) {
        showToast(newStatus ? "Apartment published to live site!" : "Apartment unpublished!");
        fetchDashboardData(true);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to update publish status.");
    }
  };

  const handleToggleFeatured = async (apt: IApartment) => {
    const aptId = apt._id || apt.id;
    const newFeatured = !apt.featured;
    try {
      const res = await fetch(`/api/apartments/${aptId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: newFeatured }),
      });
      if (res.ok) {
        showToast(newFeatured ? "Featured on Homepage!" : "Removed from Homepage feature!");
        fetchDashboardData(true);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to update feature status.");
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (currentUserRole !== "admin") {
      showToast("Only administrators can delete leads.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => (l._id || l.id) !== leadId));
        if (selectedRowId === leadId) {
          handleSelectRow(null);
        }
        if (selectedLead && (selectedLead._id === leadId || selectedLead.id === leadId)) {
          handleCloseLeadModal();
        }
        showToast("Lead deleted successfully!");
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || "Failed to delete lead.");
      }
    } catch (err) {
      console.error(err);
      showToast("Error deleting lead.");
    }
  };

  const handleClearAllLeads = async () => {
    if (currentUserRole !== "admin") {
      showToast("Only administrators can reset leads.");
      return;
    }
    if (!window.confirm("WARNING: Are you sure you want to delete ALL captured leads? This cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch("/api/leads", {
        method: "DELETE",
      });
      if (res.ok) {
        setLeads([]);
        handleSelectRow(null);
        handleCloseLeadModal();
        showToast("All leads cleared successfully!");
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || "Failed to clear leads.");
      }
    } catch (err) {
      console.error(err);
      showToast("Error clearing leads.");
    }
  };

  const handleDeleteApartment = async (aptId: string) => {
    if (!aptId) return;
    if (currentUserRole !== "admin") {
      showToast("Only administrators can delete apartments.");
      return;
    }
    if (!window.confirm("Are you sure you want to permanently delete this apartment listing?")) {
      return;
    }
    try {
      const res = await fetch(`/api/apartments/${aptId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        showToast("Apartment deleted successfully.");
        fetchDashboardData(true);
      } else {
        showToast(data.error || "Failed to delete apartment.");
      }
    } catch (err) {
      console.error(err);
      showToast("Error deleting apartment.");
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
      fetchDashboardData(true);
    } catch (err: any) {
      setUserRegistrationError(err?.message || "An unexpected error occurred");
    } finally {
      setIsSubmittingUser(false);
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
      fetchDashboardData(true);
    } catch (err: any) {
      setDeleteUserError(err?.message || "Failed to delete user");
    } finally {
      setDeletingUser(false);
    }
  };

  const handleUpdateUserRole = async (username: string, newRole: "admin" | "editor") => {
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
      fetchDashboardData(true);
    } catch (err: any) {
      showToast(err?.message || "Failed to update user role");
    } finally {
      setUpdatingUserRole(null);
    }
  };



  // Helper to resolve apartment info and price for a lead
  const getLeadApartmentInfo = (lead: ILead) => {
    if (lead.selectedApartmentPrice && lead.selectedApartmentTitle) {
      const apt = apartments.find(
        (a) => a._id === lead.selectedApartmentId || a.id === lead.selectedApartmentId
      );
      return {
        title: lead.selectedApartmentTitle,
        price: lead.selectedApartmentPrice,
        id: lead.selectedApartmentId,
        apt,
      };
    }
    if (lead.selectedApartmentId) {
      const apt = apartments.find(
        (a) => a._id === lead.selectedApartmentId || a.id === lead.selectedApartmentId
      );
      if (apt) {
        return {
          title: apt.title,
          price: apt.baseRent,
          id: apt._id || apt.id,
          apt,
        };
      }
    }
    if (lead.matchedApartments && lead.matchedApartments.length > 0) {
      const firstId = lead.matchedApartments[0];
      const apt = apartments.find((a) => a._id === firstId || a.id === firstId);
      if (apt && lead.notes?.toLowerCase().includes("tour")) {
        return {
          title: apt.title,
          price: apt.baseRent,
          id: apt._id || apt.id,
          apt,
        };
      }
    }
    return null;
  };

  const exportLeadsToCSV = () => {
    if (currentUserRole === "editor") return;
    if (leads.length === 0) return alert("No leads to export.");
    const headers = [
      "SL No.",
      "ID",
      "Full Name",
      "Email",
      "Phone",
      "Status",
      "Location",
      "Selected Apartment",
      "Price",
      "Bedrooms",
      "Bathrooms",
      "Budget Min",
      "Budget Max",
      "US Resident",
      "Age",
      "Family Members",
      "Has Pets",
      "Created At",
    ];
    const rows = [...leads]
      .sort((a, b) => (b.serialNumber || 0) - (a.serialNumber || 0))
      .map((l, idx) => {
        const aptInfo = getLeadApartmentInfo(l);
        return [
          l.serialNumber || idx + 1,
          l._id || l.id,
          `"${l.fullName}"`,
          `"${l.email}"`,
          `"${l.phone}"`,
          l.status,
          `"${l.desiredLocation || "United States"}"`,
          `"${aptInfo?.title || ""}"`,
          aptInfo ? aptInfo.price : `${l.budgetMin}-${l.budgetMax}`,
          l.bedrooms,
          l.bathrooms,
          l.budgetMin,
          l.budgetMax,
          l.isUsResident ? "Yes" : "No",
          l.age,
          l.familyMembers,
          l.hasPets ? "Yes" : "No",
          new Date(l.createdAt).toLocaleDateString(),
        ];
      });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `apartmento_leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered leads - newest leads on top, SL 1 at bottom
  const filteredLeads = [...leads]
    .sort((a, b) => (b.serialNumber || 0) - (a.serialNumber || 0))
    .filter((lead) => {
      if (leadStatusFilter !== "ALL" && lead.status !== leadStatusFilter) return false;
      if (leadSearchQuery) {
        const q = leadSearchQuery.toLowerCase();
        const match =
          lead.fullName.toLowerCase().includes(q) ||
          lead.email.toLowerCase().includes(q) ||
          lead.phone.toLowerCase().includes(q) ||
          lead.desiredLocation.toLowerCase().includes(q) ||
          (lead.serialNumber && `#${lead.serialNumber}`.includes(q)) ||
          (lead.serialNumber && `${lead.serialNumber}` === q.trim());
        if (!match) return false;
      }
      return true;
    });

  // Paginated leads (50 per page)
  const totalLeadsPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE) || 1;
  const paginatedLeads = filteredLeads.slice(
    (leadsPage - 1) * ITEMS_PER_PAGE,
    leadsPage * ITEMS_PER_PAGE
  );

  // KPI Calculations
  const totalLeadsCount = leads.length;
  const newLeadsCount = leads.filter((l) => l.status === "New").length;
  const qualifiedLeadsCount = leads.filter((l) => l.status === "Qualified" || l.status === "Matched").length;
  const convertedLeadsCount = leads.filter((l) => l.status === "Converted").length;


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white border border-slate-200 p-2 flex items-center justify-center shadow-sm">
              <Image
                src="/fulllogo.svg"
                alt="Rentorce Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-slate-900">
                  Rentorc<span className="text-blue-600">e</span>
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Admin Back-Office
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Lead Generation Funnel & Inventory CRM</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {/* Logged in Administrator Indicator */}
            <Link
              href={
                currentUser
                  ? `/admin/users/${currentUser}?from=${activeTab}`
                  : currentUserRole === "editor"
                  ? "/admin?tab=apartments"
                  : "/admin/users"
              }
              className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/80 transition cursor-pointer group"
              title="Open your profile"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 group-hover:scale-105 text-white flex items-center justify-center text-xs font-black uppercase shadow-xs transition">
                {currentUser ? currentUser.charAt(0) : (currentUserRole === "admin" ? "A" : "E")}
              </div>
              <div className="text-left leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition">{currentUser}</span>
                  <span className="relative flex h-2 w-2" title="Active Session">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  {currentUserRole === "admin" ? "Active Admin" : "Active Editor"}
                </span>
              </div>
            </Link>

            <button
              onClick={() => fetchDashboardData()}
              disabled={refreshing}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition cursor-pointer disabled:cursor-not-allowed"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold border border-red-200 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
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

      {/* Main Admin Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        {/* Navigation Tabs & Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "leads", label: loading ? "Leads CRM" : `Leads CRM (${leads.length})`, icon: Users },
              { id: "apartments", label: loading ? "Apartment Inventory" : `Apartment Inventory (${apartments.length})`, icon: Building2 },
              { id: "stats", label: "Dashboard", icon: LayoutDashboard },
              { id: "admins", label: "Admin", icon: ShieldCheck },
            ]
              .filter((tab) => {
                if (currentUserRole !== "admin") {
                  return tab.id === "overview" || tab.id === "leads" || tab.id === "apartments";
                }
                return true;
              })
              .map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  suppressHydrationWarning
                  onClick={() => handleTabChange(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                    active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* For Editor users on Leads CRM tab: search box & status filter placed directly in tab bar */}
          {currentUserRole === "editor" && activeTab === "leads" && (
            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
              <div className="relative w-full sm:w-64 md:w-72 lg:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone, email, or city..."
                  value={leadSearchQuery}
                  onChange={(e) => setLeadSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500 transition shadow-xs"
                />
              </div>

              <select
                value={leadStatusFilter}
                onChange={(e) => setLeadStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 outline-none focus:border-blue-500 transition shadow-xs cursor-pointer whitespace-nowrap"
              >
                <option value="ALL">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Matched">Matched</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3 text-slate-900">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm font-medium text-slate-500">Loading Rentorce Admin Portal...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                  Total Captured Leads
                </span>
                <div className="text-3xl font-black text-slate-900">{totalLeadsCount}</div>
                <div className="text-[11px] text-blue-600 flex items-center gap-1 font-medium">
                  <Users className="w-3.5 h-3.5" /> High-intent rental queries
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                  New Uncontacted
                </span>
                <div className="text-3xl font-black text-amber-600">{newLeadsCount}</div>
                <div className="text-[11px] text-amber-600 font-medium">Pending leasing agent follow-up</div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                  Tour Requests / Qualified
                </span>
                <div className="text-3xl font-black text-indigo-600">{qualifiedLeadsCount}</div>
                <div className="text-[11px] text-indigo-600 font-medium">Scheduled walkthroughs</div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                  Active Inventory
                </span>
                <div className="text-3xl font-black text-emerald-600">{apartments.length}</div>
                <div className="text-[11px] text-emerald-600 font-medium">1B, 2B, 3B USA Apartments</div>
              </div>
            </div>

            {/* Quick Recent Leads Section */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Recent High-Intent Leads</h3>
                  <p className="text-xs text-slate-500">Visitors who just completed the apartment matching quiz</p>
                </div>
                <button
                  onClick={() => handleTabChange("leads")}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                >
                  View All in CRM →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 uppercase tracking-wider text-[10px] text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3 font-semibold text-center w-12">SL</th>
                      <th className="py-3 px-4 font-semibold">Email</th>
                      <th className="py-3 px-4 font-semibold">Phone No.</th>
                      <th className="py-3 px-4 font-semibold">Location</th>
                      <th className="py-3 px-4 font-semibold">Specs</th>
                      <th className="py-3 px-4 font-semibold">Price</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.slice(0, 5).map((lead, idx) => {
                      const aptInfo = getLeadApartmentInfo(lead);
                      const leadIdStr = getLeadRowId(lead, idx);
                      const isSelected = selectedRowId === leadIdStr;
                      return (
                        <tr
                          key={leadIdStr}
                          onClick={() => handleSelectRow(leadIdStr)}
                          className={`transition-all cursor-pointer ${
                            isSelected
                              ? "bg-blue-100/70 border-l-4 border-l-blue-600 shadow-sm"
                              : "hover:bg-slate-100/80"
                          }`}
                        >
                          <td className="py-3.5 px-3 text-center">
                            <span className="text-slate-600 font-semibold text-xs">
                              {lead.serialNumber || idx + 1}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              onClick={() => {
                                copyToClipboard(lead.email);
                                handleSelectRow(leadIdStr);
                              }}
                              className="text-slate-700 font-medium truncate max-w-[160px] block cursor-pointer select-text"
                            >
                              {lead.email}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              onClick={() => {
                                copyToClipboard(lead.phone);
                                handleSelectRow(leadIdStr);
                              }}
                              className="text-slate-700 font-medium whitespace-nowrap cursor-pointer select-text block"
                            >
                              {lead.phone}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-700">
                            <span
                              onClick={() => {
                                copyToClipboard(lead.desiredLocation || "United States");
                                handleSelectRow(leadIdStr);
                              }}
                              className="cursor-pointer select-text block hover:text-slate-900"
                            >
                              {lead.desiredLocation || "United States"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              onClick={() => {
                                copyToClipboard(`${lead.bedrooms}B / ${lead.bathrooms}Ba`);
                                handleSelectRow(leadIdStr);
                              }}
                              className="cursor-pointer select-text block"
                            >
                              {lead.bedrooms}B / {lead.bathrooms}Ba
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {aptInfo ? (
                              <div>
                                <span
                                  onClick={() => {
                                    copyToClipboard(`$${aptInfo.price.toLocaleString()}/mo`);
                                    handleSelectRow(leadIdStr);
                                  }}
                                  className="font-black text-emerald-600 text-xs cursor-pointer select-text inline-block"
                                >
                                  ${aptInfo.price.toLocaleString()}/mo
                                </span>
                                {aptInfo.apt?.slug || aptInfo.apt?._id || aptInfo.id ? (
                                  <a
                                    href={`/apartments/${aptInfo.apt?.slug || aptInfo.apt?._id || aptInfo.id}${lead.desiredLocation ? `?loc=${encodeURIComponent(lead.desiredLocation)}` : ""}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline truncate max-w-[120px] block font-medium"
                                    title={`Open ${aptInfo.title} in new tab`}
                                  >
                                    {aptInfo.title} ↗
                                  </a>
                                ) : (
                                  <div className="text-[10px] text-slate-500 truncate max-w-[120px]" title={aptInfo.title}>
                                    {aptInfo.title}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div>
                                <span
                                  onClick={() => {
                                    copyToClipboard(`$${lead.budgetMin} – $${lead.budgetMax}`);
                                    handleSelectRow(leadIdStr);
                                  }}
                                  className="font-bold text-slate-800 text-xs cursor-pointer select-text inline-block"
                                >
                                  ${lead.budgetMin} – ${lead.budgetMax}
                                </span>
                                <div className="text-[10px] text-slate-400">Budget Range</div>
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                lead.status === "New"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : lead.status === "Qualified"
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                  : lead.status === "Converted"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-slate-100 text-slate-700 border-slate-200"
                              }`}
                            >
                              {lead.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenLeadModal(lead, leadIdStr);
                              }}
                              title="View Details"
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white transition shadow-sm border border-blue-200 inline-flex items-center justify-center cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {leads.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400">
                          No leads captured yet. Run a search on the homepage to test!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LEADS CRM */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            {/* Filter and Export Bar (Hidden for editor role as it is relocated to the tab bar above) */}
            {currentUserRole !== "editor" && (
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by name, phone, email, or city..."
                      value={leadSearchQuery}
                      onChange={(e) => setLeadSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition"
                    />
                  </div>

                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Matched">Matched</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                  {currentUserRole === "admin" && leads.length > 0 && (
                    <button
                      onClick={handleClearAllLeads}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-bold text-xs border border-rose-200 transition cursor-pointer"
                      title="Delete and reset all leads"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Reset All Leads
                    </button>
                  )}
                  <button
                    onClick={exportLeadsToCSV}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export to CSV
                  </button>
                </div>
              </div>
            )}

            {/* Leads Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 uppercase tracking-wider text-[10px] text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-3 font-semibold text-center w-12">SL</th>
                      <th className="py-3.5 px-4 font-semibold">Email</th>
                      <th className="py-3.5 px-4 font-semibold">Phone No.</th>
                      <th className="py-3.5 px-4 font-semibold">Location</th>
                      <th className="py-3.5 px-4 font-semibold">Specs</th>
                      <th className="py-3.5 px-4 font-semibold">Price</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedLeads.map((lead, index) => {
                      const overallIndex = (leadsPage - 1) * ITEMS_PER_PAGE + index;
                      const aptInfo = getLeadApartmentInfo(lead);
                      const leadIdStr = getLeadRowId(lead, overallIndex);
                      const isSelected = selectedRowId === leadIdStr;
                      return (
                        <tr
                          key={leadIdStr}
                          onClick={() => handleSelectRow(leadIdStr)}
                          className={`transition-all cursor-pointer ${
                            isSelected
                              ? "bg-blue-100/70 border-l-4 border-l-blue-600 shadow-sm"
                              : "hover:bg-slate-100/80"
                          }`}
                        >
                          <td className="py-3.5 px-3 text-center">
                            <span className="text-slate-600 font-semibold text-xs">
                              {lead.serialNumber || overallIndex + 1}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              onClick={() => {
                                copyToClipboard(lead.email);
                                handleSelectRow(leadIdStr);
                              }}
                              className="text-slate-700 font-medium truncate max-w-[170px] block cursor-pointer select-text"
                            >
                              {lead.email}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              onClick={() => {
                                copyToClipboard(lead.phone);
                                handleSelectRow(leadIdStr);
                              }}
                              className="text-slate-800 font-medium whitespace-nowrap cursor-pointer select-text block"
                            >
                              {lead.phone}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              onClick={() => {
                                copyToClipboard(lead.desiredLocation || "United States");
                                handleSelectRow(leadIdStr);
                              }}
                              className="font-medium text-slate-700 cursor-pointer select-text block hover:text-slate-900"
                            >
                              {lead.desiredLocation || "United States"}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div
                              onClick={() => {
                                copyToClipboard(`${lead.bedrooms}B / ${lead.bathrooms}Ba`);
                                handleSelectRow(leadIdStr);
                              }}
                              className="text-slate-800 font-medium cursor-pointer select-text"
                            >
                              {lead.bedrooms}B / {lead.bathrooms}Ba
                            </div>
                            <div
                              onClick={() => {
                                if (lead.hasPets) {
                                  copyToClipboard(`Pets: ${lead.petDetails || "Yes"}`);
                                  handleSelectRow(leadIdStr);
                                } else {
                                  copyToClipboard(`${lead.bedrooms}B / ${lead.bathrooms}Ba`);
                                  handleSelectRow(leadIdStr);
                                }
                              }}
                              className="text-[10px] text-slate-400 cursor-pointer select-text"
                            >
                              {lead.hasPets ? `🐾 Pets: ${lead.petDetails || "Yes"}` : "No pets"}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {aptInfo ? (
                              <div>
                                <span
                                  onClick={() => {
                                    copyToClipboard(`$${aptInfo.price.toLocaleString()}/mo`);
                                    handleSelectRow(leadIdStr);
                                  }}
                                  className="font-black text-emerald-600 text-sm cursor-pointer select-text inline-block"
                                >
                                  ${aptInfo.price.toLocaleString()}/mo
                                </span>
                                {aptInfo.apt?.slug || aptInfo.apt?._id || aptInfo.id ? (
                                  <a
                                    href={`/apartments/${aptInfo.apt?.slug || aptInfo.apt?._id || aptInfo.id}${lead.desiredLocation ? `?loc=${encodeURIComponent(lead.desiredLocation)}` : ""}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline font-medium truncate max-w-[130px] block"
                                    title={`Open ${aptInfo.title} in new tab`}
                                  >
                                    {aptInfo.title} ↗
                                  </a>
                                ) : (
                                  <div className="text-[10px] text-slate-500 font-medium truncate max-w-[130px]" title={aptInfo.title}>
                                    {aptInfo.title}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div>
                                <span
                                  onClick={() => {
                                    copyToClipboard(`$${lead.budgetMin} – $${lead.budgetMax}`);
                                    handleSelectRow(leadIdStr);
                                  }}
                                  className="font-bold text-slate-800 text-xs sm:text-sm cursor-pointer select-text inline-block"
                                >
                                  ${lead.budgetMin} – ${lead.budgetMax}
                                </span>
                                <div className="text-[10px] text-slate-400">Budget Range</div>
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <select
                              value={lead.status}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                handleUpdateLeadStatus(
                                  (lead._id || lead.id) as string,
                                  e.target.value as LeadStatus
                                )
                              }
                              className={`px-2.5 py-1 rounded text-xs font-bold outline-none border cursor-pointer ${
                                lead.status === "New"
                                  ? "bg-amber-50 text-amber-800 border-amber-200"
                                  : lead.status === "Contacted"
                                  ? "bg-blue-50 text-blue-800 border-blue-200"
                                  : lead.status === "Qualified"
                                  ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                                  : lead.status === "Converted"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : "bg-slate-100 text-slate-700 border-slate-200"
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Qualified">Qualified</option>
                              <option value="Matched">Matched</option>
                              <option value="Converted">Converted</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenLeadModal(lead, leadIdStr);
                              }}
                              title="View Details"
                              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white transition shadow-sm border border-blue-200 inline-flex items-center justify-center cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400">
                          No matching leads found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <TablePagination
                currentPage={leadsPage}
                totalPages={totalLeadsPages}
                totalItems={filteredLeads.length}
                itemsPerPage={ITEMS_PER_PAGE}
                itemName="leads"
                onPageChange={setLeadsPage}
              />
            </div>
          </div>
        )}

        {/* TAB 3: APARTMENTS INVENTORY */}
        {activeTab === "apartments" && (() => {
          const availableCreators = (() => {
            const map = new Map<string, string>();
            apartments.forEach((apt) => {
              const key = (apt.createdBy || "sanzid").toLowerCase();
              const name = apt.createdByName || (key === "sanzid" ? "Sanzid" : key === "sihabali" || key === "sihab" ? "Sihab Ali" : apt.createdBy || "Sanzid");
              if (!map.has(key)) map.set(key, name);
            });
            adminUsers.forEach((u) => {
              const key = u.username.toLowerCase();
              if (!map.has(key)) map.set(key, u.displayName || u.username);
            });
            return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
          })();

          const filteredApartments = apartments
            .filter((apt) => {
              if (aptCategoryFilter !== "ALL" && apt.category !== aptCategoryFilter) {
                return false;
              }
              if (aptFurnishedFilter !== "ALL" && apt.furnished !== aptFurnishedFilter) {
                return false;
              }
              if (aptStatusFilter === "published" && !apt.isActive) {
                return false;
              }
              if (aptStatusFilter === "unpublished" && apt.isActive) {
                return false;
              }
              if (aptTypeFilter === "real" && (!apt.isManual || !apt.addressTemplate)) {
                return false;
              }
              if (aptTypeFilter === "chameleon" && (apt.isManual && apt.addressTemplate)) {
                return false;
              }
              if (aptCreatorFilter !== "ALL") {
                const target = aptCreatorFilter.toLowerCase();
                const creatorUser = (apt.createdBy || "sanzid").toLowerCase();
                const creatorName = (apt.createdByName || "").toLowerCase();
                if (creatorUser !== target && creatorName !== target) {
                  return false;
                }
              }
              if (aptSearchQuery.trim()) {
                const q = aptSearchQuery.toLowerCase();
                const matchTitle = apt.title.toLowerCase().includes(q);
                const matchDesc = (apt.description || "").toLowerCase().includes(q);
                const matchCat = apt.category.toLowerCase().includes(q);
                if (!matchTitle && !matchDesc && !matchCat) return false;
              }
              return true;
            })
            .sort((a, b) => (b.serialNumber || 0) - (a.serialNumber || 0));

          const totalAptsPages = Math.ceil(filteredApartments.length / ITEMS_PER_PAGE) || 1;
          const paginatedApartments = filteredApartments.slice(
            (aptsPage - 1) * ITEMS_PER_PAGE,
            aptsPage * ITEMS_PER_PAGE
          );

          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Curated Apartment Inventory</h3>
                  <p className="text-xs text-slate-500">
                    Showing {filteredApartments.length} of {apartments.length} listings dynamically adapted into renters&apos; target locations and budgets
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/admin/apartments/new"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Apartment
                  </Link>
                </div>
              </div>

              {/* Filtering & Search Toolbar */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="flex flex-1 flex-wrap items-center gap-3 w-full">
                  {/* Live Search Input */}
                  <div className="relative flex-1 min-w-[200px] max-w-xs">
                    <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search apartment title..."
                      value={aptSearchQuery}
                      onChange={(e) => setAptSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition"
                    />
                  </div>

                  {/* Bed / Bath (Category) Dropdown Filter */}
                  <select
                    value={aptCategoryFilter}
                    onChange={(e) => setAptCategoryFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition cursor-pointer font-medium"
                  >
                    <option value="ALL">All Bed / Bath</option>
                    <option value="1B1B">1 Bed / 1 Bath (1B1B)</option>
                    <option value="2B1B">2 Bed / 1 Bath (2B1B)</option>
                    <option value="2B2B">2 Bed / 2 Bath (2B2B)</option>
                    <option value="3B1B">3 Bed / 1 Bath (3B1B)</option>
                    <option value="3B2B">3 Bed / 2 Bath (3B2B)</option>
                    <option value="3B3B">3 Bed / 3 Bath (3B3B)</option>
                  </select>

                  {/* Furnished / Unfurnished Dropdown Filter */}
                  <select
                    value={aptFurnishedFilter}
                    onChange={(e) => setAptFurnishedFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition cursor-pointer font-medium"
                  >
                    <option value="ALL">All Furnishing</option>
                    <option value="Furnished">Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Either">Either</option>
                  </select>

                  {/* Published / Unpublished Status Dropdown Filter */}
                  <select
                    value={aptStatusFilter}
                    onChange={(e) => setAptStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition cursor-pointer font-medium"
                  >
                    <option value="ALL">All Status</option>
                    <option value="published">Published</option>
                    <option value="unpublished">Unpublished</option>
                  </select>

                  {/* Listing Type Dropdown Filter (Real vs Chameleon) */}
                  <select
                    value={aptTypeFilter}
                    onChange={(e) => setAptTypeFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition cursor-pointer font-medium"
                  >
                    <option value="ALL">All Types</option>
                    <option value="real">Real Listings Only</option>
                    <option value="chameleon">Chameleon Only</option>
                  </select>

                  {/* Creator / Listed By Dropdown Filter */}
                  <select
                    value={aptCreatorFilter}
                    onChange={(e) => setAptCreatorFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition cursor-pointer font-medium"
                    title="Filter by user who listed the apartment"
                  >
                    <option value="ALL">All Creators</option>
                    {availableCreators.map((creator) => (
                      <option key={creator.id} value={creator.id}>
                        {creator.name}
                      </option>
                    ))}
                  </select>

                  {(aptCategoryFilter !== "ALL" || aptFurnishedFilter !== "ALL" || aptStatusFilter !== "ALL" || aptTypeFilter !== "ALL" || aptCreatorFilter !== "ALL" || aptSearchQuery) && (
                    <button
                      type="button"
                      onClick={() => {
                        setAptCategoryFilter("ALL");
                        setAptFurnishedFilter("ALL");
                        setAptStatusFilter("ALL");
                        setAptTypeFilter("ALL");
                        setAptCreatorFilter("ALL");
                        setAptSearchQuery("");
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer underline px-1"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Apartments Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 uppercase tracking-wider text-[10px] text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold text-center w-12">SL</th>
                        <th className="py-3.5 px-4 font-semibold">Title / Location</th>
                        <th className="py-3.5 px-4 font-semibold">Listed By</th>
                        <th className="py-3.5 px-4 font-semibold">Beds / Baths</th>
                        <th className="py-3.5 px-4 font-semibold">Base Rent</th>
                        <th className="py-3.5 px-4 font-semibold">Furnished</th>
                        <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedApartments.map((apt, index) => {
                        const overallIndex = (aptsPage - 1) * ITEMS_PER_PAGE + index;
                        return (
                        <tr key={apt._id || apt.id} className="hover:bg-slate-50/70 transition">
                          {/* Sequential SL Number (Descending) */}
                          <td className="py-3.5 px-4 text-center font-bold text-slate-900 text-sm">
                            {apt.serialNumber || filteredApartments.length - overallIndex}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden relative flex-shrink-0 border border-slate-200">
                                {apt.images?.[0] ? (
                                  <img
                                    src={apt.images[0]}
                                    alt={apt.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <ImageIcon className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 text-sm">
                                  {apt.title}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 text-[11px] flex-wrap">
                                  {apt.isManual && apt.addressTemplate ? (
                                    <span className="italic font-medium text-blue-600">
                                      Real Listing
                                    </span>
                                  ) : (
                                    <span className="italic font-medium text-purple-600">
                                      Chameleon
                                    </span>
                                  )}
                                  <span className="text-slate-300">•</span>
                                  {apt.addressTemplate ? (
                                    <span className="text-slate-500 truncate max-w-xs flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                      {apt.addressTemplate}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 italic flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                      Dynamic Location (Auto-adapts)
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Listed By Creator & Date */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {apt.createdBy === "deleted_user" || apt.createdByName === "Deleted User" ? (
                              <div className="flex flex-col leading-tight">
                                <span className="font-bold text-slate-500 text-xs italic">
                                  Deleted User
                                </span>
                                <span
                                  className="text-[10px] text-slate-400 mt-0.5"
                                  title={apt.createdAt ? new Date(apt.createdAt).toLocaleString("en-US") : undefined}
                                >
                                  {apt.createdAt
                                    ? new Date(apt.createdAt).toLocaleString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                      })
                                    : "Pre-existing"}
                                </span>
                              </div>
                            ) : (
                              <Link
                                href={`/admin/users/${(apt.createdBy || "sanzid").toLowerCase()}?from=apartments`}
                                className="flex flex-col leading-tight group/creator transition cursor-pointer"
                                title={`View listings by @${apt.createdBy || "sanzid"}`}
                              >
                                <span className="font-bold text-slate-800 group-hover/creator:text-blue-600 text-xs transition">
                                  {apt.createdByName || (apt.createdBy === "sihabali" || apt.createdBy === "sihab" ? "Sihab Ali" : apt.createdBy ? apt.createdBy.charAt(0).toUpperCase() + apt.createdBy.slice(1) : "Sanzid")}
                                </span>
                                <span
                                  className="text-[10px] text-slate-400 mt-0.5"
                                  title={apt.createdAt ? new Date(apt.createdAt).toLocaleString("en-US") : undefined}
                                >
                                  {apt.createdAt
                                    ? new Date(apt.createdAt).toLocaleString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                      })
                                    : "Pre-existing"}
                                </span>
                              </Link>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                            {apt.bedrooms} Bed / {apt.bathrooms} Bath
                          </td>

                          <td className="py-3.5 px-4 font-bold text-emerald-600">
                            ${apt.baseRent}/mo
                          </td>

                          <td className="py-3.5 px-4 text-slate-600">{apt.furnished}</td>

                          {/* Published / Unpublished One-Click Toggle */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleTogglePublish(apt)}
                              title="Click to toggle Published / Unpublished"
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer inline-flex items-center gap-1.5 ${
                                apt.isActive
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  apt.isActive ? "bg-emerald-500" : "bg-slate-400"
                                }`}
                              />
                              {apt.isActive ? "Published" : "Unpublished"}
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                setEditingApt({
                                  ...apt,
                                  propertyType: apt.propertyType || "Apartment",
                                  climate: apt.climate || (apt.cooling && apt.heating ? `${apt.cooling} & ${apt.heating}` : apt.cooling || apt.heating || "Central AC & Heating"),
                                  laundry: apt.laundry || "In-unit laundry",
                                  parking: apt.parking || "Street parking",
                                  cityState: apt.addressTemplate || apt.cityState || "",
                                  images: apt.images || [],
                                });
                                setImageInputUrl("");
                                setIsNewAptModal(false);
                              }}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition inline-block mr-2 cursor-pointer"
                              title="Edit Listing"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {currentUserRole === "admin" && (
                              <button
                                onClick={() => handleDeleteApartment(apt._id || apt.id as string)}
                                className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition inline-block cursor-pointer"
                                title="Delete Apartment"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                      {filteredApartments.length === 0 && (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-400">
                            No matching apartments found. Try adjusting your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <TablePagination
                  currentPage={aptsPage}
                  totalPages={totalAptsPages}
                  totalItems={filteredApartments.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  itemName="apartments"
                  onPageChange={setAptsPage}
                />
              </div>
            </div>
          );
        })()}

        {/* TAB 4: SITE SETTINGS, HOMEPAGE STATS & FOOTER CONTACT */}
        {activeTab === "stats" && currentUserRole === "admin" && (
          <div className="w-full space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
                <LayoutDashboard className="w-6 h-6 text-blue-600" />
                Dashboard Settings, Statistics & Footer Information
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Customize the live statistics and update the global footer contact & support channels.
              </p>
            </div>

            <form onSubmit={handleSaveStats} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                {/* SECTION 1: HOMEPAGE LIVE STATISTICS */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-5 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          Homepage Live Statistics
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Numbers on the homepage floating stats card.
                        </p>
                      </div>
                      <span className="self-start sm:self-auto text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                        Live on Homepage
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Active Apartments
                        </label>
                        <input
                          type="text"
                          value={stats.activeApartments}
                          onChange={(e) => setStats({ ...stats, activeApartments: e.target.value })}
                          placeholder="Enter active apartments count"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-500 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Active Renters
                        </label>
                        <input
                          type="text"
                          value={stats.activeRenters}
                          onChange={(e) => setStats({ ...stats, activeRenters: e.target.value })}
                          placeholder="Enter active renters count"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-500 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Properties Listed
                        </label>
                        <input
                          type="text"
                          value={stats.propertiesListed}
                          onChange={(e) => setStats({ ...stats, propertiesListed: e.target.value })}
                          placeholder="Enter properties listed count"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-500 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Customers Served
                        </label>
                        <input
                          type="text"
                          value={stats.customersServed}
                          onChange={(e) => setStats({ ...stats, customersServed: e.target.value })}
                          placeholder="Enter customers served count"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: FOOTER CONTACT & SUPPORT INFORMATION */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-5 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-emerald-600" />
                          Footer Contact & Support Information
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Support phone number and leasing email in the website footer.
                        </p>
                      </div>
                      <span className="self-start sm:self-auto text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        Live in Footer
                      </span>
                    </div>

                    <div className="space-y-4 mt-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-blue-600" />
                          Support / Leasing Email Address
                        </label>
                        <input
                          type="email"
                          value={stats.supportEmail || ""}
                          onChange={(e) => setStats({ ...stats, supportEmail: e.target.value })}
                          placeholder="Enter support email"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-semibold outline-none focus:bg-white focus:border-blue-500 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          Support / Leasing Phone Number
                        </label>
                        <input
                          type="text"
                          value={stats.supportPhone || ""}
                          onChange={(e) => setStats({ ...stats, supportPhone: e.target.value })}
                          placeholder="Enter support phone number"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-semibold outline-none focus:bg-white focus:border-blue-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SAVE BUTTON */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={savingStats}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {savingStats ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save All Settings &amp; Footer Info
                </button>
                <span className="text-xs text-slate-500">
                  Updates will instantly take effect across the entire public website.
                </span>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: ADMIN USERS & AUDIT LOGS */}
        {activeTab === "admins" && currentUserRole === "admin" && (() => {
          const filteredLogs = adminLogs.filter((log) => {
            const matchesSearch =
              !adminLogSearch ||
              log.username.toLowerCase().includes(adminLogSearch.toLowerCase()) ||
              log.ip.toLowerCase().includes(adminLogSearch.toLowerCase()) ||
              log.device.toLowerCase().includes(adminLogSearch.toLowerCase()) ||
              log.browser.toLowerCase().includes(adminLogSearch.toLowerCase());

            const matchesStatus =
              adminLogStatusFilter === "ALL" || log.status === adminLogStatusFilter;

            const matchesUser =
              adminLogUserFilter === "ALL" ||
              log.username.toLowerCase() === adminLogUserFilter.toLowerCase();

            return matchesSearch && matchesStatus && matchesUser;
          });

          const totalLogsPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE) || 1;
          const paginatedLogs = filteredLogs.slice(
            (auditLogsPage - 1) * ITEMS_PER_PAGE,
            auditLogsPage * ITEMS_PER_PAGE
          );

          return (
            <div className="space-y-8 animate-in fade-in">
              {/* Header & Overview */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                    Admin Access & Session Management
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Monitor registered administrator accounts, live active sessions, and real-time login audit trails.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Active {adminUsers.filter((u) => u.isActive).length}
                  </span>

                  <Link
                    href="/admin/users"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold border border-slate-200 shadow-xs transition cursor-pointer"
                    title="Open User Accounts Directory in a new tab"
                  >
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>Users ({adminUsers.length})</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </Link>
                </div>

              </div>

              {/* Registered Administrator Accounts Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Configured Administrator Accounts ({adminUsers.length})
                  </h3>
                  <span className="text-xs text-slate-400">Protected with HMAC-SHA256 Sessions</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adminUsers.map((user) => {
                    const isSelf = user.username.toLowerCase() === currentUser.toLowerCase();
                    return (
                      <div
                        key={user.username}
                        className={`p-6 rounded-3xl bg-white border transition shadow-sm space-y-4 ${
                          user.isActive
                            ? "border-emerald-300 ring-2 ring-emerald-500/10 shadow-emerald-500/5"
                            : "border-slate-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3.5">
                            <Link
                              href={`/admin/users/${user.username}`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black text-lg uppercase shadow-sm hover:scale-105 transition flex-shrink-0 cursor-pointer"
                              title={`Open profile for @${user.username} in a new tab`}
                            >
                              {user.username.charAt(0)}
                            </Link>
                            <div>
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/admin/users/${user.username}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-base font-black text-slate-900 hover:text-blue-600 transition flex items-center gap-1 group/link cursor-pointer"
                                  title={`Open profile for @${user.username} in a new tab`}
                                >
                                  <span>{user.displayName || user.username}</span>
                                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-600 opacity-0 group-hover/link:opacity-100 transition" />
                                </Link>
                                {isSelf && (
                                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold">
                                    You (Current)
                                  </span>
                                )}
                              </div>
                              <Link
                                href={`/admin/users/${user.username}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-slate-500 hover:text-blue-600 font-medium transition block"
                                title={`Open profile for @${user.username} in a new tab`}
                              >
                                {user.role === "editor" ? "Editor" : "System Administrator"}
                              </Link>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
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
                                    ? `Last active: ${new Date(user.lastActiveAt).toLocaleString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                      })}`
                                    : user.lastLogin
                                    ? `Last login: ${new Date(user.lastLogin).toLocaleString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                      })}`
                                    : undefined
                                }
                              >
                                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                                {user.lastActiveAt
                                  ? formatTimeAgo(new Date(user.lastActiveAt))
                                  : user.lastLogin
                                  ? formatTimeAgo(new Date(user.lastLogin))
                                  : "Offline"}
                              </span>
                            )}
                          </div>
                        </div>



                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
                          <div className="space-y-0.5">
                            <span className="text-slate-400 font-semibold text-[11px] block">Last Login</span>
                            <p className="font-bold text-slate-800">
                              {user.lastLogin
                                ? new Date(user.lastLogin).toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  })
                                : "No login recorded"}
                            </p>
                          </div>

                          <div className="space-y-0.5">
                            <span className="text-slate-400 font-semibold text-[11px] block">Session Time</span>
                            <p className="font-bold text-slate-800">
                              {user.isActive
                                ? (user.lastLogin ? `${formatDuration(Date.now() - new Date(user.lastLogin).getTime())} (Active)` : "Active Now")
                                : "No active session"}
                            </p>
                          </div>

                          <div className="space-y-0.5">
                            <span className="text-slate-400 font-semibold text-[11px] block">Total Logins</span>
                            <p className="font-bold text-slate-800">
                              {user.totalLogins} session{user.totalLogins === 1 ? "" : "s"}
                            </p>
                          </div>

                          <div className="space-y-0.5">
                            <span className="text-slate-400 font-semibold text-[11px] block">Last Known IP</span>
                            <p className="font-mono text-slate-700">
                              {user.lastIp || "—"}
                            </p>
                          </div>

                          <div className="space-y-0.5 sm:col-span-2">
                            <span className="text-slate-400 font-semibold text-[11px] block">Device / Browser</span>
                            <p className="text-slate-700 truncate" title={user.lastDevice || "—"}>
                              {user.lastDevice || "—"}
                            </p>
                          </div>
                        </div>


                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Login Audit Trail Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      Login Activity & Audit Trail
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Log of all admin authentication attempts with exact timestamp, IP address, and client platform.
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                    Showing {filteredLogs.length} of {adminLogs.length} events
                  </span>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by username, IP address, device, or browser..."
                      value={adminLogSearch}
                      onChange={(e) => setAdminLogSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-blue-600 outline-none text-slate-900 bg-slate-50 focus:bg-white transition"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                      value={adminLogUserFilter}
                      onChange={(e) => setAdminLogUserFilter(e.target.value)}
                      className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 outline-none focus:border-blue-600 cursor-pointer"
                    >
                      <option value="ALL">All Users</option>
                      {adminUsers.map((u) => (
                        <option key={u.username} value={u.username}>
                          {u.username}
                        </option>
                      ))}
                    </select>

                    <select
                      value={adminLogStatusFilter}
                      onChange={(e) => setAdminLogStatusFilter(e.target.value as any)}
                      className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 outline-none focus:border-blue-600 cursor-pointer"
                    >
                      <option value="ALL">All Status</option>
                      <option value="SUCCESS">Success</option>
                      <option value="FAILED">Failed</option>
                    </select>

                    {currentUserRole === "admin" && adminLogs.length > 0 && (
                      <button
                        onClick={handleResetAllLogs}
                        disabled={resettingLogs}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white text-xs font-bold border border-rose-200 shadow-xs transition cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
                        title="Reset and clear all login audit trail records"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {resettingLogs ? "Resetting..." : "Reset All"}
                      </button>
                    )}

                    <button
                      onClick={handleLogoutAllDevices}
                      disabled={revokingSessions}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 shadow-xs transition cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
                      title="Terminate all active admin sessions across all devices immediately"
                    >
                      <Shield className="w-3.5 h-3.5 text-slate-600" />
                      {revokingSessions ? "Revoking Sessions..." : "Log Out All Devices"}
                    </button>
                  </div>

                </div>

                {/* Audit Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px] tracking-wider">
                        <th className="py-3.5 px-4">User</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Login Time</th>
                        <th className="py-3.5 px-4">Session Time</th>
                        <th className="py-3.5 px-4">IP Address</th>
                        <th className="py-3.5 px-4">Device & Browser</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLogs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                            No login activity recorded matching your filters.
                          </td>
                        </tr>
                      ) : (
                        paginatedLogs.map((log) => {
                          const logDate = new Date(log.createdAt);
                          const isRecent = Date.now() - logDate.getTime() < 15 * 60 * 1000;
                          return (
                            <tr key={log.id} className="hover:bg-slate-50/70 transition">
                              <td className="py-3.5 px-4">
                                <Link
                                  href={`/admin/users/${log.username}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-2.5 group/audituser transition cursor-pointer"
                                  title={`Open profile for @${log.username} in a new tab`}
                                >
                                  <div className="w-7 h-7 rounded-full bg-slate-100 group-hover/audituser:bg-blue-600 group-hover/audituser:text-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 uppercase text-xs transition">
                                    {log.username.charAt(0)}
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-900 group-hover/audituser:text-blue-600 block transition">
                                      {log.username}
                                    </span>
                                    {log.username.toLowerCase() === currentUser.toLowerCase() && (
                                      <span className="text-[10px] text-blue-600 font-semibold">You</span>
                                    )}
                                  </div>
                                </Link>
                              </td>

                              <td className="py-3.5 px-4">
                                {log.status === "SUCCESS" ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    Success
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold text-[11px] border border-rose-200">
                                    <X className="w-3.5 h-3.5 text-rose-600" />
                                    Failed
                                  </span>
                                )}
                              </td>

                              <td className="py-3.5 px-4">
                                <div>
                                  <span className="font-semibold text-slate-800 block">
                                    {logDate.toLocaleString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                      hour: "numeric",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {formatTimeAgo(logDate)}
                                  </span>
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                {log.status === "SUCCESS" ? (
                                  isRecent ? (
                                    <div className="space-y-0.5">
                                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                                        <span className="relative flex h-1.5 w-1.5">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                        </span>
                                        Active Now
                                      </span>
                                      <span className="text-[10px] text-slate-500 block font-medium">
                                        {formatDuration(Date.now() - logDate.getTime())} elapsed
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="space-y-0.5">
                                      <span className="text-slate-700 font-medium text-[11px] flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        {formatDuration(Math.min(Date.now() - logDate.getTime(), 7 * 24 * 3600 * 1000))}
                                      </span>
                                      <span className="text-[10px] text-slate-400 block">
                                        Completed session
                                      </span>
                                    </div>
                                  )
                                ) : (
                                  <span className="text-slate-400 font-mono text-[11px]">—</span>
                                )}
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-1.5 text-slate-700 font-mono">
                                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>{log.ip}</span>
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-1.5 text-slate-700">
                                  <Laptop className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span className="font-medium">
                                    {log.device} • {log.browser}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <TablePagination
                  currentPage={auditLogsPage}
                  totalPages={totalLogsPages}
                  totalItems={filteredLogs.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  itemName="events"
                  onPageChange={setAuditLogsPage}
                />
              </div>
            </div>
          );
        })()}
          </>
        )}
      </div>

      {/* LEAD DETAIL DRAWER / MODAL */}
      {selectedLead && (() => {
        const selectedApt = apartments.find(
          (a) => a._id === selectedLead.selectedApartmentId || a.id === selectedLead.selectedApartmentId
        );
        const aptPrice = selectedApt?.baseRent || selectedLead.selectedApartmentPrice;
        const aptTitle = selectedApt?.title || selectedLead.selectedApartmentTitle;
        const aptTargetId =
          selectedApt?.slug ||
          selectedApt?._id ||
          selectedApt?.id ||
          selectedLead.selectedApartmentId;
        const aptUrl = aptTargetId
          ? `/apartments/${aptTargetId}${
              selectedLead.desiredLocation
                ? `?loc=${encodeURIComponent(selectedLead.desiredLocation)}`
                : ""
            }`
          : null;

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in"
            onClick={handleCloseLeadModal}
          >
            <div
              className="bg-white border border-slate-200 text-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 relative max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseLeadModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header with Serial and Submission Date & Time */}
              <div className="border-b border-slate-100 pb-4 pr-10">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 text-xs font-black">
                    Lead {selectedLead.serialNumber || 1}
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>
                      Submitted:{" "}
                      <strong className="text-slate-900">
                        {new Date(selectedLead.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        at{" "}
                        {new Date(selectedLead.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </strong>
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900">{selectedLead.fullName}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs">
                  <span
                    onClick={() => copyToClipboard(selectedLead.email)}
                    className="text-slate-700 flex items-center gap-1.5 font-medium select-all cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    {selectedLead.email}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span
                    onClick={() => copyToClipboard(selectedLead.phone)}
                    className="text-slate-700 font-semibold flex items-center gap-1.5 select-all cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    {selectedLead.phone}
                  </span>
                </div>
              </div>

              {/* Selected Apartment Section */}
              {aptTitle || aptPrice ? (
                aptUrl ? (
                  <a
                    href={aptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block bg-gradient-to-br from-blue-50/80 to-indigo-50/40 hover:from-blue-100/90 hover:to-indigo-100/60 border border-blue-200/90 hover:border-blue-400 rounded-2xl p-4 space-y-3 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer group select-none"
                    title="Click anywhere to open apartment details in a new tab"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold text-blue-800 group-hover:text-blue-950 tracking-wider flex items-center gap-1.5 transition">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span>Client Selected Apartment</span>
                        <ExternalLink className="w-3.5 h-3.5 text-blue-500 opacity-70 group-hover:opacity-100 transition" />
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-600 group-hover:bg-emerald-700 text-white text-xs font-black shadow-sm transition">
                        ${aptPrice?.toLocaleString()} / month
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      {selectedApt?.images?.[0] && (
                        <div className="relative w-full sm:w-28 h-24 rounded-xl overflow-hidden shrink-0 border border-blue-200/70 shadow-sm bg-slate-100">
                          <Image
                            src={selectedApt.images[0]}
                            alt={aptTitle || "Apartment"}
                            fill
                            className="object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                      )}
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="font-bold text-base text-slate-900 group-hover:text-blue-700 leading-snug transition flex items-center gap-1.5">
                          <span>{aptTitle}</span>
                        </h4>
                        <p className="text-xs text-slate-600 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">
                            {selectedApt?.addressTemplate || selectedLead.desiredLocation}
                          </span>
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-600 pt-1">
                          <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold shadow-2xs">
                            🛏️ {selectedApt?.bedrooms || selectedLead.bedrooms} Bed
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold shadow-2xs">
                            🚿 {selectedApt?.bathrooms || selectedLead.bathrooms} Bath
                          </span>
                          {selectedApt?.squareFeet && (
                            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold shadow-2xs">
                              📐 {selectedApt.squareFeet} sqft
                            </span>
                          )}
                          {selectedApt?.category && (
                            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-bold">
                              {selectedApt.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/40 border border-blue-200/90 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold text-blue-800 tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        Client Selected Apartment
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow-sm">
                        ${aptPrice?.toLocaleString()} / month
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      {selectedApt?.images?.[0] && (
                        <div className="relative w-full sm:w-28 h-24 rounded-xl overflow-hidden shrink-0 border border-blue-200/70 shadow-sm bg-slate-100">
                          <Image
                            src={selectedApt.images[0]}
                            alt={aptTitle || "Apartment"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="font-bold text-base text-slate-900 leading-snug">
                          {aptTitle}
                        </h4>
                        <p className="text-xs text-slate-600 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">
                            {selectedApt?.addressTemplate || selectedLead.desiredLocation}
                          </span>
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-600 pt-1">
                          <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold">
                            🛏️ {selectedApt?.bedrooms || selectedLead.bedrooms} Bed
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold">
                            🚿 {selectedApt?.bathrooms || selectedLead.bathrooms} Bath
                          </span>
                          {selectedApt?.squareFeet && (
                            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold">
                              📐 {selectedApt.squareFeet} sqft
                            </span>
                          )}
                          {selectedApt?.category && (
                            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-bold">
                              {selectedApt.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-slate-500" />
                      No Specific Apartment Selected Yet
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Matched with {selectedLead.matchedApartments?.length || 0} inventory units in {selectedLead.desiredLocation}
                    </span>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-emerald-600">
                    Budget: ${selectedLead.budgetMin} – ${selectedLead.budgetMax}/mo
                  </div>
                </div>
              )}

              {/* Tour Booking Highlight Banner */}
              {(selectedLead.selectedApartmentId || selectedLead.notes?.toLowerCase().includes("tour")) && (
                <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
                  <Calendar className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold block text-amber-900">Tour Booking Request</span>
                    <p className="text-amber-800 leading-relaxed font-medium">
                      {selectedLead.notes || "Requested official walkthrough tour."}
                    </p>
                  </div>
                </div>
              )}

              {/* Specs & Lifestyle Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div
                  onClick={() => copyToClipboard(selectedLead.desiredLocation || "United States")}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100/70 transition"
                  title="Click to copy location"
                >
                  <span className="text-slate-500 block font-medium">Location:</span>
                  <span className="font-semibold text-slate-800 select-text">{selectedLead.desiredLocation || "United States"}</span>
                </div>
                <div
                  onClick={() => copyToClipboard(`$${selectedLead.budgetMin} – $${selectedLead.budgetMax}/mo`)}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100/70 transition"
                  title="Click to copy budget"
                >
                  <span className="text-slate-500 block font-medium">Budget Range:</span>
                  <span className="font-semibold text-emerald-600 select-text">${selectedLead.budgetMin} – ${selectedLead.budgetMax}/mo</span>
                </div>
                <div
                  onClick={() => copyToClipboard(`${selectedLead.bedrooms} Bed, ${selectedLead.bathrooms} Bath`)}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100/70 transition"
                  title="Click to copy layout"
                >
                  <span className="text-slate-500 block font-medium">Layout Required:</span>
                  <span className="font-semibold text-slate-800 select-text">{selectedLead.bedrooms} Bed, {selectedLead.bathrooms} Bath</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-slate-500 block font-medium">Furnishing & Kitchen:</span>
                  <span className="font-semibold text-slate-800">{selectedLead.furnished} • {selectedLead.kitchenRequired ? "Kitchen req." : "No kitchen req."}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-slate-500 block font-medium">Residency & Age:</span>
                  <span className="font-semibold text-slate-800">{selectedLead.isUsResident ? "US Resident" : "Relocating"} (Age: {selectedLead.age})</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-slate-500 block font-medium">Credit Score Status:</span>
                  <span className="font-semibold text-blue-600">{selectedLead.creditScore || "Good (660 - 719)"}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-slate-500 block font-medium">Pets & Occupants:</span>
                  <span className="font-semibold text-slate-800">{selectedLead.hasPets ? `Pets: ${selectedLead.petDetails || "Yes"}` : "No pets"} ({selectedLead.familyMembers} occupants)</span>
                </div>
              </div>

              {/* Amenities Tags */}
              {selectedLead.amenities && selectedLead.amenities.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-slate-600 mb-1.5 block">Requested Amenities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLead.amenities.map((amenity, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                        ✓ {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Section */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Internal Agent Notes:
                </label>
                <textarea
                  rows={3}
                  defaultValue={selectedLead.notes || ""}
                  onBlur={(e) => handleUpdateLeadNotes((selectedLead._id || selectedLead.id) as string, e.target.value)}
                  placeholder="Add notes about tour schedule, phone conversation, or rental approval..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Notes save automatically when you click outside.</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-medium">Current Status:</span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) =>
                      handleUpdateLeadStatus(
                        (selectedLead._id || selectedLead.id) as string,
                        e.target.value as LeadStatus
                      )
                    }
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 transition cursor-pointer"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Matched">Matched</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {currentUserRole === "admin" && (
                  <button
                    type="button"
                    onClick={() => handleDeleteLead((selectedLead._id || selectedLead.id) as string)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-bold text-xs border border-rose-200 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Lead</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* APARTMENT EDIT / CREATE MODAL */}
      {editingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl p-5 sm:p-7 space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {isNewAptModal ? "Add New Apartment" : "Edit Apartment"}
              </h3>
              <button
                onClick={() => {
                  setEditingApt(null);
                  setImageInputUrl("");
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveApartment} onPaste={handlePasteImage} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT: FORM INPUTS (7 cols) */}
                <div className="lg:col-span-7 space-y-3.5">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Apartment Title</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter apartment title"
                      value={editingApt.title}
                      onChange={(e) => setEditingApt({ ...editingApt, title: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium outline-none focus:bg-white focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1 flex items-center justify-between">
                      <span>Property Address (Optional)</span>
                      <span className="text-[11px] text-slate-400 font-normal">Leave blank for Chameleon dynamic search</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Enter property address or leave blank"
                        value={editingApt.addressTemplate || ""}
                        onChange={(e) => setEditingApt({ ...editingApt, addressTemplate: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition font-medium"
                      />
                    </div>
                  </div>

                  {/* Specs 4-Column Grid: Category, Furnished, Monthly Rent, Square Feet */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Category</label>
                      <select
                        value={editingApt.category}
                        onChange={(e) => {
                          const cat = e.target.value as any;
                          let beds = 1;
                          let baths = 1;
                          if (cat === "1B1B") { beds = 1; baths = 1; }
                          else if (cat === "2B1B") { beds = 2; baths = 1; }
                          else if (cat === "2B2B") { beds = 2; baths = 2; }
                          else if (cat === "3B1B") { beds = 3; baths = 1; }
                          else if (cat === "3B2B") { beds = 3; baths = 2; }
                          else if (cat === "3B3B") { beds = 3; baths = 3; }
                          setEditingApt({
                            ...editingApt,
                            category: cat,
                            bedrooms: beds,
                            bathrooms: baths,
                          });
                        }}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition cursor-pointer font-medium"
                      >
                        <option value="1B1B">1 Bed / 1 Bath</option>
                        <option value="2B1B">2 Bed / 1 Bath</option>
                        <option value="2B2B">2 Bed / 2 Bath</option>
                        <option value="3B1B">3 Bed / 1 Bath</option>
                        <option value="3B2B">3 Bed / 2 Bath</option>
                        <option value="3B3B">3 Bed / 3 Bath</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Furnished</label>
                      <select
                        value={editingApt.furnished || "Unfurnished"}
                        onChange={(e) =>
                          setEditingApt({
                            ...editingApt,
                            furnished: e.target.value as any,
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition cursor-pointer font-medium"
                      >
                        <option value="Furnished">Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                        <option value="Either">Either (Flexible)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Monthly Rent ($)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">$</span>
                        <input
                          type="number"
                          placeholder="Enter monthly rent"
                          value={editingApt.baseRent ? editingApt.baseRent : ""}
                          onChange={(e) =>
                            setEditingApt({
                              ...editingApt,
                              baseRent: e.target.value === "" ? 0 : Number(e.target.value),
                            })
                          }
                          className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Square Feet</label>
                      <input
                        type="number"
                        placeholder="Enter square feet"
                        value={editingApt.squareFeet ? editingApt.squareFeet : ""}
                        onChange={(e) =>
                          setEditingApt({
                            ...editingApt,
                            squareFeet: e.target.value === "" ? 0 : Number(e.target.value),
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={editingApt.description}
                      onChange={(e) => setEditingApt({ ...editingApt, description: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition"
                    />
                  </div>

                  {/* FACEBOOK MARKETPLACE UNIT DETAILS & RENTAL LOCATION */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-slate-800 font-bold text-xs flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-blue-600" />
                        Unit Details & Rental Location (Marketplace Style)
                      </label>
                      <span className="text-[11px] text-slate-400">Unit specs & Google Map approximate location</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 text-xs font-semibold mb-1">Property Type</label>
                        <select
                          value={editingApt.propertyType || "Apartment"}
                          onChange={(e) => setEditingApt({ ...editingApt, propertyType: e.target.value })}
                          className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition font-medium cursor-pointer"
                        >
                          <option value="Apartment">Apartment</option>
                          <option value="Condo">Condo</option>
                          <option value="Townhouse">Townhouse</option>
                          <option value="Single Family House">Single Family House</option>
                          <option value="Studio">Studio</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-600 text-xs font-semibold mb-1">Climate Control (HVAC)</label>
                        <select
                          value={editingApt.climate || "Central AC & Heating"}
                          onChange={(e) => setEditingApt({ ...editingApt, climate: e.target.value })}
                          className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition font-medium cursor-pointer"
                        >
                          <option value="Central AC & Heating">Central AC & Heating</option>
                          <option value="Window AC & Central Heating">Window AC & Central Heating</option>
                          <option value="Split AC & Heating">Split AC & Heating</option>
                          <option value="Heating Only (No AC)">Heating Only (No AC)</option>
                          <option value="None">None</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-600 text-xs font-semibold mb-1">Laundry</label>
                        <select
                          value={editingApt.laundry || "In-unit laundry"}
                          onChange={(e) => setEditingApt({ ...editingApt, laundry: e.target.value })}
                          className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition font-medium cursor-pointer"
                        >
                          <option value="In-unit laundry">In-unit laundry</option>
                          <option value="Laundry in building">Laundry in building</option>
                          <option value="Laundry on site">Laundry on site</option>
                          <option value="Washer & dryer hookups">Washer & dryer hookups</option>
                          <option value="None">None</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-600 text-xs font-semibold mb-1">Parking</label>
                        <select
                          value={editingApt.parking || "Street parking"}
                          onChange={(e) => setEditingApt({ ...editingApt, parking: e.target.value })}
                          className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition font-medium cursor-pointer"
                        >
                          <option value="Street parking">Street parking</option>
                          <option value="Garage parking">Garage parking</option>
                          <option value="Dedicated parking spot">Dedicated parking spot</option>
                          <option value="Off-street parking">Off-street parking</option>
                          <option value="Valet parking">Valet parking</option>
                          <option value="No parking">No parking</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* APARTMENT PHOTOS & GALLERY */}
                  <div className="pt-2 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-slate-700 font-bold text-xs">
                        Apartment Photos ({(editingApt.images || []).length})
                      </label>
                      <span className="text-[11px] text-slate-400">Drag & drop files or press Ctrl+V to paste</span>
                    </div>

                    {/* Drag & Drop Multi-file Upload Box */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 ${
                        isDragging
                          ? "border-blue-500 bg-blue-50/70 scale-[1.01]"
                          : "border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/30"
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => e.target.files && uploadFiles(e.target.files)}
                        multiple
                        accept="image/*"
                        className="hidden"
                      />
                      {isUploadingImage ? (
                        <div className="flex flex-col items-center justify-center py-2 text-blue-600">
                          <Loader2 className="w-6 h-6 animate-spin mb-1" />
                          <span className="text-xs font-bold">Uploading photos...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-0.5">
                            <Upload className="w-4 h-4" />
                          </div>
                          <div className="text-xs font-semibold text-slate-700">
                            <span className="text-blue-600 font-bold">Click to browse</span> or drag & drop 4–5 photos here
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 justify-center">
                            <span>Select multiple photos from folder</span>
                            <span>•</span>
                            <span className="bg-slate-200/80 px-1.5 py-0.5 rounded text-[10px] text-slate-600 font-mono">
                              Ctrl+V / Cmd+V to paste
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Paste Image URL / Clipboard Bar */}
                    <div className="flex gap-2">
                      <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:bg-white focus-within:border-blue-500 transition">
                        <Link2 className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                        <input
                          type="url"
                          placeholder="Paste image link (https://...) or press Ctrl+V"
                          value={imageInputUrl}
                          onChange={(e) => setImageInputUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddImageUrl();
                            }
                          }}
                          className="w-full bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        disabled={!imageInputUrl.trim()}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs disabled:opacity-40 transition cursor-pointer shrink-0"
                      >
                        Add Link
                      </button>
                      <button
                        type="button"
                        onClick={handlePasteFromClipboardBtn}
                        title="Paste copied image or URL from clipboard"
                        className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs transition cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        <Clipboard className="w-3.5 h-3.5" />
                        <span>Paste</span>
                      </button>
                    </div>

                    {/* Photo Previews Gallery Grid */}
                    {(editingApt.images || []).length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                          <span>Photo Previews ({editingApt.images.length})</span>
                          <span className="text-[10px] text-slate-400">Hover photo to set cover or delete</span>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-40 overflow-y-auto p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                          {editingApt.images.map((imgUrl, idx) => (
                            <div
                              key={idx}
                              className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100 shadow-sm"
                            >
                              <img
                                src={imgUrl}
                                alt={`Apartment photo ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {idx === 0 && (
                                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-blue-600/95 text-white text-[8px] font-bold uppercase tracking-wider shadow flex items-center gap-0.5">
                                  <Star className="w-2 h-2 fill-white" /> Cover
                                </div>
                              )}
                              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                {idx !== 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetPrimaryImage(idx)}
                                    className="p-1 rounded bg-white text-slate-800 text-[9px] font-bold hover:bg-slate-100 transition cursor-pointer shadow"
                                    title="Set as Main Cover Photo"
                                  >
                                    <Star className="w-3 h-3 text-amber-500" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="p-1 rounded bg-red-600 text-white text-[9px] font-bold hover:bg-red-700 transition cursor-pointer shadow"
                                  title="Remove Photo"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                      <input
                        type="checkbox"
                        checked={editingApt.isActive}
                        onChange={(e) => setEditingApt({ ...editingApt, isActive: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                      />
                      <span>Published (Visible on Website)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                      <input
                        type="checkbox"
                        checked={editingApt.featured}
                        onChange={(e) => setEditingApt({ ...editingApt, featured: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                      />
                      <span>Featured on Homepage</span>
                    </label>
                  </div>
                </div>

                {/* RIGHT: LIVE LISTING PREVIEW (5 cols) */}
                <div className="lg:col-span-5 lg:sticky lg:top-0 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Live Listing Preview
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-md">
                      Live Card
                    </span>
                  </div>

                  {/* Card Preview Container */}
                  <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group [transform:translateZ(0)]">
                    {/* Image Preview */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      {editingApt.images && editingApt.images.length > 0 ? (
                        <img
                          src={editingApt.images[0]}
                          alt={editingApt.title || "Apartment cover"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 gap-2 p-4 text-center">
                          <ImageIcon className="w-8 h-8 text-slate-300" />
                          <span className="text-xs font-semibold text-slate-400">
                            Upload photos to preview cover image
                          </span>
                        </div>
                      )}

                      {/* Photo Count Tag */}
                      {editingApt.images && editingApt.images.length > 0 && (
                        <div className="absolute top-3 left-3 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                          <Camera className="w-3 h-3" />
                          <span>
                            {editingApt.images.length} {editingApt.images.length === 1 ? "Photo" : "Photos"}
                          </span>
                        </div>
                      )}

                      {/* Furnished Status Tag */}
                      <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <span>🛋️ {editingApt.furnished || "Unfurnished"}</span>
                      </div>

                      {/* Rent Badge */}
                      <div className="absolute bottom-3 right-3 bg-blue-600 text-white px-3 py-1.5 rounded-xl font-black text-sm shadow-lg">
                        ${editingApt.baseRent || 0}
                        <span className="text-[10px] font-normal text-blue-100"> / mo</span>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">
                            {editingApt.addressTemplate?.trim()
                              ? editingApt.addressTemplate
                              : "Dynamic Chameleon Location (Auto-adapts to search)"}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 line-clamp-1">
                          {editingApt.title || "Apartment Title Preview"}
                        </h4>

                        <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                          {editingApt.description || "Enter a description on the left to preview it here."}
                        </p>

                        {/* Specs row */}
                        <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-100 mt-2.5 text-xs text-slate-600 text-center font-medium">
                          <div className="flex items-center justify-center gap-1">
                            <BedDouble className="w-3.5 h-3.5 text-blue-600" />
                            <span>{editingApt.bedrooms || 1} Bed</span>
                          </div>
                          <div className="flex items-center justify-center gap-1">
                            <Bath className="w-3.5 h-3.5 text-blue-600" />
                            <span>{editingApt.bathrooms || 1} Bath</span>
                          </div>
                          <div className="flex items-center justify-center gap-1">
                            <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                            <span>{editingApt.squareFeet || 0} sq ft</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons Preview */}
                      <div className="pt-1 flex items-center gap-2">
                        <div className="flex-1 py-2 px-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 opacity-90 cursor-default">
                          <Calendar className="w-3.5 h-3.5 text-blue-200" />
                          Schedule Tour / Inquire
                        </div>
                        <div className="py-2 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold cursor-default">
                          Details
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Meta Info Box */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Furnished Status:</span>
                      <span className="font-bold text-slate-800">{editingApt.furnished || "Unfurnished"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Category Layout:</span>
                      <span className="font-bold text-slate-800">
                        {editingApt.category?.replace(/(\d+B)(\d+B)/i, "$1/$2") || editingApt.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Visibility:</span>
                      <span className={`font-bold ${editingApt.isActive ? "text-emerald-600" : "text-amber-600"}`}>
                        {editingApt.isActive ? "Published" : "Draft / Unpublished"}
                      </span>
                    </div>
                    {/* Unit Details & Map specs preview */}
                    <div className="pt-1.5 border-t border-slate-200/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Unit Type:</span>
                        <span className="font-semibold text-slate-800">{editingApt.propertyType || "Apartment"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Climate Control:</span>
                        <span className="font-semibold text-slate-800">
                          {editingApt.climate || "Central AC & Heating"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Laundry & Parking:</span>
                        <span className="font-semibold text-slate-800">
                          {editingApt.laundry || "In-unit laundry"} · {editingApt.parking || "Street parking"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-blue-600 font-semibold">
                        <span className="text-slate-400">Google Map Area:</span>
                        <span>{editingApt.addressTemplate?.trim() || "Auto-detected on search"}</span>
                      </div>
                    </div>
                    {editingApt.slug && !isNewAptModal && (
                      <div className="pt-1.5 border-t border-slate-200/60 flex justify-end">
                        <a
                          href={`/apartments/${editingApt.slug || editingApt._id || editingApt.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 hover:underline"
                        >
                          Open Live Listing Page <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="text-[11px] text-slate-400">
                  {editingApt.addressTemplate?.trim()
                    ? "📍 Real geographic listing with target address"
                    : "🌪️ Chameleon listing (auto-adapts to search query)"}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingApt(null);
                      setImageInputUrl("");
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer shadow-sm"
                  >
                    Save Apartment
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REGISTER NEW USER MODAL (Admin Only) */}
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
                  <p className="text-xs text-slate-500">Create an authorized account with role-based limitations</p>
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
                    onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "") })}
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
                  {/* Editor Option */}
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
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                          Restricted
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Can only access <strong>Overview</strong>, <strong>Leads CRM</strong>, and <strong>Apartment Inventory</strong>. Can list new apartments and view leads. <strong>Cannot delete anything</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Admin Option */}
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
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                          Full Access
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Full access across all 5 tabs. Can register new users, delete leads, delete apartments, and modify homepage statistics.
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

      {/* DELETE USER CONFIRMATION MODAL (Admin Only) */}
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
                This user will permanently lose all access to the admin panel. This action cannot be undone.
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

