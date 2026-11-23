import { ResultBadge, type ResultTone } from "./result-badge";
import { getOutcomeConfig, type OutcomeConfig } from "@dashboard/call-outcome";
import type { CallLog, CallResultType } from "@dashboard/types";

const IN_PROGRESS_LABEL = "Йде розмова...";
const UNSEEN_LABEL = "Не переглянуто";

const RESULT_TONES: Record<CallResultType, ResultTone> = {
  booking: "ok",
  payment: "ok",
  request: "ok",
  callback: "fw",
  needs_attention: "fw",
  not_reached: "no",
  refusal: "err",
  do_not_call: "err",
};

const OUTCOME_TONES: Record<OutcomeConfig["variant"], ResultTone> = {
  success: "ok",
  warning: "fw",
  secondary: "no",
  destructive: "err",
};

interface CallResultCellProps {
  call: CallLog;
}

export const CallResultCell = ({ call }: CallResultCellProps) => {
  const { result } = call;

  if (!result) {
    if (call.ended_at === null) return <ResultBadge tone="no" label={IN_PROGRESS_LABEL} />;
    const { label, variant } = getOutcomeConfig(call.outcome);
    return <ResultBadge tone={OUTCOME_TONES[variant]} label={label} />;
  }

  const isUnseenAction = result.action_required && call.result_seen === false;

  return (
    <span className="flex items-center gap-2">
      <ResultBadge tone={RESULT_TONES[result.type]} label={result.title} />
      {isUnseenAction && (
        <>
          <span aria-hidden="true" className="bg-primary size-2 rounded-full" />
          <span className="sr-only">{UNSEEN_LABEL}</span>
        </>
      )}
    </span>
  );
};
