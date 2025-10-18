import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, Download } from "lucide-react";

const Import = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projectData, setProjectData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (!dataParam) {
      setError("No project data in URL");
      return;
    }

    try {
      const decoded = decodeURIComponent(atob(dataParam));
      const parsed = JSON.parse(decoded);
      setProjectData(parsed);
      
      toast({
        title: "Project loaded!",
        description: "Successfully imported from share URL",
      });
    } catch (e) {
      setError("Invalid or corrupted share URL");
      toast({
        title: "Import failed",
        description: "Could not decode project data",
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

  const downloadProject = () => {
    if (!projectData) return;
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { 
      type: "application/json" 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `imported-project-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Project saved to your device",
    });
  };

  const openInLovable = () => {
    window.open("https://lovable.dev", "_blank");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-destructive/5 flex items-center justify-center p-6">
        <Card className="p-8 max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-2xl font-bold">Import Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => navigate("/")} variant="outline">
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6">
        <Card className="p-8 text-center">
          <div className="animate-pulse space-y-3">
            <div className="w-12 h-12 bg-primary/20 rounded-full mx-auto" />
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6">
      <Card className="p-8 max-w-2xl space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-block px-4 py-2 bg-[hsl(var(--gono-lime))]/20 border border-[hsl(var(--gono-lime))]/50 rounded-full mb-2">
            <span className="text-[hsl(var(--gono-lime))] font-semibold text-sm">AEIOU Flow Stage: Integrate + Unify</span>
          </div>
          <CheckCircle className="w-16 h-16 text-primary mx-auto" />
          <h2 className="text-3xl font-bold font-['Outfit']">Review & Apply (UAPIMP)</h2>
          <p className="text-lg font-['Inter']">GoNoCoMoCo AEIOU Framework</p>
          <p className="text-muted-foreground">
            Your project has been successfully loaded
          </p>
        </div>

        <div className="bg-muted p-4 rounded-lg space-y-2">
          <h3 className="font-semibold">Project Details:</h3>
          <div className="text-sm space-y-1 text-muted-foreground">
            {projectData.name && <p>• Name: {projectData.name}</p>}
            {projectData.pages && <p>• Pages: {projectData.pages.length}</p>}
            {projectData.components && <p>• Components: {projectData.components.length}</p>}
          </div>
        </div>

        <div className="flex gap-3 flex-col sm:flex-row">
          <Button onClick={downloadProject} className="flex-1 gap-2">
            <Download className="w-4 h-4" />
            Download JSON
          </Button>
          <Button onClick={openInLovable} variant="outline" className="flex-1">
            Open in Lovable
          </Button>
        </div>

        <div className="text-center">
          <Button 
            onClick={() => navigate("/")} 
            variant="ghost" 
            size="sm"
          >
            Import Another Project
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t">
          <p className="text-muted-foreground font-['Inter'] text-sm">
            🚀 Powered by GoNoCoMoCo + AEIOU Framework
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Import;
