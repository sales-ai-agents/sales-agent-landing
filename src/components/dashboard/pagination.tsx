"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";
import { formatNumber, getPageIndex } from "@/lib/utils";

interface PaginationProps {
  total: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

const VISIBLE_PAGES = 5;

export const Pagination = ({
  total,
  pageSize,
  currentPage,
  onPageChange,
  itemLabel = "записів",
}: PaginationProps) => {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const startRow = total > 0 ? currentPage * pageSize + 1 : 0;
  const endRow = Math.min((currentPage + 1) * pageSize, total);
  const lastVisible = getPageIndex(currentPage, pageCount, VISIBLE_PAGES - 1);

  return (
    <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
      <span>
        {total > 0
          ? `Показано ${startRow}-${endRow} з ${formatNumber(total)} ${itemLabel}`
          : "Немає результатів"}
      </span>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          aria-label="Попередня сторінка"
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        {Array.from({ length: Math.min(pageCount, VISIBLE_PAGES) }).map((_, index) => {
          const pageIndex = getPageIndex(currentPage, pageCount, index);
          const isCurrent = pageIndex === currentPage;
          return (
            <Button
              key={pageIndex}
              type="button"
              variant={isCurrent ? "default" : "ghost"}
              size="icon-sm"
              aria-current={isCurrent ? "true" : undefined}
              onClick={() => onPageChange(pageIndex)}
            >
              {pageIndex + 1}
            </Button>
          );
        })}
        {pageCount > VISIBLE_PAGES && lastVisible < pageCount - 1 && (
          <>
            <span aria-hidden="true" className="px-1">
              …
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onPageChange(pageCount - 1)}
            >
              {pageCount}
            </Button>
          </>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= pageCount - 1}
          aria-label="Наступна сторінка"
        >
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};
