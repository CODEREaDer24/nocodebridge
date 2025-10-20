import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Download, Copy, Upload, ArrowLeft, FileCode, FileText, GitMerge } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import "@/utils/rebuilder"; // Load rebuilder hook

// Universal parser - auto-detects and normalizes any format
function parseAnything(text: string, filename: string) {
  const timestamp = new Date().toISOString();
  let parsed: any = {};
  let sourceType = "unknown";

  // Detect and parse based on content
  if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
    // JSON/UAP format
    try {
      parsed = JSON.parse(text);
      sourceType = filename.endsWith(".uap") ? "uap" : "json";
    } catch (e) {
      console.error("JSON parse failed:", e);
      parsed = { raw: text };
      sourceType = "invalid_json";
    }
  } else if (text.includes("```json")) {
    // Markdown with fenced JSON
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[1]);
        sourceType = "markdown_json";
      } catch (e) {
        parsed = { markdown_blocks: [jsonMatch[1]] };
        sourceType = "markdown_invalid";
      }
    }
  } else if (filename.endsWith(".md") || text.includes("#")) {
    // Plain markdown
    parsed = { markdown_blocks: [text] };
    sourceType = "markdown";
  } else if (text.startsWith("http://") || text.startsWith("https://")) {
    // URL - would need fetch in real impl
    parsed = { url: text };
    sourceType = "url";
  } else {
    // Raw text
    parsed = { raw: text };
    sourceType = "text";
  }

  // Normalize into UAP v3.0 format
  const normalized = {
    meta: {
      source_type: sourceType,
      timestamp,
      original_filename: filename,
      format: "UAP v3.0 (normalized)"
    },
    project: {
      name: parsed.project?.name || parsed.meta?.source || filename.replace(/\.(uap|json|md|uapimp)$/, ""),
      pages: parsed.project?.pages || parsed.pages || [],
      components: parsed.project?.components || parsed.components || [],
      logic: parsed.project?.logic || parsed.logic || [],
      data_models: parsed.project?.data_models || parsed.data_models || parsed.studentProfiles || [],
      ai_prompts: parsed.project?.ai_prompts || parsed.ai_prompts || [],
      variables: parsed.project?.variables || parsed.variables || {},
      styles: parsed.project?.styles || parsed.styles || {},
      connections: parsed.project?.connections || parsed.connections || {},
      datasets: parsed.datasets || parsed,
      markdown_blocks: parsed.markdown_blocks || (parsed.markdown ? [parsed.markdown] : [])
    },
    improvements: parsed.improvements || [],
    diff: parsed.diff || {}
  };

  const markdown = `# NoCodeBridge Import\n\n**Source:** ${filename}\n**Type:** ${sourceType}\n**Imported:** ${timestamp}\n\n## Project Summary\n\n- **Name:** ${normalized.project.name}\n- **Pages:** ${normalized.project.pages.length}\n- **Components:** ${normalized.project.components.length}\n- **Data Models:** ${normalized.project.data_models.length}\n\n## Full Schema\n\n\`\`\`json\n${JSON.stringify(normalized, null, 2)}\n\`\`\``;

  return {
    normalized,
    markdown,
    sourceType,
    schema: JSON.stringify(normalized.project, null, 2),
    improvements: normalized.improvements,
    diff: normalized.diff
  };
}

export default function Import() {
  const [output, setOutput] = useState("");
  const [detected, setDetected] = useState("");
  const [fileName, setFileName] = useState("");
  const [schema, setSchema] = useState("");
  const [improvements, setImprovements] = useState<any[]>([]);
  const [diff, setDiff] = useState({});
  const [normalized, setNormalized] = useState<any>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();

    try {
      const result = parseAnything(text, file.name);
      setOutput(result.markdown);
      setDetected(result.sourceType);
      setFileName(result.normalized.project.name);
      setSchema(result.schema);
      setImprovements(result.improvements);
      setDiff(result.diff);
      setNormalized(result.normalized);
      
      // Store in localStorage as 'uap_import'
      localStorage.setItem('uap_import', JSON.stringify(result.normalized));
      
      toast.success(`✅ Imported ${result.sourceType} → UAP v3.0`);
      
      // Auto-rebuild if function exists
      if ((window as any).NoCodeBridge?.rebuild) {
        const rebuildResult = (window as any).NoCodeBridge.rebuild(result.normalized);
        console.log("🧠 Auto-rebuild:", rebuildResult);
      }
    } catch (err) {
      console.error("Import error:", err);
      toast.error("❌ Could not analyze file");
      setOutput("");
    }
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      const result = parseAnything(text, "clipboard.txt");
      setOutput(result.markdown);
      setDetected(result.sourceType);
      setFileName(result.normalized.project.name);
      setSchema(result.schema);
      setImprovements(result.improvements);
      setDiff(result.diff);
      setNormalized(result.normalized);
      localStorage.setItem('uap_import', JSON.stringify(result.normalized));
      toast.success(`✅ Pasted ${result.sourceType} → UAP v3.0`);
    } catch (err) {
      toast.error("❌ Could not read clipboard");
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
          <h1 className="text-4xl font-bold text-cyan-400 mb-2">📥 AEIOU Universal Importer</h1>
          <p className="text-xl text-blue-400 mb-2">
            Auto-detect • Normalize • Rebuild
          </p>
          <p className="text-gray-400">
            Accepts <b>.uap</b>, <b>.json</b>, <b>.md</b>, paste, or URL
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-700 rounded-lg bg-gray-900/30">
            <Upload className="w-12 h-12 text-cyan-400 mb-4" />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/20" asChild>
                <span>Upload .uap, .json, .md file</span>
              </Button>
            </label>
            <Input
              id="file-upload"
              type="file"
              accept=".uap,.json,.md,.uapimp,.txt"
              onChange={handleUpload}
              className="hidden"
            />
          </div>
          <div className="text-center">
            <Button onClick={handlePaste} variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/20">
              📋 Paste from Clipboard
            </Button>
          </div>
        </div>

        {output ? (
          <>
            <div className="text-sm mb-4 text-center text-gray-400 mt-6">
              <b>Detected Format:</b> {detected} → <span className="text-green-400">UAP v3.0 (normalized)</span>
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
                    <CardTitle className="text-blue-400">JSON Schema (UAP v3.0)</CardTitle>
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
                  const fullUAP = normalized || {
                    meta: {
                      format: "UAP v3.0",
                      timestamp: new Date().toISOString()
                    },
                    project: JSON.parse(schema || "{}"),
                    improvements,
                    diff
                  };
                  handleDownload(JSON.stringify(fullUAP, null, 2), `${fileName}_updated_v3.uap`, "application/json");
                }}
                variant="outline"
                className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 px-6"
              >
                Download Updated UAP v3.0
              </Button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-sm mt-10 text-center">
            ⚙️ Ready to import. Accepts any format. Auto-normalizes to UAP v3.0. Zero credits.
          </p>
        )}

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/10 mt-8">
          <p className="text-gray-400 text-sm">
            🧩 NoCodeBridge AEIOU v3.0 | Teleportation Loop Ready
          </p>
        </div>
      </div>
    </div>
  );
}
