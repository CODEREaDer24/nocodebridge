import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AI_ITERATION_PROMPT = `You are the AEIOU Assistant. Analyze the attached UAP or schema.

Do NOT change anything in the code or structure.

Return:
1. **Issues List**: Identify any structural problems, missing dependencies, or inconsistencies.
2. **Suggestions List**: Provide recommendations for improvements or optimizations.
3. **AEIOU Patch Plan**: Outline the changes in Markdown format.

Keep your response focused and actionable. Format as Markdown.`;

const Step2Import = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileContents, setFileContents] = useState<Map<string, string>>(new Map());
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []).slice(0, 3);
    if (uploadedFiles.length === 0) return;

    setFiles(uploadedFiles);
    const contentsMap = new Map<string, string>();
    
    for (const file of uploadedFiles) {
      const text = await file.text();
      contentsMap.set(file.name, text);
    }
    
    setFileContents(contentsMap);
    setActiveTab(uploadedFiles[0].name);

    toast({
      title: "Files uploaded!",
      description: `${uploadedFiles.length} file(s) loaded successfully`,
    });
  };

  const handleCopyAIPrompt = async () => {
    try {
      await navigator.clipboard.writeText(AI_ITERATION_PROMPT);
      setCopied(true);
      toast({
        title: "Copied! ✅",
        description: "AI Iteration Prompt copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed ⚠️",
        description: "Please select and copy manually",
        variant: "destructive",
      });
    }
  };

  const handleCopyFile = async (fileName: string) => {
    const content = fileContents.get(fileName);
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied! ✅",
        description: `${fileName} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Copy failed ⚠️",
        description: "Please select and copy manually",
        variant: "destructive",
      });
    }
  };

  const handleDownloadFile = (fileName: string) => {
    const content = fileContents.get(fileName);
    if (!content) return;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded! ✅",
      description: `${fileName} downloaded successfully`,
    });
  };

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'uap' || extension === 'uap-imp') return '✅ AEIOU UAP';
    if (extension === 'json') return '✅ JSON Schema';
    if (extension === 'md') return '✅ Markdown Report';
    return '⚠️ Unknown format';
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
            Step 2: Import & Analyze UAP
          </h1>
          <Button asChild variant="outline" className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 rounded-xl">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
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
                Accept up to 3 files: .uap, .uap-imp, .json, or .md
              </p>
              <input
                type="file"
                accept=".uap,.uap-imp,.json,.md"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                multiple
              />
              <label htmlFor="file-upload">
                <Button asChild className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl cursor-pointer">
                  <span>Choose Files</span>
                </Button>
              </label>
              {files.length > 0 && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-lime-400">
                    Loaded: {files.length} file(s)
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {files.map((file) => (
                      <span key={file.name} className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">
                        {file.name} ({getFileType(file.name)})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* File Viewer with Tabs */}
        {files.length > 0 && (
          <Card className="bg-[#111826]/80 backdrop-blur-sm border-violet-500/50 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white">Full File Viewer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
                {files.map((file) => (
                  <Button
                    key={file.name}
                    onClick={() => setActiveTab(file.name)}
                    variant={activeTab === file.name ? "default" : "outline"}
                    className={activeTab === file.name 
                      ? "bg-violet-600 hover:bg-violet-700 text-white rounded-lg" 
                      : "border-violet-400/50 text-violet-400 hover:bg-violet-400/10 rounded-lg"}
                    size="sm"
                  >
                    {file.name}
                  </Button>
                ))}
              </div>

              {/* Active File Content */}
              {activeTab && fileContents.has(activeTab) && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      <span className="text-violet-400 font-semibold">{getFileType(activeTab)}</span> • {activeTab}
                      <span className="ml-2">({fileContents.get(activeTab)?.split('\n').length} lines)</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCopyFile(activeTab)}
                        className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
                        size="sm"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        onClick={() => handleDownloadFile(activeTab)}
                        variant="outline"
                        className="border-violet-400/50 text-violet-400 hover:bg-violet-400/10 rounded-lg"
                        size="sm"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <pre className="bg-black/50 p-6 rounded-xl overflow-auto max-h-[600px] text-sm text-gray-300 border border-white/10 whitespace-pre-wrap break-words">
                    {fileContents.get(activeTab)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {files.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 backdrop-blur-sm border-violet-500/50 rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white">🧠 AI Iteration (Optional)</h3>
                <p className="text-sm text-gray-300">
                  Copy this prompt and paste it into your AI assistant with your UAP file attached. The AI will analyze and suggest improvements.
                </p>
                <Button
                  onClick={handleCopyAIPrompt}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied! ✅
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy AI Iteration Prompt
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-lime-900/20 to-cyan-900/20 backdrop-blur-sm border-lime-500/50 rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white">➡ Skip AI</h3>
                <p className="text-sm text-gray-300">
                  Don't need AI improvements? Go directly to Step 3 to review and prepare your re-import prompt.
                </p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-lime-600 to-cyan-600 hover:from-lime-700 hover:to-cyan-700 text-white rounded-xl"
                >
                  <Link to="/step3-iterate">
                    Skip AI → Step 3: Review
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step2Import;
