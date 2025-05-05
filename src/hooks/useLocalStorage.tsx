
import { useState, useEffect } from 'react';

/**
 * Хук для работы с localStorage с типизацией
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Функция для получения сохраненного значения из localStorage
  const readValue = (): T => {
    // Проверяем доступность localStorage
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Получаем сохраненное значение
      const item = window.localStorage.getItem(key);
      // Возвращаем распарсенное значение, или initialValue если значение не найдено
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // Состояние для хранения текущего значения
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Функция для обновления значения в localStorage и в состоянии
  const setValue = (value: T) => {
    // Проверяем доступность localStorage
    if (typeof window === 'undefined') {
      console.warn(`Cannot set localStorage key "${key}" when window is undefined`);
      return;
    }

    try {
      // Сохраняем значение в localStorage
      window.localStorage.setItem(key, JSON.stringify(value));
      // Обновляем состояние
      setStoredValue(value);
      // Уведомляем других компонентов об изменении localStorage
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Обновляем значение если ключ изменился
  useEffect(() => {
    setStoredValue(readValue());
  }, [key]);

  // Слушаем изменения в localStorage из других компонентов
  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };

    // Слушаем события изменения localStorage
    window.addEventListener('local-storage', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('local-storage', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return [storedValue, setValue];
}
