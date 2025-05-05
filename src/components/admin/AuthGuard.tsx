
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

interface AuthGuardProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const AuthGuard = ({ children, adminOnly = true }: AuthGuardProps) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // В реальном приложении здесь будет проверка токена
        // const isValid = await api.auth.validateToken();
        
        // Для демонстрации используем проверку наличия токена в localStorage
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");
        
        if (token && userString) {
          const user = JSON.parse(userString);
          setIsAuthenticated(true);
          setIsAdmin(user.role === "admin");
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Ошибка проверки аутентификации:", error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Перенаправляем на страницу входа с сохранением изначального URL в state
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Если требуются права администратора, но пользователь не админ
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
