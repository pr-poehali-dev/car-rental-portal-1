import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Catalog from "./pages/Catalog";
import CarPage from "./pages/CarPage";
import ProfileBookings from "./pages/ProfileBookings";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCars from "./pages/admin/AdminCars";
import CarForm from "./pages/admin/CarForm";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminUsers from "./pages/admin/AdminUsers";
import AuthGuard from "./components/admin/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/cars/:id" element={<CarPage />} />
            <Route path="/profile/bookings" element={<ProfileBookings />} />
            
            {/* Открытая страница входа */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Защищенные административные маршруты */}
            <Route path="/admin" element={
              <AuthGuard>
                <AdminDashboard />
              </AuthGuard>
            } />
            <Route path="/admin/cars" element={
              <AuthGuard>
                <AdminCars />
              </AuthGuard>
            } />
            <Route path="/admin/cars/add" element={
              <AuthGuard>
                <CarForm />
              </AuthGuard>
            } />
            <Route path="/admin/cars/edit/:id" element={
              <AuthGuard>
                <CarForm />
              </AuthGuard>
            } />
            <Route path="/admin/bookings" element={
              <AuthGuard>
                <AdminBookings />
              </AuthGuard>
            } />
            <Route path="/admin/users" element={
              <AuthGuard>
                <AdminUsers />
              </AuthGuard>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </NotificationProvider>
  </QueryClientProvider>
);

export default App;