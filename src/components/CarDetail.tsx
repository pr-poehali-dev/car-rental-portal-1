
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Calendar, 
  Car, 
  Check, 
  Users, 
  Fuel, 
  ShieldCheck,
  Info,
  Star
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export interface CarDetailProps {
  id: string;
  name: string;
  images: string[];
  price: number;
  category: string;
  seats: number;
  transmission: string;
  fuelType: string;
  year: number;
  description: string;
  features: string[];
  additionalServices?: {
    id: string;
    name: string;
    price: number;
    description: string;
  }[];
  rating?: number;
  reviews?: number;
}

const CarDetail = ({ 
  name, 
  images, 
  price, 
  category, 
  seats, 
  transmission, 
  fuelType,
  year,
  description, 
  features,
  additionalServices = [],
  rating = 4.8,
  reviews = 24
}: CarDetailProps) => {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Галерея изображений */}
      <div className="relative">
        <div className="aspect-[16/9] overflow-hidden">
          <img 
            src={images[currentImage]} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Миниатюры изображений */}
        <div className="grid grid-cols-4 gap-2 p-2 bg-white">
          {images.map((image, index) => (
            <div 
              key={index}
              className={`aspect-[16/9] cursor-pointer overflow-hidden border-2 rounded ${
                index === currentImage ? 'border-primary' : 'border-transparent'
              }`}
              onClick={() => setCurrentImage(index)}
            >
              <img 
                src={image} 
                alt={`${name} - изображение ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Информация о машине */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <div className="flex items-center mt-1">
              <Badge variant="secondary">{category}</Badge>
              <div className="ml-4 flex items-center text-amber-500">
                <Star className="h-4 w-4 fill-amber-500 mr-1" />
                <span>{rating}</span>
                <span className="text-gray-500 text-sm ml-1">({reviews} отзывов)</span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-3xl font-bold text-right">
              {price} ₽<span className="text-sm font-normal text-gray-500">/день</span>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        {/* Характеристики */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center">
            <Car className="h-5 w-5 text-primary mr-2" />
            <div>
              <div className="text-sm text-gray-500">Год выпуска</div>
              <div className="font-medium">{year}</div>
            </div>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-primary mr-2" />
            <div>
              <div className="text-sm text-gray-500">Мест</div>
              <div className="font-medium">{seats}</div>
            </div>
          </div>
          <div className="flex items-center">
            <Info className="h-5 w-5 text-primary mr-2" />
            <div>
              <div className="text-sm text-gray-500">Трансмиссия</div>
              <div className="font-medium">{transmission}</div>
            </div>
          </div>
          <div className="flex items-center">
            <Fuel className="h-5 w-5 text-primary mr-2" />
            <div>
              <div className="text-sm text-gray-500">Тип топлива</div>
              <div className="font-medium">{fuelType}</div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="description" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Описание</TabsTrigger>
            <TabsTrigger value="features">Характеристики</TabsTrigger>
            <TabsTrigger value="services">Доп. услуги</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="p-4">
            <p className="text-gray-700">{description}</p>
          </TabsContent>
          
          <TabsContent value="features" className="p-4">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="services" className="p-4">
            {additionalServices.length > 0 ? (
              <ul className="space-y-3">
                {additionalServices.map((service) => (
                  <li key={service.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-gray-500">{service.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{service.price} ₽</div>
                      <Button size="sm">Добавить</Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">Дополнительные услуги недоступны</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CarDetail;
