import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectStructure } from "@/types/project";
import { FileJson, Package, FileText, Network } from "lucide-react";

interface IterationFlowStepProps {
  project: ProjectStructure;
  onStartExport: (format: "json" | "zip" | "markdown" | "uap" | "ai-collaboration") => void;
  onStartImport?: () => void;
}

export const IterationFlowStep = ({ project, onStartExport }: IterationFlowStepProps) => {
  const [activeTab, setActiveTab] = useState("export");

  const exportOptions = [
    {
      format: "json" as const,
      title: "JSON Export",
      description: "Exact duplication, perfect for re-import",
      icon: FileJson,
      color: "bg-primary",
    },
    {
      format: "zip" as const,
      title: "ZIP Bundle",
      description: "Full project bundle with files + docs",
      icon: Package,
      color: "bg-secondary",
    },
    {
      format: "markdown" as const,
      title: "Markdown Doc",
      description: "Human + AI readable documentation",
      icon: FileText,
      color: "bg-accent",
    },
    {
      format: "uap" as const,
      title: "UAP Export",
      description: "Universal App Package for Bridge workflows",
      icon: Network,
      color: "bg-gradient-to-r from-indigo-500 to-purple-500",
    },
    {
      format: "ai-collaboration" as const,
      title: "AI Collaboration Package",
      description: "Complete runnable source for AI tools",
      icon: FileText,
      color: "bg-gradient-to-r from-pink-500 to-red-500",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
        </TabsList>

        <TabsContent value="export">
          <div className="grid gap-4">
            {exportOptions.map((option) => (
              <Card key={option.format} className="relative overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${option.color}`} />
                <CardContent className="p-6 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${option.color} text-white`}>
                      <option.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{option.title}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => onStartExport(option.format)}
                    className="flex items-center gap-2"
                  >
                    Export {option.format.toUpperCase()}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Import (Coming Soon)</CardTitle>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
