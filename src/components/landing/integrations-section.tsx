import { INTEGRATIONS } from "@/components/landing/content";
import { LinesHeading, MetaRow } from "@/components/landing/typography";

export function IntegrationsSection() {
  return (
    <section className="sec sec--flush">
      <div className="wrap">
        <MetaRow left="(07) Інтеграції" right="Працює з вашими інструментами" />
        <div className="sec-head">
          <LinesHeading
            className="h2 t1"
            lines={["Нічого не треба", <em key="accent">перебудовувати</em>]}
          />
          <p className="lead" data-r="">
            Після дзвінка агент передає статус, підсумок і запис у CRM, таблицю або вашу систему
            автоматизації.
          </p>
        </div>
        <div className="integ">
          {INTEGRATIONS.map((item) => (
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
