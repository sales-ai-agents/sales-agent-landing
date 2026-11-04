import type { Speaker } from "@/components/landing/data";

export interface DemoLine {
  readonly speaker: Speaker;
  readonly at: number;
  readonly text: string;
}

export interface DemoScenario {
  readonly id: string;
  readonly audioSrc: string;
  readonly tag: string;
  readonly title: string;
  readonly result: string;
  readonly chat: readonly DemoLine[];
}
