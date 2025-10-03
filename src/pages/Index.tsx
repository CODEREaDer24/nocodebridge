import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { IterationFlowStep } from "@/components/wizard/IterationFlowStep";
import { ProjectStructure } from "@/types/project";

// ✅ Initial blank project (so you can always start fresh)
const initialProject: ProjectStructure = {
  name: "New Project",
  description: "Start building with NoCodeBridge",
  components: [],
  pages: [],
  data: {},
};

export default function IndexPage() {
  const [project, setProject] = useState<ProjectStructure>(initialProject);

  const handleExport = (format: string, data?: string) => {
    console.log("Export requested:", format, data);
    // Nothing else here — ExportPage + utils handle actual file generation
  };

  const handleImport = (importedProject: ProjectStructure) => {
    console.log("Import successful:", importedProject);
    setProject(importedProject); // ✅ Replace state with the imported project
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">NoCodeBridge</CardTitle>
          <CardDescription>
            Export, import, and collaborate across AI and no-code platforms with Universal App Profiles (UAP).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Current project: <strong>{project.name}</strong>
          </p>
        </CardContent>
      </Card>

      <IterationFlowStep
        project={project}
        onStartExport={handleExport}
        onStartImport={handleImport}
      />
    </div>
  );
}
