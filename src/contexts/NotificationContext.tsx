import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode,
  useCallback,
  useMemo
} from 'react';
import { useWebSocket, WebSocketMessage } from '@/hooks/useWebSocket';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Типы уведомлений
export type NotificationType = 'booking' | 'user' | 'system' | 'message';

// Интерфейс уведомления
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
  priority?: 'low' | 'medium' | 'high';
  action?: {
    label: string;
    url: string;
  };
}

// Настройки уведомлений
export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
  types: {
    booking: boolean;
    user: boolean;
    system: boolean;
    message: boolean;
  };
  preferences?: {
    showPreview: boolean;
    muteTime?: [number, number]; // Временной интервал для отключения звука [начало, конец] в часах
    groupSimilar: boolean;
  };
}

// Контекст для уведомлений
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings;
  setSettings: (settings: NotificationSettings) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  deleteNotification: (id: string) => void;
  lastMessage: WebSocketMessage | null;
  connectionStatus: 'connecting' | 'open' | 'closing' | 'closed';
}

// Значения по умолчанию
const defaultSettings: NotificationSettings = {
  enabled: true,
  sound: true,
  desktop: true,
  types: {
    booking: true,
    user: true,
    system: true,
    message: true
  },
  preferences: {
    showPreview: true,
    groupSimilar: true
  }
};

// Создание контекста
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Провайдер контекста
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  // Загружаем настройки из localStorage
  const [settings, setSettings] = useLocalStorage<NotificationSettings>(
    'notification-settings',
    defaultSettings
  );
  
  // Локальное состояние для уведомлений
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
  
  // Подключение к WebSocket
  const { 
    lastMessage, 
    allMessages, 
    connectionStatus,
    sendMessage
  } = useWebSocket({
    // В реальном приложении здесь будет url бэкенда
    url: 'wss://api.example.com/ws',
    shouldReconnect: true,
    reconnectInterval: 3000,
    reconnectAttempts: 10,
    onOpen: () => console.log('WebSocket connected'),
    onClose: () => console.log('WebSocket disconnected'),
    onError: (e) => console.error('WebSocket error:', e)
  });
  
  // Загрузка сохраненных уведомлений при монтировании
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        // Ограничиваем количество загружаемых уведомлений
        const parsedNotifications = JSON.parse(savedNotifications) as Notification[];
        setNotifications(parsedNotifications.slice(0, 50)); // Ограничиваем до 50 последних
      }
    } catch (error) {
      console.error('Ошибка при загрузке уведомлений:', error);
    }
  }, []);

  // Сохраняем уведомления в localStorage при изменении
  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications.slice(0, 100))); // Ограничиваем до 100
    } catch (error) {
      console.error('Ошибка при сохранении уведомлений:', error);
    }
  }, [notifications]);
  
  // Количество непрочитанных уведомлений
  const unreadCount = useMemo(() => {
    return notifications.filter(notification => !notification.isRead).length;
  }, [notifications]);
  
  // Отметить уведомление как прочитанное
  const markAsRead = useCallback((id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
    
    // Отправляем информацию о прочтении на сервер
    sendMessage({
      type: 'notification_read',
      id: id
    });
  }, [sendMessage]);
  
  // Удалить уведомление
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
    
    // Отправляем информацию об удалении на сервер
    sendMessage({
      type: 'notification_delete',
      id: id
    });
  }, [sendMessage]);
  
  // Отметить все уведомления как прочитанные
  const markAllAsRead = useCallback(() => {
    const unreadIds = notifications
      .filter(n => !n.isRead)
      .map(n => n.id);
      
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, isRead: true }))
    );
    
    // Отправляем информацию о массовом прочтении на сервер
    if (unreadIds.length > 0) {
      sendMessage({
        type: 'notification_read_all',
        ids: unreadIds
      });
    }
  }, [notifications, sendMessage]);
  
  // Очистить все уведомления
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    
    // Отправляем информацию об очистке на сервер
    sendMessage({
      type: 'notification_clear_all'
    });
  }, [sendMessage]);
  
  // Проверка, находимся ли мы в периоде отключенного звука
  const isInMuteTimePeriod = useCallback(() => {
    if (!settings.preferences?.muteTime) return false;
    
    const [startHour, endHour] = settings.preferences.muteTime;
    const currentHour = new Date().getHours();
    
    // Проверяем, попадает ли текущее время в интервал отключения звука
    if (startHour < endHour) {
      return currentHour >= startHour && currentHour < endHour;
    } else {
      // Обработка случая, когда интервал проходит через полночь
      return currentHour >= startHour || currentHour < endHour;
    }
  }, [settings.preferences]);
  
  // Преобразование WebSocket сообщения в уведомление
  const convertMessageToNotification = useCallback((message: WebSocketMessage): Notification => {
    let title = 'Уведомление';
    let content = 'Новое уведомление получено';
    let priority: 'low' | 'medium' | 'high' = 'medium';
    let action = undefined;
    
    // Формируем заголовок и текст в зависимости от типа сообщения
    switch (message.type) {
      case 'booking':
        const bookingStatus = message.data.status;
        title = 'Бронирование';
        priority = bookingStatus === 'pending' ? 'high' : 'medium';
        
        if (bookingStatus === 'pending') {
          content = `Новое бронирование #${message.data.bookingId} ожидает подтверждения`;
          action = {
            label: 'Просмотреть',
            url: `/admin/bookings?id=${message.data.bookingId}`
          };
        } else if (bookingStatus === 'confirmed') {
          content = `Бронирование #${message.data.bookingId} подтверждено`;
        } else if (bookingStatus === 'cancelled') {
          content = `Бронирование #${message.data.bookingId} отменено`;
        }
        break;
        
      case 'user':
        title = 'Пользователь';
        
        if (message.data.action === 'registered') {
          content = `Новый пользователь зарегистрирован: ID ${message.data.userId}`;
          priority = 'medium';
          action = {
            label: 'Просмотреть профиль',
            url: `/admin/users?id=${message.data.userId}`
          };
        } else if (message.data.action === 'updated') {
          content = `Пользователь ID ${message.data.userId} обновил свой профиль`;
          priority = 'low';
        } else if (message.data.action === 'deleted') {
          content = `Пользователь ID ${message.data.userId} удалил свой аккаунт`;
          priority = 'medium';
        }
        break;
        
      case 'system':
        title = 'Система';
        
        if (message.data.level === 'info') {
          content = `Информация: ${message.data.message}`;
          priority = 'low';
        } else if (message.data.level === 'warning') {
          content = `Предупреждение: ${message.data.message}`;
          priority = 'medium';
        } else if (message.data.level === 'error') {
          content = `Ошибка: ${message.data.message}`;
          priority = 'high';
          action = {
            label: 'Подробнее',
            url: `/admin/system/logs`
          };
        }
        break;
        
      case 'message':
        title = 'Сообщение';
        content = `Новое сообщение от пользователя ID ${message.data.from}`;
        priority = 'medium';
        action = {
          label: 'Ответить',
          url: `/admin/messages?user=${message.data.from}`
        };
        break;
    }
    
    return {
      id: message.id,
      type: message.type as NotificationType,
      title,
      message: content,
      data: message.data,
      isRead: false,
      createdAt: message.timestamp,
      priority,
      action
    };
  }, []);
  
  // Проверка, показывать ли уведомление о сообщении на основе настроек группировки
  const shouldShowGroupedNotification = useCallback((newNotification: Notification): boolean => {
    if (!settings.preferences?.groupSimilar) return true;
    
    // Ищем похожие непрочитанные уведомления за последние 5 минут
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
    
    const similarNotifications = notifications.filter(notification => 
      notification.type === newNotification.type &&
      !notification.isRead &&
      new Date(notification.createdAt) > fiveMinutesAgo
    );
    
    // Если уже есть похожие, не показываем новое
    return similarNotifications.length === 0;
  }, [notifications, settings.preferences]);
  
  // Обработка входящего сообщения
  useEffect(() => {
    if (lastMessage && settings.enabled) {
      // Проверяем, включен ли этот тип уведомлений в настройках
      const notificationType = lastMessage.type as NotificationType;
      
      if (settings.types[notificationType]) {
        const notification = convertMessageToNotification(lastMessage);
        
        // Проверяем необходимость группировки похожих уведомлений
        const shouldShow = shouldShowGroupedNotification(notification);
        
        // Добавляем в список уведомлений
        setNotifications(prev => [notification, ...prev]);
        
        if (shouldShow) {
          // Показываем toast
          toast({
            title: notification.title,
            description: settings.preferences?.showPreview 
              ? notification.message 
              : 'Новое уведомление получено',
            variant: notification.priority === 'high' 
              ? 'destructive' 
              : 'default'
          });
          
          // Показываем browser notification если разрешено
          if (settings.desktop && 'Notification' in window) {
            if (Notification.permission === 'granted') {
              new Notification(notification.title, {
                body: settings.preferences?.showPreview ? notification.message : 'Новое уведомление',
                icon: '/favicon.ico'
              });
            } else if (Notification.permission !== 'denied') {
              Notification.requestPermission();
            }
          }
          
          // Проигрываем звук если включен и не в периоде отключения
          if (settings.sound && !isInMuteTimePeriod()) {
            // Здесь можно выбрать звук в зависимости от приоритета
            const soundFile = notification.priority === 'high' 
              ? '/sounds/notification-high.mp3'
              : notification.priority === 'medium'
                ? '/sounds/notification-medium.mp3'
                : '/sounds/notification-low.mp3';
                
            // Имитация звука (в реальном приложении раскомментировать)
            // const audio = new Audio(soundFile);
            // audio.volume = 0.5;
            // audio.play().catch(e => console.error('Error playing notification sound:', e));
            
            // Для демонстрации:
            console.log(`Playing notification sound: ${soundFile}`);
          }
        }
      }
    }
  }, [lastMessage, settings, toast, convertMessageToNotification, shouldShowGroupedNotification, isInMuteTimePeriod]);
  
  // Предоставляем данные и методы через контекст
  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    settings,
    setSettings,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    deleteNotification,
    lastMessage,
    connectionStatus
  };
  
  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Хук для использования контекста уведомлений
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  
  return context;
};