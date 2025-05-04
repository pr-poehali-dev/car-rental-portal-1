
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Car,
  CalendarCheck,
  User,
  Banknote,
  TrendingUp,
  TrendingDown,
  Loader2
} from "lucide-react";
import api, { Car as CarType, Booking } from "@/lib/api";

interface DashboardStats {
  totalCars: number;
  availableCars: number;
  totalBookings: number;
  activeBookings: number;
  totalUsers: number;
  revenue: number;
  recentBookings: Booking[];
  popularCars: CarType[];
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    availableCars: 0,
    totalBookings: 0,
    activeBookings: 0,
    totalUsers: 0,
    revenue: 0,
    recentBookings: [],
    popularCars: []
  });

  useEffect(() => {
    // В реальном приложении здесь будет запрос к API
    // api.admin.getDashboardStats().then(data => setStats(data))
    
    // Имитация запроса для демонстрации
    const mockFetch = async () => {
      setLoading(true);
      // Имитируем задержку сети
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStats({
        totalCars: 24,
        availableCars: 18,
        totalBookings: 156,
        activeBookings: 12,
        totalUsers: 78,
        revenue: 543200,
        recentBookings: [],
        popularCars: []
      });
      
      setLoading(false);
    };
    
    mockFetch();
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    trend = 0, 
    format = (val: any) => val 
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{format(value)}</div>
        {trend !== 0 && (
          <p className={`text-xs flex items-center ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend > 0 ? (
              <TrendingUp className="mr-1 h-3 w-3" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3" />
            )}
            {Math.abs(trend)}% по сравнению с прошлым месяцем
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <AdminLayout title="Панель управления">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Панель управления">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Всего автомобилей" 
          value={stats.totalCars} 
          icon={<Car className="h-4 w-4 text-primary" />} 
          trend={5}
        />
        <StatCard 
          title="Доступно автомобилей" 
          value={stats.availableCars} 
          icon={<Car className="h-4 w-4 text-green-600" />} 
        />
        <StatCard 
          title="Активные бронирования" 
          value={stats.activeBookings} 
          icon={<CalendarCheck className="h-4 w-4 text-amber-500" />} 
          trend={12}
        />
        <StatCard 
          title="Пользователи" 
          value={stats.totalUsers} 
          icon={<User className="h-4 w-4 text-blue-600" />} 
          trend={8}
        />
        <StatCard 
          title="Общий доход" 
          value={stats.revenue} 
          icon={<Banknote className="h-4 w-4 text-green-600" />} 
          trend={15}
          format={(val) => `${val.toLocaleString()} ₽`}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Статистика бронирований</h3>
        <div className="h-80 bg-gray-50 rounded-lg border flex items-center justify-center">
          <p className="text-gray-500">Здесь будет график бронирований</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
