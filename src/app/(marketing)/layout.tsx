import { Footer } from "@/components/marketing/footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-body relative overflow-x-hidden">
      <main itemScope itemType="https://schema.org/WebPage">
        {children}
      </main>
      <Footer />
    </div>
  );
}
