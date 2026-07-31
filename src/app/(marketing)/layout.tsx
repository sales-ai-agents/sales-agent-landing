import localFont from "next/font/local";
import { Footer } from "@/components/marketing/footer";
import { cn } from "@/lib/utils";

const actayWideBold = localFont({
  src: "../../fonts/ActayWide-Bold.woff2",
  variable: "--font-display",
  weight: "700",
  display: "swap",
  fallback: ["Inter", "sans-serif"],
});

const gilroy = localFont({
  src: "../../fonts/Gilroy-SemiBold.woff",
  variable: "--font-gilroy",
  weight: "600",
  display: "swap",
  fallback: ["Inter", "sans-serif"],
});

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "font-body relative overflow-x-hidden",
        actayWideBold.variable,
        gilroy.variable
      )}
    >
      <main>{children}</main>
      <Footer />
    </div>
  );
}
