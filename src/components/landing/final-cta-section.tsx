import Image from "next/image";
import Link from "next/link";
import { SIGN_UP_URL } from "@/components/landing/data";
import { FinalCallForm } from "@/components/landing/final-call-form";
import { LinesHeading } from "@/components/landing/typography";

export function FinalCtaSection() {
  return (
    <section className="final">
      <div className="wrap">
        <div className="final-obj" aria-hidden="true">
          <span className="rip" />
          <span className="rip" />
          <Image
            src="/image/landing/handset-b.webp"
            alt=""
            width={863}
            height={1200}
            sizes="290px"
          />
        </div>
        <span className="mono blue" data-r="">
          (13) Ваш хід
        </span>
        <LinesHeading
          className="t1"
          style={{ marginTop: 28 }}
          lines={["Перевірте", <em key="accent">на собі</em>]}
        />
        <p className="lead" data-r="">
          Введіть номер — агент зателефонує за 20 секунд. Для першого тесту достатньо одного
          сценарію і вашого телефону.
        </p>
        <FinalCallForm />
        <div style={{ marginTop: 24 }} data-r="">
          <Link className="btn btn-ghost" href={SIGN_UP_URL}>
            Або забронювати демо з менеджером
          </Link>
        </div>
      </div>
    </section>
  );
}
