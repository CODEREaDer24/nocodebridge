import { useState } from "react";
import { generateExport } from "@/utils/aiCollabExport";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ProjectStructure } from "@/types/project";

interface ExportPageProps {
  project: ProjectStructure;
}

export default function ExportPage({ project }: ExportPageProps) {
  const [downloading, setDownloading] = useState(false);

  const handleExport = async (format: "json" | "markdown" | "zip" | "ai-collaboration" | "uap") => {
    setDownloading(true);
    try {
      const blob = await generateExport(project, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.name || "project"}-${format}.${format === "json" ? "json" : format === "markdown" ? "md" : "zip"}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed", err);
      alert("Export failed: " + (err as Error).message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Export Project</CardTitle>
          <CardDescription>Download your project in different formats</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button disabled={downloading} onClick={() => handleExport("json")}>
            Export JSON
          </Button>
          <Button disabled={downloading} onClick={() => handleExport("markdown")}>
            Export Markdown
          </Button>
          <Button disabled={downloading} onClick={() => handleExport("zip")}>
            Export ZIP
          </Button>
          <Button disabled={downloading} onClick={() => handleExport("ai-collaboration")}>
            Export AI Collaboration
          </Button>
          <Button disabled={downloading} onClick={() => handleExport("uap")}>
            Export UAP
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
