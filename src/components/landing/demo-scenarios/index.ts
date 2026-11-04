import { COLD_CALL_SCENARIO } from "@/components/landing/demo-scenarios/cold-call";
import { DELIVERY_LVIV_SCENARIO } from "@/components/landing/demo-scenarios/delivery-lviv";
import { DELIVERY_RIVNE_SCENARIO } from "@/components/landing/demo-scenarios/delivery-rivne";
import { LOGISTICS_SCENARIO } from "@/components/landing/demo-scenarios/logistics";
import type { DemoScenario } from "@/components/landing/demo-scenarios/types";

export type { DemoLine, DemoScenario } from "@/components/landing/demo-scenarios/types";

export const DEMO_SCENARIOS: readonly DemoScenario[] = [
  LOGISTICS_SCENARIO,
  DELIVERY_LVIV_SCENARIO,
  COLD_CALL_SCENARIO,
  DELIVERY_RIVNE_SCENARIO,
];
