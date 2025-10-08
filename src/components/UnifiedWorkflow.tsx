import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Copy, Download, Check } from "lucide-react";
import { ProjectStructure } from "@/types/project";
import { generateExport } from "@/utils/aiCollabExport";
import { detectInputType } from "@/utils/detectInputType";
import { toast } from "@/hooks/use-toast";

interface UnifiedWorkflowProps {
  onAnalysisComplete?: (project: ProjectStructure) => void;
}

export const UnifiedWorkflow = ({ onAnalysisComplete }: UnifiedWorkflowProps) => {
  const [projectName, setProjectName] = useState("");
  const [inputText, setInputText] = useState("");
  const [notes, setNotes] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [analyzedProject, setAnalyzedProject] = useState<ProjectStructure | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData("text");
    setInputText(pastedText);
    
    setIsScanning(true);
    setTimeout(async () => {
      const detected = await detectInputType(pastedText);
      setDetectedType(detected.type);
      setIsScanning(false);
      
      if (detected.isUrl && !detected.hasFullData) {
        toast({
          title: "⚠️ Partial scope detected",
          description: "Some platforms don't expose full project data. For complete results, upload a JSON or ZIP.",
          variant: "default",
        });
      }

      // Create analyzed project structure
      const project: ProjectStructure = {
        name: projectName || detected.projectName || "Detected Project",
        description: notes || `Analyzed from ${detected.type}`,
        components: detected.components || [],
        pages: detected.pages || [],
        data: detected.data || {},
        platform: detected.type,
        confidence: detected.confidence,
      };
      
      setAnalyzedProject(project);
      onAnalysisComplete?.(project);
    }, 1500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const detected = await detectInputType(content, file.name);
      setDetectedType(detected.type);
      setIsScanning(false);

      const project: ProjectStructure = {
        name: projectName || file.name.replace(/\.(json|md|zip)$/, ""),
        description: notes || `Imported from ${file.name}`,
        components: detected.components || [],
        pages: detected.pages || [],
        data: detected.data || {},
        platform: detected.type,
        confidence: detected.confidence,
      };
      
      setAnalyzedProject(project);
      onAnalysisComplete?.(project);
    };

    reader.readAsText(file);
  };

  const handleExport = async (format: "json" | "markdown" | "zip" | "uap") => {
    if (!analyzedProject) return;

    try {
      const blob = await generateExport(analyzedProject, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${analyzedProject.name}.${format === "uap" ? "zip" : format}`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: `${format.toUpperCase()} file downloaded`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not generate export file",
        variant: "destructive",
      });
    }
  };

  const handleCopyJSON = async () => {
    if (!analyzedProject) return;

    try {
      await navigator.clipboard.writeText(JSON.stringify(analyzedProject, null, 2));
      setCopied(true);
      toast({
        title: "Copied ✓",
        description: "JSON copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="shadow-md border-gray-200">
        <CardContent className="pt-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700">Project Name</label>
            <Input
              placeholder="My Amazing Project"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="border-gray-300"
            />
          </div>

          <div className="relative">
            <label className="text-sm font-medium mb-2 block text-gray-700">Smart Input</label>
            <Textarea
              placeholder="Paste your project URL, JSON, or Markdown here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onPaste={handlePaste}
              className={`min-h-32 border-gray-300 transition-all ${
                isScanning ? "ring-2 ring-gray-900 animate-pulse" : ""
              }`}
            />
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="h-full w-full border-2 border-primary rounded-md animate-pulse" />
              </div>
            )}
            {detectedType && !isScanning && (
              <div className="mt-2 text-sm text-gray-900 font-medium animate-fade-in">
                Detected: {detectedType}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => document.getElementById("file-upload")?.click()}>
              <Upload className="h-4 w-4" />
              Upload file instead
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".json,.md,.zip"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700">Notes (optional)</label>
            <Textarea
              placeholder="Add any additional context or comments..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-gray-300"
            />
          </div>
        </CardContent>
      </Card>

      {/* Output Section */}
      {analyzedProject && (
        <Card className="animate-fade-in shadow-md border-gray-200">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Analysis Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Platform:</span>{" "}
                  <span className="font-medium">{analyzedProject.platform || "Unknown"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Confidence:</span>{" "}
                  <span className="font-medium">{analyzedProject.confidence || 0}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Components:</span>{" "}
                  <span className="font-medium">{analyzedProject.components?.length || 0}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Pages:</span>{" "}
                  <span className="font-medium">{analyzedProject.pages?.length || 0}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Export Options</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button onClick={() => handleExport("json")} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  JSON
                </Button>
                <Button onClick={() => handleExport("markdown")} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Markdown
                </Button>
                <Button onClick={() => handleExport("zip")} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  ZIP
                </Button>
                <Button onClick={() => handleExport("uap")} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  UAP
                </Button>
              </div>
              
              <Button 
                onClick={handleCopyJSON} 
                variant="secondary" 
                className="w-full mt-3 gap-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied ✓" : "Copy JSON"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
