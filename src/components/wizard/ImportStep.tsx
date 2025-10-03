import { useState } from "react";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ProjectStructure } from "@/types/project";

interface ImportStepProps {
  onImport: (project: ProjectStructure) => void;
}

export const ImportStep = ({ onImport }: ImportStepProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const ext = file.name.toLowerCase();

      if (ext.endsWith(".uap.zip")) {
        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);

        const uapFile = zip.file("uap.json");
        if (!uapFile) throw new Error("Invalid UAP: uap.json missing");

        const jsonText = await uapFile.async("string");
        const parsed = JSON.parse(jsonText);

        if (!parsed.project) throw new Error("Invalid UAP: no project found");

        onImport(parsed.project as ProjectStructure);
        setSuccess("UAP project imported successfully!");
      } else if (ext.endsWith(".json")) {
        const text = await file.text();
        const parsed = JSON.parse(text);
        onImport(parsed as ProjectStructure);
        setSuccess("JSON project imported successfully!");
      } else {
        throw new Error("Unsupported file type. Upload .json or .uap.zip");
      }
    } catch (err) {
      console.error("Import failed", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Project (Wizard)</CardTitle>
        <CardDescription>Upload a JSON or UAP export to restore a project</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="file"
          accept=".json,.zip,.uap.zip"
          onChange={handleFileUpload}
          disabled={loading}
        />
        <Button variant="outline" disabled={loading}>
          {loading ? "Importing..." : "Choose File"}
        </Button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
      </CardContent>
    </Card>
  );
};
