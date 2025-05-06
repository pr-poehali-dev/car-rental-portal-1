import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { 
  Car, 
  Calendar, 
  MapPin, 
  User, 
  CreditCard, 
  Clock, 
  XCircle, 
  ChevronRight, 
  Loader2, 
  CheckCircle,
  InfoIcon,
  FilterX,
  FileSymlink
} from "lucide-react";
import { format, parseISO, isAfter, differenceInDays } from "date-fns";
import { ru } from "date-fns/locale";
import api, { Booking } from "@/lib/api";
import BookingDetailMobile from "@/components/BookingDetailMobile";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { useFilterStorage } from "@/hooks/useFilterStorage";

// Интерфейс для фильтров бронирований
interface BookingFilters {
  status: string[];
  dateRange: [Date | null, Date | null];
  search: string;
}

const ProfileBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  
  // Хранение фильтров в localStorage
  const [filters, setFilters, resetFilters] = useFilterStorage<BookingFilters>(
    'user-bookings-filters',
    {
      status: [],
      dateRange: [null, null],
      search: ""
    }
  );
  
  // Статистика бронирований
  const [stats, setStats] = useState({
    totalBookings: 0,
    completed: 0,
    cancelled: 0,
    active: 0,
    totalSpent: 0,
    averageRating: 0
  });

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        // В реальном приложении:
        // const response = await api.bookings.getUserBookings();
        // setBookings(response);
        
        // Имитация для демонстрации
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockBookings: Booking[] = [
          {
            id: "1",
            carId: "1",
            userId: "user1",
            startDate: "2025-05-20T10:00:00Z",
            endDate: "2025-05-25T18:00:00Z",
            status: "confirmed",
            totalPrice: 21000,
            insurance: true,
            additionalServices: ["GPS-навигатор"],
            createdAt: "2025-05-01T14:30:00Z",
            updatedAt: "2025-05-01T15:00:00Z",
            car: {
              id: "1",
              name: "Toyota Camry",
              image: "https://images.unsplash.com/photo-1621007806512-be7837a1e15c?auto=format&fit=crop&w=800&q=80",
              price: 3500,
              category: "Бизнес",
              seats: 5,
              transmission: "Автомат",
              fuelType: "Бензин",
              year: 2022,
              description: "Комфортный седан бизнес-класса",
              features: ["Климат-контроль", "Кожаный салон"],
              status: "available",
              createdAt: "2023-04-15T10:30:00Z",
              updatedAt: "2023-04-15T10:30:00Z"
            }
          },
          {
            id: "2",
            carId: "2",
            userId: "user1",
            startDate: "2025-06-10T12:00:00Z",
            endDate: "2025-06-14T12:00:00Z",
            status: "pending",
            totalPrice: 8400,
            insurance: false,
            additionalServices: [],
            createdAt: "2025-05-02T09:15:00Z",
            updatedAt: "2025-05-02T09:15:00Z",
            car: {
              id: "2",
              name: "Volkswagen Polo",
              image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
              price: 2100,
              category: "Эконом",
              seats: 5,
              transmission: "Механика",
              fuelType: "Бензин",
              year: 2021,
              description: "Экономичный городской автомобиль",
              features: ["Кондиционер", "ABS"],
              status: "available",
              createdAt: "2023-05-20T14:45:00Z",
              updatedAt: "2023-05-20T14:45:00Z"
            }
          },
          {
            id: "3",
            carId: "3",
            userId: "user1",
            startDate: "2025-04-25T09:00:00Z",
            endDate: "2025-04-30T20:00:00Z",
            status: "completed",
            totalPrice: 34000,
            insurance: true,
            additionalServices: ["Детское кресло", "GPS-навигатор"],
            createdAt: "2025-04-20T11:30:00Z",
            updatedAt: "2025-05-01T21:00:00Z",
            car: {
              id: "3",
              name: "BMW X5",
              image: "https://images.unsplash.com/photo-1518987048-93e29699e79a?auto=format&fit=crop&w=800&q=80",
              price: 6800,
              category: "Премиум",
              seats: 7,
              transmission: "Автомат",
              fuelType: "Дизель",
              year: 2023,
              description: "Роскошный внедорожник",
              features: ["Панорамная крыша", "Премиум аудиосистема"],
              status: "available",
              createdAt: "2023-03-10T09:15:00Z",
              updatedAt: "2023-06-05T16:20:00Z"
            }
          },
          {
            id: "4",
            carId: "1",
            userId: "user1",
            startDate: "2025-03-15T14:00:00Z",
            endDate: "2025-03-20T14:00:00Z",
            status: "cancelled",
            totalPrice: 17500,
            insurance: false,
            additionalServices: [],
            createdAt: "2025-03-10T16:45:00Z",
            updatedAt: "2025-03-12T10:30:00Z",
            car: {
              id: "1",
              name: "Toyota Camry",
              image: "https://images.unsplash.com/photo-1621007806512-be7837a1e15c?auto=format&fit=crop&w=800&q=80",
              price: 3500,
              category: "Бизнес",
              seats: 5,
              transmission: "Автомат",
              fuelType: "Бензин",
              year: 2022,
              description: "Комфортный седан бизнес-класса",
              features: ["Климат-контроль", "Кожаный салон"],
              status: "available",
              createdAt: "2023-04-15T10:30:00Z",
              updatedAt: "2023-04-15T10:30:00Z"
            }
          }
        ];
        
        setBookings(mockBookings);
        
        // Рассчитываем статистику
        const totalSpent = mockBookings.reduce((sum, booking) => 
          booking.status === 'completed' || booking.status === 'confirmed' 
            ? sum + booking.totalPrice 
            : sum, 0);
        
        const completedBookings = mockBookings.filter(b => b.status === 'completed').length;
        const activeBookings = mockBookings.filter(b => 
          b.status === 'confirmed' || b.status === 'pending').length;
        const cancelledBookings = mockBookings.filter(b => b.status === 'cancelled').length;
        
        setStats({
          totalBookings: mockBookings.length,
          completed: completedBookings,
          active: activeBookings,
          cancelled: cancelledBookings,
          totalSpent,
          averageRating: 4.7 // Пример рейтинга
        });
      } catch (error) {
        console.error("Ошибка при загрузке бронирований:", error);
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить историю бронирований",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "d MMMM yyyy, HH:mm", { locale: ru });
    } catch (e) {
      return "Некорректная дата";
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    
    setCancelLoading(true);
    try {
      // В реальном приложении:
      // await api.bookings.updateStatus(selectedBooking.id, "cancelled");
      
      // Имитация для демонстрации
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Обновляем локальное состояние
      const updatedBookings = bookings.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, status: "cancelled", updatedAt: new Date().toISOString() } 
          : booking
      );
      
      setBookings(updatedBookings);
      
      // Обновляем статистику
      setStats(prev => ({
        ...prev,
        active: prev.active - 1,
        cancelled: prev.cancelled + 1
      }));
      
      toast({
        title: "Бронирование отменено",
        description: "Ваше бронирование успешно отменено",
      });
      
      setCancelDialogOpen(false);
    } catch (error) {
      console.error("Ошибка при отмене бронирования:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось отменить бронирование",
      });
    } finally {
      setCancelLoading(false);
    }
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  const handleCancelRequest = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };
  
  const handleShareBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    // Создаем URL для шаринга
    const shareLink = `${window.location.origin}/shared-booking/${booking.id}?ref=user-share`;
    setShareUrl(shareLink);
    setShowShareDialog(true);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Ссылка скопирована",
        description: "Ссылка на бронирование скопирована в буфер обмена"
      });
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-500">Ожидает подтверждения</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-500">Подтверждено</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Отменено</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Завершено</Badge>;
      default:
        return <Badge>Неизвестно</Badge>;
    }
  };

  const canBeCancelled = (booking: Booking) => {
    return (booking.status === 'pending' || booking.status === 'confirmed') && 
           isAfter(parseISO(booking.startDate), new Date());
  };
  
  const canBeShared = (booking: Booking) => {
    return booking.status === 'confirmed' || booking.status === 'pending';
  };
  
  // Получаем количество дней аренды
  const getRentalDays = (booking: Booking) => {
    return differenceInDays(parseISO(booking.endDate), parseISO(booking.startDate)) + 1;
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === "all") return true;
    if (activeTab === "active") {
      return booking.status === "confirmed" || booking.status === "pending";
    }
    if (activeTab === "completed") {
      return booking.status === "completed";
    }
    if (activeTab === "cancelled") {
      return booking.status === "cancelled";
    }
    return true;
  });

  const upcomingBookings = bookings.filter(booking => 
    (booking.status === "confirmed" || booking.status === "pending") && 
    isAfter(parseISO(booking.startDate), new Date())
  );

  return (
    <ResponsiveLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Мои бронирования</h1>
            <p className="text-gray-500 mt-1">Управляйте своими бронированиями и просматривайте историю</p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0" 
            onClick={() => navigate("/catalog")}
          >
            <Car className="mr-2 h-4 w-4" /> Арендовать автомобиль
          </Button>
        </div>
        
        {/* Карточки статистики */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Всего бронирований</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalBookings}</div>
              <p className="text-sm text-gray-500">За все время</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Активные</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.active}</div>
              <p className="text-sm text-gray-500">Текущие бронирования</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Завершенные</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.completed}</div>
              <p className="text-sm text-gray-500">Успешные поездки</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Общая сумма</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalSpent.toLocaleString()} ₽</div>
              <p className="text-sm text-gray-500">Потрачено на аренду</p>
            </CardContent>
          </Card>
        </div>

        {"    "}loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : (
          <>
            {upcomingBookings.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Предстоящие поездки</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingBookings.map(booking => (
                    <Card key={booking.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2 pt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-md overflow-hidden">
                              <img 
                                src={booking.car?.image} 
                                alt={booking.car?.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <CardTitle className="text-lg">{booking.car?.name}</CardTitle>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <div>
                              <div>{formatDate(booking.startDate)}</div>
                              <div className="text-gray-500">—</div>
                              <div>{formatDate(booking.endDate)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CreditCard className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{booking.totalPrice} ₽</span>
                            <span className="text-xs text-gray-500">
                              ({getRentalDays(booking)} {getRentalDays(booking) === 1 ? 'день' : getRentalDays(booking) < 5 ? 'дня' : 'дней'})
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 pb-4 gap-2 flex-wrap">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleViewDetails(booking)}
                        >
                          Детали
                        </Button>
                        {canBeShared(booking) && (
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleShareBooking(booking)}
                          >
                            <FileSymlink className="mr-1 h-3 w-3" />
                            Поделиться
                          </Button>
                        )}
                        {canBeCancelled(booking) && (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleCancelRequest(booking)}
                          >
                            Отменить
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold mb-4">История бронирований</h2>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="all">Все</TabsTrigger>
                  <TabsTrigger value="active">Активные</TabsTrigger>
                  <TabsTrigger value="completed">Завершенные</TabsTrigger>
                  <TabsTrigger value="cancelled">Отмененные</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-0">
                  {filteredBookings.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg bg-white">
                      <Clock className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium">Нет бронирований</h3>
                      <p className="mt-1 text-gray-500">
                        В этой категории пока нет бронирований
                      </p>
                      {activeTab !== "all" && (
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => setActiveTab("all")}
                        >
                          <FilterX className="mr-2 h-4 w-4" />
                          Показать все бронирования
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Десктопная версия списка */}
                      <div className="hidden md:block">
                        <div className="rounded-md border bg-white overflow-hidden">
                          <div className="grid grid-cols-12 bg-muted/50 p-4 text-sm font-medium">
                            <div className="col-span-3">Автомобиль</div>
                            <div className="col-span-2">Период</div>
                            <div className="col-span-2">Сумма</div>
                            <div className="col-span-2">Статус</div>
                            <div className="col-span-3 text-right">Действия</div>
                          </div>
                          
                          {filteredBookings.map(booking => (
                            <div key={booking.id} className="grid grid-cols-12 p-4 border-t items-center">
                              <div className="col-span-3">
                                <div className="flex items-center gap-2">
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
                              </div>
                              <div className="col-span-2 text-sm">
                                <div>{formatDate(booking.startDate).split(',')[0]}</div>
                                <div className="text-gray-500">—</div>
                                <div>{formatDate(booking.endDate).split(',')[0]}</div>
                              </div>
                              <div className="col-span-2">
                                <div className="font-medium">
                                  {booking.totalPrice} ₽
                                </div>
                                <div className="text-xs text-gray-500">
                                  {getRentalDays(booking)} {getRentalDays(booking) === 1 ? 'день' : getRentalDays(booking) < 5 ? 'дня' : 'дней'}
                                </div>
                              </div>
                              <div className="col-span-2">
                                {getStatusBadge(booking.status)}
                              </div>
                              <div className="col-span-3 flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewDetails(booking)}
                                >
                                  Детали
                                </Button>
                                {canBeShared(booking) && (
                                  <Button 
                                    variant="secondary" 
                                    size="sm"
                                    onClick={() => handleShareBooking(booking)}
                                  >
                                    <FileSymlink className="mr-1 h-3 w-3" />
                                    Поделиться
                                  </Button>
                                )}
                                {canBeCancelled(booking) && (
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleCancelRequest(booking)}
                                  >
                                    Отменить
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Мобильная версия списка */}
                      <div className="md:hidden space-y-4">
                        {filteredBookings.map(booking => (
                          <Card key={booking.id} className="overflow-hidden bg-white">
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="h-12 w-12 rounded-md overflow-hidden">
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
                                {getStatusBadge(booking.status)}
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                <div>
                                  <div className="text-gray-500">Период</div>
                                  <div>{formatDate(booking.startDate).split(',')[0]}</div>
                                  <div>— {formatDate(booking.endDate).split(',')[0]}</div>
                                </div>
                                <div>
                                  <div className="text-gray-500">Сумма</div>
                                  <div className="font-medium">{booking.totalPrice} ₽</div>
                                  <div className="text-xs">
                                    {getRentalDays(booking)} {getRentalDays(booking) === 1 ? 'день' : getRentalDays(booking) < 5 ? 'дня' : 'дней'}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex gap-2 flex-wrap">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex-1"
                                  onClick={() => handleViewDetails(booking)}
                                >
                                  Детали
                                </Button>
                                
                                {canBeShared(booking) && (
                                  <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    className="flex-1"
                                    onClick={() => handleShareBooking(booking)}
                                  >
                                    <FileSymlink className="mr-1 h-3 w-3" />
                                    Поделиться
                                  </Button>
                                )}
                                
                                {canBeCancelled(booking) && (
                                  <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    className="flex-1"
                                    onClick={() => handleCancelRequest(booking)}
                                  >
                                    Отменить
                                  </Button>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>

      {/* Диалог отмены бронирования */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Отмена бронирования</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите отменить бронирование автомобиля 
              {selectedBooking?.car?.name ? ` ${selectedBooking.car.name}` : ''}?
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="py-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-12 w-12 rounded-md overflow-hidden">
                  <img 
                    src={selectedBooking.car?.image} 
                    alt={selectedBooking.car?.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{selectedBooking.car?.name}</div>
                  <div className="text-sm text-gray-500">
                    {formatDate(selectedBooking.startDate)} — {formatDate(selectedBooking.endDate)}
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
                <div className="flex items-start gap-2">
                  <InfoIcon className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">Условия отмены:</p>
                    <p className="text-amber-700">При отмене бронирования за 48 часов до начала — 100% возврат средств.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCancelDialogOpen(false)}
              disabled={cancelLoading}
            >
              Отмена
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelBooking}
              disabled={cancelLoading}
            >
              {cancelLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Подтвердить отмену
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог для шаринга бронирования */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Поделиться бронированием</DialogTitle>
            <DialogDescription>
              Скопируйте ссылку и отправьте её тому, с кем хотите поделиться информацией о бронировании.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-12 w-12 rounded-md overflow-hidden">
                <img 
                  src={selectedBooking?.car?.image} 
                  alt={selectedBooking?.car?.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="font-medium">{selectedBooking?.car?.name}</div>
                <div className="text-sm text-gray-500">
                  {selectedBooking && formatDate(selectedBooking.startDate)} — {selectedBooking && formatDate(selectedBooking.endDate)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
                onClick={event => event.currentTarget.select()}
              />
              <Button onClick={copyToClipboard}>
                Копировать
              </Button>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>Ссылка действительна в течение 7 дней. Получатель сможет видеть основную информацию о бронировании.</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowShareDialog(false)}
            >
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Мобильный компонент для просмотра деталей бронирования */}
      <BookingDetailMobile 
        booking={selectedBooking} 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)}
        onCancel={selectedBooking && canBeCancelled(selectedBooking) ? () => handleCancelRequest(selectedBooking) : undefined}
      />
    </ResponsiveLayout>
  );
};

export default ProfileBookings;