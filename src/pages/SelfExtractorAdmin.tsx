import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Copy, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { saveAs } from "file-saver";

const SelfExtractorAdmin = () => {
  const [hasFiles, setHasFiles] = useState(false);
  const [uapContent, setUapContent] = useState("");
  const [jsonContent, setJsonContent] = useState("");
  const [mdContent, setMdContent] = useState("");

  useEffect(() => {
    // Check localStorage for exported files
    const uap = localStorage.getItem("uap_export_file");
    const json = localStorage.getItem("json_export_file");
    const md = localStorage.getItem("md_export_file");

    if (uap || json || md) {
      setHasFiles(true);
      setUapContent(uap || "");
      setJsonContent(json || "");
      setMdContent(md || "");
    }
  }, []);

  const handleCopy = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const handleDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    saveAs(blob, filename);
    toast({
      title: "Downloaded!",
      description: `${filename} has been downloaded`,
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-8 relative z-10">
        {/* Navigation */}
        <div className="flex justify-end">
          <Button
            asChild
            variant="outline"
            className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10 gap-2"
          >
            <Link to="/">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            🔒 Admin File Viewer
          </h1>
          <p className="text-gray-400 text-lg">
            View and download your extracted files
          </p>
        </div>

        {!hasFiles ? (
          <Card className="bg-[#111826]/80 backdrop-blur-sm border-yellow-500/50 max-w-2xl mx-auto">
            <CardContent className="p-8 text-center space-y-4">
              <p className="text-gray-300 text-lg">
                No recent self-extraction detected. Run your extractor in your Lovable app, then return here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-[#111826]/80 backdrop-blur-sm border-blue-500/50 max-w-5xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white">Extracted Files</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="uap" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-[#0a0e1a]">
                  <TabsTrigger value="uap" className="data-[state=active]:bg-blue-600">
                    .UAP File
                  </TabsTrigger>
                  <TabsTrigger value="json" className="data-[state=active]:bg-cyan-600">
                    .JSON File
                  </TabsTrigger>
                  <TabsTrigger value="md" className="data-[state=active]:bg-purple-600">
                    .MD File
                  </TabsTrigger>
                </TabsList>

                {/* UAP Tab */}
                <TabsContent value="uap" className="space-y-4">
                  <div className="flex gap-2 justify-end">
                    <Button
                      onClick={() => handleCopy(uapContent, "UAP")}
                      className="bg-blue-600 hover:bg-blue-700 gap-2"
                      size="sm"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                    <Button
                      onClick={() => handleDownload(uapContent, "export.uap", "application/json")}
                      variant="outline"
                      className="border-blue-500 text-blue-400 hover:bg-blue-500/20 gap-2"
                      size="sm"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                  <pre className="bg-[#0a0e1a] p-4 rounded-lg overflow-auto max-h-96 text-sm text-gray-300 border border-blue-500/30">
                    {uapContent}
                  </pre>
                </TabsContent>

                {/* JSON Tab */}
                <TabsContent value="json" className="space-y-4">
                  <div className="flex gap-2 justify-end">
                    <Button
                      onClick={() => handleCopy(jsonContent, "JSON")}
                      className="bg-cyan-600 hover:bg-cyan-700 gap-2"
                      size="sm"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                    <Button
                      onClick={() => handleDownload(jsonContent, "export.json", "application/json")}
                      variant="outline"
                      className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 gap-2"
                      size="sm"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                  <pre className="bg-[#0a0e1a] p-4 rounded-lg overflow-auto max-h-96 text-sm text-gray-300 border border-cyan-500/30">
                    {jsonContent}
                  </pre>
                </TabsContent>

                {/* MD Tab */}
                <TabsContent value="md" className="space-y-4">
                  <div className="flex gap-2 justify-end">
                    <Button
                      onClick={() => handleCopy(mdContent, "Markdown")}
                      className="bg-purple-600 hover:bg-purple-700 gap-2"
                      size="sm"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                    <Button
                      onClick={() => handleDownload(mdContent, "export.md", "text/markdown")}
                      variant="outline"
                      className="border-purple-500 text-purple-400 hover:bg-purple-500/20 gap-2"
                      size="sm"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                  <pre className="bg-[#0a0e1a] p-4 rounded-lg overflow-auto max-h-96 text-sm text-gray-300 border border-purple-500/30">
                    {mdContent}
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SelfExtractorAdmin;
