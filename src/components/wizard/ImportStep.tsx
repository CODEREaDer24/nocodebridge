import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, FileJson, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImportStepProps {
  onImport: (data: string) => void;
}

export const ImportStep = ({ onImport }: ImportStepProps) => {
  const [jsonData, setJsonData] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  const validateJson = (text: string) => {
    try {
      JSON.parse(text);
      setIsValid(true);
    } catch {
      setIsValid(text.length > 0 ? false : null);
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
          <CardTitle className="text-2xl">Import to Lovable</CardTitle>
          <CardDescription>
            Paste your refined JSON or upload a file to recreate your project
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Project JSON</CardTitle>
              <CardDescription>
                Paste the refined project JSON data
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
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
                    Valid JSON
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Invalid JSON
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-muted-foreground">
              {jsonData.length > 0 && (
                <>
                  {jsonData.length} characters
                  {isValid && " • Ready to import"}
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
                  Importing...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" />
                  Import to Lovable
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

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