import { Fragment } from "react";
import { CONTACT_PHONE_HREF, CONTACT_PHONE_LABEL } from "@/components/landing/data";
import { FAQ_ITEMS } from "@/components/landing/content";
import { LinesHeading } from "@/components/landing/typography";

export function FaqSection() {
  return (
    <section className="sec" id="faq">
      <div className="wrap">
        <div className="faq">
          <div className="faq-side">
            <span className="mono blue" data-r="">
              (12) Часті питання
            </span>
            <LinesHeading
              className="h2 t1"
              style={{ marginTop: 22 }}
              lines={[
                "Питання",
                <Fragment key="accent">
                  і <em>відповіді</em>
                </Fragment>,
              ]}
            />
            <p className="lead" data-r="">
              Не знайшли відповідь? Зателефонуйте нам — відповімо протягом робочого дня.
            </p>
            <a className="btn btn-ghost" href={CONTACT_PHONE_HREF} data-r="">
              {CONTACT_PHONE_LABEL}
            </a>
          </div>
          <div id="faqList" data-r="">
            {FAQ_ITEMS.map((item, index) => (
              <details key={item.question} open={index === 0}>
                <summary>
                  <span className="mono">{String(index + 1).padStart(2, "0")}</span>
                  <b className="t2">{item.question}</b>
                  <span className="pm" aria-hidden="true" />
                </summary>
                <div className="ans">{item.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
