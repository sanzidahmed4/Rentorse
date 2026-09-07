"use client";

import React, { useState } from "react";
import { Calendar, CheckCircle } from "lucide-react";
import { IApartment } from "@/types";
import ApartmentBookingModal from "./ApartmentBookingModal";

interface ApartmentTourCTAProps {
  apartment: IApartment;
}

export default function ApartmentTourCTA({ apartment }: ApartmentTourCTAProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-3">
        <button
          onClick={() => setModalOpen(true)}
          className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-blue-200" />
          Schedule Tour / Book
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-100">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero Application Fee • Instant Tour Confirmation</span>
        </div>
      </div>

      <ApartmentBookingModal
        apartment={apartment}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
