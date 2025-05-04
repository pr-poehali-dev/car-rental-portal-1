
import { toast } from "@/components/ui/use-toast";

// Базовый URL API
const API_URL = import.meta.env.VITE_API_URL || 'https://api.autopro.ru/v1';

// Интерфейсы для API
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Общие типы данных
export interface Car {
  id: string;
  name: string;
  image: string;
  images?: string[];
  price: number;
  category: string;
  seats: number;
  transmission: string;
  fuelType: string;
  year: number;
  description: string;
  features: string[];
  additionalServices?: AdditionalService[];
  rating?: number;
  reviews?: number;
  status: 'available' | 'reserved' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface AdditionalService {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Booking {
  id: string;
  carId: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  insurance: boolean;
  additionalServices: string[]; // IDs дополнительных услуг
  createdAt: string;
  updatedAt: string;
  car?: Car;
  user?: User;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Параметры для фильтрации
export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string[];
  seats?: number[];
  transmission?: string[];
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Вспомогательная функция для обработки ошибок
const handleApiError = (error: any): never => {
  console.error('API Error:', error);
  const message = error.response?.data?.message || 'Произошла ошибка при обращении к серверу';
  toast({
    title: 'Ошибка',
    description: message,
    variant: 'destructive',
  });
  throw error;
};

// Функция для формирования параметров запроса
const createQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(`${key}[]`, item.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });
  
  return searchParams.toString();
};

// API клиент
const api = {
  // Аутентификация
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw error;
        }
        
        const data = await response.json();
        // Сохранение токена в localStorage
        localStorage.setItem('token', data.token);
        return data;
      } catch (error) {
        return handleApiError(error);
      }
    },
    
    logout: (): void => {
      localStorage.removeItem('token');
    },
    
    getToken: (): string | null => {
      return localStorage.getItem('token');
    },
    
    isAuthenticated: (): boolean => {
      return !!localStorage.getItem('token');
    },
  },
  
  // Автомобили
  cars: {
    getAll: async (filters: FilterParams = {}): Promise<PaginatedResponse<Car>> => {
      try {
        const queryString = createQueryString(filters);
        const response = await fetch(`${API_URL}/cars?${queryString}`, {
          headers: {
            'Authorization': `Bearer ${api.auth.getToken()}`,
          },
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw error;
        }
        
        return await response.json();
      } catch (error) {
        return handleApiError(error);
      }
    },
    
    getById: async (id: string): Promise<Car> => {
      try {
        const response = await fetch(`${API_URL}/cars/${id}`, {
          headers: {
            'Authorization': `Bearer ${api.auth.getToken()}`,
          },
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw error;
        }
        
        return await response.json();
      } catch (error) {
        return handleApiError(error);
      }
    },
    
    create: async (carData: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>): Promise<Car> => {
      try {
        const response = await fetch(`${API_URL}/cars`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${api.auth.getToken()}`,
          },
          body: JSON.stringify(carData),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw error;
        }
        
        return await response.json();
      } catch (error) {
        return handleApiError(error);
      }
    },
    
    update: async (id: string, carData: Partial<Car>): Promise<Car> => {
      try {
        const response = await fetch(`${API_URL}/cars/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${api.auth.getToken()}`,
          },
          body: JSON.stringify(carData),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw error;
        }
        
        return await response.json();
      } catch (error) {
        return handleApiError(error);
      }
    },
    
    delete: async (id: string): Promise<void> => {
      try {
        const response = await fetch(`${API_URL}/cars/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${api.auth.getToken()}`,
          },
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw error;
        }
      } catch (error) {
        handleApiError(error);
      }
    },
  },
  
  // Бронирования
  bookings: {
    create: async (bookingData: {
      carId: string;
      startDate: Date;
      endDate: Date;
      insurance: boolean;
      additionalServices: string[];
    }): Promise<Booking> => {
      try {
        const response = await fetch(`${API_URL}/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${api.auth.getToken()}`,
          },
          body: JSON.stringify(bookingData),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw error;
        }
        
        return await response.json();
      } catch (error) {
        return handleApiError(error);
      }
    },
    
    getUserBookings: async (): Promise<Booking[]> => {
      try {
        const response = await fetch(`${API_URL}/bookings/user`, {
          headers: {
            'Authorization': `Bearer ${api.auth.getToken()}`,
          },
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw error;
        }
        
        return await response.json();
      } catch (error) {
        return handleApiError(error);
      }
    },
    
    getAll: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Booking>> => {
      try {
        const response = await fetch(`${API_URL}/bookings?page=${page}&limit=${limit}`, {
          headers: {
            'Authorization': `Bearer ${api.auth.getToken()}`,
          },
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw error;
        }
        
        return await response.json();
      } catch (error) {
        return handleApiError(error);
      }
    },
    
    updateStatus: async (id: string, status: Booking['status']): Promise<Booking> => {
      try {
        const response = await fetch(`${API_URL}/bookings/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${api.auth.getToken()}`,
          },
          body: JSON.stringify({ status }),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw error;
        }
        
        return await response.json();
      } catch (error) {
        return handleApiError(error);
      }
    },
  },
};

export default api;
