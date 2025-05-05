
// Типы данных для API
export interface Car {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  seats: number;
  transmission: string;
  fuelType: string;
  year: number;
  description: string;
  features: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  carId: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: number;
  insurance: boolean;
  additionalServices: string[];
  createdAt: string;
  updatedAt: string;
  car?: Car;
}

// Типы параметров для API
export interface ApiParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  status?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  features?: string[];
  priceMin?: number;
  priceMax?: number;
  timeRange?: string;
}

// API клиент
const api = {
  cars: {
    getAll: async (params: ApiParams = {}) => {
      // В реальном приложении здесь будет запрос к API
      console.log('API call: Get all cars with params', params);
      return { data: [], totalPages: 0 };
    },
    getById: async (id: string) => {
      console.log('API call: Get car by id', id);
      return {} as Car;
    },
    create: async (car: Partial<Car>) => {
      console.log('API call: Create car', car);
      return {} as Car;
    },
    update: async (id: string, car: Partial<Car>) => {
      console.log('API call: Update car', id, car);
      return {} as Car;
    },
    delete: async (id: string) => {
      console.log('API call: Delete car', id);
    }
  },
  bookings: {
    getAll: async (params: ApiParams = {}) => {
      console.log('API call: Get all bookings with params', params);
      return { data: [], totalPages: 0 };
    },
    getUserBookings: async (params: ApiParams = {}) => {
      console.log('API call: Get user bookings with params', params);
      return [];
    },
    getById: async (id: string) => {
      console.log('API call: Get booking by id', id);
      return {} as Booking;
    },
    create: async (booking: Partial<Booking>) => {
      console.log('API call: Create booking', booking);
      return {} as Booking;
    },
    updateStatus: async (id: string, status: string) => {
      console.log('API call: Update booking status', id, status);
      return {} as Booking;
    },
    delete: async (id: string) => {
      console.log('API call: Delete booking', id);
    }
  },
  users: {
    getAll: async (params: ApiParams = {}) => {
      console.log('API call: Get all users with params', params);
      return { data: [], totalPages: 0 };
    },
    getById: async (id: string) => {
      console.log('API call: Get user by id', id);
      return {} as User;
    },
    update: async (id: string, user: Partial<User>) => {
      console.log('API call: Update user', id, user);
      return {} as User;
    },
    create: async (user: Partial<User>) => {
      console.log('API call: Create user', user);
      return {} as User;
    },
    delete: async (id: string) => {
      console.log('API call: Delete user', id);
    }
  },
  admin: {
    getDashboardStats: async (params: { timeRange?: string } = {}) => {
      console.log('API call: Get dashboard stats', params);
      return {};
    }
  },
  notifications: {
    getAdminNotifications: async () => {
      console.log('API call: Get admin notifications');
      return [];
    },
    markAsRead: async (id: string) => {
      console.log('API call: Mark notification as read', id);
    },
    markAllAsRead: async () => {
      console.log('API call: Mark all notifications as read');
    }
  }
};

export default api;
