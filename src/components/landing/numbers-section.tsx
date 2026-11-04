import type { NumbersCopy } from "@/components/landing/copy/types";
import { CountValue, MetaRow } from "@/components/landing/typography";

export function NumbersSection({ copy }: { copy: NumbersCopy }) {
  return (
    <section className="sec sec--intro">
      <div className="wrap">
        <MetaRow left={copy.meta} right={copy.metaRight} />
        <div className="nums">
          {copy.stats.map((stat) => (
            <div className="num" data-r="" key={stat.description}>
              <div className="v t1">
                {stat.count === undefined ? stat.value : <CountValue value={stat.count} />}
                {stat.unit ? <small>{stat.unit}</small> : null}
              </div>
              <p>{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
