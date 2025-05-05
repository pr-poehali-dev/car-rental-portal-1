
import { useState, useEffect } from "react";
import { 
  Bell, 
  Calendar, 
  UserCheck, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Clock
} from "lucide-react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

// Тип для уведомлений
interface Notification {
  id: string;
  type: "booking" | "user" | "system";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: {
    bookingId?: string;
    userId?: string;
    carId?: string;
  };
}

interface NotificationCenterProps {
  onClose: () => void;
}

const NotificationCenter = ({ onClose }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  // Получаем уведомления при открытии компонента
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // В реальном приложении:
      // const response = await api.notifications.getAdminNotifications();
      // setNotifications(response);

      // Имитация для демонстрации
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const now = new Date();
      const minutes15Ago = new Date(now.getTime() - 15 * 60000);
      const hoursAgo = new Date(now.getTime() - 2 * 60 * 60000);
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);
      
      const mockNotifications: Notification[] = [
        {
          id: "n1",
          type: "booking",
          title: "Новое бронирование",
          message: "Пользователь Иван П. оформил новое бронирование на Toyota Camry",
          isRead: false,
          createdAt: minutes15Ago.toISOString(),
          data: {
            bookingId: "b123",
            userId: "u456",
            carId: "c789"
          }
        },
        {
          id: "n2",
          type: "user",
          title: "Новая регистрация",
          message: "Зарегистрирован новый пользователь: Елена С.",
          isRead: false,
          createdAt: hoursAgo.toISOString()
        },
        {
          id: "n3",
          type: "booking",
          title: "Отмена бронирования",
          message: "Пользователь Алексей К. отменил бронирование на BMW X5",
          isRead: false,
          createdAt: todayStart.toISOString()
        },
        {
          id: "n4",
          type: "system",
          title: "Обновление системы",
          message: "Системное обновление успешно завершено",
          isRead: true,
          createdAt: new Date(now.getTime() - 24 * 60 * 60000).toISOString()
        },
        {
          id: "n5",
          type: "booking",
          title: "Завершение аренды",
          message: "Завершена аренда Volkswagen Polo. Автомобиль возвращен.",
          isRead: true,
          createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60000).toISOString()
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error("Ошибка при загрузке уведомлений:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    // В реальном приложении:
    // await api.notifications.markAsRead(id);
    
    // Обновляем состояние локально
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const handleMarkAllRead = async () => {
    // В реальном приложении:
    // await api.notifications.markAllAsRead();
    
    // Обновляем состояние локально
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.isRead;
    return notification.type === activeTab;
  });

  const unreadCount = notifications.filter(notification => !notification.isRead).length;
  const getTypeCount = (type: string) => 
    notifications.filter(notification => notification.type === type).length;

  // Иконка в зависимости от типа уведомления
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "user":
        return <UserCheck className="h-5 w-5 text-green-500" />;
      case "system":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Форматирование относительного времени
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(parseISO(dateString), { 
        addSuffix: true,
        locale: ru
      });
    } catch (e) {
      return "неизвестное время";
    }
  };

  return (
    <Card className="absolute top-full right-0 mt-2 w-[420px] shadow-lg z-50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Уведомления</CardTitle>
            <CardDescription>
              {unreadCount > 0 
                ? `У вас ${unreadCount} непрочитанных уведомлений` 
                : "Нет новых уведомлений"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-4 pt-1 pb-2">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all" className="text-xs">
                Все
                <Badge className="ml-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
                  {notifications.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                Новые
                <Badge className="ml-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="booking" className="text-xs">
                Бронирования
                <Badge className="ml-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
                  {getTypeCount("booking")}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="user" className="text-xs">
                Пользователи
                <Badge className="ml-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
                  {getTypeCount("user")}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="m-0">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Clock className="h-6 w-6 text-gray-400 animate-pulse" />
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                <Bell className="h-8 w-8 text-gray-300 mb-2" />
                <p className="text-gray-500">Нет уведомлений в этой категории</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center px-4 py-2">
                  <span className="text-sm text-gray-500">
                    {filteredNotifications.length} уведомлений
                  </span>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleMarkAllRead}
                      className="text-xs h-7"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Отметить все как прочитанные
                    </Button>
                  )}
                </div>
                <Separator />
                <ScrollArea className="h-[400px] px-4">
                  <div className="space-y-1 py-2">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg transition-colors ${
                          notification.isRead 
                            ? "hover:bg-gray-100" 
                            : "bg-blue-50 hover:bg-blue-100"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className="font-medium text-sm truncate">{notification.title}</p>
                              <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">
                                {formatRelativeTime(notification.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              {notification.type === "booking" && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-7 text-xs"
                                >
                                  Открыть бронирование
                                </Button>
                              )}
                              {!notification.isRead && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 text-xs ml-auto"
                                  onClick={() => handleMarkRead(notification.id)}
                                >
                                  Отметить как прочитанное
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
