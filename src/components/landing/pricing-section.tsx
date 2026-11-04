import { cn } from "@/lib/utils";
import { SIGN_UP_URL } from "@/components/landing/data";
import type { PricingCopy, PricingPlanCopy } from "@/components/landing/copy/types";
import { CheckIcon } from "@/components/landing/icons";
import { Arrow, CopyHeading, MetaRow } from "@/components/landing/typography";

function PlanCard({ plan, perMonth }: { plan: PricingPlanCopy; perMonth: string }) {
  return (
    <div className={cn("plan", plan.featured && "hot")} data-r="">
      <div className="plan-top">
        <span className="mono">{plan.tagline}</span>
        {plan.badge ? <span className="badge">{plan.badge}</span> : null}
      </div>
      <h3 className="t1">{plan.name}</h3>
      <div className="price">
        <b className="t1">{plan.price}</b>
        <span>{perMonth}</span>
      </div>
      <p className="sub">{plan.subtitle}</p>
      <ul>
        {plan.features.map((feature, index) => (
          <li key={feature} className={index === 0 ? "hl" : undefined}>
            <CheckIcon />
            {feature}
          </li>
        ))}
      </ul>
      <a className={cn("btn", `btn-${plan.ctaTone}`)} href={SIGN_UP_URL}>
        {plan.ctaLabel}
        {plan.ctaTone === "white" ? (
          <>
            {" "}
            <Arrow />
          </>
        ) : null}
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
        <div className="plans">
          {copy.plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} perMonth={copy.perMonth} />
          ))}
        </div>
        <p className="plans-note" data-r="">
          {copy.note}
        </p>
      </div>
    </section>
  );
}
