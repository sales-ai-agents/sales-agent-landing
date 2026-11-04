import Image from "next/image";
import type { DemoSectionCopy } from "@/components/landing/copy/types";
import { DemoPlayer } from "@/components/landing/demo-player";
import { CopyHeading, MetaRow } from "@/components/landing/typography";

export function DemoSection({ copy }: { copy: DemoSectionCopy }) {
  return (
    <section className="demo-sec" id="demo">
      <div className="slab">
        <Image
          className="slab-ribbon"
          src="/image/landing/wave-ribbon.webp"
          alt=""
          aria-hidden="true"
          width={1800}
          height={977}
          sizes="(max-width: 1600px) 60vw, 960px"
        />
        <div className="wrap">
          <MetaRow left={copy.meta} right={copy.metaRight} />
          <div className="sec-head">
            <CopyHeading className="h2 t1" heading={copy.heading} />
            <p className="lead" data-r="">
              {copy.lead}
            </p>
          </div>
          <div className="demo-grid">
            <DemoPlayer />
          </div>
        </div>
      </div>
    </section>
  );
}
