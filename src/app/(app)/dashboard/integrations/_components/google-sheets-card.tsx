"use client";

import Image from "next/image";
import { Button } from "@/components/ui";

interface GoogleSheetsCardProps {
  connected: boolean;
  email?: string;
}

export const GoogleSheetsCard = ({ connected, email }: GoogleSheetsCardProps) => {
  return (
    <div className="border-border bg-background rounded-xl border p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-100">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Google_Sheets_2020_Logo.svg"
            alt="Google Sheets"
            width={30}
            height={30}
            unoptimized
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Google Sheets</p>
          {connected ? (
            <>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className="text-muted-foreground text-xs">Підключено як</span>
              </div>
              <p className="mt-0.5 text-xs font-medium">{email}</p>
            </>
          ) : (
            <div className="mt-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
              <span className="text-muted-foreground text-xs">Не підключено</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        {connected ? (
          <Button variant="outline" size="sm">
            Відключити
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="text-primary border-primary/40 w-full">
            Підключити
          </Button>
        )}
      </div>
    </div>
  );
};
