import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ProjectStructure } from "@/types/project";
import { 
  ChevronDown, 
  ChevronRight, 
  Globe, 
  Component as ComponentIcon, 
  Database, 
  Workflow,
  CheckCircle,
  ArrowRight,
  BarChart
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { downloadAICollabJSON, downloadAICollabMarkdown, downloadAICollabZIP } from "@/utils/aiCollabExport";
import { FileJson, FileText, Archive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PreviewStepProps {
  project: ProjectStructure;
}

export const PreviewStep = ({ project }: PreviewStepProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    pages: true,
    components: false,
    dataModels: false,
    workflows: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleDownloadJSON = () => {
    downloadAICollabJSON(project);
    toast({ title: "Downloaded", description: "AI Collab JSON downloaded successfully" });
  };

  const handleDownloadMarkdown = () => {
    downloadAICollabMarkdown(project);
    toast({ title: "Downloaded", description: "AI Collab Markdown downloaded successfully" });
  };

  const handleDownloadZIP = async () => {
    await downloadAICollabZIP(project);
    toast({ title: "Downloaded", description: "AI Collab ZIP bundle downloaded successfully" });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-success" />
            Project Analysis Complete: {project.name}
          </CardTitle>
          <CardDescription>
            Review the detected project structure before exporting
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

      {/* Pages Section */}
      <Card>
        <Collapsible open={openSections.pages} onOpenChange={() => toggleSection('pages')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Pages ({project.pages.length})</CardTitle>
                </div>
                {openSections.pages ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-3">
                {project.pages.map((page, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{page.name}</h4>
                      <Badge variant="outline">{page.path}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Components:</strong> {page.components.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Components Section */}
      <Card>
        <Collapsible open={openSections.components} onOpenChange={() => toggleSection('components')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ComponentIcon className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Components ({project.components.length})</CardTitle>
                </div>
                {openSections.components ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="grid gap-3">
                {project.components.map((component, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{component.name}</h4>
                      <Badge variant="secondary">{component.type}</Badge>
                    </div>
                    {component.props && component.props.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        <strong>Props:</strong> {component.props.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Data Models Section */}
      <Card>
        <Collapsible open={openSections.dataModels} onOpenChange={() => toggleSection('dataModels')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Data Models ({project.dataModels.length})</CardTitle>
                </div>
                {openSections.dataModels ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                {project.dataModels.map((model, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">{model.name}</h4>
                    <div className="space-y-2">
                      {model.fields.map((field, fieldIndex) => (
                        <div key={fieldIndex} className="flex items-center justify-between text-sm">
                          <span className="font-medium">{field.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{field.type}</Badge>
                            {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Workflows Section */}
      <Card>
        <Collapsible open={openSections.workflows} onOpenChange={() => toggleSection('workflows')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Workflow className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Workflows ({project.workflows.length})</CardTitle>
                </div>
                {openSections.workflows ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                {project.workflows.map((workflow, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{workflow.name}</h4>
                      <Badge variant="outline">{workflow.trigger}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      <strong>Actions:</strong> {workflow.actions.join(' → ')}
                    </div>
                    {workflow.description && (
                      <p className="text-sm text-muted-foreground">{workflow.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* AI Collab Export Downloads */}
      <Card className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-blue-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="w-5 h-5" />
            AI Collaboration Export
          </CardTitle>
          <CardDescription>
            Download complete project data for AI collaboration and ideation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <Button 
              onClick={handleDownloadJSON}
              variant="outline"
              className="w-full justify-start border-blue-500/50 hover:bg-blue-500/10"
            >
              <FileJson className="w-4 h-4 mr-2" />
              AI Collab JSON
              <Badge variant="secondary" className="ml-auto">Machine-readable</Badge>
            </Button>
            
            <Button 
              onClick={handleDownloadMarkdown}
              variant="outline"
              className="w-full justify-start border-blue-500/50 hover:bg-blue-500/10"
            >
              <FileText className="w-4 h-4 mr-2" />
              AI Collab Markdown
              <Badge variant="secondary" className="ml-auto">Human-readable</Badge>
            </Button>
            
            <Button 
              onClick={handleDownloadZIP}
              variant="outline"
              className="w-full justify-start border-blue-500/50 hover:bg-blue-500/10"
            >
              <Archive className="w-4 h-4 mr-2" />
              AI Collab ZIP Bundle
              <Badge variant="secondary" className="ml-auto">Both formats</Badge>
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-blue-950/20 rounded-lg border border-blue-500/30">
            <p className="text-xs text-muted-foreground">
              💡 <strong>UAP (Universal App Profile)</strong> coming soon - standardized format for cross-platform compatibility
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Continue to Export */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-purple-500/50">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  View Full Analysis
                </h3>
                <p className="text-sm text-muted-foreground">
                  See detailed analysis output of the analyzed project
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => {
                  // Store project in localStorage and navigate
                  localStorage.setItem('analyzed-project', JSON.stringify(project));
                  navigate('/output-demo');
                }}
                className="w-full border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
              >
                View Analysis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Ready to Export</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your export format and download your project
                </p>
              </div>
              <Button 
                onClick={() => window.dispatchEvent(new CustomEvent('proceed-to-export'))}
                className="w-full"
              >
                Continue to Export
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};