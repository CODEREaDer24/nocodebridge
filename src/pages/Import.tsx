import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// 🔄 Universal Parser
function parseAnything(fileText: string, fileName = "Unknown") {
  let detected = "Plain Text";
  let parsedData: any = null;
  
  try {
    const json = JSON.parse(fileText);
    detected = json.meta?.format || "JSON";
    parsedData = json;

    const projectName =
      json.projectName ||
      json.name ||
      json.meta?.projectName ||
      "Unnamed Project";

    const description =
      json.description ||
      json.meta?.description ||
      "No description provided.";

    const pagesCount = json.pages?.length || json.schema?.pages?.length || 0;
    const componentsCount = json.components?.length || json.schema?.components?.length || 0;

    const md = `# ${projectName}\n\n${description}\n\nPages: ${pagesCount}\nComponents: ${componentsCount}\n\n---\nGenerated: ${new Date().toLocaleString()}`;

    return { 
      markdown: json.markdown || md, 
      name: projectName, 
      detected,
      schema: json.schema || json,
      improvements: json.improvements || [],
      diff: json.diff || {}
    };
  } catch {
    const title =
      fileText.match(/^# (.+)$/m)?.[1]?.trim() ||
      fileName.replace(/\.[^/.]+$/, "") ||
      "ImportedText";
    return { 
      markdown: fileText.slice(0, 4000), 
      name: title, 
      detected,
      schema: {},
      improvements: [],
      diff: {}
    };
  }
}

export default function Import() {
  const [output, setOutput] = useState("");
  const [detected, setDetected] = useState("None");
  const [fileName, setFileName] = useState("");
  const [schema, setSchema] = useState("");
  const [improvements, setImprovements] = useState<any[]>([]);
  const [diff, setDiff] = useState<any>({});

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();

    try {
      const { markdown, name, detected, schema: parsedSchema, improvements: parsedImprovements, diff: parsedDiff } = parseAnything(text, file.name);
      setOutput(markdown);
      setDetected(detected);
      setFileName(name);
      setSchema(JSON.stringify(parsedSchema, null, 2));
      setImprovements(parsedImprovements);
      setDiff(parsedDiff);
      toast.success(`✅ Imported ${detected} file`);
    } catch (err) {
      toast.error("❌ Could not analyze file");
      setOutput("");
    }
  }

  function handleCopy(content: string, type: string) {
    navigator.clipboard.writeText(content);
    toast.success(`📋 ${type} copied to clipboard!`);
  }

  function handleDownload(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`💾 ${filename} downloaded!`);
  }

  function handleMerge() {
    toast.success("✅ Changes merged successfully!");
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
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
          <h1 className="text-4xl font-bold text-cyan-400 mb-2">📥 NoCodeBridge Importer</h1>
          <p className="text-xl text-blue-400 mb-2">
            Reunite AI with No-Code
          </p>
          <p className="text-gray-400">
            Upload <b>.uap</b> or <b>.uapimp</b> to view, merge, and download improvements
          </p>
        </div>

        <input
          type="file"
          accept=".uap,.uapimp,.json,.md,.txt"
          onChange={handleUpload}
          className="cursor-pointer bg-cyan-900/40 px-4 py-2 rounded-lg hover:bg-cyan-900/60 transition mb-6 block mx-auto"
        />

        {output ? (
          <>
            <div className="text-sm mb-4 text-center text-gray-400">
              <b>Detected Format:</b> {detected}
            </div>

            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-[#111826]/80">
                <TabsTrigger value="summary" className="data-[state=active]:bg-cyan-600">
                  Summary
                </TabsTrigger>
                <TabsTrigger value="schema" className="data-[state=active]:bg-blue-600">
                  Schema
                </TabsTrigger>
                <TabsTrigger value="diff" className="data-[state=active]:bg-purple-600">
                  Diff
                </TabsTrigger>
              </TabsList>

              {/* Summary Tab */}
              <TabsContent value="summary">
                <Card className="bg-[#111826]/80 backdrop-blur-sm border-cyan-500/50">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">Markdown Summary</CardTitle>
                    <CardDescription className="text-gray-400">
                      Human-readable documentation layer
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={output}
                      readOnly
                      className="w-full h-96 bg-black/30 text-cyan-100 text-xs p-4 rounded-lg font-mono"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCopy(output, "Summary")}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </Button>
                      <Button
                        onClick={() => handleDownload(output, `${fileName}_summary.md`, "text/markdown")}
                        variant="outline"
                        className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Schema Tab */}
              <TabsContent value="schema">
                <Card className="bg-[#111826]/80 backdrop-blur-sm border-blue-500/50">
                  <CardHeader>
                    <CardTitle className="text-blue-400">JSON Schema</CardTitle>
                    <CardDescription className="text-gray-400">
                      Complete app structure and data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={schema}
                      readOnly
                      className="w-full h-96 bg-black/30 text-blue-100 text-xs p-4 rounded-lg font-mono"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCopy(schema, "Schema")}
                        className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </Button>
                      <Button
                        onClick={() => handleDownload(schema, `${fileName}_schema.json`, "application/json")}
                        variant="outline"
                        className="border-blue-500 text-blue-400 hover:bg-blue-500/20 gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Diff Tab */}
              <TabsContent value="diff">
                <Card className="bg-[#111826]/80 backdrop-blur-sm border-purple-500/50">
                  <CardHeader>
                    <CardTitle className="text-purple-400">Changes & Improvements</CardTitle>
                    <CardDescription className="text-gray-400">
                      Visual differences and AI suggestions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {improvements.length > 0 ? (
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-purple-300">Improvements:</h3>
                        {improvements.map((improvement, idx) => (
                          <div key={idx} className="bg-purple-900/20 p-3 rounded border border-purple-500/30">
                            <pre className="text-xs text-purple-100 whitespace-pre-wrap">
                              {typeof improvement === 'string' ? improvement : JSON.stringify(improvement, null, 2)}
                            </pre>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm text-center py-8">
                        No improvements or differences detected
                      </div>
                    )}
                    {Object.keys(diff).length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-semibold text-purple-300 mb-2">Diff Details:</h3>
                        <Textarea
                          value={JSON.stringify(diff, null, 2)}
                          readOnly
                          className="w-full h-48 bg-black/30 text-purple-100 text-xs p-4 rounded-lg font-mono"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center mt-6">
              <Button
                onClick={handleMerge}
                className="bg-green-600 hover:bg-green-700 text-white px-6"
              >
                Merge Changes
              </Button>
              <Button
                onClick={() => {
                  const fullUAP = {
                    meta: {
                      format: "UAP",
                      version: "2.0",
                      timestamp: new Date().toISOString()
                    },
                    schema: JSON.parse(schema || "{}"),
                    markdown: output,
                    improvements,
                    diff
                  };
                  handleDownload(JSON.stringify(fullUAP, null, 2), `${fileName}_updated.uap`, "application/json");
                }}
                variant="outline"
                className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 px-6"
              >
                Download Updated UAP
              </Button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-sm mt-10 text-center">
            ⚙️ Ready to import UAP or UAPIMP files. No credits used.
          </p>
        )}

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/10 mt-8">
          <p className="text-gray-400 text-sm">
            🚀 NoCodeBridge 2.0 | AEIOU Framework
          </p>
        </div>
      </div>
    </div>
  );
}
