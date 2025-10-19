import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Download } from "lucide-react";

export default function Import() {
  const [uapData, setUapData] = useState<any>(null);
  const [markdown, setMarkdown] = useState("");
  const [jsonView, setJsonView] = useState("");
  const [detected, setDetected] = useState("None");
  const [fileName, setFileName] = useState("");
  const [improvements, setImprovements] = useState<any[]>([]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();

    try {
      const parsed = JSON.parse(text);
      const detectedFormat = parsed.meta?.format || "JSON";
      
      setUapData(parsed);
      setJsonView(JSON.stringify(parsed, null, 2));
      setMarkdown(parsed.markdown || "No markdown documentation available.");
      setImprovements(parsed.improvements || []);
      setDetected(detectedFormat);
      setFileName(file.name);
      
      toast.success(`✅ Imported ${detectedFormat} file`);
    } catch (err) {
      toast.error("❌ Could not parse file. Please upload a valid .uap or .uapimp file.");
      console.error(err);
    }
  }

  function handleCopy(data: string, type: string) {
    navigator.clipboard.writeText(data);
    toast.success(`📋 ${type} copied to clipboard!`);
  }

  function handleDownload() {
    if (!uapData) {
      toast.error("No data to download");
      return;
    }
    
    const blob = new Blob([JSON.stringify(uapData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "updated-uap.json";
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success("💾 UAP downloaded!");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-cyan-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Navigation */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            📦 Import Your UAP
          </h1>
          <p className="text-xl text-cyan-300 mb-4">
            Upload your UAP (or UAP-Imp once available) to view, merge, and download improvements.
          </p>
          <p className="text-gray-400 text-sm">
            💡 This is part of the Round-Trip workflow — export in Lovable → import here → re-export to Lovable.
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8 bg-gray-800/50 backdrop-blur-sm border-cyan-500/30">
          <CardContent className="p-6">
            <input
              type="file"
              accept=".uap,.json,.uapimp"
              onChange={handleUpload}
              className="cursor-pointer bg-cyan-900/40 px-4 py-2 rounded-lg hover:bg-cyan-900/60 transition w-full"
            />
            {detected !== "None" && (
              <div className="mt-4 text-sm text-gray-400">
                <b>Detected Format:</b> {detected}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs Section */}
        {uapData && (
          <Card className="mb-8 bg-gray-800/50 backdrop-blur-sm border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-cyan-400">UAP Contents</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-700/50">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="schema">Schema</TabsTrigger>
                  <TabsTrigger value="diff">Diff</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary" className="space-y-4">
                  <Textarea
                    value={markdown}
                    readOnly
                    className="min-h-[400px] font-mono text-xs bg-black/30 text-cyan-100"
                  />
                  <Button onClick={() => handleCopy(markdown, "Summary")} className="gap-2 bg-cyan-600 hover:bg-cyan-700">
                    <Copy className="w-4 h-4" />
                    Copy Summary
                  </Button>
                </TabsContent>
                
                <TabsContent value="schema" className="space-y-4">
                  <Textarea
                    value={jsonView}
                    readOnly
                    className="min-h-[400px] font-mono text-xs bg-black/30 text-blue-100"
                  />
                  <Button onClick={() => handleCopy(jsonView, "Schema")} className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Copy className="w-4 h-4" />
                    Copy Schema
                  </Button>
                </TabsContent>
                
                <TabsContent value="diff" className="space-y-4">
                  {improvements.length > 0 ? (
                    <div className="bg-black/30 p-4 rounded-lg min-h-[400px]">
                      <h4 className="text-green-400 font-semibold mb-3">AI Improvements</h4>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        {improvements.map((imp, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-green-400">•</span>
                            <span>{typeof imp === 'string' ? imp : JSON.stringify(imp)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-black/30 p-4 rounded-lg min-h-[400px] flex items-center justify-center">
                      <p className="text-gray-400 text-center">
                        No improvements detected yet.<br/>
                        Send this UAP to an AI tool to receive suggestions.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex gap-4 mt-6">
                <Button onClick={handleDownload} className="gap-2 bg-cyan-600 hover:bg-cyan-700">
                  <Download className="w-4 h-4" />
                  Download Updated UAP
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!uapData && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              ⚙️ Ready to import UAP files. No credits used.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-700">
          <p className="text-gray-400">
            Built with ❤️ by <span className="text-cyan-400 font-semibold">GoNoCoMoCo</span> + <span className="text-blue-400 font-semibold">Chad G. Petit (ChatGPT)</span>
          </p>
        </div>
      </div>
    </div>
  );
}
