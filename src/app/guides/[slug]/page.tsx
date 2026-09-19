import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Calendar, CheckCircle } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://rentorce.com";

interface GuideData {
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  readTime: string;
  publishDate: string;
  content: string;
  relatedSlugs: string[];
}

const GUIDES: Record<string, GuideData> = {
  "how-rentorce-works": {
    title: "How Rentorce Works: Our Apartment Search & Matching Process",
    metaTitle: "How Rentorce Works: Apartment Search & Matching Process | Rentorce",
    metaDescription: "Learn how Rentorce works and how our apartment search process uses location, budget, household needs, apartment preferences, and other requirements to help renters find relevant properties.",
    category: "How It Works",
    readTime: "7 min read",
    publishDate: "2025-01-20",
    relatedSlugs: ["how-to-rent-apartment-usa", "apartment-hunting-checklist", "1-bedroom-vs-2-bedroom-apartment"],
    content: `
## Introduction

Finding the right apartment is not always as simple as searching for a location and choosing the first available listing.

Your ideal apartment may depend on several factors—where you want to live, how much you want to spend, who will be living with you, whether you have pets, what apartment features you need, and other personal preferences.

At Rentorce, we use a structured apartment search and matching process to understand these requirements before presenting available properties.

Instead of relying only on a location or price search, our apartment finder collects information about your housing needs and creates a more detailed renter profile. This allows you to explore properties based on a broader set of requirements.

Whether you arrive at Rentorce through Google, Facebook, social media, or another source, you can begin your apartment search directly from our platform.

---

## Two Ways to Start Your Apartment Search

Rentorce gives you multiple ways to begin your search.

You can start through:
- [Find Your Apartment](/find-apartment)
- [Start Apartment Finder](/find-apartment)
- [Take 2 Min Quiz](/find-apartment)
- The search box on the Rentorce dashboard

There are two primary ways to enter the process.

### Option 1: Start With Your ZIP Code or Location

If you already know where you want to live, you can begin by entering your ZIP code, city, area, or location in the search box.

Your selected location becomes part of your search from the beginning.

You then continue through the apartment finder and provide the remaining information about your housing requirements.

Because your location has already been provided, you do not need to enter it again at the end of the process.

### Option 2: Start With the Apartment Finder

If you would rather begin by describing the type of apartment you need, you can start directly through [Find Your Apartment](/find-apartment), Start Apartment Finder, or Take 2 Min Quiz.

In this flow, Rentorce first collects information about you and your housing requirements. Your desired location is then provided as part of the search process.

Both paths lead to the same objective: creating a structured search profile that can be used to present available properties relevant to the information you provide.

---

## Step 1: Tell Us About Yourself

The first part of the apartment finder collects basic information about you.

You may be asked to provide:
- **Full Name**: Connects your search with your request
- **Phone Number**: For text and voice tour scheduling
- **Email Address**: For instant match notifications and property details

This information connects your apartment search with your request and provides the contact information needed for communication if you later request information or a property tour.

---

## Step 2: Confirm Your U.S. Residency or Relocation Status

Next, Rentorce asks about your current status in relation to the United States.

This may include whether you are:
- Currently residing in the United States
- Relocating to the United States
- Traveling or temporarily visiting
- In another relocation-related situation

This information provides additional context about your apartment search and housing situation. For renters new to the country, check our guide on [How to Rent an Apartment in the USA](/guides/how-to-rent-apartment-usa).

---

## Step 3: Provide Your Age

The next step asks for your age.

Age information is included as part of the renter profile associated with your apartment search.

This step is completed before moving into household and apartment-specific requirements.

---

## Step 4: Tell Us About Your Household

The right apartment can depend heavily on who will be living there.

In the Household & Family Size section, you can provide information about your household.

For example, you may indicate whether:
- You are searching for an apartment by yourself
- You live with a partner
- You have children
- You are searching for housing for a larger household

This information helps make your apartment search more specific to your household requirements.

---

## Step 5: Tell Us About Your Pets

If you have pets, you can provide that information during the apartment-finding process.

Pet policies can vary from one property to another, making this an important consideration for many renters.

By including your pet information in your search profile, Rentorce can take this requirement into account when available properties are considered. Check out our [Pet-Friendly Apartments Guide](/guides/pet-friendly-apartments-guide) for more tips on pet policies.

---

## Step 6: Define Your Apartment Specifications

Now you can describe the type of apartment you are looking for.

The Apartment Specifications section allows you to provide preferences and requirements related to the property itself.

Depending on your needs, you can provide preferences such as:
- Number of bedrooms (Studio, 1BR, 2BR, 3BR)
- Number of bathrooms
- Furnished or unfurnished — compare options in our [Furnished vs. Unfurnished Apartment Guide](/guides/furnished-vs-unfurnished-apartment)
- Kitchen requirements
- Amenities (in-unit laundry, parking, fitness center, balcony)
- Other apartment features

You can identify the features that matter most to you and distinguish them from features that are not essential.

This helps create a more detailed apartment-search profile rather than relying only on location.

---

## Step 7: Set Your Monthly Rental Budget

Your monthly rental budget is another important part of your search.

Rentorce asks for your preferred monthly rental budget range so your search can be focused around the price range you provide.

Instead of browsing properties across a broad range of rental prices, your budget becomes one of the criteria used when presenting available properties.

This helps make the search more focused and easier to navigate.

---

## Step 8: Provide Your Credit Status

The final qualification-related step asks for your self-reported credit status.

This information becomes part of your renter profile and provides additional context for your apartment search.

**Important**: Your credit status is self-reported and should not be interpreted as a guaranteed approval or acceptance by a property. Individual landlords, property managers, and leasing providers may have their own qualification requirements.

---

## Step 9: Enter Your Location

If you did not begin the process by entering a ZIP code or location, you will provide your desired location during the final stage of the apartment finder.

You can provide:
- City (browse our [Apartment Location Pages](/apartments/location/new-york-ny))
- ZIP Code
- Area
- Location

Once the required information has been submitted, Rentorce uses your search profile and selected location to present available properties relevant to the criteria you provided.

### Already Entered Your ZIP Code?

If you started the process by entering your ZIP code or location from the dashboard, you do not need to enter your location again.

Your initial location is already part of your search profile.

---

## How Your Apartment Search Profile Comes Together

By completing the apartment finder, you provide Rentorce with several pieces of information about what you are looking for.

Your search profile can include:
- Location
- Monthly Budget
- Bedrooms & Bathrooms
- Apartment Features
- Furnishing Preferences
- Amenities
- Household Size
- Pet Requirements
- Self-Reported Credit Status
- Other Housing Preferences

These factors work together to create a more detailed picture of your apartment requirements.

Instead of considering location alone, Rentorce can use the information you provide to present available properties relevant to your search criteria. Review our [Ultimate Apartment Hunting Checklist](/guides/apartment-hunting-checklist) to stay organized.

---

## Review Your Available Properties & Dynamic Matching {#dynamic-matching}

After completing the apartment finder, you can view the available properties associated with your search.

Your property results are based on the information you provided, including factors such as:

**Location + Budget + Apartment Specifications + Household Requirements + Other Preferences**

You can browse the available properties and select individual listings to learn more about them.

The purpose of this process is to move from a broad apartment search toward properties that are more relevant to the requirements you entered.

---

## Explore Property Details

When you find a property that interests you, you can open its individual property page.

Depending on the listing, you may be able to review:
- Apartment type
- Bedrooms and bathrooms
- Monthly rent
- Location
- Furnishing information
- Kitchen information
- Amenities
- Property photos
- Other available property details

This gives you an opportunity to review the available information about a property before deciding whether you want to request a tour.

---

## Found an Apartment You Like? Schedule a Tour & Lease {#schedule-tour-lease}

If you find a property that interests you, you can select Schedule a Tour or Book, depending on the option available for that property.

You can then provide your:
- Preferred Date
- Preferred Time

Once submitted, your tour request is recorded for follow-up.

---

## What Happens After You Request a Tour?

Submitting a tour request begins the next stage of the process: agent follow-up and tour confirmation.

The typical communication flow is:

**Tour Request**

↓

**Email Follow-Up**

↓

**Phone/Text Follow-Up if Needed**

↓

**Direct Communication With a Leasing Agent**

↓

**Tour Confirmation**

A Rentorce leasing agent will initially attempt to contact you by email regarding your request.

If there is no response to the email, a follow-up may be made using the phone number you provided during your apartment search.

The agent can then communicate directly with you to discuss and confirm the tour details, including your preferred date and time.

---

## Why Rentorce Uses a Structured Search Process

A traditional apartment search often begins with two simple questions:
- Where do you want to live?
- How much do you want to spend?

Those are important questions, but they are only part of the picture.

Your household size, pets, preferred apartment specifications, furnishing requirements, amenities, budget, location, and other preferences can all influence the type of apartment you are looking for.

That is why Rentorce uses a structured renter-profile and matching process.

Rather than relying solely on a location search, the platform collects multiple pieces of information and uses them to build a more complete understanding of your apartment requirements.

---

## The Complete Rentorce Apartment-Finding Journey

Here is the complete process from your first visit to your tour request:

**01 — Start Your Search**
Choose Find Your Apartment, Start Apartment Finder, Take 2 Min Quiz, or use the dashboard search box.

↓

**02 — Choose Your Starting Point**
Enter your ZIP code/location first, or start directly with the apartment finder.

↓

**03 — Provide Your Personal Information**
Enter your name, phone number, and email.

↓

**04 — Confirm Your U.S. Status**
Provide your U.S. residency or relocation status.

↓

**05 — Provide Your Age**
Enter your age.

↓

**06 — Tell Us About Your Household**
Provide your household and family-size information.

↓

**07 — Tell Us About Your Pets**
Provide relevant pet information.

↓

**08 — Define Your Apartment Requirements**
Select your preferred apartment specifications, features, and amenities.

↓

**09 — Set Your Monthly Budget**
Provide your preferred rental budget range.

↓

**10 — Provide Your Credit Status**
Provide your self-reported credit status.

↓

**11 — Enter Your Location**
If you did not start with a ZIP code/location, enter your desired location.

↓

**12 — View Available Properties**
Review properties relevant to your search criteria.

↓

**13 — Explore Property Details**
Review available property information, photos, pricing, location, and amenities.

↓

**14 — Schedule a Tour**
Choose Schedule a Tour or Book and provide your preferred date and time.

↓

**15 — Connect With a Rentorce Agent**
A leasing agent follows up with you to discuss and confirm the tour request.

---

## A More Structured Way to Search for Your Next Apartment

Rentorce is built around a simple idea:

The more we understand about what you are looking for, the more focused your apartment search can become.

By combining location, budget, household information, apartment specifications, pet requirements, and other renter-provided preferences, Rentorce creates a structured search profile that can be used to present available properties relevant to the information you provide.

Whether you are already living in the United States or preparing for a relocation, you can start your apartment search by telling Rentorce what you need.

From your first search to exploring properties and requesting a tour, the process is designed to keep your apartment search organized around your requirements.

---

## Ready to Start Your Apartment Search?

Tell us what you're looking for, explore available properties, and request a tour when you find a place that interests you.

[Find Your Apartment →](/find-apartment)
`,
  },
  "how-to-rent-apartment-usa": {
    title: "How to Rent an Apartment in the USA: Complete Step-by-Step Guide",
    metaTitle: "How to Rent an Apartment in the USA (2025 Step-by-Step Guide) | Rentorce",
    metaDescription: "Learn how to rent an apartment in the USA step by step — from setting your budget and checking your credit to signing the lease and moving in. Complete 2025 guide.",
    category: "Getting Started",
    readTime: "8 min read",
    publishDate: "2025-01-15",
    relatedSlugs: ["how-rentorce-works", "apartment-hunting-checklist", "furnished-vs-unfurnished-apartment"],
    content: `
## Introduction

Renting an apartment in the United States can feel overwhelming, especially if you're doing it for the first time or relocating from another city or country. This guide walks you through every step of the process — from determining your budget to signing your lease and moving in.

---

## Step 1: Set Your Budget

The most important step before you start searching is knowing what you can afford. A common rule of thumb is the **30% rule**: your monthly rent should not exceed 30% of your gross monthly income.

For example:
- Monthly income of $4,000 → Maximum rent of $1,200/mo
- Monthly income of $5,500 → Maximum rent of $1,650/mo

Remember to account for additional costs beyond rent:
- **Security deposit**: Usually 1-2 months of rent, paid upfront
- **Utilities**: Electricity, gas, water, and internet can add $100–$250/mo
- **Renter's insurance**: Around $15–$30/mo (highly recommended)
- **Parking**: $50–$200/mo in major cities if not included

---

## Step 2: Check Your Credit Score

Most US landlords require a credit check before approving a rental application. A **good credit score** (660+) significantly increases your chances of approval.

**What landlords look for:**
- Credit score of 620 or higher (650+ preferred)
- No recent evictions or major collections
- Stable rental history

**How to check your credit score:**
- Use free services like Credit Karma, Experian, or annualcreditreport.com
- Check all three bureaus: Equifax, Experian, and TransUnion

If your credit score is low, consider offering a larger security deposit or getting a co-signer.

---

## Step 3: Determine What You Need

Before searching, clarify your requirements:

**Apartment size:**
- **Studio / 1 Bedroom**: Best for singles or couples without children
- **2 Bedrooms**: Great for couples, roommates, or a small family
- **3 Bedrooms**: Ideal for families or groups of roommates

**Key factors to consider:**
- Pet policy (if you have pets)
- Furnished vs unfurnished
- Included utilities (water, heat, electricity)
- Parking availability
- Laundry (in-unit, in-building, or laundromat)
- Proximity to work, schools, or public transit

---

## Step 4: Start Your Search

There are several ways to find apartments for rent in the USA:

**Online platforms:**
- Rentorce.com — instant matching to your budget and location
- Zillow, Realtor.com, Apartments.com
- Facebook Marketplace (for private landlord listings)
- Craigslist (use caution and verify listings)

**Tips for your search:**
- Search in your target city + ZIP code for best results
- Set up email alerts for new listings
- Be ready to act fast — good apartments in popular cities rent within 24–48 hours

---

## Step 5: Schedule and Attend Apartment Tours

Never commit to an apartment without seeing it first — either in person or via a virtual video tour.

**What to inspect during a tour:**
- Water pressure and hot water availability
- Cell phone signal and internet speed (ask the landlord)
- Condition of appliances (refrigerator, stove, dishwasher)
- Window quality and natural light
- Noise level from neighbors and street
- Storage space (closets, cabinets)
- Signs of pests or water damage
- Condition of floors, walls, and ceilings

---

## Step 6: Submit a Rental Application

Once you find a unit you like, you'll need to complete a rental application. Most landlords charge a **non-refundable application fee** of $25–$75 to cover background and credit checks.

**Typical application requirements:**
- Government-issued photo ID (passport, driver's license)
- Proof of income (pay stubs, offer letter, bank statements)
- Social Security Number (for credit check)
- Previous landlord references
- Employment verification

---

## Step 7: Understand Your Lease

Before signing, read your lease carefully. Key things to review:

- **Lease term**: Month-to-month or fixed (6 months, 1 year, 2 years)
- **Rent amount and due date**: When rent is due and grace periods
- **Late fees**: Typically $50–$150 if rent is paid after the due date
- **Pet policy**: What animals are allowed, pet deposits, monthly pet fees
- **Guest policy**: Restrictions on long-term guests
- **Maintenance responsibilities**: What the landlord handles vs. tenant
- **Early termination**: Penalty for breaking the lease before it ends
- **Renewal terms**: How rent may increase upon renewal

**Never sign a lease you don't fully understand.** Ask questions or consult a tenant rights organization in your state.

---

## Step 8: Pay Your Deposits and First Month's Rent

Once your application is approved and you've signed the lease, you'll typically need to pay:

- **First month's rent** (due at signing)
- **Security deposit** (1–2 months of rent)
- **Last month's rent** (required by some landlords)
- **Pet deposit** (if applicable)

Always pay by check or bank transfer — never cash — and keep all receipts.

---

## Step 9: Document the Apartment's Condition Before Moving In

On move-in day, walk through the apartment with your landlord and document any existing damage with photos or video. Both parties should sign a **move-in checklist** acknowledging the condition of the unit.

This protects your security deposit when you move out.

---

## Step 10: Set Up Utilities and Renter's Insurance

**Utilities to set up:**
- Electricity (contact your local utility provider)
- Gas (if applicable)
- Internet / Cable
- Water (often included in rent — confirm with landlord)

**Renter's insurance** is strongly recommended. It typically costs $15–$30/month and covers:
- Personal property theft or damage
- Liability if a guest is injured in your unit
- Additional living expenses if the unit becomes uninhabitable

---

## Final Tips for New Renters in the USA

- **Never wire money to a landlord you haven't met** — it's a common scam
- **Read your lease before signing** — don't rely on verbal promises
- **Keep copies of everything**: lease, move-in checklist, receipts
- **Know your tenant rights**: each state has different laws protecting renters
- **Build a good relationship with your landlord** — it makes lease renewals easier

Ready to start your apartment search? Use Rentorce's free instant matching tool to find verified 1BR, 2BR, and 3BR apartments in your city within minutes.
    `,
  },

  "1-bedroom-vs-2-bedroom-apartment": {
    title: "1 Bedroom vs 2 Bedroom Apartment: Which Is Right for You?",
    metaTitle: "1 Bedroom vs 2 Bedroom Apartment: Full Comparison (2025) | Rentorce",
    metaDescription: "Compare 1-bedroom and 2-bedroom apartments by cost, space, lifestyle, and value. Find out which option fits your budget and living situation in 2025.",
    category: "Apartment Types",
    readTime: "5 min read",
    publishDate: "2025-02-01",
    relatedSlugs: ["how-to-rent-apartment-usa", "furnished-vs-unfurnished-apartment"],
    content: `
## Introduction

One of the most common dilemmas renters face is choosing between a 1-bedroom and a 2-bedroom apartment. Both have advantages depending on your lifestyle, budget, and future plans. This guide breaks down the key differences to help you make the right decision.

---

## Average Cost Comparison

Rent varies by city, but here's a general comparison of 1BR vs 2BR apartments in major US markets:

| City | 1 Bedroom | 2 Bedrooms |
|------|-----------|-----------|
| New York, NY | $1,200–$1,600 | $1,600–$2,200 |
| Los Angeles, CA | $1,100–$1,500 | $1,500–$2,000 |
| Chicago, IL | $950–$1,300 | $1,200–$1,700 |
| Dallas, TX | $850–$1,200 | $1,100–$1,500 |
| Miami, FL | $1,050–$1,450 | $1,400–$1,900 |

On average, a 2-bedroom apartment costs **30–50% more** than a 1-bedroom in the same building. However, splitting a 2BR with a roommate can make it cheaper than renting a 1BR alone.

---

## When a 1 Bedroom Apartment Makes Sense

A 1-bedroom apartment is ideal if:

- **You live alone** and don't need extra space
- **You're on a tight budget** and can't afford the premium for a 2BR
- **You work from home but value simplicity** over having a dedicated office
- **You live in an expensive city** where every dollar counts
- **You're a couple without children** who share a bedroom comfortably
- **You're new to a city** and want to minimize commitment costs

**Pros of a 1-bedroom:**
- Lower monthly rent
- Lower security deposit
- Lower utility bills
- Easier to clean and maintain
- More available inventory in most cities

**Cons of a 1-bedroom:**
- Limited space for a home office
- No room for guests to stay
- Less storage space
- Can feel cramped with two people long-term

---

## When a 2 Bedroom Apartment Makes Sense

A 2-bedroom apartment is the right choice if:

- **You have a roommate** and splitting rent makes both your costs lower than a 1BR each
- **You have or plan to have a child** who needs their own room
- **You regularly work from home** and need a dedicated, separate office
- **You frequently have family or guests** visit overnight
- **You need extra storage** for equipment, hobbies, or a growing wardrobe
- **You're in a city with reasonable rents** where the price jump is manageable

**Pros of a 2-bedroom:**
- Extra room for office, nursery, or guests
- Can be cheaper per person with a roommate
- More flexibility and long-term living comfort
- Better for resale or subletting in some markets

**Cons of a 2-bedroom:**
- Higher rent, deposit, and utilities
- More space to clean
- May require longer commute if moving to suburbs for affordability

---

## The Roommate Math

If you're considering a 2-bedroom to share with a roommate, here's how the numbers work:

**Example in Chicago:**
- 1BR apartment: $1,100/mo (you pay $1,100)
- 2BR apartment: $1,500/mo split two ways = $750/person

**Splitting a 2BR is often the most economical option**, especially in cities like New York, San Francisco, and Seattle where rents are high.

---

## 1BR vs 2BR: Key Factors Side by Side

| Factor | 1 Bedroom | 2 Bedrooms |
|--------|-----------|-----------|
| Avg monthly cost | Lower | Higher (30–50%) |
| Best for | Singles, couples | Families, roommates |
| Privacy | High | Depends on roommate |
| Work-from-home suitability | Low–Medium | High |
| Guest accommodation | Limited | Good |
| Utility costs | Lower | Higher |

---

## Our Recommendation

- **Rent a 1BR** if you live alone and prioritize budget over space, or if you're in an expensive city where 2BRs are significantly pricier.
- **Rent a 2BR** if you have a roommate who can split costs, if you work from home, or if you have a child who needs their own space.

Use Rentorce's apartment finder to instantly compare 1-bedroom and 2-bedroom options in your target city — filtered to your exact budget and move-in date.
    `,
  },

  "pet-friendly-apartments-guide": {
    title: "How to Find Pet-Friendly Apartments in the USA",
    metaTitle: "How to Find Pet-Friendly Apartments in the USA (2025 Guide) | Rentorce",
    metaDescription: "A complete guide for pet owners searching for rental apartments in the USA. Learn what landlords require, how to negotiate pet policies, and find pet-friendly rentals fast.",
    category: "Pet Owners",
    readTime: "6 min read",
    publishDate: "2025-02-15",
    relatedSlugs: ["how-to-rent-apartment-usa", "apartment-hunting-checklist"],
    content: `
## Introduction

Finding a pet-friendly apartment in the USA requires extra preparation compared to a standard rental search. Many landlords restrict or prohibit pets, and those who do allow them often charge additional deposits or fees. This guide helps pet owners navigate the rental market and find the right home for themselves and their animals.

---

## Types of Pet Policies in US Rental Apartments

Landlords typically fall into four categories when it comes to pets:

**1. Dogs & Cats Allowed** — The most flexible policy. Both dogs and cats are permitted, sometimes with breed or weight restrictions.

**2. Cats Only** — Cats are allowed but dogs are not. Common in apartment buildings where noise is a concern.

**3. No Pets** — No animals of any kind are permitted. Violation of this policy typically results in lease termination and forfeiture of security deposit.

**4. Case-by-Case Basis** — The landlord reviews each request individually. Smaller, quieter pets (fish, hamsters, caged birds) are often approved even in buildings that don't advertise as pet-friendly.

---

## Common Pet Fees You Should Expect

When renting with a pet, expect to pay additional costs:

| Fee Type | Typical Amount |
|----------|---------------|
| Pet deposit (refundable) | $200–$500 |
| Pet fee (non-refundable) | $150–$350 |
| Monthly pet rent | $25–$75/mo per pet |

**Note:** Some buildings charge all three. Always ask what pet fees apply before signing.

---

## Dog Breed and Weight Restrictions

Even in "pet-friendly" buildings, many landlords restrict certain dog breeds due to insurance liability concerns. Commonly restricted breeds include:

- Pit Bull / American Staffordshire Terrier
- Rottweiler
- Doberman Pinscher
- German Shepherd (in some cases)
- Akita
- Chow Chow

**Weight limits** are also common. Many buildings restrict dogs over 25–50 lbs. If you have a large dog, specifically ask about weight limits before applying.

---

## How to Find Pet-Friendly Apartments

**1. Use apartment search filters**
When searching on Rentorce, filter for "Pet Friendly" in the amenities section of the apartment finder. This narrows results to buildings that explicitly allow pets.

**2. Search in pet-friendly neighborhoods**
Some neighborhoods are known for being more pet-accepting. In most cities, suburban apartment complexes are more likely to allow large dogs than downtown high-rises.

**3. Look at smaller, privately-owned buildings**
Individual landlords who own a small number of units are often more flexible about pets than large corporate property management companies.

**4. Be upfront about your pet**
Never hide a pet from your landlord. If discovered, you risk immediate lease termination. Always disclose your pet during the application process.

---

## How to Make Yourself a Strong Applicant as a Pet Owner

Pet owners face extra scrutiny in the rental market. Here's how to stand out:

**Prepare a "pet resume"**
Include your pet's:
- Name, breed, age, weight
- Vaccination records (up to date)
- Spay/neuter status
- Training certificates (if applicable)
- Reference from a previous landlord confirming no damage

**Offer a higher pet deposit**
If a landlord is on the fence, offering a slightly larger refundable deposit shows you're serious about protecting their property.

**Get renter's insurance with pet liability coverage**
Some renter's insurance policies include pet damage or liability coverage. This can reassure nervous landlords.

**Ask for a pet addendum**
Rather than leaving pet permissions vague, ask the landlord to add a written pet addendum to your lease specifying what's allowed, what fees apply, and what happens if there's damage.

---

## Best Cities for Pet Owners Renting Apartments

Some US cities are significantly more pet-friendly in their rental markets:

| City | Pet Friendliness | Notes |
|------|-----------------|-------|
| Austin, TX | ⭐⭐⭐⭐⭐ | Very dog-friendly culture |
| Denver, CO | ⭐⭐⭐⭐⭐ | Most buildings allow dogs |
| Portland, OR | ⭐⭐⭐⭐ | High pet acceptance rates |
| San Diego, CA | ⭐⭐⭐⭐ | Good, especially suburbs |
| Nashville, TN | ⭐⭐⭐⭐ | Growing pet-friendly market |
| New York, NY | ⭐⭐ | Strict, many breed bans |
| San Francisco, CA | ⭐⭐ | Limited pet-friendly stock |

---

## What to Ask Before Signing a Pet-Friendly Lease

Before committing, ask your landlord:

1. What pets are allowed? (species, breed, weight)
2. How much is the pet deposit and is it refundable?
3. Is there a monthly pet rent?
4. Where can I walk my dog on the property?
5. Are there pet restrictions in common areas (elevators, lobbies)?
6. What happens if my pet causes damage beyond the deposit?
7. Can I get the pet policy in writing as part of the lease?

---

## Ready to Find Your Pet-Friendly Apartment?

Use Rentorce's apartment finder to search for pet-friendly rentals in your city. Our matching system lets you filter by pet policy — including buildings that specifically allow dogs, cats, or both.
    `,
  },

  "apartment-hunting-checklist": {
    title: "Ultimate Apartment Hunting Checklist (2025)",
    metaTitle: "Ultimate Apartment Hunting Checklist 2025 | Rentorce",
    metaDescription: "A comprehensive apartment hunting checklist covering budget, credit, search criteria, tour inspection, lease review, and move-in documentation. Print and use.",
    category: "Checklists",
    readTime: "7 min read",
    publishDate: "2025-03-01",
    relatedSlugs: ["how-to-rent-apartment-usa", "pet-friendly-apartments-guide"],
    content: `
## Introduction

Apartment hunting can be stressful and fast-moving, especially in competitive rental markets. Using a structured checklist helps you stay organized, ask the right questions, and avoid costly mistakes. This checklist covers every stage — from pre-search preparation to your move-in day.

---

## ✅ Phase 1: Before You Start Searching

**Budget & Financial Preparation**
- [ ] Calculate your maximum monthly rent (30% of gross monthly income)
- [ ] Add up total upfront costs: first month + security deposit + pet deposit
- [ ] Check your credit score (aim for 650+)
- [ ] Gather income documents: pay stubs, bank statements, offer letter
- [ ] Save at least 3 months of rent in liquid savings

**Define Your Requirements**
- [ ] Choose your target neighborhood(s) or ZIP codes
- [ ] Decide on apartment size (studio, 1BR, 2BR, 3BR)
- [ ] List must-have amenities (parking, laundry, dishwasher, gym)
- [ ] Decide on furnished vs unfurnished
- [ ] Know your move-in date (flexible vs firm)
- [ ] Clarify pet requirements (if applicable)

---

## ✅ Phase 2: The Apartment Search

**Online Search**
- [ ] Search on Rentorce.com for instant matching to your location and budget
- [ ] Set price filters to stay within your budget
- [ ] Filter by pet policy, furnished status, and amenities
- [ ] Save listings and compare at least 5 apartments before deciding
- [ ] Research neighborhood safety, walkability, and transit scores

**Contact & Scheduling**
- [ ] Contact landlords/leasing offices within 24 hours of finding a listing
- [ ] Schedule in-person or virtual tours
- [ ] Confirm the listing is still available before visiting

---

## ✅ Phase 3: During the Apartment Tour

**Physical Inspection**
- [ ] Check all water faucets for pressure and hot water
- [ ] Flush all toilets and check for running water
- [ ] Test all light switches, outlets, and ceiling lights
- [ ] Open and close all windows, doors, and closets
- [ ] Check appliances: stove, oven, refrigerator, dishwasher
- [ ] Look for signs of mold or water damage (walls, under sinks, around windows)
- [ ] Inspect floors, walls, and ceilings for cracks or damage
- [ ] Check for adequate cell phone signal and ask about internet options
- [ ] Test noise levels: listen for neighbors, street noise, HVAC systems
- [ ] Check heating and AC (turn them on if possible)
- [ ] Count outlets in each room (especially the bedroom and home office)

**Building & Neighborhood**
- [ ] Check mail area condition and security
- [ ] Test elevator response time (if building has one)
- [ ] Check stairwell and hallway cleanliness
- [ ] Ask about trash and recycling policy
- [ ] Walk the neighborhood at night before committing

**Questions to Ask the Landlord**
- [ ] What utilities are included in rent?
- [ ] What is the average monthly utility bill for the unit?
- [ ] How are maintenance requests handled? What is the typical response time?
- [ ] Are there any upcoming rent increases planned?
- [ ] Is the building professionally managed or owner-managed?
- [ ] How long has the current landlord owned the property?
- [ ] Why did the previous tenant leave?
- [ ] What is the guest and quiet hours policy?

---

## ✅ Phase 4: The Application Process

- [ ] Submit application promptly (same day in competitive markets)
- [ ] Provide all required documents: ID, income proof, references
- [ ] Pay application fee (keep receipt)
- [ ] Follow up within 24 hours if you haven't heard back
- [ ] Have a co-signer ready if your credit is borderline

---

## ✅ Phase 5: Reviewing the Lease

**Before Signing:**
- [ ] Read the entire lease — every clause
- [ ] Confirm the monthly rent amount matches what was advertised
- [ ] Confirm the lease start and end dates
- [ ] Review security deposit amount and refund conditions
- [ ] Check the late payment fee policy
- [ ] Review the early termination clause and penalties
- [ ] Confirm pet policy is in writing (if applicable)
- [ ] Check guest and subletting policy
- [ ] Review the renewal terms and notice period
- [ ] Confirm which repairs and maintenance are the tenant's responsibility
- [ ] Get all verbal promises from the landlord in writing

---

## ✅ Phase 6: Before Moving In

**Payments & Admin**
- [ ] Pay first month's rent and security deposit (by check or bank transfer — never cash)
- [ ] Get receipt for all payments
- [ ] Set up renters insurance (recommended: $15–$30/mo)
- [ ] Set up utilities: electricity, gas, internet

**Move-In Documentation**
- [ ] Complete a move-in inspection checklist with the landlord
- [ ] Photograph every room, including existing damage
- [ ] Email photos to yourself and the landlord for a timestamped record
- [ ] Get a copy of all keys and access codes

---

## ✅ Phase 7: Settling In

- [ ] Introduce yourself to neighbors
- [ ] Locate emergency exits, fire extinguishers, and smoke/CO detectors
- [ ] Test smoke and carbon monoxide detectors
- [ ] Update your address: bank, employer, USPS mail forwarding, DMV
- [ ] Register to vote at your new address (if applicable)

---

## Quick Reference: Red Flags During Apartment Hunting

🚩 Landlord refuses to show the apartment in person
🚩 Asks for cash payment only
🚩 Price is significantly below market rate for the area
🚩 Pressure to sign immediately without time to review the lease
🚩 No written lease — only a verbal agreement
🚩 Existing damage not disclosed before the tour
🚩 No background or credit check required
🚩 Signs of mold, pests, or water damage that landlord dismisses

---

Use this checklist on your next apartment search to find the right unit with confidence. Rentorce's free matching tool helps you discover verified rentals in your city in minutes.
    `,
  },

  "furnished-vs-unfurnished-apartment": {
    title: "Furnished vs Unfurnished Apartment: Pros, Cons & Cost Comparison",
    metaTitle: "Furnished vs Unfurnished Apartment: Which Is Cheaper? (2025) | Rentorce",
    metaDescription: "Compare furnished and unfurnished apartments in the USA. Understand the real cost difference, who should choose each option, and how to find the best deal.",
    category: "Cost & Budget",
    readTime: "5 min read",
    publishDate: "2025-03-15",
    relatedSlugs: ["how-to-rent-apartment-usa", "1-bedroom-vs-2-bedroom-apartment"],
    content: `
## Introduction

When searching for an apartment, one of the first decisions you'll face is whether to rent a furnished or unfurnished unit. The right choice depends on your situation, budget, and how long you plan to stay. This guide breaks down the real costs, advantages, and disadvantages of each option.

---

## What Is a Furnished Apartment?

A **furnished apartment** includes essential furniture and appliances that allow you to move in without purchasing anything. Typical furnished apartments include:

**Living room:** Sofa, coffee table, television (sometimes), area rug
**Bedroom:** Bed frame, mattress, dresser, nightstand
**Dining area:** Dining table and chairs
**Kitchen:** Fully equipped with appliances (refrigerator, stove, microwave) and basic cookware or utensils

Some furnished apartments also include:
- Linens (sheets, towels, pillows)
- Small appliances (toaster, coffee maker, blender)
- Smart TV or cable hookup
- Cleaning supplies

---

## What Is an Unfurnished Apartment?

An **unfurnished apartment** provides only the fixed infrastructure: walls, floors, kitchen appliances (refrigerator, stove), and sometimes a washer/dryer hookup. You are responsible for providing all furniture.

---

## Cost Comparison: Furnished vs Unfurnished

### Monthly Rent Premium

Furnished apartments typically cost **20–40% more per month** than comparable unfurnished units in the same building or neighborhood.

| City | Unfurnished 1BR | Furnished 1BR | Monthly Premium |
|------|----------------|--------------|----------------|
| New York, NY | $1,300/mo | $1,700/mo | +$400/mo |
| Chicago, IL | $1,000/mo | $1,300/mo | +$300/mo |
| Dallas, TX | $900/mo | $1,150/mo | +$250/mo |
| Austin, TX | $1,050/mo | $1,350/mo | +$300/mo |

### The Furniture Cost if You Go Unfurnished

If you rent unfurnished, you'll need to budget for furniture. Here's a realistic estimate for a 1-bedroom apartment:

| Item | Estimated Cost |
|------|---------------|
| Bed frame + mattress | $400–$900 |
| Sofa | $300–$800 |
| Dining table + chairs | $200–$500 |
| Dresser + nightstand | $150–$400 |
| Desk (if WFH) | $100–$300 |
| Basic kitchen items | $100–$200 |
| **Total** | **$1,250–$3,100** |

---

## When a Furnished Apartment Makes More Sense

Choose **furnished** if:

- **You're moving temporarily** (3–12 months) and don't want to invest in furniture you'll have to move or sell
- **You're relocating for work** and your company will cover rent
- **You're a student** living in the city for a semester or academic year
- **You're new to a city** and not sure where you'll want to live long-term
- **You're moving from another country** and can't bring furniture with you
- **You value convenience** and want to move in immediately without setup hassle

**The break-even math:**
If a furnished apartment costs $300/mo more, and furniture would cost you $1,800 upfront, your break-even point is 6 months. For stays shorter than 6 months, furnished is the smarter financial choice.

---

## When an Unfurnished Apartment Makes More Sense

Choose **unfurnished** if:

- **You plan to stay 12+ months** and already own furniture or can afford to buy it
- **You want to personalize your space** with your own style and furniture
- **You already have furniture** from a previous apartment or home
- **You have a larger budget** for upfront costs but want to minimize monthly expenses
- **You're renting with a partner or roommate** and combining furniture reduces costs

**The long-term math:**
Over 2 years, paying $300/mo extra for furnished = $7,200. That's significantly more than the $1,800 you might spend on basic furniture. For long-term renters, unfurnished is almost always the better financial decision.

---

## Semi-Furnished Apartments: A Middle Ground

Some apartments offer a "semi-furnished" option, which typically includes:
- Appliances (refrigerator, stove, sometimes washer/dryer)
- Window coverings
- Kitchen cabinets and countertops
- Sometimes: bed frame without mattress, or dining table without chairs

Semi-furnished is a good compromise if you want to keep monthly costs lower but don't want to start completely from scratch.

---

## Questions to Ask Before Renting Furnished

Before signing a furnished apartment lease, confirm:

1. Exactly what furniture is included (get a written inventory list)
2. Who is responsible for furniture repair or replacement?
3. Is the furniture clean and in good condition?
4. Are you allowed to bring your own furniture and store the landlord's furniture?
5. What happens if furniture gets damaged — through normal use vs. negligence?

---

## Summary: Furnished vs Unfurnished at a Glance

| Factor | Furnished | Unfurnished |
|--------|-----------|-------------|
| Monthly rent | Higher (+20–40%) | Lower |
| Upfront furniture cost | $0 | $1,200–$3,000+ |
| Best for stay duration | Under 12 months | 12+ months |
| Personalization | Limited | Full |
| Move-in convenience | High | Low |
| Long-term value | Poor | Excellent |

---

Ready to search? Rentorce's apartment finder lets you filter specifically for furnished or unfurnished units in your target city, at your exact budget.
    `,
  },
};

interface Props { params: Promise<{ slug: string }>; }

export async function generateStaticParams() {
  return Object.keys(GUIDES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES[slug];
  if (!guide) return { title: "Guide Not Found | Rentorce" };
  const canonicalUrl = `${BASE_URL}/guides/${slug}`;
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: { title: guide.metaTitle, description: guide.metaDescription, url: canonicalUrl, siteName: "Rentorce", images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }], locale: "en_US", type: "article", publishedTime: guide.publishDate },
    twitter: { card: "summary_large_image", title: guide.metaTitle, description: guide.metaDescription, images: [`${BASE_URL}/og-image.png`] },
  };
}

function renderContent(content: string) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let isHeader = true;

  const flushTable = () => {
    if (tableRows.length === 0) return;
    const [headerRow, , ...bodyRows] = tableRows;
    const headerCells = (headerRow as string[]).join("|").split("|").filter((_: string, i: number, a: string[]) => i > 0 && i < a.length - 1);
    elements.push(
      <div key={`table-${elements.length}`} className="overflow-x-auto my-6 rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>{headerCells.map((cell: string, i: number) => (
              <th key={i} className="px-4 py-3 font-bold text-slate-700 whitespace-nowrap">{cell.trim()}</th>
            ))}</tr>
          </thead>
          <tbody>{bodyRows.map((rowArr: string[], ri: number) => {
            const rowCells = rowArr.join("|").split("|").filter((_: string, i: number, a: string[]) => i > 0 && i < a.length - 1);
            return (
              <tr key={ri} className="border-t border-slate-100 hover:bg-slate-50/50">
                {rowCells.map((cell: string, ci: number) => (
                  <td key={ci} className="px-4 py-3 text-slate-600">{cell.trim()}</td>
                ))}
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  };

  lines.forEach((line, i) => {
    if (line.startsWith("|")) {
      if (!inTable) inTable = true;
      tableRows.push(line.split("|"));
      return;
    } else if (inTable) {
      flushTable();
    }

    if (line.startsWith("## ")) {
      let headingText = line.slice(3).trim();
      let headingId = "";
      const match = headingText.match(/\{#([a-zA-Z0-9_-]+)\}/);
      if (match) {
        headingId = match[1];
        headingText = headingText.replace(/\{#([a-zA-Z0-9_-]+)\}/, "").trim();
      } else {
        headingId = headingText
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");
      }
      elements.push(
        <h2
          key={i}
          id={headingId}
          className="text-xl sm:text-2xl font-black text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-100 scroll-mt-24"
        >
          {headingText}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      let headingText = line.slice(4).trim();
      let headingId = "";
      const match = headingText.match(/\{#([a-zA-Z0-9_-]+)\}/);
      if (match) {
        headingId = match[1];
        headingText = headingText.replace(/\{#([a-zA-Z0-9_-]+)\}/, "").trim();
      } else {
        headingId = headingText
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");
      }
      elements.push(
        <h3
          key={i}
          id={headingId}
          className="text-lg font-bold text-slate-800 mt-6 mb-3 scroll-mt-24"
        >
          {headingText}
        </h3>
      );
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(<p key={i} className="font-bold text-slate-800 mt-4 mb-1">{line.slice(2, -2)}</p>);
    } else if (line.startsWith("- [ ] ")) {
      elements.push(
        <div key={i} className="flex items-start gap-2.5 py-1.5">
          <div className="w-4 h-4 mt-0.5 rounded border-2 border-slate-300 flex-shrink-0" />
          <span className="text-slate-700 text-sm">{line.slice(6)}</span>
        </div>
      );
    } else if (line.startsWith("- ")) {
      const formatted = line.slice(2)
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\[(.+?)\]\((.+?)\)/g, "<a href='$2' class='text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-2 transition'>$1</a>");
      elements.push(
        <div key={i} className="flex items-start gap-2 py-0.5">
          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <span className="text-slate-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />
        </div>
      );
    } else if (line.startsWith("---")) {
      elements.push(<hr key={i} className="my-8 border-slate-100" />);
    } else if (line.trim() === "↓") {
      elements.push(
        <div key={i} className="flex justify-center py-2 text-blue-500 font-bold text-lg select-none">
          ↓
        </div>
      );
    } else if (line.startsWith("🚩 ")) {
      elements.push(
        <div key={i} className="flex items-center gap-2 py-1 text-sm text-red-700">
          <span>🚩</span><span>{line.slice(3)}</span>
        </div>
      );
    } else if (line.trim().length > 0) {
      const formatted = line
        .replace(/\*\*(.+?)\*\*/g, "<strong class='text-slate-800'>$1</strong>")
        .replace(/\[(.+?)\]\((.+?)\)/g, "<a href='$2' class='text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-2 transition'>$1</a>");
      elements.push(
        <p key={i} className="text-slate-600 leading-relaxed mb-3 text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    }
  });

  if (inTable) flushTable();
  return elements;
}

import React from "react";

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = GUIDES[slug];
  if (!guide) notFound();

  const related = guide.relatedSlugs
    .map((s) => GUIDES[s] ? { slug: s, title: GUIDES[s].title, readTime: GUIDES[s].readTime, category: GUIDES[s].category } : null)
    .filter(Boolean);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    datePublished: guide.publishDate,
    dateModified: guide.publishDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/guides/${slug}`,
    },
    author: {
      "@type": "Organization",
      name: "Rentorce Editorial Team",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Rentorce",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/fulllogo.svg`,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/guides" className="inline-flex items-center gap-1.5 text-blue-300 hover:text-white text-xs font-semibold mb-6 transition">
            <ArrowLeft className="w-3.5 h-3.5" /> All Guides
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">{guide.category}</span>
            <span className="flex items-center gap-1 text-slate-400 text-xs"><Clock className="w-3 h-3" />{guide.readTime}</span>
            <span className="flex items-center gap-1 text-slate-400 text-xs"><Calendar className="w-3 h-3" />{new Date(guide.publishDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">{guide.title}</h1>
          <p className="text-slate-300 mt-3 text-sm sm:text-base leading-relaxed max-w-2xl">{guide.metaDescription}</p>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="prose-custom space-y-1">
            {renderContent(guide.content)}
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
        <h2 className="text-xl sm:text-2xl font-black mb-3">Ready to find your apartment?</h2>
        <p className="text-blue-100 mb-6 max-w-sm mx-auto text-sm">Use our free matching tool to find verified 1BR, 2BR, and 3BR apartments in your city — matched to your exact budget.</p>
        <Link href="/find-apartment" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-blue-700 font-black rounded-xl hover:bg-blue-50 transition shadow-lg text-sm">
          Start Free Apartment Match <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Related Guides */}
      {related.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg font-black text-slate-900 mb-6">Related Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((r) => r && (
                <Link key={r.slug} href={`/guides/${r.slug}`} className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">{r.category}</span>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">{r.title}</h3>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400"><Clock className="w-3 h-3" />{r.readTime}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
