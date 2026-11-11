<div align="center">
  <img src="public/fulllogo.svg" alt="Rentorce" width="320" />

  <h1>Find a place that feels like home.</h1>

  <p>A smarter way to discover apartments that fit your budget, space, and neighborhood.</p>
</div>

---

## About Rentorce

Rentorce is an apartment-finding platform built to help renters discover homes across the United States. Search for verified listings and find 1-bedroom, 2-bedroom, and 3-bedroom apartments matched to your preferences.

The application includes an apartment discovery experience, personalized matching flow, listing details, tour-request and lead forms, location-based browsing, renter guides, and an admin area for managing listings and users.

## Features

- Browse apartments and explore listings by location.
- Find rental matches based on renter preferences.
- View apartment details, photos, and tour-request options.
- Submit renter inquiries and newsletter signups.
- Manage apartments and admin users through protected admin tools.
- Responsive web experience built with Next.js.

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS 4, Framer Motion, Lucide React
- **Data:** MongoDB with Mongoose
- **Validation and forms:** Zod, React Hook Form
- **Image storage:** Cloudinary (optional configuration)

## Getting started

### Prerequisites

- Node.js compatible with the installed Next.js version
- npm
- A MongoDB database for persistent application data

### 1. Clone the repository

```bash
git clone https://github.com/sanzidahmed4/Rentorse.git
cd Rentorse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local environment file from the example:

```bash
cp .env.example .env.local
```

Set the values for your environment:

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string. |
| `ADMIN_USERS` | Yes | Comma-separated `username:password` pairs for admin access. Use strong, unique passwords. |
| `ADMIN_JWT_SECRET` | Yes | Secret used for admin authentication; use a cryptographically secure value of at least 32 characters. |
| `NEXT_PUBLIC_APP_URL` | Recommended | Base URL of the application, such as `http://localhost:3000`. |
| `CLOUDINARY_CLOUD_NAME` | Optional | Cloudinary cloud name for image storage. |
| `CLOUDINARY_API_KEY` | Optional | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Optional | Cloudinary API secret. |
| `INDEXNOW_KEY` | Optional | IndexNow key for notifying search engines about URLs. |

Alternatively, configure `CLOUDINARY_URL` instead of the individual Cloudinary variables. Keep secrets in `.env.local` or your hosting provider's secret manager—never commit real credentials.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server using webpack. |
| `npm run build` | Create a production build. |
| `npm run start` | Run the production server (after building). |
| `npm run lint` | Run ESLint. |

## Project structure

```text
src/
├── app/            # Next.js pages, layouts, and API routes
│   ├── admin/      # Admin pages
│   ├── api/        # API endpoints
│   ├── apartments/ # Apartment listing pages
│   ├── guides/     # Renter guides
│   └── ...         # Search, results, and policy pages
├── components/     # Reusable UI components
├── lib/            # Database, matching, auth, and application utilities
├── models/         # Mongoose data models
└── types/          # Shared TypeScript types
```

## Production deployment

Rentorce is a Next.js application and can be deployed to a Node.js host or a platform such as [Vercel](https://vercel.com/). Configure the required environment variables in the deployment environment, connect a production MongoDB database, and then build and start the application:

```bash
npm run build
npm run start
```

For platform-specific guidance, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Contributing

Contributions and suggestions are welcome. For substantial changes, please open an issue first to discuss the proposal. Before submitting a pull request, run the lint command and ensure the production build succeeds.

## License

No license is currently specified for this repository. Unless a license is added, all rights are reserved by the copyright holder.
