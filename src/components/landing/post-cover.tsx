import Image from "next/image";
import type { CoversCopy } from "@/components/landing/copy/client-types";
import type { PostCover } from "@/content/blog/types";

const ECON_BAR_COUNT = 34;

const ECON_BARS = Array.from({ length: ECON_BAR_COUNT }, (_, index) =>
  Math.round(18 + Math.abs(Math.sin(index * 0.7) * 55 + Math.sin(index * 0.23) * 25))
);

interface PostCoverArtProps {
  cover: PostCover;
  copy: CoversCopy;
}

export function PostCoverArt({ cover, copy }: PostCoverArtProps) {
  switch (cover) {
    case "five":
      return (
        <div className="cv cv-five">
          <span className="cv-label">{copy.five.label}</span>
          <b>5</b>
          <span className="cv-bub a">{copy.five.agent}</span>
          <span className="cv-bub c">{copy.five.client}</span>
        </div>
      );
    case "econ":
      return (
        <div className="cv cv-econ">
          <span className="cv-label">{copy.econ.label}</span>
          <div className="cv-bars">
            {ECON_BARS.map((height, index) => (
              <i key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
          <b>{copy.econ.amount}</b>
          <small>{copy.econ.caption}</small>
        </div>
      );
    case "vs":
      return (
        <div className="cv cv-vs">
          <span className="cv-label">{copy.vs.label}</span>
          <b>{copy.vs.left}</b>
          <em>vs</em>
          <b>{copy.vs.right}</b>
        </div>
      );
    case "crm":
      return (
        <div className="cv cv-photo">
          <Image
            src="/image/industries-cto.png"
            alt=""
            fill
            sizes="(max-width: 720px) 100vw, 40vw"
          />
          <span className="cv-label">{copy.crm.label}</span>
          <b>{copy.crm.value}</b>
        </div>
      );
    case "myth":
      return (
        <div className="cv cv-myth">
          <span className="cv-label">{copy.myth.label}</span>
          <b>{copy.myth.value}</b>
        </div>
      );
    case "script":
      return (
        <div className="cv cv-script">
          <span className="cv-label">{copy.script.label}</span>
          <b>
            {copy.script.before}
            <em>{copy.script.accent}</em>
            {copy.script.after}
          </b>
        </div>
      );
  }
}
