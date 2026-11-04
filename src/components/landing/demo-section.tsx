import { Fragment } from "react";
import Image from "next/image";
import { DemoPlayer } from "@/components/landing/demo-player";
import { LinesHeading, MetaRow } from "@/components/landing/typography";

export function DemoSection() {
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
          <MetaRow left="(02) Послухайте самі" right="Реальні сценарії розмов" />
          <div className="sec-head">
            <LinesHeading
              className="h2 t1"
              lines={[
                "Не презентація,",
                <Fragment key="accent">
                  а <em>живий дзвінок</em>
                </Fragment>,
              ]}
            />
            <p className="lead" data-r="">
              Послухайте, як агент підтверджує запис, ставить уточнювальні питання і фіксує
              результат у кабінеті.
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
