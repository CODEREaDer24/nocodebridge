import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Upload, MessageSquare, FileText, Zap, Sparkles, RefreshCw, ArrowRight } from "lucide-react";
import { JSONSchemaDialog } from "./JSONSchemaDialog";
import { ChatGPTPromptDialog } from "./ChatGPTPromptDialog";
import { ProjectTemplateGenerator } from "./ProjectTemplateGenerator";
import { useToast } from "@/hooks/use-toast";

interface ImportStepProps {
  onImport: (data: string) => void;
}

export const ImportStep = ({ onImport }: ImportStepProps) => {
  const [jsonInput, setJsonInput] = useState("");
  const { toast } = useToast();

  const handleQuickImport = () => {
    if (!jsonInput.trim()) return;
    
    try {
      // Validate JSON
      JSON.parse(jsonInput);
      onImport(jsonInput);
      toast({
        title: "Import successful!",
        description: "Your refined project is being processed for Lovable.",
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON format and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Upload className="w-12 h-12 text-primary mx-auto" />
              <h2 className="text-2xl font-bold">Import Your Project</h2>
              <p className="text-muted-foreground">
                Paste your project JSON below to generate a Lovable prompt
              </p>
            </div>

            <div className="space-y-4">
              <Textarea
                placeholder='Paste your project JSON here...\n\nExample:\n{\n  "pages": [...],\n  "components": [...],\n  "workflows": [...]\n}'
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleQuickImport}
                  disabled={!jsonInput.trim()}
                  className="flex-1"
                  size="lg"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Import Project
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    const template = JSON.stringify({
                      id: `project_${Date.now()}`,
                      name: "My Project",
                      sourceType: "other",
                      pages: [
                        { name: "Home", path: "/", components: ["Header", "Hero", "Footer"] }
                      ],
                      components: [
                        { name: "Header", type: "layout", props: ["title"] },
                        { name: "Hero", type: "ui", props: ["heading", "subtitle"] },
                        { name: "Footer", type: "layout", props: ["links"] }
                      ],
                      dataModels: [],
                      workflows: [],
                      createdAt: new Date().toISOString()
                    }, null, 2);
                    setJsonInput(template);
                    toast({
                      title: "Template loaded",
                      description: "Example JSON added to the editor",
                    });
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Load Template
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};