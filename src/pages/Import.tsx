import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Upload, Copy, ArrowLeft, Download, ExternalLink } from "lucide-react";
import { generateAICollabMarkdown } from "@/utils/aiCollabExport";

const Import = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projectData, setProjectData] = useState<any>(null);
  const [markdownDoc, setMarkdownDoc] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (fileExtension !== '.uap') {
      toast({
        title: "Invalid file type",
        description: "Please upload a .uap file (UAP format only)",
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);

    try {
      const content = await file.text();
      const parsed = JSON.parse(content);
      setProjectData(parsed);

      // Generate AI Collaboration Markdown
      const markdown = generateAICollabMarkdown(parsed);
      setMarkdownDoc(markdown);

      toast({
        title: "UAP converted to AI Collaboration Markdown!",
        description: `Successfully imported ${file.name}`,
      });
    } catch (e) {
      toast({
        title: "Parse error",
        description: "Could not read or parse the UAP file",
        variant: "destructive",
      });
    }
  };

  const copyMarkdown = async () => {
    if (!markdownDoc) return;
    await navigator.clipboard.writeText(markdownDoc);
    toast({
      title: "Copied to clipboard!",
      description: "AI Collaboration Markdown copied",
    });
  };

  const downloadMarkdown = () => {
    if (!markdownDoc || !projectData) return;
    const projectName = projectData.meta?.projectName || projectData.name || "project";
    const blob = new Blob([markdownDoc], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName}_AI_Collaboration_Summary.md`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Markdown file saved to your device",
    });
  };

  const launchChatGPT = () => {
    if (!markdownDoc) return;
    const chatGPTUrl = `https://chat.openai.com/`;
    window.open(chatGPTUrl, '_blank');
    toast({
      title: "Opening ChatGPT...",
      description: "Paste the markdown from your clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--gono-navy))] flex items-center justify-center p-6">
      <Card className="p-8 max-w-4xl w-full space-y-6 bg-background/95 border-[hsl(var(--gono-electric-blue))]/30">
        {/* Header */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-4xl font-bold font-['Outfit'] bg-gradient-to-r from-[hsl(var(--gono-electric-blue))] to-[hsl(var(--gono-lime))] bg-clip-text text-transparent">
            Import UAP (From Extractor)
          </h1>
          <p className="text-muted-foreground font-['Inter']">
            Imported UAP → AI Collaboration Summary
          </p>
          <p className="text-sm text-muted-foreground font-['Inter']">
            Upload .uap file to convert into AI-ready Markdown documentation
          </p>
        </div>

        {/* Upload Section */}
        {!projectData && (
          <div className="border-2 border-dashed border-[hsl(var(--gono-electric-blue))]/30 rounded-lg p-12 text-center space-y-4">
            <Upload className="w-16 h-16 text-[hsl(var(--gono-electric-blue))] mx-auto" />
            <div>
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-lg font-semibold text-[hsl(var(--gono-electric-blue))]">
                  Click to upload UAP file
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  .uap files only (exported from Extractor)
                </p>
              </label>
              <Input
                id="file-upload"
                type="file"
                accept=".uap"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* AI Collaboration Markdown Output */}
        {projectData && markdownDoc && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-['Outfit'] text-[hsl(var(--gono-lime))]">
                AI Collaboration Summary (Markdown)
              </h2>
            </div>

            {/* Metadata Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectData.meta?.projectName || projectData.name ? (
                <Card className="p-4 bg-muted/50 border-[hsl(var(--gono-lime))]/30">
                  <p className="text-sm text-muted-foreground">Project Name</p>
                  <p className="text-lg font-semibold">{projectData.meta?.projectName || projectData.name}</p>
                </Card>
              ) : null}
              
              {projectData.meta?.domain || projectData.domain ? (
                <Card className="p-4 bg-muted/50 border-[hsl(var(--gono-lime))]/30">
                  <p className="text-sm text-muted-foreground">Domain / URL</p>
                  <p className="text-lg font-semibold">{projectData.meta?.domain || projectData.domain}</p>
                </Card>
              ) : null}
              
              {projectData.meta?.generated_at || projectData.exported_at ? (
                <Card className="p-4 bg-muted/50 border-[hsl(var(--gono-lime))]/30">
                  <p className="text-sm text-muted-foreground">Exported Date</p>
                  <p className="text-lg font-semibold">
                    {new Date(projectData.meta?.generated_at || projectData.exported_at).toLocaleString()}
                  </p>
                </Card>
              ) : null}
              
              {projectData.pages || projectData.components ? (
                <Card className="p-4 bg-muted/50 border-[hsl(var(--gono-lime))]/30">
                  <p className="text-sm text-muted-foreground">Components</p>
                  <p className="text-lg font-semibold">
                    {projectData.pages?.length || 0} pages, {projectData.components?.length || 0} components
                  </p>
                </Card>
              ) : null}
            </div>

            {/* Markdown Preview */}
            <Card className="p-6 space-y-4 border-[hsl(var(--gono-lime))]/50 bg-[hsl(var(--gono-lime))]/5">
              <p className="text-sm text-muted-foreground mb-3 font-semibold">AI Collaboration Document</p>
              <ScrollArea className="h-[400px] w-full rounded border bg-background p-4">
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  {markdownDoc}
                </pre>
              </ScrollArea>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <Button onClick={copyMarkdown} className="gap-2 bg-[hsl(var(--gono-lime))] hover:bg-[hsl(var(--gono-lime))]/90 text-black">
                <Copy className="w-4 h-4" />
                Copy Markdown
              </Button>
              <Button onClick={downloadMarkdown} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download .md
              </Button>
              <Button onClick={launchChatGPT} variant="outline" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                Launch in ChatGPT
              </Button>
              <Button
                onClick={() => {
                  setProjectData(null);
                  setMarkdownDoc("");
                  setFileName("");
                }}
                variant="ghost"
              >
                Upload Another UAP
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-6 border-t border-border/50">
          <p className="text-sm text-muted-foreground font-['Inter']">
            UAP → AI Collaboration Markdown — Ready for ChatGPT, Claude, or Lovable AI
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            🚀 Powered by GoNoCoMoCo + AEIOU Framework
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Import;
