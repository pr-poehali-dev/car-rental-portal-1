
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import api from "@/lib/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите email и пароль",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // В реальном приложении здесь будет использоваться api.auth.login
      // const response = await api.auth.login(email, password);
      
      // Имитация входа для демонстрации
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Проверка демо-учетных данных
      if (email === "admin@autopro.ru" && password === "admin123") {
        localStorage.setItem("token", "demo-token");
        localStorage.setItem("user", JSON.stringify({
          id: "1",
          email: "admin@autopro.ru",
          firstName: "Администратор",
          lastName: "Системы",
          role: "admin"
        }));
        
        toast({
          title: "Успешный вход",
          description: "Добро пожаловать в панель администратора",
        });
        
        navigate("/admin");
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка авторизации",
          description: "Неверный email или пароль",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось выполнить вход",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Вход в панель администратора</CardTitle>
          <CardDescription className="text-center">
            Введите ваши учетные данные для входа
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@autopro.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Войти
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-gray-500 text-center">
            Демо-доступ: admin@autopro.ru / admin123
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
