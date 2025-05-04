
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CarCard from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Gauge, MapPin, ThumbsUp } from "lucide-react";

const Index = () => {
  // Моковые данные для примера
  const popularCars = [
    {
      id: "1",
      name: "Toyota Camry",
      image: "https://images.unsplash.com/photo-1621007806512-be7837a1e15c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 3500,
      category: "Бизнес класс",
      seats: 5,
      transmission: "Автомат"
    },
    {
      id: "2",
      name: "Volkswagen Polo",
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 2100,
      category: "Эконом класс",
      seats: 5,
      transmission: "Механика"
    },
    {
      id: "3",
      name: "BMW X5",
      image: "https://images.unsplash.com/photo-1518987048-93e29699e79a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 6800,
      category: "Премиум класс",
      seats: 7,
      transmission: "Автомат"
    }
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Hero />
      
      {/* Преимущества */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Почему выбирают нас</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Быстрое бронирование</h3>
              <p className="text-gray-600">Оформление займет не более 15 минут</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Gauge className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Новые автомобили</h3>
              <p className="text-gray-600">Средний возраст наших авто - 1.5 года</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Доставка по городу</h3>
              <p className="text-gray-600">Привезем автомобиль в удобное место</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <ThumbsUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Лучшие цены</h3>
              <p className="text-gray-600">Гарантируем конкурентные цены</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Популярные автомобили */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Популярные автомобили</h2>
            <Link to="/catalog">
              <Button variant="outline">Смотреть все</Button>
            </Link>
          </div>
          
          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger 
                value="all" 
                onClick={() => setActiveCategory("all")}
              >
                Все
              </TabsTrigger>
              <TabsTrigger 
                value="economy" 
                onClick={() => setActiveCategory("economy")}
              >
                Эконом
              </TabsTrigger>
              <TabsTrigger 
                value="business" 
                onClick={() => setActiveCategory("business")}
              >
                Бизнес
              </TabsTrigger>
              <TabsTrigger 
                value="premium" 
                onClick={() => setActiveCategory("premium")}
              >
                Премиум
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularCars.map(car => (
                  <CarCard key={car.id} {...car} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="economy" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularCars
                  .filter(car => car.category.toLowerCase().includes("эконом"))
                  .map(car => (
                    <CarCard key={car.id} {...car} />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="business" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularCars
                  .filter(car => car.category.toLowerCase().includes("бизнес"))
                  .map(car => (
                    <CarCard key={car.id} {...car} />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="premium" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularCars
                  .filter(car => car.category.toLowerCase().includes("премиум"))
                  .map(car => (
                    <CarCard key={car.id} {...car} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Подвал */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">АвтоПрокат</h3>
              <p className="text-gray-400">Ваш надежный партнер в аренде автомобилей с 2015 года.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Контакты</h3>
              <p className="text-gray-400 mb-2">+7 (999) 123-45-67</p>
              <p className="text-gray-400">info@autopro.ru</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Адрес</h3>
              <p className="text-gray-400">г. Москва, ул. Автомобильная, 42</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Меню</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Главная</Link></li>
                <li><Link to="/catalog" className="text-gray-400 hover:text-white">Каталог</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white">О нас</Link></li>
                <li><Link to="/contacts" className="text-gray-400 hover:text-white">Контакты</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 АвтоПрокат. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

// Импорт компонентов React Router
import { Link } from "react-router-dom";
