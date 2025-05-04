
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary">АвтоПрокат</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium">
              Главная
            </Link>
            <Link to="/catalog" className="text-gray-700 hover:text-primary font-medium">
              Каталог
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary font-medium">
              О нас
            </Link>
            <Link to="/contacts" className="text-gray-700 hover:text-primary font-medium">
              Контакты
            </Link>
            <div className="flex items-center space-x-2">
              <Link to="/cart">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link 
              to="/" 
              className="block py-2 text-base font-medium text-gray-700 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Главная
            </Link>
            <Link 
              to="/catalog" 
              className="block py-2 text-base font-medium text-gray-700 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Каталог
            </Link>
            <Link 
              to="/about" 
              className="block py-2 text-base font-medium text-gray-700 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              О нас
            </Link>
            <Link 
              to="/contacts" 
              className="block py-2 text-base font-medium text-gray-700 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Контакты
            </Link>
            <div className="flex space-x-4 py-2">
              <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Корзина</span>
                </Button>
              </Link>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Войти</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
