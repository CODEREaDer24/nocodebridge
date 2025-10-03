import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, ExternalLink, Download, ArrowLeft, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportPromptStepProps {
  prompt: string;
  onBack: () => void;
  onFinish: (format?: 'json' | 'zip' | 'markdown' | 'uap' | 'ai-collaboration') => void;
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
        description: "Unable to copy prompt",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">AI Export Prompt</CardTitle>
          <CardDescription>
            This is the AI collaboration prompt generated for your project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            readOnly
            value={prompt}
            className="min-h-[200px] font-mono text-sm"
          />
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <Button
          variant="outline"
          onClick={handleCopyPrompt}
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Prompt
            </>
          )}
        </Button>

        <Button
          onClick={() => onFinish("uap")}
          className="flex items-center gap-2 bg-green-500 text-white"
        >
          <Package className="w-4 h-4" />
          Export as UAP
        </Button>

        <Button
          onClick={() => onFinish("ai-collaboration")}
          className="flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Finish (AI Collaboration)
        </Button>
      </div>
    </div>
  );
};

/// FILE: src/components/ExportPromptStep.tsx
