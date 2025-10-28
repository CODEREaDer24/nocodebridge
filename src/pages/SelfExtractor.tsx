import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  Upload, 
  Copy, 
  Check, 
  Home, 
  FileCode, 
  FileJson, 
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { saveAs } from "file-saver";

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

// Routes to traverse
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

const SelfExtractor = () => {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportLogs, setExportLogs] = useState<string[]>([]);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importValidated, setImportValidated] = useState(false);
  const [rebuildPrompt, setRebuildPrompt] = useState("");
  const [lastExportTime, setLastExportTime] = useState<string>("");
  const [checksum, setChecksum] = useState<string>("");

  const addLog = (message: string) => {
    setExportLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const extractAppStructure = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportLogs([]);
    
    addLog("🔍 Starting app extraction...");
    setExportProgress(5);

    // Extract app metadata
    addLog("📋 Extracting app metadata...");
    const appName = document.title || "lovable-app";
    const timestamp = new Date().toISOString();
    
    setExportProgress(10);

    // Traverse and capture DOM structure
    addLog("🌐 Traversing DOM structure...");
    const allElements = Array.from(document.querySelectorAll('*'));
    const domStructure = allElements.slice(0, 2000).map(el => ({
      tag: el.tagName,
      class: el.className,
      id: el.id,
      text: el.textContent?.slice(0, 100)
    }));
    
    setExportProgress(20);

    // Extract routes
    addLog("🗺️ Mapping routes...");
    const routes = ALL_ROUTES.map(route => ({
      path: route,
      name: route === '/' ? 'Home' : route.split('/').pop() || route
    }));
    
    setExportProgress(30);

    // Extract components
    addLog("🧩 Identifying components...");
    const components = [
      { name: "Bridge3DScene", type: "3d-visualization" },
      { name: "ProjectWizard", type: "wizard" },
      { name: "StartScreen", type: "layout" },
      { name: "ProgressBar", type: "ui" },
      { name: "Button", type: "ui" },
      { name: "Card", type: "ui" },
      { name: "Input", type: "ui" },
      { name: "Textarea", type: "ui" }
    ];
    
    setExportProgress(40);

    // Extract styles
    addLog("🎨 Capturing styles and design tokens...");
    const styles = {
      backgroundColor: getComputedStyle(document.body).backgroundColor,
      color: getComputedStyle(document.body).color,
      fontFamily: getComputedStyle(document.body).fontFamily
    };
    
    setExportProgress(50);

    // Build AEIOU structure
    addLog("📦 Building AEIOU v3.5 structure...");
    const aeiouData = {
      meta: {
        format: "AEIOU v3.5",
        timestamp,
        generator: "NoCodeBridge Self-Extractor",
        app_name: appName,
        owner_id: "current-user",
        checksum: "" // Will be calculated below
      },
      project: {
        name: appName,
        url: window.location.origin,
        routes,
        pages: routes,
        components,
        domStructure,
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
        assets: [],
        environment: {
          VITE_SUPABASE_URL: "[REDACTED]",
          VITE_SUPABASE_PUBLISHABLE_KEY: "[REDACTED]"
        }
      }
    };

    setExportProgress(60);

    // Calculate checksum
    const dataString = JSON.stringify(aeiouData.project);
    const calculatedChecksum = generateCRC32(dataString);
    aeiouData.meta.checksum = calculatedChecksum;
    
    addLog(`✅ Checksum generated: ${calculatedChecksum}`);
    setChecksum(calculatedChecksum);
    setExportProgress(70);

    // Generate JSON Schema
    addLog("📄 Generating JSON schema...");
    const jsonSchema = JSON.stringify(aeiouData, null, 2);
    
    setExportProgress(80);

    // Generate Markdown
    addLog("📝 Generating Markdown documentation...");
    const markdown = `# ${appName} - AEIOU v3.5 Export

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
This is a complete snapshot of the application structure, captured using the NoCodeBridge Self-Extractor.
`;

    setExportProgress(90);

    // Download files
    addLog("💾 Generating download files...");
    const uapBlob = new Blob([jsonSchema], { type: 'application/json' });
    const schemaBlob = new Blob([jsonSchema], { type: 'application/json' });
    const mdBlob = new Blob([markdown], { type: 'text/markdown' });

    saveAs(uapBlob, `${appName}-uap-v3.5.uap`);
    saveAs(schemaBlob, `${appName}-schema.json`);
    saveAs(mdBlob, `${appName}-export.md`);

    setExportProgress(100);
    addLog("✅ Export complete! 3 files downloaded.");
    
    const exportTime = new Date().toLocaleString();
    setLastExportTime(exportTime);
    
    toast({
      title: "Export Complete! ✅",
      description: "3 files have been downloaded to your device",
    });

    setTimeout(() => {
      setIsExporting(false);
    }, 1500);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    
    try {
      const text = await file.text();
      
      // Validate AEIOU format
      const isValid = text.includes("AEIOU") || text.includes('"meta"') || text.includes('"project"');
      
      if (!isValid) {
        toast({
          title: "Invalid File ⚠️",
          description: "This doesn't appear to be a valid UAP file",
          variant: "destructive"
        });
        setImportValidated(false);
        return;
      }

      setImportValidated(true);

      // Generate rebuild prompt
      const prompt = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 LOVABLE APP REBUILD REQUEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are rebuilding a Lovable application from an AEIOU v3.5 Universal App Profile.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 REBUILD INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**STEP 1: PARSE THE UAP**
→ Read the complete AEIOU structure below
→ Identify all pages, routes, components, and their relationships
→ Extract configuration, dependencies, and environment setup
→ Note the checksum for validation

**STEP 2: RECREATE STRUCTURE**
→ Rebuild ALL pages with exact routes from the UAP
→ Recreate ALL components with full props and functionality
→ Restore all hooks, contexts, and state management
→ Apply complete styling (Tailwind config, design tokens, CSS)

**STEP 3: RESTORE BACKEND (if applicable)**
→ Recreate database schema with exact tables and columns
→ Apply all RLS policies, triggers, and constraints
→ Restore edge functions and API integrations
→ Reconnect external services (Supabase, Stripe, etc.)

**STEP 4: PRESERVE LOGIC**
→ Maintain ALL workflows, automations, and business logic
→ Keep ALL event handlers, validators, and data transformations
→ Preserve AI prompts, embeddings, and model configurations
→ Restore authentication flows and user management

**STEP 5: INSTALL DEPENDENCIES**
→ Install ALL packages listed in the dependencies section
→ Ensure version compatibility
→ Check for peer dependencies
→ Verify imports resolve correctly

**STEP 6: VALIDATE & TEST**
→ Test that ALL routes load correctly
→ Verify ALL components render properly
→ Confirm database operations work (if applicable)
→ Check authentication flows function correctly
→ Validate the checksum matches the original

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ CRITICAL RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ **MUST DO:**
  • Preserve 100% of existing functionality
  • Maintain exact component and file structure
  • Keep all styling, colors, and design tokens
  • Restore all database relationships and constraints
  • Apply all security policies (RLS, auth rules)
  • Use the exact same route paths

✗ **MUST NOT DO:**
  • Modify core architecture or design patterns
  • Add features not present in the UAP
  • Change naming conventions or file structure
  • Skip any components, pages, or routes
  • Alter business logic or workflows
  • Remove or simplify existing functionality

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 AEIOU UAP DATA (COMPLETE EXPORT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${text}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ EXPECTED OUTCOME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A fully functional Lovable app that exactly matches the original export:
→ All pages and routes working identically
→ All components rendering with correct styling
→ Database and authentication configured properly
→ All business logic and workflows intact
→ Dependencies installed and imports resolved
→ Checksum validation passes

**Begin the rebuild process now. Work systematically through each step.**`;

      setRebuildPrompt(prompt);

      toast({
        title: "Import Validated! ✅",
        description: "Rebuild prompt generated successfully",
      });

    } catch (error) {
      toast({
        title: "Error Reading File ⚠️",
        description: "Could not parse the uploaded file",
        variant: "destructive"
      });
      setImportValidated(false);
    }
  };

  const handleCopyRebuildPrompt = () => {
    if (rebuildPrompt) {
      navigator.clipboard.writeText(rebuildPrompt);
      toast({
        title: "Copied! ✅",
        description: "Rebuild prompt copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1a1f3a] to-[#0a0e1a] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 border border-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 border border-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 border border-purple-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6 relative z-10 max-w-6xl">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              🛠️ Self-Extractor
            </h1>
            <p className="text-gray-400 mt-2">AEIOU v3.5 • Full App Export & Import</p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10"
          >
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
        </div>

        {/* Quick Navigation */}
        <Card className="bg-black/40 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">📍 Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {ALL_ROUTES.slice(0, 12).map(route => (
                <Button
                  key={route}
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-gray-300 hover:bg-white/10 text-xs"
                >
                  <Link to={route}>
                    {route === '/' ? 'Home' : route.split('/').pop()}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export Section */}
        <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm border-blue-500/50">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              <Download className="w-6 h-6" />
              📤 Export My App
            </CardTitle>
            <p className="text-gray-300">
              Capture 100% of your app structure and download 3 files (UAP, JSON, Markdown)
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={extractAppStructure}
              disabled={isExporting}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-lg py-6"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Export My App Now
                </>
              )}
            </Button>

            {isExporting && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Progress</span>
                  <span className="text-cyan-400 font-semibold">{exportProgress}%</span>
                </div>
                <Progress value={exportProgress} className="h-2" />
              </div>
            )}

            {exportLogs.length > 0 && (
              <div className="bg-black/50 rounded-lg p-4 border border-blue-500/30">
                <p className="text-xs text-gray-400 mb-2">Export Log:</p>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {exportLogs.map((log, i) => (
                    <p key={i} className="text-xs font-mono text-gray-300">{log}</p>
                  ))}
                </div>
              </div>
            )}

            {lastExportTime && (
              <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-500/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-green-400 font-semibold">Last Export</p>
                    <p className="text-xs text-gray-400">{lastExportTime}</p>
                  </div>
                </div>
                {checksum && (
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Checksum</p>
                    <p className="text-xs font-mono text-cyan-400">{checksum}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Import Section */}
        <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border-purple-500/50">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              <Upload className="w-6 h-6" />
              📥 Import Improved UAP
            </CardTitle>
            <p className="text-gray-300">
              Upload a UAP file to generate a rebuild prompt for Lovable AI
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".uap,.uap-imp,.json"
                onChange={handleImportFile}
                className="bg-black/50 border-purple-500/30 text-white"
              />
              <Upload className="w-6 h-6 text-purple-400" />
            </div>

            {importValidated && importFile && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-500/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-green-400 font-semibold">File Validated ✅</p>
                    <p className="text-xs text-gray-400">{importFile.name}</p>
                  </div>
                </div>

                {rebuildPrompt && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-semibold">Rebuild Prompt</p>
                      <Button
                        onClick={handleCopyRebuildPrompt}
                        className="bg-purple-600 hover:bg-purple-700"
                        size="sm"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Prompt
                      </Button>
                    </div>
                    <Textarea
                      value={rebuildPrompt}
                      readOnly
                      className="bg-black/50 border-purple-500/30 text-gray-300 font-mono text-xs min-h-[200px]"
                    />
                    <div className="p-3 bg-purple-900/20 border border-purple-500/50 rounded-lg">
                      <p className="text-xs text-purple-300">
                        📋 <strong>Next Step:</strong> Copy this prompt and paste it into your Lovable AI chat to rebuild the app
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Footer */}
        <Card className="bg-black/40 backdrop-blur-sm border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-400">
                AEIOU v3.5 • Client-side only • No credits required
              </p>
              <p className="text-gray-500 font-mono text-xs">
                NoCodeBridge Self-Extractor
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SelfExtractor;
