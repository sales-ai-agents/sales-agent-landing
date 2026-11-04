import type { DemoScenarioId } from "@/components/landing/copy/client-types";
import type { Speaker } from "@/components/landing/data";

export interface DemoLine {
  readonly speaker: Speaker;
  readonly at: number;
  readonly text: string;
}

export interface DemoScenario {
  readonly id: DemoScenarioId;
  readonly audioSrc: string;
  readonly chat: readonly DemoLine[];
}
