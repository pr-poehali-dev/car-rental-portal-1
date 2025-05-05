
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MoreHorizontal,
  Calendar,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import api, { Booking } from "@/lib/api";

const AdminBookings = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Имитация загрузки данных с API
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        // В реальном приложении:
        // const response = await api.bookings.getAll();
        // setBookings(response.data);
        
        // Имитация для демонстрации
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockBookings: Booking[] = [
          {
            id: "1",
            carId: "1",
            userId: "user1",
            startDate: "2025-05-10T10:00:00Z",
            endDate: "2025-05-15T18:00:00Z",
            status: "confirmed",
            totalPrice: 21000,
            insurance: true,
            additionalServices: [],
            createdAt: "2025-05-01T14:30:00Z",
            updatedAt: "2025-05-01T14:30:00Z",
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
            },
            user: {
              id: "user1",
              email: "user@example.com",
              firstName: "Иван",
              lastName: "Петров",
              phone: "+7 (999) 123-45-67",
              role: "user",
              createdAt: "2023-01-15T10:30:00Z",
              updatedAt: "2023-01-15T10:30:00Z"
            }
          },
          {
            id: "2",
            carId: "2",
            userId: "user2",
            startDate: "2025-05-12T12:00:00Z",
            endDate: "2025-05-14T12:00:00Z",
            status: "pending",
            totalPrice: 4200,
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
            },
            user: {
              id: "user2",
              email: "elena@example.com",
              firstName: "Елена",
              lastName: "Сидорова",
              phone: "+7 (999) 987-65-43",
              role: "user",
              createdAt: "2023-02-20T15:45:00Z",
              updatedAt: "2023-02-20T15:45:00Z"
            }
          },
          {
            id: "3",
            carId: "3",
            userId: "user3",
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
            },
            user: {
              id: "user3",
              email: "alex@example.com",
              firstName: "Алексей",
              lastName: "Иванов",
              phone: "+7 (999) 555-44-33",
              role: "user",
              createdAt: "2023-03-05T12:20:00Z",
              updatedAt: "2023-03-05T12:20:00Z"
            }
          },
          {
            id: "4",
            carId: "1",
            userId: "user4",
            startDate: "2025-05-20T14:00:00Z",
            endDate: "2025-05-25T14:00:00Z",
            status: "cancelled",
            totalPrice: 17500,
            insurance: false,
            additionalServices: [],
            createdAt: "2025-05-10T16:45:00Z",
            updatedAt: "2025-05-12T10:30:00Z",
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
            },
            user: {
              id: "user4",
              email: "maria@example.com",
              firstName: "Мария",
              lastName: "Кузнецова",
              phone: "+7 (999) 222-33-44",
              role: "user",
              createdAt: "2023-04-12T09:30:00Z",
              updatedAt: "2023-04-12T09:30:00Z"
            }
          }
        ];
        
        setBookings(mockBookings);
      } catch (error) {
        console.error("Ошибка при загрузке бронирований:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy, HH:mm", { locale: ru });
    } catch (e) {
      return "Некорректная дата";
    }
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailDialogOpen(true);
  };

  const handleUpdateStatus = async (status: Booking['status']) => {
    if (!selectedBooking) return;
    
    setStatusUpdateLoading(true);
    try {
      // В реальном приложении:
      // await api.bookings.updateStatus(selectedBooking.id, status);
      
      // Имитация для демонстрации
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Обновляем локальное состояние
      setBookings(bookings.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, status } 
          : booking
      ));
      
      setSelectedBooking(prev => prev ? { ...prev, status } : null);
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
    } finally {
      setStatusUpdateLoading(false);
    }
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

  const filteredBookings = bookings.filter(booking => {
    // Фильтр по статусу
    if (activeTab !== "all" && booking.status !== activeTab) {
      return false;
    }
    
    // Поиск по имени клиента, автомобилю или ID
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.id.toLowerCase().includes(searchLower) ||
      booking.car?.name.toLowerCase().includes(searchLower) ||
      `${booking.user?.firstName} ${booking.user?.lastName}`.toLowerCase().includes(searchLower) ||
      booking.user?.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <AdminLayout title="Управление бронированиями">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Поиск бронирований..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="pending">Ожидают</TabsTrigger>
            <TabsTrigger value="confirmed">Активные</TabsTrigger>
            <TabsTrigger value="completed">Завершенные</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">Бронирования не найдены</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm || activeTab !== "all" 
              ? "Попробуйте изменить фильтры поиска" 
              : "Пока нет бронирований в системе"}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead>Автомобиль</TableHead>
                <TableHead>Период</TableHead>
                <TableHead>Стоимость</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {booking.user?.firstName} {booking.user?.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{booking.user?.email}</div>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{formatDate(booking.startDate)}</div>
                      <div>—</div>
                      <div>{formatDate(booking.endDate)}</div>
                    </div>
                  </TableCell>
                  <TableCell>{booking.totalPrice} ₽</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Действия</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewDetails(booking)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Детали
                        </DropdownMenuItem>
                        {booking.status === "pending" && (
                          <>
                            <DropdownMenuItem onClick={() => {
                              setSelectedBooking(booking);
                              handleUpdateStatus("confirmed");
                            }}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              Подтвердить
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedBooking(booking);
                              handleUpdateStatus("cancelled");
                            }}>
                              <XCircle className="mr-2 h-4 w-4 text-red-500" />
                              Отклонить
                            </DropdownMenuItem>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <DropdownMenuItem onClick={() => {
                            setSelectedBooking(booking);
                            handleUpdateStatus("completed");
                          }}>
                            <CheckCircle className="mr-2 h-4 w-4 text-blue-500" />
                            Отметить как завершенное
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Диалог с деталями бронирования */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Детали бронирования #{selectedBooking?.id}</DialogTitle>
            <DialogDescription>
              Создано {selectedBooking && formatDate(selectedBooking.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Клиент</h4>
                  <p className="font-medium">{selectedBooking.user?.firstName} {selectedBooking.user?.lastName}</p>
                  <p className="text-sm">{selectedBooking.user?.email}</p>
                  <p className="text-sm">{selectedBooking.user?.phone}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Автомобиль</h4>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-md overflow-hidden">
                      <img 
                        src={selectedBooking.car?.image} 
                        alt={selectedBooking.car?.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{selectedBooking.car?.name}</p>
                      <p className="text-sm">{selectedBooking.car?.category}, {selectedBooking.car?.year}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Период аренды</h4>
                <p>С {formatDate(selectedBooking.startDate)}</p>
                <p>По {formatDate(selectedBooking.endDate)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Дополнительные услуги</h4>
                {selectedBooking.insurance && (
                  <p className="text-sm">✓ Страховка</p>
                )}
                {selectedBooking.additionalServices && selectedBooking.additionalServices.length > 0 ? (
                  <ul className="text-sm list-disc list-inside">
                    {selectedBooking.additionalServices.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Нет дополнительных услуг</p>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Статус</h4>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedBooking.status)}
                  <span className="text-sm text-gray-500">
                    Обновлено: {formatDate(selectedBooking.updatedAt)}
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Стоимость</h4>
                <p className="text-xl font-bold">{selectedBooking.totalPrice} ₽</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {selectedBooking?.status === "pending" && (
              <div className="flex gap-2 w-full">
                <Button 
                  variant="destructive" 
                  onClick={() => handleUpdateStatus("cancelled")}
                  disabled={statusUpdateLoading}
                  className="flex-1"
                >
                  {statusUpdateLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Отклонить
                </Button>
                <Button 
                  onClick={() => handleUpdateStatus("confirmed")}
                  disabled={statusUpdateLoading}
                  className="flex-1"
                >
                  {statusUpdateLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Подтвердить
                </Button>
              </div>
            )}
            {selectedBooking?.status === "confirmed" && (
              <Button 
                onClick={() => handleUpdateStatus("completed")}
                disabled={statusUpdateLoading}
                className="w-full"
              >
                {statusUpdateLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Отметить как завершенное
              </Button>
            )}
            {(selectedBooking?.status === "completed" || selectedBooking?.status === "cancelled") && (
              <Button 
                variant="outline" 
                onClick={() => setDetailDialogOpen(false)}
                className="w-full"
              >
                Закрыть
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminBookings;
