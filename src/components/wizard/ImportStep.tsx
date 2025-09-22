import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileJson, ExternalLink, CheckCircle, AlertCircle, Code, Bot, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { JSONSchemaDialog } from "./JSONSchemaDialog";
import { ChatGPTPromptDialog } from "./ChatGPTPromptDialog";
import { ProjectTemplateGenerator } from "./ProjectTemplateGenerator";
import { ProjectStructure } from "@/types/project";

interface ImportStepProps {
  onImport: (data: string) => void;
}

export const ImportStep = ({ onImport }: ImportStepProps) => {
  const [jsonData, setJsonData] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  const validateJson = (text: string) => {
    if (!text.trim()) {
      setIsValid(null);
      setValidationErrors([]);
      return;
    }

    try {
      const parsed = JSON.parse(text);
      const errors: string[] = [];

      // Enhanced validation for ProjectStructure
      if (!parsed.id) errors.push("Missing required field: id");
      if (!parsed.name) errors.push("Missing required field: name");
      if (!parsed.sourceType) errors.push("Missing required field: sourceType");
      if (!Array.isArray(parsed.pages)) errors.push("Missing or invalid field: pages (must be array)");
      if (!Array.isArray(parsed.components)) errors.push("Missing or invalid field: components (must be array)");
      if (!Array.isArray(parsed.dataModels)) errors.push("Missing or invalid field: dataModels (must be array)");
      if (!Array.isArray(parsed.workflows)) errors.push("Missing or invalid field: workflows (must be array)");
      if (!parsed.createdAt) errors.push("Missing required field: createdAt");

      setValidationErrors(errors);
      setIsValid(errors.length === 0);
    } catch (error) {
      setIsValid(false);
      setValidationErrors(["Invalid JSON syntax"]);
    }
  };

  const handleJsonChange = (value: string) => {
    setJsonData(value);
    validateJson(value);
  };

  const handleImport = async () => {
    if (!isValid || !jsonData.trim()) return;
    
    setImporting(true);
    try {
      // Simulate API call to Lovable
      await new Promise(resolve => setTimeout(resolve, 2000));
      onImport(jsonData);
      toast({
        title: "Import successful",
        description: "Your project has been imported to Lovable",
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: "There was an error importing your project",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        handleJsonChange(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Import Project JSON</CardTitle>
          <CardDescription>
            Generate, validate, and import your project structure for AI refinement
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="paste" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="paste" className="flex items-center gap-2">
            <FileJson className="w-4 h-4" />
            Paste JSON
          </TabsTrigger>
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Quick Generate
          </TabsTrigger>
          <TabsTrigger value="help" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            ChatGPT Help
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paste" className="space-y-4">{/* ... keep existing code */}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Project JSON</CardTitle>
                <CardDescription>
                  Paste or upload your project JSON data
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <JSONSchemaDialog />
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="json-upload"
                />
                <Button variant="outline" size="sm" asChild>
                  <label htmlFor="json-upload" className="cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload JSON
                  </label>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Paste your project JSON here..."
                value={jsonData}
                onChange={(e) => handleJsonChange(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
              {isValid !== null && (
                <div className="absolute top-3 right-3">
                  {isValid ? (
                    <Badge variant="outline" className="bg-success text-success-foreground">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Valid Structure
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {validationErrors.length > 0 ? "Invalid Structure" : "Invalid JSON"}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            
            {validationErrors.length > 0 && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="text-sm font-medium text-destructive mb-2">Validation Errors:</div>
                <ul className="text-sm text-destructive space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                {jsonData.length > 0 && (
                  <>
                    {jsonData.length} characters
                    {isValid && " • Ready to continue"}
                    {validationErrors.length > 0 && ` • ${validationErrors.length} errors`}
                  </>
                )}
              </div>
              <Button 
                onClick={handleImport}
                disabled={!isValid || importing}
                className="flex items-center gap-2"
                size="lg"
              >
                {importing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    Continue to Preview
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="generate" className="space-y-4">
          <ProjectTemplateGenerator onGenerate={handleJsonChange} />
        </TabsContent>

        <TabsContent value="help" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="w-5 h-5" />
                ChatGPT Integration
              </CardTitle>
              <CardDescription>
                Get help generating the perfect JSON structure using ChatGPT
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <JSONSchemaDialog 
                  trigger={
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="w-4 h-4" />
                        <span className="font-semibold">View Schema</span>
                      </div>
                      <span className="text-sm text-muted-foreground text-left">
                        See the exact JSON format ChatGPT should follow
                      </span>
                    </Button>
                  }
                />
                <ChatGPTPromptDialog 
                  trigger={
                    <Button variant="default" className="h-auto p-4 flex flex-col items-start">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-4 h-4" />
                        <span className="font-semibold">Get Prompt</span>
                      </div>
                      <span className="text-sm text-white/80 text-left">
                        Copy ready-to-use prompt for ChatGPT
                      </span>
                    </Button>
                  }
                />
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">How it works:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                  <li>Copy the ChatGPT prompt and customize it with your project description</li>
                  <li>Paste it into ChatGPT to generate a structured JSON</li>
                  <li>Copy the JSON response and paste it in the "Paste JSON" tab</li>
                  <li>Continue to preview and AI refinement</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <FileJson className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Perfect Restoration</h3>
              <p className="text-sm text-muted-foreground">
                Your exported JSON contains all necessary data to perfectly recreate your project structure, 
                components, and workflows in Lovable.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};