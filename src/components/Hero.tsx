
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative bg-gray-900 text-white">
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1485291571150-772bcfc10da5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          opacity: 0.6
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Арендуйте автомобиль вашей мечты уже сегодня
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Широкий выбор автомобилей для любых целей. Низкие цены, быстрое оформление, доставка по городу.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/catalog">
              <Button size="lg" className="w-full sm:w-auto">
                Смотреть каталог
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white">
                Узнать больше
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
