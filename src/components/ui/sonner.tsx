"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

type SonnerCustomProperties = {
  "--normal-bg": string;
  "--normal-text": string;
  "--normal-border": string;
} & React.CSSProperties;

export function Toaster(props: ToasterProps) {
  const style: SonnerCustomProperties = {
    "--normal-bg": "var(--popover)",
    "--normal-text": "var(--popover-foreground)",
    "--normal-border": "var(--border)",
  };

  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-center"
      richColors
      closeButton
      style={style}
      {...props}
    />
  );
}
