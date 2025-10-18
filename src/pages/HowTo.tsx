import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Home, Sparkles, Download, RefreshCw, Upload } from "lucide-react";

const HowTo = () => {
  const copyCode = () => {
    const code = `Create an "Export" page in this app that:
- Exports a UAP file (Universal App Package)
- No ZIPs
- Costs 0 credits after creation
- Includes Copy Markdown + Download UAP buttons`;
    
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,hsl(var(--gono-navy)),hsl(var(--gono-blue)))] p-8 relative overflow-hidden">
      {/* Circuit background animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-[hsl(var(--gono-lime))] rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-[hsl(var(--gono-blue))] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-[hsl(var(--gono-coral))] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Navigation */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-[hsl(var(--gono-lime))]/20 border border-[hsl(var(--gono-lime))]/50 rounded-full mb-4">
            <span className="text-[hsl(var(--gono-lime))] font-semibold text-sm">AEIOU Framework</span>
          </div>
          <h1 className="text-5xl font-['Outfit'] font-bold text-white mb-4">
            AEIOU: The No-Code Loop
          </h1>
          <p className="text-2xl text-white/80 font-['Inter']">
            Build. Export. Improve. Import. Repeat.
          </p>
        </div>

        {/* What is AEIOU */}
        <Card className="mb-8 bg-card/80 backdrop-blur-sm border-white/20 shadow-[0_0_40px_hsl(var(--gono-blue))/0.2]">
          <CardHeader>
            <CardTitle className="text-2xl font-['Outfit'] flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[hsl(var(--gono-lime))]" />
              What is AEIOU?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 font-['Inter']">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[hsl(var(--gono-blue))]/10 rounded-lg border border-[hsl(var(--gono-blue))]/30">
                <div className="text-[hsl(var(--gono-blue))] font-bold text-lg mb-2">A</div>
                <p className="text-foreground"><strong>Artificial Enhancement</strong></p>
                <p className="text-sm text-muted-foreground">AI-powered analysis and optimization</p>
              </div>
              <div className="p-4 bg-[hsl(var(--gono-lime))]/10 rounded-lg border border-[hsl(var(--gono-lime))]/30">
                <div className="text-[hsl(var(--gono-lime))] font-bold text-lg mb-2">E</div>
                <p className="text-foreground"><strong>Extract</strong></p>
                <p className="text-sm text-muted-foreground">Export your app's complete structure</p>
              </div>
              <div className="p-4 bg-[hsl(var(--gono-coral))]/10 rounded-lg border border-[hsl(var(--gono-coral))]/30">
                <div className="text-[hsl(var(--gono-coral))] font-bold text-lg mb-2">I</div>
                <p className="text-foreground"><strong>Integrate</strong></p>
                <p className="text-sm text-muted-foreground">Import improvements seamlessly</p>
              </div>
              <div className="p-4 bg-[hsl(var(--gono-blue))]/10 rounded-lg border border-[hsl(var(--gono-blue))]/30">
                <div className="text-[hsl(var(--gono-blue))] font-bold text-lg mb-2">O</div>
                <p className="text-foreground"><strong>Optimize</strong></p>
                <p className="text-sm text-muted-foreground">Refine with AI collaboration</p>
              </div>
              <div className="p-4 bg-[hsl(var(--gono-lime))]/10 rounded-lg border border-[hsl(var(--gono-lime))]/30 md:col-span-2">
                <div className="text-[hsl(var(--gono-lime))] font-bold text-lg mb-2">U</div>
                <p className="text-foreground"><strong>Unify</strong></p>
                <p className="text-sm text-muted-foreground">Bring everything together in one universal format</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* The Flow */}
        <Card className="mb-8 bg-card/80 backdrop-blur-sm border-white/20 shadow-[0_0_40px_hsl(var(--gono-blue))/0.2]">
          <CardHeader>
            <CardTitle className="text-2xl font-['Outfit'] flex items-center gap-2">
              <RefreshCw className="w-6 h-6 text-[hsl(var(--gono-blue))]" />
              The GoNoCoMoCo Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 font-['Inter']">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[hsl(var(--gono-blue))] flex items-center justify-center text-white font-bold shadow-[0_0_20px_hsl(var(--gono-blue))/0.5]">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">Your App → Export (UAP)</p>
                  <p className="text-sm text-muted-foreground">Extract your complete app structure in Universal App Package format</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="text-[hsl(var(--gono-lime))] text-3xl">↓</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[hsl(var(--gono-lime))] flex items-center justify-center text-black font-bold shadow-[0_0_20px_hsl(var(--gono-lime))/0.5]">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">GoNoCoMoCo (NoCodeBridge)</p>
                  <p className="text-sm text-muted-foreground">The universal translator for no-code apps</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="text-[hsl(var(--gono-coral))] text-3xl">↓</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[hsl(var(--gono-coral))] flex items-center justify-center text-white font-bold shadow-[0_0_20px_hsl(var(--gono-coral))/0.5]">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">ChatGPT / AI (Creates .UAPIMP)</p>
                  <p className="text-sm text-muted-foreground">AI analyzes, improves, and generates upgrade package</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="text-[hsl(var(--gono-blue))] text-3xl">↓</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[hsl(var(--gono-blue))] flex items-center justify-center text-white font-bold shadow-[0_0_20px_hsl(var(--gono-blue))/0.5]">
                  4
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">Import → Your App (Upgraded)</p>
                  <p className="text-sm text-muted-foreground">Review changes in plain English and apply improvements</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add to Your App */}
        <Card className="mb-8 bg-gradient-to-br from-[hsl(var(--gono-lime))]/20 to-transparent backdrop-blur-sm border-[hsl(var(--gono-lime))]/50 shadow-[0_0_40px_hsl(var(--gono-lime))/0.2]">
          <CardHeader>
            <CardTitle className="text-2xl font-['Outfit'] flex items-center gap-2">
              <Download className="w-6 h-6 text-[hsl(var(--gono-lime))]" />
              Add AEIOU Export to Your Lovable Apps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 font-['Inter']">
            <p className="text-foreground">
              Copy this instruction and paste it into any Lovable app to add UAP export functionality:
            </p>
            <div className="bg-black/50 p-4 rounded-lg border border-white/20">
              <pre className="text-sm text-white whitespace-pre-wrap font-mono">
{`Create an "Export" page in this app that:
- Exports a UAP file (Universal App Package)
- No ZIPs
- Costs 0 credits after creation
- Includes Copy Markdown + Download UAP buttons`}
              </pre>
            </div>
            <Button 
              onClick={copyCode}
              className="w-full bg-[hsl(var(--gono-lime))] hover:bg-[hsl(var(--gono-lime))]/90 text-black shadow-[0_0_20px_hsl(var(--gono-lime))/0.3] hover:shadow-[0_0_30px_hsl(var(--gono-lime))/0.5]"
            >
              Copy Instructions
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/10">
          <p className="text-white/70 font-['Inter'] text-sm">
            🚀 GoNoCoMoCo | Powered by AEIOU Framework
          </p>
          <p className="text-white/50 text-xs mt-2">
            Build smarter, ship faster, spend fewer credits.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowTo;
