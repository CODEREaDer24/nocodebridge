import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Copy, Download, Check, AlertCircle } from "lucide-react";
import { ProjectStructure } from "@/types/project";
import { generateExport } from "@/utils/aiCollabExport";
import { detectInputType } from "@/utils/detectInputType";
import { detectPlatform, nextStepRecommendation } from "@/utils/platformDetector";
import { JSONViewer } from "@/components/JSONViewer";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UnifiedWorkflowProps {
  onAnalysisComplete?: (project: ProjectStructure) => void;
}

export const UnifiedWorkflow = ({ onAnalysisComplete }: UnifiedWorkflowProps) => {
  const [projectName, setProjectName] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [notes, setNotes] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);
  const [analyzedProject, setAnalyzedProject] = useState<ProjectStructure | null>(null);
  const [rawData, setRawData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);


  const handleAnalyzeUrl = async () => {
    if (!urlInput.trim()) {
      setErrorMessage("Please enter a URL");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setRecommendation(null);
    setRawData(null);
    setAnalyzedProject(null);

    console.log('[Multi-AI] Analyzing URL:', urlInput);
    const detection = detectPlatform(urlInput);
    console.log('[Platform Detection]', detection);
    setDetectedPlatform(detection.platform);

    try {
      const response = await fetch(urlInput);
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log('[Fetch Success] JSON data received');
        setRawData(data);
        
        const enhancedDetection = detectPlatform(urlInput, data);
        console.log('[Enhanced Detection]', enhancedDetection);
        setDetectedPlatform(enhancedDetection.platform);
        
        const project: ProjectStructure = {
          name: projectName || `${enhancedDetection.platform} Project`,
          description: notes || `Imported from ${urlInput}`,
          components: data.components || [],
          pages: data.pages || [],
          data: data,
          platform: enhancedDetection.platform,
          confidence: enhancedDetection.confidence,
        };
        
        setAnalyzedProject(project);
        onAnalysisComplete?.(project);
        setRecommendation(nextStepRecommendation(enhancedDetection.platform, true));
      } else {
        console.log('[Fetch Failed] Non-JSON response detected');
        setErrorMessage(
          `This URL returns HTML, not JSON. ${detection.platform !== 'Unknown' ? `Detected ${detection.platform}.` : ''} Please upload your exported JSON file instead.`
        );
        setRecommendation(nextStepRecommendation(detection.platform, false));
      }
    } catch (error) {
      console.log('[Fetch Error]', error);
      setErrorMessage(
        `Unable to fetch this URL. Common reasons:\n• CORS policy blocks direct access\n• Authentication required\n• Network error\n\nPlease upload your exported JSON file instead.`
      );
      setRecommendation(nextStepRecommendation(detection.platform, false));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setErrorMessage("Please upload a .json file");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setRecommendation(null);
    console.log('[File Upload] Processing:', file.name);
    
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        console.log('[File Parse Success]');
        setRawData(data);

        const detection = detectPlatform(file.name, data);
        console.log('[Platform Detection]', detection);
        setDetectedPlatform(detection.platform);

        const project: ProjectStructure = {
          name: projectName || file.name.replace(/\.json$/, ""),
          description: notes || `Imported from ${file.name}`,
          components: data.components || [],
          pages: data.pages || [],
          data: data,
          platform: detection.platform,
          confidence: detection.confidence,
        };
        
        setAnalyzedProject(project);
        onAnalysisComplete?.(project);
        setRecommendation(nextStepRecommendation(detection.platform, true));
      } catch (error) {
        console.log('[File Parse Error]', error);
        setErrorMessage("Error: Invalid JSON file");
      } finally {
        setIsAnalyzing(false);
      }
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

          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700">App URL</label>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://lovable.dev/projects/..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeUrl()}
                className="flex-1 border-gray-300"
              />
              <Button 
                onClick={handleAnalyzeUrl} 
                disabled={isAnalyzing}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze URL"}
              </Button>
            </div>
            {detectedPlatform && (
              <div className="mt-2 text-sm text-gray-900 font-medium animate-fade-in">
                Platform detected: {detectedPlatform}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-sm text-gray-500">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700">Upload JSON Export</label>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button
                variant="outline"
                className="w-full border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-700"
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={isAnalyzing}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose JSON file
              </Button>
            </div>
          </div>

          {errorMessage && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="whitespace-pre-line text-sm">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {recommendation && !errorMessage && (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-sm text-blue-900">
                {recommendation}
              </AlertDescription>
            </Alert>
          )}

          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700">Notes (optional)</label>
            <Textarea
              placeholder="Add context or comments about this project..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-gray-300 min-h-20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Output Section */}
      {analyzedProject && rawData && (
        <Card className="animate-fade-in shadow-md border-gray-200">
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Analysis Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600 block text-xs mb-1">Platform</span>
                  <span className="font-semibold text-gray-900">{analyzedProject.platform || "Unknown"}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600 block text-xs mb-1">Confidence</span>
                  <span className="font-semibold text-gray-900">{analyzedProject.confidence || 0}%</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600 block text-xs mb-1">Components</span>
                  <span className="font-semibold text-gray-900">{analyzedProject.components?.length || 0}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600 block text-xs mb-1">Pages</span>
                  <span className="font-semibold text-gray-900">{analyzedProject.pages?.length || 0}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Structure Viewer</h4>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-auto">
                <JSONViewer data={rawData} />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold mb-3 text-gray-900">Export Options</h4>
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
