
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
    connectionStatus 
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
  }, []);
  
  // Отметить все уведомления как прочитанные
  const markAllAsRead = useCallback(() => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, isRead: true }))
    );
  }, []);
  
  // Очистить все уведомления
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  // Преобразование WebSocket сообщения в уведомление
  const convertMessageToNotification = useCallback((message: WebSocketMessage): Notification => {
    let title = 'Уведомление';
    let content = 'Новое уведомление получено';
    
    // Формируем заголовок и текст в зависимости от типа сообщения
    switch (message.type) {
      case 'booking':
        const bookingStatus = message.data.status;
        title = 'Бронирование';
        
        if (bookingStatus === 'pending') {
          content = `Новое бронирование #${message.data.bookingId} ожидает подтверждения`;
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
        } else if (message.data.action === 'updated') {
          content = `Пользователь ID ${message.data.userId} обновил свой профиль`;
        } else if (message.data.action === 'deleted') {
          content = `Пользователь ID ${message.data.userId} удалил свой аккаунт`;
        }
        break;
        
      case 'system':
        title = 'Система';
        
        if (message.data.level === 'info') {
          content = `Информация: ${message.data.message}`;
        } else if (message.data.level === 'warning') {
          content = `Предупреждение: ${message.data.message}`;
        } else if (message.data.level === 'error') {
          content = `Ошибка: ${message.data.message}`;
        }
        break;
        
      case 'message':
        title = 'Сообщение';
        content = `Новое сообщение от пользователя ID ${message.data.from}`;
        break;
    }
    
    return {
      id: message.id,
      type: message.type,
      title,
      message: content,
      data: message.data,
      isRead: false,
      createdAt: message.timestamp
    };
  }, []);
  
  // Обработка входящего сообщения
  useEffect(() => {
    if (lastMessage && settings.enabled) {
      // Проверяем, включен ли этот тип уведомлений в настройках
      const notificationType = lastMessage.type as NotificationType;
      
      if (settings.types[notificationType]) {
        const notification = convertMessageToNotification(lastMessage);
        
        // Добавляем в список уведомлений
        setNotifications(prev => [notification, ...prev]);
        
        // Показываем toast
        toast({
          title: notification.title,
          description: notification.message,
          variant: notificationType === 'system' && lastMessage.data.level === 'error' 
            ? 'destructive' 
            : 'default'
        });
        
        // Показываем browser notification если разрешено
        if (settings.desktop && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification(notification.title, {
              body: notification.message,
              icon: '/favicon.ico'
            });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission();
          }
        }
        
        // Проигрываем звук если включен
        if (settings.sound) {
          // Здесь можно добавить звуковое уведомление
          // const audio = new Audio('/sounds/notification.mp3');
          // audio.play().catch(e => console.error('Error playing notification sound:', e));
        }
      }
    }
  }, [lastMessage, settings, toast, convertMessageToNotification]);
  
  // Предоставляем данные и методы через контекст
  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    settings,
    setSettings,
    markAsRead,
    markAllAsRead,
    clearNotifications,
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
