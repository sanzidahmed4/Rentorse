/**
 * Google Analytics 4 (GA4) custom event tracking utility
 * Measurement ID: G-LNBHKWE17R
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

export const GA_MEASUREMENT_ID = "G-LNBHKWE17R";
export const FB_PIXEL_ID = "1306981108071575";

/**
 * Safely sends a custom event to GA4.
 * CRITICAL PRIVACY RULE: Never pass Personally Identifiable Information (PII)
 * such as full names, email addresses, or phone numbers to Google Analytics.
 */
export function trackGAEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window === "undefined") return;

  try {
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    } else {
      window.dataLayer.push({
        event: eventName,
        ...params,
      });
    }
  } catch (err) {
    console.warn("GA4 event error:", err);
  }
}

/**
 * Safely track Meta / Facebook Pixel event
 */
export function trackFBPixel(eventName: string, params?: Record<string, any>) {
  if (typeof window === "undefined") return;

  try {
    if (typeof window.fbq === "function") {
      if (params) {
        window.fbq("track", eventName, params);
      } else {
        window.fbq("track", eventName);
      }
    }
  } catch (err) {
    console.warn("FB Pixel event error:", err);
  }
}

/**
 * Standard GA4 Funnel & Conversion Helpers
 */
export function trackLeadGenerated(params: {
  leadId?: string;
  value?: number;
  currency?: string;
  source?: string;
  bedrooms?: number;
  location?: string;
}) {
  trackGAEvent("generate_lead", {
    currency: params.currency || "USD",
    value: params.value || 1200,
    lead_id: params.leadId,
    source: params.source || "quiz_funnel",
    bedrooms: params.bedrooms,
    location: params.location,
  });

  trackFBPixel("Lead", {
    content_name: params.source || "Apartment Match Quiz",
    currency: params.currency || "USD",
    value: params.value || 1200,
  });
}

export function trackTourScheduled(params: {
  apartmentId?: string;
  apartmentTitle?: string;
  rent?: number;
  tourType?: string;
  tourDate?: string;
  tourTime?: string;
}) {
  trackGAEvent("schedule_tour", {
    apartment_id: params.apartmentId,
    apartment_title: params.apartmentTitle,
    rent: params.rent,
    tour_type: params.tourType,
    tour_date: params.tourDate,
    tour_time: params.tourTime,
  });

  trackGAEvent("generate_lead", {
    currency: "USD",
    value: params.rent || 1000,
    lead_type: "Tour Schedule",
  });

  trackFBPixel("Schedule", {
    content_name: params.apartmentTitle || "Apartment Tour",
    currency: "USD",
    value: params.rent || 1000,
  });
}
