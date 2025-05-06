import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Car,
  Loader2
} from "lucide-react";
import api, { Car } from "@/lib/api";

const AdminCars = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<Car[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // Имитация загрузки данных с API
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        // В реальном приложении:
        // const response = await api.cars.getAll();
        // setCars(response.data);
        
        // Имитация для демонстрации
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCars([
          {
            id: "1",
            name: "Toyota Camry",
            image: "https://images.unsplash.com/photo-1621007806512-be7837a1e15c?auto=format&fit=crop&w=800&q=80",
            images: ["https://images.unsplash.com/photo-1621007806512-be7837a1e15c?auto=format&fit=crop&w=800&q=80"],
            price: 3500,
            category: "Бизнес",
            seats: 5,
            transmission: "Автомат",
            fuelType: "Бензин",
            year: 2022,
            description: "Комфортный седан бизнес-класса",
            features: ["Климат-контроль", "Кожаный салон"],
            status: "available",
            createdAt: "2023-04-15T10:30:00Z",
            updatedAt: "2023-04-15T10:30:00Z"
          },
          {
            id: "2",
            name: "Volkswagen Polo",
            image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
            images: ["https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80"],
            price: 2100,
            category: "Эконом",
            seats: 5,
            transmission: "Механика",
            fuelType: "Бензин",
            year: 2021,
            description: "Экономичный городской автомобиль",
            features: ["Кондиционер", "ABS"],
            status: "available",
            createdAt: "2023-05-20T14:45:00Z",
            updatedAt: "2023-05-20T14:45:00Z"
          },
          {
            id: "3",
            name: "BMW X5",
            image: "https://images.unsplash.com/photo-1518987048-93e29699e79a?auto=format&fit=crop&w=800&q=80",
            images: ["https://images.unsplash.com/photo-1518987048-93e29699e79a?auto=format&fit=crop&w=800&q=80"],
            price: 6800,
            category: "Премиум",
            seats: 7,
            transmission: "Автомат",
            fuelType: "Дизель",
            year: 2023,
            description: "Роскошный внедорожник",
            features: ["Панорамная крыша", "Премиум аудиосистема"],
            status: "maintenance",
            createdAt: "2023-03-10T09:15:00Z",
            updatedAt: "2023-06-05T16:20:00Z"
          }
        ]);
      } catch (error) {
        console.error("Ошибка при загрузке автомобилей:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleEdit = (car: Car) => {
    navigate(`/admin/cars/edit/${car.id}`);
  };

  const handleDelete = (car: Car) => {
    setSelectedCar(car);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCar) return;
    
    try {
      // В реальном приложении:
      // await api.cars.delete(selectedCar.id);
      
      // Имитация для демонстрации
      setCars(cars.filter(car => car.id !== selectedCar.id));
      setDeleteDialogOpen(false);
      setSelectedCar(null);
    } catch (error) {
      console.error("Ошибка при удалении автомобиля:", error);
    }
  };

  const filteredCars = cars.filter(car => 
    car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Доступен</Badge>;
      case 'reserved':
        return <Badge className="bg-amber-500">Забронирован</Badge>;
      case 'maintenance':
        return <Badge className="bg-red-500">На обслуживании</Badge>;
      default:
        return <Badge>Неизвестно</Badge>;
    }
  };

  return (
    <AdminLayout title="Управление автомобилями">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Поиск автомобилей..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button onClick={() => navigate("/admin/cars/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить автомобиль
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="text-center py-12">
          <Car className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">Автомобили не найдены</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm ? "Попробуйте изменить параметры поиска" : "Начните с добавления нового автомобиля"}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead className="w-[80px]">Фото</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Цена/день</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell className="font-medium">{car.id}</TableCell>
                  <TableCell>
                    <div className="h-10 w-10 rounded-md overflow-hidden">
                      <img 
                        src={car.image} 
                        alt={car.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{car.name}</div>
                    <div className="text-xs text-gray-500">{car.year} год</div>
                  </TableCell>
                  <TableCell>{car.category}</TableCell>
                  <TableCell>{car.price} ₽</TableCell>
                  <TableCell>{getStatusBadge(car.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Действия</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit(car)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(car)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Диалог подтверждения удаления */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Вы действительно хотите удалить автомобиль "{selectedCar?.name}"?</p>
            <p className="text-sm text-gray-500 mt-2">Это действие нельзя будет отменить.</p>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCars;