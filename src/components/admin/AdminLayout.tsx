import { ReactNode, useState, useRef, useEffect } from "react");
import { useNavigate, Link } from "react-router-dom");
import { Button } from "@/components/ui/button");
import {
  LayoutDashboard,
  Car,
  Calendar,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Volume2,
  VolumeX
} from "lucide-react");
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog");
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover");
import { Switch } from "@/components/ui/switch");
import { Label } from "@/components/ui/label");
import { Badge } from "@/components/ui/badge");
import { useToast } from "@/components/ui/use-toast");
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs");
import { ScrollArea } from "@/components/ui/scroll-area");
import { Separator } from "@/components/ui/separator");
import { useNotifications } from "@/contexts/NotificationContext");
import api from "@/lib/api");
import NotificationCenter from "@/components/admin/NotificationCenter");

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const notificationRef = useRef<HTMLButtonElement>(null);
  
  const { 
    unreadCount, 
    notifications, 
    settings, 
    setSettings,
    lastMessage 
  } = useNotifications();

  const handleLogout = () => {
    api.auth.logout();
    navigate("/admin/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Эффект для обработки новых уведомлений
  useEffect(() => {
    if (lastMessage && settings.enabled) {
      // Показать тост при получении нового уведомления
      toast({
        title: `Новое уведомление: ${lastMessage.type}`,
        description: "Получено новое системное уведомление",
        duration: 5000,
      });
      
      // Проиграть звук, если включено
      if (settings.sound) {
        try {
          // Создаем новый элемент аудио и проигрываем его
          const audio = new Audio('/notification-sound.mp3');
          audio.volume = 0.5;
          audio.play().catch(e => console.error('Error playing sound:', e));
        } catch (e) {
          console.error('Error playing notification sound:', e);
        }
      }
    }
  }, [lastMessage, settings.enabled, settings.sound, toast]);

  const navItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: "Панель управления", path: "/admin" },
    { icon: <Car className="h-5 w-5" />, label: "Автомобили", path: "/admin/cars" },
    { icon: <Calendar className="h-5 w-5" />, label: "Бронирования", path: "/admin/bookings" },
    { icon: <Users className="h-5 w-5" />, label: "Пользователи", path: "/admin/users" },
    { icon: <Settings className="h-5 w-5" />, label: "Настройки", path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Верхний бар */}
      <header className="bg-white shadow-sm z-10">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden mr-2" 
              onClick={toggleSidebar}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl font-bold text-gray-900">АвтоПрокат - Админ</h1>
          </div>
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative"
                  ref={notificationRef}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <NotificationCenter onClose={() => setNotificationsOpen(false)} />
              </PopoverContent>
            </Popover>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout} 
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Выйти</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Боковое меню */}
        <aside 
          className={`bg-white w-64 shadow-md fixed top-16 bottom-0 left-0 z-10 transition-transform duration-300 ease-in-out transform md:translate-x-0 md:static ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="p-4 h-full flex flex-col">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6 border-t">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSettingsOpen(true)}
                className="w-full justify-start text-gray-700 mb-2"
              >
                {settings.sound ? (
                  <Volume2 className="h-4 w-4 mr-2" />
                ) : (
                  <VolumeX className="h-4 w-4 mr-2" />
                )}
                Настройки уведомлений
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/")} 
                className="w-full justify-start text-gray-700"
              >
                Вернуться на сайт
              </Button>
            </div>
          </nav>
        </aside>

        {/* Основное содержимое */}
        <main className="flex-1 p-6 flex flex-col">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
          
          {/* Контент */}
          <div className="bg-white shadow-sm rounded-lg p-6 flex-1">
            {children}
          </div>
        </main>
      </div>
      
      {/* Диалог настроек уведомлений */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Настройки уведомлений</DialogTitle>
            <DialogDescription>
              Настройте параметры отображения и звука уведомлений
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
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
                onCheckedChange={(checked) => setSettings({...settings, enabled: checked})}
              />
            </div>
            
            <Separator />
            
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
                onCheckedChange={(checked) => setSettings({...settings, sound: checked})}
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
                onCheckedChange={(checked) => setSettings({...settings, desktop: checked})}
                disabled={!settings.enabled}
              />
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium mb-3">Типы уведомлений</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notification-booking">Бронирования</Label>
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
                  <Label htmlFor="notification-user">Пользователи</Label>
                  <Switch 
                    id="notification-user" 
                    checked={settings.types.user}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        types: {...settings.types, user: checked}
                      })
                    }
                    disabled={!settings.enabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notification-system">Системные</Label>
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
                  <Label htmlFor="notification-message">Сообщения</Label>
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
          
          <DialogFooter>
            <Button onClick={() => setSettingsOpen(false)}>
              Готово
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLayout;