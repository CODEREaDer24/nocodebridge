import { cn } from "@/lib/utils";
import { WizardStep } from "@/types/project";

interface ProgressBarProps {
  currentStep: WizardStep;
}

const steps: { key: WizardStep; label: string }[] = [
  { key: 'input', label: 'Input' },
  { key: 'detect', label: 'Detect' },
  { key: 'preview', label: 'Preview' },
  { key: 'export', label: 'Export' },
  { key: 'import', label: 'Import' },
];

export const ProgressBar = ({ currentStep }: ProgressBarProps) => {
  const currentIndex = steps.findIndex(step => step.key === currentStep);

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