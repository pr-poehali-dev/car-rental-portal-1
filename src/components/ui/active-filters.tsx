
import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export type FilterItem = {
  id: string;
  type: string;
  label: string;
  value: string | number | boolean;
};

interface ActiveFiltersProps {
  filters: FilterItem[];
  onRemove: (id: string) => void;
  onReset: () => void;
  className?: string;
}

/**
 * Компонент для отображения активных фильтров с возможностью их удаления
 */
export function ActiveFilters({ filters, onRemove, onReset, className }: ActiveFiltersProps) {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Активные фильтры</h3>
        <Button variant="ghost" size="sm" onClick={onReset} className="h-7 px-2 text-xs">
          Сбросить все
        </Button>
      </div>

      <ScrollArea className="max-w-full" orientation="horizontal">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Badge key={filter.id} variant="outline" className="px-2 py-1 gap-1">
              <span className="text-muted-foreground text-xs">{filter.type}:</span>
              <span className="font-medium truncate max-w-[180px]">{filter.label}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 rounded-full"
                onClick={() => onRemove(filter.id)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Удалить фильтр {filter.label}</span>
              </Button>
            </Badge>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
