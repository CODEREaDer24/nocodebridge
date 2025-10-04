import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectStructure } from "@/types/project";
import { ExportPromptStep } from "@/components/wizard/ExportPromptStep";

interface IterationFlowStepProps {
  project: ProjectStructure;
  onStartExport: (format: 'json' | 'zip' | 'markdown' | 'uap' | 'ai-collaboration', data?: string) => void;
  onStartImport?: () => void;
}

export const IterationFlowStep = ({ project, onStartExport, onStartImport }: IterationFlowStepProps) => {
  const [stage, setStage] = useState<'prompt' | 'export'>('prompt');
  const [refinementData, setRefinementData] = useState<string | undefined>(undefined);

  const handleExport = (format: 'json' | 'zip' | 'markdown' | 'uap' | 'ai-collaboration', data?: string) => {
    setRefinementData(data);
    onStartExport(format, data);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Project Export Wizard</CardTitle>
          <CardDescription>
            Prepare and export your project in multiple formats
          </CardDescription>
        </CardHeader>
      </Card>

      <ExportPromptStep
        project={project}
        onExport={(format, data) => {
          setRefinementData(data);
          onStartExport(format, data);
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Navigation</CardTitle>
          <CardDescription>
            Switch between refinement and export steps
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button
            variant={stage === 'prompt' ? "default" : "outline"}
            onClick={() => setStage('prompt')}
          >
            Back to Prompt
          </Button>
          <Button
            variant={stage === 'export' ? "default" : "outline"}
            onClick={() => setStage('export')}
          >
            Go to Export
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

/// FILE: src/components/wizard/IterationFlowStep.tsx
