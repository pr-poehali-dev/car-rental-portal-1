
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Car,
  CalendarCheck,
  User,
  Banknote,
  TrendingUp,
  TrendingDown,
  Loader2,
  ClipboardList,
  CarFront,
  CalendarDays,
  RefreshCcw,
  Bell,
  CheckCircle,
  Info
} from "lucide-react";
import { format, startOfMonth, subMonths, eachDayOfInterval, isToday, isYesterday, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from "recharts";
import api, { Car as CarType, Booking } from "@/lib/api";
import NotificationCenter from "@/components/admin/NotificationCenter";

// Типы для данных дашборда
interface DashboardStats {
  totalCars: number;
  availableCars: number;
  totalBookings: number;
  activeBookings: number;
  totalUsers: number;
  revenue: number;
  recentBookings: Booking[];
  popularCars: CarType[];
  bookingStatusStats: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  bookingsByCategory: {
    name: string;
    value: number;
  }[];
  revenueData: {
    date: string;
    value: number;
  }[];
  bookingsData: {
    date: string;
    amount: number;
  }[];
}

// Статус бронирований с локализацией
const bookingStatusMap: Record<string, string> = {
  pending: "Ожидает",
  confirmed: "Подтверждено",
  completed: "Завершено",
  cancelled: "Отменено"
};

// Цвета для графиков
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const statusColors: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#10b981",
  completed: "#3b82f6",
  cancelled: "#ef4444"
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30days");
  const [activeChart, setActiveChart] = useState("bookings");
  const [showNotifications, setShowNotifications] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    availableCars: 0,
    totalBookings: 0,
    activeBookings: 0,
    totalUsers: 0,
    revenue: 0,
    recentBookings: [],
    popularCars: [],
    bookingStatusStats: {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    },
    bookingsByCategory: [],
    revenueData: [],
    bookingsData: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // В реальном приложении здесь будет запрос к API
      // const response = await api.admin.getDashboardStats({ timeRange });
      // setStats(response);
      
      // Имитация запроса для демонстрации
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Генерируем данные для графиков в зависимости от выбранного периода
      const days = timeRange === "7days" ? 7 
                 : timeRange === "30days" ? 30 
                 : timeRange === "90days" ? 90 
                 : 30;
      
      const endDate = new Date();
      const startDate = subMonths(startOfMonth(endDate), days / 30);
      
      // Создаем данные за каждый день выбранного периода
      const dailyData = eachDayOfInterval({ start: startDate, end: endDate }).map(date => {
        // Случайные данные для демонстрации
        const dateStr = format(date, "yyyy-MM-dd");
        const randomBookings = Math.floor(Math.random() * 8) + 1;
        const randomRevenue = randomBookings * (Math.floor(Math.random() * 4000) + 2000);
        
        return {
          date: dateStr,
          bookings: randomBookings,
          revenue: randomRevenue
        };
      });
      
      const mockStats: DashboardStats = {
        totalCars: 24,
        availableCars: 18,
        totalBookings: 156,
        activeBookings: 12,
        totalUsers: 78,
        revenue: 543200,
        recentBookings: generateMockBookings(),
        popularCars: [],
        bookingStatusStats: {
          pending: 8,
          confirmed: 12,
          completed: 110,
          cancelled: 26
        },
        bookingsByCategory: [
          { name: "Эконом", value: 45 },
          { name: "Комфорт", value: 65 },
          { name: "Бизнес", value: 26 },
          { name: "Премиум", value: 20 }
        ],
        // Преобразуем ежедневные данные в формат для графиков
        revenueData: dailyData.map(day => ({
          date: format(parseISO(day.date), "dd.MM"),
          value: day.revenue
        })),
        bookingsData: dailyData.map(day => ({
          date: format(parseISO(day.date), "dd.MM"),
          amount: day.bookings
        }))
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error("Ошибка при загрузке данных дашборда:", error);
    } finally {
      setLoading(false);
    }
  };

  // Генерация тестовых бронирований
  const generateMockBookings = (): Booking[] => {
    const now = new Date();
    
    return [
      {
        id: "b1",
        carId: "car1",
        userId: "user1",
        startDate: format(now, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        endDate: format(subMonths(now, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        status: "pending",
        totalPrice: 15000,
        insurance: true,
        additionalServices: ["GPS"],
        createdAt: format(subMonths(now, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        updatedAt: format(subMonths(now, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        car: {
          id: "car1",
          name: "Toyota Camry",
          image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80",
          price: 3500,
          category: "Бизнес",
          seats: 5,
          transmission: "Автомат",
          fuelType: "Бензин",
          year: 2022,
          description: "",
          features: [],
          status: "available",
          createdAt: "",
          updatedAt: ""
        }
      },
      {
        id: "b2",
        carId: "car2",
        userId: "user2",
        startDate: format(subMonths(now, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        endDate: format(now, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        status: "confirmed",
        totalPrice: 8200,
        insurance: false,
        additionalServices: [],
        createdAt: format(subMonths(now, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        updatedAt: format(subMonths(now, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        car: {
          id: "car2",
          name: "Volkswagen Polo",
          image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
          price: 2100,
          category: "Эконом",
          seats: 5,
          transmission: "Механика",
          fuelType: "Бензин",
          year: 2021,
          description: "",
          features: [],
          status: "available",
          createdAt: "",
          updatedAt: ""
        }
      },
      {
        id: "b3",
        carId: "car3",
        userId: "user3",
        startDate: format(now, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        endDate: format(subMonths(now, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        status: "completed",
        totalPrice: 25000,
        insurance: true,
        additionalServices: ["Детское кресло"],
        createdAt: format(subMonths(now, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        updatedAt: format(subMonths(now, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        car: {
          id: "car3",
          name: "BMW X5",
          image: "https://images.unsplash.com/photo-1543465077-db45d34b88a5?auto=format&fit=crop&w=800&q=80",
          price: 5800,
          category: "Премиум",
          seats: 5,
          transmission: "Автомат",
          fuelType: "Дизель",
          year: 2023,
          description: "",
          features: [],
          status: "available",
          createdAt: "",
          updatedAt: ""
        }
      }
    ];
  };

  // Компонент для виджетов статистики
  const StatCard = ({ 
    title, 
    value, 
    icon, 
    trend = 0, 
    format = (val: any) => val,
    description = ""
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
          {description && (
            <CardDescription className="text-xs pt-1">{description}</CardDescription>
          )}
        </div>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{format(value)}</div>
        {trend !== 0 && (
          <p className={`text-xs flex items-center mt-1 ${
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

  // Форматирование метки оси X для графика
  const formatXAxis = (tickItem: string) => {
    return tickItem;
  };

  // Настраиваемый тултип для графика
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium text-sm">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {activeChart === 'bookings' 
                ? `${entry.value} бронирований` 
                : `${entry.value.toLocaleString()} ₽`}
            </p>
          ))}
        </div>
      );
    }
  
    return null;
  };

  if (loading) {
    return (
      <AdminLayout title="Панель управления">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  // Форматирование данных для круговой диаграммы статусов бронирований
  const bookingStatusData = Object.entries(stats.bookingStatusStats).map(([key, value]) => ({
    name: bookingStatusMap[key] || key,
    value,
    color: statusColors[key]
  }));

  return (
    <AdminLayout title="Панель управления">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">Статистика автопарка</h2>
          <p className="text-gray-500">Обзор основных показателей и статистики</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Выберите период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Последние 7 дней</SelectItem>
              <SelectItem value="30days">Последние 30 дней</SelectItem>
              <SelectItem value="90days">Последние 90 дней</SelectItem>
              <SelectItem value="year">Текущий год</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={() => fetchDashboardData()}
            className="flex items-center gap-1"
          >
            <RefreshCcw className="h-4 w-4" /> Обновить
          </Button>
          <div className="relative">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
            
            {showNotifications && (
              <NotificationCenter onClose={() => setShowNotifications(false)} />
            )}
          </div>
        </div>
      </div>

      {/* Карточки с основными метриками */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Всего автомобилей" 
          value={stats.totalCars} 
          icon={<Car className="h-5 w-5 text-primary" />} 
          trend={5}
          description="Общее количество автомобилей в автопарке"
        />
        <StatCard 
          title="Доступно автомобилей" 
          value={stats.availableCars} 
          icon={<CarFront className="h-5 w-5 text-green-600" />} 
          description={`${Math.round((stats.availableCars / stats.totalCars) * 100)}% автопарка доступно`}
        />
        <StatCard 
          title="Активные бронирования" 
          value={stats.activeBookings} 
          icon={<CalendarCheck className="h-5 w-5 text-amber-500" />} 
          trend={12}
          description="Текущие и ожидающие бронирования"
        />
        <StatCard 
          title="Пользователи" 
          value={stats.totalUsers} 
          icon={<User className="h-5 w-5 text-blue-600" />} 
          trend={8}
          description="Зарегистрированные пользователи"
        />
        <StatCard 
          title="Общий доход" 
          value={stats.revenue} 
          icon={<Banknote className="h-5 w-5 text-green-600" />} 
          trend={15}
          format={(val) => `${val.toLocaleString()} ₽`}
          description="Доход за выбранный период"
        />
        <StatCard 
          title="Успешные бронирования" 
          value={stats.bookingStatusStats.completed} 
          icon={<CheckCircle className="h-5 w-5 text-blue-600" />} 
          format={(val) => `${val} (${Math.round((val / stats.totalBookings) * 100)}%)`}
          description="Завершенные бронирования"
        />
        <StatCard 
          title="Отмененные бронирования" 
          value={stats.bookingStatusStats.cancelled} 
          icon={<Info className="h-5 w-5 text-red-600" />} 
          trend={-3}
          format={(val) => `${val} (${Math.round((val / stats.totalBookings) * 100)}%)`}
          description="Число отмененных бронирований"
        />
        <StatCard 
          title="Среднее бронирование" 
          value={Math.round(stats.revenue / stats.totalBookings)} 
          icon={<ClipboardList className="h-5 w-5 text-purple-600" />} 
          format={(val) => `${val.toLocaleString()} ₽`}
          description="Средняя стоимость бронирования"
        />
      </div>

      {/* Графики статистики */}
      <div className="mt-8">
        <div className="bg-white rounded-lg border p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Динамика бронирований и доходов</h3>
            <div className="flex items-center space-x-2">
              <Button 
                variant={activeChart === "bookings" ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveChart("bookings")}
              >
                <CalendarDays className="h-4 w-4 mr-1" /> Бронирования
              </Button>
              <Button 
                variant={activeChart === "revenue" ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveChart("revenue")}
              >
                <Banknote className="h-4 w-4 mr-1" /> Доходы
              </Button>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={activeChart === "bookings" ? stats.bookingsData : stats.revenueData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxis} 
                  interval="preserveStartEnd"
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey={activeChart === "bookings" ? "amount" : "value"} 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Статусы бронирований */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Статусы бронирований</CardTitle>
            <CardDescription>
              Распределение бронирований по статусам
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} (${Math.round((value as number / stats.totalBookings) * 100)}%)`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Бронирования по категориям автомобилей */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Бронирования по категориям</CardTitle>
            <CardDescription>
              Популярность различных категорий автомобилей
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.bookingsByCategory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" name="Бронирования" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Недавние бронирования */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Недавние бронирования</h3>
        <div className="bg-white rounded-lg border">
          <div className="grid grid-cols-7 bg-muted/50 p-3 text-sm font-medium">
            <div className="col-span-2">Автомобиль</div>
            <div>Период</div>
            <div>Статус</div>
            <div>Клиент</div>
            <div>Сумма</div>
            <div className="text-right">Создано</div>
          </div>
          
          {stats.recentBookings.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Нет данных о недавних бронированиях
            </div>
          ) : (
            <div>
              {stats.recentBookings.map((booking) => {
                // Форматирование даты относительно текущей
                const createdDate = parseISO(booking.createdAt);
                let dateDisplay = format(createdDate, "dd.MM.yyyy");
                
                if (isToday(createdDate)) {
                  dateDisplay = "Сегодня";
                } else if (isYesterday(createdDate)) {
                  dateDisplay = "Вчера";
                }

                return (
                  <div key={booking.id} className="grid grid-cols-7 p-3 border-t items-center text-sm">
                    <div className="col-span-2 flex items-center gap-2">
                      <div className="h-10 w-10 rounded-md overflow-hidden">
                        <img 
                          src={booking.car?.image} 
                          alt={booking.car?.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{booking.car?.name}</div>
                        <div className="text-xs text-gray-500">{booking.car?.category}</div>
                      </div>
                    </div>
                    <div>
                      {format(parseISO(booking.startDate), "dd.MM")} - {format(parseISO(booking.endDate), "dd.MM")}
                    </div>
                    <div>
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${booking.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {bookingStatusMap[booking.status]}
                      </span>
                    </div>
                    <div>Клиент #{booking.userId}</div>
                    <div>{booking.totalPrice.toLocaleString()} ₽</div>
                    <div className="text-right">{dateDisplay}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
