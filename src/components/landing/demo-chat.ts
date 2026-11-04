import type { Speaker } from "@/components/landing/data";
import type { DemoScenario } from "@/components/landing/demo-scenarios";

const TYPING_LEAD_SECONDS = 1.2;

export interface ChatMessage {
  readonly id: string;
  readonly speaker: Speaker;
  readonly typing: boolean;
  readonly text: string;
}

interface ChatInput {
  readonly scenario: DemoScenario;
  readonly scenarioIndex: number;
  readonly currentTime: number;
  readonly playing: boolean;
}

export function buildChatMessages({
  scenario,
  scenarioIndex,
  currentTime,
  playing,
}: ChatInput): ChatMessage[] {
  if (currentTime <= 0 && !playing) return [];

  const spoken = scenario.chat.filter((line) => line.at <= currentTime);
  const messages: ChatMessage[] = spoken.map((line, lineIndex) => ({
    id: `${scenarioIndex}-${lineIndex}`,
    speaker: line.speaker,
    typing: false,
    text: line.text,
  }));

  const next = scenario.chat[spoken.length];
  if (playing && next && next.at - currentTime <= TYPING_LEAD_SECONDS) {
    messages.push({
      id: `${scenarioIndex}-${spoken.length}-typing`,
      speaker: next.speaker,
      typing: true,
      text: "",
    });
  }

  return messages;
}
