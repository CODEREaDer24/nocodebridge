import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Upload, Copy, ArrowLeft, Download, ExternalLink } from "lucide-react";
import { generateAICollabMarkdown } from "@/utils/aiCollabExport";

const Bridge = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [output, setOutput] = useState("");
  const [isMarkdown, setIsMarkdown] = useState(false);
  const [fileName, setFileName] = useState("");
  const [projectName, setProjectName] = useState("");

  const parseUAP = (fileText: string, filename: string) => {
    try {
      const json = JSON.parse(fileText);
      const markdown = generateAICollabMarkdown(json);
      const name = json.meta?.projectName || json.projectName || json.name || filename.replace(/\.(uap|json)$/, '');
      return { markdown, name };
    } catch {
      throw new Error("Invalid or unreadable UAP file");
    }
  };

  const convertMarkdownToUAP = (text: string, filename: string) => {
    const nameMatch = text.match(/^# AI Collaboration Document: (.+)$/m) || text.match(/^# (.+)$/m);
    const name = nameMatch ? nameMatch[1].trim() : filename.replace('.md', '');

    // Extract pages
    const pagesSection = text.match(/## 📄 Pages & Routes\s+([\s\S]*?)(?:---|##|$)/);
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
    const componentsSection = text.match(/## 🧩 Components\s+([\s\S]*?)(?:---|##|$)/);
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

    return JSON.stringify(
      {
        meta: {
          format: "UAP",
          version: "1.0.0",
          generated_at: new Date().toISOString(),
          source: "GoNoCoMoCo / AEIOU Bridge",
          projectName: name,
        },
        name,
        projectName: name,
        pages,
        components,
        description: `Imported from AI Collaboration Markdown: ${filename}`,
      },
      null,
      2
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const text = await file.text();

    try {
      if (fileExtension === '.uap' || fileExtension === '.json') {
        const { markdown, name } = parseUAP(text, file.name);
        setOutput(markdown);
        setIsMarkdown(true);
        setFileName(name);
        setProjectName(name);
        toast({
          title: "UAP converted to Markdown!",
          description: `Successfully converted ${file.name}`,
        });
      } else if (fileExtension === '.md') {
        const json = convertMarkdownToUAP(text, file.name);
        const parsed = JSON.parse(json);
        setOutput(json);
        setIsMarkdown(false);
        setFileName(file.name.replace('.md', ''));
        setProjectName(parsed.projectName);
        toast({
          title: "Markdown converted to UAP!",
          description: `Successfully converted ${file.name}`,
        });
      } else {
        throw new Error("Unsupported file type. Please upload .uap, .json, or .md files.");
      }
    } catch (err: any) {
      toast({
        title: "Conversion error",
        description: err.message || "Could not parse file",
        variant: "destructive",
      });
      setOutput("");
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast({
      title: "Copied to clipboard!",
      description: isMarkdown ? "Markdown copied" : "UAP JSON copied",
    });
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], {
      type: isMarkdown ? "text/markdown" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = isMarkdown
      ? `${projectName || fileName || "Export"}_AI_Collaboration_Summary.md`
      : `${projectName || fileName || "AI_Ready"}_AI_Ready.uap`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: `File saved to your device`,
    });
  };

  const launchChatGPT = () => {
    if (!output || !isMarkdown) return;
    window.open('https://chat.openai.com/', '_blank');
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
            🧠 AEIOU Bridge
          </h1>
          <p className="text-lg text-muted-foreground font-['Inter']">
            Smart UAP ↔ Markdown Converter
          </p>
          <p className="text-sm text-muted-foreground font-['Inter']">
            Drop in a <span className="font-semibold text-[hsl(var(--gono-electric-blue))]">.uap</span> to get Markdown for ChatGPT, or drop in a <span className="font-semibold text-[hsl(var(--gono-lime))]">.md</span> to get a Builder-ready <span className="font-semibold text-[hsl(var(--gono-electric-blue))]">.uap</span>.
          </p>
          <div className="inline-block px-3 py-1 bg-[hsl(var(--gono-lime))]/20 border border-[hsl(var(--gono-lime))]/50 rounded-full">
            <span className="text-[hsl(var(--gono-lime))] font-semibold text-xs">💯 100% Local — Zero Credits Used</span>
          </div>
        </div>

        {/* Upload Section */}
        {!output && (
          <div className="border-2 border-dashed border-[hsl(var(--gono-electric-blue))]/30 rounded-lg p-12 text-center space-y-4">
            <Upload className="w-16 h-16 text-[hsl(var(--gono-electric-blue))] mx-auto" />
            <div>
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-lg font-semibold text-[hsl(var(--gono-electric-blue))]">
                  Click to upload file
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Accepts .uap, .json, or .md files
                </p>
              </label>
              <Input
                id="file-upload"
                type="file"
                accept=".uap,.json,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* Output Section */}
        {output && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-['Outfit'] text-[hsl(var(--gono-lime))]">
                {isMarkdown ? "AI Collaboration Markdown" : "Builder UAP (JSON)"}
              </h2>
            </div>

            {/* Metadata Card */}
            {projectName && (
              <Card className="p-4 bg-muted/50 border-[hsl(var(--gono-lime))]/30">
                <p className="text-sm text-muted-foreground">Project Name</p>
                <p className="text-lg font-semibold">{projectName}</p>
              </Card>
            )}

            {/* Preview */}
            <Card className="p-6 space-y-4 border-[hsl(var(--gono-lime))]/50 bg-[hsl(var(--gono-lime))]/5">
              <p className="text-sm text-muted-foreground mb-3 font-semibold">
                {isMarkdown ? "Markdown Preview" : "UAP JSON Preview"}
              </p>
              <ScrollArea className="h-[400px] w-full rounded border bg-background p-4">
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  {output}
                </pre>
              </ScrollArea>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <Button onClick={handleCopy} className="gap-2 bg-[hsl(var(--gono-lime))] hover:bg-[hsl(var(--gono-lime))]/90 text-black">
                <Copy className="w-4 h-4" />
                Copy Output
              </Button>
              <Button onClick={handleDownload} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download {isMarkdown ? ".md" : ".uap"}
              </Button>
              {isMarkdown && (
                <Button onClick={launchChatGPT} variant="outline" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Open in ChatGPT
                </Button>
              )}
              <Button
                onClick={() => {
                  setOutput("");
                  setFileName("");
                  setProjectName("");
                }}
                variant="ghost"
              >
                Convert Another File
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-6 border-t border-border/50">
          <p className="text-sm text-muted-foreground font-['Inter']">
            One-step tool for moving your app data between Lovable, ChatGPT, and back again.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            🚀 Powered by GoNoCoMoCo + AEIOU Framework
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Bridge;
