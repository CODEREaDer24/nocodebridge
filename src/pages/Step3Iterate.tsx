import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Copy, Check, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const REIMPORT_PROMPT_TEMPLATE = `Rebuild this Lovable app from the following AEIOU submission (UAP-Imp or patch plan).

Preserve all routes, components, logic, data, and styling.
Use AEIOU v3.5 format for lossless application.

Instructions:
1. Parse the attached UAP-Imp or AI feedback below
2. Apply all changes while maintaining existing functionality
3. Ensure all dependencies and assets are intact
4. Validate the rebuild against the original UAP structure

──────────────────────────────
[PASTE YOUR UAP-IMP OR AI FEEDBACK HERE]
──────────────────────────────`;

const Step3Iterate = () => {
  const [autoImprove, setAutoImprove] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [reimportPrompt, setReimportPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGeneratePrompt = () => {
    if (!feedback.trim()) {
      toast({
        title: "No content",
        description: "Please paste AI feedback or UAP-Imp content first",
        variant: "destructive",
      });
      return;
    }

    // Validate content
    const hasAEIOUHeader = feedback.includes("AEIOU") || feedback.includes("meta");
    const hasJSON = feedback.trim().startsWith("{");
    const hasMD = feedback.includes("#") || feedback.includes("##");

    let status = "";
    if (hasAEIOUHeader) {
      status = "✅ AEIOU header detected";
    } else if (hasJSON) {
      status = "✅ JSON format detected";
    } else if (hasMD) {
      status = "✅ Markdown notes detected";
    } else {
      status = "⚠️ Unknown format (will attempt to process)";
    }

    const prompt = REIMPORT_PROMPT_TEMPLATE.replace(
      "[PASTE YOUR UAP-IMP OR AI FEEDBACK HERE]",
      feedback
    );

    setReimportPrompt(prompt);
    toast({
      title: status,
      description: "Re-Import Prompt generated successfully",
    });
  };

  const handleCopyPrompt = async () => {
    if (!reimportPrompt) return;

    try {
      await navigator.clipboard.writeText(reimportPrompt);
      setCopied(true);
      toast({
        title: "Copied! ✅",
        description: "Re-Import Prompt copied to clipboard",
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
        <div className="absolute top-20 left-20 w-64 h-64 border border-violet-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-lime-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-8 relative z-10 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-lime-400 bg-clip-text text-transparent">
            Step 3: Iterate & Review
          </h1>
          <Button asChild variant="outline" className="border-violet-400/50 text-violet-400 hover:bg-violet-400/10 rounded-xl">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
        </div>

        {/* Auto-Improve Toggle */}
        <Card className="bg-[#111826]/80 backdrop-blur-sm border-violet-500/50 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-improve" className="text-lg font-semibold text-white">
                  Auto-Improve with AI
                </Label>
                <p className="text-sm text-gray-400">
                  Enable to automatically run AI improvements (will use credits)
                </p>
              </div>
              <Switch
                id="auto-improve"
                checked={autoImprove}
                onCheckedChange={setAutoImprove}
              />
            </div>
            {autoImprove && (
              <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-200">
                  Warning: Auto-improve will use AI credits. Disable this option to work manually and save credits.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feedback Input */}
        <Card className="bg-[#111826]/80 backdrop-blur-sm border-lime-500/50 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">AI Feedback or UAP-Imp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-400">
              Paste the AI response from Step 2, or paste your UAP-Imp file content here.
            </p>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Paste AI feedback, UAP-Imp JSON, or patch plan here..."
              className="min-h-[300px] bg-black/50 border-white/10 text-gray-300 rounded-xl font-mono text-sm"
            />
            <Button
              onClick={handleGeneratePrompt}
              className="w-full bg-gradient-to-r from-violet-600 to-lime-600 hover:from-violet-700 hover:to-lime-700 text-white rounded-xl"
            >
              Generate Re-Import Prompt
            </Button>
          </CardContent>
        </Card>

        {/* Generated Prompt */}
        {reimportPrompt && (
          <Card className="bg-[#111826]/80 backdrop-blur-sm border-cyan-500/50 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Re-Import Prompt (Ready to Use)</CardTitle>
              <Button
                onClick={handleCopyPrompt}
                className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl"
                size="sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied! ✅
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Prompt
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="bg-black/50 p-6 rounded-xl overflow-auto max-h-[400px] text-sm text-gray-300 border border-white/10">
                {reimportPrompt}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex gap-4">
          <Button
            asChild
            variant="outline"
            className="flex-1 border-violet-400/50 text-violet-400 hover:bg-violet-400/10 rounded-xl"
          >
            <Link to="/step2-import">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Step 2
            </Link>
          </Button>
          <Button
            asChild
            className="flex-1 bg-gradient-to-r from-lime-600 to-cyan-600 hover:from-lime-700 hover:to-cyan-700 text-white rounded-xl"
          >
            <Link to="/step4-reimport">
              Step 4: Re-Import
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step3Iterate;
