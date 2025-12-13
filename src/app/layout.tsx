import type { Metadata, Viewport } from "next";
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
});

export const metadata: Metadata = {
  title: "STILE — Chuyên Ốp Lát Bề Mặt Cao Cấp | Gạch Ốp Lát Sang Trọng",
  description:
    "STILE là công ty chuyên về ốp lát bề mặt cao cấp, cung cấp các giải pháp hoàn thiện không gian với bộ sưu tập gạch ốp lát cao cấp, đá tự nhiên và vật liệu bề mặt sang trọng cho nội thất, ngoại thất và kiến trúc. Chuyên nghiệp trong ốp tường, lát sàn, mặt tiền kiến trúc và đồ nội thất cao cấp.",
  keywords: [
    "ốp lát bề mặt cao cấp",
    "gạch ốp lát sang trọng",
    "ốp tường cao cấp",
    "lát sàn cao cấp",
    "mặt tiền kiến trúc",
    "vật liệu ốp lát",
    "đá tự nhiên",
    "bề mặt cao cấp",
    "nội thất cao cấp",
    "STILE",
    "Gemini Collection",
  ],
  openGraph: {
    title: "STILE — Chuyên Ốp Lát Bề Mặt Cao Cấp",
    description:
      "Công ty chuyên về ốp lát bề mặt cao cấp với bộ sưu tập gạch ốp lát sang trọng cho nội thất, ngoại thất và kiến trúc.",
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "STILE — Chuyên Ốp Lát Bề Mặt Cao Cấp",
    description:
      "Công ty chuyên về ốp lát bề mặt cao cấp với bộ sưu tập gạch ốp lát sang trọng.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // #region agent log
  if (typeof window !== 'undefined') {
    fetch('http://127.0.0.1:7247/ingest/ee9aa5dd-fc2c-4758-9f04-3d172de49f45',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'layout.tsx:69',message:'RootLayout rendering',data:{hasChildren:!!children},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  }
  // #endregion
  return (
    <html lang="vi">
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
