import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, ExternalLink, Download, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportPromptStepProps {
  prompt: string;
  onBack: () => void;
  onFinish: () => void;
}

export const ExportPromptStep = ({ prompt, onBack, onFinish }: ExportPromptStepProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Prompt has been copied to your clipboard",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPrompt = () => {
    const blob = new Blob([prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lovable-prompt-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: "Prompt has been downloaded as a text file",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <CheckCircle className="w-6 h-6 text-success" />
            Ready to Copy
          </CardTitle>
          <CardDescription>
            Your project is now ready as a Lovable-friendly prompt
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Instructions Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-success/10 border-primary">
        <CardHeader>
          <CardTitle className="text-lg">Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Copy the prompt below using the <Badge variant="outline">Copy Prompt</Badge> button</li>
            <li>Open Lovable in a new tab or window</li>
            <li>Create a new project or open an existing one</li>
            <li>Paste this prompt into Lovable's chat box</li>
            <li>Let Lovable rebuild your project with all the structure and features</li>
          </ol>
        </CardContent>
      </Card>

      {/* Prompt Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lovable Prompt</CardTitle>
          <CardDescription>
            This prompt contains all your project details in a format Lovable understands
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={prompt}
            readOnly
            className="min-h-[400px] font-mono text-sm"
          />
          
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleCopyPrompt}
              size="lg"
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Prompt
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleDownloadPrompt}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download as File
            </Button>
            
            <Button 
              asChild
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-5 h-5" />
                Open Lovable
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      <Card className="border-success bg-success/5">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <CheckCircle className="w-12 h-12 text-success mx-auto" />
            <h3 className="text-lg font-semibold">Import Process Complete!</h3>
            <p className="text-muted-foreground">
              Your project has been successfully converted to a Lovable prompt. 
              Copy it and paste into Lovable to rebuild your project.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Refinement
        </Button>
        
        <Button 
          onClick={onFinish}
          className="flex items-center gap-2"
        >
          Finish
          <CheckCircle className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};