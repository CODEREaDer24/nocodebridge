import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Copy, Check, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BridgeNavigation from "@/components/BridgeNavigation";

const ReturnToBuilder = () => {
  const [improvedUAP, setImprovedUAP] = useState("");
  const [returnPrompt, setReturnPrompt] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    setImprovedUAP(text);
    generateReturnPrompt(text);

    toast({
      title: "File uploaded!",
      description: `Loaded ${file.name}`,
    });
  };

  const handlePaste = () => {
    if (improvedUAP.trim()) {
      generateReturnPrompt(improvedUAP);
    }
  };

  const generateReturnPrompt = (uapData: string) => {
    const prompt = `Apply the following improved UAP (Universal App Profile) to my Lovable app.

This UAP contains enhancements made via AI collaboration. Please:
1. Compare it with the current app structure
2. Apply all improvements, bug fixes, and new features
3. Preserve existing functionality unless explicitly changed
4. Update components, pages, logic, and data models as specified

**Improved UAP:**
\`\`\`json
${uapData}
\`\`\`

After applying changes, confirm: "✅ Improvements merged successfully via NoCodeBridge."`;

    setReturnPrompt(prompt);
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(returnPrompt);
    setCopiedPrompt(true);
    toast({
      title: "Copied!",
      description: "Return prompt copied to clipboard",
    });
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white relative overflow-hidden">
      <BridgeNavigation />
      
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-violet-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-8 relative z-10 max-w-5xl">{/* Header */}
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            Return to Your Builder
          </h1>
          <Button asChild variant="outline" className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10 rounded-xl">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Description */}
        <Card className="bg-[#111826]/80 backdrop-blur-sm border-blue-500/50 rounded-2xl">
          <CardContent className="p-6 text-gray-300">
            <p>
              Upload your improved UAP or paste the AI response below. This will generate the Return Prompt to apply your updated version in Lovable.
            </p>
          </CardContent>
        </Card>

        {/* Upload Section */}
        <Card className="bg-[#111826]/80 backdrop-blur-sm border-cyan-500/50 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">Upload or Paste Improved UAP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept=".uap,.json,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="improved-file-upload"
                />
                <label htmlFor="improved-file-upload">
                  <Button asChild className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl cursor-pointer">
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Improved UAP
                    </span>
                  </Button>
                </label>
              </div>
              <div className="flex items-center text-gray-400">or</div>
              <div className="flex-1">
                <Button
                  onClick={handlePaste}
                  disabled={!improvedUAP.trim()}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl disabled:opacity-50"
                >
                  Generate from Pasted Text
                </Button>
              </div>
            </div>

            <Textarea
              value={improvedUAP}
              onChange={(e) => setImprovedUAP(e.target.value)}
              placeholder="Paste your improved UAP or AI response here..."
              className="bg-black/50 border-white/10 text-white min-h-[200px] rounded-xl font-mono text-sm"
            />
          </CardContent>
        </Card>

        {/* Return Prompt Output */}
        {returnPrompt && (
          <Card className="bg-[#111826]/80 backdrop-blur-sm border-lime-500/50 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Return Prompt (Paste into Lovable)</CardTitle>
              <Button
                onClick={handleCopyPrompt}
                className="bg-lime-600 hover:bg-lime-700 text-white rounded-xl"
              >
                {copiedPrompt ? (
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
                {returnPrompt}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="bg-gradient-to-r from-lime-900/20 to-cyan-900/20 backdrop-blur-sm border-lime-500/50 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-3">Final Steps</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Copy the Return Prompt above</li>
              <li>Go back to your Lovable app</li>
              <li>Paste the prompt into the AI chat</li>
              <li>Wait for the AI to apply all improvements</li>
              <li>Review and test your enhanced app! 🚀</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReturnToBuilder;
