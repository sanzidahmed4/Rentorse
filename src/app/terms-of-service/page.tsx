import { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  Scale,
  AlertTriangle,
  Building2,
  CalendarCheck,
  Ban,
  Mail,
  Phone,
  ArrowLeft,
  ChevronRight,
  Globe,
  Clock,
  CheckCircle2,
  HelpCircle,
  Briefcase,
} from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://rentorce.com";
const LAST_UPDATED = "September 16, 2026";

export const metadata: Metadata = {
  title: "Terms of Service | Rentorce",
  description:
    "Read the Terms of Service for Rentorce. Understand your rights, responsibilities, and our apartment matching platform guidelines.",
  alternates: {
    canonical: `${BASE_URL}/terms-of-service`,
  },
  openGraph: {
    title: "Terms of Service | Rentorce",
    description:
      "Read the Terms of Service for Rentorce. Understand your rights, responsibilities, and our apartment matching platform guidelines.",
    url: `${BASE_URL}/terms-of-service`,
    siteName: "Rentorce",
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Rentorce",
    description:
      "Read the Terms of Service for Rentorce. Understand your rights, responsibilities, and our apartment matching platform guidelines.",
    images: [`${BASE_URL}/og-image.png`],
  },
};

const TOC_SECTIONS = [
  { id: "acceptance-of-terms", title: "1. Acceptance of Terms" },
  { id: "platform-role", title: "2. Platform Overview & Marketplace Role" },
  { id: "eligibility", title: "3. User Eligibility & Representations" },
  { id: "matching-disclaimer", title: "4. Pre-Qualification & Matching Disclaimer" },
  { id: "tour-requests", title: "5. Tour Scheduling & Inquiries" },
  { id: "listing-accuracy", title: "6. Listing Accuracy & Third-Party Content" },
  { id: "user-conduct", title: "7. User Conduct & Prohibited Activities" },
  { id: "intellectual-property", title: "8. Intellectual Property Rights" },
  { id: "third-party-services", title: "9. Third-Party Websites & Integrations" },
  { id: "electronic-communications", title: "10. Electronic Communications & Notices" },
  { id: "disclaimer-warranties", title: "11. Disclaimer of Warranties" },
  { id: "limitation-liability", title: "12. Limitation of Liability" },
  { id: "indemnification", title: "13. Indemnification" },
  { id: "equal-housing", title: "14. Equal Housing Opportunity" },
  { id: "dispute-resolution", title: "15. Dispute Resolution & Informal Discussion" },
  { id: "governing-law", title: "16. Governing Law & Jurisdiction" },
  { id: "severability", title: "17. Severability & Entire Agreement" },
  { id: "modifications", title: "18. Modifications to Terms" },
  { id: "contact-us", title: "19. Contact Information" },
];

export default function TermsOfServicePage() {
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
            <span className="text-white font-medium">Terms of Service</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold tracking-wide mb-4 border border-blue-400/30">
            <Scale className="w-3.5 h-3.5 text-blue-400" /> User Agreement & Platform Rules
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
            Rentorce Terms of Service
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
            These Terms of Service govern your access to and use of Rentorce Platform Inc.&apos;s
            website, apartment matching tools, inquiry questionnaires, and related services.
            Please review them carefully before using our platform.
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
        {/* Core Principles Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm mb-1">Marketplace Platform</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rentorce connects prospective tenants with property managers and landlords. We do not own, manage, or lease properties.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm mb-1">Independent Verification</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                All lease terms, rent rates, security deposits, and amenities should be independently verified directly with property management.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm mb-1">Free for Renters</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Searching, matching, and submitting apartment inquiries through Rentorce is completely free of platform brokerage fees for renters.
              </p>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar TOC + Main Terms Text */}
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
                Questions Regarding Terms?
              </span>
              <p className="text-xs text-slate-600 mb-2">
                Our support team is available to help answer questions.
              </p>
              <a
                href="mailto:support@rentorce.com"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                <Mail className="w-3.5 h-3.5" /> support@rentorce.com
              </a>
            </div>
          </aside>

          {/* Terms Text Body */}
          <main className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-10 order-1 lg:order-2">
            {/* Section 1 */}
            <section id="acceptance-of-terms" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                1. Acceptance of Terms
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you
                  (&quot;User&quot;, &quot;you&quot;, or &quot;your&quot;) and <strong>Rentorce Platform Inc.</strong> (&quot;Rentorce&quot;,
                  &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), regarding your access to and use of the website located at{" "}
                  <a href="https://rentorce.com" className="text-blue-600 hover:underline font-medium">
                    https://rentorce.com
                  </a>{" "}
                  and any associated applications, features, content, or services offered by Rentorce.
                </p>
                <p>
                  By accessing, browsing, or using our website, submitting an inquiry, completing the apartment matching
                  funnel, or booking an apartment tour, you agree that you have read, understood, and accept these Terms
                  and our <Link href="/privacy-policy" className="text-blue-600 underline">Privacy Policy</Link>.
                  If you do not agree with any part of these Terms, you must immediately discontinue using our services.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="platform-role" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                2. Platform Overview & Marketplace Role
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  Rentorce provides an online venue and technological platform that allows prospective renters to discover
                  residential rental listings, submit pre-qualification information, and request apartment tours with
                  independent property owners, property managers, leasing agents, or housing operators (&quot;Property Partners&quot;).
                </p>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-700">
                  <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" /> Important Clarification of Rentorce&apos;s Role:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li>Rentorce is an independent apartment discovery and matching platform. Rentorce is not a real estate broker, landlord, property owner, or property management agency for third-party properties.</li>
                    <li>Rentorce does not own, inspect, manage, maintain, or lease any residential rental properties listed on the website.</li>
                    <li>Rentorce is not a party to any rental agreement, residential lease, sublease, or property transaction entered into between you and any property manager or landlord.</li>
                    <li>Any contractual relationship regarding an apartment lease is strictly between you and the respective property owner or authorized property manager.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="eligibility" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                3. User Eligibility & Representations
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>By using Rentorce, you represent and warrant that:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                  <li>You have the full legal power and capacity to enter into these Terms and comply with all applicable local, state, and federal laws.</li>
                  <li>All information you submit through our inquiry forms, Apartment Finder Funnel, or tour booking modal (including name, email, phone number, budget, household size, and pet details) is accurate, truthful, and current.</li>
                  <li>You will not submit inquiries or book tours on behalf of fictitious persons or without the consent of the individuals whose contact details you provide.</li>
                  <li>You will use the platform solely for lawful residential housing search purposes and not for any commercial, automated, or competitive intelligence gathering.</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section id="matching-disclaimer" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                4. Pre-Qualification & Matching Disclaimer
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  Rentorce provides an interactive questionnaire (&quot;Apartment Finder Funnel&quot;) designed to match
                  prospective renters with rental opportunities based on user-stated parameters such as budget, location,
                  bedroom requirements, and self-reported credit score tiers.
                </p>
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-950">
                  <p className="font-bold text-sm flex items-center gap-1.5 text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Non-Binding Estimates:
                  </p>
                  <p>
                    Matching results, pre-qualification summaries, and pricing indicators generated by Rentorce are purely
                    informational estimates based on self-reported user criteria. They do <strong>not</strong> constitute:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    <li>A formal credit decision, official background check, or formal consumer report under the Fair Credit Reporting Act (FCRA).</li>
                    <li>A guarantee that any specific property manager, landlord, or housing provider will approve your rental application.</li>
                    <li>A binding commitment by any landlord to lease a unit at a specific monthly rent rate or security deposit amount.</li>
                  </ul>
                  <p className="text-slate-700">
                    Final application approval, tenant screening criteria, background verifications, and lease terms remain
                    at the sole discretion of individual property managers and landlords.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="tour-requests" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                5. Tour Scheduling & Inquiries
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  When you submit an appointment request for an in-person or virtual apartment tour via our booking modal:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                  <li>Your submitted request is transmitted to the relevant property leasing office or landlord to coordinate scheduling.</li>
                  <li>Submitting a tour request does not guarantee that the selected date or time slot is available, nor does it establish a reservation or hold on the apartment unit.</li>
                  <li>Tours are subject to final confirmation and cancellation by the respective property manager, leasing staff, or prospective renter.</li>
                  <li>Rentorce is not liable for missed appointments, rescheduled walkthroughs, or the conduct of property management representatives during tours.</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section id="listing-accuracy" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                6. Listing Accuracy & Third-Party Content
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  Rentorce strives to maintain high standards of listing quality and accuracy. However, rental property
                  information—including monthly rent, unit availability, square footage, security deposits, pet fees,
                  utility responsibilities, amenities, and concession offers—is provided by property managers or compiled
                  from third-party sources.
                </p>
                <p className="text-xs text-slate-600">
                  All property listings are subject to prior lease, withdrawal, change in price, or typographical errors
                  without prior notice. Rentorce does not guarantee the availability, condition, safety, or legal suitability
                  of any apartment listed on our platform. Prospective renters are advised to physically inspect properties
                  and independently verify all details and lease provisions prior to signing any agreement or submitting deposits.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="user-conduct" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                7. User Conduct & Prohibited Activities
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>When using Rentorce, you agree not to engage in any of the following prohibited actions:</p>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-start gap-2.5">
                    <Ban className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong>Automated Access & Scraping:</strong> Using bots, spiders, crawlers, scrapers, or other automated tools to extract data, listings, text, or images from the website without our express written permission.
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-start gap-2.5">
                    <Ban className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong>Fraudulent Submissions:</strong> Submitting false, deceptive, or misleading inquiry data, fabricated contact information, or impersonating any individual or entity.
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-start gap-2.5">
                    <Ban className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong>Security Violations:</strong> Attempting to probe, scan, or breach system security, accessing non-public areas, admin interfaces, or databases without authorization, or introducing viruses, worms, or harmful code.
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-start gap-2.5">
                    <Ban className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong>Interference & Overburdening:</strong> Taking any action that imposes an unreasonable or disproportionately large load on our server infrastructure, or attempting to interfere with the proper functioning of the site.
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section id="intellectual-property" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                8. Intellectual Property Rights
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  All content, branding, visual designs, logos, software, text, graphics, icons, interactive funnel tools,
                  and compilation of materials available on Rentorce are the property of <strong>Rentorce Platform Inc.</strong>{" "}
                  or its licensors, protected by United States and international copyright, trademark, and intellectual property laws.
                </p>
                <p className="text-xs text-slate-600">
                  Subject to your compliance with these Terms, Rentorce grants you a limited, non-exclusive, non-transferable,
                  and revocable license to access and view content on the website solely for your personal, non-commercial use
                  in searching for residential rental apartments.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section id="third-party-services" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                9. Third-Party Websites & Integrations
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  The website may display links to third-party websites, applications, or resources (such as external property
                  management screening portals, online payment processors, or mapping platforms).
                </p>
                <p className="text-xs text-slate-600">
                  Rentorce has no control over, does not endorse, and assumes no responsibility for the content, privacy
                  policies, or practices of any third-party websites. You access third-party services at your own risk and
                  should review the terms and privacy practices of those third-party providers.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section id="electronic-communications" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                10. Electronic Communications & Notices
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  By submitting your email address and telephone number on Rentorce, you consent to receive electronic
                  communications from us and our property partners relating to your housing inquiries, tour confirmations,
                  and customer support requests.
                </p>
                <p className="text-xs text-slate-600">
                  If you subscribe to our newsletter or rental alerts, you may receive periodic updates regarding newly
                  available apartments. You may opt out of marketing communications at any time by utilizing the unsubscribe
                  link in any email or by contacting <a href="mailto:support@rentorce.com" className="text-blue-600 underline">support@rentorce.com</a>.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section id="disclaimer-warranties" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                11. Disclaimer of Warranties
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p className="uppercase text-xs font-semibold tracking-wider text-slate-500">
                  Notice Regarding Warranties:
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE RENTORCE PLATFORM, CONTENT, AND ALL SERVICES ARE
                  PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER
                  EXPRESS OR IMPLIED.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  RENTORCE EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES
                  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, ACCURACY, AND NON-INFRINGEMENT. WE DO NOT
                  WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, TIMELY, ERROR-FREE, SECURE, OR VIRUS-FREE, NOR DO WE
                  MAKE ANY WARRANTY AS TO THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICE OR THE AVAILABILITY
                  OR CONDITION OF ANY APARTMENT LISTED ON THE SITE.
                </p>
              </div>
            </section>

            {/* Section 12 */}
            <section id="limitation-liability" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                12. Limitation of Liability
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, IN NO EVENT SHALL RENTORCE PLATFORM INC., ITS
                  DIRECTORS, OFFICERS, EMPLOYEES, AFFILIATES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                  SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS,
                  DATA, GOODWILL, HOUSING OPPORTUNITIES, OR OTHER INTANGIBLE LOSSES ARISING OUT OF OR IN CONNECTION WITH
                  YOUR USE OF, OR INABILITY TO USE, THE PLATFORM OR SERVICES.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  IN NO EVENT SHALL RENTORCE&apos;S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATING TO THESE TERMS
                  OR THE USE OF THE SERVICE EXCEED ONE HUNDRED UNITED STATES DOLLARS ($100.00 USD).
                </p>
                <p className="text-xs text-slate-500">
                  Some jurisdictions do not allow the exclusion or limitation of certain warranties or liability for
                  consequential damages, so parts of the above limitations may not apply to you.
                </p>
              </div>
            </section>

            {/* Section 13 */}
            <section id="indemnification" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                13. Indemnification
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  You agree to defend, indemnify, and hold harmless Rentorce Platform Inc., its officers, directors,
                  employees, and agents, from and against any claims, liabilities, damages, losses, and expenses,
                  including reasonable legal and accounting fees, arising out of or in any way connected with:
                  (a) your violation of these Terms; (b) your misuse of the platform; (c) your violation of any
                  third-party right, including intellectual property or privacy rights; or (d) any dispute between
                  you and any property manager, landlord, or third party.
                </p>
              </div>
            </section>

            {/* Section 14 */}
            <section id="equal-housing" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                14. Equal Housing Opportunity
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  Rentorce firmly supports equal housing opportunity. We conduct our business in accordance with the
                  principle that all prospective renters should have equal access to rental housing opportunities.
                </p>
                <p className="text-xs text-slate-600">
                  We do not unlawfully discriminate against any individual on the basis of race, color, religion, sex,
                  national origin, familial status, disability, marital status, sexual orientation, gender identity, or
                  any other characteristic protected under federal, state, or local laws.
                </p>
              </div>
            </section>

            {/* Section 15 */}
            <section id="dispute-resolution" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                15. Dispute Resolution & Informal Discussion
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  In the event of any dispute, claim, or controversy arising out of or relating to these Terms or your use
                  of Rentorce, you and Rentorce agree to first attempt in good faith to resolve the matter informally
                  before initiating any formal legal proceeding.
                </p>
                <p className="text-xs text-slate-600">
                  To initiate informal resolution, you must send a written notice of dispute detailing the nature of the
                  claim to <a href="mailto:support@rentorce.com" className="text-blue-600 underline font-medium">support@rentorce.com</a>.
                  Both parties will make reasonable efforts to resolve the dispute through direct communication within
                  thirty (30) days of receiving such notice.
                </p>
              </div>
            </section>

            {/* Section 16 */}
            <section id="governing-law" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                16. Governing Law & Jurisdiction
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  These Terms and any dispute arising out of or related to your use of Rentorce shall be governed by and
                  construed in accordance with the laws of the United States and the applicable state laws governing Rentorce
                  Platform Inc., without giving effect to any principles of conflicts of law.
                </p>
              </div>
            </section>

            {/* Section 17 */}
            <section id="severability" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                17. Severability & Entire Agreement
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  If any provision of these Terms is found to be unlawful, void, or for any reason unenforceable, then that
                  provision shall be deemed severable from these Terms and shall not affect the validity and enforceability
                  of any remaining provisions.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  These Terms, together with our <Link href="/privacy-policy" className="text-blue-600 underline">Privacy Policy</Link>,
                  constitute the entire agreement between you and Rentorce Platform Inc. regarding your use of the website and services.
                </p>
              </div>
            </section>

            {/* Section 18 */}
            <section id="modifications" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                18. Modifications to Terms
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  We reserve the right to revise or modify these Terms at any time to reflect updates in our platform
                  features, business operations, or legal obligations.
                </p>
                <p className="text-xs text-slate-600">
                  Any changes will become effective upon posting the revised Terms to this page with an updated &quot;Last Updated&quot;
                  date. Your continued use of Rentorce following any modification constitutes your acceptance of the revised Terms.
                </p>
              </div>
            </section>

            {/* Section 19 */}
            <section id="contact-us" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                19. Contact Information
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-4">
                <p>
                  If you have questions, inquiries, or comments regarding these Terms of Service, please contact our team:
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
