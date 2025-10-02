import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeProject, ProjectAnalysis } from "@/utils/projectAnalyzer";
import { useNavigate } from "react-router-dom";

const OutputDemo = () => {
  const [analysis, setAnalysis] = useState<ProjectAnalysis | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Generate real analysis on mount
    const projectAnalysis = analyzeProject();
    setAnalysis(projectAnalysis);
  }, []);

  const copyJson = async () => {
    if (!analysis) return;
    await navigator.clipboard.writeText(JSON.stringify(analysis, null, 2));
    toast({
      title: "Copied!",
      description: "Analysis JSON copied to clipboard",
    });
  };

  const downloadJson = () => {
    if (!analysis) return;
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analysis-output-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Analysis JSON saved to your device",
    });
  };

  const generateLovableTemplate = () => {
    if (!analysis) return "";
    
    // Generate Lovable-compatible template from ProjectAnalysis
    const template = {
      name: analysis.name,
      description: analysis.description,
      pages: analysis.pages.map(p => ({
        name: p.name,
        path: p.path,
        file: p.file,
        description: p.description,
        components: p.components,
        features: p.features
      })),
      components: analysis.components.map(c => ({
        name: c.name,
        type: c.type,
        description: c.description,
        props: c.props || []
      })),
      techStack: analysis.techStack,
      architecture: analysis.architecture
    };
    
    return JSON.stringify(template, null, 2);
  };

  const generateAIPrompt = () => {
    if (!analysis) return "";
    
    let prompt = `Create a ${analysis.name} application with the following structure:\n\n`;
    prompt += `${analysis.description}\n\n`;
    
    prompt += `## Tech Stack\n`;
    prompt += `Frontend: ${analysis.techStack.frontend.join(', ')}\n`;
    prompt += `Backend: ${analysis.techStack.backend.join(', ')}\n`;
    prompt += `Styling: ${analysis.techStack.styling.join(', ')}\n\n`;
    
    prompt += `## Pages (${analysis.pages.length})\n`;
    analysis.pages.forEach(page => {
      prompt += `- ${page.name} (${page.path}): ${page.description}\n`;
    });
    
    prompt += `\n## Components (${analysis.components.length})\n`;
    analysis.components.forEach(comp => {
      prompt += `- ${comp.name} (${comp.type}): ${comp.description}\n`;
    });
    
    prompt += `\n## Features (${analysis.features.length})\n`;
    analysis.features.forEach(feature => {
      prompt += `- ${feature.name}: ${feature.description}\n`;
    });
    
    return prompt;
  };

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Analyzing project...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Live Project Analysis</h1>
          <p className="text-muted-foreground">
            Real-time analysis of this application's structure, components, and features
          </p>
        </div>

        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-card">
            <TabsTrigger value="analysis">Analysis Result</TabsTrigger>
            <TabsTrigger value="template">Lovable Template</TabsTrigger>
            <TabsTrigger value="prompt">AI Prompt</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="mt-6">
            <Card className="border-primary/20 bg-card">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Complete Analysis Output</h2>
                  <div className="flex gap-2">
                    <Button onClick={copyJson} variant="outline" size="sm" className="gap-2">
                      <Copy className="w-4 h-4" />
                      Copy JSON
                    </Button>
                    <Button onClick={downloadJson} variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Source Information */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Source Information</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      current_project
                    </Badge>
                    <Badge variant="outline">live_analysis</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {analysis.description}
                  </p>
                </div>

                {/* Pages */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Pages ({analysis.pages.length})</h3>
                  <div className="grid gap-3">
                    {analysis.pages.map((page, idx) => (
                      <Card key={idx} className="p-4 bg-muted/30 border-border/50">
                        <h4 className="font-semibold">{page.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {page.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Route: {page.path}
                        </p>
                        {page.features.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {page.features.map((feature, fIdx) => (
                              <Badge key={fIdx} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>

                {/* UI Components */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">UI Components ({analysis.components.length})</h3>
                  <div className="grid gap-2">
                    {analysis.components.slice(0, 10).map((comp, idx) => (
                      <Card key={idx} className="p-3 bg-muted/30 border-border/50">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <span className="font-medium">{comp.name}</span>
                            <p className="text-xs text-muted-foreground mt-1">{comp.description}</p>
                          </div>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {comp.type}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                    {analysis.components.length > 10 && (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        ...and {analysis.components.length - 10} more components
                      </p>
                    )}
                  </div>
                </div>

                {/* Features */}
                {analysis.features.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Features ({analysis.features.length})</h3>
                    <div className="grid gap-3">
                      {analysis.features.map((feature, idx) => (
                        <Card key={idx} className="p-4 bg-muted/30 border-border/50">
                          <h4 className="font-semibold">{feature.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {feature.description}
                          </p>
                          <div className="text-xs text-muted-foreground mt-2">
                            <span className="font-medium">Location:</span> {feature.location}
                          </div>
                          {feature.capabilities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {feature.capabilities.map((capability, cIdx) => (
                                <Badge key={cIdx} variant="secondary" className="text-xs">
                                  {capability}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Routes */}
                {analysis.routes.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Routes ({analysis.routes.length})</h3>
                    <div className="grid gap-2">
                      {analysis.routes.map((route, idx) => (
                        <Card key={idx} className="p-3 bg-muted/30 border-border/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <code className="text-sm font-mono text-primary">{route.path}</code>
                              <span className="text-sm text-muted-foreground">→ {route.component}</span>
                            </div>
                            {route.protected && (
                              <Badge variant="outline" className="text-xs">
                                Protected
                              </Badge>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="template" className="mt-6">
            <Card className="border-primary/20 bg-card p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Lovable Template</h2>
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(generateLovableTemplate());
                      toast({ title: "Copied!", description: "Template copied to clipboard" });
                    }} 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Template
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
                  {generateLovableTemplate()}
                </pre>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="prompt" className="mt-6">
            <Card className="border-primary/20 bg-card p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">AI Prompt</h2>
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(generateAIPrompt());
                      toast({ title: "Copied!", description: "Prompt copied to clipboard" });
                    }} 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Prompt
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
                  {generateAIPrompt()}
                </pre>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* How It Works */}
        <Card className="border-primary/20 bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-semibold">Analyze Input</h4>
              <p className="text-sm text-muted-foreground">
                System parses URL, JSON, or text to extract pages, components, database schema, and user flows
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-semibold">Generate Template</h4>
              <p className="text-sm text-muted-foreground">
                Creates structured Lovable project template with components, routes, and database schema
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="font-semibold">Export Ready</h4>
              <p className="text-sm text-muted-foreground">
                Provides JSON template, AI prompt, and setup instructions with real data
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OutputDemo;
