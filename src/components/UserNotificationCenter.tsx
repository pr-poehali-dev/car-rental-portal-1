
import { useState, useEffect } from 'react';
import { 
  Bell, 
  Calendar, 
  Clock, 
  Settings, 
  CheckCircle, 
  Info, 
  MessageSquare,
  X,
  ChevronRight,
  BellOff
} from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from '@/components/ui/sheet';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface UserNotificationCenterProps {
  variant?: 'mobile' | 'desktop';
}

const UserNotificationCenter = ({ variant = 'desktop' }: UserNotificationCenterProps) => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    settings,
    setSettings
  } = useNotifications();
  
  const [activeTab, setActiveTab] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  
  // Фильтруем уведомления по активной вкладке
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.isRead;
    return notification.type === activeTab;
  });
  
  // Форматирование времени
  const formatNotificationTime = (dateString: string): string => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: ru
      });
    } catch (error) {
      return 'неизвестное время';
    }
  };
  
  // Получение иконки для типа уведомления
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'system':
        return <Info className="h-5 w-5 text-amber-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Разрешение на отправку браузерных уведомлений
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      return false;
    }
    
    if (Notification.permission === 'granted') {
      return true;
    }
    
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    
    return false;
  };
  
  // Эффект для запроса разрешений при включении настройки
  useEffect(() => {
    if (settings.desktop) {
      requestNotificationPermission();
    }
  }, [settings.desktop]);
  
  // Обработчик уведомлений для пользователя
  // В мобильной версии используем Sheet
  // В десктопной версии используем Popover
  if (variant === 'mobile') {
    return (
      <>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={() => setOpenSheet(true)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
        
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <SheetContent side="bottom" className="h-[90vh] sm:h-[85vh]">
            <SheetHeader>
              <SheetTitle className="flex justify-between items-center">
                <span>Уведомления</span>
                {unreadCount > 0 && (
                  <Badge variant="secondary">
                    {unreadCount} новых
                  </Badge>
                )}
              </SheetTitle>
            </SheetHeader>
            
            {showSettings ? (
              <div className="py-6 space-y-4">
                <h3 className="font-medium">Настройки уведомлений</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="m-notifications-enabled">Уведомления</Label>
                      <p className="text-sm text-muted-foreground">Включить все уведомления</p>
                    </div>
                    <Switch 
                      id="m-notifications-enabled" 
                      checked={settings.enabled}
                      onCheckedChange={(checked) => setSettings({...settings, enabled: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="m-notifications-sound">Звук</Label>
                      <p className="text-sm text-muted-foreground">Звуковые уведомления</p>
                    </div>
                    <Switch 
                      id="m-notifications-sound" 
                      checked={settings.sound}
                      onCheckedChange={(checked) => setSettings({...settings, sound: checked})}
                      disabled={!settings.enabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="m-notifications-desktop">Push-уведомления</Label>
                      <p className="text-sm text-muted-foreground">Уведомления в браузере</p>
                    </div>
                    <Switch 
                      id="m-notifications-desktop" 
                      checked={settings.desktop}
                      onCheckedChange={(checked) => setSettings({...settings, desktop: checked})}
                      disabled={!settings.enabled}
                    />
                  </div>
                </div>
                
                <div className="space-y-3 pt-3">
                  <h4 className="font-medium text-sm">Типы уведомлений</h4>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="m-notification-booking" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      Бронирования
                    </Label>
                    <Switch 
                      id="m-notification-booking" 
                      checked={settings.types.booking}
                      onCheckedChange={(checked) => 
                        setSettings({
                          ...settings, 
                          types: {...settings.types, booking: checked}
                        })
                      }
                      disabled={!settings.enabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="m-notification-system" className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-amber-500" />
                      Системные
                    </Label>
                    <Switch 
                      id="m-notification-system" 
                      checked={settings.types.system}
                      onCheckedChange={(checked) => 
                        setSettings({
                          ...settings, 
                          types: {...settings.types, system: checked}
                        })
                      }
                      disabled={!settings.enabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="m-notification-message" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-purple-500" />
                      Сообщения
                    </Label>
                    <Switch 
                      id="m-notification-message" 
                      checked={settings.types.message}
                      onCheckedChange={(checked) => 
                        setSettings({
                          ...settings, 
                          types: {...settings.types, message: checked}
                        })
                      }
                      disabled={!settings.enabled}
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  onClick={() => setShowSettings(false)}
                >
                  Вернуться к уведомлениям
                </Button>
              </div>
            ) : (
              <>
                <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 w-full mt-4">
                    <TabsTrigger value="all">Все</TabsTrigger>
                    <TabsTrigger value="unread">Новые</TabsTrigger>
                    <TabsTrigger value="booking">Бронирования</TabsTrigger>
                  </TabsList>
                  
                  {unreadCount > 0 && (
                    <div className="flex justify-end my-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={markAllAsRead}
                        className="text-xs"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Отметить все как прочитанные
                      </Button>
                    </div>
                  )}
                  
                  <TabsContent value={activeTab} className="mt-0">
                    {filteredNotifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <BellOff className="h-10 w-10 text-gray-300 mb-3" />
                        <p className="text-gray-500">
                          Нет уведомлений в этой категории
                        </p>
                      </div>
                    ) : (
                      <ScrollArea className="h-[55vh]">
                        <div className="space-y-2 pt-2">
                          {filteredNotifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-3 rounded-lg border ${
                                notification.isRead 
                                  ? 'bg-background' 
                                  : 'bg-blue-50'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start mb-1">
                                    <p className="font-medium text-sm">
                                      {notification.title}
                                    </p>
                                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                      {formatNotificationTime(notification.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    {notification.message}
                                  </p>
                                  
                                  {!notification.isRead && (
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="mt-2 text-xs"
                                      onClick={() => markAsRead(notification.id)}
                                    >
                                      Отметить как прочитанное
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </TabsContent>
                </Tabs>
                
                <SheetFooter className="px-0 pt-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowSettings(true)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Настройки уведомлений
                  </Button>
                </SheetFooter>
              </>
            )}
          </SheetContent>
        </Sheet>
      </>
    );
  }
  
  // Десктопная версия
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="end">
        {showSettings ? (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Настройки уведомлений</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0"
                onClick={() => setShowSettings(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications-enabled">Уведомления</Label>
                  <p className="text-xs text-muted-foreground">Включить все уведомления</p>
                </div>
                <Switch 
                  id="notifications-enabled" 
                  checked={settings.enabled}
                  onCheckedChange={(checked) => setSettings({...settings, enabled: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications-sound">Звук</Label>
                  <p className="text-xs text-muted-foreground">Звуковые уведомления</p>
                </div>
                <Switch 
                  id="notifications-sound" 
                  checked={settings.sound}
                  onCheckedChange={(checked) => setSettings({...settings, sound: checked})}
                  disabled={!settings.enabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications-desktop">Push-уведомления</Label>
                  <p className="text-xs text-muted-foreground">Уведомления в браузере</p>
                </div>
                <Switch 
                  id="notifications-desktop" 
                  checked={settings.desktop}
                  onCheckedChange={(checked) => setSettings({...settings, desktop: checked})}
                  disabled={!settings.enabled}
                />
              </div>
            </div>
            
            <div className="space-y-3 pt-2">
              <h4 className="font-medium text-sm">Типы уведомлений</h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notification-booking" className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Бронирования
                  </Label>
                  <Switch 
                    id="notification-booking" 
                    checked={settings.types.booking}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        types: {...settings.types, booking: checked}
                      })
                    }
                    disabled={!settings.enabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notification-system" className="flex items-center gap-2 text-sm">
                    <Info className="h-4 w-4 text-amber-500" />
                    Системные
                  </Label>
                  <Switch 
                    id="notification-system" 
                    checked={settings.types.system}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        types: {...settings.types, system: checked}
                      })
                    }
                    disabled={!settings.enabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notification-message" className="flex items-center gap-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-purple-500" />
                    Сообщения
                  </Label>
                  <Switch 
                    id="notification-message" 
                    checked={settings.types.message}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        types: {...settings.types, message: checked}
                      })
                    }
                    disabled={!settings.enabled}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 pb-2">
              <h3 className="font-medium">Уведомления</h3>
              <div className="flex gap-1">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="h-7 px-2 text-xs"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Прочитать все
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
              <div className="px-4">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="all">Все</TabsTrigger>
                  <TabsTrigger value="unread">
                    Новые
                    {unreadCount > 0 && (
                      <Badge className="ml-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center" variant="secondary">
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="booking">Брони</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value={activeTab} className="mt-0 pt-2">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40">
                    <BellOff className="h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-gray-500 text-sm">
                      Нет уведомлений
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[320px]">
                    <div className="space-y-1 px-4 pb-4">
                      {filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg ${
                            notification.isRead 
                              ? 'hover:bg-muted/50' 
                              : 'bg-blue-50/70'
                          } transition-colors cursor-pointer`}
                          onClick={() => {
                            if (!notification.isRead) {
                              markAsRead(notification.id);
                            }
                          }}
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <p className="font-medium text-sm">
                                  {notification.title}
                                </p>
                                <span className="text-xs text-gray-500 ml-2">
                                  {formatNotificationTime(notification.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 self-center" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default UserNotificationCenter;
