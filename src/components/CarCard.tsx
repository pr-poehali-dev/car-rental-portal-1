
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface CarCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  seats: number;
  transmission: string;
}

const CarCard = ({ id, name, image, price, category, seats, transmission }: CarCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="aspect-[16/9] overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-xl">{name}</CardTitle>
        <div className="text-sm text-gray-500">{category}</div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-sm">
            <span className="mr-4">{seats} мест</span>
            <span>{transmission}</span>
          </div>
        </div>
        <div className="mt-2 text-xl font-bold">
          {price} ₽<span className="text-sm font-normal text-gray-500">/день</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link to={`/cars/${id}`} className="flex-1 mr-2">
          <Button variant="outline" className="w-full">Подробнее</Button>
        </Link>
        <Button className="flex-1">Забронировать</Button>
      </CardFooter>
    </Card>
  );
};

export default CarCard;
