const MAX_PIXEL_RATIO = 1.75;
const NARROW_WIDTH = 700;

export interface WaveState {
  width: number;
  height: number;
  gradient: CanvasGradient | null;
  energy: number;
  targetEnergy: number;
  pointerX: number;
  targetPointerX: number;
  boost: number;
  targetBoost: number;
}

export const createWaveState = (): WaveState => ({
  width: 0,
  height: 0,
  gradient: null,
  energy: 0.6,
  targetEnergy: 0.6,
  pointerX: -1,
  targetPointerX: -1,
  boost: 0,
  targetBoost: 0,
});

export function resizeWave(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  state: WaveState
): void {
  const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
  state.width = canvas.clientWidth;
  state.height = canvas.clientHeight;
  canvas.width = state.width * ratio;
  canvas.height = state.height * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const gradient = context.createLinearGradient(0, 0, state.width, 0);
  gradient.addColorStop(0, "rgba(22,89,255,.1)");
  gradient.addColorStop(0.5, "rgba(22,89,255,1)");
  gradient.addColorStop(1, "rgba(22,89,255,.1)");
  state.gradient = gradient;
}

const easeState = (state: WaveState): void => {
  state.energy += (state.targetEnergy - state.energy) * 0.05;
  state.boost += (state.targetBoost - state.boost) * 0.08;
  state.pointerX =
    state.pointerX < 0
      ? state.targetPointerX
      : state.pointerX + (state.targetPointerX - state.pointerX) * 0.15;
};

const barHeight = (
  state: WaveState,
  index: number,
  count: number,
  x: number,
  time: number
): number => {
  const unit = index / count;
  const envelope = Math.pow(Math.sin(Math.PI * unit), 1.6);
  const signal =
    Math.sin(unit * 22 + time * 0.0021) * 0.5 +
    Math.sin(unit * 51 - time * 0.0033) * 0.3 +
    Math.sin(unit * 7 + time * 0.0011) * 0.4;
  const sigma = Math.max(60, state.width * 0.06);
  const near = state.boost * Math.exp(-((x - state.pointerX) ** 2) / (2 * sigma * sigma));
  const { height, energy } = state;
  return Math.max(
    2,
    Math.abs(signal) * envelope * height * 0.44 * energy * (1 + near * 1.2) +
      envelope * 4 +
      near * height * 0.1
  );
};

export function drawWave(context: CanvasRenderingContext2D, state: WaveState, time: number): void {
  easeState(state);
  context.clearRect(0, 0, state.width, state.height);
  const gap = state.width < NARROW_WIDTH ? 6 : 8;
  const barWidth = state.width < NARROW_WIDTH ? 2.5 : 3.5;
  const count = Math.floor(state.width / gap);
  const middle = state.height / 2;
  context.fillStyle = state.gradient ?? "#1659ff";
  context.beginPath();
  for (let index = 0; index < count; index++) {
    const x = index * gap + gap / 2;
    const height = barHeight(state, index, count, x, time);
    if (context.roundRect)
      context.roundRect(x - barWidth / 2, middle - height, barWidth, height * 2, barWidth / 2);
    else context.rect(x - barWidth / 2, middle - height, barWidth, height * 2);
  }
  context.fill();
}
