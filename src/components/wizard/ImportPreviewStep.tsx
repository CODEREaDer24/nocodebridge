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
  AlertCircle,
  CheckCircle,
  ExternalLink,
  ArrowRight
} from "lucide-react";

interface ImportPreviewStepProps {
  project: ProjectStructure;
  onNext: () => void;
  loading?: boolean;
}

export const ImportPreviewStep = ({ project, onNext, loading }: ImportPreviewStepProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    pages: true,
    components: false,
    dataModels: false,
    workflows: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-success" />
            Ready to Import: {project.name}
          </CardTitle>
          <CardDescription>
            Review the project structure before importing into a new Lovable project
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

      {/* Next Action */}
      <Card className="bg-gradient-to-r from-success/10 to-primary/10 border-success">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center">
                <ExternalLink className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Continue to AI Refinement</h3>
                <p className="text-muted-foreground">
                  Generate a Lovable-friendly prompt from this project structure
                </p>
              </div>
            </div>
            <Button 
              onClick={onNext}
              disabled={loading}
              size="lg"
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Next: Refine with AI
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Warning */}
      <Card className="border-warning bg-warning/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-warning" />
            <p className="text-sm text-muted-foreground">
              <strong>Important:</strong> This will always create a new project. Your existing projects will not be modified.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};