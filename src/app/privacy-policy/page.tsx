import { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  FileText,
  Mail,
  Phone,
  ArrowLeft,
  ChevronRight,
  Database,
  Globe,
  Bell,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://rentorce.com";
const LAST_UPDATED = "September 16, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy | Rentorce",
  description:
    "Learn how Rentorce collects, uses, protects, and handles information when you use our apartment rental and housing services.",
  alternates: {
    canonical: `${BASE_URL}/privacy-policy`,
  },
  openGraph: {
    title: "Privacy Policy | Rentorce",
    description:
      "Learn how Rentorce collects, uses, protects, and handles information when you use our apartment rental and housing services.",
    url: `${BASE_URL}/privacy-policy`,
    siteName: "Rentorce",
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Rentorce",
    description:
      "Learn how Rentorce collects, uses, protects, and handles information when you use our apartment rental and housing services.",
    images: [`${BASE_URL}/og-image.png`],
  },
};

const TOC_SECTIONS = [
  { id: "introduction", title: "1. Introduction & Scope" },
  { id: "information-collected", title: "2. Information We Collect Directly from You" },
  { id: "automated-collection", title: "3. Information Collected Automatically" },
  { id: "analytics-tracking", title: "4. Google Analytics 4 & Tracking Technologies" },
  { id: "cookies-storage", title: "5. Cookies & Local Session Storage" },
  { id: "how-we-use", title: "6. How We Use Your Information" },
  { id: "how-we-share", title: "7. How We Disclose Your Information" },
  { id: "no-sale-of-data", title: "8. Sale of Personal Information" },
  { id: "data-retention", title: "9. Data Retention & Lifecycle" },
  { id: "security-measures", title: "10. Data Security & Storage Architecture" },
  { id: "communications", title: "11. Communications & Email Preferences" },
  { id: "your-privacy-rights", title: "12. Your Privacy Rights & Choices" },
  { id: "state-privacy-rights", title: "13. California & State Privacy Rights" },
  { id: "california-notice", title: "14. Notice for California Residents (Shine the Light)" },
  { id: "children-privacy", title: "15. Children's Privacy" },
  { id: "third-party-links", title: "16. Third-Party Websites & External Content" },
  { id: "equal-housing", title: "17. Equal Housing Opportunity" },
  { id: "policy-updates", title: "18. Changes to This Privacy Policy" },
  { id: "contact-us", title: "19. Contact Us & Privacy Requests" },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-14 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-blue-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-6 text-sm text-slate-300">
            <Link
              href="/"
              className="hover:text-white transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-blue-300 font-medium">Legal</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-white font-medium">Privacy Policy</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold tracking-wide mb-4 border border-blue-400/30">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Privacy & Data Information
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
            Rentorce Privacy Policy
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
            This Privacy Policy explains how Rentorce Platform Inc. collects, uses,
            discloses, and safeguards your personal information when you visit our website,
            utilize our apartment matching tools, submit tour inquiries, or subscribe to rental alerts.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" /> Last Updated: <strong className="text-white">{LAST_UPDATED}</strong>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>Entity: <strong className="text-white">Rentorce Platform Inc.</strong></span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>Jurisdiction: <strong className="text-white">United States</strong></span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Core Commitments Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm mb-1">No Sale to Data Brokers</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rentorce does not sell personal information to data brokers.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm mb-1">Purpose-Bound Sharing</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Information may be disclosed to property owners, landlords, property managers, and service providers when necessary to provide requested rental services.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm mb-1">Data Safeguards</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Protected by administrative, technical, and physical safeguards designed to protect personal information.
              </p>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar TOC + Main Policy Text */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Table of Contents Sticky Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm order-2 lg:order-1">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Table of Contents
              </span>
            </div>
            <nav className="space-y-1 text-xs max-h-[70vh] overflow-y-auto pr-1">
              {TOC_SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="block py-1 px-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition leading-snug"
                >
                  {sec.title}
                </a>
              ))}
            </nav>

            <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 -mx-2 -mb-2 p-3 rounded-xl">
              <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Privacy Inquiries
              </span>
              <p className="text-xs text-slate-600 mb-2">
                Need to access or delete your rental inquiry data?
              </p>
              <a
                href="mailto:support@rentorce.com"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                <Mail className="w-3.5 h-3.5" /> support@rentorce.com
              </a>
            </div>
          </aside>

          {/* Legal Text Body */}
          <main className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-10 order-1 lg:order-2">
            {/* Section 1 */}
            <section id="introduction" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                1. Introduction & Scope
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  Welcome to <strong>Rentorce</strong> (accessible at{" "}
                  <a href="https://rentorce.com" className="text-blue-600 hover:underline">
                    https://rentorce.com
                  </a>
                  ), operated by <strong>Rentorce Platform Inc.</strong> (&quot;Rentorce&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
                  Rentorce is a United States rental housing discovery and apartment matching platform designed
                  to connect prospective tenants with residential rental properties, landlords, leasing agents,
                  and property management teams across American cities.
                </p>
                <p>
                  This Privacy Policy applies to personal information collected through our public website,
                  interactive apartment finder funnel, tour booking requests, newsletter subscription forms,
                  and any administrative interfaces or communication channels maintained by Rentorce.
                </p>
                <p>
                  By accessing or using Rentorce, you acknowledge the data collection,
                  use, and disclosure practices described in this Privacy Policy. If you do not agree with our practices,
                  please do not access or use our services.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="information-collected" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                2. Information We Collect Directly from You
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-4">
                <p>
                  We collect information that you voluntarily submit when interacting with our platform tools,
                  completing pre-qualification questionnaires, requesting an apartment tour, or subscribing to updates:
                </p>
                
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-600" /> A. Contact & Identity Information
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li><strong>Full Name:</strong> Collected to personalize your rental inquiry and register your appointment with property managers.</li>
                    <li><strong>Email Address:</strong> Used to transmit tour confirmations, apartment availability alerts, newsletter updates, and communication regarding your inquiry.</li>
                    <li><strong>Telephone Number:</strong> Collected so leasing personnel or property managers can coordinate apartment tour confirmations and verify contact details.</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" /> B. Housing Preferences & Pre-Qualification Criteria
                  </h3>
                  <p className="text-xs text-slate-600">
                    When using our Apartment Finder Funnel or inquiry forms, you provide specific criteria so we can match you with available apartment units:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li><strong>Target Location:</strong> City, state, neighborhood, or ZIP code where you desire to live.</li>
                    <li><strong>Budget Boundaries:</strong> Minimum and maximum monthly rental target budget.</li>
                    <li><strong>Unit Layout Specifications:</strong> Desired bedroom count (Studio, 1BR, 2BR, 3BR+) and bathroom count.</li>
                    <li><strong>Household Size:</strong> Number of adult and minor occupants planning to reside in the home.</li>
                    <li><strong>Pet Status & Details:</strong> Whether you have pets, species, breed, and weight (used to match with pet-friendly buildings).</li>
                    <li><strong>Furnishing & Amenities:</strong> Need for furnished units, private kitchen requirements, laundry, parking, and specific property features.</li>
                    <li><strong>U.S. Residency Status & Age Category:</strong> General parameters requested by property management partners to assess rental qualification and household composition.</li>
                    <li><strong>Self-Reported Credit Range:</strong> General credit score tier (e.g., Excellent 720+, Good 660–719, Fair 600–659, or Needs Work/Co-signer). <em>Note: Rentorce does not pull official credit reports or collect Social Security Numbers on public inquiry forms.</em></li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" /> C. Tour Scheduling Details
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li><strong>Tour Format:</strong> In-person physical walkthrough or live virtual video walkthrough.</li>
                    <li><strong>Requested Date & Time Window:</strong> Desired appointment scheduling slot.</li>
                    <li><strong>Special Inquiries / Notes:</strong> Specific notes regarding move-in timelines, accessibility requests, or questions for the leasing office.</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" /> D. Newsletter & Notification Subscriptions
                  </h3>
                  <p className="text-xs text-slate-600">
                    If you subscribe to &quot;New Apartment Alerts &amp; Newsletter&quot; via our footer or homepage modules, we store your email address along with the timestamp of your subscription to deliver periodic updates on freshly listed rentals and housing tips.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="automated-collection" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                3. Information Collected Automatically
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  When you browse Rentorce, our web servers and analytics tools collect certain standard technical and diagnostic data:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
                  <li><strong>Browser and Device Characteristics:</strong> Browser type and version, operating system, device manufacturer/model, and screen resolution to ensure responsive layout rendering.</li>
                  <li><strong>Approximate Location Data:</strong> Non-precise geographic indications (country, state, or metropolitan area derived from IP address) to display geographically relevant apartment listings. We do not collect precise GPS coordinates without your consent.</li>
                  <li><strong>HTTP Request & Referral Information:</strong> The Uniform Resource Locator (URL) of the website that referred you to Rentorce, requested page URLs, click timestamps, and server response codes.</li>
                  <li><strong>Administrative Security Audit Logs:</strong> For authenticated system administrators accessing the admin console, we record IP addresses, user agents, action timestamps, and modification logs to protect system integrity and maintain accountability.</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section id="analytics-tracking" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                4. Google Analytics 4 & Tracking Technologies
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  Rentorce integrates <strong>Google Analytics 4 (GA4)</strong> (Measurement ID: <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono text-xs">G-LNBHKWE17R</code>), a web analysis service provided by Google LLC.
                </p>
                <p>
                  GA4 uses small text files (cookies) placed on your device to help us evaluate website traffic, track user engagement trends (such as time spent on listing pages and funnel conversion steps), and improve platform performance.
                </p>
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 text-xs text-slate-700 space-y-2">
                  <p className="font-semibold text-blue-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" /> Analytics Usage & Information Handling:
                  </p>
                  <p>
                    Rentorce uses Google Analytics 4 to collect aggregate, non-identifying usage statistics to evaluate website traffic and improve user experience. We do not transmit your name, email address, telephone number, or specific housing questionnaire answers to Google Analytics.
                  </p>
                  <p>
                    You can manage or disable cookies through your browser settings. Please note that disabling cookies may affect some website preferences or functionality.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="cookies-storage" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                5. Cookies & Local Session Storage
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  Rentorce uses browser cookies and HTML5 Web Storage technologies for distinct, necessary, and analytical functions:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-100 text-slate-800 font-bold">
                      <tr>
                        <th className="p-2.5 border-b border-slate-200">Storage Key / Cookie</th>
                        <th className="p-2.5 border-b border-slate-200">Type</th>
                        <th className="p-2.5 border-b border-slate-200">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2.5 font-mono text-blue-600">rentorce_last_search</td>
                        <td className="p-2.5 text-slate-600">sessionStorage (Browser)</td>
                        <td className="p-2.5 text-slate-600">
                          Temporarily retains your apartment search filters and pre-qualification responses during your active browser visit. This ensures your search details are preserved when switching pages or opening booking modals, without re-entering criteria. Cleared automatically when you close your browser tab.
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono text-blue-600">rentorce_admin_token</td>
                        <td className="p-2.5 text-slate-600">HTTP-Only Cookie</td>
                        <td className="p-2.5 text-slate-600">
                          Authentication token restricted to authorized administrative personnel to protect the internal administrative dashboard. Inaccessible via client-side JavaScript.
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono text-blue-600">_ga, _ga_*</td>
                        <td className="p-2.5 text-slate-600">HTTP Cookie (Analytics)</td>
                        <td className="p-2.5 text-slate-600">
                          Cookies installed by Google Analytics to differentiate visitors and track session interaction statistics anonymously.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-slate-500">
                  You can configure your browser settings to refuse or delete cookies. Please note that disabling cookies may affect certain navigation conveniences, though general apartment browsing will remain functional.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="how-we-use" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                6. How We Use Your Information
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>We process the information we collect for legitimate business purposes:</p>
                <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
                  <li><strong>Apartment Matching & Pre-Qualification:</strong> Analyzing your budget, location preferences, household size, and pet requirements against active inventory to match you with suitable rental options.</li>
                  <li><strong>Tour Coordination & Scheduling:</strong> Transmitting your tour date preferences and contact information to property leasing managers to book in-person or virtual walkthroughs.</li>
                  <li><strong>Direct Communications:</strong> Reaching out via email or phone to confirm appointments, provide status updates on rental requests, or answer customer support questions.</li>
                  <li><strong>Alerts & Marketing (Opt-In):</strong> Sending newsletters and alerts regarding newly available apartments to subscribers who requested updates.</li>
                  <li><strong>Platform Reliability & Security:</strong> Detecting, preventing, and mitigating fraudulent inquiries, spam submissions, security vulnerabilities, and unauthorized administrative access.</li>
                  <li><strong>Legal Compliance:</strong> Complying with applicable legal obligations and recordkeeping requirements.</li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section id="how-we-share" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                7. How We Disclose Your Information
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  Rentorce does not disclose your personal information to third parties except in the specific circumstances outlined below:
                </p>

                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-900 text-xs mb-1">1. Property Owners, Landlords, and Property Managers</h3>
                    <p className="text-xs text-slate-600">
                      When you submit a tour request or pre-qualification inquiry for a specific apartment or rental search, we share your submitted contact details and housing preferences with the respective property manager, landlord, or leasing agent so they can evaluate availability, verify requirements, and conduct your tour.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-900 text-xs mb-1">2. Technology and Infrastructure Service Providers</h3>
                    <p className="text-xs text-slate-600 mb-2">
                      We engage trusted third-party technology providers that assist in operating our platform:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                      <li><strong>Vercel Inc.:</strong> Hosting platform, edge computing infrastructure, and serverless runtime provider.</li>
                      <li><strong>MongoDB Atlas:</strong> Cloud database provider where rental listings, inquiry records, and administrator audit logs are stored.</li>
                      <li><strong>Cloudinary:</strong> Cloud asset management infrastructure used for hosting and serving apartment photos and floorplans.</li>
                      <li><strong>Google Analytics 4:</strong> Aggregate web traffic analytics and measurement.</li>
                      <li><strong>IndexNow Protocol:</strong> Submits public apartment listing URLs to search engines for prompt indexing; no personal tenant data is submitted.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-900 text-xs mb-1">3. Legal Compliance & Protection of Rights</h3>
                    <p className="text-xs text-slate-600">
                      We may disclose personal information if required to do so by law, subpoena, court order, or governmental regulation, or if we believe disclosure is necessary to investigate fraud, protect the safety of users, or defend the legal rights and property of Rentorce Platform Inc.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-900 text-xs mb-1">4. Corporate Business Transfers</h3>
                    <p className="text-xs text-slate-600">
                      In the event of a merger, acquisition, corporate reorganization, asset sale, or bankruptcy involving Rentorce, personal information held by Rentorce may be transferred to the successor entity.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section id="no-sale-of-data" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                8. Sale of Personal Information
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-900 space-y-2">
                    <p className="font-bold text-sm">Rentorce does not sell personal information to data brokers.</p>
                    <p>
                      We do not sell consumer names, telephone numbers, email addresses, or rental pre-qualification information to third-party data brokers or marketing aggregators for monetary compensation.
                    </p>
                    <p>
                      Personal information submitted through our platform may be disclosed to property owners, landlords, property managers, and service providers when necessary to provide requested rental-related services, such as coordinating apartment tours, processing inquiries, and evaluating housing fit.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section id="data-retention" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                9. Data Retention & Lifecycle
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  We retain personal information for as long as necessary to fulfill the purposes described in this Privacy Policy, provide requested services, resolve disputes, and comply with legal or recordkeeping obligations:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                  <li><strong>Renter Inquiries & Pre-Qualification Records:</strong> Retained for as long as necessary to fulfill housing search and tour coordination services, communicate with property managers and prospective renters, resolve disputes, and maintain business records.</li>
                  <li><strong>Newsletter Subscriptions:</strong> Retained until the user unsubscribes or requests deletion.</li>
                  <li><strong>Administrative Security Audit Logs:</strong> Retained as necessary for security monitoring, fraud prevention, and system integrity.</li>
                  <li><strong>Local Session Data:</strong> Maintained temporarily in your browser during your active session and cleared automatically when you close your browser tab.</li>
                </ul>
              </div>
            </section>

            {/* Section 10 */}
            <section id="security-measures" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                10. Data Security & Storage Architecture
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  We use administrative, technical, and physical safeguards designed to protect personal information from unauthorized access, alteration, disclosure, or destruction:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                  <li><strong>Transmission Safeguards:</strong> Communications with our website are conducted over HTTPS connections designed to protect data during transmission.</li>
                  <li><strong>Access Controls:</strong> Access to inquiry records is restricted to authorized personnel who require access for legitimate operational purposes.</li>
                  <li><strong>Administrative Protection:</strong> Administrative access interfaces utilize authentication mechanisms with secure HTTP-only cookie safeguards.</li>
                  <li><strong>Payment & Financial Instruments:</strong> We do not collect or store credit card numbers, bank account routing numbers, or Social Security Numbers on our public inquiry forms.</li>
                </ul>
                <p className="text-xs text-slate-500">
                  While we implement reasonable safeguards to protect personal information, no internet transmission or electronic storage method is completely secure.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section id="communications" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                11. Communications & Email Preferences
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  Depending on your usage of Rentorce, you may receive the following types of communications:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                  <li><strong>Transactional Communications:</strong> Email notifications confirming your apartment tour appointment or responses to customer service inquiries. You cannot opt out of critical transactional messages relating directly to your active inquiries.</li>
                  <li><strong>Rental Alerts & Marketing Newsletters:</strong> Updates about newly listed apartments matching your criteria or rental market tips. You may opt out at any time by clicking the &quot;Unsubscribe&quot; link present in any marketing email or by sending a request to <a href="mailto:support@rentorce.com" className="text-blue-600 underline">support@rentorce.com</a>.</li>
                </ul>
              </div>
            </section>

            {/* Section 12 */}
            <section id="your-privacy-rights" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                12. Your Privacy Rights & Choices
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  Rentorce provides users with transparency and control over their submitted personal information. Depending on applicable law, you may have the right to:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                  <li><strong>Request Access:</strong> Receive confirmation of whether we process your personal data and obtain a copy of that data.</li>
                  <li><strong>Request Correction:</strong> Request updates or corrections to incomplete or inaccurate housing inquiry data.</li>
                  <li><strong>Request Deletion:</strong> Request the deletion of your contact details and inquiry records from our active databases, subject to applicable recordkeeping exceptions.</li>
                  <li><strong>Withdraw Consent:</strong> Revoke consent to receive apartment alerts or newsletters at any time.</li>
                </ul>
                <p className="text-xs text-slate-600">
                  To exercise any of these rights, please email our support team at{" "}
                  <a href="mailto:support@rentorce.com" className="text-blue-600 font-bold underline">
                    support@rentorce.com
                  </a>{" "}
                  with the subject line &quot;Privacy Rights Request&quot;. We will verify your request and respond in accordance with applicable legal requirements.
                </p>
              </div>
            </section>

            {/* Section 13 */}
            <section id="state-privacy-rights" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                13. California & State Privacy Rights
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  If you are a California resident and applicable California privacy law applies to Rentorce, you may have certain privacy rights regarding your personal information. Similar rights may also apply to residents of other states with applicable consumer privacy legislation:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
                  <li><strong>Right to Know / Access:</strong> The right to request confirmation of whether we process your personal information and to access the specific pieces and categories of personal information collected about you, the sources of collection, the business purposes for collecting it, and the categories of third parties to whom it is disclosed.</li>
                  <li><strong>Right to Delete:</strong> The right to request the deletion of personal information collected from you, subject to certain legal exceptions.</li>
                  <li><strong>Right to Correct:</strong> The right to request the correction of inaccurate personal information that we maintain about you.</li>
                  <li><strong>Right to Opt-Out of Sale or Sharing:</strong> The right to opt out of the sale or sharing of your personal information, where applicable. As stated in this policy, Rentorce does not sell personal information to data brokers.</li>
                  <li><strong>Right to Limit Use of Sensitive Personal Information:</strong> The right to limit the use and disclosure of sensitive personal information to that which is necessary to perform services or provide goods reasonably expected by an average consumer, where applicable.</li>
                  <li><strong>Right to Non-Discrimination:</strong> The right not to receive discriminatory treatment from us for exercising any of your privacy rights.</li>
                </ul>
              </div>
            </section>

            {/* Section 14 */}
            <section id="california-notice" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                14. Notice for California Residents (Shine the Light)
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  Under California Civil Code Section 1798.83 (the &quot;Shine the Light&quot; law), California residents who provide personal information in obtaining products or services for personal, family, or household use may request information about customer information we shared, if any, with other businesses for their own direct marketing uses.
                </p>
                <p className="text-xs text-slate-600">
                  Rentorce does not disclose personal information to third parties for their own direct marketing purposes without your consent.
                </p>
                <p className="text-xs text-slate-600">
                  <strong>Do Not Track (DNT) Signals:</strong> Standard web browsers offer a &quot;Do Not Track&quot; header setting. Currently, because no universal industry standard exists on how DNT signals should be interpreted, our systems do not respond to DNT browser signals.
                </p>
              </div>
            </section>

            {/* Section 15 */}
            <section id="children-privacy" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                15. Children&apos;s Privacy
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 space-y-2">
                    <p className="font-bold text-sm">Protection of Children&apos;s Privacy</p>
                    <p>
                      Rentorce is not intended for or directed to children under the age of 13. We do not knowingly collect or solicit personal information from children under 13 years of age.
                    </p>
                    <p>
                      If we learn that we have collected personal information from a child under 13, we will take reasonable steps to delete that information from our systems promptly. If you believe that a child under 13 has provided personal information to Rentorce, please contact us at{" "}
                      <a href="mailto:support@rentorce.com" className="font-semibold underline">
                        support@rentorce.com
                      </a>.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 16 */}
            <section id="third-party-links" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                16. Third-Party Websites & External Content
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  Our website may contain hyperlinks to third-party websites, including external property management portals, application portals, local utility providers, and maps services.
                </p>
                <p className="text-xs text-slate-600">
                  Rentorce exercises no control over the privacy practices or content of third-party platforms. We encourage you to review the privacy statements of any external websites you visit.
                </p>
              </div>
            </section>

            {/* Section 17 */}
            <section id="equal-housing" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                17. Equal Housing Opportunity
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  Rentorce supports equal housing opportunity. We conduct our business in accordance with the principle that all prospective renters should have equal access to rental housing opportunities.
                </p>
                <p className="text-xs text-slate-600">
                  We do not unlawfully discriminate against any prospective tenant on the basis of race, color, religion, sex, national origin, familial status, disability, or other characteristics protected by applicable federal, state, or local laws. Our qualification tools are designed to assist prospective tenants in finding available rental units based on their self-stated preferences, budget, and housing requirements.
                </p>
              </div>
            </section>

            {/* Section 18 */}
            <section id="policy-updates" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                18. Changes to This Privacy Policy
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  We may periodically revise this Privacy Policy to reflect modifications in our data practices, additions of new website functionality, or updates in legal requirements.
                </p>
                <p className="text-xs text-slate-600">
                  Any changes become effective upon posting the updated policy to this URL, with an updated &quot;Last Updated&quot; date indicated at the top of this document. We encourage you to review this page periodically to remain informed about how we handle your information.
                </p>
              </div>
            </section>

            {/* Section 19 */}
            <section id="contact-us" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                19. Contact Us & Privacy Requests
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-4">
                <p>
                  If you have questions, comments, or requests regarding this Privacy Policy or wish to exercise your data protection rights, please contact our leasing and privacy team:
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
                  <h3 className="font-bold text-slate-900 text-base">Rentorce Platform Inc.</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 pt-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Email: <a href="mailto:support@rentorce.com" className="font-semibold text-blue-600 hover:underline">support@rentorce.com</a></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Support Hotline: <a href="tel:18004927836" className="font-semibold text-slate-900 hover:underline">+1 (800) 492-7836</a></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Official Website: <a href="https://rentorce.com" className="font-semibold text-blue-600 hover:underline">https://rentorce.com</a></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Business Hours: Mon–Fri, 9:00 AM – 6:00 PM EST</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
