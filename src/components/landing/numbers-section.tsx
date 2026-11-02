import { STAT_CARDS } from "@/components/landing/data";
import { MetaRow } from "@/components/landing/typography";

export function NumbersSection() {
  return (
    <section className="sec" style={{ paddingTop: "clamp(64px,7vw,120px)" }}>
      <div className="wrap">
        <MetaRow left="(03) У цифрах" right="Що отримує бізнес" />
        <div className="nums">
          {STAT_CARDS.map((stat) => (
            <div className="num" data-r="" key={stat.description}>
              <div className="v t1">
                {stat.count === undefined ? (
                  stat.value
                ) : (
                  <span data-count={stat.count}>{stat.value}</span>
                )}
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
