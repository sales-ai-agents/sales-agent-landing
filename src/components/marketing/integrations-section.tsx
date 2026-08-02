import { cn } from "@/lib/utils";
import { ScrollReveal, StaggerReveal } from "@/components/marketing/scroll-reveal";
import { INTEGRATIONS, type MarketingIntegration } from "@/lib/marketing-data";

function IntegrationCard({
  integration,
  compact,
}: {
  integration: MarketingIntegration;
  compact?: boolean;
}) {
  const Icon = integration.icon;

  return (
    <div className="border-border bg-card-glass rounded-2xl border p-4 shadow-md backdrop-blur-sm">
      <div className="mb-3">
        <Icon
          className={cn("text-foreground", compact ? "size-4 md:size-8" : "size-4 md:size-8")}
          aria-hidden="true"
        />
      </div>
      <h3
        className={cn(
          "text-foreground mb-2 font-semibold",
          compact ? "text-sm md:text-xl" : "text-xl"
        )}
      >
        {integration.title}
      </h3>
      <p className="text-foreground text-sm leading-relaxed tracking-wide">
        {integration.description}
      </p>
    </div>
  );
}

export function IntegrationsSection() {
  return (
    <section id="integrations" className="pt-20">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal direction="up" distance={30}>
          <div className="mb-12 text-center">
            <h2 className="font-display mx-auto max-w-3xl text-3xl sm:text-4xl md:text-5xl">
              <span className="text-foreground">Працює з </span>
              <span className="text-primary">вашими </span>
              <span className="text-foreground">звичними </span>
              <span className="text-primary">інструментами</span>
            </h2>
            <p className="text-foreground mx-auto mt-6 max-w-xl text-base md:text-lg">
              Після дзвінка агент передає статус, підсумок і запис у CRM, таблицю або вашу систему
              автоматизації.
            </p>
          </div>
        </ScrollReveal>

        {/* Desktop: 4-column grid */}
        <StaggerReveal
          staggerDelay={0.1}
          direction="up"
          distance={25}
          className="hidden gap-5 lg:grid lg:grid-cols-4"
        >
          {INTEGRATIONS.map((integration) => (
            <IntegrationCard key={integration.title} integration={integration} />
          ))}
        </StaggerReveal>

        {/* Mobile: masonry-style 2-column layout */}
        <ScrollReveal direction="up" distance={25} className="lg:hidden">
          <div className="grid grid-cols-2 gap-4">
            <div className="mt-10 flex flex-col gap-4">
              {INTEGRATIONS.filter((_, i) => i % 2 === 0).map((integration) => (
                <IntegrationCard key={integration.title} integration={integration} compact />
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {INTEGRATIONS.filter((_, i) => i % 2 !== 0).map((integration) => (
                <IntegrationCard key={integration.title} integration={integration} compact />
              ))}
            </div>
          </div>
        </ScrollReveal>

        <div className="bg-border mt-20 h-px w-full" aria-hidden="true" />
      </div>
    </section>
  );
}
