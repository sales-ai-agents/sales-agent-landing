import { SIGN_UP_URL } from "@/components/landing/data";
import type { HeroCopy } from "@/components/landing/copy/types";
import { HeroCallCard } from "@/components/landing/hero-call-card";
import { HeroWave } from "@/components/landing/hero-wave";
import { PlayIcon, StrokeIcon } from "@/components/landing/icons";
import { Arrow, CountValue, countLetters, SplitLetters } from "@/components/landing/typography";

const getLineOffsets = (lines: readonly string[]): number[] =>
  lines.reduce<number[]>(
    (offsets, _line, index) => [
      ...offsets,
      index === 0 ? 0 : offsets[index - 1] + countLetters(lines[index - 1]),
    ],
    []
  );

export function HeroSection({ copy }: { copy: HeroCopy }) {
  const [first, second, third] = copy.titleLines;
  const [firstOffset, secondOffset, thirdOffset] = getLineOffsets(copy.titleLines);

  return (
    <section className="hero2" id="hero">
      <div className="stage">
        <div className="stage-bg" aria-hidden="true">
          <span className="cols" />
          <i className="g1" />
          <i className="g2" />
        </div>

        <div className="stage-meta mono">
          <span>{copy.metaLeft}</span>
          <span>{copy.metaCenter}</span>
          <span className="live-dot">
            <i />
            {copy.metaLive}
          </span>
        </div>

        <h1 className="hero-title t1">
          <span className="sr-only">{copy.srTitle}</span>
          <span className="ln" aria-hidden="true">
            <span>
              <SplitLetters text={first} startIndex={firstOffset} />
            </span>
          </span>
          <span className="ln" aria-hidden="true">
            <span>
              <em>
                <SplitLetters text={second} startIndex={secondOffset} />
              </em>
              <br className="br-m" />
              <SplitLetters text={third} startIndex={thirdOffset} />
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
                <strong>{copy.leadStrong}</strong>
                {copy.leadRest}
              </p>
              <div className="hero-btns">
                <a className="btn btn-blue" href={SIGN_UP_URL}>
                  {copy.signUp} <Arrow />
                </a>
                <a className="btn btn-ghost" href="#demo">
                  <PlayIcon width={14} height={14} />
                  {copy.listenDemo}
                </a>
              </div>
              <div className="chips">
                {copy.chips.map((chip) => (
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
