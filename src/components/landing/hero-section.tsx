import { SIGN_UP_URL } from "@/components/landing/data";
import { HeroCallCard } from "@/components/landing/hero-call-card";
import { HeroWave } from "@/components/landing/hero-wave";
import { PlayIcon, StrokeIcon, type StrokeIconName } from "@/components/landing/icons";
import { Arrow, CountValue, countLetters, SplitLetters } from "@/components/landing/typography";

const HERO_TITLE_LINES = ["ШІ-агент", "дзвонить", " за вас"] as const;
const [FIRST_LINE_OFFSET, SECOND_LINE_OFFSET, THIRD_LINE_OFFSET] = HERO_TITLE_LINES.reduce<
  number[]
>(
  (offsets, line, index) => [
    ...offsets,
    index === 0 ? 0 : offsets[index - 1] + countLetters(HERO_TITLE_LINES[index - 1]),
  ],
  []
);

const HERO_CHIPS: readonly { icon: StrokeIconName; label: string }[] = [
  { icon: "clock", label: "Запуск за 1 день" },
  { icon: "link", label: "Інтеграція з CRM" },
  { icon: "phone", label: "Дзвінки 24/7" },
];

export function HeroSection() {
  return (
    <section className="hero2" id="hero">
      <div className="stage">
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

        <h1 className="hero-title t1">
          <span className="sr-only">ШІ-агент дзвонить за вас</span>
          <span className="ln" aria-hidden="true">
            <span>
              <SplitLetters text={HERO_TITLE_LINES[0]} startIndex={FIRST_LINE_OFFSET} />
            </span>
          </span>
          <span className="ln" aria-hidden="true">
            <span>
              <em>
                <SplitLetters text={HERO_TITLE_LINES[1]} startIndex={SECOND_LINE_OFFSET} />
              </em>
              <br className="br-m" />
              <SplitLetters text={HERO_TITLE_LINES[2]} startIndex={THIRD_LINE_OFFSET} />
            </span>
          </span>
        </h1>

        <div className="hero-grid">
          <div className="hero-left">
            <div className="big70 t1">
              <CountValue value={70} animated={false} />
              <sup>%</sup>
            </div>
            <div className="hero-copy">
              <p>
                <strong>часу менеджера звільняється.</strong> Агент сам телефонує клієнтам, уточнює
                деталі й передає результат у CRM. Без програмістів і ручного обдзвону.
              </p>
              <div className="hero-btns">
                <a className="btn btn-blue" href={SIGN_UP_URL}>
                  Спробувати безкоштовно <Arrow />
                </a>
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
