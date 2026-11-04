import type { DemoLine } from "@/components/landing/demo-scenarios/types";

export const agent = (at: number, text: string): DemoLine => ({ speaker: "agent", at, text });

export const client = (at: number, text: string): DemoLine => ({ speaker: "client", at, text });
