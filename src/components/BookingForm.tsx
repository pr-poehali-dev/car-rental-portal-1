
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { CalendarIcon, Check } from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { ru } from "date-fns/locale";

interface BookingFormProps {
  carId: string;
  carName: string;
  pricePerDay: number;
}

const BookingForm = ({ carId, carName, pricePerDay }: BookingFormProps) => {
  const today = new Date();
  const [pickupDate, setPickupDate] = useState<Date>(today);
  const [returnDate, setReturnDate] = useState<Date>(addDays(today, 3));
  const [insurance, setInsurance] = useState(true);
  const [additionalDriver, setAdditionalDriver] = useState(false);
  
  // Расчет количества дней аренды
  const rentalDays = differenceInDays(returnDate, pickupDate) + 1;
  
  // Расчет стоимости
  const rentalPrice = pricePerDay * rentalDays;
  const insurancePrice = insurance ? 800 * rentalDays : 0;
  const additionalDriverPrice = additionalDriver ? 500 : 0;
  const totalPrice = rentalPrice + insurancePrice + additionalDriverPrice;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Здесь будет логика добавления в корзину
    console.log("Booking submitted", {
      carId,
      carName,
      pickupDate,
      returnDate,
      insurance,
      additionalDriver,
      totalPrice
    });
    // В реальном приложении здесь будет добавление в корзину и редирект
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Забронировать</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="pickup">Дата получения</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal mt-1"
                    id="pickup"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {pickupDate ? (
                      format(pickupDate, "PPP", { locale: ru })
                    ) : (
                      <span>Выберите дату</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={pickupDate}
                    onSelect={(date) => date && setPickupDate(date)}
                    fromDate={today}
                    toDate={addDays(today, 90)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="return">Дата возврата</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal mt-1"
                    id="return"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {returnDate ? (
                      format(returnDate, "PPP", { locale: ru })
                    ) : (
                      <span>Выберите дату</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={(date) => date && setReturnDate(date)}
                    fromDate={pickupDate || today}
                    toDate={addDays(today, 90)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="insurance" 
                checked={insurance} 
                onCheckedChange={(checked) => 
                  setInsurance(checked as boolean)
                }
              />
              <div className="grid gap-1.5 leading-none">
                <Label 
                  htmlFor="insurance" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Страховка
                </Label>
                <p className="text-sm text-muted-foreground">
                  800 ₽ в день
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="additional-driver" 
                checked={additionalDriver} 
                onCheckedChange={(checked) => 
                  setAdditionalDriver(checked as boolean)
                }
              />
              <div className="grid gap-1.5 leading-none">
                <Label 
                  htmlFor="additional-driver" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Дополнительный водитель
                </Label>
                <p className="text-sm text-muted-foreground">
                  500 ₽ единоразово
                </p>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Аренда ({rentalDays} {rentalDays === 1 ? 'день' : rentalDays < 5 ? 'дня' : 'дней'})</span>
              <span>{rentalPrice} ₽</span>
            </div>
            {insurance && (
              <div className="flex justify-between text-sm">
                <span>Страховка</span>
                <span>{insurancePrice} ₽</span>
              </div>
            )}
            {additionalDriver && (
              <div className="flex justify-between text-sm">
                <span>Дополнительный водитель</span>
                <span>{additionalDriverPrice} ₽</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Итого</span>
              <span>{totalPrice} ₽</span>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="w-full" type="submit">
          Добавить в корзину
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingForm;
