import {
  createAgentBaseSchema,
  contactBaseIsProvided,
  type CreateAgentFormData,
} from "@/lib/schemas";

export const TOTAL_STEPS = 5;

export const STEP_FIELDS: (keyof CreateAgentFormData)[][] = [
  ["name", "voice"],
  ["contactBase"],
  [],
  [],
  ["instructions"],
];

const STEP_SCHEMAS = STEP_FIELDS.map((fields) => {
  if (fields.length === 0) return null;

  const mask = fields.reduce(
    (shape, field) => ({ ...shape, [field]: true }),
    {} as Partial<Record<keyof CreateAgentFormData, true>>
  );

  return createAgentBaseSchema.pick(mask);
});

export const isStepValid = (step: number, values: Partial<CreateAgentFormData>): boolean => {
  const schema = STEP_SCHEMAS[step];
  if (!schema) return true;

  if (!schema.safeParse(values).success) return false;
  if (STEP_FIELDS[step].includes("contactBase")) return contactBaseIsProvided(values);

  return true;
};
