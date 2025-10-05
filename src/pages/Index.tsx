import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UnifiedWorkflow } from "@/components/UnifiedWorkflow";
import { AISidebar } from "@/components/AISidebar";
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const handleAnalysisComplete = (analyzedProject: ProjectStructure) => {
    console.log("Analysis complete:", analyzedProject);
    setProject(analyzedProject);
    setIsAnalyzing(false);
  };

  return (
    <>
      <div className="relative min-h-screen">
        {/* Cosmic background */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-primary/5 to-accent/10" />
        
        <div className="w-full max-w-5xl mx-auto space-y-6 px-4 py-8">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 animate-gradient" />
            <CardHeader className="text-center relative">
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                NoCodeBridge
              </CardTitle>
              <p className="text-lg font-semibold text-primary mt-2">GoNoCodeMode</p>
              <CardDescription className="mt-4">
                The bridge between all no-code and AI tools.
                <br />
                Export, import, and collaborate with Universal App Profiles (UAP).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative">
              <p className="text-muted-foreground text-center">
                Current project: <strong>{project.name}</strong>
              </p>

              {trialExpired ? (
                <div className="text-center space-y-4">
                  <p className="text-lg font-medium">Trial Expired</p>
                  <p className="text-muted-foreground">
                    Your free 1-day beta trial has ended. Unlock full access below.
                  </p>
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
            <UnifiedWorkflow onAnalysisComplete={handleAnalysisComplete} />
          )}

          {/* Footer */}
          {!trialExpired && (
            <div className="text-center space-y-2 pt-8 pb-4">
              <p className="text-sm text-muted-foreground">
                Built with ❤️ by <span className="font-semibold text-primary">GoNoCodeMode</span> (GoNoCoMoCo)
              </p>
              <p className="text-xs text-muted-foreground">
                Powered by <span className="font-semibold">UAP + IBE</span>
              </p>
              <p className="text-xs text-muted-foreground italic">
                "The bridge between all no-code and AI tools."
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Sidebar */}
      {!trialExpired && (
        <AISidebar 
          detectedPlatform={project.platform} 
          isAnalyzing={isAnalyzing}
        />
      )}
    </>
  );
}
