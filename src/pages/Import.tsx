import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Upload, Copy, ArrowLeft } from "lucide-react";

const Import = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projectData, setProjectData] = useState<any>(null);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['.uap', '.json', '.md'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .uap, .json, or .md file",
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);

    try {
      const content = await file.text();
      
      if (fileExtension === '.md') {
        // For markdown, create a simple structure
        setProjectData({
          meta: {
            format: "Markdown",
            source: file.name,
          },
          summary: content,
        });
      } else {
        // For JSON/UAP
        const parsed = JSON.parse(content);
        setProjectData(parsed);
      }

      toast({
        title: "File loaded!",
        description: `Successfully imported ${file.name}`,
      });
    } catch (e) {
      toast({
        title: "Parse error",
        description: "Could not read or parse the file",
        variant: "destructive",
      });
    }
  };

  const copySummary = () => {
    if (!projectData) return;
    
    const summary = projectData.summary_markdown || projectData.summary || JSON.stringify(projectData, null, 2);
    navigator.clipboard.writeText(summary);
    
    toast({
      title: "Copied!",
      description: "Summary copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--gono-navy))] flex items-center justify-center p-6">
      <Card className="p-8 max-w-4xl w-full space-y-6 bg-background/95 border-[hsl(var(--gono-electric-blue))]/30">
        {/* Header */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-4xl font-bold font-['Outfit'] text-[hsl(var(--gono-electric-blue))]">
            Import Project Data
          </h1>
          <p className="text-muted-foreground font-['Inter']">
            Upload your exported app data (.uap, .json, or .md) to view the project summary
          </p>
        </div>

        {/* Upload Section */}
        {!projectData && (
          <div className="border-2 border-dashed border-[hsl(var(--gono-electric-blue))]/30 rounded-lg p-12 text-center space-y-4">
            <Upload className="w-16 h-16 text-[hsl(var(--gono-electric-blue))] mx-auto" />
            <div>
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-lg font-semibold text-[hsl(var(--gono-electric-blue))]">
                  Click to upload
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  .uap, .json, or .md files only
                </p>
              </label>
              <Input
                id="file-upload"
                type="file"
                accept=".uap,.json,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* Project Summary */}
        {projectData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-['Outfit'] text-[hsl(var(--gono-electric-blue))]">
                Project Summary
              </h2>
              <Button onClick={copySummary} variant="outline" size="sm" className="gap-2">
                <Copy className="w-4 h-4" />
                Copy Summary
              </Button>
            </div>

            {/* Metadata Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectData.meta?.name || projectData.name ? (
                <Card className="p-4 bg-muted/50">
                  <p className="text-sm text-muted-foreground">Project Name</p>
                  <p className="text-lg font-semibold">{projectData.meta?.name || projectData.name}</p>
                </Card>
              ) : null}
              
              {projectData.meta?.domain || projectData.domain ? (
                <Card className="p-4 bg-muted/50">
                  <p className="text-sm text-muted-foreground">Domain / URL</p>
                  <p className="text-lg font-semibold">{projectData.meta?.domain || projectData.domain}</p>
                </Card>
              ) : null}
              
              {projectData.meta?.generated_at || projectData.exported_at ? (
                <Card className="p-4 bg-muted/50">
                  <p className="text-sm text-muted-foreground">Exported Date</p>
                  <p className="text-lg font-semibold">
                    {new Date(projectData.meta?.generated_at || projectData.exported_at).toLocaleString()}
                  </p>
                </Card>
              ) : null}
              
              {projectData.pages || projectData.components ? (
                <Card className="p-4 bg-muted/50">
                  <p className="text-sm text-muted-foreground">Components</p>
                  <p className="text-lg font-semibold">
                    {projectData.pages?.length || 0} pages, {projectData.components?.length || 0} components
                  </p>
                </Card>
              ) : null}
            </div>

            {/* Description */}
            {(projectData.meta?.description || projectData.description) && (
              <Card className="p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-base">{projectData.meta?.description || projectData.description}</p>
              </Card>
            )}

            {/* Full Summary */}
            <Card className="p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground mb-3">Full Summary</p>
              <ScrollArea className="h-[300px] w-full rounded border bg-background p-4">
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  {projectData.summary_markdown || projectData.summary || JSON.stringify(projectData, null, 2)}
                </pre>
              </ScrollArea>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setProjectData(null);
                  setFileName("");
                }}
                variant="outline"
                className="flex-1"
              >
                Upload Another File
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-6 border-t border-border/50">
          <p className="text-sm text-muted-foreground font-['Inter']">
            Ready for AI Collaboration or return trip to NoCodeBridge.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            🚀 Powered by GoNoCoMoCo + AEIOU Framework
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Import;
