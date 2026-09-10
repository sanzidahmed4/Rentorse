"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Home,
  Upload,
  Link2,
  Clipboard,
  Star,
  Trash2,
  Loader2,
  ImageIcon,
  Camera,
  BedDouble,
  Bath,
  Maximize2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Save,
  Check,
} from "lucide-react";
import { ApartmentCategory, FurnishedStatus } from "@/types";

interface IApartmentForm {
  title: string;
  addressTemplate: string;
  description: string;
  category: ApartmentCategory;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  climate: string;
  laundry: string;
  parking: string;
  cityState: string;
  baseRent: number;
  squareFeet: number;
  furnished: FurnishedStatus;
  hasKitchen: boolean;
  petPolicy: "Dogs & Cats Allowed" | "Cats Only" | "No Pets";
  amenities: string[];
  images: string[];
  featured: boolean;
  isActive: boolean;
  deposit: number;
  availableDate: string;
  rating: number;
  reviewsCount: number;
  isManual: boolean;
}

const DEFAULT_APARTMENT: IApartmentForm = {
  title: "",
  addressTemplate: "",
  description: "",
  category: "1B1B",
  bedrooms: 1,
  bathrooms: 1,
  propertyType: "Apartment",
  climate: "Central AC & Heating",
  laundry: "In-unit laundry",
  parking: "Street parking",
  cityState: "",
  baseRent: 0,
  squareFeet: 0,
  furnished: "Unfurnished",
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
  isManual: true,
};

export default function NewApartmentPage() {
  const router = useRouter();

  // Form State
  const [apartment, setApartment] = useState<IApartmentForm>(DEFAULT_APARTMENT);
  const [imageInputUrl, setImageInputUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth / Current User
  const [currentUserRole, setCurrentUserRole] = useState<"admin" | "editor">("editor");

  useEffect(() => {
    try {
      const storedRole = sessionStorage.getItem("apartmento_user_role") || localStorage.getItem("apartmento_user_role");
      if (storedRole === "admin" || storedRole === "editor") {
        setCurrentUserRole(storedRole);
      }
    } catch (_) {}

    // Verify session
    fetch("/api/admin/dashboard")
      .then((res) => {
        if (res.status === 401) {
          router.replace("/admin/login?redirect=%2Fadmin%2Fapartments%2Fnew");
        }
      })
      .catch(() => {});
  }, [router]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  // Image Upload Handlers
  const uploadFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsUploadingImage(true);
    setErrorMessage("");
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
        setApartment((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls],
        }));
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
          setApartment((prev) => ({
            ...prev,
            images: [...prev.images, text],
          }));
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
    if (!imageInputUrl.trim()) return;
    const url = imageInputUrl.trim();
    setApartment((prev) => ({
      ...prev,
      images: [...prev.images, url],
    }));
    setImageInputUrl("");
    showToast("Photo URL added!");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setApartment((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSetPrimaryImage = (indexToPrimary: number) => {
    setApartment((prev) => {
      const selected = prev.images[indexToPrimary];
      const others = prev.images.filter((_, idx) => idx !== indexToPrimary);
      return {
        ...prev,
        images: [selected, ...others],
      };
    });
    showToast("Set as primary cover photo!");
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apartment.title.trim()) {
      setErrorMessage("Apartment title is required.");
      showToast("Please enter an apartment title.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const trimmedAddress = apartment.addressTemplate ? apartment.addressTemplate.trim() : "";
      const hasAddress = trimmedAddress.length > 0;
      const payload = {
        ...apartment,
        slug: `apt-${Date.now()}`,
        addressTemplate: trimmedAddress,
        cityState: hasAddress ? trimmedAddress : "",
        isManual: hasAddress,
      };

      const res = await fetch("/api/apartments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        const toastMsg = hasAddress ? "New real apartment created!" : "New chameleon apartment created!";
        try {
          sessionStorage.setItem("apartmento_toast", toastMsg);
        } catch (_) {}
        router.push("/admin?tab=apartments");
      } else {
        setErrorMessage(data.error || "Failed to create apartment.");
        showToast(data.error || "Failed to create apartment.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An unexpected error occurred while saving.");
      showToast("Failed to save apartment.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-xl border border-slate-800 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Top Header & Breadcrumb Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin?tab=apartments"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Inventory</span>
            </Link>
            <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Add New Apartment Listing
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block">
                Create a verified physical address listing or a dynamic chameleon listing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <Link
              href="/admin?tab=apartments"
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Apartment</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} onPaste={handlePasteImage} className="text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* LEFT: FORM INPUTS (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Basic Listing Details Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    Basic Property Information
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Essential property title, category specifications, and rental pricing
                  </p>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Apartment Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Lexington Modern Suite"
                    value={apartment.title}
                    onChange={(e) => setApartment({ ...apartment, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium outline-none focus:bg-white focus:border-blue-500 transition text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
                    <span>Property Address (Optional)</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      Leave blank for Chameleon dynamic search
                    </span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. 18 Nantucket Dr, Medford, NY 11763 or Paterson, NJ 07501"
                      value={apartment.addressTemplate || ""}
                      onChange={(e) => setApartment({ ...apartment, addressTemplate: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition font-medium text-xs"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {apartment.addressTemplate?.trim()
                      ? "📍 This listing has a fixed real address and will appear specifically for this location."
                      : "🌪️ Chameleon listing active: Will automatically adapt city, neighborhood, and zip code to match renter searches."}
                  </p>
                </div>

                {/* Specs 4-Column Grid: Category, Furnished, Monthly Rent, Square Feet */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Category</label>
                    <select
                      value={apartment.category}
                      onChange={(e) => {
                        const cat = e.target.value as ApartmentCategory;
                        let beds = 1;
                        let baths = 1;
                        if (cat === "1B1B") { beds = 1; baths = 1; }
                        else if (cat === "2B1B") { beds = 2; baths = 1; }
                        else if (cat === "2B2B") { beds = 2; baths = 2; }
                        else if (cat === "3B1B") { beds = 3; baths = 1; }
                        else if (cat === "3B2B") { beds = 3; baths = 2; }
                        else if (cat === "3B3B") { beds = 3; baths = 3; }
                        setApartment({
                          ...apartment,
                          category: cat,
                          bedrooms: beds,
                          bathrooms: baths,
                        });
                      }}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition cursor-pointer font-medium text-xs"
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
                    <label className="block text-slate-700 font-semibold mb-1">Furnished</label>
                    <select
                      value={apartment.furnished || "Unfurnished"}
                      onChange={(e) =>
                        setApartment({
                          ...apartment,
                          furnished: e.target.value as FurnishedStatus,
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition cursor-pointer font-medium text-xs"
                    >
                      <option value="Furnished">Furnished</option>
                      <option value="Unfurnished">Unfurnished</option>
                      <option value="Either">Either (Flexible)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Monthly Rent ($)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">$</span>
                      <input
                        type="number"
                        placeholder="e.g. 1250"
                        value={apartment.baseRent ? apartment.baseRent : ""}
                        onChange={(e) =>
                          setApartment({
                            ...apartment,
                            baseRent: e.target.value === "" ? 0 : Number(e.target.value),
                          })
                        }
                        className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-500 transition text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Square Feet</label>
                    <input
                      type="number"
                      placeholder="e.g. 750"
                      value={apartment.squareFeet ? apartment.squareFeet : ""}
                      onChange={(e) =>
                        setApartment({
                          ...apartment,
                          squareFeet: e.target.value === "" ? 0 : Number(e.target.value),
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-500 transition text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide a detailed description of the apartment, features, finishes, and neighborhood highlights..."
                    value={apartment.description}
                    onChange={(e) => setApartment({ ...apartment, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Unit Details & Amenities (Marketplace Style) */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Home className="w-4 h-4 text-blue-600" />
                      Unit Details & Marketplace Specs
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Facebook Marketplace & rental portal style filterable specifications
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-600 text-xs font-semibold mb-1">Property Type</label>
                    <select
                      value={apartment.propertyType || "Apartment"}
                      onChange={(e) => setApartment({ ...apartment, propertyType: e.target.value })}
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
                      value={apartment.climate || "Central AC & Heating"}
                      onChange={(e) => setApartment({ ...apartment, climate: e.target.value })}
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
                      value={apartment.laundry || "In-unit laundry"}
                      onChange={(e) => setApartment({ ...apartment, laundry: e.target.value })}
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
                      value={apartment.parking || "Street parking"}
                      onChange={(e) => setApartment({ ...apartment, parking: e.target.value })}
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

              {/* Photos & Gallery Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-blue-600" />
                      Apartment Photos & Gallery ({apartment.images.length})
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Upload high quality photos. The first image serves as the main card cover.
                    </p>
                  </div>
                  <span className="text-[11px] bg-blue-50 text-blue-700 font-semibold px-2.5 py-0.5 rounded-full">
                    {apartment.images.length} added
                  </span>
                </div>

                {/* Drag & Drop Multi-file Upload Box */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
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
                    <div className="flex flex-col items-center justify-center py-4 text-blue-600">
                      <Loader2 className="w-7 h-7 animate-spin mb-2" />
                      <span className="text-xs font-bold">Uploading photos...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-1.5">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                        <Upload className="w-5 h-5" />
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
                  <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:bg-white focus-within:border-blue-500 transition">
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
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs disabled:opacity-40 transition cursor-pointer shrink-0"
                  >
                    Add Link
                  </button>
                  <button
                    type="button"
                    onClick={handlePasteFromClipboardBtn}
                    title="Paste copied image or URL from clipboard"
                    className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs transition cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>Paste</span>
                  </button>
                </div>

                {/* Photo Previews Gallery Grid */}
                {apartment.images.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                      <span>Photo Previews ({apartment.images.length})</span>
                      <span className="text-[10px] text-slate-400">Hover photo to set as cover or remove</span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 p-2 bg-slate-50 rounded-2xl border border-slate-100">
                      {apartment.images.map((imgUrl, idx) => (
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
                          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(idx)}
                                className="p-1.5 rounded-lg bg-white text-slate-800 text-[10px] font-bold hover:bg-slate-100 transition cursor-pointer shadow"
                                title="Set as Main Cover Photo"
                              >
                                <Star className="w-3.5 h-3.5 text-amber-500" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1.5 rounded-lg bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700 transition cursor-pointer shadow"
                              title="Remove Photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Publishing & Visibility Settings */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
                <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Publishing & Visibility Settings
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={apartment.isActive}
                      onChange={(e) => setApartment({ ...apartment, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                    />
                    <span>Published (Visible on Live Website)</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={apartment.featured}
                      onChange={(e) => setApartment({ ...apartment, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                    />
                    <span>Featured on Homepage</span>
                  </label>
                </div>
              </div>

              {/* Bottom Actions Row (For mobile & fast access) */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <Link
                  href="/admin?tab=apartments"
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold transition cursor-pointer shadow-md shadow-blue-600/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Apartment...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Apartment</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* RIGHT: LIVE LISTING PREVIEW (5 cols, Sticky) */}
            <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Live Listing Preview
                </span>
                <span className="text-[10px] bg-slate-200/70 text-slate-600 font-semibold px-2 py-0.5 rounded-md">
                  Live Card
                </span>
              </div>

              {/* Live Preview Card */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group">
                {/* Image Preview */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  {apartment.images && apartment.images.length > 0 ? (
                    <img
                      src={apartment.images[0]}
                      alt={apartment.title || "Apartment cover"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 gap-2 p-4 text-center">
                      <ImageIcon className="w-9 h-9 text-slate-300" />
                      <span className="text-xs font-semibold text-slate-400">
                        Upload photos to preview cover image
                      </span>
                    </div>
                  )}

                  {/* Photo Count Tag */}
                  {apartment.images && apartment.images.length > 0 && (
                    <div className="absolute top-3 left-3 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      <span>
                        {apartment.images.length} {apartment.images.length === 1 ? "Photo" : "Photos"}
                      </span>
                    </div>
                  )}

                  {/* Furnished Status Tag */}
                  <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <span>🛋️ {apartment.furnished || "Unfurnished"}</span>
                  </div>

                  {/* Rent Badge */}
                  <div className="absolute bottom-3 right-3 bg-blue-600 text-white px-3 py-1.5 rounded-xl font-black text-sm shadow-lg">
                    ${apartment.baseRent || 0}
                    <span className="text-[10px] font-normal text-blue-100"> / mo</span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">
                        {apartment.addressTemplate?.trim()
                          ? apartment.addressTemplate
                          : "Dynamic Chameleon Location (Auto-adapts to search)"}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 line-clamp-1">
                      {apartment.title || "Apartment Title Preview"}
                    </h4>

                    <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                      {apartment.description || "Enter a description on the left to preview it here."}
                    </p>

                    {/* Specs row */}
                    <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-100 mt-3 text-xs text-slate-600 text-center font-medium">
                      <div className="flex items-center justify-center gap-1">
                        <BedDouble className="w-3.5 h-3.5 text-blue-600" />
                        <span>{apartment.bedrooms || 1} Bed</span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-blue-600" />
                        <span>{apartment.bathrooms || 1} Bath</span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>{apartment.squareFeet || 0} sq ft</span>
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
              <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm text-xs text-slate-600 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Furnished Status:</span>
                  <span className="font-bold text-slate-800">{apartment.furnished || "Unfurnished"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Category Layout:</span>
                  <span className="font-bold text-slate-800">
                    {apartment.category.replace(/(\d+B)(\d+B)/i, "$1/$2")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Visibility:</span>
                  <span className={`font-bold ${apartment.isActive ? "text-emerald-600" : "text-amber-600"}`}>
                    {apartment.isActive ? "Published" : "Draft / Unpublished"}
                  </span>
                </div>
                {/* Unit Details & Map specs preview */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Unit Type:</span>
                    <span className="font-semibold text-slate-800">{apartment.propertyType || "Apartment"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Climate Control:</span>
                    <span className="font-semibold text-slate-800">
                      {apartment.climate || "Central AC & Heating"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Laundry & Parking:</span>
                    <span className="font-semibold text-slate-800">
                      {apartment.laundry || "In-unit laundry"} · {apartment.parking || "Street parking"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-blue-600 font-semibold">
                    <span className="text-slate-400">Google Map Area:</span>
                    <span>{apartment.addressTemplate?.trim() || "Auto-detected on search"}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  {apartment.addressTemplate?.trim()
                    ? "📍 Real geographic listing with target address"
                    : "🌪️ Chameleon listing (auto-adapts to search query)"}
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
