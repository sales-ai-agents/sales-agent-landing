import type { ScenarioCardCopy, ScenariosCopy } from "@/components/landing/copy/types";
import { CheckIcon } from "@/components/landing/icons";
import { Arrow, CopyHeading } from "@/components/landing/typography";

function ScenarioCard({ scenario }: { scenario: ScenarioCardCopy }) {
  return (
    <article className={`sc sc--${scenario.tone}`}>
      <div className="sc-top">
        <span className="sc-n t1">{scenario.number}</span>
        <span className="sc-for mono">{scenario.audience}</span>
      </div>
      <div>
        <h3 className="t2">{scenario.title}</h3>
        <p className="sc-q">
          <span className="mono">{scenario.askLabel}</span>
          {scenario.ask}
        </p>
      </div>
      <div>
        <span className="sc-bubble">{scenario.bubble}</span>
        <span className="sc-res">
          <i>
            <CheckIcon />
          </i>
          {scenario.result}
        </span>
      </div>
    </article>
  );
}

export function ScenariosSection({ copy }: { copy: ScenariosCopy }) {
  const total = String(copy.cards.length).padStart(2, "0");

  return (
    <section className="hs" id="scenarios">
      <div className="hs-pin">
        <div className="wrap">
          <div className="meta-row mono">
            <span>{copy.meta}</span>
            <span className="hs-count">
              <b>01</b> / {total}
            </span>
          </div>
          <div className="hs-title">
            <CopyHeading className="t1" heading={copy.heading} />
            <p className="lead">{copy.lead}</p>
          </div>
        </div>
        <div className="hs-view">
          <div className="hs-track">
            {copy.cards.map((scenario) => (
              <ScenarioCard key={scenario.number} scenario={scenario} />
            ))}
            <div className="hs-cta">
              <p className="t2">{copy.ctaText}</p>
              <a className="btn btn-blue" href="#builder">
                {copy.ctaButton} <Arrow />
              </a>
            </div>
          </div>
        </div>
        <div className="wrap">
          <div className="hs-progress">
            <i />
          </div>
        </div>
      </div>
    </section>
  );
}
