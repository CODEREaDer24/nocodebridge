import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { initializeAEIOUAutoRepair } from "@/utils/aeiouAutoRepair";
import Index from "./pages/Index";
import Import from "./pages/Import";
import Bridge from "./pages/Bridge";
import SelfExtractor from "./pages/SelfExtractor";
import ReturnToBuilder from "./pages/ReturnToBuilder";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize AEIOU v4.3 AutoRepair on app start
    initializeAEIOUAutoRepair();
    
    // Success notification
    setTimeout(() => {
      toast({
        title: "✅ AEIOU Bridge v3.7 Ready",
        description: "Clean Build initialized.",
      });
    }, 1000);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          {/* Core Routes v3.7 */}
          <Route path="/" element={<Index />} />
          <Route path="/bridge" element={<Bridge />} />
          <Route path="/export" element={<SelfExtractor />} />
          <Route path="/import" element={<Import />} />
          <Route path="/return" element={<ReturnToBuilder />} />
          <Route path="/docs" element={<Admin />} />
          
          {/* Legacy Route Redirects */}
          <Route path="/self-export" element={<Navigate to="/bridge" replace />} />
          <Route path="/self-extractor-admin" element={<Navigate to="/bridge" replace />} />
          <Route path="/self-extractor" element={<Navigate to="/export" replace />} />
          <Route path="/self-extractor-tool" element={<Navigate to="/export" replace />} />
          <Route path="/install-extractor" element={<Navigate to="/bridge" replace />} />
          <Route path="/upload-analyze" element={<Navigate to="/bridge" replace />} />
          <Route path="/improve-with-ai" element={<Navigate to="/bridge" replace />} />
          <Route path="/return-to-builder" element={<Navigate to="/return" replace />} />
          <Route path="/admin" element={<Navigate to="/docs" replace />} />
          <Route path="/step2-import" element={<Navigate to="/import" replace />} />
          <Route path="/step3-iterate" element={<Navigate to="/bridge" replace />} />
          <Route path="/step4-reimport" element={<Navigate to="/return" replace />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
