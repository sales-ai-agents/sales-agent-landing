import { Fragment } from "react";
import { VideoPlayer } from "@/components/landing/video-player";
import { LinesHeading, MetaRow } from "@/components/landing/typography";

export function VideoSection() {
  return (
    <section className="sec" id="video" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <MetaRow left="(08) Відео" right="7 хвилин про дзвінки і гроші" />
        <div className="sec-head">
          <LinesHeading
            className="h2 t1"
            lines={[
              "Де ваш бізнес втрачає",
              <Fragment key="accent">
                <em>клієнтів</em> на дзвінках
              </Fragment>,
            ]}
          />
          <p className="lead" data-r="">
            Рахуємо, скільки коштують пропущені дзвінки — до 60 000 ₴ на місяць, — і показуємо
            реальний дзвінок ШІ-агента.
          </p>
        </div>
        <VideoPlayer />
      </div>
    </section>
  );
}
