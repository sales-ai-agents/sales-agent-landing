"use client";

import { useState } from "react";
import { KeyRound, Trash2, Copy, Check, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
      <Card className="flex flex-row flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 flex size-14 shrink-0 items-center justify-center rounded-full">
            <KeyRound className="text-primary h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <p className="font-heading text-lg">API-ключі</p>
            <p className="text-muted-foreground mt-0.5 max-w-md text-sm">
              Розділ для генерації та управління API-ключами для власних інтеграцій та розробки
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowKeys(true)}>
          Відкрити
        </Button>
      </Card>
    );
  }

  return (
    <>
      <Card className="gap-0 overflow-hidden p-0">
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 border-b">
          <div className="flex flex-col gap-1">
            <CardTitle>API-ключі</CardTitle>
            <p className="text-muted-foreground text-sm">
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
        </CardHeader>
        <CardContent className="p-0">
          {keys.length === 0 ? (
            <p className="text-muted-foreground p-6 text-center text-sm">
              Ключів ще немає. Створіть перший API-ключ.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-2">Назва</TableHead>
                  <TableHead className="px-2">Префікс</TableHead>
                  <TableHead className="px-2">Створено</TableHead>
                  <TableHead className="px-2">Використано</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell className="px-2 py-2.5 font-medium">{k.name || "—"}</TableCell>
                    <TableCell className="text-muted-foreground px-2 py-2.5">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {k.prefix}…
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground px-2 py-2.5">
                      {formatDate(k.created_at)}
                    </TableCell>
                    <TableCell className="text-muted-foreground px-2 py-2.5">
                      {k.last_used_at ? formatDate(k.last_used_at) : "—"}
                    </TableCell>
                    <TableCell className="px-2 py-2.5">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(k.id)}
                        aria-label="Видалити ключ"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новий API-ключ</DialogTitle>
          </DialogHeader>

          {createdKey ? (
            <div className="space-y-3 py-2">
              <Alert variant="warning">
                <TriangleAlert aria-hidden="true" />
                <AlertDescription>
                  Збережіть ключ зараз — він більше не буде показаний.
                </AlertDescription>
              </Alert>
              <Label>Ваш API-ключ</Label>
              <div className="flex gap-2">
                <Input value={createdKey} readOnly className="font-mono text-xs" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  aria-label="Копіювати ключ"
                >
                  {copied ? (
                    <Check className="text-success h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
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
