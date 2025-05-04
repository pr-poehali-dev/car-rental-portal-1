
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { FilterX } from "lucide-react";

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

export interface FilterState {
  priceRange: [number, number];
  categories: string[];
  seats: number[];
  transmission: string[];
  search: string;
}

const defaultFilters: FilterState = {
  priceRange: [1000, 10000],
  categories: [],
  seats: [],
  transmission: [],
  search: ""
};

const FilterPanel = ({ onFilterChange, onReset }: FilterPanelProps) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const handlePriceChange = (value: number[]) => {
    const newFilters = { 
      ...filters, 
      priceRange: [value[0], value[1]] as [number, number] 
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked 
      ? [...filters.categories, category] 
      : filters.categories.filter(c => c !== category);
    
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSeatsChange = (seats: number, checked: boolean) => {
    const newSeats = checked 
      ? [...filters.seats, seats] 
      : filters.seats.filter(s => s !== seats);
    
    const newFilters = { ...filters, seats: newSeats };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTransmissionChange = (type: string, checked: boolean) => {
    const newTransmission = checked 
      ? [...filters.transmission, type] 
      : filters.transmission.filter(t => t !== type);
    
    const newFilters = { ...filters, transmission: newTransmission };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (search: string) => {
    const newFilters = { ...filters, search };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    onReset();
  };

  return (
    <Card className="sticky top-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Фильтры</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset}
            className="text-gray-500 text-sm flex items-center gap-1"
          >
            <FilterX className="h-4 w-4" />
            Сбросить
          </Button>
        </div>

        <div className="mb-6">
          <Label htmlFor="search" className="mb-2 block">Поиск</Label>
          <Input
            id="search"
            placeholder="Название модели..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full"
          />
        </div>

        <Accordion type="multiple" defaultValue={["price", "category", "seats", "transmission"]} className="space-y-4">
          <AccordionItem value="price" className="border-b">
            <AccordionTrigger className="py-2 hover:no-underline">
              <span className="text-sm font-medium">Цена в день</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 pb-2">
                <Slider 
                  defaultValue={[1000, 10000]} 
                  min={1000} 
                  max={10000} 
                  step={500}
                  value={[filters.priceRange[0], filters.priceRange[1]]}
                  onValueChange={handlePriceChange}
                />
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>{filters.priceRange[0]} ₽</span>
                  <span>{filters.priceRange[1]} ₽</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="category" className="border-b">
            <AccordionTrigger className="py-2 hover:no-underline">
              <span className="text-sm font-medium">Класс автомобиля</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 space-y-2">
                {["Эконом", "Комфорт", "Бизнес", "Премиум", "Внедорожник"].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category}`} 
                      checked={filters.categories.includes(category)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`category-${category}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="seats" className="border-b">
            <AccordionTrigger className="py-2 hover:no-underline">
              <span className="text-sm font-medium">Количество мест</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 space-y-2">
                {[2, 4, 5, 7].map((seat) => (
                  <div key={seat} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`seats-${seat}`} 
                      checked={filters.seats.includes(seat)}
                      onCheckedChange={(checked) => 
                        handleSeatsChange(seat, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`seats-${seat}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {seat}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="transmission" className="border-b">
            <AccordionTrigger className="py-2 hover:no-underline">
              <span className="text-sm font-medium">Коробка передач</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 space-y-2">
                {["Автомат", "Механика"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`transmission-${type}`} 
                      checked={filters.transmission.includes(type)}
                      onCheckedChange={(checked) => 
                        handleTransmissionChange(type, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`transmission-${type}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
