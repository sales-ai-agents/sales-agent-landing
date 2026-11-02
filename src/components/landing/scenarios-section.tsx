import { SCENARIOS, type Scenario } from "@/components/landing/data";
import { CheckIcon } from "@/components/landing/icons";
import { Arrow, LinesHeading } from "@/components/landing/typography";

const TOTAL = String(SCENARIOS.length).padStart(2, "0");

function ScenarioCard({ scenario }: { scenario: Scenario }) {
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

export function ScenariosSection() {
  return (
    <section className="hs" id="scenarios">
      <div className="hs-pin">
        <div className="wrap">
          <div className="meta-row mono">
            <span>(04) Готові сценарії</span>
            <span className="hs-count">
              <b>01</b> / {TOTAL}
            </span>
          </div>
          <div className="hs-title">
            <LinesHeading
              className="t1"
              lines={["Дзвінки, які агент", <em key="accent">забирає одразу</em>]}
            />
            <p className="lead">
              Не треба писати сценарій з нуля. Оберіть тип дзвінка, адаптуйте кілька фраз під бізнес
              і запускайте тест.
            </p>
          </div>
        </div>
        <div className="hs-view">
          <div className="hs-track">
            {SCENARIOS.map((scenario) => (
              <ScenarioCard key={scenario.number} scenario={scenario} />
            ))}
            <div className="hs-cta">
              <p className="t2">Почніть з готового сценарію — фрази можна змінити під ваш бізнес</p>
              <a className="btn btn-blue" href="#builder">
                Вибрати сценарій <Arrow />
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
