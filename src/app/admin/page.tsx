"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Users,
  Building2,
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
  Database,
  Sliders,
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
} from "lucide-react";
import { IApartment, ILead, ISiteStat, LeadStatus } from "@/types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "apartments" | "stats">("overview");

  // State
  const [leads, setLeads] = useState<ILead[]>([]);
  const [apartments, setApartments] = useState<IApartment[]>([]);
  const [stats, setStats] = useState<ISiteStat>({
    activeApartments: "3,250+",
    activeRenters: "12,500+",
    propertiesListed: "4,200+",
    customersServed: "9,800+",
    satisfactionRate: "99.4%",
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [savingStats, setSavingStats] = useState(false);
  const [notification, setNotification] = useState("");

  // Filters & Search
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>("ALL");
  const [leadSearchQuery, setLeadSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<ILead | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  // Apartment Editing
  const [editingApt, setEditingApt] = useState<IApartment | null>(null);
  const [isNewAptModal, setIsNewAptModal] = useState(false);
  const [imageInputUrl, setImageInputUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apartment Filters & Search
  const [aptCategoryFilter, setAptCategoryFilter] = useState<string>("ALL");
  const [aptFurnishedFilter, setAptFurnishedFilter] = useState<string>("ALL");
  const [aptStatusFilter, setAptStatusFilter] = useState<string>("ALL");
  const [aptSearchQuery, setAptSearchQuery] = useState("");

  useEffect(() => {
    // Instant display from session cache if available
    try {
      const cached = sessionStorage.getItem("apartmento_admin_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.leads) setLeads(parsed.leads);
        if (parsed.apartments) setApartments(parsed.apartments);
        if (parsed.stats) setStats(parsed.stats);
        setLoading(false);
      }
    } catch (_) {}

    fetchDashboardData();

    // Auto-refresh every 12 seconds so newly booked apartments appear automatically!
    const timer = setInterval(() => {
      fetchDashboardData(true);
    }, 12000);

    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async (isBackground = false) => {
    if (!isBackground) setRefreshing(true);
    try {
      // Single unified call to fetch leads, apartments, and stats concurrently
      const res = await fetch("/api/admin/dashboard");
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }

      const data = await res.json();
      if (data.success) {
        if (data.leads) setLeads(data.leads);
        if (data.apartments) setApartments(data.apartments);
        if (data.stats) setStats(data.stats);

        try {
          sessionStorage.setItem(
            "apartmento_admin_cache",
            JSON.stringify({
              leads: data.leads,
              apartments: data.apartments,
              stats: data.stats,
            })
          );
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

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("apartmento_admin_cache");
    } catch (_) {}
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const handleSeedDatabase = async () => {
    if (!confirm("Seed/Verify the database with 35 curated USA apartments?")) return;
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
      showToast("Error seeding database.");
    } finally {
      setSeeding(false);
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
        showToast("Homepage statistics updated live!");
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to update stats.");
    } finally {
      setSavingStats(false);
    }
  };

  const handleSaveApartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApt) return;

    try {
      if (isNewAptModal) {
        const res = await fetch("/api/apartments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingApt),
        });
        const data = await res.json();
        if (data.success) {
          showToast("New apartment created!");
          setIsNewAptModal(false);
          setEditingApt(null);
          fetchDashboardData();
        }
      } else {
        const aptId = editingApt._id || editingApt.id;
        const res = await fetch(`/api/apartments/${aptId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingApt),
        });
        if (res.ok) {
          showToast("Apartment updated!");
          setEditingApt(null);
          fetchDashboardData();
        }
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to save apartment.");
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingApt) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.url) {
        const currentImages = editingApt.images || [];
        setEditingApt({
          ...editingApt,
          images: [...currentImages, data.url],
        });
        showToast(
          data.provider === "cloudinary"
            ? "Photo uploaded to Cloudinary CDN!"
            : "Photo uploaded successfully!"
        );
      } else {
        showToast(data.error || "Failed to upload photo.");
      }
    } catch (err) {
      console.error(err);
      showToast("Error uploading photo.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
    if (!window.confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => (l._id || l.id) !== leadId));
        if (selectedLead && (selectedLead._id === leadId || selectedLead.id === leadId)) {
          setSelectedLead(null);
        }
        showToast("Lead deleted successfully!");
      } else {
        showToast("Failed to delete lead.");
      }
    } catch (err) {
      console.error(err);
      showToast("Error deleting lead.");
    }
  };

  const handleClearAllLeads = async () => {
    if (!window.confirm("WARNING: Are you sure you want to delete ALL captured leads? This cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch("/api/leads", {
        method: "DELETE",
      });
      if (res.ok) {
        setLeads([]);
        setSelectedLead(null);
        showToast("All leads cleared successfully!");
      } else {
        showToast("Failed to clear leads.");
      }
    } catch (err) {
      console.error(err);
      showToast("Error clearing leads.");
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
                src="/apartmento-full-logo.png"
                alt="Apartmento Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-slate-900">
                  Apartment<span className="text-blue-600">o</span>
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
            <button
              onClick={handleSeedDatabase}
              disabled={seeding}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 transition cursor-pointer disabled:cursor-not-allowed"
              title="Populate 35 realistic USA base apartments"
            >
              <Database className="w-3.5 h-3.5 text-blue-600" />
              {seeding ? "Seeding..." : "Seed 35 Apartments"}
            </button>

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
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "leads", label: loading ? "Leads CRM" : `Leads CRM (${leads.length})`, icon: Users },
            { id: "apartments", label: loading ? "Apartment Inventory" : `Apartment Inventory (${apartments.length})`, icon: Building2 },
            { id: "stats", label: "Homepage Statistics", icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3 text-slate-900">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm font-medium text-slate-500">Loading Apartmento Admin Portal...</p>
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
                  onClick={() => setActiveTab("leads")}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
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
                      const leadIdStr = String(lead._id || lead.id || `lead_ov_${idx}`);
                      const isSelected = selectedRowId === leadIdStr;
                      return (
                        <tr
                          key={leadIdStr}
                          onClick={() => setSelectedRowId(isSelected ? null : leadIdStr)}
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
                            <span className="text-slate-700 font-medium truncate max-w-[160px] block select-text">
                              {lead.email}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-slate-700 font-medium whitespace-nowrap select-text">
                              {lead.phone}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-700">
                            {lead.desiredLocation || "United States"}
                          </td>
                          <td className="py-3.5 px-4">{lead.bedrooms}B / {lead.bathrooms}Ba</td>
                          <td className="py-3.5 px-4">
                            {aptInfo ? (
                              <div>
                                <span className="font-black text-emerald-600 text-xs">
                                  ${aptInfo.price.toLocaleString()}/mo
                                </span>
                                <div className="text-[10px] text-slate-500 truncate max-w-[120px]" title={aptInfo.title}>
                                  {aptInfo.title}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <span className="font-bold text-slate-800 text-xs">
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
                                setSelectedLead(lead);
                                setSelectedRowId(leadIdStr);
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
            {/* Filter and Export Bar */}
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
                {leads.length > 0 && (
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
                    {filteredLeads.map((lead, index) => {
                      const aptInfo = getLeadApartmentInfo(lead);
                      const leadIdStr = String(lead._id || lead.id || `lead_crm_${index}`);
                      const isSelected = selectedRowId === leadIdStr;
                      return (
                        <tr
                          key={leadIdStr}
                          onClick={() => setSelectedRowId(isSelected ? null : leadIdStr)}
                          className={`transition-all cursor-pointer ${
                            isSelected
                              ? "bg-blue-100/70 border-l-4 border-l-blue-600 shadow-sm"
                              : "hover:bg-slate-100/80"
                          }`}
                        >
                          <td className="py-3.5 px-3 text-center">
                            <span className="text-slate-600 font-semibold text-xs">
                              {lead.serialNumber || index + 1}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="text-slate-700 font-medium truncate max-w-[170px] block select-text">
                              {lead.email}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="text-slate-800 font-medium whitespace-nowrap select-text">
                              {lead.phone}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-medium text-slate-700">{lead.desiredLocation || "United States"}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="text-slate-800 font-medium">{lead.bedrooms}B / {lead.bathrooms}Ba</div>
                            <div className="text-[10px] text-slate-400">
                              {lead.hasPets ? `🐾 Pets: ${lead.petDetails || "Yes"}` : "No pets"}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {aptInfo ? (
                              <div>
                                <span className="font-black text-emerald-600 text-sm">
                                  ${aptInfo.price.toLocaleString()}/mo
                                </span>
                                <div className="text-[10px] text-slate-500 font-medium truncate max-w-[130px]" title={aptInfo.title}>
                                  {aptInfo.title}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <span className="font-bold text-slate-800 text-xs sm:text-sm">
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
                                setSelectedLead(lead);
                                setSelectedRowId(leadIdStr);
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
            </div>
          </div>
        )}

        {/* TAB 3: APARTMENTS INVENTORY */}
        {activeTab === "apartments" && (() => {
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
                  <button
                    onClick={() => {
                      setEditingApt({
                        title: "",
                        slug: `apt-${Date.now()}`,
                        addressTemplate: "",
                        description: "",
                        category: "1B1B",
                        bedrooms: 1,
                        bathrooms: 1,
                        baseRent: 0,
                        squareFeet: 0,
                        furnished: "Either",
                        hasKitchen: true,
                        petPolicy: "Dogs & Cats Allowed",
                        amenities: ["Air Conditioning", "Wi-Fi", "Dishwasher"],
                        images: [],
                        featured: false,
                        isActive: true,
                        deposit: 0,
                        availableDate: "Immediate",
                        rating: 4.8,
                        reviewsCount: 15,
                      });
                      setImageInputUrl("");
                      setIsNewAptModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Apartment
                  </button>
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
                    <option value="2B2B">2 Bed / 2 Bath (2B2B)</option>
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

                  {(aptCategoryFilter !== "ALL" || aptFurnishedFilter !== "ALL" || aptStatusFilter !== "ALL" || aptSearchQuery) && (
                    <button
                      type="button"
                      onClick={() => {
                        setAptCategoryFilter("ALL");
                        setAptFurnishedFilter("ALL");
                        setAptStatusFilter("ALL");
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
                        <th className="py-3.5 px-4 font-semibold">Title / Category</th>
                        <th className="py-3.5 px-4 font-semibold">Beds / Baths</th>
                        <th className="py-3.5 px-4 font-semibold">Base Rent</th>
                        <th className="py-3.5 px-4 font-semibold">Furnished</th>
                        <th className="py-3.5 px-4 font-semibold">Pet Policy</th>
                        <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                        <th className="py-3.5 px-4 font-semibold text-center">Featured on Home</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredApartments.map((apt, index) => (
                        <tr key={apt._id || apt.id} className="hover:bg-slate-50/70 transition">
                          {/* Sequential SL Number (Descending) */}
                          <td className="py-3.5 px-4 text-center font-bold text-slate-900 text-sm">
                            {apt.serialNumber || filteredApartments.length - index}
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
                                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                  <span>{apt.title}</span>
                                  {apt.featured && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Featured
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                                  {apt.category}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-slate-700">
                            {apt.bedrooms} Bed / {apt.bathrooms} Bath ({apt.squareFeet} sq ft)
                          </td>

                          <td className="py-3.5 px-4 font-bold text-emerald-600">
                            ${apt.baseRent}/mo
                          </td>

                          <td className="py-3.5 px-4 text-slate-600">{apt.furnished}</td>
                          <td className="py-3.5 px-4 text-slate-600">{apt.petPolicy}</td>

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

                          {/* Featured on Homepage One-Click Toggle */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleFeatured(apt)}
                              title={apt.featured ? "Click to remove from homepage feature" : "Click to feature on homepage"}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer inline-flex items-center gap-1.5 ${
                                apt.featured
                                  ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 shadow-sm"
                                  : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 hover:text-slate-600"
                              }`}
                            >
                              <Star
                                className={`w-3 h-3 ${
                                  apt.featured ? "fill-amber-500 text-amber-500" : "text-slate-300"
                                }`}
                              />
                              {apt.featured ? "Featured" : "Standard"}
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setEditingApt({
                                  ...apt,
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
                          </td>
                        </tr>
                      ))}
                      {filteredApartments.length === 0 && (
                        <tr>
                          <td colSpan={9} className="py-8 text-center text-slate-400">
                            No matching apartments found. Try adjusting your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB 4: HOMEPAGE STATS */}
        {activeTab === "stats" && (
          <div className="max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Homepage Live Statistics</h3>
              <p className="text-xs text-slate-500 mt-1">
                These numbers update the dynamic statistics section on the public homepage in real time.
              </p>
            </div>

            <form onSubmit={handleSaveStats} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Active Apartments
                  </label>
                  <input
                    type="text"
                    value={stats.activeApartments}
                    onChange={(e) => setStats({ ...stats, activeApartments: e.target.value })}
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={savingStats}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {savingStats ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Homepage Statistics
                </button>
              </div>
            </form>
          </div>
        )}
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

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 relative max-h-[92vh] overflow-y-auto">
              <button
                onClick={() => setSelectedLead(null)}
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
                  <span className="text-slate-700 flex items-center gap-1.5 font-medium select-all">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    {selectedLead.email}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-700 font-semibold flex items-center gap-1.5 select-all">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    {selectedLead.phone}
                  </span>
                </div>
              </div>

              {/* Selected Apartment Section */}
              {aptTitle || aptPrice ? (
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
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-slate-500 block font-medium">Location:</span>
                  <span className="font-semibold text-slate-800">{selectedLead.desiredLocation || "United States"}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-slate-500 block font-medium">Budget Range:</span>
                  <span className="font-semibold text-emerald-600">${selectedLead.budgetMin} – ${selectedLead.budgetMax}/mo</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-slate-500 block font-medium">Layout Required:</span>
                  <span className="font-semibold text-slate-800">{selectedLead.bedrooms} Bed, {selectedLead.bathrooms} Bath</span>
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

                <button
                  type="button"
                  onClick={() => handleDeleteLead((selectedLead._id || selectedLead.id) as string)}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-bold text-xs border border-rose-200 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Lead</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* APARTMENT EDIT / CREATE MODAL */}
      {editingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-lg rounded-3xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                {isNewAptModal ? "Add New Base Apartment" : "Edit Apartment"}
              </h3>
              <button
                onClick={() => {
                  setEditingApt(null);
                  setImageInputUrl("");
                }}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveApartment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Apartment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Lexington Modern Suite"
                  value={editingApt.title}
                  onChange={(e) => setEditingApt({ ...editingApt, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium outline-none focus:bg-white focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1 flex items-center justify-between">
                  <span>Location / Area Corridor</span>
                  <span className="text-[10px] text-slate-400 font-normal">Neighborhood or corridor</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Parkview & Green Oaks Promenade, Chicago, IL"
                  value={editingApt.addressTemplate || ""}
                  onChange={(e) => setEditingApt({ ...editingApt, addressTemplate: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Category</label>
                  <select
                    value={editingApt.category}
                    onChange={(e) => setEditingApt({ ...editingApt, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition cursor-pointer"
                  >
                    <option value="1B1B">1 Bed / 1 Bath</option>
                    <option value="2B2B">2 Bed / 2 Bath</option>
                    <option value="3B2B">3 Bed / 2 Bath</option>
                    <option value="3B3B">3 Bed / 3 Bath</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1 flex items-center justify-between">
                    <span>Base Monthly Rent ($)</span>
                    <span className="text-[10px] text-blue-600 font-bold">Manual Input</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">$</span>
                    <input
                      type="number"
                      required
                      min={50}
                      max={50000}
                      step={10}
                      placeholder="e.g. 1250"
                      value={editingApt.baseRent ? editingApt.baseRent : ""}
                      onChange={(e) =>
                        setEditingApt({
                          ...editingApt,
                          baseRent: e.target.value === "" ? 0 : Number(e.target.value),
                        })
                      }
                      className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Bedrooms</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={editingApt.bedrooms ?? 1}
                    onChange={(e) => setEditingApt({ ...editingApt, bedrooms: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Bathrooms</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={editingApt.bathrooms ?? 1}
                    onChange={(e) => setEditingApt({ ...editingApt, bathrooms: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1 flex items-center justify-between">
                    <span>Square Feet</span>
                    <span className="text-[10px] text-blue-600 font-bold">Manual Input</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={50}
                    max={20000}
                    step={10}
                    placeholder="e.g. 750"
                    value={editingApt.squareFeet ? editingApt.squareFeet : ""}
                    onChange={(e) =>
                      setEditingApt({
                        ...editingApt,
                        squareFeet: e.target.value === "" ? 0 : Number(e.target.value),
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingApt.description}
                  onChange={(e) => setEditingApt({ ...editingApt, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition"
                />
              </div>

              {/* APARTMENT PHOTOS & GALLERY */}
              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-700 font-bold text-xs">
                    Apartment Photos ({(editingApt.images || []).length})
                  </label>
                  <span className="text-[10px] text-slate-400">First photo is used as main cover</span>
                </div>

                {/* Thumbnails Grid */}
                {(editingApt.images || []).length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {editingApt.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100"
                      >
                        <img
                          src={imgUrl}
                          alt={`Apartment photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {idx === 0 && (
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-blue-600/90 text-white text-[8px] font-bold uppercase tracking-wider shadow flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-white" /> Cover
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
                              <Star className="w-3 h-3" />
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
                ) : (
                  <div className="p-3.5 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-[11px] bg-slate-50/50">
                    <ImageIcon className="w-5 h-5 mx-auto mb-1 text-slate-300" />
                    No photos added yet. Upload from device or paste an image URL below.
                  </div>
                )}

                {/* Upload or Link Input Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleUploadImage}
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="hidden"
                      id="apartment-image-file"
                    />
                    <label
                      htmlFor="apartment-image-file"
                      className={`w-full flex items-center justify-center gap-1.5 p-2 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-blue-700 font-bold transition cursor-pointer text-xs ${
                        isUploadingImage ? "opacity-60 pointer-events-none" : ""
                      }`}
                    >
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" /> Upload Photo
                        </>
                      )}
                    </label>
                  </div>

                  <div className="flex gap-1">
                    <input
                      type="url"
                      placeholder="Paste image link (https://...)"
                      value={imageInputUrl}
                      onChange={(e) => setImageInputUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddImageUrl();
                        }
                      }}
                      className="flex-1 p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      disabled={!imageInputUrl.trim()}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs disabled:opacity-40 transition cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
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

              <div className="pt-3 flex justify-end gap-2">
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
