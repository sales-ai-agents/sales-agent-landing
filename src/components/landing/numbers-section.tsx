import { STAT_CARDS } from "@/components/landing/data";
import { CountValue, MetaRow } from "@/components/landing/typography";

export function NumbersSection() {
  return (
    <section className="sec sec--intro">
      <div className="wrap">
        <MetaRow left="(03) У цифрах" right="Що отримує бізнес" />
        <div className="nums">
          {STAT_CARDS.map((stat) => (
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
