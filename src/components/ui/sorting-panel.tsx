
import * as React from "react";
import { LucideIcon, ArrowDownAZ, ArrowUpAZ, ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortingOption = {
  id: string;
  label: string;
  direction: "asc" | "desc";
  field: string;
  icon?: LucideIcon;
};

interface SortingPanelProps {
  options: SortingOption[];
  activeSortId: string;
  onSortChange: (sortId: string) => void;
  className?: string;
  size?: "sm" | "default";
  variant?: "default" | "minimal";
}

/**
 * Компонент для переключения опций сортировки
 */
export function SortingPanel({
  options,
  activeSortId,
  onSortChange,
  className = "",
  size = "default",
  variant = "default",
}: SortingPanelProps) {
  // Функция для определения иконки сортировки
  const getSortIcon = (option: SortingOption) => {
    if (option.icon) {
      const Icon = option.icon;
      return <Icon className="h-4 w-4" />;
    }

    if (option.field === "name" || option.field === "title") {
      return option.direction === "asc" ? (
        <ArrowDownAZ className="h-4 w-4" />
      ) : (
        <ArrowUpAZ className="h-4 w-4" />
      );
    }

    return option.direction === "asc" ? (
      <ArrowUpWideNarrow className="h-4 w-4" />
    ) : (
      <ArrowDownWideNarrow className="h-4 w-4" />
    );
  };

  // Находим активную опцию сортировки
  const activeOption = options.find((opt) => opt.id === activeSortId) || options[0];

  // Отрисовываем минимальную версию (только select)
  if (variant === "minimal") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Сортировка:
        </span>
        <Select value={activeSortId} onValueChange={onSortChange}>
          <SelectTrigger 
            className={size === "sm" ? "h-8 text-xs" : "h-9 text-sm"}
            style={{ minWidth: "180px" }}
          >
            <SelectValue placeholder="Выберите сортировку" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                <div className="flex items-center gap-2">
                  {getSortIcon(option)}
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Отрисовываем кнопки для десктопа
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => (
        <Button
          key={option.id}
          variant={option.id === activeSortId ? "default" : "outline"}
          size={size === "sm" ? "sm" : "default"}
          className={size === "sm" ? "h-8 text-xs" : "h-9 text-sm"}
          onClick={() => onSortChange(option.id)}
        >
          {getSortIcon(option)}
          <span className="ml-1">{option.label}</span>
        </Button>
      ))}
    </div>
  );
}
