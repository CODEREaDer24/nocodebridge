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
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-8">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Complete the Iteration Loop</h2>
            <p className="text-muted-foreground">
              Choose your path: Generate a prompt for Lovable or use our tools to refine your project further.
            </p>
          </div>
          
          {/* Quick Action: Direct Lovable Import */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">🚀 Ready to Build in Lovable?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you've refined your JSON with ChatGPT, drop it here to generate the perfect Lovable prompt.
                  </p>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Paste your refined JSON from ChatGPT here..."
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      className="min-h-[120px] font-mono text-sm"
                    />
                    <Button 
                      onClick={handleQuickImport}
                      disabled={!jsonInput.trim()}
                      className="w-full"
                      size="lg"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Lovable Prompt
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Iteration Tools */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">🔄 Iteration Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Start New Iteration */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <RefreshCw className="w-6 h-6 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Start New Iteration</h4>
                  </div>
                  <p className="text-sm text-blue-700 mb-4">
                    Take a Lovable project URL and begin the export → refine → import cycle
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                    onClick={() => window.location.reload()}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Start Export Flow
                  </Button>
                </CardContent>
              </Card>

              {/* Helper Tools */}
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">🛠️ Helper Tools</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <JSONSchemaDialog 
                      trigger={
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-1" />
                          Schema
                        </Button>
                      }
                    />
                    <ChatGPTPromptDialog 
                      trigger={
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          ChatGPT
                        </Button>
                      }
                    />
                    <Button variant="outline" size="sm" onClick={() => {
                      // Generate template directly inline
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
                    }}>
                      <Zap className="w-4 h-4 mr-1" />
                      Template
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      <Copy className="w-4 h-4 mr-1" />
                      Validate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Backup: Manual JSON Input */}
          <Card className="border-dashed">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">📝 Alternative: Manual JSON Input</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you have JSON from another source, paste it here
              </p>
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste your project JSON here..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="min-h-[100px] font-mono text-sm"
                />
                <Button 
                  onClick={handleQuickImport}
                  disabled={!jsonInput.trim()}
                  variant="outline"
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Process JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        </CardContent>
      </Card>

    </div>
  );
};