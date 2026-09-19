import { Metadata } from "next";
import Link from "next/link";
import {
  Home,
  ShieldCheck,
  Scale,
  Users,
  HeartHandshake,
  AlertCircle,
  Mail,
  Phone,
  ArrowLeft,
  ChevronRight,
  Globe,
  Clock,
  CheckCircle2,
  FileText,
  Accessibility,
  Baby,
} from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://rentorce.com";
const LAST_UPDATED = "September 16, 2026";

export const metadata: Metadata = {
  title: "Equal Housing Opportunity | Rentorce",
  description:
    "Rentorce is dedicated to the principles of equal housing opportunity and the Federal Fair Housing Act. Learn about protected classes and our non-discrimination policy.",
  alternates: {
    canonical: `${BASE_URL}/equal-housing-opportunity`,
  },
  openGraph: {
    title: "Equal Housing Opportunity | Rentorce",
    description:
      "Rentorce is dedicated to the principles of equal housing opportunity and the Federal Fair Housing Act. Learn about protected classes and our non-discrimination policy.",
    url: `${BASE_URL}/equal-housing-opportunity`,
    siteName: "Rentorce",
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Equal Housing Opportunity | Rentorce",
    description:
      "Rentorce is dedicated to the principles of equal housing opportunity and the Federal Fair Housing Act. Learn about protected classes and our non-discrimination policy.",
    images: [`${BASE_URL}/og-image.png`],
  },
};

const TOC_SECTIONS = [
  { id: "pledge-statement", title: "1. Equal Housing Opportunity Pledge" },
  { id: "fair-housing-act", title: "2. The Federal Fair Housing Act & Protected Classes" },
  { id: "disability-accommodations", title: "3. Disability & Reasonable Accommodations" },
  { id: "familial-status", title: "4. Familial Status Protections" },
  { id: "manager-responsibilities", title: "5. Landlord & Property Manager Responsibilities" },
  { id: "platform-neutrality", title: "6. Platform Matching Tool Neutrality" },
  { id: "state-local-protections", title: "7. State & Municipal Protections (Source of Income)" },
  { id: "report-discrimination", title: "8. How to Report Housing Discrimination (HUD)" },
  { id: "contact-coordinator", title: "9. Rentorce Fair Housing Contact" },
];

export default function EqualHousingOpportunityPage() {
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
            <span className="text-white font-medium">Equal Housing Opportunity</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold tracking-wide mb-4 border border-blue-400/30">
            <Home className="w-3.5 h-3.5 text-blue-400" /> Fair Housing & Civil Rights Commitment
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
            Equal Housing Opportunity Policy
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
            Rentorce Platform Inc. is pledged to the letter and spirit of United States policy
            for the achievement of equal housing opportunity throughout the Nation. We encourage
            and support an affirmative advertising and marketing program in which there are no
            barriers to obtaining housing because of race, color, religion, sex, handicap, familial
            status, or national origin.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" /> Effective Date: <strong className="text-white">{LAST_UPDATED}</strong>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>Entity: <strong className="text-white">Rentorce Platform Inc.</strong></span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>Statute: <strong className="text-white">Title VIII of the Civil Rights Act of 1968</strong></span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Core Principles Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm mb-1">Universal Non-Discrimination</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                All rental properties, match results, and inquiries on Rentorce must comply with federal, state, and local fair housing laws.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm mb-1">Reasonable Accommodations</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full support for individuals with disabilities, including assistance animals and service animals without unlawful pet restrictions.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm mb-1">Zero Tolerance for Bias</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Discriminatory listings, restrictive advertising terms, or discriminatory conduct will result in immediate removal from our platform.
              </p>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar TOC + Main Content */}
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
                HUD Discrimination Hotline
              </span>
              <p className="text-xs text-slate-600 mb-2">
                Have you experienced housing discrimination?
              </p>
              <a
                href="tel:18006699777"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                <Phone className="w-3.5 h-3.5" /> 1-800-669-9777 (HUD)
              </a>
            </div>
          </aside>

          {/* Legal Text Body */}
          <main className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-10 order-1 lg:order-2">
            {/* Section 1 */}
            <section id="pledge-statement" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                1. Equal Housing Opportunity Pledge
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  <strong>Rentorce Platform Inc.</strong> (&quot;Rentorce&quot;) is fully committed to the principle that
                  every individual has the right to live where they choose, free from unlawful discrimination.
                </p>
                <p>
                  As an apartment rental discovery and tenant matching platform operating across the United States,
                  we conduct our operations in full alignment with the <strong>Fair Housing Act (Title VIII of the Civil Rights Act of 1968, as amended)</strong>.
                  We require all property owners, landlords, leasing managers, real estate agents, and users participating
                  on our platform to adhere strictly to all federal, state, and local fair housing laws.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="fair-housing-act" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                2. The Federal Fair Housing Act & Protected Classes
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-4">
                <p>
                  Under the Federal Fair Housing Act, it is illegal for any housing provider, landlord, property manager,
                  or advertising entity to discriminate against any prospective renter or homebuyer based on:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="block text-slate-900 font-bold mb-1">1. Race or Color</strong>
                    <span className="text-slate-600">Discrimination based on racial characteristics, skin tone, or ethnic traits.</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="block text-slate-900 font-bold mb-1">2. National Origin</strong>
                    <span className="text-slate-600">Discrimination based on an individual&apos;s country of origin, ancestry, or linguistic accent.</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="block text-slate-900 font-bold mb-1">3. Religion & Creed</strong>
                    <span className="text-slate-600">Discrimination based on religious practice, faith affiliation, or non-religious beliefs.</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="block text-slate-900 font-bold mb-1">4. Sex & Gender Identity</strong>
                    <span className="text-slate-600">Including biological sex, sexual orientation, gender identity, gender expression, and pregnancy.</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="block text-slate-900 font-bold mb-1">5. Familial Status</strong>
                    <span className="text-slate-600">Presence of children under 18, pregnant individuals, or persons securing legal custody of children.</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="block text-slate-900 font-bold mb-1">6. Disability / Handicap</strong>
                    <span className="text-slate-600">Physical or mental impairments that substantially limit one or more major life activities.</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600">
                  Under the Fair Housing Act, prohibited discriminatory practices include refusing to rent or negotiate for
                  housing, imposing different rental terms or security deposit requirements, providing unequal facilities or
                  services, falsely claiming that a dwelling is not available for inspection or rental, or publishing any notice,
                  statement, or advertisement indicating any preference, limitation, or discrimination based on a protected class.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="disability-accommodations" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                3. Disability & Reasonable Accommodations
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  Rentorce is committed to accessible housing for individuals with disabilities. Under fair housing laws:
                </p>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Accessibility className="w-4 h-4 text-blue-600" /> Reasonable Accommodations:
                    </p>
                    <p className="text-slate-600">
                      Housing providers must make reasonable accommodations in rules, policies, practices, or services when
                      such accommodations may be necessary to afford a person with a disability equal opportunity to use and enjoy a dwelling.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4 text-blue-600" /> Assistance & Service Animals:
                    </p>
                    <p className="text-slate-600">
                      Assistance animals (including trained service dogs and emotional support animals) are <strong>not</strong> considered pets
                      under the Fair Housing Act. Housing providers must reasonably accommodate assistance animals, even in buildings
                      with &quot;no pet&quot; policies, and may not charge pet deposits or pet rent for verified assistance animals.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="familial-status" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                4. Familial Status Protections
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  Familial status protections ensure that families with children have equal access to rental housing opportunities:
                </p>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-600">
                  <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Baby className="w-4 h-4 text-blue-600" /> Protection for Families with Children:
                  </p>
                  <p>
                    Unless a property qualifies legally as certified &quot;Housing for Older Persons&quot; (under HUD 55+ or 62+ statutory exemptions),
                    housing providers may not:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li>Refuse to rent to families with children under the age of 18.</li>
                    <li>Impose unreasonably restrictive occupancy limits designed to exclude children.</li>
                    <li>Segregate families with children to specific floors, buildings, or sections of a property.</li>
                    <li>Charge higher monthly rent, increased security deposits, or extra fees because children reside in the unit.</li>
                    <li>Enforce discriminatory pool, patio, or courtyard rules that unfairly target minor children.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="manager-responsibilities" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                5. Landlord & Property Manager Responsibilities
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  Every property owner, manager, broker, and leasing agent who markets apartments on Rentorce agrees as a condition
                  of participation to strictly observe all fair housing standards:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                  <li><strong>Advertising Standards:</strong> All listing descriptions, images, and property headlines must be non-discriminatory and describe the property, not the desired tenant demographics. Phrases expressing preference or limitation (such as &quot;ideal for young professionals&quot;, &quot;singles only&quot;, or &quot;no children&quot;) are prohibited.</li>
                  <li><strong>Uniform Qualification Criteria:</strong> Screening criteria (such as income-to-rent ratios, credit thresholds, and background checks) must be applied objectively, consistently, and without regard to protected characteristics.</li>
                  <li><strong>Equal Availability:</strong> Units must be shown, offered, and leased to all qualified applicants on identical terms and timelines.</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section id="platform-neutrality" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                6. Platform Matching Tool Neutrality
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  Rentorce&apos;s interactive Apartment Finder Funnel and algorithm-driven discovery tools are designed to provide
                  objective, criteria-based apartment recommendations:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                  <li>Recommendations are generated solely from user-submitted preferences regarding target location (city, neighborhood, ZIP), target budget boundaries, desired bedroom and bathroom layouts, and building pet policy compatibility.</li>
                  <li>Our search algorithms do not steer, filter, prioritize, or hide listings based on race, ethnicity, religion, familial status, or any other protected characteristic.</li>
                  <li>All prospective renters receive equal access to all active listings meeting their self-stated housing criteria.</li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section id="state-local-protections" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                7. State & Municipal Protections
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  In addition to federal protections, many states, counties, and cities have enacted broader fair housing legislation
                  that protects additional classes, including:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li><strong>Source of Income:</strong> Protection for individuals utilizing Housing Choice Vouchers (Section 8), veterans benefits, disability assistance, or other lawful public subsidies.</li>
                  <li><strong>Marital Status:</strong> Protection for single, divorced, or unmarried cohabitants.</li>
                  <li><strong>Age & Military / Veteran Status:</strong> Protection against discrimination based on age or armed forces service.</li>
                </ul>
                <p className="text-xs text-slate-600">
                  Rentorce respects and supports all state and local fair housing protections governing residential leases in each respective jurisdiction.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="report-discrimination" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                8. How to Report Housing Discrimination
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-4">
                <p>
                  If you believe you have experienced housing discrimination during an apartment search, tour walkthrough,
                  or application process, you have the right under federal law to file an official complaint:
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Scale className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        U.S. Department of Housing and Urban Development (HUD)
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Office of Fair Housing and Equal Opportunity (FHEO)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 pt-1">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>HUD Toll-Free Hotline: <a href="tel:18006699777" className="font-bold text-slate-900 hover:underline">1-800-669-9777</a></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>TTY Hotline: <a href="tel:18009279275" className="font-bold text-slate-900 hover:underline">1-800-927-9275</a></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Online Filing: <a href="https://www.hud.gov/fairhousing" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">hud.gov/fairhousing</a></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Time Limit: Within 1 year of the discriminatory act</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section id="contact-coordinator" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pb-2 border-b border-slate-100">
                9. Rentorce Fair Housing Contact
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-4">
                <p>
                  If you encounter any apartment listing on Rentorce that appears to contain discriminatory preferences,
                  or if you have concerns regarding fair housing practices on our website, please notify us immediately.
                  We investigate all reports and take prompt corrective action, up to and including listing removal and account termination.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
                  <h3 className="font-bold text-slate-900 text-base">Rentorce Platform Inc.</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 pt-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Email: <a href="mailto:support@rentorce.com" className="font-semibold text-blue-600 hover:underline">support@rentorce.com</a></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Support Portal: <a href="https://rentorce.com/find-apartment" className="font-semibold text-blue-600 hover:underline">Apartment Finder Desk</a></span>
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
