import Image from "next/image";
import type { FinalCtaCopy } from "@/components/landing/copy/types";
import { FormDialogTrigger } from "@/components/landing/form-dialog-trigger";
import { FinalCallForm } from "@/components/landing/final-call-form";
import { CopyHeading } from "@/components/landing/typography";

export function FinalCtaSection({ copy }: { copy: FinalCtaCopy }) {
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
          {copy.meta}
        </span>
        <CopyHeading className="t1" heading={copy.heading} />
        <p className="lead" data-r="">
          {copy.lead}
        </p>
        <FinalCallForm />
        <div className="final-alt" data-r="">
          <FormDialogTrigger kind="lead" source="landing_final_cta" className="btn btn-ghost">
            {copy.demoWithManager}
          </FormDialogTrigger>
        </div>
      </div>
    </section>
  );
}
