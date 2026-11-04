import { CONTACT_PHONE_HREF, CONTACT_PHONE_LABEL } from "@/components/landing/data";
import type { FaqCopy } from "@/components/landing/copy/types";
import { CopyHeading } from "@/components/landing/typography";

export function FaqSection({ copy }: { copy: FaqCopy }) {
  return (
    <section className="sec" id="faq">
      <div className="wrap">
        <div className="faq">
          <div className="faq-side">
            <span className="mono blue" data-r="">
              {copy.meta}
            </span>
            <CopyHeading className="h2 t1" heading={copy.heading} />
            <p className="lead" data-r="">
              {copy.lead}
            </p>
            <a className="btn btn-ghost" href={CONTACT_PHONE_HREF} data-r="">
              {CONTACT_PHONE_LABEL}
            </a>
          </div>
          <div data-r="">
            {copy.items.map((item, index) => (
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
