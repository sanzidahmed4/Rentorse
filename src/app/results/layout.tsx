import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apartment Matches | Rentorce",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
