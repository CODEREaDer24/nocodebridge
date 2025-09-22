import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "./ProgressBar";
import { StartScreen } from "./StartScreen";
import { UploadStep } from "./wizard/UploadStep";
import { DetectionStep } from "./wizard/DetectionStep";
import { PreviewStep } from "./wizard/PreviewStep";
import { ExportStep } from "./wizard/ExportStep";
import { ImportStep } from "./wizard/ImportStep";
import { ImportPreviewStep } from "./wizard/ImportPreviewStep";
import { ProjectStructure, WizardStep, FlowType } from "@/types/project";
import { ChevronLeft, ArrowLeft, History as HistoryIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { parseProjectFile, generateProjectBundle } from "@/utils/fileHandling";

export const ProjectWizard = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('start');
  const [currentFlow, setCurrentFlow] = useState<FlowType>('export');
  const [project, setProject] = useState<ProjectStructure | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFlowSelection = (flow: FlowType) => {
    setCurrentFlow(flow);
    setCurrentStep('input');
  };

  const handleUpload = async (data: { type: 'url' | 'file'; value: string | File }) => {
    setLoading(true);
    setCurrentStep('detect');
    
    try {
      let parsedProject: ProjectStructure | null = null;

      if (data.type === 'file' && currentFlow === 'import') {
        // Parse the uploaded file for import
        parsedProject = await parseProjectFile(data.value as File);
        if (!parsedProject) {
          throw new Error('Unable to parse project file');
        }
      } else {
        // Simulate project analysis for export or URL-based import
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock project data based on input
        parsedProject = {
          id: `project_${Date.now()}`,
          name: data.type === 'url' ? 'Lovable Project' : (data.value as File).name.replace(/\.(json|zip|uap)$/, ''),
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
      }
      
      setProject(parsedProject);
      setTimeout(() => {
        if (currentFlow === 'import') {
          setCurrentStep('import-preview');
        } else {
          setCurrentStep('preview');
        }
      }, 500);
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

  const handleExport = (format: 'json' | 'zip' | 'markdown' | 'uap', refinementData?: string) => {
    if (!project) return;

    try {
      const bundle = generateProjectBundle(project, format, refinementData);

      // Create and download file
      const blob = new Blob([bundle.data], { type: bundle.mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = bundle.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: `Your project has been exported as ${format.toUpperCase()}`,
      });

      // Move to import step if in export flow
      if (currentFlow === 'export') {
        setCurrentStep('import');
      }
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Unable to export the project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImport = () => {
    setLoading(true);
    // Simulate import process
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Import successful",
        description: "Your project has been imported as a new Lovable project",
      });
      // Reset wizard
      setCurrentStep('start');
      setProject(null);
    }, 3000);
  };

  const handleImportFromJson = (jsonData: string) => {
    toast({
      title: "Import initiated",
      description: "Your project is being imported to Lovable",
    });
    // In a real app, this would make an API call to Lovable
  };

  const resetToStart = () => {
    setCurrentStep('start');
    setProject(null);
    setCurrentFlow('export');
  };

  const goBack = () => {
    const steps: WizardStep[] = ['start', 'input', 'detect', 'preview', 'export', 'import'];
    const importSteps: WizardStep[] = ['start', 'input', 'detect', 'import-preview'];
    
    const currentSteps = currentFlow === 'import' ? importSteps : steps;
    const currentIndex = currentSteps.indexOf(currentStep);
    
    if (currentIndex > 0) {
      setCurrentStep(currentSteps[currentIndex - 1]);
    }
  };

  const canGoBack = () => {
    return currentStep !== 'start';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'start':
        return <StartScreen onSelectFlow={handleFlowSelection} />;
      case 'input':
        return <UploadStep onSubmit={handleUpload} mode={currentFlow} />;
      case 'detect':
        return <DetectionStep project={project} loading={loading} />;
      case 'preview':
        return project ? <PreviewStep project={project} /> : null;
      case 'export':
        return project ? <ExportStep project={project} onExport={handleExport} /> : null;
      case 'import':
        return <ImportStep onImport={handleImportFromJson} />;
      case 'import-preview':
        return project ? <ImportPreviewStep project={project} onImport={handleImport} loading={loading} /> : null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with navigation */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              {currentStep !== 'start' && (
                <Button variant="outline" size="sm" onClick={resetToStart}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Wizard
                </Button>
              )}
            </div>
            <Button variant="outline" asChild>
              <Link to="/history" className="flex items-center gap-2">
                <HistoryIcon className="w-4 h-4" />
                View History
              </Link>
            </Button>
          </div>
          
          {currentStep !== 'start' && (
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">Project Bridge MVP</h1>
              <p className="text-xl text-muted-foreground">
                {currentFlow === 'export' 
                  ? 'Export, refine, and re-import your Lovable projects with precision'
                  : 'Import your project to create a new Lovable project'
                }
              </p>
            </div>
          )}
        </div>

        {currentStep !== 'start' && <ProgressBar currentStep={currentStep} />}
        
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Back navigation at bottom */}
        {canGoBack() && currentStep !== 'start' && (
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-start">
                <Button 
                  variant="outline" 
                  onClick={goBack}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};