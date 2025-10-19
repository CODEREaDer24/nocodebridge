import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Upload, ArrowRight, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full mb-4">
            <span className="text-blue-400 font-semibold text-sm">AEIOU Framework v2.0</span>
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            NoCodeBridge 2.0
          </h1>
          <p className="text-3xl font-semibold text-white mb-2">
            The AEIOU Bridge
          </p>
          <p className="text-xl text-gray-400 mb-4">
            AI Enabling Interoperability of Universes
          </p>
          <div className="flex items-center justify-center gap-2 text-lg text-gray-300">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Make it clean, make it obvious, make it universal.</span>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Self-Export Card */}
          <Card className="bg-[#111826]/80 backdrop-blur-sm border-blue-500/50 hover:border-blue-400 transition-all duration-300 group cursor-pointer">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                <Download className="w-12 h-12 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white">Self-Exporter</h3>
                <p className="text-gray-400 text-lg">
                  Generate UAP v2.0 from your project
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-sm space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-400">Auto-detect & parse files</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-400">Generate JSON + Markdown</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-400">Ready for AI collaboration</span>
                  </div>
                </div>
                <Button 
                  asChild
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                  size="lg"
                >
                  <Link to="/self-export">
                    Start Export
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Import Card */}
          <Card className="bg-[#111826]/80 backdrop-blur-sm border-cyan-500/50 hover:border-cyan-400 transition-all duration-300 group cursor-pointer">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                <Upload className="w-12 h-12 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white">Importer</h3>
                <p className="text-gray-400 text-lg">
                  Reunite AI improvements with No-Code
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-sm space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span className="text-gray-400">Upload .uap or .uapimp</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span className="text-gray-400">View diffs & changes</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span className="text-gray-400">Merge improvements</span>
                  </div>
                </div>
                <Button 
                  asChild
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white" 
                  size="lg"
                >
                  <Link to="/import">
                    Start Import
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Link to Bridge */}
        <div className="text-center">
          <Button 
            asChild
            variant="outline"
            className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10"
            size="lg"
          >
            <Link to="/bridge">
              🌉 Go to AEIOU Bridge Hub
            </Link>
          </Button>
        </div>

        {/* Benefits Section */}
        <Card className="bg-gradient-to-r from-[#111826]/80 to-[#0f1729]/80 backdrop-blur-sm border-blue-500/30 max-w-5xl mx-auto">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-white">The First True AI-to-No-Code Bridge</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-blue-400 font-semibold">100% Local</div>
                <p className="text-sm text-gray-400">
                  All conversions run in your browser. Zero API calls, zero credits.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-cyan-400 font-semibold">Universal Format</div>
                <p className="text-sm text-gray-400">
                  UAP v2.0 works with any AI and any no-code builder.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-purple-400 font-semibold">AI-Enhanced</div>
                <p className="text-sm text-gray-400">
                  Collaborate with GPT, Claude, Gemini, or any AI tool.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/10">
          <p className="text-gray-400 text-sm">
            🚀 NoCodeBridge 2.0 | Powered by AEIOU Framework
          </p>
          <p className="text-gray-500 text-xs mt-2">
            "This is the world's first true AI-to-No-Code Bridge."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
