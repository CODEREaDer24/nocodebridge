import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import History from "./pages/History";
import Export from "./pages/Export";
import Import from "./pages/Import";
import Bridge from "./pages/Bridge";
import ProjectAnalysis from "./pages/ProjectAnalysis";
import StylePreview from "./pages/StylePreview";
import HowTo from "./pages/HowTo";
import SelfExport from "./pages/SelfExport";
import SelfExtract from "./pages/SelfExtract";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/history" element={<History />} />
          <Route path="/export" element={<Export />} />
          <Route path="/import" element={<Import />} />
          <Route path="/bridge" element={<Bridge />} />
          <Route path="/analysis" element={<ProjectAnalysis />} />
          <Route path="/style-preview" element={<StylePreview />} />
          <Route path="/howto" element={<HowTo />} />
          <Route path="/self-export" element={<SelfExport />} />
          <Route path="/extractor" element={<SelfExtract />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
