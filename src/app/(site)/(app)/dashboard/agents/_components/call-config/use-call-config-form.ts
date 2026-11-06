import { useCallback, useMemo } from "react";
import type { SetValueConfig } from "react-hook-form";

import type { CallField, CallTypeId } from "@/lib/call-config/schema";
import type { CallConfigValue } from "@/lib/call-config/value";

interface CallConfigForm {
  watch(name: "callType"): CallTypeId | null;
  watch(name: "callFields"): CallField[];
  watch(name: "instructions"): string;
  setValue(name: "callType", value: CallTypeId | null, options?: SetValueConfig): void;
  setValue(name: "callFields", value: CallField[], options?: SetValueConfig): void;
  setValue(name: "instructions", value: string, options?: SetValueConfig): void;
}

const UPDATE_OPTIONS: SetValueConfig = { shouldDirty: true, shouldValidate: true };

export const useCallConfigForm = (form: CallConfigForm) => {
  const { watch, setValue } = form;
  const callType = watch("callType");
  const callFields = watch("callFields");
  const instructions = watch("instructions");

  const value = useMemo<CallConfigValue>(
    () => ({ callType, callFields, instructions }),
    [callType, callFields, instructions]
  );

  const onChange = useCallback(
    (next: CallConfigValue): void => {
      setValue("callType", next.callType, UPDATE_OPTIONS);
      setValue("callFields", next.callFields, UPDATE_OPTIONS);
      setValue("instructions", next.instructions, UPDATE_OPTIONS);
    },
    [setValue]
  );

  return { value, onChange };
};
