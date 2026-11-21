import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { DM_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TopBar } from "@/components/live";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SpringIntro } from "@/components/motion/spring-intro";

const dmSans = localFont({
  src: "./fonts/dm-sans-latin.woff2",
  variable: "--font-dm-sans",
  display: "swap",
  weight: "100 900",
});

const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: `${site.name} · ${site.city}`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { type: "website", siteName: site.name, images: ["/media/v5/photo0.jpg"] },
  // Flip once content is approved for public release.
  robots: site.preview ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = { themeColor: "#071629" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={`${dmSans.variable} ${dmMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            // Before first paint: opt into motion, decide whether the opening intro plays,
            // and fail safe — if the motion engine never starts, show everything after 3s.
            __html: `(function(){var d=document.documentElement;d.classList.add('js');
var r=matchMedia('(prefers-reduced-motion: reduce)').matches,s;try{s=sessionStorage.getItem('sol-intro')}catch(e){}
if(r||s)d.classList.add('no-intro');
setTimeout(function(){if(!window.__reveal){d.classList.remove('js');d.classList.add('no-intro')}},3000)})()`,
          }}
        />
        <style>{`html .spring-intro{display:none}html.js:not(.no-intro) .spring-intro{display:flex}`}</style>
      </head>
      <body>
        <SpringIntro />
        <a href="#main" className="sr-only z-[60] rounded-[3px] bg-brand px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <TopBar />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <MotionProvider />
      </body>
    </html>
  );
}
