
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import CarDetail, { CarDetailProps } from "@/components/CarDetail";
import BookingForm from "@/components/BookingForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

// Имитация данных автомобиля (в реальном проекте это будет API запрос)
const MOCK_CARS: Record<string, CarDetailProps> = {
  "1": {
    id: "1",
    name: "Toyota Camry",
    images: [
      "https://images.unsplash.com/photo-1621007806512-be7837a1e15c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550855450-5f2ce781f8ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1597653907411-c91447c1bb1c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602787452686-5a2b7e1fd9b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    price: 3500,
    category: "Бизнес",
    seats: 5,
    transmission: "Автомат",
    fuelType: "Бензин",
    year: 2022,
    description: "Toyota Camry – это седан бизнес-класса, который сочетает в себе элегантный дизайн, просторный комфортабельный салон и отличные динамические характеристики. Автомобиль отличается хорошей управляемостью и плавностью хода. Имеет вместительный багажник и современную мультимедийную систему.",
    features: [
      "Климат-контроль",
      "Кожаный салон",
      "Подогрев сидений",
      "Камера заднего вида",
      "Круиз-контроль",
      "Бесключевой доступ",
      "Мультимедиа с Apple CarPlay/Android Auto",
      "Система контроля слепых зон"
    ],
    additionalServices: [
      {
        id: "gps",
        name: "GPS-навигатор",
        price: 300,
        description: "Аренда GPS-навигатора на весь срок проката"
      },
      {
        id: "child-seat",
        name: "Детское кресло",
        price: 500,
        description: "Аренда детского кресла на весь срок проката"
      },
      {
        id: "delivery",
        name: "Доставка автомобиля",
        price: 1000,
        description: "Доставка автомобиля по указанному адресу"
      }
    ],
    rating: 4.8,
    reviews: 24
  },
  "2": {
    id: "2",
    name: "Volkswagen Polo",
    images: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574275853537-481bd7dd8b91?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1614839402512-720deaec04fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    price: 2100,
    category: "Эконом",
    seats: 5,
    transmission: "Механика",
    fuelType: "Бензин",
    year: 2021,
    description: "Volkswagen Polo – это экономичный и компактный автомобиль, идеально подходящий для передвижения по городу. Отличается надежностью, хорошей управляемостью и низким расходом топлива. Подходит для тех, кто ценит комфорт в сочетании с экономичностью.",
    features: [
      "Кондиционер",
      "Аудиосистема",
      "USB-разъем",
      "Электростеклоподъемники",
      "ABS",
      "Подушки безопасности",
      "Центральный замок",
      "Бортовой компьютер"
    ],
    additionalServices: [
      {
        id: "gps",
        name: "GPS-навигатор",
        price: 300,
        description: "Аренда GPS-навигатора на весь срок проката"
      },
      {
        id: "child-seat",
        name: "Детское кресло",
        price: 500,
        description: "Аренда детского кресла на весь срок проката"
      }
    ],
    rating: 4.6,
    reviews: 18
  },
  "3": {
    id: "3",
    name: "BMW X5",
    images: [
      "https://images.unsplash.com/photo-1518987048-93e29699e79a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556800572-1b8aedf82bb8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549399542-7e8ee8671c6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    price: 6800,
    category: "Премиум",
    seats: 7,
    transmission: "Автомат",
    fuelType: "Дизель",
    year: 2023,
    description: "BMW X5 – это роскошный внедорожник, сочетающий в себе комфорт премиум-класса, отличную динамику и проходимость. Автомобиль оснащен современными системами безопасности и помощи водителю, а также имеет просторный салон с премиальной отделкой и вместительный багажник.",
    features: [
      "Панорамная крыша",
      "Премиум аудиосистема",
      "Подогрев сидений",
      "Вентиляция сидений",
      "Адаптивный круиз-контроль",
      "Система кругового обзора",
      "Проекционный дисплей",
      "Полный привод",
      "Система автоматической парковки",
      "Беспроводная зарядка телефона"
    ],
    additionalServices: [
      {
        id: "gps",
        name: "GPS-навигатор",
        price: 300,
        description: "Аренда GPS-навигатора на весь срок проката"
      },
      {
        id: "child-seat",
        name: "Детское кресло",
        price: 500,
        description: "Аренда детского кресла на весь срок проката"
      },
      {
        id: "delivery",
        name: "Доставка автомобиля",
        price: 1000,
        description: "Доставка автомобиля по указанному адресу"
      },
      {
        id: "vip-service",
        name: "VIP обслуживание",
        price: 3000,
        description: "Персональный менеджер, приоритетное обслуживание"
      }
    ],
    rating: 4.9,
    reviews: 32
  }
};

const CarPage = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<CarDetailProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки данных
    setLoading(true);
    
    setTimeout(() => {
      if (id && MOCK_CARS[id]) {
        setCar(MOCK_CARS[id]);
      }
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Автомобиль не найден</h1>
            <p className="mt-2 text-gray-600">Запрошенный автомобиль не существует или был удален.</p>
            <div className="mt-6">
              <Link to="/catalog">
                <Button>Вернуться в каталог</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/catalog">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Назад в каталог
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <CarDetail {...car} />
            </div>
            
            <div>
              <BookingForm 
                carId={car.id} 
                carName={car.name} 
                pricePerDay={car.price} 
              />
            </div>
          </div>
        </div>
      </div>
      
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

export default CarPage;
