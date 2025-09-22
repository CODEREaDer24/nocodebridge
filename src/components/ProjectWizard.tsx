import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "./ProgressBar";
import { UploadStep } from "./wizard/UploadStep";
import { DetectionStep } from "./wizard/DetectionStep";
import { PreviewStep } from "./wizard/PreviewStep";
import { ExportStep } from "./wizard/ExportStep";
import { ImportStep } from "./wizard/ImportStep";
import { ProjectStructure, WizardStep } from "@/types/project";
import { ChevronLeft, ChevronRight, History as HistoryIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export const ProjectWizard = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('input');
  const [project, setProject] = useState<ProjectStructure | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (data: { type: 'url' | 'file'; value: string | File }) => {
    setLoading(true);
    setCurrentStep('detect');
    
    try {
      // Simulate project analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock project data based on input
      const mockProject: ProjectStructure = {
        id: `project_${Date.now()}`,
        name: data.type === 'url' ? 'Lovable Project' : (data.value as File).name.replace('.json', ''),
        url: data.type === 'url' ? data.value as string : undefined,
        sourceType: 'lovable',
        confidence: 0.95,
        pages: [
          { name: 'Home', path: '/', components: ['Header', 'Hero', 'Footer'] },
          { name: 'About', path: '/about', components: ['Header', 'Content', 'Footer'] },
          { name: 'Contact', path: '/contact', components: ['Header', 'ContactForm', 'Footer'] },
        ],
        components: [
          { name: 'Header', type: 'layout', props: ['title', 'navigation'] },
          { name: 'Hero', type: 'ui', props: ['heading', 'subtitle', 'cta'] },
          { name: 'Footer', type: 'layout', props: ['links', 'copyright'] },
          { name: 'ContactForm', type: 'ui', props: ['onSubmit', 'fields'] },
          { name: 'Button', type: 'ui', props: ['variant', 'size', 'onClick'] },
        ],
        dataModels: [
          {
            name: 'User',
            fields: [
              { name: 'id', type: 'string', required: true },
              { name: 'email', type: 'string', required: true },
              { name: 'name', type: 'string', required: false },
              { name: 'createdAt', type: 'Date', required: true },
            ]
          },
          {
            name: 'Contact',
            fields: [
              { name: 'id', type: 'string', required: true },
              { name: 'name', type: 'string', required: true },
              { name: 'email', type: 'string', required: true },
              { name: 'message', type: 'text', required: true },
            ]
          }
        ],
        workflows: [
          {
            name: 'Contact Form Submission',
            trigger: 'form.submit',
            actions: ['validate', 'save', 'notify'],
            description: 'Handles contact form submissions with validation and notifications'
          },
          {
            name: 'User Registration',
            trigger: 'user.register',
            actions: ['validate', 'create', 'email'],
            description: 'Creates new user accounts and sends welcome emails'
          }
        ],
        createdAt: new Date(),
      };
      
      setProject(mockProject);
      setTimeout(() => setCurrentStep('preview'), 500);
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Unable to analyze the project. Please try again.",
        variant: "destructive",
      });
      setCurrentStep('input');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format: 'json' | 'zip' | 'markdown', refinementData?: string) => {
    if (!project) return;

    try {
      let exportData: string;
      let filename: string;
      let mimeType: string;

      switch (format) {
        case 'json':
          exportData = JSON.stringify(project, null, 2);
          filename = `${project.name.replace(/\s+/g, '_')}_export.json`;
          mimeType = 'application/json';
          break;
        case 'markdown':
          exportData = generateMarkdown(project);
          filename = `${project.name.replace(/\s+/g, '_')}_export.md`;
          mimeType = 'text/markdown';
          break;
        case 'zip':
          // For now, just export JSON in a "zip-like" format
          exportData = JSON.stringify({ project, metadata: { exported: new Date(), format: 'zip' } }, null, 2);
          filename = `${project.name.replace(/\s+/g, '_')}_export.zip.json`;
          mimeType = 'application/json';
          break;
      }

      if (refinementData) {
        exportData = `${exportData}\n\n/* Refinement Instructions:\n${refinementData}\n*/`;
      }

      // Create and download file
      const blob = new Blob([exportData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: `Your project has been exported as ${format.toUpperCase()}`,
      });

      // Move to import step
      setCurrentStep('import');
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Unable to export the project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImport = (jsonData: string) => {
    toast({
      title: "Import initiated",
      description: "Your project is being imported to Lovable",
    });
    // In a real app, this would make an API call to Lovable
  };

  const generateMarkdown = (project: ProjectStructure): string => {
    return `# ${project.name}

## Project Overview
- **Source**: ${project.sourceType}
- **Pages**: ${project.pages.length}
- **Components**: ${project.components.length}
- **Data Models**: ${project.dataModels.length}
- **Workflows**: ${project.workflows.length}

## Pages
${project.pages.map(page => `
### ${page.name}
- **Path**: ${page.path}
- **Components**: ${page.components.join(', ')}
`).join('')}

## Components
${project.components.map(comp => `
### ${comp.name}
- **Type**: ${comp.type}
- **Props**: ${comp.props?.join(', ') || 'None'}
`).join('')}

## Data Models
${project.dataModels.map(model => `
### ${model.name}
${model.fields.map(field => `- **${field.name}**: ${field.type}${field.required ? ' (required)' : ''}`).join('\n')}
`).join('')}

## Workflows
${project.workflows.map(workflow => `
### ${workflow.name}
- **Trigger**: ${workflow.trigger}
- **Actions**: ${workflow.actions.join(' → ')}
- **Description**: ${workflow.description || 'No description'}
`).join('')}

---
*Exported from Project Bridge MVP*
`;
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 'input': return false; // Upload step handles next automatically
      case 'detect': return project !== null;
      case 'preview': return true;
      case 'export': return true;
      case 'import': return false;
      default: return false;
    }
  };

  const canGoPrev = () => {
    return currentStep !== 'input';
  };

  const goNext = () => {
    const steps: WizardStep[] = ['input', 'detect', 'preview', 'export', 'import'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const goPrev = () => {
    const steps: WizardStep[] = ['input', 'detect', 'preview', 'export', 'import'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'input':
        return <UploadStep onSubmit={handleUpload} />;
      case 'detect':
        return <DetectionStep project={project} loading={loading} />;
      case 'preview':
        return project ? <PreviewStep project={project} /> : null;
      case 'export':
        return project ? <ExportStep project={project} onExport={handleExport} /> : null;
      case 'import':
        return <ImportStep onImport={handleImport} />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <Button variant="outline" asChild>
              <Link to="/history" className="flex items-center gap-2">
                <HistoryIcon className="w-4 h-4" />
                View History
              </Link>
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Project Bridge MVP</h1>
            <p className="text-xl text-muted-foreground">
              Export, refine, and re-import your Lovable projects with precision
            </p>
          </div>
        </div>

        <ProgressBar currentStep={currentStep} />
        
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={goPrev}
                disabled={!canGoPrev()}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button 
                onClick={goNext}
                disabled={!canGoNext()}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};