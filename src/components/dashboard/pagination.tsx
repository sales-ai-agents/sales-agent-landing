"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui";
import { cn, formatNumber, getPageIndex } from "@/lib/utils";

interface PaginationProps {
  total: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
  className?: string;
}

export function Pagination({
  total,
  pageSize,
  currentPage,
  onPageChange,
  itemLabel = "записів",
  className,
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const startRow = total > 0 ? currentPage * pageSize + 1 : 0;
  const endRow = Math.min((currentPage + 1) * pageSize, total);

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <p className="text-muted-foreground text-sm">
        {total > 0
          ? `Показано ${startRow}-${endRow} з ${formatNumber(total)} ${itemLabel}`
          : "Немає результатів"}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          aria-label="Попередня сторінка"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {Array.from({ length: Math.min(pageCount, 5) }).map((_, i) => {
          const pageIndex = getPageIndex(currentPage, pageCount, i);
          return (
            <Button
              key={pageIndex}
              variant={pageIndex === currentPage ? "default" : "outline"}
              size="icon"
              className="size-8"
              onClick={() => onPageChange(pageIndex)}
            >
              {pageIndex + 1}
            </Button>
          );
        })}

        {pageCount > 5 && getPageIndex(currentPage, pageCount, 4) < pageCount - 1 && (
          <>
            <span className="text-muted-foreground px-1 text-sm">…</span>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => onPageChange(pageCount - 1)}
            >
              {pageCount}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= pageCount - 1}
          aria-label="Наступна сторінка"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
