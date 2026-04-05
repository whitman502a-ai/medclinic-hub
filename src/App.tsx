import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDataLoader } from "@/hooks/useDataLoader";
import Landing from "./pages/Landing";
import Booking from "./pages/Booking";
import Auth from "./pages/Auth";
import Hub from "./pages/Hub";
import DoctorPage from "./pages/Doctor";
import PatientPage from "./pages/Patient";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const loaded = useDataLoader();

  if (!loaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground">Cargando MediOS...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/hub" element={<Hub />} />
      <Route path="/doctor" element={<DoctorPage />} />
      <Route path="/patient" element={<PatientPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
