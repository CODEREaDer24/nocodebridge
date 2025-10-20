import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AEIOU_PROMPT = `Create a hidden page at /self-extractor in my app.

When the user clicks "Export My App", generate and auto-download three files:
1. {app-name}-uap-v3.0.uap (Universal App Profile)
2. {app-name}-schema.json (JSON Schema)
3. {app-name}-export.md (Markdown Report)

The export should capture:
- All pages, routes, and components
- Logic, data models, and variables
- AI prompts and connections
- Styles and configurations

After export, show confirmation:
"✅ Your app has been exported. Upload the UAP into NoCodeBridge.xyz to analyze and refine it."

Use the AEIOU v3.0 format with full reversibility—no truncation, no summarization.`;

const InstallExtractor = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(AEIOU_PROMPT);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "AEIOU Exporter v3.0 prompt copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-lime-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-8 relative z-10 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-400 to-cyan-400 bg-clip-text text-transparent">
            Install Your Self-Extractor Tool
          </h1>
          <Button asChild variant="outline" className="border-lime-400/50 text-lime-400 hover:bg-lime-400/10 rounded-xl">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Instructions */}
        <Card className="bg-[#111826]/80 backdrop-blur-sm border-lime-500/50 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>
              Copy the <span className="text-lime-400 font-semibold">AEIOU Exporter v3.0</span> prompt below and paste it into your Lovable app's AI assistant.
            </p>
            <p>
              It will add a hidden <code className="bg-black/30 px-2 py-1 rounded text-cyan-400">/self-extractor</code> page that can export your app as UAP, Schema, and Markdown—100% reversible and credit-free.
            </p>
          </CardContent>
        </Card>

        {/* Prompt Card */}
        <Card className="bg-[#111826]/80 backdrop-blur-sm border-cyan-500/50 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">AEIOU Exporter v3.0 Prompt</CardTitle>
            <Button
              onClick={handleCopy}
              className="bg-lime-600 hover:bg-lime-700 text-white rounded-xl"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Prompt
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <pre className="bg-black/50 p-6 rounded-xl overflow-auto max-h-[400px] text-sm text-gray-300 border border-white/10">
              {AEIOU_PROMPT}
            </pre>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-gradient-to-r from-violet-900/20 to-blue-900/20 backdrop-blur-sm border-violet-500/50 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-3">Next Steps</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Paste this prompt into your Lovable app's AI chat</li>
              <li>Wait for the AI to create the /self-extractor page</li>
              <li>Navigate to /self-extractor in your app and run the export</li>
              <li>Come back here and proceed to <Link to="/upload-analyze" className="text-cyan-400 hover:underline">Step 2: Upload & Analyze</Link></li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstallExtractor;
