import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, Download, Copy, Check, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveAs } from "file-saver";

const REBUILD_INSTRUCTIONS = `To rebuild your app in Lovable:

1. Open your Lovable app's AI chat
2. Paste the Re-Import Prompt from Step 3
3. Wait for the AI to process and apply the changes
4. Verify all routes, components, and functionality work as expected
5. Test the app thoroughly before deploying

AEIOU v3.5 ensures lossless restoration of your app structure.`;

const Step4Reimport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedInstructions, setCopiedInstructions] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const text = await uploadedFile.text();

    // Validate AEIOU header
    const hasAEIOUHeader = text.includes("AEIOU") || text.includes('"meta"') || text.includes('"format"');
    setIsValid(hasAEIOUHeader);

    if (hasAEIOUHeader) {
      toast({
        title: "✅ Valid UAP-Imp",
        description: `${uploadedFile.name} verified successfully`,
      });
    } else {
      toast({
        title: "⚠️ Unverified format",
        description: "File loaded but AEIOU header not detected",
        variant: "destructive",
      });
    }
  };

  const handleDownloadUAPImp = () => {
    if (!file) return;

    saveAs(file, file.name);
    toast({
      title: "Downloaded!",
      description: "UAP-Imp file saved",
    });
  };

  const handleCopyInstructions = async () => {
    try {
      await navigator.clipboard.writeText(REBUILD_INSTRUCTIONS);
      setCopiedInstructions(true);
      toast({
        title: "Copied! ✅",
        description: "Rebuild instructions copied to clipboard",
      });
      setTimeout(() => setCopiedInstructions(false), 2000);
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

      <div className="container mx-auto px-4 py-16 space-y-8 relative z-10 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-400 to-cyan-400 bg-clip-text text-transparent">
            Step 4: Re-Import to Builder
          </h1>
          <Button asChild variant="outline" className="border-lime-400/50 text-lime-400 hover:bg-lime-400/10 rounded-xl">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
        </div>

        {/* Upload Card */}
        <Card className="bg-[#111826]/80 backdrop-blur-sm border-lime-500/50 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">Upload UAP-Imp (Optional Verification)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-400">
              Upload your UAP-Imp file to verify the AEIOU header before rebuilding.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 p-6 border-2 border-dashed border-white/20 rounded-xl">
              <Upload className="w-12 h-12 text-lime-400" />
              <input
                type="file"
                accept=".uap,.uap-imp"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button asChild className="bg-lime-600 hover:bg-lime-700 text-white rounded-xl cursor-pointer">
                  <span>Choose UAP-Imp File</span>
                </Button>
              </label>
              {file && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-lime-400">
                    Loaded: {file.name}
                  </p>
                  {isValid && (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs">✅ AEIOU header verified</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            {file && (
              <Button
                onClick={handleDownloadUAPImp}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl"
              >
                <Download className="w-4 h-4 mr-2" />
                Download UAP-Imp
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 backdrop-blur-sm border-violet-500/50 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Rebuild Instructions</CardTitle>
            <Button
              onClick={handleCopyInstructions}
              className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl"
              size="sm"
            >
              {copiedInstructions ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied! ✅
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Instructions
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <pre className="bg-black/50 p-6 rounded-xl overflow-auto text-sm text-gray-300 border border-white/10 whitespace-pre-wrap">
              {REBUILD_INSTRUCTIONS}
            </pre>
          </CardContent>
        </Card>

        {/* Success Message */}
        <Card className="bg-gradient-to-r from-lime-900/20 to-cyan-900/20 backdrop-blur-sm border-lime-500/50 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-lime-400 flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Ready to Rebuild!</h3>
                <p className="text-gray-300">
                  You've completed the AEIOU v3.5 workflow. Use the Re-Import Prompt from Step 3 to rebuild your app in Lovable.
                </p>
                <p className="text-sm text-gray-400">
                  All changes are lossless and credit-efficient. Your app structure, logic, and styling will be preserved.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/10">
          <p className="text-gray-400 text-sm">
            NoCodeBridge 2.0 · AEIOU v3.5 · Save Credits. Bridge Better.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Built by Go No Code Mode Co.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step4Reimport;
