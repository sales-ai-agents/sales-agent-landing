import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-x-hidden font-[family-name:var(--font-inter)]">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
