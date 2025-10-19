import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, Package, BookOpen } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            🚀 Reunite AI with No-Code
          </h1>
          <p className="text-2xl text-blue-300 mb-6">
            Powered by Go No Code Mode Company (GoNoCoMoCo) + Chad G. Petit (ChatGPT)
          </p>
          <div className="max-w-3xl mx-auto bg-gray-800/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 mb-8">
            <p className="text-gray-300 text-lg leading-relaxed">
              GoNoCoMoCo exists to make AI creation <span className="text-blue-400 font-semibold">credit-friendly</span>, 
              <span className="text-cyan-400 font-semibold"> transparent</span>, and 
              <span className="text-blue-400 font-semibold"> Lovable-compatible</span>. 
              Every feature here respects your credits and your platform.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Link to="/export">
            <Button className="w-full h-32 bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] transition-all">
              <div className="text-center">
                <Brain className="w-8 h-8 mx-auto mb-2" />
                <div className="text-xl font-bold">🧠 Self-Exporter</div>
                <div className="text-sm opacity-80 mt-1">Export Your App's Soul</div>
              </div>
            </Button>
          </Link>

          <Link to="/import">
            <Button className="w-full h-32 bg-cyan-600 hover:bg-cyan-700 text-white shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transition-all">
              <div className="text-center">
                <Package className="w-8 h-8 mx-auto mb-2" />
                <div className="text-xl font-bold">📦 Import UAP</div>
                <div className="text-sm opacity-80 mt-1">Merge & Download</div>
              </div>
            </Button>
          </Link>

          <Link to="/glossary">
            <Button className="w-full h-32 bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all">
              <div className="text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-2" />
                <div className="text-xl font-bold">📘 Glossary</div>
                <div className="text-sm opacity-80 mt-1">Speak No-Code</div>
              </div>
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-700">
          <p className="text-gray-400">
            Built with ❤️ by <span className="text-blue-400 font-semibold">GoNoCoMoCo</span> + <span className="text-cyan-400 font-semibold">Chad G. Petit (ChatGPT)</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
