import type { SecurityCopy } from "@/components/landing/copy/types";
import { StrokeIcon } from "@/components/landing/icons";
import { CopyHeading, MetaRow } from "@/components/landing/typography";

export function SecuritySection({ copy }: { copy: SecurityCopy }) {
  return (
    <section className="sec" id="security">
      <div className="wrap">
        <MetaRow left={copy.meta} right={copy.metaRight} />
        <div className="sec-head">
          <CopyHeading className="h2 t1" heading={copy.heading} />
          <p className="lead" data-r="">
            {copy.lead}
          </p>
        </div>
        <div className="sec-grid">
          {copy.cards.map((card) => (
            <div className="scard" data-r="" key={card.title}>
              <span className="ic">
                <StrokeIcon name={card.icon} />
              </span>
              <div>
                <h3 className="t2">{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="trust" data-r="">
          {copy.badges.map((badge) => (
            <span key={badge.label}>
              <StrokeIcon name={badge.icon} />
              {badge.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
