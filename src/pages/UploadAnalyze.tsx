import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Upload, Copy, Download, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveAs } from "file-saver";
import JSZip from "jszip";

const UploadAnalyze = () => {
  const [file, setFile] = useState<any>(null);
  const [uapData, setUapData] = useState<string>("");
  const [schemaData, setSchemaData] = useState<string>("");
  const [reportData, setReportData] = useState<string>("");
  const [copiedTab, setCopiedTab] = useState<string>("");
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const text = await uploadedFile.text();

    // Parse based on file type
    try {
      let parsed = text;
      if (uploadedFile.name.endsWith('.json') || uploadedFile.name.endsWith('.uap')) {
        parsed = JSON.stringify(JSON.parse(text), null, 2);
      }

      setUapData(parsed);
      setSchemaData(parsed);
      
      // Generate markdown report
      const report = generateReport(parsed);
      setReportData(report);

      toast({
        title: "File uploaded!",
        description: `Parsed ${uploadedFile.name} successfully`,
      });
    } catch (error) {
      toast({
        title: "Parse error",
        description: "Could not parse the uploaded file",
        variant: "destructive",
      });
    }
  };

  const generateReport = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      const project = parsed.project || {};
      
      return `# NoCodeBridge Analysis Report

**Generated:** ${new Date().toISOString()}

## Project Overview
- **Name:** ${project.name || 'Unknown'}
- **Pages:** ${project.pages?.length || 0}
- **Components:** ${project.components?.length || 0}
- **Data Models:** ${project.data_models?.length || 0}

## Structure
${JSON.stringify(project, null, 2)}

---
*Exported via NoCodeBridge AEIOU v3.0*
`;
    } catch {
      return "# Analysis Report\n\nCould not generate report from uploaded data.";
    }
  };

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedTab(label);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
    setTimeout(() => setCopiedTab(""), 2000);
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    zip.file("app-uap-v3.0.uap", uapData);
    zip.file("app-schema.json", schemaData);
    zip.file("app-report.md", reportData);
    
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "nocodebridge-export.zip");
    
    toast({
      title: "Downloaded!",
      description: "All files saved as ZIP",
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-violet-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-8 relative z-10 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Upload & Analyze Your App (UAP)
          </h1>
          <Button asChild variant="outline" className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 rounded-xl">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Upload Card */}
        <Card className="bg-[#111826]/80 backdrop-blur-sm border-cyan-500/50 rounded-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Upload className="w-16 h-16 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">Upload Your Export</h3>
              <p className="text-gray-400 text-center">
                Accept .uap, .json, or .md files from your self-extractor
              </p>
              <input
                type="file"
                accept=".uap,.json,.md"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button asChild className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl cursor-pointer">
                  <span>Choose File</span>
                </Button>
              </label>
              {file && (
                <p className="text-sm text-lime-400">
                  Loaded: {file.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Tabs */}
        {uapData && (
          <Card className="bg-[#111826]/80 backdrop-blur-sm border-violet-500/50 rounded-2xl">
            <CardContent className="p-6">
              <Tabs defaultValue="uap" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-black/30 rounded-xl">
                  <TabsTrigger value="uap" className="rounded-xl data-[state=active]:bg-cyan-600">UAP (Raw)</TabsTrigger>
                  <TabsTrigger value="schema" className="rounded-xl data-[state=active]:bg-violet-600">Schema (JSON)</TabsTrigger>
                  <TabsTrigger value="report" className="rounded-xl data-[state=active]:bg-lime-600">Report (Markdown)</TabsTrigger>
                </TabsList>

                <TabsContent value="uap" className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleCopy(uapData, "UAP")}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl"
                      size="sm"
                    >
                      {copiedTab === "UAP" ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      Copy UAP
                    </Button>
                  </div>
                  <pre className="bg-black/50 p-6 rounded-xl overflow-auto max-h-[500px] text-sm text-gray-300 border border-white/10">
                    {uapData}
                  </pre>
                </TabsContent>

                <TabsContent value="schema" className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleCopy(schemaData, "Schema")}
                      className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl"
                      size="sm"
                    >
                      {copiedTab === "Schema" ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      Copy JSON
                    </Button>
                  </div>
                  <pre className="bg-black/50 p-6 rounded-xl overflow-auto max-h-[500px] text-sm text-gray-300 border border-white/10">
                    {schemaData}
                  </pre>
                </TabsContent>

                <TabsContent value="report" className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleCopy(reportData, "Report")}
                      className="bg-lime-600 hover:bg-lime-700 text-white rounded-xl"
                      size="sm"
                    >
                      {copiedTab === "Report" ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      Copy MD
                    </Button>
                  </div>
                  <div className="bg-black/50 p-6 rounded-xl overflow-auto max-h-[500px] text-sm text-gray-300 border border-white/10 prose prose-invert max-w-none">
                    <pre>{reportData}</pre>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-4 mt-6">
                <Button
                  onClick={handleDownloadAll}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download All as ZIP
                </Button>
                <Button
                  asChild
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl"
                >
                  <Link to="/improve-with-ai">
                    Generate AI Prompt →
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UploadAnalyze;
