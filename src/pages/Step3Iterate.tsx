import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const PROMPT_OPTIONS = {
  general: `Analyze this UAP and provide general improvement suggestions.

Focus on:
- Code quality and best practices
- Performance optimizations
- UI/UX enhancements
- Security considerations

Return a structured list of Issues, Suggestions, and an AEIOU Patch Plan.`,
  
  bugfix: `Review this UAP and identify any bugs or issues.

Look for:
- Logic errors
- Broken workflows
- Missing dependencies
- Inconsistent state management

Return a detailed bug report with fixes in AEIOU Patch Plan format.`,
  
  feature: `Analyze this UAP and suggest new features or enhancements.

Consider:
- User experience improvements
- New functionality opportunities
- Integration possibilities
- Scalability features

Return actionable feature suggestions with implementation guidance.`,
  
  custom: `You are the AEIOU Assistant. Analyze the attached UAP.

Return:
1. Issues List
2. Suggestions List
3. AEIOU Patch Plan

Keep your response focused and actionable.`
};

const Step3Iterate = () => {
  const [selectedPromptType, setSelectedPromptType] = useState<string>("");
  const [feedback, setFeedback] = useState("");
  const [reimportPrompt, setReimportPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [uploadedApp, setUploadedApp] = useState<any>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setUploadedFileName(file.name);

      // Parse JSON if possible
      let parsed = null;
      try {
        parsed = JSON.parse(text);
      } catch {
        // Not JSON, treat as plain text
        parsed = { content: text };
      }

      // Check if it's NoCodeBridge itself
      if (parsed?.meta?.name === "NoCodeBridge" || parsed?.meta?.app_name === "NoCodeBridge" || text.includes('"name": "NoCodeBridge"')) {
        toast({
          title: "⚠️ Wrong App Detected",
          description: "Please upload your exported app (.uap, .json, or .md) before iterating, not NoCodeBridge itself.",
          variant: "destructive",
        });
        setUploadedApp(null);
        setUploadedFileName("");
        return;
      }

      setUploadedApp(parsed);
      setFeedback(text);
      toast({
        title: "✅ App Uploaded",
        description: `Loaded: ${parsed?.meta?.app_name || parsed?.meta?.name || file.name}`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Could not read the file",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePrompt = () => {
    if (!uploadedApp && !feedback.trim()) {
      toast({
        title: "No content",
        description: "Please upload a file or paste AI feedback first",
        variant: "destructive",
      });
      return;
    }

    // Use uploaded app content or pasted feedback
    const content = uploadedApp ? JSON.stringify(uploadedApp, null, 2) : feedback;

    // Double-check not analyzing NoCodeBridge
    if (content.includes('"name": "NoCodeBridge"') || content.includes('"app_name": "NoCodeBridge"')) {
      toast({
        title: "⚠️ Cannot Analyze Bridge",
        description: "Please upload your exported app, not NoCodeBridge itself.",
        variant: "destructive",
      });
      return;
    }

    // Validate content
    const hasAEIOUHeader = content.includes("AEIOU") || content.includes("meta");
    const hasJSON = content.trim().startsWith("{");
    const hasMD = content.includes("#") || content.includes("##");

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
      content
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

  const handleCopyIterationPrompt = async (type: keyof typeof PROMPT_OPTIONS) => {
    try {
      await navigator.clipboard.writeText(PROMPT_OPTIONS[type]);
      setPromptCopied(true);
      toast({
        title: "Copied! ✅",
        description: "AI iteration prompt copied to clipboard",
      });
      setTimeout(() => setPromptCopied(false), 2000);
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

        {/* Manual AI Prompt Options */}
        <Card className="bg-[#111826]/80 backdrop-blur-sm border-violet-500/50 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">📋 Manual AI Prompt Options (No Credits)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-400">
              Choose a prompt template to copy and paste into your AI assistant with your UAP file attached.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <Button
                onClick={() => handleCopyIterationPrompt('general')}
                variant="outline"
                className="border-violet-400/50 text-violet-400 hover:bg-violet-400/10 rounded-lg justify-start h-auto py-3 px-4"
              >
                <div className="text-left">
                  <div className="font-semibold">General Improvement</div>
                  <div className="text-xs text-gray-400">Quality, performance, UX</div>
                </div>
              </Button>
              <Button
                onClick={() => handleCopyIterationPrompt('bugfix')}
                variant="outline"
                className="border-violet-400/50 text-violet-400 hover:bg-violet-400/10 rounded-lg justify-start h-auto py-3 px-4"
              >
                <div className="text-left">
                  <div className="font-semibold">Bug Fix Analysis</div>
                  <div className="text-xs text-gray-400">Logic errors, issues</div>
                </div>
              </Button>
              <Button
                onClick={() => handleCopyIterationPrompt('feature')}
                variant="outline"
                className="border-violet-400/50 text-violet-400 hover:bg-violet-400/10 rounded-lg justify-start h-auto py-3 px-4"
              >
                <div className="text-left">
                  <div className="font-semibold">Feature Suggestions</div>
                  <div className="text-xs text-gray-400">New functionality ideas</div>
                </div>
              </Button>
              <Button
                onClick={() => handleCopyIterationPrompt('custom')}
                variant="outline"
                className="border-violet-400/50 text-violet-400 hover:bg-violet-400/10 rounded-lg justify-start h-auto py-3 px-4"
              >
                <div className="text-left">
                  <div className="font-semibold">Custom Analysis</div>
                  <div className="text-xs text-gray-400">General AEIOU prompt</div>
                </div>
              </Button>
            </div>
            {promptCopied && (
              <div className="p-3 bg-lime-900/20 border border-lime-500/50 rounded-lg text-center">
                <p className="text-sm text-lime-400">✅ Prompt copied! Paste it into your AI assistant.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* App Upload & Analysis Status */}
        <Card className="bg-[#111826]/80 backdrop-blur-sm border-cyan-500/50 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Upload Your Exported App</span>
              <span className="text-sm font-normal text-cyan-400">
                Analyzing → {uploadedApp?.meta?.app_name || uploadedApp?.meta?.name || uploadedFileName || "None Uploaded"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-400">
              Upload your .uap, .json, or .md file from Step 2, or paste AI feedback below.
            </p>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".uap,.json,.md,.uap-imp"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-600 file:text-white hover:file:bg-violet-700 cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        {/* Feedback Input */}
        <Card className="bg-[#111826]/80 backdrop-blur-sm border-lime-500/50 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">AI Feedback or Manual Paste</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-400">
              Or paste AI feedback, UAP-Imp content, or patch plan directly here.
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
