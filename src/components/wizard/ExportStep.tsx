import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ProjectStructure } from "@/types/project";
import { Download, Copy, FileText, Package, FileJson, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportStepProps {
  project: ProjectStructure;
  onExport: (format: 'json' | 'zip' | 'markdown', data?: string) => void;
}

export const ExportStep = ({ project, onExport }: ExportStepProps) => {
  const [refinementText, setRefinementText] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyToClipboard = async () => {
    try {
      const jsonData = JSON.stringify(project, null, 2);
      await navigator.clipboard.writeText(jsonData);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Project JSON has been copied to your clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const exportOptions = [
    {
      format: 'json' as const,
      title: 'JSON Export',
      description: 'Perfect for exact duplication and re-import',
      icon: FileJson,
      color: 'bg-primary',
      benefits: ['Exact duplication', 'Perfect re-import', 'All data preserved']
    },
    {
      format: 'zip' as const,
      title: 'ZIP Package',
      description: 'Bundled export with project files',
      icon: Package,
      color: 'bg-info',
      benefits: ['Self-contained', 'Easy sharing', 'Includes metadata']
    },
    {
      format: 'markdown' as const,
      title: 'Markdown Documentation',
      description: 'Human and AI-readable format',
      icon: FileText,
      color: 'bg-success',
      benefits: ['AI collaboration', 'Human readable', 'Version control friendly']
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Export Options</CardTitle>
          <CardDescription>
            Choose your export format and optionally refine the output
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Refinement Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Optional Refinement</CardTitle>
          <CardDescription>
            Add instructions or modifications before export (AI or manual adjustments)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="e.g., 'Remove all authentication components' or 'Simplify the navigation structure'"
            value={refinementText}
            onChange={(e) => setRefinementText(e.target.value)}
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
                  onClick={() => onExport(option.format, refinementText || undefined)}
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            onClick={handleCopyToClipboard}
            className="w-full flex items-center gap-2"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy JSON to Clipboard
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};