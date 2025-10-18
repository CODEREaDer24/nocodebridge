import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, Share2, Link as LinkIcon, FileText, Sparkles, Home, Upload } from "lucide-react";
import { analyzeProject, generateAICollaborationDoc } from "@/utils/projectAnalyzer";
import { Link } from "react-router-dom";

const Export = () => {
  const [markdownContent, setMarkdownContent] = useState("");
  const [uapData, setUapData] = useState<any>(null);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();


  const copyUAP = async () => {
    if (!uapData) return;
    await navigator.clipboard.writeText(JSON.stringify(uapData, null, 2));
    toast({
      title: "Copied to clipboard!",
      description: "Builder UAP copied",
    });
  };

  const downloadUAP = () => {
    if (!uapData) return;
    const projectName = uapData.meta?.projectName || uapData.name || "project";
    const blob = new Blob([JSON.stringify(uapData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName}_AI_Ready.uap`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Markdown converted back to Builder UAP!",
      description: "UAP file saved to your device",
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'md') {
      toast({
        title: "Invalid file type",
        description: "Please upload a .md file (Markdown only)",
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);

    try {
      const text = await file.text();
      setMarkdownContent(text);

      // Extract project data from markdown (basic parser)
      const extractedData = parseMarkdownToUAP(text, file.name);
      setUapData(extractedData);

      toast({
        title: "Markdown converted back to Builder UAP!",
        description: `Successfully parsed ${file.name}`,
      });
    } catch (e) {
      toast({
        title: "Parse error",
        description: "Could not parse Markdown file",
        variant: "destructive",
      });
    }
  };

  const parseMarkdownToUAP = (markdown: string, filename: string): any => {
    // Extract project name from header
    const nameMatch = markdown.match(/# AI Collaboration Document: (.+)/);
    const projectName = nameMatch ? nameMatch[1].trim() : filename.replace('.md', '');

    // Extract pages
    const pagesSection = markdown.match(/## 📄 Pages & Routes\s+([\s\S]*?)---/);
    const pages: any[] = [];
    if (pagesSection) {
      const pageMatches = pagesSection[1].matchAll(/### (.+)\s+- \*\*Path:\*\* `(.+?)`/g);
      for (const match of pageMatches) {
        pages.push({
          name: match[1].trim(),
          path: match[2].trim(),
        });
      }
    }

    // Extract components
    const componentsSection = markdown.match(/## 🧩 Components\s+([\s\S]*?)---/);
    const components: any[] = [];
    if (componentsSection) {
      const componentMatches = componentsSection[1].matchAll(/### (.+)\s+- \*\*Type:\*\* (.+)/g);
      for (const match of componentMatches) {
        components.push({
          name: match[1].trim(),
          type: match[2].trim(),
        });
      }
    }

    return {
      meta: {
        format: "UAP",
        version: "1.0.0",
        generated_at: new Date().toISOString(),
        source: "GoNoCoMoCo / AEIOU - Markdown Import",
        projectName,
      },
      name: projectName,
      projectName,
      pages,
      components,
      description: `Imported from AI Collaboration Markdown: ${filename}`,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-start mb-4">
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="text-center space-y-2">
          <div className="inline-block px-4 py-2 bg-[hsl(var(--gono-electric-blue))]/20 border border-[hsl(var(--gono-electric-blue))]/50 rounded-full mb-2">
            <span className="text-[hsl(var(--gono-electric-blue))] font-semibold text-sm">AEIOU Flow Stage: Optimize + Upload</span>
          </div>
          <h1 className="text-4xl font-bold font-['Outfit'] bg-gradient-to-r from-[hsl(var(--gono-electric-blue))] to-[hsl(var(--gono-lime))] bg-clip-text text-transparent">
            Export Back to Builder
          </h1>
          <p className="text-lg font-['Inter']">AI Collaboration Markdown → Builder UAP</p>
          <p className="text-muted-foreground">
            Upload AI-edited .md file to convert back to .uap format
          </p>
        </div>

        {/* File Upload Section */}
        <Card className="p-6 border-[hsl(var(--gono-electric-blue))]/30 bg-gradient-to-br from-[hsl(var(--gono-electric-blue))]/5 to-transparent">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Upload className="w-6 h-6 text-[hsl(var(--gono-electric-blue))] mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Upload AI-Edited Markdown File</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload the .md file edited by ChatGPT, Claude, or Lovable AI
                </p>
                <input
                  type="file"
                  accept=".md"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-muted-foreground
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[hsl(var(--gono-electric-blue))] file:text-white
                    hover:file:bg-[hsl(var(--gono-electric-blue))]/90
                    cursor-pointer"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* UAP Output */}
        {uapData && (
          <Card className="p-6 space-y-4 border-[hsl(var(--gono-lime))]/50 bg-[hsl(var(--gono-lime))]/5">
            <div className="flex items-center gap-2 text-[hsl(var(--gono-lime))]">
              <FileText className="w-5 h-5" />
              <h3 className="font-semibold">Builder UAP (Ready for Import)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Project Name:</span>
                <p className="text-muted-foreground">{uapData.meta?.projectName || uapData.name || 'N/A'}</p>
              </div>
              <div>
                <span className="font-semibold">Components:</span>
                <p className="text-muted-foreground">
                  {uapData.pages?.length || 0} pages, {uapData.components?.length || 0} components
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">UAP JSON Preview</label>
              <Textarea
                value={JSON.stringify(uapData, null, 2)}
                readOnly
                className="min-h-[300px] font-mono text-xs bg-muted"
              />
            </div>

            <div className="flex gap-2 flex-wrap pt-4 border-t">
              <Button onClick={copyUAP} className="gap-2 bg-[hsl(var(--gono-lime))] hover:bg-[hsl(var(--gono-lime))]/90 text-black">
                <Copy className="w-4 h-4" />
                Copy UAP
              </Button>
              <Button onClick={downloadUAP} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download .uap
              </Button>
              <Button
                onClick={() => {
                  setUapData(null);
                  setMarkdownContent("");
                  setFileName("");
                }}
                variant="ghost"
              >
                Upload Another Markdown
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-1 pt-2 border-t">
              <p className="font-semibold text-foreground">Next steps:</p>
              <p>1. Download or copy the UAP file</p>
              <p>2. Import it back into Lovable or your builder</p>
              <p>3. The AI-enhanced changes are ready to use</p>
            </div>
          </Card>
        )}

        {/* No File Uploaded Message */}
        {!uapData && (
          <Card className="p-8 border-dashed border-2 border-muted-foreground/30">
            <div className="text-center space-y-4">
              <Upload className="w-16 h-16 mx-auto text-muted-foreground/50" />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Upload an AI-edited Markdown file to convert back to UAP.</h3>
                <p className="text-sm text-muted-foreground">
                  This completes the AEIOU loop: UAP → AI Markdown → Enhanced UAP
                </p>
              </div>
            </div>
          </Card>
        )}
        {/* Footer */}
        <div className="text-center py-8 border-t mt-8">
          <p className="text-muted-foreground font-['Inter'] text-sm">
            Markdown → UAP — Ready to import back into your builder
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            🚀 Powered by GoNoCoMoCo + AEIOU Framework
          </p>
        </div>
      </div>
    </div>
  );
};

export default Export;
