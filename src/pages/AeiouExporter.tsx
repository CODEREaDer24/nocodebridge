import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, Zap, FileJson, FileText, Package } from "lucide-react";

type ExportFormat = "json" | "markdown" | "uap";

const AeiouExporter = () => {
  const [format, setFormat] = useState<ExportFormat>("json");
  const [exportData, setExportData] = useState("");
  const [schema, setSchema] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const currentSchema = localStorage.getItem("currentSchema");
    if (currentSchema) {
      setSchema(JSON.parse(currentSchema));
      generateExport(JSON.parse(currentSchema), format);
    }
  }, []);

  useEffect(() => {
    if (schema) {
      generateExport(schema, format);
    }
  }, [format, schema]);

  const generateExport = (schemaData: any, exportFormat: ExportFormat) => {
    switch (exportFormat) {
      case "json":
        setExportData(JSON.stringify(schemaData, null, 2));
        break;
      case "markdown":
        setExportData(generateMarkdown(schemaData));
        break;
      case "uap":
        setExportData(JSON.stringify(generateUAP(schemaData), null, 2));
        break;
    }
  };

  const generateMarkdown = (schemaData: any) => {
    const lines: string[] = [];
    lines.push(`# ${schemaData.name || "AEIOU App Export"}`);
    lines.push("");
    lines.push(`**Description:** ${schemaData.description || "No description"}`);
    lines.push(`**Generated:** ${new Date().toISOString()}`);
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push("## 📄 Pages");
    lines.push("");
    if (schemaData.pages) {
      schemaData.pages.forEach((page: any) => {
        lines.push(`### ${page.name}`);
        lines.push(`- **Route:** \`${page.route}\``);
        lines.push(`- **Components:** ${page.components.join(", ")}`);
        lines.push("");
      });
    }
    lines.push("---");
    lines.push("");
    lines.push("## 🎨 Theme");
    if (schemaData.theme) {
      lines.push(`- **Primary Color:** ${schemaData.theme.primaryColor}`);
      lines.push(`- **Typography:** ${schemaData.theme.typography}`);
    }
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push("**AEIOU Exporter v1.0 – Powered by GoNoCoMoCo | NoCodeBridge Teleporter**");
    return lines.join("\n");
  };

  const generateUAP = (schemaData: any) => {
    return {
      format: "UAP",
      version: "1.0",
      metadata: {
        name: schemaData.name || "Untitled App",
        description: schemaData.description || "",
        exportedAt: new Date().toISOString(),
        exportedBy: "AEIOU Exporter",
        size: JSON.stringify(schemaData).length,
      },
      structure: {
        pages: schemaData.pages || [],
        components: schemaData.components || [],
        theme: schemaData.theme || {},
      },
      teleportation: {
        compatible: ["Lovable", "ChatGPT", "Claude", "Custom AI"],
        protocol: "AEIOU-Universal",
      },
    };
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportData);
    toast({
      title: "Copied!",
      description: `${format.toUpperCase()} copied to clipboard`,
    });
  };

  const handleDownload = () => {
    const extension = format === "markdown" ? "md" : "json";
    const mimeType = format === "markdown" ? "text/markdown" : "application/json";
    const filename = `aeiou-export-${Date.now()}.${extension}`;

    const blob = new Blob([exportData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: `${format.toUpperCase()} file saved`,
    });
  };

  const getFormatIcon = () => {
    switch (format) {
      case "json":
        return <FileJson className="w-5 h-5" />;
      case "markdown":
        return <FileText className="w-5 h-5" />;
      case "uap":
        return <Package className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Zap className="w-10 h-10 text-primary animate-pulse" />
          <div>
            <h1 className="text-3xl font-bold">AEIOU Exporter</h1>
            <p className="text-sm text-muted-foreground">
              Universal App Export Tool
            </p>
          </div>
        </div>

        <Card className="p-6 border-primary/30 bg-primary/5">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Export Your Project's Soul</h3>
            <p className="text-sm text-muted-foreground">
              Export your app schema for AI collaboration, teleportation, or backup.
              Choose your preferred format and share with any AI assistant or development tool.
            </p>
          </div>
        </Card>

        <Card className="p-6 border-primary/30">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Export Format</label>
                <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">
                      <div className="flex items-center gap-2">
                        <FileJson className="w-4 h-4" />
                        JSON - Raw Schema
                      </div>
                    </SelectItem>
                    <SelectItem value="markdown">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Markdown - Human Readable
                      </div>
                    </SelectItem>
                    <SelectItem value="uap">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        UAP - Universal App Profile
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getFormatIcon()}
                <label className="text-sm font-medium">
                  {format === "json" && "JSON Export"}
                  {format === "markdown" && "Markdown Export"}
                  {format === "uap" && "UAP Export"}
                </label>
              </div>
              <Textarea
                value={exportData}
                readOnly
                className="min-h-[400px] font-mono text-sm bg-muted"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCopy} className="gap-2">
                <Copy className="w-4 h-4" />
                Copy to Clipboard
              </Button>
              <Button onClick={handleDownload} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download File
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-primary/20 bg-muted/50">
          <div className="text-sm space-y-1">
            <p className="font-semibold">Export Information:</p>
            <p className="text-muted-foreground">
              • <strong>JSON:</strong> Complete raw schema for programmatic use
            </p>
            <p className="text-muted-foreground">
              • <strong>Markdown:</strong> Human-readable documentation for AI assistants
            </p>
            <p className="text-muted-foreground">
              • <strong>UAP:</strong> Universal App Profile with metadata and teleportation info
            </p>
          </div>
        </Card>

        <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border/50">
          AEIOU Exporter v1.0 – Powered by GoNoCoMoCo | NoCodeBridge Teleporter
        </div>
      </div>
    </div>
  );
};

export default AeiouExporter;
