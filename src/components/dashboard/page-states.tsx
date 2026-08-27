"use client";

import React from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui";

interface PageLoadingProps {
  message?: string;
}

export const PageLoading = ({ message }: PageLoadingProps) => {
  return (
    <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-3">
      <Loader2 className="text-primary h-8 w-8 animate-spin" />
      {message && <p className="text-muted-foreground text-sm">{message}</p>}
    </div>
  );
};

interface PageErrorProps {
  message?: string;
  onRetry?: () => void;
}

export const PageError = ({ message, onRetry }: PageErrorProps) => {
  return (
    <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-4">
      <div className="bg-destructive/10 rounded-full p-3">
        <AlertCircle className="text-destructive h-6 w-6" />
      </div>
      <p className="text-muted-foreground text-sm">{message ?? "Щось пішло не так."}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Спробувати ще раз
        </Button>
      )}
    </div>
  );
};

interface PageEmptyProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export const PageEmpty = ({ icon: Icon, title, description, action }: PageEmptyProps) => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <Icon className="text-primary h-10 w-10" />
      <div className="text-center">
        <h3 className="text-2xl font-medium">{title}</h3>
        {description && description}
      </div>
      {action}
    </div>
  );
};
