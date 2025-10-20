import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Copy, Check, Sparkles, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AUTO_IMPROVE_PROMPT = `Analyze this UAP (Universal App Profile) and identify issues, improvements, and optimizations.

Then prepare a UAP-Imp (improved version) with:
- Bug fixes and performance enhancements
- Better UX and accessibility
- Optimized data models
- Enhanced AI prompt suggestions

Return the improved version in the same UAP v3.0 format so it can be imported back into NoCodeBridge for merging.`;

const ImproveWithAI = () => {
  const [customChanges, setCustomChanges] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState("");
  const { toast } = useToast();

  const handleCopy = async (text: string, label: string) => {
    const uapData = localStorage.getItem("uap_export");
    const fullPrompt = uapData 
      ? `${text}\n\n---\nUAP Data:\n${uapData}`
      : text;

    await navigator.clipboard.writeText(fullPrompt);
    setCopiedPrompt(label);
    toast({
      title: "Copied!",
      description: `${label} prompt copied with UAP data`,
    });
    setTimeout(() => setCopiedPrompt(""), 2000);
  };

  const generateCustomPrompt = () => {
    return `${customChanges}

Analyze the UAP below and apply these changes. Return an improved UAP-Imp in the same v3.0 format.`;
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-violet-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-lime-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-8 relative z-10 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-lime-400 bg-clip-text text-transparent">
            Improve Your App with AI
          </h1>
          <Button asChild variant="outline" className="border-violet-400/50 text-violet-400 hover:bg-violet-400/10 rounded-xl">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Description */}
        <Card className="bg-[#111826]/80 backdrop-blur-sm border-violet-500/50 rounded-2xl">
          <CardContent className="p-6 text-gray-300">
            <p>
              Generate prompts to improve your app with any AI assistant (ChatGPT, Claude, Gemini, etc.).
              Each prompt includes your UAP data and returns an improved version ready for NoCodeBridge import.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auto-Improve Card */}
          <Card className="bg-[#111826]/80 backdrop-blur-sm border-lime-500/50 hover:border-lime-400 transition-all duration-300 rounded-2xl shadow-[0_0_20px_rgba(163,230,53,0.2)]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-lime-600 to-lime-800 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.4)]">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">Auto-Improve</CardTitle>
                  <p className="text-sm text-gray-400">Recommended</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">
                Generate a comprehensive improvement prompt that asks AI to analyze and enhance your entire app.
              </p>
              <pre className="bg-black/50 p-4 rounded-xl text-xs text-gray-300 max-h-[200px] overflow-auto border border-white/10">
                {AUTO_IMPROVE_PROMPT}
              </pre>
              <Button
                onClick={() => handleCopy(AUTO_IMPROVE_PROMPT, "Auto-Improve")}
                className="w-full bg-lime-600 hover:bg-lime-700 text-white rounded-xl"
              >
                {copiedPrompt === "Auto-Improve" ? (
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
            </CardContent>
          </Card>

          {/* Customize Changes Card */}
          <Card className="bg-[#111826]/80 backdrop-blur-sm border-cyan-500/50 hover:border-cyan-400 transition-all duration-300 rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">Customize Changes</CardTitle>
                  <p className="text-sm text-gray-400">Specific improvements</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">
                Describe specific additions or fixes you want the AI to make to your app.
              </p>
              <Textarea
                value={customChanges}
                onChange={(e) => setCustomChanges(e.target.value)}
                placeholder="Example: Add a dark mode toggle, improve the mobile navigation, add user authentication..."
                className="bg-black/50 border-white/10 text-white min-h-[120px] rounded-xl"
              />
              <Button
                onClick={() => handleCopy(generateCustomPrompt(), "Custom")}
                disabled={!customChanges.trim()}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl disabled:opacity-50"
              >
                {copiedPrompt === "Custom" ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Custom Prompt
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="bg-gradient-to-r from-blue-900/20 to-violet-900/20 backdrop-blur-sm border-blue-500/50 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-3">Next Steps</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Copy one of the prompts above</li>
              <li>Paste it into your preferred AI assistant (ChatGPT, Claude, etc.)</li>
              <li>Wait for the AI to generate the improved UAP-Imp</li>
              <li>Copy the AI's response and proceed to <Link to="/return-to-builder" className="text-cyan-400 hover:underline">Step 4: Return to Builder</Link></li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImproveWithAI;
