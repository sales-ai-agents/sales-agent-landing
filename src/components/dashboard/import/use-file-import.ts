import { useRef, useState } from "react";

import { CONTACTS_IMPORT_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { usePreviewContacts } from "@dashboard/hooks";
import type { ContactsUploadPreviewResponse } from "@dashboard/types";

const NO_COLUMN = -1;
const EXTENSION_PATTERN = /\.[^.]+$/;

export const useFileImport = () => {
  const previewContacts = usePreviewContacts();
  const currentFileRef = useRef<File | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ContactsUploadPreviewResponse | null>(null);
  const [phoneColumn, setPhoneColumn] = useState(NO_COLUMN);
  const [nameColumn, setNameColumn] = useState(NO_COLUMN);

  const selectFile = (next: File | null): void => {
    currentFileRef.current = next;
    setFile(next);
    setPreview(null);
    setPhoneColumn(NO_COLUMN);
    setNameColumn(NO_COLUMN);
    if (!next) return;

    previewContacts.mutate(next, {
      onSuccess: (data) => {
        if (currentFileRef.current !== next) return;
        setPreview(data);
        setPhoneColumn(data.guess.phone);
        setNameColumn(data.guess.name);
      },
      onError: (error) => handleMutationError(error, CONTACTS_IMPORT_ERROR_MESSAGES),
    });
  };

  return {
    file,
    preview,
    phoneColumn,
    nameColumn,
    baseTitle: file ? file.name.replace(EXTENSION_PATTERN, "") : undefined,
    isPreviewing: previewContacts.isPending,
    isReady: Boolean(file && preview && phoneColumn >= 0),
    selectFile,
    setPhoneColumn,
    setNameColumn,
  };
};
