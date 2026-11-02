import Link from "next/link";
import { BUILDER_CHECKLIST, ONBOARDING_STEPS, SIGN_UP_URL } from "@/components/landing/data";
import { BuilderCard } from "@/components/landing/builder-card";
import { CheckIcon } from "@/components/landing/icons";
import { Arrow, LinesHeading, MetaRow } from "@/components/landing/typography";

export function BuilderSection() {
  return (
    <section className="sec how" id="builder">
      <div className="wrap">
        <MetaRow left="(05) Як запустити" right="Без коду і програмістів" />
        <div className="sec-head">
          <LinesHeading
            className="h2 t1"
            lines={["4 кроки до", <em key="accent">першого дзвінка</em>]}
          />
          <p className="lead" data-r="">
            Оберіть сценарій, налаштуйте голос, додайте контакти і перевірте дзвінок на собі перед
            запуском.
          </p>
        </div>

        <div className="steps">
          {ONBOARDING_STEPS.map((step) => (
            <div className="step" data-r="" key={step.number}>
              <span className="n t1">{step.number}</span>
              <div>
                <h4 className="t2">{step.title}</h4>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="builder">
          <div data-r="">
            <h3 className="h3 t1">
              Конструктор агента
              <br />
              <em>без коду</em>
            </h3>
            <ul className="ticks">
              {BUILDER_CHECKLIST.map((item) => (
                <li key={item}>
                  <i>
                    <CheckIcon />
                  </i>
                  {item}
                </li>
              ))}
            </ul>
            <Link className="btn btn-blue" href={SIGN_UP_URL}>
              Спробувати безкоштовно <Arrow />
            </Link>
          </div>
          <BuilderCard />
        </div>
      </div>
    </section>
  );
}
