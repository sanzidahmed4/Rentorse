"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Camera,
} from "lucide-react";

interface ApartmentPhotoGalleryProps {
  images: string[];
  title: string;
}

export default function ApartmentPhotoGallery({
  images,
  title,
}: ApartmentPhotoGalleryProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fallback if no images provided
  const validImages =
    images && images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
        ];

  const total = validImages.length;
  const remainingCount = total > 3 ? total - 3 : 0;

  const openGallery = (index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const closeGallery = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Keyboard navigation (ESC, ArrowLeft, ArrowRight)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGallery();
      else if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, closeGallery, handlePrev, handleNext]);

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. Main Inline Photo Gallery Grid (3 Photos Layout with +N Counter)     */}
      {/* ========================================================================= */}
      <div className="relative group/gallery">
        {total === 1 ? (
          /* Single Image Display */
          <div
            onClick={() => openGallery(0)}
            className="relative h-80 sm:h-[420px] rounded-3xl overflow-hidden shadow-sm cursor-pointer group bg-slate-100"
          >
            <Image
              src={validImages[0]}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-4 right-4 z-10 px-3.5 py-2 rounded-xl bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold shadow-md flex items-center gap-1.5 border border-slate-200/80">
              <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Full Screen</span>
            </div>
          </div>
        ) : total === 2 ? (
          /* Two Images Side-by-Side */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-80 sm:h-[400px]">
            {validImages.slice(0, 2).map((img, idx) => (
              <div
                key={idx}
                onClick={() => openGallery(idx)}
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm cursor-pointer group bg-slate-100 h-full"
              >
                <Image
                  src={img}
                  alt={`${title} photo ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            ))}
          </div>
        ) : (
          /* Standard 3-Image Grid with +N Counter Overlay on 3rd Image */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Primary Large Image (Left, spans 2 columns) */}
            <div
              onClick={() => openGallery(0)}
              className="md:col-span-2 relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-sm cursor-pointer group bg-slate-100"
            >
              <Image
                src={validImages[0]}
                alt={title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
                priority
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* Secondary Stacked Column (Right, 2 rows) */}
            <div className="grid grid-rows-2 gap-4 h-72 sm:h-96">
              {/* 2nd Image */}
              <div
                onClick={() => openGallery(1)}
                className="relative rounded-2xl overflow-hidden shadow-sm cursor-pointer group bg-slate-100"
              >
                <Image
                  src={validImages[1]}
                  alt={`${title} interior`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>

              {/* 3rd Image (With +N Remaining Badge if total > 3) */}
              <div
                onClick={() => openGallery(2)}
                className="relative rounded-2xl overflow-hidden shadow-sm cursor-pointer group bg-slate-100"
              >
                <Image
                  src={validImages[2]}
                  alt={`${title} layout`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
                />

                {remainingCount > 0 ? (
                  /* +N Remaining Photos Overlay */
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors flex flex-col items-center justify-center text-white">
                    <div className="text-center select-none space-y-0.5 transform group-hover:scale-105 transition-transform">
                      <div className="flex items-center justify-center gap-1.5">
                        <Camera className="w-5 h-5 text-blue-300" />
                        <span className="text-2xl sm:text-3xl font-black tracking-tight">
                          +{remainingCount}
                        </span>
                      </div>
                      <span className="block text-xs sm:text-sm font-bold text-slate-100">
                        View All Photos
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. Fullscreen Interactive Photo Gallery Modal (Lightbox)                  */}
      {/* ========================================================================= */}
      {isOpen && mounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Apartment Photo Gallery"
          className="fixed inset-0 z-[99999] bg-slate-950/95 backdrop-blur-md flex flex-col justify-between select-none animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeGallery();
          }}
        >
          {/* Top Header Bar */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-white border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3 min-w-0 pr-4">
              <span className="px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 text-xs font-bold border border-blue-500/40 shrink-0">
                {activeIndex + 1} / {total}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-100 truncate">
                {title}
              </h3>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={closeGallery}
                aria-label="Close photo gallery"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Central Main Photo Stage */}
          <div className="relative flex-1 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Previous Photo Button */}
            {total > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-3 sm:left-6 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition backdrop-blur-sm border border-white/20 shadow-xl active:scale-90 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            )}

            {/* Active Image */}
            <div className="relative max-w-[90vw] max-h-[68vh] sm:max-h-[72vh] flex items-center justify-center">
              <img
                src={validImages[activeIndex]}
                alt={`${title} - Photo ${activeIndex + 1}`}
                className="max-h-[68vh] sm:max-h-[72vh] max-w-[88vw] sm:max-w-[80vw] w-auto h-auto object-contain rounded-2xl shadow-2xl transition-all duration-200 pointer-events-none"
              />
            </div>

            {/* Next Photo Button */}
            {total > 1 && (
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-3 sm:right-6 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition backdrop-blur-sm border border-white/20 shadow-xl active:scale-90 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Strip / Carousel */}
          <div className="w-full bg-black/50 border-t border-white/10 py-3 px-4 shrink-0">
            <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-thin">
              {validImages.map((img, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`View photo ${idx + 1}`}
                    className={`relative w-14 h-10 sm:w-18 sm:h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      isActive
                        ? "border-blue-500 ring-2 ring-blue-400/60 scale-105 opacity-100"
                        : "border-transparent opacity-40 hover:opacity-90"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
