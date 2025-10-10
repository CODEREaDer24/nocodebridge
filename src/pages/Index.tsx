import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { IterationFlowStep } from "@/components/wizard/IterationFlowStep";
import { ProjectStructure } from "@/types/project";

const initialProject: ProjectStructure = {
  name: "New Project",
  description: "Start building with NoCodeBridge",
  components: [],
  pages: [],
  data: {},
};

export default function IndexPage() {
  const [project, setProject] = useState<ProjectStructure>(initialProject);
  const [trialExpired, setTrialExpired] = useState(false);

  useEffect(() => {
    const trialStart = localStorage.getItem("trialStart");
    if (!trialStart) {
      localStorage.setItem("trialStart", Date.now().toString());
    } else {
      const started = parseInt(trialStart, 10);
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      if (now - started > oneDay) {
        setTrialExpired(true);
      }
    }
  }, []);

  const handleExport = (format: string, data?: string) => {
    console.log("Export requested:", format, data);
  };

  const handleImport = (importedProject: ProjectStructure) => {
    console.log("Import successful:", importedProject);
    setProject(importedProject);
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
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Current project: <strong>{project.name}</strong>
          </p>

          {trialExpired ? (
            <div className="text-center space-y-4">
              <p className="text-lg font-medium">Trial Expired</p>
              <p className="text-muted-foreground">
                Your free 1-day beta trial has ended. Unlock full access below.
              </p>
              {/* ✅ Embedded Stripe Checkout */}
              <iframe
                src="https://buy.stripe.com/3cI3cw6Rp9Fmfy66rP0sU0n"
                style={{ width: "100%", minHeight: "700px", border: "none" }}
              />
            </div>
          ) : (
            <p className="text-green-600 font-medium text-center">
              ✅ You are in your free 1-day beta trial
            </p>
          )}
        </CardContent>
      </Card>

      {!trialExpired && (
        <IterationFlowStep
          project={project}
          onStartExport={handleExport}
          onStartImport={handleImport}
        />
      )}
    </div>
  );
}
