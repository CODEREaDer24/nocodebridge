import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectStructure } from "@/types/project";
import { ExportStep } from "@/components/ExportStep";
import { ExportPromptStep } from "@/components/wizard/ExportPromptStep";
import { ImportStep } from "@/components/wizard/ImportStep";

interface IterationFlowStepProps {
  project: ProjectStructure;
  onStartExport: (
    format: "json" | "zip" | "markdown" | "uap" | "ai-collaboration",
    data?: string
  ) => void;
  onStartImport?: (project: ProjectStructure) => void;
}

export const IterationFlowStep = ({
  project,
  onStartExport,
  onStartImport,
}: IterationFlowStepProps) => {
  const [stage, setStage] = useState<"prompt" | "export" | "import">("prompt");
  const [refinementData, setRefinementData] = useState<string | undefined>(undefined);

  const handleExport = (
    format: "json" | "zip" | "markdown" | "uap" | "ai-collaboration",
    data?: string
  ) => {
    setRefinementData(data);
    onStartExport(format, data);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Project Wizard</CardTitle>
          <CardDescription>
            Refine, export, or import your project data
          </CardDescription>
        </CardHeader>
      </Card>

      {stage === "prompt" && (
        <ExportPromptStep
          project={project}
          onExport={(format, data) => {
            setRefinementData(data);
            setStage("export");
            onStartExport(format, data);
          }}
        />
      )}

      {stage === "export" && (
        <ExportStep
          project={project}
          onExport={(format, data) => {
            setRefinementData(data);
            handleExport(format, data);
          }}
        />
      )}

      {stage === "import" && (
        <ImportStep
          onImport={(proj) => {
            if (onStartImport) onStartImport(proj);
          }}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Navigation</CardTitle>
          <CardDescription>
            Switch between refinement, export, and import
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button
            variant={stage === "prompt" ? "default" : "outline"}
            onClick={() => setStage("prompt")}
          >
            Prompt
          </Button>
          <Button
            variant={stage === "export" ? "default" : "outline"}
            onClick={() => setStage("export")}
          >
            Export
          </Button>
          <Button
            variant={stage === "import" ? "default" : "outline"}
            onClick={() => setStage("import")}
          >
            Import
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

/// FILE: src/components/wizard/IterationFlowStep.tsx
