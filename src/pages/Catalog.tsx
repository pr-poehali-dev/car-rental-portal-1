
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import FilterPanel, { FilterState } from "@/components/FilterPanel";
import CarCard from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Типы сортировки
type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

// Интерфейс для автомобиля
interface Car {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  seats: number;
  transmission: string;
  description?: string;
  features?: string[];
}

const Catalog = () => {
  // Моковые данные автомобилей
  const allCars: Car[] = [
    {
      id: "1",
      name: "Toyota Camry",
      image: "https://images.unsplash.com/photo-1621007806512-be7837a1e15c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 3500,
      category: "Бизнес",
      seats: 5,
      transmission: "Автомат",
      description: "Комфортный седан бизнес-класса с просторным салоном и богатой комплектацией.",
      features: ["Климат-контроль", "Кожаный салон", "Камера заднего вида", "Круиз-контроль"]
    },
    {
      id: "2",
      name: "Volkswagen Polo",
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 2100,
      category: "Эконом",
      seats: 5,
      transmission: "Механика",
      description: "Экономичный и надежный автомобиль для городских поездок.",
      features: ["Кондиционер", "Аудиосистема", "ABS", "Подушки безопасности"]
    },
    {
      id: "3",
      name: "BMW X5",
      image: "https://images.unsplash.com/photo-1518987048-93e29699e79a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 6800,
      category: "Премиум",
      seats: 7,
      transmission: "Автомат",
      description: "Роскошный внедорожник с мощным двигателем и полным приводом.",
      features: ["Панорамная крыша", "Премиум аудиосистема", "Подогрев сидений", "Адаптивный круиз-контроль"]
    },
    {
      id: "4",
      name: "Kia Rio",
      image: "https://images.unsplash.com/photo-1587638069437-80a2c254a282?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 1800,
      category: "Эконом",
      seats: 5,
      transmission: "Механика",
      description: "Экономичный городской автомобиль с низким расходом топлива.",
      features: ["Кондиционер", "USB-разъем", "Электростеклоподъемники", "Центральный замок"]
    },
    {
      id: "5",
      name: "Mercedes-Benz E-Class",
      image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 5200,
      category: "Бизнес",
      seats: 5,
      transmission: "Автомат",
      description: "Элегантный седан представительского класса с инновационными технологиями.",
      features: ["Система MBUX", "Адаптивные фары", "Память сидений", "Беспроводная зарядка"]
    },
    {
      id: "6",
      name: "Hyundai Tucson",
      image: "https://images.unsplash.com/photo-1633578347572-75aa2ca2fbf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 3900,
      category: "Внедорожник",
      seats: 5,
      transmission: "Автомат",
      description: "Современный кроссовер с просторным салоном и экономичным двигателем.",
      features: ["Панорамная крыша", "Подогрев руля", "Парктроники", "Apple CarPlay/Android Auto"]
    }
  ];

  // Состояния
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [1000, 10000],
    categories: [],
    seats: [],
    transmission: [],
    search: ""
  });

  // Эффект для имитации загрузки данных
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setFilteredCars(allCars);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Применение фильтров
  useEffect(() => {
    let result = allCars;

    // Фильтр по цене
    result = result.filter(car => 
      car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1]
    );

    // Фильтр по категории
    if (filters.categories.length > 0) {
      result = result.filter(car => 
        filters.categories.includes(car.category)
      );
    }

    // Фильтр по количеству мест
    if (filters.seats.length > 0) {
      result = result.filter(car => 
        filters.seats.includes(car.seats)
      );
    }

    // Фильтр по типу трансмиссии
    if (filters.transmission.length > 0) {
      result = result.filter(car => 
        filters.transmission.includes(car.transmission)
      );
    }

    // Поиск по названию
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(car => 
        car.name.toLowerCase().includes(searchTerm)
      );
    }

    // Сортировка
    result = sortCars(result, sortBy);

    setFilteredCars(result);
  }, [filters, sortBy]);

  // Функция сортировки
  const sortCars = (cars: Car[], sortOption: SortOption): Car[] => {
    return [...cars].sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  };

  // Обработчик изменения фильтров
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Обработчик сброса фильтров
  const handleFilterReset = () => {
    setFilters({
      priceRange: [1000, 10000],
      categories: [],
      seats: [],
      transmission: [],
      search: ""
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold">Каталог автомобилей</h1>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <span className="text-sm text-gray-500">Сортировать:</span>
              <Select 
                value={sortBy} 
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Сначала дешевле</SelectItem>
                  <SelectItem value="price-desc">Сначала дороже</SelectItem>
                  <SelectItem value="name-asc">По названию (А-Я)</SelectItem>
                  <SelectItem value="name-desc">По названию (Я-А)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Боковая панель с фильтрами */}
            <div className="md:w-1/4">
              <FilterPanel 
                onFilterChange={handleFilterChange} 
                onReset={handleFilterReset} 
              />
            </div>
            
            {/* Список автомобилей */}
            <div className="md:w-3/4">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              ) : filteredCars.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCars.map(car => (
                    <CarCard key={car.id} {...car} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Автомобили не найдены
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Попробуйте изменить параметры фильтрации или сбросить фильтры
                  </p>
                  <Button onClick={handleFilterReset}>Сбросить фильтры</Button>
                </div>
              )}
              
              {filteredCars.length > 0 && (
                <div className="mt-12 text-center">
                  <Button variant="outline">Показать еще</Button>
                </div>
              )}
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

export default Catalog;
