import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy } from "lucide-react";

const SELF_EXPORTER_PROMPT = `Create a Self-Exporter page in my Lovable app that:
1. Analyzes the current project structure
2. Extracts all pages, components, and routes
3. Generates a UAP (Universal App Package) file with JSON schema and Markdown documentation
4. Allows download of the complete export
5. Runs entirely client-side with zero API calls

The export should include embedded AI reading instructions for round-trip collaboration.`;

export default function Export() {
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState("exported-project.uap");

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    file.text().then((text) => {
      setInput(text);
      toast.success(`Loaded ${file.name}`);
    });
  }

  function convertToUAP() {
    if (!input.trim()) {
      toast.error("Nothing to export!");
      return;
    }

    const isJSON = input.trim().startsWith("{");
    let uapData;

    try {
      if (isJSON) {
        const parsed = JSON.parse(input);
        uapData = {
          meta: {
            format: "UAP",
            version: "1.0.0",
            generated_at: new Date().toISOString(),
            source: "GoNoCoMoCo / AEIOU Export Tool",
            projectName:
              parsed.meta?.name ||
              parsed.name ||
              parsed.projectName ||
              "Unnamed Project",
          },
          name:
            parsed.name || parsed.meta?.name || "Unnamed Project",
          description:
            parsed.description ||
            parsed.meta?.description ||
            "No description provided.",
          pages: parsed.pages || [],
          components: parsed.components || [],
          raw: parsed,
        };
      } else {
        uapData = {
          meta: {
            format: "UAP",
            version: "1.0.0",
            generated_at: new Date().toISOString(),
            source: "GoNoCoMoCo / AEIOU Markdown Export",
            projectName: fileName.replace(".uap", ""),
          },
          name: fileName.replace(".uap", ""),
          description: "Converted from Markdown",
          markdown: input,
          pages: [],
          components: [],
        };
      }

      const blob = new Blob([JSON.stringify(uapData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("✅ Exported successfully!");
    } catch (err) {
      toast.error("❌ Failed to convert file");
      console.error(err);
    }
  }

  const copySelfExporterPrompt = () => {
    navigator.clipboard.writeText(SELF_EXPORTER_PROMPT);
    toast.success("📋 Self-Exporter Prompt copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Navigation */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            🧩 GoNoCoMoCo Self-Exporter
          </h1>
          <p className="text-xl text-blue-300 mb-4">
            Export your app's soul in a few simple, credit-friendly steps.
          </p>
        </div>

        {/* Intro Section */}
        <Card className="mb-8 bg-gray-800/50 backdrop-blur-sm border-blue-500/30">
          <CardContent className="p-6">
            <p className="text-gray-300 text-lg leading-relaxed">
              Hi 👋, I'm <b className="text-blue-400">Chad G. Petit</b> (<b className="text-cyan-400">ChatGPT</b>) — your built-in AI co-founder.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mt-4">
              Copy the Self-Exporter Prompt below and paste it into your Lovable AI chat with me (Chad G. Petit / ChatGPT).
              I'll generate a page in your Lovable app that extracts its structure and logic into a Universal App Package (<b className="text-blue-400">UAP</b>).
              Download that UAP and return here to complete your round trip.
            </p>
          </CardContent>
        </Card>

        {/* Self-Exporter Prompt */}
        <Card className="mb-8 bg-gray-800/50 backdrop-blur-sm border-cyan-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-cyan-400">Self-Exporter Prompt</h3>
              <Button onClick={copySelfExporterPrompt} className="gap-2 bg-cyan-600 hover:bg-cyan-700">
                <Copy className="w-4 h-4" />
                Copy Prompt
              </Button>
            </div>
            <pre className="text-sm text-gray-300 bg-black/30 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
{SELF_EXPORTER_PROMPT}
            </pre>
          </CardContent>
        </Card>

        {/* Video Placeholder */}
        <Card className="mb-8 bg-gray-800/50 backdrop-blur-sm border-purple-500/30">
          <CardContent className="p-6">
            <div className="aspect-video bg-black/30 rounded-lg flex items-center justify-center border border-purple-500/20">
              <div className="text-center">
                <p className="text-2xl mb-2">🎥</p>
                <p className="text-purple-400 font-semibold">Watch How It Works</p>
                <p className="text-gray-400 text-sm">Demo Coming Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Note */}
        <Card className="mb-8 bg-gray-800/50 backdrop-blur-sm border-yellow-500/30">
          <CardContent className="p-6">
            <p className="text-gray-300 text-center">
              💡 <b className="text-yellow-400">Coming Soon:</b> 'Open with Chad G. Petit (ChatGPT)' to review and refine your UAP directly inside GoNoCoMoCo.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-700">
          <p className="text-gray-400">
            Built with ❤️ by <span className="text-blue-400 font-semibold">GoNoCoMoCo</span> + <span className="text-cyan-400 font-semibold">Chad G. Petit (ChatGPT)</span>
          </p>
        </div>
      </div>
    </div>
  );
}
