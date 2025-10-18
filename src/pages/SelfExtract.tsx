import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Download, Home } from "lucide-react";
import { Link } from "react-router-dom";

const SelfExtract = () => {
  const { toast } = useToast();

  const generateSelfExtract = () => {
    const metadata = {
      meta: {
        format: "UAP",
        version: "1.0.0",
        generated_at: new Date().toISOString(),
        source: "GoNoCoMoCo / AEIOU",
        projectName: "NoCodeBridge",
        description: "Go No Code Mode Co — The AEIOU Bridge for seamless app exports and imports",
        domain: window.location.origin,
      },
      projectName: "NoCodeBridge",
      description: "Universal app package tool powered by GoNoCoMoCo and the AEIOU Framework",
      tech_stack: {
        frontend: ["React", "TypeScript", "Tailwind CSS", "Vite"],
        routing: ["React Router"],
        ui: ["shadcn/ui", "Radix UI"],
        state: ["React Hooks"],
      },
      pages: [
        { name: "Index", route: "/", description: "Main landing page" },
        { name: "Export", route: "/export", description: "Export & Analyze UAP/JSON/MD files" },
        { name: "Import", route: "/import", description: "Review & Apply UAPIMP changes" },
        { name: "HowTo", route: "/howto", description: "AEIOU Framework guide" },
        { name: "SelfExport", route: "/self-export", description: "Private export page (auth required)" },
        { name: "SelfExtract", route: "/self-extract", description: "Internal backup/export of NoCodeBridge metadata" },
      ],
      components: [
        "Button", "Card", "Textarea", "Toast", "Dialog", "Accordion",
        "StartScreen", "ProjectWizard", "ProgressBar"
      ],
      workflows: [
        {
          name: "AEIOU Export Flow",
          steps: [
            "User exports app data from their Lovable app",
            "File uploaded to NoCodeBridge /export",
            "Parsed and analyzed",
            "ChatGPT receives UAP for optimization",
            "ChatGPT creates .uapimp improvement file",
            "User imports .uapimp back to original app"
          ]
        }
      ],
      data_models: [],
      assets: [],
    };

    return JSON.stringify(metadata, null, 2);
  };

  const downloadSelfExtract = () => {
    const data = generateSelfExtract();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nocodebridge.uap`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "NoCodeBridge UAP backup saved",
    });
  };

  const selfExtractData = generateSelfExtract();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-start mb-4">
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold font-['Outfit'] bg-gradient-to-r from-[hsl(var(--gono-blue))] to-[hsl(var(--gono-lime))] bg-clip-text text-transparent">
            Self-Extractor – GoNoCoMoCo Backup
          </h1>
          <p className="text-muted-foreground">
            Creates a portable UAP snapshot of NoCodeBridge for maintenance or cloning.
          </p>
        </div>

        <Card className="p-6 space-y-4 border-[hsl(var(--gono-blue))]/30 bg-gradient-to-br from-[hsl(var(--gono-blue))]/5 to-transparent">
          <div className="space-y-2">
            <label className="text-sm font-medium">NoCodeBridge Metadata (UAP Format)</label>
            <Textarea
              value={selfExtractData}
              readOnly
              className="min-h-[400px] font-mono text-xs bg-muted"
            />
          </div>

          <Button onClick={downloadSelfExtract} size="lg" className="w-full gap-2">
            <Download className="w-4 h-4" />
            Download Self Extract (.uap)
          </Button>

          <div className="text-sm text-muted-foreground space-y-1 pt-4 border-t">
            <p className="font-semibold text-foreground">About this export:</p>
            <p>• Contains NoCodeBridge's complete structure and metadata</p>
            <p>• Can be used for backup, cloning, or documentation</p>
            <p>• UAP format compatible with AEIOU workflow</p>
            <p>• No external dependencies or API calls</p>
          </div>
        </Card>

        <div className="text-center py-8 border-t mt-8">
          <p className="text-muted-foreground font-['Inter'] text-sm">
            🚀 Powered by GoNoCoMoCo + AEIOU Framework
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelfExtract;
