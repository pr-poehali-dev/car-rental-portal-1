
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
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { CalendarIcon, Check, AlertCircle, Loader2 } from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { ru } from "date-fns/locale";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface BookingFormProps {
  carId: string;
  carName: string;
  pricePerDay: number;
}

interface BookingFormState {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  pickupDate: Date;
  returnDate: Date;
  insurance: boolean;
  additionalDriver: boolean;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  dates?: string;
}

const BookingForm = ({ carId, carName, pricePerDay }: BookingFormProps) => {
  const navigate = useNavigate();
  const today = new Date();
  
  const [formState, setFormState] = useState<BookingFormState>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    pickupDate: today,
    returnDate: addDays(today, 3),
    insurance: true,
    additionalDriver: false
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [progressValue, setProgressValue] = useState(33);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  
  // Расчет количества дней аренды
  const rentalDays = differenceInDays(formState.returnDate, formState.pickupDate) + 1;
  
  // Расчет стоимости
  const rentalPrice = pricePerDay * rentalDays;
  const insurancePrice = formState.insurance ? 800 * rentalDays : 0;
  const additionalDriverPrice = formState.additionalDriver ? 500 : 0;
  const totalPrice = rentalPrice + insurancePrice + additionalDriverPrice;

  // Обработчик изменения полей формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Очистка ошибки при изменении поля
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!formState.firstName.trim()) {
      newErrors.firstName = "Введите имя";
    }
    
    if (!formState.lastName.trim()) {
      newErrors.lastName = "Введите фамилию";
    }
    
    if (!formState.phone.trim()) {
      newErrors.phone = "Введите номер телефона";
    } else if (!/^\+?[0-9]{10,15}$/.test(formState.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Некорректный формат телефона";
    }
    
    if (!formState.email.trim()) {
      newErrors.email = "Введите email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = "Некорректный формат email";
    }
    
    if (differenceInDays(formState.returnDate, formState.pickupDate) < 0) {
      newErrors.dates = "Дата возврата должна быть позже даты получения";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateForm()) {
      setBookingStep(2);
      setProgressValue(66);
    }
  };

  const handlePrevStep = () => {
    setBookingStep(1);
    setProgressValue(33);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // В реальном приложении используем API клиент
      // const response = await api.bookings.create({
      //   carId,
      //   startDate: formState.pickupDate,
      //   endDate: formState.returnDate,
      //   insurance: formState.insurance,
      //   additionalServices: formState.additionalDriver ? ["additional_driver"] : [],
      //   // Дополнительные данные пользователя, если они не сохранены в профиле
      //   userData: {
      //     firstName: formState.firstName,
      //     lastName: formState.lastName,
      //     phone: formState.phone,
      //     email: formState.email,
      //   }
      // });
      
      // Имитация успешного ответа
      const mockResponse = {
        id: `booking-${Date.now()}`,
        status: "pending"
      };
      
      setBookingId(mockResponse.id);
      setProgressValue(100);
      setBookingStep(3);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Ошибка при бронировании:", error);
      toast({
        variant: "destructive",
        title: "Ошибка бронирования",
        description: "Не удалось оформить бронирование. Пожалуйста, попробуйте еще раз.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewBookings = () => {
    setShowSuccessDialog(false);
    navigate("/profile/bookings");
  };

  const renderStepOne = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Имя</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formState.firstName}
            onChange={handleInputChange}
            placeholder="Иван"
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Фамилия</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formState.lastName}
            onChange={handleInputChange}
            placeholder="Иванов"
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Телефон</Label>
        <Input
          id="phone"
          name="phone"
          value={formState.phone}
          onChange={handleInputChange}
          placeholder="+7 (999) 123-45-67"
          className={errors.phone ? "border-red-500" : ""}
        />
        {errors.phone && (
          <p className="text-xs text-red-500">{errors.phone}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formState.email}
          onChange={handleInputChange}
          placeholder="example@mail.ru"
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email}</p>
        )}
      </div>
    </>
  );

  const renderStepTwo = () => (
    <>
      <div>
        <Label htmlFor="pickup">Дата получения</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal mt-1 ${errors.dates ? "border-red-500" : ""}`}
              id="pickup"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formState.pickupDate ? (
                format(formState.pickupDate, "PPP", { locale: ru })
              ) : (
                <span>Выберите дату</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formState.pickupDate}
              onSelect={(date) => date && setFormState(prev => ({ ...prev, pickupDate: date }))}
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
              className={`w-full justify-start text-left font-normal mt-1 ${errors.dates ? "border-red-500" : ""}`}
              id="return"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formState.returnDate ? (
                format(formState.returnDate, "PPP", { locale: ru })
              ) : (
                <span>Выберите дату</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formState.returnDate}
              onSelect={(date) => date && setFormState(prev => ({ ...prev, returnDate: date }))}
              fromDate={formState.pickupDate || today}
              toDate={addDays(today, 90)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.dates && (
          <p className="text-xs text-red-500 mt-1">{errors.dates}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox 
          id="insurance" 
          checked={formState.insurance} 
          onCheckedChange={(checked) => 
            setFormState(prev => ({ ...prev, insurance: checked as boolean }))
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
          checked={formState.additionalDriver} 
          onCheckedChange={(checked) => 
            setFormState(prev => ({ ...prev, additionalDriver: checked as boolean }))
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
      
      <Separator className="my-4" />
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Аренда ({rentalDays} {rentalDays === 1 ? 'день' : rentalDays < 5 ? 'дня' : 'дней'})</span>
          <span>{rentalPrice} ₽</span>
        </div>
        {formState.insurance && (
          <div className="flex justify-between text-sm">
            <span>Страховка</span>
            <span>{insurancePrice} ₽</span>
          </div>
        )}
        {formState.additionalDriver && (
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
    </>
  );

  const renderConfirmation = () => (
    <div className="text-center py-4">
      <div className="mx-auto rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">Бронирование оформлено!</h3>
      <p className="mt-2 text-gray-600">
        Ваше бронирование №{bookingId} успешно создано и ожидает подтверждения.
        Мы отправили детали на ваш email.
      </p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Забронировать {carName}</CardTitle>
        <Progress value={progressValue} className="h-2 mt-2" />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {bookingStep === 1 && renderStepOne()}
          {bookingStep === 2 && renderStepTwo()}
          {bookingStep === 3 && renderConfirmation()}
        </form>
      </CardContent>
      <CardFooter className={bookingStep === 2 ? "flex justify-between" : ""}>
        {bookingStep === 1 && (
          <Button 
            className="w-full" 
            type="button" 
            onClick={handleNextStep}
          >
            Продолжить
          </Button>
        )}
        
        {bookingStep === 2 && (
          <>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePrevStep}
            >
              Назад
            </Button>
            <Button 
              type="submit" 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="min-w-[150px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Оформление...
                </>
              ) : (
                "Забронировать"
              )}
            </Button>
          </>
        )}
        
        {bookingStep === 3 && (
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => navigate("/")}
          >
            Вернуться на главную
          </Button>
        )}
      </CardFooter>
      
      {/* Диалог успешного бронирования */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Бронирование успешно оформлено</AlertDialogTitle>
            <AlertDialogDescription>
              Ваше бронирование на автомобиль {carName} успешно создано и ожидает подтверждения.
              Вы можете отслеживать статус в личном кабинете.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col md:flex-row gap-3 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setShowSuccessDialog(false)}
            >
              Закрыть
            </Button>
            <Button onClick={handleViewBookings}>
              Перейти к моим бронированиям
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default BookingForm;
