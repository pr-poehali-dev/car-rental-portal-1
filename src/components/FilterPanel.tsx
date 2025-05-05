
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, X, Filter } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFilterStorage } from "@/hooks/useFilterStorage";
import { Badge } from "@/components/ui/badge";

// Интерфейс состояния фильтра
export interface FilterState {
  priceRange: [number, number];
  categories: string[];
  seats: number[];
  transmission: string[];
  search: string;
  features?: string[];
}

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  availableFilters?: {
    minPrice?: number;
    maxPrice?: number;
    categories?: string[];
    seats?: number[];
    transmission?: string[];
    features?: string[];
  };
}

const STORAGE_KEY = 'car-catalog-filters';

const FilterPanel = ({ 
  onFilterChange, 
  onReset,
  availableFilters = {
    minPrice: 1000,
    maxPrice: 10000,
    categories: ["Эконом", "Комфорт", "Бизнес", "Премиум", "Внедорожник"],
    seats: [2, 4, 5, 7],
    transmission: ["Автомат", "Механика"],
    features: ["Климат-контроль", "Кожаный салон", "Панорамная крыша", "Камера заднего вида", 
               "GPS-навигация", "Bluetooth", "ABS", "Круиз-контроль", "Подогрев сидений"]
  }
}: FilterPanelProps) => {
  // Значения по умолчанию
  const defaultFilters: FilterState = {
    priceRange: [availableFilters.minPrice || 1000, availableFilters.maxPrice || 10000],
    categories: [],
    seats: [],
    transmission: [],
    search: "",
    features: []
  };

  // Используем хук для сохранения фильтров в localStorage
  const [filters, setFilters, resetFilters] = useFilterStorage<FilterState>(
    STORAGE_KEY,
    defaultFilters
  );

  // Мобильное состояние
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);
  const [activeAccordions, setActiveAccordions] = useState<string[]>(['price', 'categories']);

  // Эффект для отправки фильтров родительскому компоненту
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Подсчет активных фильтров для отображения бейджа
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.seats.length > 0) count++;
    if (filters.transmission.length > 0) count++;
    if (filters.features && filters.features.length > 0) count++;
    if (filters.priceRange[0] !== defaultFilters.priceRange[0] || 
        filters.priceRange[1] !== defaultFilters.priceRange[1]) count++;
    return count;
  }, [filters, defaultFilters.priceRange]);

  // Обработчики изменения фильтров
  const handlePriceChange = (value: number[]) => {
    setFilters({ priceRange: [value[0], value[1]] });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    setFilters({ categories: updatedCategories });
  };

  const handleSeatsChange = (seats: number, checked: boolean) => {
    const updatedSeats = checked
      ? [...filters.seats, seats]
      : filters.seats.filter(s => s !== seats);
    
    setFilters({ seats: updatedSeats });
  };

  const handleTransmissionChange = (transmission: string, checked: boolean) => {
    const updatedTransmission = checked
      ? [...filters.transmission, transmission]
      : filters.transmission.filter(t => t !== transmission);
    
    setFilters({ transmission: updatedTransmission });
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    const updatedFeatures = checked
      ? [...(filters.features || []), feature]
      : (filters.features || []).filter(f => f !== feature);
    
    setFilters({ features: updatedFeatures });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: event.target.value });
  };

  const handleReset = () => {
    resetFilters();
    onReset();
    setIsMobileFilterOpen(false);
  };

  // Обработчики для мобильной версии
  const handleMobileOpen = () => {
    setTempFilters(filters);
    setIsMobileFilterOpen(true);
  };

  const handleMobileApply = () => {
    setFilters(tempFilters);
    setIsMobileFilterOpen(false);
  };

  const updateTempFilter = (partialFilter: Partial<FilterState>) => {
    setTempFilters(prev => ({ ...prev, ...partialFilter }));
  };

  // Форматирование цены для отображения
  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} ₽`;
  };

  // Десктопная версия фильтров
  const DesktopFilters = () => (
    <div className="bg-white rounded-lg border p-4 sticky top-4">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-9"
            placeholder="Поиск по названию"
            value={filters.search}
            onChange={handleSearchChange}
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={() => setFilters({ search: "" })}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Accordion type="multiple" defaultValue={activeAccordions} value={activeAccordions} onValueChange={setActiveAccordions}>
        <AccordionItem value="price">
          <AccordionTrigger>Цена</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="pt-4">
                <Slider
                  value={filters.priceRange}
                  min={availableFilters.minPrice || 1000}
                  max={availableFilters.maxPrice || 10000}
                  step={100}
                  onValueChange={handlePriceChange}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>{formatPrice(filters.priceRange[0])}</span>
                <span>{formatPrice(filters.priceRange[1])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="categories">
          <AccordionTrigger>Категория</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {availableFilters.categories?.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => handleCategoryChange(category, checked === true)}
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="seats">
          <AccordionTrigger>Количество мест</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {availableFilters.seats?.map(seats => (
                <div key={seats} className="flex items-center space-x-2">
                  <Checkbox
                    id={`seats-${seats}`}
                    checked={filters.seats.includes(seats)}
                    onCheckedChange={(checked) => handleSeatsChange(seats, checked === true)}
                  />
                  <Label htmlFor={`seats-${seats}`} className="text-sm cursor-pointer">
                    {seats} {seats === 1 ? 'место' : seats < 5 ? 'места' : 'мест'}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="transmission">
          <AccordionTrigger>Трансмиссия</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {availableFilters.transmission?.map(transmission => (
                <div key={transmission} className="flex items-center space-x-2">
                  <Checkbox
                    id={`transmission-${transmission}`}
                    checked={filters.transmission.includes(transmission)}
                    onCheckedChange={(checked) => handleTransmissionChange(transmission, checked === true)}
                  />
                  <Label htmlFor={`transmission-${transmission}`} className="text-sm cursor-pointer">
                    {transmission}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="features">
          <AccordionTrigger>Дополнительно</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {availableFilters.features?.map(feature => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={`feature-${feature}`}
                    checked={filters.features?.includes(feature) || false}
                    onCheckedChange={(checked) => handleFeatureChange(feature, checked === true)}
                  />
                  <Label htmlFor={`feature-${feature}`} className="text-sm cursor-pointer">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        variant="outline"
        className="w-full mt-6"
        onClick={handleReset}
      >
        Сбросить фильтры
      </Button>
    </div>
  );

  // Мобильная версия фильтров через Sheet (выдвижная панель)
  const MobileFilterTrigger = () => (
    <div className="md:hidden w-full">
      <Button
        variant="outline"
        className="w-full flex items-center justify-between"
        onClick={handleMobileOpen}
      >
        <div className="flex items-center">
          <Filter className="mr-2 h-4 w-4" />
          <span>Фильтры</span>
        </div>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="ml-2">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>
    </div>
  );

  const MobileFilterPanel = () => (
    <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
      <SheetContent side="bottom" className="h-[85vh] p-0">
        <SheetHeader className="px-4 py-3 border-b">
          <SheetTitle>Фильтры</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(85vh-10rem)]">
          <div className="px-4 py-4 space-y-6">
            <div>
              <Label htmlFor="mobile-search" className="text-sm font-medium mb-2 block">
                Поиск по названию
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="mobile-search"
                  className="pl-9"
                  placeholder="Введите название автомобиля"
                  value={tempFilters.search}
                  onChange={(e) => updateTempFilter({ search: e.target.value })}
                />
                {tempFilters.search && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                    onClick={() => updateTempFilter({ search: "" })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Цена за сутки</Label>
              <div className="pt-4">
                <Slider
                  value={tempFilters.priceRange}
                  min={availableFilters.minPrice || 1000}
                  max={availableFilters.maxPrice || 10000}
                  step={100}
                  onValueChange={(value) => updateTempFilter({ priceRange: [value[0], value[1]] })}
                />
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>{formatPrice(tempFilters.priceRange[0])}</span>
                <span>{formatPrice(tempFilters.priceRange[1])}</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Категория</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableFilters.categories?.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`mobile-category-${category}`}
                      checked={tempFilters.categories.includes(category)}
                      onCheckedChange={(checked) => {
                        const updatedCategories = checked 
                          ? [...tempFilters.categories, category]
                          : tempFilters.categories.filter(c => c !== category);
                        updateTempFilter({ categories: updatedCategories });
                      }}
                    />
                    <Label htmlFor={`mobile-category-${category}`} className="text-sm cursor-pointer">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Количество мест</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableFilters.seats?.map(seats => (
                  <div key={seats} className="flex items-center space-x-2">
                    <Checkbox
                      id={`mobile-seats-${seats}`}
                      checked={tempFilters.seats.includes(seats)}
                      onCheckedChange={(checked) => {
                        const updatedSeats = checked 
                          ? [...tempFilters.seats, seats]
                          : tempFilters.seats.filter(s => s !== seats);
                        updateTempFilter({ seats: updatedSeats });
                      }}
                    />
                    <Label htmlFor={`mobile-seats-${seats}`} className="text-sm cursor-pointer">
                      {seats} {seats === 1 ? 'место' : seats < 5 ? 'места' : 'мест'}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Трансмиссия</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableFilters.transmission?.map(transmission => (
                  <div key={transmission} className="flex items-center space-x-2">
                    <Checkbox
                      id={`mobile-transmission-${transmission}`}
                      checked={tempFilters.transmission.includes(transmission)}
                      onCheckedChange={(checked) => {
                        const updatedTransmission = checked 
                          ? [...tempFilters.transmission, transmission]
                          : tempFilters.transmission.filter(t => t !== transmission);
                        updateTempFilter({ transmission: updatedTransmission });
                      }}
                    />
                    <Label htmlFor={`mobile-transmission-${transmission}`} className="text-sm cursor-pointer">
                      {transmission}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Дополнительные опции</Label>
              <div className="grid grid-cols-1 gap-2">
                {availableFilters.features?.map(feature => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={`mobile-feature-${feature}`}
                      checked={tempFilters.features?.includes(feature) || false}
                      onCheckedChange={(checked) => {
                        const updatedFeatures = checked 
                          ? [...(tempFilters.features || []), feature]
                          : (tempFilters.features || []).filter(f => f !== feature);
                        updateTempFilter({ features: updatedFeatures });
                      }}
                    />
                    <Label htmlFor={`mobile-feature-${feature}`} className="text-sm cursor-pointer">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <div className="border-t p-4 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            Сбросить
          </Button>
          <Button className="flex-1" onClick={handleMobileApply}>
            Применить
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      {/* Десктопная версия */}
      <div className="hidden md:block">
        <DesktopFilters />
      </div>
      
      {/* Мобильная версия */}
      <MobileFilterTrigger />
      <MobileFilterPanel />
    </>
  );
};

export default FilterPanel;
