import type { VideoSectionCopy } from "@/components/landing/copy/types";
import { VideoPlayer } from "@/components/landing/video-player";
import { CopyHeading, MetaRow } from "@/components/landing/typography";

export function VideoSection({ copy }: { copy: VideoSectionCopy }) {
  return (
    <section className="sec sec--flush" id="video">
      <div className="wrap">
        <MetaRow left={copy.meta} right={copy.metaRight} />
        <div className="sec-head">
          <CopyHeading className="h2 t1" heading={copy.heading} />
          <p className="lead" data-r="">
            {copy.lead}
          </p>
        </div>
        <VideoPlayer />
      </div>
    </section>
  );
}
