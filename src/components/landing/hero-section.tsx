import Link from "next/link";
import { SIGN_UP_URL } from "@/components/landing/data";
import { HeroCallCard } from "@/components/landing/hero-call-card";
import { HeroWave } from "@/components/landing/hero-wave";
import { PlayIcon, StrokeIcon, type StrokeIconName } from "@/components/landing/icons";
import { Arrow, SplitLetters } from "@/components/landing/typography";

const HERO_CHIPS: readonly { icon: StrokeIconName; label: string }[] = [
  { icon: "clock", label: "Запуск за 1 день" },
  { icon: "link", label: "Інтеграція з CRM" },
  { icon: "phone", label: "Дзвінки 24/7" },
];

export function HeroSection() {
  return (
    <section className="hero2" id="hero">
      <div className="stage" id="stage">
        <div className="stage-bg" aria-hidden="true">
          <span className="cols" />
          <i className="g1" />
          <i className="g2" />
        </div>

        <div className="stage-meta mono">
          <span>(01) Голосовий ШІ-агент</span>
          <span>Україна · Дзвінки 24/7</span>
          <span className="live-dot">
            <i />
            Агент на лінії
          </span>
        </div>

        <h1 className="hero-title t1" id="heroTitle" aria-label="ШІ-агент дзвонить за вас">
          <span className="ln" aria-hidden="true">
            <span>
              <SplitLetters text="ШІ-агент" />
            </span>
          </span>
          <span className="ln" aria-hidden="true">
            <span>
              <em>
                <SplitLetters text="дзвонить" />
              </em>
              <br className="br-m" />
              <SplitLetters text=" за вас" />
            </span>
          </span>
        </h1>

        <div className="hero-grid">
          <div className="hero-left">
            <div className="big70 t1">
              <span data-count="70">70</span>
              <sup>%</sup>
            </div>
            <div className="hero-copy">
              <p>
                <strong>часу менеджера звільняється.</strong> Агент сам телефонує клієнтам, уточнює
                деталі й передає результат у CRM. Без програмістів і ручного обдзвону.
              </p>
              <div className="hero-btns">
                <Link className="btn btn-blue" href={SIGN_UP_URL}>
                  Спробувати безкоштовно <Arrow />
                </Link>
                <a className="btn btn-ghost" href="#demo">
                  <PlayIcon width={14} height={14} />
                  Прослухати демо
                </a>
              </div>
              <div className="chips">
                {HERO_CHIPS.map((chip) => (
                  <span className="chip" key={chip.label}>
                    <StrokeIcon name={chip.icon} />
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <HeroCallCard />
        </div>

        <HeroWave />
      </div>
    </section>
  );
}
