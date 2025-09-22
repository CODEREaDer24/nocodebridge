import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ProjectStructure } from "@/types/project";
import { Sparkles, Copy, CheckCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIRefinementStepProps {
  project: ProjectStructure;
  onNext: (refinedPrompt: string) => void;
}

export const AIRefinementStep = ({ project, onNext }: AIRefinementStepProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateAIPrompt = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation - in a real app, this would call an AI service
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const prompt = `Create a ${project.name} web application with the following structure:

**Pages:**
${project.pages.map(page => 
  `- ${page.name} (${page.path}): Features ${page.components.join(', ')}`
).join('\n')}

**Key Components:**
${project.components.map(comp => 
  `- ${comp.name} (${comp.type}): ${comp.props ? comp.props.join(', ') : 'No specific props'}`
).join('\n')}

**Data Models:**
${project.dataModels.map(model => 
  `- ${model.name}: ${model.fields.map(field => `${field.name} (${field.type}${field.required ? ', required' : ''})`).join(', ')}`
).join('\n')}

**Workflows:**
${project.workflows.map(workflow => 
  `- ${workflow.name}: Triggered by ${workflow.trigger}, performs ${workflow.actions.join(' → ')}`
).join('\n')}

Design this as a modern, responsive web application using React, TypeScript, and Tailwind CSS. Ensure all components are reusable and follow best practices for maintainability and performance.`;

    setGeneratedPrompt(prompt);
    setIsGenerating(false);
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "AI-generated prompt has been copied to your clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Refinement
          </CardTitle>
          <CardDescription>
            Generate a Lovable-friendly prompt from your imported project
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Project Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Project Summary</CardTitle>
          <CardDescription>
            Review what will be included in the AI-generated prompt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-primary">{project.pages.length}</div>
              <div className="text-sm text-muted-foreground">Pages</div>
            </div>
            <div className="text-center p-4 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-primary">{project.components.length}</div>
              <div className="text-sm text-muted-foreground">Components</div>
            </div>
            <div className="text-center p-4 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-primary">{project.dataModels.length}</div>
              <div className="text-sm text-muted-foreground">Data Models</div>
            </div>
            <div className="text-center p-4 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-primary">{project.workflows.length}</div>
              <div className="text-sm text-muted-foreground">Workflows</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Prompt */}
      {!generatedPrompt && (
        <Card className="bg-gradient-to-r from-primary/10 to-success/10 border-primary">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Generate AI Prompt</h3>
                <p className="text-muted-foreground mb-4">
                  Transform your project structure into a comprehensive Lovable prompt
                </p>
              </div>
              <Button 
                onClick={generateAIPrompt}
                disabled={isGenerating}
                size="lg"
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Prompt
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Prompt */}
      {generatedPrompt && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Generated Lovable Prompt
            </CardTitle>
            <CardDescription>
              Copy this prompt and paste it into Lovable to rebuild your project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={generatedPrompt}
              readOnly
              className="min-h-[300px] font-mono text-sm"
            />
            
            <div className="flex gap-3">
              <Button 
                onClick={handleCopyPrompt}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Prompt
                  </>
                )}
              </Button>
              
              <Button 
                onClick={() => onNext(generatedPrompt)}
                variant="outline"
                className="flex items-center gap-2"
              >
                Continue
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="border-info bg-info/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <ExternalLink className="w-5 h-5 text-info mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">How to use this prompt:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Copy the generated prompt above</li>
                <li>Open Lovable in a new tab</li>
                <li>Start a new project</li>
                <li>Paste this prompt into the chat</li>
                <li>Let Lovable rebuild your project with any refinements</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};