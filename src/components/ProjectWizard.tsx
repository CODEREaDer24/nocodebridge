import React, { useState } from "react";
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
import { AIRefinementStep } from "./wizard/AIRefinementStep";
import { ExportPromptStep } from "./wizard/ExportPromptStep";
import { ProjectStructure, WizardStep, FlowType } from "@/types/project";
import { ChevronLeft, ArrowLeft, History as HistoryIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { parseProjectFile, generateProjectBundle } from "@/utils/fileHandling";
import { analyzeProjectFromUrl } from "@/utils/projectAnalyzer";

export const ProjectWizard = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('start');
  const [currentFlow, setCurrentFlow] = useState<FlowType>('export');
  const [project, setProject] = useState<ProjectStructure | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiGeneratedPrompt, setAiGeneratedPrompt] = useState("");
  const { toast } = useToast();

  // Listen for proceed-to-export event
  React.useEffect(() => {
    const handleProceedToExport = () => {
      if (currentStep === 'preview') {
        setCurrentStep('export');
      }
    };

    window.addEventListener('proceed-to-export', handleProceedToExport);
    return () => window.removeEventListener('proceed-to-export', handleProceedToExport);
  }, [currentStep]);

  const handleFlowSelection = (flow: FlowType) => {
    setCurrentFlow(flow);
    setCurrentStep('input');
  };

  const handleUpload = async (data: { type: 'url' | 'file'; value: string | File }) => {
    setLoading(true);
    setCurrentStep('detect');
    
    try {
      let parsedProject: ProjectStructure | null = null;

      if (data.type === 'file') {
        // Parse the uploaded file
        parsedProject = await parseProjectFile(data.value as File);
        if (!parsedProject) {
          throw new Error('Unable to parse project file');
        }
      } else {
        // Real project analysis for URL
        const url = data.value as string;
        parsedProject = await analyzeProjectFromUrl(url);
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

  const handleAIRefinement = (prompt: string) => {
    setAiGeneratedPrompt(prompt);
    setCurrentStep('export-prompt');
  };

  const handleFinishImport = () => {
    toast({
      title: "Import process completed",
      description: "Your project prompt is ready to be used in Lovable",
    });
    // Reset wizard
    setCurrentStep('start');
    setProject(null);
    setAiGeneratedPrompt("");
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
    setAiGeneratedPrompt("");
  };

  const goBack = () => {
    const steps: WizardStep[] = ['start', 'input', 'detect', 'preview', 'export', 'import'];
    const importSteps: WizardStep[] = ['start', 'input', 'detect', 'import-preview', 'ai-refinement', 'export-prompt'];
    
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
        return project ? <ImportPreviewStep project={project} onNext={() => setCurrentStep('ai-refinement')} loading={loading} /> : null;
      case 'ai-refinement':
        return project ? <AIRefinementStep project={project} onNext={handleAIRefinement} /> : null;
      case 'export-prompt':
        return <ExportPromptStep prompt={aiGeneratedPrompt} onBack={() => setCurrentStep('ai-refinement')} onFinish={handleFinishImport} />;
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