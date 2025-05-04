
import { ReactNode, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Car,
  Calendar,
  Users,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import api from "@/lib/api";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    api.auth.logout();
    navigate("/admin/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
    </div>
  );
};

export default AdminLayout;
