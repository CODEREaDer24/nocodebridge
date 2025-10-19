import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Upload, ArrowRight, Home } from "lucide-react";

export default function Bridge() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        {/* Navigation */}
        <div className="text-center">
          <Link to="/">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            🌉 Welcome to NoCodeBridge 2.0
          </h1>
          <p className="text-2xl text-gray-300">
            The AEIOU Bridge
          </p>
          <p className="text-lg text-gray-400">
            Connect No-Code apps and AI tools seamlessly
          </p>
        </div>

        {/* Main Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Self-Exporter Card */}
          <Card className="bg-[#111826]/80 backdrop-blur-sm border-blue-500/50 hover:border-blue-400 transition-all duration-300 group">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                <Download className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-blue-400">Self-Exporter</h3>
                <p className="text-gray-400">
                  Generate UAP v2.0 with JSON schema and Markdown docs
                </p>
              </div>
              <Button 
                asChild
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                size="lg"
              >
                <Link to="/self-export">
                  Go to Self-Exporter
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Importer Card */}
          <Card className="bg-[#111826]/80 backdrop-blur-sm border-cyan-500/50 hover:border-cyan-400 transition-all duration-300 group">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-cyan-400">Importer</h3>
                <p className="text-gray-400">
                  Upload .uap or .uapimp files to view diffs and merge AI improvements
                </p>
              </div>
              <Button 
                asChild
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white" 
                size="lg"
              >
                <Link to="/import">
                  Go to Importer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="bg-gradient-to-r from-[#111826]/80 to-[#0f1729]/80 backdrop-blur-sm border-blue-500/30">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-center text-white mb-6">
              🔄 How The Bridge Works
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
                <p><b>Export:</b> Generate .uap file with your project structure</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                <p><b>Collaborate:</b> Send to GPT, Claude, Gemini, or any AI for improvements</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                <p><b>Import:</b> Upload improved .uapimp file back</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">4</div>
                <p><b>Merge:</b> View diffs and merge changes back to Lovable</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-6 border-t border-white/10">
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
}
