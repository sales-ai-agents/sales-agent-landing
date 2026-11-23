"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, type LucideIcon } from "lucide-react";

import { Button, Card } from "@/components/ui";
import { cn } from "@/lib/utils";

interface PageLoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const PageLoading = ({ message, fullScreen = false }: PageLoadingProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        fullScreen ? "h-screen" : "h-full min-h-[70vh]"
      )}
    >
      <BrandSpinner />
      <p className="text-muted-foreground text-sm">{message ?? "Завантажуємо дані..."}</p>
    </motion.div>
  );
};

const BrandSpinner = () => {
  return (
    <div className="relative flex h-14 w-14 items-center justify-center">
      <motion.span
        className="border-primary/25 absolute inset-0 rounded-full border-2"
        animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.span
        className="border-primary/25 absolute inset-0 rounded-full border-2"
        animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
      />
      <motion.span
        className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-full"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="bg-primary h-3 w-3 rounded-full" />
      </motion.span>
    </div>
  );
};

interface PageErrorProps {
  message?: string;
  onRetry?: () => void;
}

export const PageError = ({ message, onRetry }: PageErrorProps) => {
  return (
    <div className="flex h-full min-h-[70vh] flex-col items-center justify-center gap-4">
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
  icon: LucideIcon;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export const PageEmpty = ({ icon: Icon, title, description, action }: PageEmptyProps) => {
  return (
    <Card className="flex flex-col items-center gap-3 px-6 py-14">
      <span className="bg-primary/10 text-primary grid size-14 place-items-center rounded-full">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h2 className="font-heading text-2xl">{title}</h2>
      {description && <div className="text-muted-foreground max-w-md text-sm">{description}</div>}
      {action && <div className="mt-2 flex flex-wrap justify-center gap-2">{action}</div>}
    </Card>
  );
};
