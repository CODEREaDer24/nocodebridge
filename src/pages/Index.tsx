import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Upload, Sparkles, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white relative overflow-hidden">
      {/* Animated UFO Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-lime-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 border border-violet-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-block px-4 py-2 bg-lime-500/20 border border-lime-500/50 rounded-full mb-4">
            <span className="text-lime-400 font-semibold text-sm">AEIOU Framework v3.5</span>
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-lime-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
            NoCodeBridge 2.0
          </h1>
          <p className="text-3xl font-semibold text-white mb-2">
            Save Credits, Not Creativity
          </p>
          <p className="text-xl text-gray-400 mb-4">
            Bridge your no-code apps with 100% lossless capture. Zero credit waste.
          </p>
        </div>

        {/* 4-Step Workflow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Step 1 */}
          <Card className="bg-[#111826]/80 backdrop-blur-sm border-lime-500/50 hover:border-lime-400 transition-all duration-300 group cursor-pointer rounded-2xl shadow-[0_0_20px_rgba(163,230,53,0.2)]">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-lime-600 to-lime-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(163,230,53,0.5)]">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Step 1 — Install Your Extractor Tool</h3>
              <p className="text-gray-400 text-sm">
                Add the self-extractor to your Lovable app
              </p>
              <Button 
                asChild
                className="w-full bg-lime-600 hover:bg-lime-700 text-white rounded-xl" 
                size="lg"
              >
                <Link to="/install-extractor">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="bg-[#111826]/80 backdrop-blur-sm border-cyan-500/50 hover:border-cyan-400 transition-all duration-300 group cursor-pointer rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Step 2 — Import & Analyze</h3>
              <p className="text-gray-400 text-sm">
                Upload your UAP files for analysis
              </p>
              <Button 
                asChild
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl" 
                size="lg"
              >
                <Link to="/step2-import">
                  Upload UAP
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="bg-[#111826]/80 backdrop-blur-sm border-violet-500/50 hover:border-violet-400 transition-all duration-300 group cursor-pointer rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-violet-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Step 3 — Iterate & Review</h3>
              <p className="text-gray-400 text-sm">
                AI or manual improvements (optional)
              </p>
              <Button 
                asChild
                className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl" 
                size="lg"
              >
                <Link to="/step3-iterate">
                  Review Changes
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card className="bg-[#111826]/80 backdrop-blur-sm border-blue-500/50 hover:border-blue-400 transition-all duration-300 group cursor-pointer rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Step 4 — Re-Import</h3>
              <p className="text-gray-400 text-sm">
                Apply updates to your builder
              </p>
              <Button 
                asChild
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl" 
                size="lg"
              >
                <Link to="/step4-reimport">
                  Re-Import Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/10">
          <p className="text-gray-400 text-sm">
            NoCodeBridge 2.0 · AEIOU v3.5 · Save Credits. Bridge Better.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Built by Go No Code Mode Co.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
