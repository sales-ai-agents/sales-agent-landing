export const ChartLegend = () => {
  return (
    <div className="hidden items-center gap-4 md:flex">
      <div className="flex items-center gap-1.5">
        <span className="bg-primary h-2.5 w-2.5 rounded-full" />
        <span className="text-muted-foreground text-xs">Усі дзвінки</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="bg-success h-2.5 w-2.5 rounded-full" />
        <span className="text-muted-foreground text-xs">Досягнуто цілі</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="bg-warning h-2.5 w-2.5 rounded-full" />
        <span className="text-muted-foreground text-xs">Заощаджений час</span>
      </div>
    </div>
  );
};
