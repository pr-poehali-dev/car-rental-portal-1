
import { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Notification, useNotifications, NotificationSettings } from '@/contexts/NotificationContext';
import { Calendar, UserCheck, AlertCircle, MessageCircle, CheckCircle, BellOff, Volume2, Volume2Off, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface MobileNotificationCenterProps {
  open: boolean;
  onClose: () => void;
}

export const MobileNotificationCenter = ({ open, onClose }: MobileNotificationCenterProps) => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    settings, 
    setSettings 
  } = useNotifications();
  
  const [activeTab, setActiveTab] = useState('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Фильтрация уведомлений по выбранной вкладке
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.isRead;
    return notification.type === activeTab;
  });
  
  // Подсчет количества уведомлений по типам
  const getTypeCount = (type: string) => 
    notifications.filter(notification => notification.type === type).length;
  
  // Иконка в зависимости от типа уведомления
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'user':
        return <UserCheck className="h-5 w-5 text-green-500" />;
      case 'system':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'message':
        return <MessageCircle className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
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
  
  // Обновление настроек
  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings({ ...settings, ...newSettings });
  };
  
  // Обновление настроек для конкретного типа уведомлений
  const updateTypeSettings = (type: keyof NotificationSettings['types'], value: boolean) => {
    setSettings({
      ...settings,
      types: {
        ...settings.types,
        [type]: value
      }
    });
  };

  return (
    <Drawer open={open} onClose={onClose} direction="bottom">
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>
            Уведомления
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} новых
              </Badge>
            )}
          </DrawerTitle>
          <DrawerDescription>
            {isSettingsOpen ? 
              'Настройка параметров уведомлений' : 
              'Просмотр и управление уведомлениями'
            }
          </DrawerDescription>
        </DrawerHeader>
        
        {isSettingsOpen ? (
          <div className="p-4 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications-enabled">Уведомления</Label>
                  <p className="text-sm text-muted-foreground">
                    Включить или отключить все уведомления
                  </p>
                </div>
                <Switch 
                  id="notifications-enabled" 
                  checked={settings.enabled}
                  onCheckedChange={(checked) => updateSettings({ enabled: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications-sound">Звуковые уведомления</Label>
                  <p className="text-sm text-muted-foreground">
                    Звуковой сигнал при получении уведомлений
                  </p>
                </div>
                <Switch 
                  id="notifications-sound" 
                  checked={settings.sound}
                  onCheckedChange={(checked) => updateSettings({ sound: checked })}
                  disabled={!settings.enabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications-desktop">Уведомления браузера</Label>
                  <p className="text-sm text-muted-foreground">
                    Показывать уведомления даже когда браузер свернут
                  </p>
                </div>
                <Switch 
                  id="notifications-desktop" 
                  checked={settings.desktop}
                  onCheckedChange={(checked) => updateSettings({ desktop: checked })}
                  disabled={!settings.enabled}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Типы уведомлений</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <Label htmlFor="notification-booking">Бронирования</Label>
                  </div>
                  <Switch 
                    id="notification-booking" 
                    checked={settings.types.booking}
                    onCheckedChange={(checked) => updateTypeSettings('booking', checked)}
                    disabled={!settings.enabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4 text-green-500" />
                    <Label htmlFor="notification-user">Пользователи</Label>
                  </div>
                  <Switch 
                    id="notification-user" 
                    checked={settings.types.user}
                    onCheckedChange={(checked) => updateTypeSettings('user', checked)}
                    disabled={!settings.enabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <Label htmlFor="notification-system">Системные</Label>
                  </div>
                  <Switch 
                    id="notification-system" 
                    checked={settings.types.system}
                    onCheckedChange={(checked) => updateTypeSettings('system', checked)}
                    disabled={!settings.enabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4 text-purple-500" />
                    <Label htmlFor="notification-message">Сообщения</Label>
                  </div>
                  <Switch 
                    id="notification-message" 
                    checked={settings.types.message}
                    onCheckedChange={(checked) => updateTypeSettings('message', checked)}
                    disabled={!settings.enabled}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-3">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setIsSettingsOpen(false)}
              >
                Готово
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-4">
                <TabsList className="grid grid-cols-3 w-full mb-3">
                  <TabsTrigger value="all">
                    Все
                    <Badge className="ml-1" variant="secondary">
                      {notifications.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="unread">
                    Новые
                    <Badge className="ml-1" variant="secondary">
                      {unreadCount}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="booking">
                    Брони
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value={activeTab} className="p-0 m-0">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-10 px-6">
                    <BellOff className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      Нет уведомлений в этой категории
                    </p>
                  </div>
                ) : (
                  <>
                    {unreadCount > 0 && (
                      <div className="flex justify-end px-4 py-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={markAllAsRead}
                          className="text-xs h-8"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Отметить все как прочитанные
                        </Button>
                      </div>
                    )}
                    
                    <ScrollArea className="h-[60vh] px-4">
                      <div className="space-y-2 py-2">
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
                                <div className="flex justify-between items-start">
                                  <p className="font-medium text-sm">
                                    {notification.title}
                                  </p>
                                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                    {formatNotificationTime(notification.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
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
                  </>
                )}
              </TabsContent>
            </Tabs>
            
            <DrawerFooter className="p-4 pt-0">
              <div className="flex gap-4 w-full">
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  {settings.sound ? <Volume2 className="h-4 w-4 mr-2" /> : <Volume2Off className="h-4 w-4 mr-2" />}
                  Настройки
                </Button>
                <Button 
                  variant="default" 
                  className="flex-1"
                  onClick={onClose}
                >
                  Закрыть
                </Button>
              </div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNotificationCenter;
