import { cn } from "@/lib/utils";
import { SIGN_UP_URL } from "@/components/landing/data";
import { PRICING_PLANS, type PricingPlan } from "@/components/landing/content";
import { CheckIcon } from "@/components/landing/icons";
import { Arrow, LinesHeading, MetaRow } from "@/components/landing/typography";

function PlanCard({ plan }: { plan: PricingPlan }) {
  return (
    <div className={cn("plan", plan.featured && "hot")} data-r="">
      <div className="plan-top">
        <span className="mono">{plan.tagline}</span>
        {plan.badge ? <span className="badge">{plan.badge}</span> : null}
      </div>
      <h3 className="t1">{plan.name}</h3>
      <div className="price">
        <b className="t1">{plan.price}</b>
        <span>/ місяць</span>
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

export function PricingSection() {
  return (
    <section className="sec how" id="pricing">
      <div className="wrap">
        <MetaRow left="(09) Тарифи" right="Оплата щомісяця · Без контрактів" />
        <div className="sec-head">
          <LinesHeading
            className="h2 t1"
            lines={["Тариф під кількість", <em key="accent">ваших дзвінків</em>]}
          />
          <p className="lead" data-r="">
            У кожному тарифі — готові хвилини розмов, ШІ-агенти і журнал дзвінків. Почніть із
            безкоштовного тестового дзвінка.
          </p>
        </div>
        <div className="plans">
          {PRICING_PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
        <p className="plans-note" data-r="">
          Оплачуєте лише використані хвилини. Сценарії, інтеграції з CRM і тестовий баланс уже
          включені.
        </p>
      </div>
    </section>
  );
}
