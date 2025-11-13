import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Manrope, Montserrat } from "next/font/google";
import "./globals.css";

const angularFlow = localFont({
  src: "../../public/1FTV-VIP-Angular-Flow.otf",
  variable: "--font-angular-flow",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "STILE — Spatial Team Control Center",
  description:
    "Experience an Apple-inspired operations canvas that orchestrates teams, rituals, and insights in real time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${angularFlow.variable} ${inter.variable} ${manrope.variable} ${montserrat.variable} antialiased`}
      >
        <svg aria-hidden="true" className="hidden">
          <symbol id="ic-arrow-launch" viewBox="0 0 16 16">
            <path
              fillRule="evenodd"
              d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
              fill="currentColor"
            />
          </symbol>
        </svg>
        {children}
      </body>
    </html>
  );
}
