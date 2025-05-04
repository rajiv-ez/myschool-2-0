
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Inscriptions from "./pages/dashboard/Inscriptions";
import Personnes from "./pages/dashboard/Personnes";
import Sessions from "./pages/dashboard/Sessions";
import Paiements from "./pages/dashboard/Paiements";
import MesPaiements from "./pages/dashboard/MesPaiements";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Routes principales */}
          <Route path="/" element={<Index />} />
          
          {/* Routes du Dashboard */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Inscriptions />} />
            <Route path="inscriptions" element={<Inscriptions />} />
            <Route path="personnes" element={<Personnes />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="paiements" element={<Paiements />} />
            <Route path="mes-paiements" element={<MesPaiements />} />
          </Route>
          
          {/* Routes à implémenter */}
          <Route path="/inscription" element={<NotFound />} />
          <Route path="/connexion" element={<NotFound />} />
          <Route path="/contact" element={<NotFound />} />
          <Route path="/offres/:type" element={<NotFound />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
