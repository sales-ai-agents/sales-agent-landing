"use client";

import { useState } from "react";
import { KeyRound, Trash2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Badge,
} from "@/components/ui";
import { useApiKeys, useCreateApiKey, useDeleteApiKey } from "@dashboard/hooks";
import { handleMutationError } from "@/lib/mutation-error";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
};

export const ApiKeysSection = () => {
  const { data: keys = [] } = useApiKeys();
  const createKey = useCreateApiKey();
  const deleteKey = useDeleteApiKey();

  const [showDialog, setShowDialog] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    createKey.mutate(
      { name: newKeyName || undefined },
      {
        onSuccess: (res) => {
          setCreatedKey(res.key);
          setNewKeyName("");
        },
        onError: (err) => handleMutationError(err),
      }
    );
  };

  const handleCopy = () => {
    if (!createdKey) return;
    navigator.clipboard.writeText(createdKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClose = () => {
    setShowDialog(false);
    setCreatedKey(null);
    setNewKeyName("");
    setCopied(false);
  };

  const handleDelete = (id: number) => {
    deleteKey.mutate(id, {
      onSuccess: () => toast.success("Ключ видалено"),
      onError: (err) => handleMutationError(err),
    });
  };

  if (!showKeys) {
    return (
      <div className="border-border bg-background rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 flex h-17 w-17 shrink-0 items-center justify-center rounded-full">
              <KeyRound className="text-primary h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-medium">API-ключі</p>
              <p className="text-muted-foreground mt-0.5 max-w-xs text-xs">
                Розділ для генерації та управління API-ключами для власних інтеграцій та розробки
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-primary border-primary/40"
            onClick={() => setShowKeys(true)}
          >
            Відкрити
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border-border bg-background rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">API-ключі</h3>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Генерація та управління ключами для власних інтеграцій
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowKeys(false)}>
              Згорнути
            </Button>
            <Button size="sm" onClick={() => setShowDialog(true)}>
              Новий ключ
            </Button>
          </div>
        </div>

        <div className="mt-4">
          {keys.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              Ключів ще немає. Створіть перший API-ключ.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-2 py-2 text-left font-medium">Назва</th>
                  <th className="px-2 py-2 text-left font-medium">Префікс</th>
                  <th className="px-2 py-2 text-left font-medium">Створено</th>
                  <th className="px-2 py-2 text-left font-medium">Використано</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr key={k.id} className="border-b last:border-0">
                    <td className="px-2 py-2.5 font-medium">{k.name || "—"}</td>
                    <td className="text-muted-foreground px-2 py-2.5">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {k.prefix}…
                      </Badge>
                    </td>
                    <td className="text-muted-foreground px-2 py-2.5">
                      {formatDate(k.created_at)}
                    </td>
                    <td className="text-muted-foreground px-2 py-2.5">
                      {k.last_used_at ? formatDate(k.last_used_at) : "—"}
                    </td>
                    <td className="px-2 py-2.5">
                      <button
                        onClick={() => handleDelete(k.id)}
                        className="text-muted-foreground transition-colors hover:text-red-600"
                        aria-label="Видалити ключ"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новий API-ключ</DialogTitle>
          </DialogHeader>

          {createdKey ? (
            <div className="space-y-3 py-2">
              <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                Збережіть ключ зараз — він більше не буде показаний.
              </p>
              <Label>Ваш API-ключ</Label>
              <div className="flex gap-2">
                <Input value={createdKey} readOnly className="font-mono text-xs" />
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 py-2">
              <Label htmlFor="key-name">Назва ключа (необов&apos;язково)</Label>
              <Input
                id="key-name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Наприклад: Production CRM"
              />
            </div>
          )}

          <DialogFooter>
            {createdKey ? (
              <Button onClick={handleClose}>Готово</Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleClose}>
                  Скасувати
                </Button>
                <Button onClick={handleCreate} disabled={createKey.isPending}>
                  {createKey.isPending ? "Створення..." : "Створити"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
