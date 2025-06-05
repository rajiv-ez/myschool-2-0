
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/dashboard/DashboardLayout";

// Temporarily import only essential pages to debug build issues
import Inscriptions from "./pages/dashboard/Inscriptions";

console.log("App.tsx: Starting to load...");

const queryClient = new QueryClient();

const App = () => {
  console.log("App.tsx: Rendering App component");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Routes principales */}
            <Route path="/" element={<Index />} />
            
            {/* Simplified Dashboard Routes for debugging */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Inscriptions />} />
              <Route path="inscriptions" element={<Inscriptions />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

console.log("App.tsx: Component defined successfully");

export default App;
