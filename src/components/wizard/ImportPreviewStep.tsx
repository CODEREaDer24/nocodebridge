import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectStructure } from "@/types/project";

interface ImportPreviewStepProps {
  project: ProjectStructure;
  onNext: () => void;
  loading?: boolean;
}

export const ImportPreviewStep = ({ project, onNext, loading }: ImportPreviewStepProps) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Import Preview</CardTitle>
          <CardDescription>
            Review the imported project before continuing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Project Name</h3>
              <p className="text-muted-foreground">{project.name || "Unnamed Project"}</p>
            </div>
            {project.description && (
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
            )}
            <div>
              <h3 className="font-semibold">Project Data</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm">
                {JSON.stringify(project, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={loading}>
          {loading ? "Processing..." : "Continue to AI Refinement"}
        </Button>
      </div>
    </div>
  );
};
