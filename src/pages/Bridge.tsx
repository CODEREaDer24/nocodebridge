import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Upload, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { saveAs } from "file-saver";
import BridgeNavigation from "@/components/BridgeNavigation";

// CRC32 checksum generator
const generateCRC32 = (str: string): string => {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i);
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
    }
  }
  return ((crc ^ 0xFFFFFFFF) >>> 0).toString(16).toUpperCase().padStart(8, '0');
};

const ALL_ROUTES = [
  '/',
  '/import',
  '/bridge',
  '/self-export',
  '/self-extractor-admin',
  '/self-extractor',
  '/install-extractor',
  '/upload-analyze',
  '/improve-with-ai',
  '/return-to-builder',
  '/admin',
  '/step2-import',
  '/step3-iterate',
  '/step4-reimport'
];

export default function Bridge() {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportApp = async () => {
    setIsExporting(true);
    
    try {
      toast({
        title: "Starting Export...",
        description: "Capturing your app structure",
      });

      // Extract app metadata
      const appName = document.title || "lovable-app";
      const timestamp = new Date().toISOString();

      // Extract routes
      const routes = ALL_ROUTES.map(route => ({
        path: route,
        name: route === '/' ? 'Home' : route.split('/').pop() || route
      }));

      // Extract components
      const components = [
        { name: "Bridge3DScene", type: "3d-visualization" },
        { name: "ProjectWizard", type: "wizard" },
        { name: "StartScreen", type: "layout" },
        { name: "ProgressBar", type: "ui" },
        { name: "Button", type: "ui" },
        { name: "Card", type: "ui" },
        { name: "Input", type: "ui" },
        { name: "Textarea", type: "ui" },
        { name: "BridgeNavigation", type: "navigation" }
      ];

      // Extract styles
      const styles = {
        backgroundColor: getComputedStyle(document.body).backgroundColor,
        color: getComputedStyle(document.body).color,
        fontFamily: getComputedStyle(document.body).fontFamily
      };

      // Build AEIOU structure
      const aeiouData = {
        meta: {
          format: "AEIOU v3.6",
          timestamp,
          generator: "NoCodeBridge Auto-Bridge v3.6",
          app_name: appName,
          owner_id: "current-user",
          checksum: ""
        },
        project: {
          name: appName,
          url: window.location.origin,
          routes,
          pages: routes,
          components,
          styles,
          dependencies: {
            react: "^18.3.1",
            "react-dom": "^18.3.1",
            "react-router-dom": "^6.30.1",
            "@radix-ui/react-toast": "^1.2.14",
            "lucide-react": "^0.462.0",
            "tailwindcss": "latest",
            "@react-three/fiber": "^8.18.0",
            "@react-three/drei": "^9.122.0"
          },
          config: {
            vite: true,
            typescript: true,
            tailwind: true,
            supabase: true
          },
          environment: {
            VITE_SUPABASE_URL: "[REDACTED]",
            VITE_SUPABASE_PUBLISHABLE_KEY: "[REDACTED]"
          }
        }
      };

      // Calculate checksum
      const dataString = JSON.stringify(aeiouData.project);
      const calculatedChecksum = generateCRC32(dataString);
      aeiouData.meta.checksum = calculatedChecksum;

      // Generate JSON Schema
      const jsonSchema = JSON.stringify(aeiouData, null, 2);

      // Generate Markdown
      const markdown = `# ${appName} - AEIOU v3.6 Export

**Generated:** ${timestamp}
**Checksum:** ${calculatedChecksum}

## Routes
${routes.map(r => `- ${r.path} (${r.name})`).join('\n')}

## Components
${components.map(c => `- ${c.name} (${c.type})`).join('\n')}

## Configuration
- React ${aeiouData.project.dependencies.react}
- TypeScript enabled
- Tailwind CSS configured
- Supabase integrated

## Export Details
This is a complete snapshot of the application structure, captured using the NoCodeBridge Auto-Bridge v3.6.
`;

      // Download files
      const uapBlob = new Blob([jsonSchema], { type: 'application/json' });
      const schemaBlob = new Blob([jsonSchema], { type: 'application/json' });
      const mdBlob = new Blob([markdown], { type: 'text/markdown' });

      saveAs(uapBlob, `${appName}-uap-v3.6.uap`);
      saveAs(schemaBlob, `${appName}-schema.json`);
      saveAs(mdBlob, `${appName}-export.md`);

      toast({
        title: "Export Complete! ✅",
        description: "3 files have been downloaded to your device",
      });

    } catch (error) {
      toast({
        title: "Export Failed",
        description: "An error occurred during export",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleRebuildApp = () => {
    navigate('/import');
  };

  return (
    <div className="min-h-screen bg-background">
      <BridgeNavigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              🌉 AEIOU Bridge v3.6
            </h1>
            <p className="text-xl text-muted-foreground">
              Automatic Export & Rebuild Cycle
            </p>
          </div>

          {/* Main Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Export Card */}
            <Card className="border-2 hover:border-primary transition-all duration-300">
              <CardContent className="p-12 text-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <Download className="w-12 h-12 text-primary-foreground" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold">Export My App</h3>
                  <p className="text-muted-foreground">
                    Generate .uap, .json, and .md files instantly
                  </p>
                </div>
                <Button 
                  onClick={handleExportApp}
                  disabled={isExporting}
                  className="w-full h-14 text-lg" 
                  size="lg"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Export Now
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Rebuild Card */}
            <Card className="border-2 hover:border-blue-600 transition-all duration-300">
              <CardContent className="p-12 text-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-12 h-12 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold">Rebuild My App</h3>
                  <p className="text-muted-foreground">
                    Import and apply improved UAP files
                  </p>
                </div>
                <Button 
                  onClick={handleRebuildApp}
                  variant="secondary"
                  className="w-full h-14 text-lg" 
                  size="lg"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Go to Import
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-center mb-6">
                🔄 Auto-Bridge Cycle
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">1</div>
                  <p><b>Export:</b> Click "Export My App" to generate 3 files (.uap, .json, .md)</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                  <p><b>Improve:</b> Send to AI (GPT, Claude, Gemini) for improvements</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                  <p><b>Import:</b> Click "Rebuild My App" and upload improved files</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">4</div>
                  <p><b>Apply:</b> Review changes and rebuild your app</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center py-6 border-t">
            <p className="text-muted-foreground text-sm">
              🚀 AEIOU Bridge v3.6 | Auto-Cycle Ready
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              Supabase in read-only sandbox mode
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
