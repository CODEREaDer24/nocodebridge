import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ProjectStructure } from "@/types/project";
import { Download, Copy, FileText, Package, FileJson, CheckCircle, Network } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportPromptStepProps {
  project: ProjectStructure;
  onExport: (format: 'json' | 'zip' | 'markdown' | 'uap' | 'ai-collaboration', data?: string) => void;
}

export const ExportPromptStep = ({ project, onExport }: ExportPromptStepProps) => {
  const [promptText, setPromptText] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyPrompt = async () => {
    try {
      const exportData = JSON.stringify(project, null, 2);
      await navigator.clipboard.writeText(exportData);
      setCopied(true);
      toast({
        title: "Copied",
        description: "Export JSON copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy export JSON",
        variant: "destructive",
      });
    }
  };

  const exportOptions = [
    {
      format: 'ai-collaboration' as const,
      title: 'AI Collaboration',
      description: 'Package ready for ChatGPT, Claude, or other AI assistants',
      icon: FileText,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      benefits: ['Optimized for AI', 'Full source code', 'Easy debugging'],
      disabled: false
    },
    {
      format: 'json' as const,
      title: 'JSON Export',
      description: 'Full JSON snapshot for duplication and re-import',
      icon: FileJson,
      color: 'bg-primary',
      benefits: ['Exact re-import', 'All state preserved'],
      disabled: false
    },
    {
      format: 'zip' as const,
      title: 'ZIP Bundle',
      description: 'Bundle of all files for manual sharing',
      icon: Package,
      color: 'bg-secondary',
      benefits: ['All files included', 'Docs + code'],
      disabled: false
    },
    {
      format: 'markdown' as const,
      title: 'Markdown Export',
      description: 'Readable documentation export',
      icon: FileText,
      color: 'bg-accent',
      benefits: ['Readable docs', 'Version control friendly'],
      disabled: false
    },
    {
      format: 'uap' as const,
      title: 'UAP Export',
      description: 'Universal App Profile - bridge JSON + metadata',
      icon: Network,
      color: 'bg-green-500',
      benefits: ['Universal schema', 'Works with NoCodeBridge', 'AI + human readable'],
      disabled: false   // 👈 Enabled now
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Export Your Project</CardTitle>
          <CardDescription>
            Choose an export format or copy JSON directly
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Prompt Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Optional Instructions</CardTitle>
          <CardDescription>
            Add notes or modifications for this export
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="e.g. Remove demo data, simplify auth, optimize routes"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="grid gap-4">
        {exportOptions.map((option) => (
          <Card key={option.format} className="relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${option.color}`} />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${option.color} text-white`}>
                    <option.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{option.title}</h3>
                    <p className="text-muted-foreground">{option.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {option.benefits.map((benefit, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => onExport(option.format, promptText || undefined)}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export {option.format.toUpperCase()}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Copy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Copy</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            onClick={handleCopyPrompt}
            className="w-full flex items-center gap-2"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy JSON
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

/// FILE: src/components/wizard/ExportPromptStep.tsx
