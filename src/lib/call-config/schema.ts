import { z } from "zod";

export const CALL_TYPE_IDS = ["booking", "support", "sales"] as const;
export type CallTypeId = (typeof CALL_TYPE_IDS)[number];

export const CALL_FIELD_TYPES = ["text", "longText", "phone", "dateTime"] as const;
export type CallFieldType = (typeof CALL_FIELD_TYPES)[number];

export const CALL_FIELD_LABEL_MAX_LENGTH = 60;
export const CALL_FIELDS_MAX_COUNT = 15;

export const callFieldSchema = z.object({
  id: z.string().min(1).max(64),
  label: z
    .string()
    .trim()
    .min(1, "Вкажіть назву поля")
    .max(CALL_FIELD_LABEL_MAX_LENGTH, `Максимум ${CALL_FIELD_LABEL_MAX_LENGTH} символів`),
  type: z.enum(CALL_FIELD_TYPES),
  required: z.boolean(),
});

export type CallField = z.infer<typeof callFieldSchema>;

export const callFieldsSchema = z
  .array(callFieldSchema)
  .max(CALL_FIELDS_MAX_COUNT, `Максимум ${CALL_FIELDS_MAX_COUNT} полів`);

export interface CallTypeConfig {
  instructions: string;
  fields: CallField[];
}

export const createCallField = (overrides: Partial<CallField> = {}): CallField => ({
  id: crypto.randomUUID(),
  label: "",
  type: "text",
  required: false,
  ...overrides,
});

export const toApiCallFields = (fields: CallField[]): CallField[] =>
  fields.map(({ id, label, type, required }) => ({ id, label: label.trim(), type, required }));

export const areCallFieldsEqual = (first: CallField[], second: CallField[]): boolean =>
  JSON.stringify(toApiCallFields(first)) === JSON.stringify(toApiCallFields(second));
