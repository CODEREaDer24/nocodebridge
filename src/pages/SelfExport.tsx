import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Copy, Download, ArrowLeft, FileText, Code2, FileJson } from "lucide-react";
import { Link } from "react-router-dom";
import { analyzeProject } from "@/utils/projectToAnalysis";
import { AI_READING_GUIDE, generateAICollaborationDoc } from "@/utils/uapGenerator";

const SelfExport = () => {
  const [uapData, setUapData] = useState("");
  const [markdownData, setMarkdownData] = useState("");
  const [jsonData, setJsonData] = useState("");
  const [projectName, setProjectName] = useState("nocodebridge");

  const generateUAP = () => {
    try {
      const analysis = analyzeProject();
      const markdown = generateAICollaborationDoc(analysis);
      const name = analysis.name || "nocodebridge";
      setProjectName(name);
      
      const uap = {
        meta: {
          format: "UAP",
          version: "2.0",
          source: "NoCodeBridge AEIOU",
          timestamp: new Date().toISOString(),
          instructions: AI_READING_GUIDE
        },
        schema: {
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
          assets: []
        },
        markdown: markdown,
        diff: {},
        improvements: []
      };
      
      setUapData(JSON.stringify(uap, null, 2));
      toast.success("✅ UAP v2.0 Generated");
    } catch (e) {
      toast.error("❌ Failed to generate UAP");
      console.error(e);
    }
  };

  const generateMarkdown = () => {
    try {
      const analysis = analyzeProject();
      const markdown = generateAICollaborationDoc(analysis);
      setMarkdownData(markdown);
      toast.success("✅ Markdown Generated");
    } catch (e) {
      toast.error("❌ Failed to generate Markdown");
      console.error(e);
    }
  };

  const generateJSON = () => {
    try {
      const analysis = analyzeProject();
      setJsonData(JSON.stringify(analysis, null, 2));
      toast.success("✅ JSON Generated");
    } catch (e) {
      toast.error("❌ Failed to generate JSON");
      console.error(e);
    }
  };

  const copyData = async (data: string, type: string) => {
    if (!data) {
      toast.error("No data to copy");
      return;
    }
    await navigator.clipboard.writeText(data);
    toast.success(`📋 ${type} copied to clipboard!`);
  };

  const downloadData = (data: string, filename: string, type: string) => {
    if (!data) {
      toast.error("No data to download");
      return;
    }
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`💾 ${filename} downloaded!`);
  };

  const copyAIInstructions = () => {
    navigator.clipboard.writeText(AI_READING_GUIDE);
    toast.success("📋 AI Reading Guide copied!");
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Navigation */}
        <div className="mb-8">
          <Link to="/bridge">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Bridge
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400 mb-2">
            🧱 NoCodeBridge Self-Exporter
          </h1>
          <p className="text-xl text-cyan-400 mb-2">
            AEIOU Bridge v2.0
          </p>
          <p className="text-gray-400">
            Generate UAP v2.0 • All conversions run locally • Zero credits
          </p>
        </div>

        {/* Export Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button 
            onClick={generateUAP}
            className="h-20 bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all"
          >
            <div className="text-center">
              <div className="text-lg font-bold">Generate .UAP File</div>
              <div className="text-xs opacity-80">Universal App Package v2.0</div>
            </div>
          </Button>
          
          <Button 
            onClick={generateMarkdown}
            className="h-20 bg-cyan-600 hover:bg-cyan-700 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all"
          >
            <div className="text-center">
              <div className="text-lg font-bold">Download .Markdown</div>
              <div className="text-xs opacity-80">Human-readable docs</div>
            </div>
          </Button>
          
          <Button 
            onClick={generateJSON}
            className="h-20 bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all"
          >
            <div className="text-center">
              <div className="text-lg font-bold">Download .JSON</div>
              <div className="text-xs opacity-80">Raw schema data</div>
            </div>
          </Button>
        </div>

        {/* AI Reading Guide */}
        <Card className="mb-6 bg-[#111826]/80 backdrop-blur-sm border-yellow-500/50">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              AI Reading Guide (Embedded in UAP)
            </CardTitle>
            <CardDescription className="text-gray-400">
              Copy this to send with your UAP to any AI tool
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="text-xs text-gray-300 bg-black/30 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
{AI_READING_GUIDE}
            </pre>
            <Button onClick={copyAIInstructions} className="gap-2 bg-yellow-600 hover:bg-yellow-700">
              <Copy className="w-4 h-4" />
              Copy AI Instruction Block
            </Button>
          </CardContent>
        </Card>

        {/* UAP Output */}
        {uapData && (
          <Card className="mb-6 bg-[#111826]/80 backdrop-blur-sm border-blue-500/50">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                UAP v2.0 Export
              </CardTitle>
              <CardDescription className="text-gray-400">
                Universal App Package with embedded AI instructions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={uapData}
                readOnly
                className="min-h-[300px] font-mono text-xs bg-black/30 text-blue-100"
              />
              <div className="flex gap-2">
                <Button onClick={() => copyData(uapData, "UAP")} className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
                <Button 
                  onClick={() => downloadData(uapData, `${projectName}-uap-v2.0.uap`, "application/json")}
                  variant="outline" 
                  className="gap-2 border-blue-500 text-blue-400 hover:bg-blue-500/20"
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
          <Card className="mb-6 bg-[#111826]/80 backdrop-blur-sm border-cyan-500/50">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Markdown Export
              </CardTitle>
              <CardDescription className="text-gray-400">
                Human-readable documentation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={markdownData}
                readOnly
                className="min-h-[300px] font-mono text-xs bg-black/30 text-cyan-100"
              />
              <div className="flex gap-2">
                <Button onClick={() => copyData(markdownData, "Markdown")} className="gap-2 bg-cyan-600 hover:bg-cyan-700">
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
                <Button 
                  onClick={() => downloadData(markdownData, `${projectName}-export.md`, "text/markdown")}
                  variant="outline" 
                  className="gap-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/20"
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
          <Card className="mb-6 bg-[#111826]/80 backdrop-blur-sm border-purple-500/50">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <FileJson className="w-5 h-5" />
                JSON Export
              </CardTitle>
              <CardDescription className="text-gray-400">
                Raw project schema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={jsonData}
                readOnly
                className="min-h-[300px] font-mono text-xs bg-black/30 text-purple-100"
              />
              <div className="flex gap-2">
                <Button onClick={() => copyData(jsonData, "JSON")} className="gap-2 bg-purple-600 hover:bg-purple-700">
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
                <Button 
                  onClick={() => downloadData(jsonData, `${projectName}-schema.json`, "application/json")}
                  variant="outline" 
                  className="gap-2 border-purple-500 text-purple-400 hover:bg-purple-500/20"
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
          <p className="text-gray-400 text-sm">
            🚀 NoCodeBridge 2.0 | AEIOU Framework
          </p>
          <p className="text-gray-500 text-xs mt-2">
            All conversions run locally • Zero API calls • Zero credits
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelfExport;
