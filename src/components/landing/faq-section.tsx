import Image from "next/image";
import { trackProps } from "@/components/landing/click-tracking";
import { CONTACT_PHONE_HREF, CONTACT_PHONE_LABEL } from "@/components/landing/data";
import type { FaqCopy } from "@/components/landing/copy/types";
import { Arrow, CopyHeading } from "@/components/landing/typography";

const FAQ_CARD_IMAGE = { src: "/image/landing/p-clinic.webp", width: 960, height: 1200 } as const;

const FAQ_CARD_SIZES = "(max-width: 1100px) 100vw, 440px";

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
            <a
              className="btn btn-ghost"
              href={CONTACT_PHONE_HREF}
              data-r=""
              {...trackProps("contact_click", { method: "phone", location: "landing_faq" })}
            >
              {CONTACT_PHONE_LABEL}
            </a>
            <a
              className="faq-card"
              href="#hero"
              data-r=""
              {...trackProps("test_call_start_click", { location: "landing_faq" })}
            >
              <Image {...FAQ_CARD_IMAGE} alt="" sizes={FAQ_CARD_SIZES} />
              <span className="faq-card-in">
                <span className="mono">{copy.card.kicker}</span>
                <b>{copy.card.title}</b>
                <span className="faq-card-go">
                  {copy.card.action} <Arrow />
                </span>
              </span>
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
