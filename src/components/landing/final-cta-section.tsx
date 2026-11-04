import Image from "next/image";
import { FormDialogTrigger } from "@/components/landing/form-dialog-trigger";
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
        <LinesHeading className="t1" lines={["Перевірте", <em key="accent">на собі</em>]} />
        <p className="lead" data-r="">
          Введіть номер — агент зателефонує за 20 секунд. Для першого тесту достатньо одного
          сценарію і вашого телефону.
        </p>
        <FinalCallForm />
        <div className="final-alt" data-r="">
          <FormDialogTrigger kind="lead" source="landing_final_cta" className="btn btn-ghost">
            Або забронювати демо з менеджером
          </FormDialogTrigger>
        </div>
      </div>
    </section>
  );
}
