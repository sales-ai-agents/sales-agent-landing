"use client";

import { useState, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
import { SettingsSection } from "./settings-section";
import { TEAM_ERROR_MESSAGES } from "@/lib/error-messages";
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
        onError: (err) => handleMutationError(err, TEAM_ERROR_MESSAGES),
      }
    );
  }, [inviteMember, inviteEmail, inviteName, inviteRole]);

  const handleRoleChange = useCallback(
    (id: number, role: "admin" | "viewer") => {
      updateRole.mutate(
        { id, role },
        {
          onSuccess: () => toast.success("Роль оновлено"),
          onError: (err) => handleMutationError(err, TEAM_ERROR_MESSAGES),
        }
      );
    },
    [updateRole]
  );

  const handleRemove = useCallback(
    (id: number) => {
      removeMember.mutate(id, {
        onSuccess: () => toast.success("Користувача видалено"),
        onError: (err) => handleMutationError(err, TEAM_ERROR_MESSAGES),
      });
    },
    [removeMember]
  );

  return (
    <SettingsSection
      title="Команда / ролі"
      description="Додавайте користувачів і керуйте їхніми ролями в акаунті"
      action={
        <Button variant="outline" size="sm" onClick={() => setShowInviteDialog(true)}>
          <Plus aria-hidden="true" />
          Додати користувача
        </Button>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Користувач</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Роль</TableHead>
            <TableHead className="w-10">
              <span className="sr-only">Дії</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                      {(member.name || member.email).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{member.name || member.email}</span>
                  {member.role === "owner" && <Badge variant="secondary">Ви</Badge>}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{member.email}</TableCell>
              <TableCell>
                {member.role === "owner" ? (
                  <span className="text-sm">{ROLE_LABELS.owner}</span>
                ) : (
                  <Select
                    value={member.role}
                    onValueChange={(val) => handleRoleChange(member.id, val as "admin" | "viewer")}
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
              </TableCell>
              <TableCell>
                {member.role !== "owner" && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive"
                    onClick={() => handleRemove(member.id)}
                    aria-label="Видалити"
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-muted-foreground text-xs">
        Роль &quot;Адмін&quot; має повний доступ до налаштувань та управління командою
      </p>
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Запросити користувача</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Ім&apos;я (необов&apos;язково)</Label>
              <Input
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Ім'я"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Роль</Label>
              <Select
                value={inviteRole}
                onValueChange={(val) => setInviteRole(val as "admin" | "viewer")}
              >
                <SelectTrigger className="w-full">
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
    </SettingsSection>
  );
};
