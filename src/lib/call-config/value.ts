import { getCallTypeDefinition } from "./defaults";
import { areCallFieldsEqual, type CallField, type CallTypeId } from "./schema";

export interface CallConfigValue {
  callType: CallTypeId | null;
  callFields: CallField[];
  instructions: string;
}

export const buildCallConfigValue = (callType: CallTypeId): CallConfigValue => {
  const { instructions, fields } = getCallTypeDefinition(callType).defaults;

  return { callType, callFields: fields, instructions };
};

export const isCallConfigBlank = ({
  callType,
  callFields,
  instructions,
}: CallConfigValue): boolean =>
  callType === null && callFields.length === 0 && instructions.trim() === "";

export const hasUnsavedCallConfigChanges = (value: CallConfigValue): boolean => {
  if (value.callType === null) return !isCallConfigBlank(value);

  const defaults = getCallTypeDefinition(value.callType).defaults;
  const isInstructionsEdited =
    value.instructions.trim() !== "" && value.instructions !== defaults.instructions;

  return isInstructionsEdited || !areCallFieldsEqual(value.callFields, defaults.fields);
};
