
import { useState, useEffect, useCallback } from 'react';

// Интерфейс для базовых фильтров (можно расширить)
export interface FilterOptions {
  priceRange?: [number, number];
  categories?: string[];
  seats?: number[];
  transmission?: string[];
  search?: string;
  sortBy?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string[];
  page?: number;
  limit?: number;
  features?: string[];
  [key: string]: any;
}

/**
 * Хук для сохранения и восстановления фильтров из localStorage
 */
export const useFilterStorage = <T extends FilterOptions>(
  storageKey: string,
  defaultFilters: T
): [T, (filters: Partial<T>) => void, () => void] => {
  // Загрузка фильтров из localStorage
  const loadFilters = useCallback((): T => {
    if (typeof window === 'undefined') {
      return defaultFilters;
    }

    try {
      const savedFilters = localStorage.getItem(storageKey);
      return savedFilters ? { ...defaultFilters, ...JSON.parse(savedFilters) } : defaultFilters;
    } catch (error) {
      console.warn(`Ошибка при чтении фильтров из localStorage (${storageKey}):`, error);
      return defaultFilters;
    }
  }, [storageKey, defaultFilters]);

  // Состояние для фильтров
  const [filters, setFiltersState] = useState<T>(loadFilters);

  // Обновление фильтров
  const setFilters = useCallback((newFilters: Partial<T>) => {
    setFiltersState(prevFilters => {
      const updatedFilters = { ...prevFilters, ...newFilters };
      
      // Сохраняем в localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, JSON.stringify(updatedFilters));
        } catch (error) {
          console.warn(`Ошибка при сохранении фильтров в localStorage (${storageKey}):`, error);
        }
      }
      
      return updatedFilters;
    });
  }, [storageKey]);

  // Сброс фильтров к значениям по умолчанию
  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
    
    // Удаляем из localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.warn(`Ошибка при удалении фильтров из localStorage (${storageKey}):`, error);
      }
    }
  }, [storageKey, defaultFilters]);

  // Восстановление фильтров при монтировании компонента
  useEffect(() => {
    setFiltersState(loadFilters());
  }, [loadFilters]);

  return [filters, setFilters, resetFilters];
};
