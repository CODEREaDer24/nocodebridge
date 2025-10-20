import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AEIOU_PROMPT = `Create a hidden page at /self-extractor in my app (owner-only).

When the user clicks "Export My App", generate and auto-download three files:
1. {app-name}-uap-v3.5.uap (Universal App Profile)
2. {app-name}-schema.json (JSON Schema)
3. {app-name}-export.md (Markdown Report)

Capture everything with 100% fidelity:
- Pages, routes, navigation structure
- Components with props, state, and children
- Logic, workflows, conditions, and automations
- Variables, datasets, and connections
- AI prompts, embeddings, and automations
- Theme tokens, CSS variables, and styles
- Assets, media references, and URLs
- Environment variables (mask secrets)
- Custom scripts and dependencies
- AEIOU metadata with CRC hash

AEIOU Header Format:
{
  "meta": {
    "format": "AEIOU v3.5",
    "timestamp": "[ISO timestamp]",
    "generator": "NoCodeBridge Self-Extractor",
    "owner_id": "[user_id]",
    "checksum": "[CRC hash]"
  },
  "project": { ... }
}

Rules:
- No summaries or truncation
- Preserve all field order
- No AI calls during export
- Lossless capture only

After export, show:
"✅ Your app has been exported successfully. Three files are ready for download."

Use AEIOU v3.5 format with full reversibility.`;

const InstallExtractor = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(AEIOU_PROMPT);
      setCopied(true);
      toast({
        title: "Copied! ✅",
        description: "AEIOU Exporter v3.5 prompt copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed ⚠️",
        description: "Please select and copy manually",
        variant: "destructive",
      });
    }
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
            Step 1: Install Your Self-Extractor
          </h1>
          <Button asChild variant="outline" className="border-lime-400/50 text-lime-400 hover:bg-lime-400/10 rounded-xl">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
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
              Copy the <span className="text-lime-400 font-semibold">AEIOU Exporter v3.5</span> prompt below and paste it into your Lovable app's AI assistant.
            </p>
            <p>
              It will add a hidden <code className="bg-black/30 px-2 py-1 rounded text-cyan-400">/self-extractor</code> page (owner-only) that exports your complete app as UAP v3.5, JSON Schema, and Markdown—100% lossless, zero credits.
            </p>
          </CardContent>
        </Card>

        {/* Prompt Card */}
        <Card className="bg-[#111826]/80 backdrop-blur-sm border-cyan-500/50 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">AEIOU Exporter v3.5 Prompt</CardTitle>
            <Button
              onClick={handleCopy}
              className="bg-lime-600 hover:bg-lime-700 text-white rounded-xl"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied! ✅
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Extractor Prompt
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
            <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-6">
              <li>Paste this prompt into your Lovable app's AI chat</li>
              <li>Wait for the AI to create the /self-extractor page</li>
              <li>Navigate to /self-extractor in your app and run the export</li>
              <li>Download the three generated files (.uap, .json, .md)</li>
            </ol>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-700 hover:to-violet-700 text-white rounded-xl"
            >
              <Link to="/step2-import">
                ➡ Step 2: Upload & Analyze UAP
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstallExtractor;
