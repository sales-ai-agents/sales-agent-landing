"use client";

import { useEffect, useId, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";

interface DialogShellProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}

export function DialogShell({ open, title, description, onClose, children }: DialogShellProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const closeOnBackdrop = (event: MouseEvent<HTMLDialogElement>): void => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="dlg"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={closeOnBackdrop}
    >
      <div className="dlg-body">
        <button type="button" className="dlg-x" aria-label="Закрити" onClick={onClose}>
          ×
        </button>
        <h2 className="t2" id={titleId}>
          {title}
        </h2>
        {description ? <p className="dlg-lead">{description}</p> : null}
        {children}
      </div>
    </dialog>
  );
}
