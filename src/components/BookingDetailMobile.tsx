
import { Booking } from "@/lib/api";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarDays, 
  MapPin, 
  CreditCard, 
  Clock, 
  Shield, 
  CheckCircle2, 
  XCircle 
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

interface BookingDetailMobileProps {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
  onCancel?: () => void;
}

const BookingDetailMobile = ({ booking, open, onClose, onCancel }: BookingDetailMobileProps) => {
  if (!booking) return null;

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "d MMMM yyyy, HH:mm", { locale: ru });
    } catch (e) {
      return "Некорректная дата";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-500">Ожидает подтверждения</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-500">Подтверждено</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Отменено</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Завершено</Badge>;
      default:
        return <Badge>Неизвестно</Badge>;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Детали бронирования</SheetTitle>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 rounded-md overflow-hidden">
              <img 
                src={booking.car?.image} 
                alt={booking.car?.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="text-xl font-bold">{booking.car?.name}</div>
              <div className="text-sm text-gray-500">
                {booking.car?.category} • {booking.car?.year} • {booking.car?.transmission}
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="text-sm font-medium text-gray-500">Статус</div>
              {getStatusBadge(booking.status)}
            </div>
            <div className="text-sm text-gray-500">
              Номер бронирования: {booking.id}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <CalendarDays className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <div className="font-medium">Период аренды</div>
                <div className="text-sm text-gray-600">
                  {formatDate(booking.startDate)}
                </div>
                <div className="text-sm text-gray-600">
                  — {formatDate(booking.endDate)}
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <div className="font-medium">Стоимость</div>
                <div className="text-sm text-gray-600">
                  <span className="text-xl font-bold">{booking.totalPrice} ₽</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <div className="font-medium mb-2">Дополнительные услуги</div>
            <div className="space-y-2">
              {booking.insurance && (
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Страховка</span>
                </div>
              )}
              
              {booking.additionalServices && booking.additionalServices.length > 0 ? (
                booking.additionalServices.map((service, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{service}</span>
                  </div>
                ))
              ) : (
                !booking.insurance && (
                  <div className="text-sm text-gray-500">
                    Дополнительные услуги не выбраны
                  </div>
                )
              )}
            </div>
          </div>
          
          <Separator />
          
          <div className="text-sm text-gray-500">
            <div>Создано: {formatDate(booking.createdAt)}</div>
            <div>Обновлено: {formatDate(booking.updatedAt)}</div>
          </div>
          
          {onCancel && (
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={onCancel}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Отменить бронирование
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookingDetailMobile;
