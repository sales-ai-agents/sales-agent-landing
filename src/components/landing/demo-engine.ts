import { DEMO_SCENARIOS, type DemoScenario, type Speaker } from "@/components/landing/data";

const STEP_MS = 2300;
const TYPING_MS = 900;
const TAIL_MS = 600;
const ADVANCE_MS = 2600;
const MAX_MESSAGES = 6;

export interface ChatMessage {
  readonly id: string;
  readonly speaker: Speaker;
  readonly typing: boolean;
  readonly text: string;
}

export interface DemoSnapshot {
  readonly index: number;
  readonly playing: boolean;
  readonly progress: number;
  readonly done: boolean;
  readonly messages: readonly ChatMessage[];
}

const INITIAL_SNAPSHOT: DemoSnapshot = {
  index: 0,
  playing: false,
  progress: 0,
  done: false,
  messages: [],
};

const totalDuration = (scenario: DemoScenario): number => scenario.chat.length * STEP_MS + TAIL_MS;

export class DemoEngine {
  private snapshot: DemoSnapshot = INITIAL_SNAPSHOT;
  private readonly listeners = new Set<() => void>();
  private timers: ReturnType<typeof setTimeout>[] = [];
  private advanceTimer: ReturnType<typeof setTimeout> | undefined;
  private frame = 0;
  private shown = 0;
  private nextId = 0;
  private startedAt = 0;
  private inView = false;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): DemoSnapshot => this.snapshot;

  getServerSnapshot = (): DemoSnapshot => INITIAL_SNAPSHOT;

  setInView = (inView: boolean): void => {
    this.inView = inView;
  };

  toggle = (): void => (this.snapshot.playing ? this.stop() : this.play());

  select = (index: number): void => {
    this.load(index);
    this.play();
  };

  dispose = (): void => {
    this.clearSchedule();
    clearTimeout(this.advanceTimer);
  };

  play = (): void => {
    const scenario = DEMO_SCENARIOS[this.snapshot.index];
    clearTimeout(this.advanceTimer);
    if (this.snapshot.progress >= 1) this.resetTimeline();
    const total = totalDuration(scenario);
    const elapsed = this.snapshot.progress * total;
    this.clearSchedule();
    this.update({ playing: true });
    for (let line = this.shown; line < scenario.chat.length; line++) {
      this.schedule(() => this.showTyping(scenario, line), Math.max(0, line * STEP_MS - elapsed));
    }
    this.startedAt = performance.now() - elapsed;
    this.frame = requestAnimationFrame((time) => this.tick(time, total));
  };

  private stop = (): void => {
    this.clearSchedule();
    this.update({
      playing: false,
      messages: this.snapshot.messages.filter((message) => !message.typing),
    });
  };

  private load(index: number): void {
    this.stop();
    clearTimeout(this.advanceTimer);
    this.shown = 0;
    this.update({ index, progress: 0, done: false, messages: [] });
  }

  private resetTimeline(): void {
    this.shown = 0;
    this.update({ messages: [], progress: 0, done: false });
  }

  private tick(time: number, total: number): void {
    const progress = Math.min(1, (time - this.startedAt) / total);
    this.update({ progress });
    if (progress < 1 && this.snapshot.playing) {
      this.frame = requestAnimationFrame((next) => this.tick(next, total));
      return;
    }
    if (progress < 1) return;
    this.stop();
    this.update({ progress: 1, done: true });
    this.advanceTimer = setTimeout(() => this.advance(), ADVANCE_MS);
  }

  private advance(): void {
    if (!this.inView) return;
    this.select((this.snapshot.index + 1) % DEMO_SCENARIOS.length);
  }

  private showTyping(scenario: DemoScenario, line: number): void {
    const { speaker, text } = scenario.chat[line];
    const typingId = this.createId();
    const typing: ChatMessage = { id: typingId, speaker, typing: true, text: "" };
    this.update({ messages: [...this.snapshot.messages, typing].slice(-MAX_MESSAGES) });
    this.schedule(() => {
      const message: ChatMessage = { id: this.createId(), speaker, typing: false, text };
      this.update({
        messages: this.snapshot.messages.map((item) => (item.id === typingId ? message : item)),
      });
      this.shown = line + 1;
    }, TYPING_MS);
  }

  private schedule(callback: () => void, delay: number): void {
    this.timers.push(setTimeout(callback, delay));
  }

  private clearSchedule(): void {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  private createId(): string {
    this.nextId += 1;
    return `m${this.nextId}`;
  }

  private update(patch: Partial<DemoSnapshot>): void {
    this.snapshot = { ...this.snapshot, ...patch };
    this.listeners.forEach((listener) => listener());
  }
}
