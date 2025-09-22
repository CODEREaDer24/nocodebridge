import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { ProjectStructure } from "@/types/project";

interface DetectionStepProps {
  project: ProjectStructure | null;
  loading: boolean;
}

export const DetectionStep = ({ project, loading }: DetectionStepProps) => {
  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Analyzing Project</h3>
          <p className="text-muted-foreground text-center">
            Detecting platform and extracting structure...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!project) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-8 h-8 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Detection Failed</h3>
          <p className="text-muted-foreground text-center">
            Unable to analyze the provided project. Please check the URL or file format.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return "secondary";
    if (confidence >= 0.8) return "success";
    if (confidence >= 0.6) return "warning";
    return "destructive";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <CheckCircle className="w-6 h-6 text-success" />
          <CardTitle className="text-xl">Project Detected</CardTitle>
        </div>
        <CardDescription>
          Successfully identified your project structure
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
          <div>
            <h3 className="font-semibold">{project.name}</h3>
            <p className="text-sm text-muted-foreground">
              {project.url ? `Source: ${project.url}` : 'Uploaded file'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {project.sourceType}
            </Badge>
            {project.confidence && (
              <Badge variant={getConfidenceColor(project.confidence) as any}>
                {Math.round(project.confidence * 100)}% confidence
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-accent rounded-lg">
            <div className="text-2xl font-bold text-primary">{project.pages?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Pages</div>
          </div>
          <div className="text-center p-4 bg-accent rounded-lg">
            <div className="text-2xl font-bold text-primary">{project.components?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Components</div>
          </div>
          <div className="text-center p-4 bg-accent rounded-lg">
            <div className="text-2xl font-bold text-primary">{project.dataModels?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Data Models</div>
          </div>
          <div className="text-center p-4 bg-accent rounded-lg">
            <div className="text-2xl font-bold text-primary">{project.workflows?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Workflows</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};