import { cn } from "@/lib/utils";
import { trackProps } from "@/components/landing/click-tracking";
import { SIGN_UP_URL } from "@/components/landing/data";
import type { PricingCopy, PricingPlanCopy } from "@/components/landing/copy/types";
import { CheckIcon } from "@/components/landing/icons";
import { Arrow, CopyHeading, MetaRow } from "@/components/landing/typography";

const DEFAULT_HIGHLIGHTED_FEATURES: readonly number[] = [0];

const PLAN_VARIANT_CLASS = {
  trial: "trial",
  featured: "hot",
} as const;

function PlanCard({ plan }: { plan: PricingPlanCopy }) {
  const highlighted = plan.highlightedFeatures ?? DEFAULT_HIGHLIGHTED_FEATURES;

  return (
    <div className={cn("plan", plan.variant && PLAN_VARIANT_CLASS[plan.variant])} data-r="">
      <div className="plan-top">
        <span className="mono">{plan.tagline}</span>
        {plan.badge ? <span className="badge">{plan.badge}</span> : null}
      </div>
      <h3 className="t1">{plan.name}</h3>
      <div className="price">
        <b className="t1">{plan.price}</b>
        <span>{plan.period}</span>
      </div>
      <p className="sub">{plan.subtitle}</p>
      <ul>
        {plan.features.map((feature, index) => (
          <li key={feature} className={highlighted.includes(index) ? "hl" : undefined}>
            <CheckIcon />
            {feature}
          </li>
        ))}
      </ul>
      <a
        className={cn("btn", `btn-${plan.ctaTone}`)}
        href={SIGN_UP_URL}
        {...trackProps("pricing_plan_click", { plan: plan.id })}
      >
        {plan.ctaLabel}
        {plan.ctaTone === "ghost" ? null : (
          <>
            {" "}
            <Arrow />
          </>
        )}
      </a>
    </div>
  );
}

export function PricingSection({ copy }: { copy: PricingCopy }) {
  return (
    <section className="sec how" id="pricing">
      <div className="wrap">
        <MetaRow left={copy.meta} right={copy.metaRight} />
        <div className="sec-head">
          <CopyHeading className="h2 t1" heading={copy.heading} />
          <p className="lead" data-r="">
            {copy.lead}
          </p>
        </div>
        <div className="plans plans--4">
          {copy.plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
        <p className="plans-note" data-r="">
          {copy.note}
        </p>
      </div>
    </section>
  );
}
