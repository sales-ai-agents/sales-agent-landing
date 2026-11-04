import {
  createAgentBaseSchema,
  contactSelectionIsValid,
  numberSelectionIsValid,
  type CallDirection,
  type CreateAgentFormData,
} from "@/lib/schemas";

export type WizardStep = "basics" | "callType" | "schedule" | "number" | "instructions";

const STEP_FIELDS: Record<WizardStep, (keyof CreateAgentFormData)[]> = {
  basics: ["name", "voice"],
  callType: ["contactIds"],
  schedule: [],
  number: ["numberId"],
  instructions: ["instructions"],
};

const ALL_STEPS: WizardStep[] = ["basics", "callType", "schedule", "number", "instructions"];

export const getWizardSteps = (callDirection: CallDirection): WizardStep[] =>
  callDirection === "inbound" ? ALL_STEPS.filter((step) => step !== "schedule") : ALL_STEPS;

export const getStepFields = (step: WizardStep): (keyof CreateAgentFormData)[] => STEP_FIELDS[step];

const STEP_SCHEMAS = ALL_STEPS.reduce(
  (schemas, step) => {
    const fields = STEP_FIELDS[step];
    if (fields.length === 0) {
      schemas[step] = null;
      return schemas;
    }

    const mask = fields.reduce(
      (shape, field) => ({ ...shape, [field]: true }),
      {} as Partial<Record<keyof CreateAgentFormData, true>>
    );
    schemas[step] = createAgentBaseSchema.pick(mask);
    return schemas;
  },
  {} as Record<WizardStep, ReturnType<typeof createAgentBaseSchema.pick> | null>
);

export const isStepValid = (step: WizardStep, values: Partial<CreateAgentFormData>): boolean => {
  const schema = STEP_SCHEMAS[step];
  if (schema && !schema.safeParse(values).success) return false;
  if (step === "callType" && !contactSelectionIsValid(values)) return false;
  if (step === "number" && !numberSelectionIsValid(values)) return false;

  return true;
};
