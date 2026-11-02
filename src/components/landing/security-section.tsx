import { SECURITY_CARDS, TRUST_BADGES } from "@/components/landing/content";
import { StrokeIcon } from "@/components/landing/icons";
import { LinesHeading, MetaRow } from "@/components/landing/typography";

export function SecuritySection() {
  return (
    <section className="sec" id="security">
      <div className="wrap">
        <MetaRow left="(10) Безпека і контроль" right="Ваші дані — ваші" />
        <div className="sec-head">
          <LinesHeading
            className="h2 t1"
            lines={["Дані клієнтів", <em key="accent">лишаються у вас</em>]}
          />
          <p className="lead" data-r="">
            Ви керуєте записами, доступами і запуском дзвінків.
          </p>
        </div>
        <div className="sec-grid">
          {SECURITY_CARDS.map((card) => (
            <div className="scard" data-r="" key={card.title}>
              <span className="ic">
                <StrokeIcon name={card.icon} />
              </span>
              <div>
                <h4 className="t2">{card.title}</h4>
                <p>{card.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="trust" data-r="">
          {TRUST_BADGES.map((badge) => (
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
