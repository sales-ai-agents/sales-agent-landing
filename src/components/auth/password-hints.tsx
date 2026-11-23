import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  RECOMMENDED_PASSWORD_RULES,
  REQUIRED_PASSWORD_RULE,
  type PasswordRule,
} from "@/lib/password-rules";

interface HintItemProps {
  rule: PasswordRule;
  value: string;
}

const HintItem = ({ rule, value }: HintItemProps) => {
  const passed = rule.test(value);
  return (
    <li className="flex items-center gap-3 text-sm">
      <Check
        className={cn("h-4 w-4", passed ? "text-success" : "text-muted-foreground/40")}
        aria-hidden="true"
      />
      <span className={passed ? "text-muted-foreground" : "text-muted-foreground/60"}>
        {rule.label}
      </span>
    </li>
  );
};

export const PasswordHints = ({ value }: { value: string }) => (
  <div className="space-y-3">
    <ul className="space-y-1" aria-label="Вимога до пароля">
      <HintItem rule={REQUIRED_PASSWORD_RULE} value={value} />
    </ul>
    <div>
      <p className="text-muted-foreground mb-1 text-xs">Для надійності рекомендуємо:</p>
      <ul className="space-y-1" aria-label="Рекомендації до пароля">
        {RECOMMENDED_PASSWORD_RULES.map((rule) => (
          <HintItem key={rule.label} rule={rule} value={value} />
        ))}
      </ul>
    </div>
  </div>
);
