import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, Home, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { analyzeProject, generateAICollaborationDoc } from "@/utils/projectAnalyzer";

const SelfExport = () => {
  const [uapData, setUapData] = useState("");
  const [markdownData, setMarkdownData] = useState("");
  const [jsonData, setJsonData] = useState("");
  const { toast } = useToast();

  const generateUAP = () => {
    try {
      const analysis = analyzeProject();
      
      const uap = {
        meta: {
          format: "UAP",
          version: "1.0.0",
          generated_at: new Date().toISOString(),
          source: "GoNoCoMoCo",
          notes: "UAP package — single file, no compression"
        },
        summary_markdown: generateAICollaborationDoc(analysis),
        tech_stack: {
          framework: "React",
          language: "TypeScript",
          styling: "Tailwind CSS",
          builder: "Lovable",
          dependencies: analysis.dependencies || []
        },
        pages: analysis.pages || [],
        components: analysis.components || [],
        data_models: [],
        workflows: [],
        assets: [],
        diff: {},
        change_log: [],
        hash: `sha256_${Date.now()}`
      };
      
      setUapData(JSON.stringify(uap, null, 2));
      toast({
        title: "UAP Generated",
        description: "Universal App Package ready for export",
      });
    } catch (e) {
      toast({
        title: "Generation failed",
        description: "Unable to generate UAP",
        variant: "destructive",
      });
    }
  };

  const generateMarkdown = () => {
    try {
      const analysis = analyzeProject();
      const markdown = generateAICollaborationDoc(analysis);
      setMarkdownData(markdown);
      
      toast({
        title: "Markdown Generated",
        description: "Documentation ready for export",
      });
    } catch (e) {
      toast({
        title: "Generation failed",
        description: "Unable to generate markdown",
        variant: "destructive",
      });
    }
  };

  const generateJSON = () => {
    try {
      const analysis = analyzeProject();
      setJsonData(JSON.stringify(analysis, null, 2));
      
      toast({
        title: "JSON Generated",
        description: "Project data ready for export",
      });
    } catch (e) {
      toast({
        title: "Generation failed",
        description: "Unable to generate JSON",
        variant: "destructive",
      });
    }
  };

  const copyData = async (data: string, type: string) => {
    if (!data) return;
    await navigator.clipboard.writeText(data);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const downloadData = (data: string, filename: string, type: string) => {
    if (!data) return;
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `${filename} saved to your device`,
    });
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,hsl(var(--gono-navy)),hsl(var(--gono-blue)))] p-8 relative overflow-hidden">
      {/* Circuit background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-[hsl(var(--gono-lime))] rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-[hsl(var(--gono-blue))] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Navigation */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--gono-coral))]/20 border border-[hsl(var(--gono-coral))]/50 rounded-full mb-4">
            <Lock className="w-4 h-4 text-[hsl(var(--gono-coral))]" />
            <span className="text-[hsl(var(--gono-coral))] font-semibold text-sm">PRIVATE ACCESS</span>
          </div>
          <h1 className="text-4xl font-['Outfit'] font-bold text-white mb-2">
            Internal GoNoCoMoCo Exporter
          </h1>
          <p className="text-white/70 font-['Inter']">
            Private Use Only — Export NoCodeBridge Core
          </p>
        </div>

        {/* Export Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button 
            onClick={generateUAP}
            className="h-20 bg-[hsl(var(--gono-blue))] hover:bg-[hsl(var(--gono-blue))]/90 text-white shadow-[0_0_20px_hsl(var(--gono-blue))/0.3] hover:shadow-[0_0_30px_hsl(var(--gono-blue))/0.5] transition-all"
          >
            <div className="text-center">
              <div className="text-lg font-bold">Export UAP</div>
              <div className="text-xs opacity-80">Universal App Package</div>
            </div>
          </Button>
          
          <Button 
            onClick={generateMarkdown}
            className="h-20 bg-[hsl(var(--gono-lime))] hover:bg-[hsl(var(--gono-lime))]/90 text-black shadow-[0_0_20px_hsl(var(--gono-lime))/0.3] hover:shadow-[0_0_30px_hsl(var(--gono-lime))/0.5] transition-all"
          >
            <div className="text-center">
              <div className="text-lg font-bold">Export Markdown</div>
              <div className="text-xs opacity-80">Human-readable docs</div>
            </div>
          </Button>
          
          <Button 
            onClick={generateJSON}
            className="h-20 bg-[hsl(var(--gono-coral))] hover:bg-[hsl(var(--gono-coral))]/90 text-white shadow-[0_0_20px_hsl(var(--gono-coral))/0.3] hover:shadow-[0_0_30px_hsl(var(--gono-coral))/0.5] transition-all"
          >
            <div className="text-center">
              <div className="text-lg font-bold">Export JSON</div>
              <div className="text-xs opacity-80">Raw project data</div>
            </div>
          </Button>
        </div>

        {/* UAP Output */}
        {uapData && (
          <Card className="mb-6 bg-card/80 backdrop-blur-sm border-[hsl(var(--gono-blue))]/50">
            <CardHeader>
              <CardTitle className="font-['Outfit']">UAP Export</CardTitle>
              <CardDescription>Universal App Package (JSON format)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={uapData}
                readOnly
                className="min-h-[300px] font-mono text-xs"
              />
              <div className="flex gap-2">
                <Button onClick={() => copyData(uapData, "UAP")} className="gap-2">
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
                <Button 
                  onClick={() => downloadData(uapData, `nocodebridge-${Date.now()}.uap`, "application/json")}
                  variant="outline" 
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download .uap
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Markdown Output */}
        {markdownData && (
          <Card className="mb-6 bg-card/80 backdrop-blur-sm border-[hsl(var(--gono-lime))]/50">
            <CardHeader>
              <CardTitle className="font-['Outfit']">Markdown Export</CardTitle>
              <CardDescription>Human-readable documentation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={markdownData}
                readOnly
                className="min-h-[300px] font-mono text-xs"
              />
              <div className="flex gap-2">
                <Button onClick={() => copyData(markdownData, "Markdown")} className="gap-2">
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
                <Button 
                  onClick={() => downloadData(markdownData, `nocodebridge-${Date.now()}.md`, "text/markdown")}
                  variant="outline" 
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download .md
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* JSON Output */}
        {jsonData && (
          <Card className="mb-6 bg-card/80 backdrop-blur-sm border-[hsl(var(--gono-coral))]/50">
            <CardHeader>
              <CardTitle className="font-['Outfit']">JSON Export</CardTitle>
              <CardDescription>Raw project data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={jsonData}
                readOnly
                className="min-h-[300px] font-mono text-xs"
              />
              <div className="flex gap-2">
                <Button onClick={() => copyData(jsonData, "JSON")} className="gap-2">
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
                <Button 
                  onClick={() => downloadData(jsonData, `nocodebridge-${Date.now()}.json`, "application/json")}
                  variant="outline" 
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download .json
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/10">
          <p className="text-white/70 font-['Inter'] text-sm">
            🚀 GoNoCoMoCo | Powered by AEIOU Framework
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelfExport;
