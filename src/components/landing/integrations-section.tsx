import type { IntegrationsCopy } from "@/components/landing/copy/types";
import { CopyHeading, MetaRow } from "@/components/landing/typography";

export function IntegrationsSection({ copy }: { copy: IntegrationsCopy }) {
  return (
    <section className="sec sec--flush">
      <div className="wrap">
        <MetaRow left={copy.meta} right={copy.metaRight} />
        <div className="sec-head">
          <CopyHeading className="h2 t1" heading={copy.heading} />
          <p className="lead" data-r="">
            {copy.lead}
          </p>
        </div>
        <div className="integ">
          {copy.items.map((item) => (
            <div data-r="" key={item.title}>
              <h3 className="t1">{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
