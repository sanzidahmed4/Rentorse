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
