import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link, FileText } from "lucide-react";

interface UploadStepProps {
  onSubmit: (data: { type: 'url' | 'file'; value: string | File }) => void;
}

export const UploadStep = ({ onSubmit }: UploadStepProps) => {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("url");

  const handleUrlSubmit = () => {
    if (url.trim()) {
      onSubmit({ type: 'url', value: url.trim() });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onSubmit({ type: 'file', value: selectedFile });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Import Your Project</CardTitle>
        <CardDescription>
          Start by providing your Lovable project URL or uploading a project file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              Project URL
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload File
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Lovable Project URL</label>
              <Input
                placeholder="https://lovable.dev/projects/your-project-id"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-12"
              />
            </div>
            <Button 
              onClick={handleUrlSubmit} 
              disabled={!url.trim()}
              className="w-full h-12"
              size="lg"
            >
              Analyze Project
            </Button>
          </TabsContent>
          
          <TabsContent value="file" className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Upload project file</p>
                  <p className="text-xs text-muted-foreground">JSON or ZIP files supported</p>
                </div>
                <input
                  type="file"
                  accept=".json,.zip"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <Button 
                  variant="outline" 
                  asChild 
                  className="cursor-pointer"
                >
                  <label htmlFor="file-upload">
                    Choose File
                  </label>
                </Button>
                {file && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};