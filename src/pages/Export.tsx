import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, Share2, Link, FileText, Sparkles } from "lucide-react";
import { analyzeProject, generateAICollaborationDoc } from "@/utils/projectAnalyzer";

const Export = () => {
  const [projectData, setProjectData] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [markdownDoc, setMarkdownDoc] = useState("");
  const { toast } = useToast();

  const generateComprehensiveExport = () => {
    try {
      // Analyze the current project
      const analysis = analyzeProject();
      
      // Generate AI collaboration document
      const markdown = generateAICollaborationDoc(analysis);
      setMarkdownDoc(markdown);
      
      // Also generate JSON for URL sharing
      const jsonData = JSON.stringify(analysis, null, 2);
      setProjectData(jsonData);
      
      toast({
        title: "Export generated!",
        description: "Complete AI collaboration document ready",
      });
    } catch (e) {
      toast({
        title: "Export failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const generateShareUrl = () => {
    if (!projectData.trim()) {
      toast({
        title: "No data to share",
        description: "Please paste your project JSON first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Validate JSON
      JSON.parse(projectData);
      
      // Encode the data in URL
      const encoded = btoa(encodeURIComponent(projectData));
      const url = `${window.location.origin}/import?data=${encoded}`;
      setShareUrl(url);
      
      toast({
        title: "Share URL generated!",
        description: "Copy and share this URL with anyone",
      });
    } catch (e) {
      toast({
        title: "Invalid JSON",
        description: "Please check your project data format",
        variant: "destructive",
      });
    }
  };

  const copyUrl = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Copied!",
      description: "Share URL copied to clipboard",
    });
  };

  const copyJson = async () => {
    if (!projectData) return;
    await navigator.clipboard.writeText(projectData);
    toast({
      title: "Copied!",
      description: "JSON copied to clipboard",
    });
  };

  const downloadJson = () => {
    if (!projectData) return;
    const blob = new Blob([projectData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `project-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "JSON file saved to your device",
    });
  };

  const downloadMarkdown = () => {
    if (!markdownDoc) return;
    const blob = new Blob([markdownDoc], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-collaboration-doc-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Markdown documentation saved",
    });
  };

  const copyMarkdown = async () => {
    if (!markdownDoc) return;
    await navigator.clipboard.writeText(markdownDoc);
    toast({
      title: "Copied!",
      description: "AI collaboration doc copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI Collaboration Export
          </h1>
          <p className="text-muted-foreground">
            Generate comprehensive documentation for AI assistants (ChatGPT, Claude, Lovable)
          </p>
        </div>

        {/* Quick Generate Button */}
        <Card className="p-6 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-primary mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Generate Complete Project Export</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Automatically analyze your project and generate comprehensive documentation including:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                  <li>✓ Complete tech stack and architecture</li>
                  <li>✓ Every page, route, and component</li>
                  <li>✓ All features and capabilities</li>
                  <li>✓ Code patterns and examples</li>
                  <li>✓ Development guidelines</li>
                </ul>
                <Button 
                  onClick={generateComprehensiveExport} 
                  size="lg"
                  className="gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Generate AI Collaboration Doc
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Markdown Documentation Output */}
        {markdownDoc && (
          <Card className="p-6 space-y-4 border-green-500/50 bg-green-500/5">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <FileText className="w-5 h-5" />
              <h3 className="font-semibold">AI Collaboration Document (Markdown)</h3>
            </div>
            
            <div className="space-y-2">
              <Textarea
                value={markdownDoc}
                readOnly
                className="min-h-[300px] font-mono text-xs bg-muted"
              />
              <div className="flex gap-2 flex-wrap">
                <Button onClick={copyMarkdown} className="gap-2">
                  <Copy className="w-4 h-4" />
                  Copy Markdown
                </Button>
                <Button onClick={downloadMarkdown} variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download .md File
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground space-y-1 pt-2 border-t">
              <p className="font-semibold text-foreground">How to use:</p>
              <p>1. Copy or download this markdown document</p>
              <p>2. Paste it into ChatGPT, Claude, or Lovable</p>
              <p>3. The AI will have complete context about your project</p>
              <p>4. Ask questions, request features, or get code reviews</p>
            </div>
          </Card>
        )}

        {/* JSON Data Output */}
        {projectData && (
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project JSON (for URL sharing)</label>
              <Textarea
                value={projectData}
                readOnly
                className="min-h-[200px] font-mono text-sm bg-muted"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button onClick={generateShareUrl} className="gap-2">
                <Link className="w-4 h-4" />
                Generate Share URL
              </Button>
              <Button onClick={copyJson} variant="outline" className="gap-2">
                <Copy className="w-4 h-4" />
                Copy JSON
              </Button>
              <Button onClick={downloadJson} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download JSON
              </Button>
            </div>
          </Card>
        )}

        {shareUrl && (
          <Card className="p-6 space-y-4 border-primary/50">
            <div className="flex items-center gap-2 text-primary">
              <Share2 className="w-5 h-5" />
              <h3 className="font-semibold">Your Shareable URL</h3>
            </div>
            
            <div className="space-y-2">
              <Textarea
                value={shareUrl}
                readOnly
                className="font-mono text-sm bg-muted"
                rows={3}
              />
              <Button onClick={copyUrl} className="w-full gap-2">
                <Copy className="w-4 h-4" />
                Copy Share URL
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>✓ Anyone with this URL can import your project</p>
              <p>✓ No file uploads needed - just share the link!</p>
              <p>✓ Works with any no-code platform</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Export;
