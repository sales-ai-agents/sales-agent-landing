"use client";

import { TriangleAlert } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { CopyField } from "@/app/(site)/(app)/dashboard/agents/_components/connect-number/copy-field";

export interface RevealedSecret {
  url: string;
  secret: string;
  isReissued: boolean;
}

interface WebhookSecretDialogProps {
  revealed: RevealedSecret | null;
  onClose: () => void;
}

export const WebhookSecretDialog = ({ revealed, onClose }: WebhookSecretDialogProps) => (
  <Dialog
    open={revealed !== null}
    disablePointerDismissal
    onOpenChange={(open) => {
      if (!open) onClose();
    }}
  >
    <DialogContent showCloseButton={false} className="sm:max-w-md">
      {revealed && (
        <>
          <DialogHeader>
            <DialogTitle>
              {revealed.isReissued ? "Новий секрет вебхука" : "Вебхук підключено"}
            </DialogTitle>
            <DialogDescription className="break-all">{revealed.url}</DialogDescription>
          </DialogHeader>

          <Alert variant="warning">
            <TriangleAlert aria-hidden="true" />
            <AlertTitle>Збережіть секрет зараз</AlertTitle>
            <AlertDescription>
              <p>
                Ми показуємо його лише один раз. Вдруге його не буде, і якщо секрет загубиться,
                доведеться перевипускати.
              </p>
              {revealed.isReissued && <p>Попередній секрет більше не діє.</p>}
            </AlertDescription>
          </Alert>

          <CopyField label="Секрет" value={revealed.secret} masked />

          <p className="text-muted-foreground text-xs">
            Цим секретом перевіряється підпис запиту в заголовку{" "}
            <code className="font-mono">X-Calls4U-Signature</code>: HMAC-SHA256 від сирого тіла
            запиту.
          </p>

          <DialogFooter>
            <Button onClick={onClose}>Я зберіг секрет</Button>
          </DialogFooter>
        </>
      )}
    </DialogContent>
  </Dialog>
);
