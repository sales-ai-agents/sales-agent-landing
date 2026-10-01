"use client";

import { useEffect, useState } from "react";

const THEME_COLOR_VARS = {
  primary: "--color-primary",
  success: "--color-success",
  warning: "--color-warning",
  mutedForeground: "--color-muted-foreground",
  border: "--color-border",
  popover: "--color-popover",
} as const;

export type ThemeColorKey = keyof typeof THEME_COLOR_VARS;
export type ThemeColors = Record<ThemeColorKey, string>;

const readThemeColors = (): ThemeColors => {
  const styles = getComputedStyle(document.documentElement);
  const entries = Object.entries(THEME_COLOR_VARS).map(([key, cssVar]) => {
    return [key, styles.getPropertyValue(cssVar).trim()];
  });
  return Object.fromEntries(entries) as ThemeColors;
};

const EMPTY_COLORS: ThemeColors = {
  primary: "",
  success: "",
  warning: "",
  mutedForeground: "",
  border: "",
  popover: "",
};

const getInitialColors = (): ThemeColors => {
  if (typeof document === "undefined") return EMPTY_COLORS;
  return readThemeColors();
};

export const useThemeColors = (): ThemeColors => {
  const [colors, setColors] = useState<ThemeColors>(getInitialColors);

  useEffect(() => {
    const observer = new MutationObserver(() => setColors(readThemeColors()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return colors;
};
