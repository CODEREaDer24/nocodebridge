import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export const NoCodeBridge = () => {
  const [url, setUrl] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckUrl = async () => {
    if (!url.trim()) {
      setOutput("Please enter a URL");
      return;
    }

    setIsLoading(true);
    setOutput("Checking URL...");

    try {
      const response = await fetch(url);
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setOutput(JSON.stringify(data, null, 2));
      } else {
        setOutput("This link doesn't return JSON — please upload your exported app file instead.");
      }
    } catch (error) {
      setOutput("Unable to fetch this URL. Some sites block direct access.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setOutput("Please upload a .json file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        setOutput(JSON.stringify(parsed, null, 2));
      } catch (error) {
        setOutput("Error: Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">No-Code Bridge</CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Paste your app URL or upload your JSON export.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">App URL</label>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/api/app"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleCheckUrl()}
              />
              <Button 
                onClick={handleCheckUrl} 
                disabled={isLoading}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                {isLoading ? "Checking..." : "Check URL"}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Or Upload JSON File</label>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button
                variant="outline"
                className="w-full border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-700"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose JSON file
              </Button>
            </div>
          </div>

          {output && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Results</label>
              <div className="w-full h-64 overflow-auto bg-gray-50 rounded-lg border border-gray-200 p-4">
                <pre className="text-sm text-gray-900 whitespace-pre-wrap font-mono">
                  {output}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
