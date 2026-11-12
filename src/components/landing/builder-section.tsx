import { trackProps } from "@/components/landing/click-tracking";
import { SIGN_UP_URL } from "@/components/landing/data";
import type { BuilderSectionCopy } from "@/components/landing/copy/types";
import { BuilderCard } from "@/components/landing/builder-card";
import { CheckIcon } from "@/components/landing/icons";
import { Arrow, CopyHeading, MetaRow } from "@/components/landing/typography";

export function BuilderSection({ copy }: { copy: BuilderSectionCopy }) {
  return (
    <section className="sec how" id="builder">
      <div className="wrap">
        <MetaRow left={copy.meta} right={copy.metaRight} />
        <div className="sec-head">
          <CopyHeading className="h2 t1" heading={copy.heading} />
          <p className="lead" data-r="">
            {copy.lead}
          </p>
        </div>

        <div className="steps">
          {copy.steps.map((step) => (
            <div className="step" data-r="" key={step.number}>
              <span className="n t1">{step.number}</span>
              <div>
                <h3 className="t2">{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="builder">
          <div data-r="">
            <h3 className="h3 t1">
              {copy.builderTitle}
              <br />
              <em>{copy.builderAccent}</em>
            </h3>
            <ul className="ticks">
              {copy.checklist.map((item) => (
                <li key={item}>
                  <i>
                    <CheckIcon />
                  </i>
                  {item}
                </li>
              ))}
            </ul>
            <a
              className="btn btn-blue"
              href={SIGN_UP_URL}
              {...trackProps("signup_click", { location: "landing_builder" })}
            >
              {copy.signUp} <Arrow />
            </a>
          </div>
          <BuilderCard />
        </div>
      </div>
    </section>
  );
}
