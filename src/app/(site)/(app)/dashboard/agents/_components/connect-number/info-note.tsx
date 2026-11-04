import { Info } from "lucide-react";

interface InfoNoteProps {
  children: React.ReactNode;
}

export const InfoNote = ({ children }: InfoNoteProps) => (
  <div className="bg-primary/5 text-muted-foreground flex gap-2 rounded-lg p-3 text-xs">
    <Info className="text-primary h-4 w-4 shrink-0" />
    <p>{children}</p>
  </div>
);
