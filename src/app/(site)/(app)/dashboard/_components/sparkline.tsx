import type { DayStats } from "@dashboard/types";
const WIDTH = 200;
const HEIGHT = 40;
const PERCENT = 100;
const SERIES_LENGTH = 8;
export const Sparkline = ({ days }: { days: DayStats[] }) => {
  const values = days.slice(-SERIES_LENGTH).map((day) => day.talk_minutes ?? 0);
  if (values.length < 2) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values.map((value, index): [number, number] => [
    (index / (values.length - 1)) * WIDTH,
    HEIGHT - 4 - ((value - min) / range) * (HEIGHT - 10),
  ]);
  const curve = points.reduce((path, [x, y], index) => {
    if (index === 0) return `M${x} ${y}`;
    const [prevX, prevY] = points[index - 1];
    const midX = (prevX + x) / 2;
    return `${path} C${midX} ${prevY} ${midX} ${y} ${x} ${y}`;
  }, "");
  const lastY = points[points.length - 1][1];
  return (
    <div className="text-primary relative h-10 w-full">
      <svg
        className="size-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sparkline-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity=".18" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${curve} L${WIDTH} ${HEIGHT} L0 ${HEIGHT} Z`} fill="url(#sparkline-fill)" />
        <path
          d={curve}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <i
        className="bg-primary ring-card absolute right-0 size-2.5 -translate-y-1/2 rounded-full ring-2"
        style={{ top: `${((lastY / HEIGHT) * PERCENT).toFixed(1)}%` }}
      />
    </div>
  );
};
