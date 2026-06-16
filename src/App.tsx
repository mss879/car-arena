import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { lazy, Suspense } from "react";
const AnalyticsTracker = lazy(() => import("@/components/AnalyticsTracker"));
import Preloader from "@/components/Preloader";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import CarsForSale from "./pages/CarsForSale";
import UsedCars from "./pages/UsedCars";
import JapaneseCarImport from "./pages/JapaneseCarImport";
import BrandNewCars from "./pages/BrandNewCars";
import VehicleListings from "./pages/VehicleListings";
import NotFound from "./pages/NotFound";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminAnalytics from "@/pages/AdminAnalytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
  <ScrollToTop />
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <Preloader />
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/cars-for-sale" element={<CarsForSale />} />
          <Route path="/used-cars" element={<UsedCars />} />
          <Route path="/japanese-car-import" element={<JapaneseCarImport />} />
          <Route path="/brand-new-cars" element={<BrandNewCars />} />
          <Route path="/vehicle-listings" element={<VehicleListings />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/contact" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
