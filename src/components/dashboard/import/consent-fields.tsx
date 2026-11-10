"use client";

import { Checkbox, Input, Label } from "@/components/ui";

interface ConsentFieldsProps {
  isGranted: boolean;
  source: string;
  onGrantedChange: (granted: boolean) => void;
  onSourceChange: (source: string) => void;
}

export const CONSENT_SOURCE_MAX_LENGTH = 200;

const CHECKBOX_ID = "import-consent";
const SOURCE_ID = "import-consent-source";
const SOURCE_HINT_ID = "import-consent-source-hint";

export const ConsentFields = ({
  isGranted,
  source,
  onGrantedChange,
  onSourceChange,
}: ConsentFieldsProps) => (
  <fieldset className="border-border space-y-3 rounded-lg border p-4">
    <legend className="sr-only">Згода на дзвінки</legend>

    <div className="flex items-start gap-2">
      <Checkbox
        id={CHECKBOX_ID}
        checked={isGranted}
        onCheckedChange={(checked) => onGrantedChange(checked === true)}
        className="mt-0.5"
      />
      <Label htmlFor={CHECKBOX_ID} className="text-sm leading-snug font-medium">
        Усі ці контакти дали згоду на дзвінки
      </Label>
    </div>

    {isGranted ? (
      <div className="space-y-1.5">
        <Label htmlFor={SOURCE_ID}>Звідки згода</Label>
        <Input
          id={SOURCE_ID}
          value={source}
          maxLength={CONSENT_SOURCE_MAX_LENGTH}
          placeholder="Форма на сайті, договір, CRM"
          aria-invalid={source.trim() === ""}
          aria-describedby={SOURCE_HINT_ID}
          onChange={(event) => onSourceChange(event.target.value)}
        />
        <p id={SOURCE_HINT_ID} className="text-muted-foreground text-xs">
          Збережемо в кожному контакті разом із датою й вашою поштою.
        </p>
      </div>
    ) : (
      <p className="text-muted-foreground text-xs">
        Без згоди контакти додадуться, але обдзвін їх пропустить, поки згоду не буде підтверджено.
      </p>
    )}
  </fieldset>
);
