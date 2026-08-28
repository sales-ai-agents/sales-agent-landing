"use client";

import { useState, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Label,
  Badge,
} from "@/components/ui";
import {
  useTeam,
  useInviteTeamMember,
  useUpdateTeamMemberRole,
  useRemoveTeamMember,
} from "@dashboard/hooks";
import { handleMutationError } from "@/lib/mutation-error";
import type { TeamRole } from "@dashboard/types";

const ROLE_LABELS: Record<TeamRole, string> = {
  owner: "Власник",
  admin: "Адмін",
  viewer: "Тільки перегляд",
};

const ROLE_OPTIONS = [
  { value: "admin", label: "Адмін" },
  { value: "viewer", label: "Тільки перегляд" },
];

export const Team = () => {
  const { data: members = [] } = useTeam();

  const inviteMember = useInviteTeamMember();
  const updateRole = useUpdateTeamMemberRole();
  const removeMember = useRemoveTeamMember();

  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "viewer">("viewer");

  const selectedLabel = ROLE_OPTIONS.find((opt) => opt.value === inviteRole)?.label;

  const handleInvite = useCallback(() => {
    inviteMember.mutate(
      { email: inviteEmail, name: inviteName || undefined, role: inviteRole },
      {
        onSuccess: () => {
          toast.success("Запрошення надіслано");
          setShowInviteDialog(false);
          setInviteEmail("");
          setInviteName("");
        },
        onError: (err) => handleMutationError(err),
      }
    );
  }, [inviteMember, inviteEmail, inviteName, inviteRole]);

  const handleRoleChange = useCallback(
    (id: number, role: "admin" | "viewer") => {
      updateRole.mutate(
        { id, role },
        {
          onSuccess: () => toast.success("Роль оновлено"),
          onError: (err) => handleMutationError(err),
        }
      );
    },
    [updateRole]
  );

  const handleRemove = useCallback(
    (id: number) => {
      removeMember.mutate(id, {
        onSuccess: () => toast.success("Користувача видалено"),
        onError: (err) => handleMutationError(err),
      });
    },
    [removeMember]
  );

  return (
    <section className="border-border bg-background rounded-2xl border p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Команда / ролі</h2>
          <p className="text-muted-foreground mt-1 text-xs">
            Додавайте користувачів і керуйте їхніми ролями в акаунті
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setShowInviteDialog(true)}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Додати користувача
        </Button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-2 py-2 text-left font-medium">Користувач</th>
              <th className="px-2 py-2 text-left font-medium">Email</th>
              <th className="px-2 py-2 text-left font-medium">Роль</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b last:border-0">
                <td className="px-2 py-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white">
                      {(member.name || member.email).slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium">{member.name || member.email}</span>
                    {member.role === "owner" && (
                      <Badge variant="secondary" className="text-xs">
                        Ви
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="text-muted-foreground px-2 py-3">{member.email}</td>
                <td className="px-2 py-3">
                  {member.role === "owner" ? (
                    <span className="text-sm">{ROLE_LABELS.owner}</span>
                  ) : (
                    <Select
                      value={member.role}
                      onValueChange={(val) =>
                        handleRoleChange(member.id, val as "admin" | "viewer")
                      }
                    >
                      <SelectTrigger className="w-auto text-sm">
                        <SelectValue>{ROLE_LABELS[member.role]}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </td>
                <td className="px-2 py-3">
                  {member.role !== "owner" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500"
                      onClick={() => handleRemove(member.id)}
                      aria-label="Видалити"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-muted-foreground mt-3 text-xs">
        Роль &quot;Адмін&quot; має повний доступ до налаштувань та управління командою
      </p>

      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Запросити користувача</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label className="text-xs">Email</Label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Ім&apos;я (необов&apos;язково)</Label>
              <Input
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Ім'я"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Роль</Label>
              <Select
                value={inviteRole}
                onValueChange={(val) => setInviteRole(val as "admin" | "viewer")}
              >
                <SelectTrigger className="h-10! w-full rounded-md">
                  <SelectValue>{selectedLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Скасувати
            </Button>
            <Button onClick={handleInvite} disabled={!inviteEmail || inviteMember.isPending}>
              {inviteMember.isPending ? "Запрошення..." : "Запросити"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
