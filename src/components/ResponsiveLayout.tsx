
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Home, 
  Car, 
  Calendar, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "@/lib/api";

interface ResponsiveLayoutProps {
  children: ReactNode;
}

const ResponsiveLayout = ({ children }: ResponsiveLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navigationItems = [
    { name: "Главная", path: "/", icon: Home },
    { name: "Каталог", path: "/catalog", icon: Car },
    { name: "Мои бронирования", path: "/profile/bookings", icon: Calendar },
    { name: "Мой профиль", path: "/profile", icon: User },
  ];
  
  const handleLogout = () => {
    // В реальном приложении:
    // api.auth.logout();
    navigate("/");
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Верхняя навигация для десктопов */}
      <header className="hidden md:block border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            AutoPro
          </Link>
          
          <nav className="flex items-center gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors ${
                  isActive(item.path)
                    ? "text-primary font-medium"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-gray-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </nav>
        </div>
      </header>
      
      {/* Мобильная навигация */}
      <header className="md:hidden border-b sticky top-0 bg-background z-10">
        <div className="flex justify-between items-center px-4 py-3">
          <Link to="/" className="text-xl font-bold">
            AutoPro
          </Link>
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold">Меню</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={closeMobileMenu}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between p-3 rounded-md ${
                        isActive(item.path)
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-gray-600 hover:bg-muted"
                      }`}
                      onClick={closeMobileMenu}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ))}
                </nav>
                
                <div className="mt-6 pt-6 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Выйти
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      
      {/* Основное содержимое */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Мобильная нижняя навигация */}
      <footer className="md:hidden border-t sticky bottom-0 bg-background">
        <div className="grid grid-cols-4 gap-1">
          {navigationItems.slice(0, 4).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 ${
                isActive(item.path)
                  ? "text-primary"
                  : "text-gray-500"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.name.split(' ')[0]}</span>
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default ResponsiveLayout;
