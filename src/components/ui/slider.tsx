"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: number;
  onValueChange?: (value: number) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, min = 0, max = 100, ...props }, ref) => {
    const numMin = Number(min);
    const numMax = Number(max);
    const numValue = Number(value ?? numMin);
    const percentage = ((numValue - numMin) / (numMax - numMin)) * 100;

    return (
      <input
        type="range"
        ref={ref}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onValueChange?.(Number(e.target.value))}
        className={cn(
          "accent-primary h-1.5 w-full cursor-pointer appearance-none rounded-full",
          className
        )}
        style={{
          background: `linear-gradient(to right, var(--color-primary) ${percentage}%, var(--color-slider-track) ${percentage}%)`,
        }}
        {...props}
      />
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
