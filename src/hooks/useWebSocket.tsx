
import { useState, useEffect, useRef, useCallback } from 'react';

// Типы событий WebSocket
export type WebSocketEvent = 'booking' | 'user' | 'system' | 'message';

export interface WebSocketMessage {
  id: string;
  type: WebSocketEvent;
  data: any;
  timestamp: string;
}

interface UseWebSocketOptions {
  url: string;
  reconnectInterval?: number;
  reconnectAttempts?: number;
  onOpen?: (event: WebSocketEventMap['open']) => void;
  onClose?: (event: WebSocketEventMap['close']) => void;
  onError?: (event: WebSocketEventMap['error']) => void;
  shouldReconnect?: boolean;
}

export interface UseWebSocketReturn {
  sendMessage: (message: any) => void;
  lastMessage: WebSocketMessage | null;
  allMessages: WebSocketMessage[];
  readyState: number;
  connectionStatus: 'connecting' | 'open' | 'closing' | 'closed';
  clearMessages: () => void;
}

/**
 * Хук для работы с WebSocket соединением
 */
export const useWebSocket = ({
  url,
  reconnectInterval = 3000,
  reconnectAttempts = 5,
  onOpen,
  onClose,
  onError,
  shouldReconnect = true
}: UseWebSocketOptions): UseWebSocketReturn => {
  const socketRef = useRef<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [allMessages, setAllMessages] = useState<WebSocketMessage[]>([]);
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);
  const reconnectTimeoutRef = useRef<number | undefined>();
  const reconnectCountRef = useRef<number>(0);

  // Преобразование readyState в более понятный статус
  const connectionStatus = useCallback((): 'connecting' | 'open' | 'closing' | 'closed' => {
    switch (readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'open';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'closed';
      default:
        return 'closed';
    }
  }, [readyState]);

  // Функция для отправки сообщений
  const sendMessage = useCallback((message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent.');
    }
  }, []);

  // Очистка истории сообщений
  const clearMessages = useCallback(() => {
    setAllMessages([]);
    setLastMessage(null);
  }, []);

  // Функция для установки соединения
  const connect = useCallback(() => {
    // В разработке мы используем моковый WebSocket
    // В продакшне здесь будет реальное соединение
    if (process.env.NODE_ENV === 'development') {
      console.log('Creating mock WebSocket connection...');
      
      // Имитация WebSocket для разработки
      const mockSocket = {
        readyState: WebSocket.CONNECTING,
        close: () => {
          mockSocket.readyState = WebSocket.CLOSED;
          setReadyState(WebSocket.CLOSED);
          if (onClose) onClose(new CloseEvent('close'));
        },
        send: (data: string) => {
          console.log('Mock WebSocket sent:', data);
        }
      };
      
      // Устанавливаем статус после таймаута для имитации подключения
      setTimeout(() => {
        mockSocket.readyState = WebSocket.OPEN;
        setReadyState(WebSocket.OPEN);
        if (onOpen) onOpen(new Event('open') as any);
        
        // Имитируем входящие сообщения каждые 8-15 секунд
        const mockMessageInterval = setInterval(() => {
          if (mockSocket.readyState === WebSocket.OPEN) {
            const eventTypes: WebSocketEvent[] = ['booking', 'user', 'system', 'message'];
            const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
            
            const mockMessage: WebSocketMessage = {
              id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
              type: randomType,
              data: getMockMessageData(randomType),
              timestamp: new Date().toISOString()
            };
            
            handleMessage(mockMessage);
          } else {
            clearInterval(mockMessageInterval);
          }
        }, Math.random() * 7000 + 8000); // 8-15 секунд
      }, 1000);
      
      socketRef.current = mockSocket as any;
    } else {
      // Реальное WebSocket соединение для продакшн
      try {
        const socket = new WebSocket(url);
        
        socket.onopen = (event) => {
          setReadyState(WebSocket.OPEN);
          reconnectCountRef.current = 0;
          if (onOpen) onOpen(event);
        };
        
        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as WebSocketMessage;
            handleMessage(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        socket.onclose = (event) => {
          setReadyState(WebSocket.CLOSED);
          if (onClose) onClose(event);
          
          if (shouldReconnect && reconnectCountRef.current < reconnectAttempts) {
            reconnectTimeoutRef.current = window.setTimeout(() => {
              reconnectCountRef.current += 1;
              connect();
            }, reconnectInterval);
          }
        };
        
        socket.onerror = (event) => {
          if (onError) onError(event);
        };
        
        socketRef.current = socket;
      } catch (error) {
        console.error('WebSocket connection error:', error);
        setReadyState(WebSocket.CLOSED);
      }
    }
  }, [url, onOpen, onClose, onError, reconnectInterval, reconnectAttempts, shouldReconnect]);

  // Обработка входящих сообщений
  const handleMessage = (message: WebSocketMessage) => {
    setLastMessage(message);
    setAllMessages((prev) => [...prev, message]);
  };

  // Данные для имитации сообщений
  const getMockMessageData = (type: WebSocketEvent) => {
    switch (type) {
      case 'booking':
        return {
          bookingId: `b_${Math.floor(Math.random() * 10000)}`,
          userId: `user_${Math.floor(Math.random() * 100)}`,
          carId: `car_${Math.floor(Math.random() * 50)}`,
          status: ['pending', 'confirmed', 'cancelled'][Math.floor(Math.random() * 3)],
          message: 'Новое бронирование автомобиля'
        };
      case 'user':
        return {
          userId: `user_${Math.floor(Math.random() * 100)}`,
          action: ['registered', 'updated', 'deleted'][Math.floor(Math.random() * 3)],
          message: 'Обновление данных пользователя'
        };
      case 'system':
        return {
          level: ['info', 'warning', 'error'][Math.floor(Math.random() * 3)],
          message: 'Системное уведомление'
        };
      case 'message':
        return {
          from: `user_${Math.floor(Math.random() * 100)}`,
          content: 'Сообщение от пользователя',
          read: false
        };
      default:
        return { message: 'Неизвестное событие' };
    }
  };

  // Установка соединения при монтировании компонента
  useEffect(() => {
    connect();
    
    // Очистка при размонтировании
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  // Обновление readyState
  useEffect(() => {
    if (socketRef.current) {
      setReadyState(socketRef.current.readyState);
    }
  }, [socketRef.current?.readyState]);

  return {
    sendMessage,
    lastMessage,
    allMessages,
    readyState,
    connectionStatus: connectionStatus(),
    clearMessages
  };
};
