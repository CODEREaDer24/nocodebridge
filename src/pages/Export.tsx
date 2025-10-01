import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, Share2, Link } from "lucide-react";

const Export = () => {
  const [projectData, setProjectData] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const { toast } = useToast();

  const generateShareUrl = () => {
    if (!projectData.trim()) {
      toast({
        title: "No data to share",
        description: "Please paste your project JSON first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Validate JSON
      JSON.parse(projectData);
      
      // Encode the data in URL
      const encoded = btoa(encodeURIComponent(projectData));
      const url = `${window.location.origin}/import?data=${encoded}`;
      setShareUrl(url);
      
      toast({
        title: "Share URL generated!",
        description: "Copy and share this URL with anyone",
      });
    } catch (e) {
      toast({
        title: "Invalid JSON",
        description: "Please check your project data format",
        variant: "destructive",
      });
    }
  };

  const copyUrl = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Copied!",
      description: "Share URL copied to clipboard",
    });
  };

  const copyJson = async () => {
    if (!projectData) return;
    await navigator.clipboard.writeText(projectData);
    toast({
      title: "Copied!",
      description: "JSON copied to clipboard",
    });
  };

  const downloadJson = () => {
    if (!projectData) return;
    const blob = new Blob([projectData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lovable-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "JSON file saved to your device",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Easy Export & Share
          </h1>
          <p className="text-muted-foreground">
            Paste your project JSON → Get a shareable URL
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Project JSON</label>
            <Textarea
              placeholder="Paste your Lovable project JSON here..."
              value={projectData}
              onChange={(e) => setProjectData(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={generateShareUrl} className="gap-2">
              <Link className="w-4 h-4" />
              Generate Share URL
            </Button>
            <Button onClick={copyJson} variant="outline" className="gap-2">
              <Copy className="w-4 h-4" />
              Copy JSON
            </Button>
            <Button onClick={downloadJson} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download JSON
            </Button>
          </div>
        </Card>

        {shareUrl && (
          <Card className="p-6 space-y-4 border-primary/50">
            <div className="flex items-center gap-2 text-primary">
              <Share2 className="w-5 h-5" />
              <h3 className="font-semibold">Your Shareable URL</h3>
            </div>
            
            <div className="space-y-2">
              <Textarea
                value={shareUrl}
                readOnly
                className="font-mono text-sm bg-muted"
                rows={3}
              />
              <Button onClick={copyUrl} className="w-full gap-2">
                <Copy className="w-4 h-4" />
                Copy Share URL
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>✓ Anyone with this URL can import your project</p>
              <p>✓ No file uploads needed - just share the link!</p>
              <p>✓ Works with any no-code platform</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Export;
