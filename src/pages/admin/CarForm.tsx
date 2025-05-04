
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card,
  CardContent,
  CardFooter 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  ChevronLeft, 
  Plus, 
  X, 
  ImagePlus, 
  Loader2 
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import api, { Car } from "@/lib/api";

interface CarFormData {
  name: string;
  price: number;
  category: string;
  seats: number;
  transmission: string;
  fuelType: string;
  year: number;
  description: string;
  features: string[];
  status: 'available' | 'reserved' | 'maintenance';
  images: string[];
}

const defaultFormData: CarFormData = {
  name: "",
  price: 0,
  category: "",
  seats: 5,
  transmission: "Автомат",
  fuelType: "Бензин",
  year: new Date().getFullYear(),
  description: "",
  features: [],
  status: "available",
  images: []
};

const CarForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CarFormData>(defaultFormData);
  const [feature, setFeature] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  useEffect(() => {
    if (isEditMode && id) {
      const fetchCar = async () => {
        setLoading(true);
        try {
          // В реальном приложении:
          // const car = await api.cars.getById(id);
          
          // Имитация для демонстрации
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (id === "1") {
            setFormData({
              name: "Toyota Camry",
              price: 3500,
              category: "Бизнес",
              seats: 5,
              transmission: "Автомат",
              fuelType: "Бензин",
              year: 2022,
              description: "Комфортный седан бизнес-класса с просторным салоном и богатой комплектацией.",
              features: ["Климат-контроль", "Кожаный салон", "Камера заднего вида", "Круиз-контроль"],
              status: "available",
              images: [
                "https://images.unsplash.com/photo-1621007806512-be7837a1e15c?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1550855450-5f2ce781f8ab?auto=format&fit=crop&w=800&q=80"
              ]
            });
          } else {
            toast({
              variant: "destructive",
              title: "Ошибка",
              description: "Автомобиль не найден",
            });
            navigate("/admin/cars");
          }
        } catch (error) {
          console.error("Error fetching car:", error);
          toast({
            variant: "destructive",
            title: "Ошибка",
            description: "Не удалось загрузить данные автомобиля",
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchCar();
    }
  }, [id, isEditMode, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "seats" || name === "year" 
        ? parseInt(value, 10) || 0 
        : value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddFeature = () => {
    if (feature.trim() && !formData.features.includes(feature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature.trim()]
      }));
      setFeature("");
    }
  };
  
  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };
  
  const handleAddImage = () => {
    if (imageUrl.trim() && !formData.images.includes(imageUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()]
      }));
      setImageUrl("");
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.name.trim() === "") {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите название автомобиля",
      });
      return;
    }
    
    if (formData.price <= 0) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите корректную цену",
      });
      return;
    }
    
    if (formData.images.length === 0) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Добавьте хотя бы одно изображение",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // В реальном приложении:
      // if (isEditMode) {
      //   await api.cars.update(id, formData);
      // } else {
      //   await api.cars.create(formData);
      // }
      
      // Имитация для демонстрации
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Успешно",
        description: isEditMode 
          ? "Автомобиль успешно обновлен" 
          : "Автомобиль успешно добавлен",
      });
      
      navigate("/admin/cars");
    } catch (error) {
      console.error("Error saving car:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось сохранить данные автомобиля",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <AdminLayout title={isEditMode ? "Редактирование автомобиля" : "Добавление автомобиля"}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title={isEditMode ? "Редактирование автомобиля" : "Добавление автомобиля"}>
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/admin/cars")}
          className="flex items-center"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Назад к списку
        </Button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">Основная информация</TabsTrigger>
            <TabsTrigger value="details">Характеристики</TabsTrigger>
            <TabsTrigger value="images">Изображения</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Название автомобиля</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Toyota Camry"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Цена в день (₽)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      min={0}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Категория</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Эконом">Эконом</SelectItem>
                        <SelectItem value="Бизнес">Бизнес</SelectItem>
                        <SelectItem value="Премиум">Премиум</SelectItem>
                        <SelectItem value="Внедорожник">Внедорожник</SelectItem>
                        <SelectItem value="Минивэн">Минивэн</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Статус</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange("status", value as CarFormData['status'])}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Выберите статус" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Доступен</SelectItem>
                        <SelectItem value="reserved">Забронирован</SelectItem>
                        <SelectItem value="maintenance">На обслуживании</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Подробное описание автомобиля"
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="year">Год выпуска</Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      value={formData.year}
                      onChange={handleInputChange}
                      min={1990}
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="seats">Количество мест</Label>
                    <Input
                      id="seats"
                      name="seats"
                      type="number"
                      value={formData.seats}
                      onChange={handleInputChange}
                      min={2}
                      max={12}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Трансмиссия</Label>
                    <Select
                      value={formData.transmission}
                      onValueChange={(value) => handleSelectChange("transmission", value)}
                    >
                      <SelectTrigger id="transmission">
                        <SelectValue placeholder="Выберите тип трансмиссии" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Автомат">Автомат</SelectItem>
                        <SelectItem value="Механика">Механика</SelectItem>
                        <SelectItem value="Робот">Робот</SelectItem>
                        <SelectItem value="Вариатор">Вариатор</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Тип топлива</Label>
                    <Select
                      value={formData.fuelType}
                      onValueChange={(value) => handleSelectChange("fuelType", value)}
                    >
                      <SelectTrigger id="fuelType">
                        <SelectValue placeholder="Выберите тип топлива" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Бензин">Бензин</SelectItem>
                        <SelectItem value="Дизель">Дизель</SelectItem>
                        <SelectItem value="Гибрид">Гибрид</SelectItem>
                        <SelectItem value="Электро">Электро</SelectItem>
                        <SelectItem value="Газ">Газ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Особенности и оснащение</Label>
                  
                  <div className="flex items-center gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => setFeature(e.target.value)}
                      placeholder="Введите особенность"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleAddFeature}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {formData.features.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {formData.features.map((feat, index) => (
                        <div 
                          key={index} 
                          className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1"
                        >
                          <span className="text-sm">{feat}</span>
                          <button 
                            type="button"
                            onClick={() => handleRemoveFeature(index)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">
                      Особенности пока не добавлены
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="images">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Изображения автомобиля</Label>
                  
                  <div className="flex items-center gap-2">
                    <Input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Введите URL изображения"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleAddImage}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-1">
                    Для демонстрации используйте ссылки с unsplash.com
                  </p>
                </div>
                
                {formData.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Изображение ${index + 1}`} 
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <button 
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                    <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Добавьте изображения автомобиля
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/cars")}
            disabled={submitting}
          >
            Отмена
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Обновить" : "Добавить"} автомобиль
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default CarForm;
