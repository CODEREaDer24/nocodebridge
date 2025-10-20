import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Import from "./pages/Import";
import Bridge from "./pages/Bridge";
import SelfExport from "./pages/SelfExport";
import SelfExtractorAdmin from "./pages/SelfExtractorAdmin";
import SelfExtractorTool from "./pages/SelfExtractorTool";
import InstallExtractor from "./pages/InstallExtractor";
import UploadAnalyze from "./pages/UploadAnalyze";
import ImproveWithAI from "./pages/ImproveWithAI";
import ReturnToBuilder from "./pages/ReturnToBuilder";
import Admin from "./pages/Admin";
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
          <Route path="/import" element={<Import />} />
          <Route path="/bridge" element={<Bridge />} />
          <Route path="/self-export" element={<SelfExport />} />
          <Route path="/self-extractor-admin" element={<SelfExtractorAdmin />} />
          <Route path="/self-extractor" element={<SelfExtractorTool />} />
          <Route path="/install-extractor" element={<InstallExtractor />} />
          <Route path="/upload-analyze" element={<UploadAnalyze />} />
          <Route path="/improve-with-ai" element={<ImproveWithAI />} />
          <Route path="/return-to-builder" element={<ReturnToBuilder />} />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
