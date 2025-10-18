import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, Share2, Link as LinkIcon, FileText, Sparkles, Home, Upload } from "lucide-react";
import { analyzeProject, generateAICollaborationDoc } from "@/utils/projectAnalyzer";
import { Link } from "react-router-dom";

const Export = () => {
  const [projectData, setProjectData] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [markdownDoc, setMarkdownDoc] = useState("");
  const [uploadedData, setUploadedData] = useState<any>(null);
  const { toast } = useToast();


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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!['uap', 'json', 'md'].includes(fileExtension || '')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .uap, .json, or .md file",
        variant: "destructive",
      });
      return;
    }

    try {
      const text = await file.text();
      let parsedData: any = null;
      
      // Try JSON parsing first
      try {
        parsedData = JSON.parse(text);
        setUploadedData(parsedData);
        setProjectData(JSON.stringify(parsedData, null, 2));
        
        if (parsedData.summary_markdown || parsedData.summary) {
          setMarkdownDoc(parsedData.summary_markdown || parsedData.summary);
        }
      } catch (jsonError) {
        // If JSON fails, check if it's markdown with JSON block
        if (text.trim().startsWith('#') || text.includes('```json')) {
          // Extract JSON from markdown code block if present
          const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            try {
              parsedData = JSON.parse(jsonMatch[1]);
              setUploadedData(parsedData);
              setProjectData(JSON.stringify(parsedData, null, 2));
            } catch {
              // Just use markdown as-is
            }
          }
          
          // Set markdown content
          setMarkdownDoc(text);
          
          // Create minimal metadata if no JSON was extracted
          if (!parsedData) {
            setUploadedData({ 
              meta: { 
                projectName: file.name.replace(/\.(md|uap|json)$/, ''),
                generated_at: new Date().toISOString()
              }
            });
          }
        } else {
          throw new Error("Invalid file format");
        }
      }

      toast({
        title: "File uploaded!",
        description: `Successfully parsed ${file.name}`,
      });
    } catch (e) {
      toast({
        title: "Invalid file format",
        description: "Could not parse file. Please upload a valid .uap, .json, or .md file.",
        variant: "destructive",
      });
    }
  };

  const downloadUAP = () => {
    if (!uploadedData && !projectData) return;
    
    const data = uploadedData || JSON.parse(projectData);
    const uapData = {
      meta: {
        format: "UAP",
        version: "1.0.0",
        generated_at: new Date().toISOString(),
        source: "GoNoCoMoCo / AEIOU",
        ...data.meta
      },
      ...data
    };

    const blob = new Blob([JSON.stringify(uapData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export-${Date.now()}.uap`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "UAP file saved to your device",
    });
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
          <div className="inline-block px-4 py-2 bg-[hsl(var(--gono-blue))]/20 border border-[hsl(var(--gono-blue))]/50 rounded-full mb-2">
            <span className="text-[hsl(var(--gono-blue))] font-semibold text-sm">AEIOU Flow Stage: Extract + Optimize</span>
          </div>
          <h1 className="text-4xl font-bold font-['Outfit'] bg-gradient-to-r from-[hsl(var(--gono-blue))] to-[hsl(var(--gono-lime))] bg-clip-text text-transparent">
            Export & Analyze (UAP / JSON / MD)
          </h1>
          <p className="text-lg font-['Inter']">GoNoCoMoCo AEIOU Framework</p>
          <p className="text-muted-foreground">
            Upload Extractor File (.uap, .json, or .md) — exported from your app
          </p>
        </div>

        {/* File Upload Section */}
        <Card className="p-6 border-[hsl(var(--gono-blue))]/30 bg-gradient-to-br from-[hsl(var(--gono-blue))]/5 to-transparent">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Upload className="w-6 h-6 text-[hsl(var(--gono-blue))] mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Upload Exported Project File</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a .uap, .json, or .md file exported from your app's Extractor Tool
                </p>
                <input
                  type="file"
                  accept=".uap,.json,.md"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-muted-foreground
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[hsl(var(--gono-blue))] file:text-white
                    hover:file:bg-[hsl(var(--gono-blue))]/90
                    cursor-pointer"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Uploaded Data Summary */}
        {uploadedData && (
          <Card className="p-6 space-y-4 border-[hsl(var(--gono-lime))]/50 bg-[hsl(var(--gono-lime))]/5">
            <div className="flex items-center gap-2 text-[hsl(var(--gono-lime))]">
              <FileText className="w-5 h-5" />
              <h3 className="font-semibold">Project Summary</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Project Name:</span>
                <p className="text-muted-foreground">{uploadedData.meta?.projectName || uploadedData.projectName || 'N/A'}</p>
              </div>
              <div>
                <span className="font-semibold">Domain / URL:</span>
                <p className="text-muted-foreground">{uploadedData.meta?.domain || uploadedData.domain || 'N/A'}</p>
              </div>
              <div>
                <span className="font-semibold">Description:</span>
                <p className="text-muted-foreground">{uploadedData.meta?.description || uploadedData.description || 'N/A'}</p>
              </div>
              <div>
                <span className="font-semibold">Pages & Components:</span>
                <p className="text-muted-foreground">
                  {uploadedData.pages?.length || 0} pages, {uploadedData.components?.length || 0} components
                </p>
              </div>
              <div>
                <span className="font-semibold">Exported Date:</span>
                <p className="text-muted-foreground">
                  {uploadedData.meta?.generated_at || uploadedData.exported_at || uploadedData.meta?.exportedAt || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap pt-4 border-t">
              <Button onClick={copyMarkdown} className="gap-2">
                <Copy className="w-4 h-4" />
                Copy Summary
              </Button>
              <Button onClick={downloadUAP} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download UAP
              </Button>
            </div>
          </Card>
        )}

        {/* No File Uploaded Message */}
        {!uploadedData && !markdownDoc && (
          <Card className="p-8 border-dashed border-2 border-muted-foreground/30">
            <div className="text-center space-y-4">
              <Upload className="w-16 h-16 mx-auto text-muted-foreground/50" />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Upload a UAP, JSON, or Markdown file from another app to begin.</h3>
                <p className="text-sm text-muted-foreground">
                  This page processes external app data only. To export NoCodeBridge itself, visit the Self-Extractor page.
                </p>
              </div>
            </div>
          </Card>
        )}

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
                <LinkIcon className="w-4 h-4" />
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
        {/* Footer */}
        <div className="text-center py-8 border-t mt-8">
          <p className="text-muted-foreground font-['Inter'] text-sm">
            🚀 Powered by GoNoCoMoCo + AEIOU Framework
          </p>
        </div>
      </div>
    </div>
  );
};

export default Export;
