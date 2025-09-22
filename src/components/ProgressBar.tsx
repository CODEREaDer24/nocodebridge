import { cn } from "@/lib/utils";
import { WizardStep } from "@/types/project";

interface ProgressBarProps {
  currentStep: WizardStep;
}

export const ProgressBar = ({ currentStep }: ProgressBarProps) => {
  const getStepsForCurrentFlow = () => {
    if (currentStep === 'import-preview') {
      return [
        { key: 'input' as WizardStep, label: 'Input' },
        { key: 'detect' as WizardStep, label: 'Detect' },
        { key: 'import-preview' as WizardStep, label: 'Preview' },
      ];
    }
    
    return [
      { key: 'input' as WizardStep, label: 'Input' },
      { key: 'detect' as WizardStep, label: 'Detect' },
      { key: 'preview' as WizardStep, label: 'Preview' },
      { key: 'export' as WizardStep, label: 'Export' },
      { key: 'import' as WizardStep, label: 'Import' },
    ];
  };

  const steps = getStepsForCurrentFlow();
  const currentIndex = steps.findIndex(step => step.key === currentStep);

  // Don't show progress bar for start step
  if (currentStep === 'start') {
    return null;
  }

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                index <= currentIndex
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-secondary border-border text-muted-foreground"
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                "ml-2 text-sm font-medium transition-colors",
                index <= currentIndex ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-16 h-0.5 mx-4 transition-colors",
                  index < currentIndex ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};