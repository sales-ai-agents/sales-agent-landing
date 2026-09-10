import {
  createAgentBaseSchema,
  contactBaseIsProvided,
  type CreateAgentFormData,
  type Weekday,
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

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  mon: "Пн",
  tue: "Вт",
  wed: "Ср",
  thu: "Чт",
  fri: "Пт",
  sat: "Сб",
  sun: "Нд",
};

// BE not ready: no endpoint binds a contact base to an agent, so these mirror
// the supported integrations and are collected in the UI only.
export const CONTACT_BASE_OPTIONS = [
  { value: "google_sheets", label: "Google Sheets" },
  { value: "csv_xlsx", label: "CSV / XLSX" },
] as const;

export const DEFAULT_SCHEDULE_START = "09:00";
export const DEFAULT_SCHEDULE_END = "18:00";
