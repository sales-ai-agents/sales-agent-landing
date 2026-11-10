import { Badge } from "@/components/ui";
import { CallResultIcon } from "@/components/dashboard/call-result-icon";
import { cn } from "@/lib/utils";
import { ACTION_REQUIRED_LABEL, CALL_RESULT_VISUALS } from "@dashboard/call-result";
import type { CallResult } from "@dashboard/types";

interface CallResultCardProps {
  result: CallResult;
}

const HIGHLIGHTED_FIELD_KEYS: ReadonlySet<string> = new Set(["open_questions"]);
const EMPHASIZED_FIELD_KEYS: ReadonlySet<string> = new Set(["when"]);

export const CallResultCard = ({ result }: CallResultCardProps) => {
  const { label } = CALL_RESULT_VISUALS[result.type];

  return (
    <section
      aria-labelledby="call-result-title"
      className="border-border bg-background rounded-2xl border p-5"
    >
      <div className="flex flex-wrap items-center gap-3">
        <CallResultIcon type={result.type} className="h-10 w-10" />
        <span className="text-primary text-sm font-medium">{label}</span>
        {result.action_required && <Badge variant="warning">{ACTION_REQUIRED_LABEL}</Badge>}
      </div>

      <h2 id="call-result-title" className="mt-4 text-xl leading-snug font-bold">
        {result.title}
      </h2>

      {result.fields.length > 0 && (
        <dl className="border-border mt-5 divide-y border-y">
          {result.fields.map((field, index) => (
            <div
              key={`${field.key}-${index}`}
              className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4"
            >
              <dt className="text-muted-foreground text-sm">{field.label}</dt>
              <dd
                className={cn(
                  "text-sm whitespace-pre-wrap",
                  EMPHASIZED_FIELD_KEYS.has(field.key) && "font-semibold",
                  HIGHLIGHTED_FIELD_KEYS.has(field.key) && "text-warning font-semibold"
                )}
              >
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {result.summary && (
        <div className="mt-5 space-y-1.5">
          <h3 className="text-sm font-semibold">Про розмову</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{result.summary}</p>
        </div>
      )}
    </section>
  );
};
