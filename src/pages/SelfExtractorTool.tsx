import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Home, Copy, Download, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { saveAs } from "file-saver";

const EXTRACTOR_PROMPT = `Create a hidden page at /self-extractor (owner-only).

EXPORT FUNCTIONALITY:
When the user clicks 'Export My App', generate and auto-download three files:
  1. {app-name}-uap-v3.5.uap
  2. {app-name}-schema.json
  3. {app-name}-export.md

Capture 100% of the app with full fidelity - no summaries, no truncation.

IMPORT FUNCTIONALITY:
When the user clicks 'Import Improved UAP', open a file picker accepting .uap, .uap-imp, .json files.
Validate the AEIOU header, then generate and display a rebuild prompt with a copy button.

Both features must be credit-free and run locally.

Show confirmation after export:
  "✅ Your app has been exported. Upload the UAP into NoCodeBridge.xyz to analyze and refine it."`;

const SelfExtractorTool = () => {
  const [uploadedFile, setUploadedFile] = useState<{ name: string; content: string; type: string } | null>(null);
  const [importedFile, setImportedFile] = useState<{ name: string; content: string } | null>(null);
  const [rebuildPrompt, setRebuildPrompt] = useState<string>("");

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(EXTRACTOR_PROMPT);
    toast({
      title: "Copied!",
      description: "Extractor prompt copied to clipboard",
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const fileType = file.name.endsWith('.uap') ? 'UAP' : 
                     file.name.endsWith('.json') ? 'JSON' : 
                     file.name.endsWith('.md') ? 'Markdown' : 'Unknown';

    setUploadedFile({
      name: file.name,
      content: text,
      type: fileType
    });

    toast({
      title: "File Uploaded!",
      description: `${file.name} has been loaded`,
    });
  };

  const handleCopy = () => {
    if (uploadedFile) {
      navigator.clipboard.writeText(uploadedFile.content);
      toast({
        title: "Copied!",
        description: `${uploadedFile.type} content copied to clipboard`,
      });
    }
  };

  const handleDownload = () => {
    if (uploadedFile) {
      const mimeType = uploadedFile.type === 'JSON' ? 'application/json' : 
                       uploadedFile.type === 'Markdown' ? 'text/markdown' : 
                       'application/octet-stream';
      const blob = new Blob([uploadedFile.content], { type: mimeType });
      saveAs(blob, uploadedFile.name);
      toast({
        title: "Downloaded!",
        description: `${uploadedFile.name} has been downloaded`,
      });
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const isValid = text.includes("AEIOU") || text.includes('"meta"') || text.includes('{');

    if (!isValid) {
      toast({
        title: "Invalid File ⚠️",
        description: "Please upload a valid UAP, UAP-Imp, or JSON file",
        variant: "destructive",
      });
      return;
    }

    setImportedFile({ name: file.name, content: text });
    
    const prompt = `Rebuild this Lovable app from the following AEIOU submission.

Preserve all routes, components, logic, data, and styling.
Use AEIOU v3.5 format for lossless application.

Instructions:
1. Parse the UAP-Imp below
2. Apply all changes while maintaining existing functionality
3. Ensure all dependencies and assets are intact
4. Validate the rebuild against the original UAP structure

──────────────────────────────
${text}
──────────────────────────────`;

    setRebuildPrompt(prompt);

    toast({
      title: "Import Ready! ✅",
      description: `${file.name} validated. Rebuild prompt generated.`,
    });
  };

  const handleCopyRebuildPrompt = () => {
    if (rebuildPrompt) {
      navigator.clipboard.writeText(rebuildPrompt);
      toast({
        title: "Copied! ✅",
        description: "Rebuild prompt copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-8 relative z-10">
        {/* Navigation */}
        <div className="flex justify-end">
          <Button
            asChild
            variant="outline"
            className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10 gap-2"
          >
            <Link to="/">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            🛠️ Self-Extractor Tool
          </h1>
          <p className="text-gray-400 text-lg">
            Add extraction capabilities to any Lovable app
          </p>
        </div>

        {/* Section A - Install the Extractor */}
        <Card className="bg-[#111826]/80 backdrop-blur-sm border-blue-500/50 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white text-2xl">📦 Install the Extractor</CardTitle>
            <p className="text-gray-400">
              Add this prompt to your Lovable app to enable Self-Extraction.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={EXTRACTOR_PROMPT}
              readOnly
              className="bg-[#0a0e1a] border-blue-500/30 text-gray-300 font-mono text-sm min-h-[150px]"
            />
            <Button
              onClick={handleCopyPrompt}
              className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Prompt
            </Button>
          </CardContent>
        </Card>

        {/* Section B - Example Output Viewer */}
        <Card className="bg-[#111826]/80 backdrop-blur-sm border-cyan-500/50 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white text-2xl">👁️ Example Output Viewer</CardTitle>
            <p className="text-gray-400">
              Upload a .uap, .json, or .md file to preview it
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".uap,.json,.md"
                onChange={handleFileUpload}
                className="bg-[#0a0e1a] border-cyan-500/30 text-gray-300"
              />
              <Upload className="w-6 h-6 text-cyan-400" />
            </div>

            {uploadedFile && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-400">
                    <span className="text-cyan-400 font-semibold">{uploadedFile.type}</span> • {uploadedFile.name}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCopy}
                      className="bg-cyan-600 hover:bg-cyan-700 gap-2"
                      size="sm"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 gap-2"
                      size="sm"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
                <pre className="bg-[#0a0e1a] p-4 rounded-lg overflow-auto max-h-96 text-sm text-gray-300 border border-cyan-500/30">
                  {uploadedFile.content}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section C - Import Improved UAP */}
        <Card className="bg-[#111826]/80 backdrop-blur-sm border-lime-500/50 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white text-2xl">📥 Import Improved UAP</CardTitle>
            <p className="text-gray-400">
              Upload your AI-refined UAP to generate a rebuild prompt (credit-free)
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="file"
              accept=".uap,.uap-imp,.json"
              onChange={handleImportFile}
              className="bg-[#0a0e1a] border-lime-500/30 text-gray-300"
            />
            
            {importedFile && (
              <div className="space-y-4">
                <div className="p-4 bg-lime-900/20 border border-lime-500/50 rounded-lg">
                  <p className="text-sm text-lime-400">
                    ✅ {importedFile.name} validated and ready
                  </p>
                </div>
                
                {rebuildPrompt && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-semibold">Rebuild Prompt (Ready to Use)</p>
                      <Button
                        onClick={handleCopyRebuildPrompt}
                        className="bg-lime-600 hover:bg-lime-700 gap-2"
                        size="sm"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Prompt
                      </Button>
                    </div>
                    <pre className="bg-[#0a0e1a] p-4 rounded-lg overflow-auto max-h-64 text-sm text-gray-300 border border-lime-500/30">
                      {rebuildPrompt}
                    </pre>
                    <p className="text-xs text-gray-400">
                      📋 Paste this prompt into your Lovable app to apply the improvements
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section D - Next Steps */}
        <Card className="bg-[#111826]/80 backdrop-blur-sm border-purple-500/50 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white text-2xl">🚀 Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 text-lg">
              Upload your UAP to the Import page to run analysis and generate AI Collab JSON and Markdown. 
              Pro users unlock JSON and Markdown exports automatically.
            </p>
            <Button
              asChild
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              <Link to="/import">
                Go to Import Page
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SelfExtractorTool;
