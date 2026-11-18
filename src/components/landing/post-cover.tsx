import Image from "next/image";
import type { CoversCopy } from "@/components/landing/copy/client-types";
import type { DialogSpeaker, EmbeddedCover, PostCover, RemoteCover } from "@/content/blog/types";

const ECON_BAR_COUNT = 34;
const COVER_PHOTO_SRC = "/image/industries-cto.png";
const COVER_PHOTO_SIZES = "(max-width: 720px) 100vw, 40vw";
const BUBBLE_CLASS: Readonly<Record<DialogSpeaker, string>> = { agent: "a", client: "c" };

const ECON_BARS = Array.from({ length: ECON_BAR_COUNT }, (_, index) =>
  Math.round(18 + Math.abs(Math.sin(index * 0.7) * 55 + Math.sin(index * 0.23) * 25))
);

const EconBars = () => (
  <div className="cv-bars">
    {ECON_BARS.map((height, index) => (
      <i key={index} style={{ height: `${height}%` }} />
    ))}
  </div>
);

interface PostCoverArtProps {
  cover: PostCover;
  copy: CoversCopy;
}

export function PostCoverArt({ cover, copy }: PostCoverArtProps) {
  if (typeof cover === "string") return <EmbeddedCoverArt cover={cover} copy={copy} />;
  return <RemoteCoverArt cover={cover} />;
}

function RemoteCoverArt({ cover }: { cover: RemoteCover }) {
  const { variant, label, big, caption, left, right, bubbles = [] } = cover;
  const labelNode = <span className="cv-label">{label}</span>;

  switch (variant) {
    case "five":
      return (
        <div className="cv cv-five">
          {labelNode}
          <b>{big}</b>
          {bubbles.map((bubble) => (
            <span
              key={`${bubble.role}-${bubble.text}`}
              className={`cv-bub ${BUBBLE_CLASS[bubble.role]}`}
            >
              {bubble.text}
            </span>
          ))}
        </div>
      );
    case "econ":
      return (
        <div className="cv cv-econ">
          {labelNode}
          <EconBars />
          <b>{big}</b>
          <small>{caption}</small>
        </div>
      );
    case "vs":
      return (
        <div className="cv cv-vs">
          {labelNode}
          <b>{left}</b>
          <em>vs</em>
          <b>{right}</b>
        </div>
      );
    case "photo":
      return (
        <div className="cv cv-photo">
          <Image src={COVER_PHOTO_SRC} alt="" fill sizes={COVER_PHOTO_SIZES} />
          {labelNode}
          <b>{big}</b>
        </div>
      );
    case "myth":
    case "script":
      return (
        <div className={`cv cv-${variant}`}>
          {labelNode}
          <b>{big}</b>
        </div>
      );
  }
}

interface EmbeddedCoverArtProps {
  cover: EmbeddedCover;
  copy: CoversCopy;
}

function EmbeddedCoverArt({ cover, copy }: EmbeddedCoverArtProps) {
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
          <EconBars />
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
          <Image src={COVER_PHOTO_SRC} alt="" fill sizes={COVER_PHOTO_SIZES} />
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
