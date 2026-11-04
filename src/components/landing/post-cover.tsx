import Image from "next/image";
import type { PostCover } from "@/content/blog/types";

const ECON_BAR_COUNT = 34;

const ECON_BARS = Array.from({ length: ECON_BAR_COUNT }, (_, index) =>
  Math.round(18 + Math.abs(Math.sin(index * 0.7) * 55 + Math.sin(index * 0.23) * 25))
);

export function PostCoverArt({ cover }: { cover: PostCover }) {
  switch (cover) {
    case "five":
      return (
        <div className="cv cv-five">
          <span className="cv-label">Гайд · 5 сценаріїв</span>
          <b>5</b>
          <span className="cv-bub a">Підтверджуємо ваш запис на завтра о 14:00?</span>
          <span className="cv-bub c">Так, буду</span>
        </div>
      );
    case "econ":
      return (
        <div className="cv cv-econ">
          <span className="cv-label">Економіка · приклад</span>
          <div className="cv-bars">
            {ECON_BARS.map((height, index) => (
              <i key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
          <b>−51 480 ₴</b>
          <small>на місяць іде разом із пропущеними дзвінками</small>
        </div>
      );
    case "vs":
      return (
        <div className="cv cv-vs">
          <span className="cv-label">Порівняння</span>
          <b>Адміністратор</b>
          <em>vs</em>
          <b>ШІ-агент</b>
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
          <span className="cv-label">Інструкція</span>
          <b>1 день</b>
        </div>
      );
    case "myth":
      return (
        <div className="cv cv-myth">
          <span className="cv-label">Міфи</span>
          <b>Міф</b>
        </div>
      );
    case "script":
      return (
        <div className="cv cv-script">
          <span className="cv-label">Гайд · 7 порад</span>
          <b>
            «Добрий день! <em>Це Марія</em> із салону»
          </b>
        </div>
      );
  }
}
