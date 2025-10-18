import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, ArrowRight, Sparkles, Zap, FileText } from "lucide-react";
import { FlowType } from "@/types/project";
import { Link } from "react-router-dom";

interface StartScreenProps {
  onSelectFlow: (flow: FlowType) => void;
}

export const StartScreen = ({ onSelectFlow }: StartScreenProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-block px-4 py-2 bg-[hsl(var(--gono-blue))]/20 border border-[hsl(var(--gono-blue))]/50 rounded-full mb-4">
            <span className="text-[hsl(var(--gono-blue))] font-semibold text-sm">AEIOU Framework</span>
          </div>
          <h1 className="text-6xl font-['Outfit'] font-bold mb-4 bg-gradient-to-r from-[hsl(var(--gono-blue))] to-[hsl(var(--gono-lime))] bg-clip-text text-transparent">
            Go No Code Mode Co
          </h1>
          <p className="text-3xl font-['Inter'] font-semibold text-foreground mb-2">
            The AEIOU Bridge
          </p>
          <p className="text-xl text-muted-foreground mb-4">
            Export. Teleport. Collaborate.
          </p>
          <div className="flex items-center justify-center gap-2 text-lg text-muted-foreground">
            <Sparkles className="w-5 h-5 text-[hsl(var(--gono-lime))]" />
            <span className="font-['Inter']">Build smarter, ship faster, spend fewer credits.</span>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Export Flow */}
          <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <Download className="w-12 h-12 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground">Export Project</h3>
                <p className="text-muted-foreground text-lg">
                  Extract your project into structured files for AI refinement
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-sm space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-muted-foreground">Paste project URL or upload file</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-muted-foreground">Get JSON blueprint + Markdown summary</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-muted-foreground">Refine offline with your preferred AI</span>
                  </div>
                </div>
                <Button 
                  onClick={() => onSelectFlow('export')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                  size="lg"
                >
                  Start Export
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Import Flow */}
          <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-12 h-12 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground">Import Project</h3>
                <p className="text-muted-foreground text-lg">
                  Turn your refined JSON into builder-ready prompts
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-sm space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-muted-foreground">Upload refined JSON or ZIP file</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-muted-foreground">Generate builder-friendly prompts</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-muted-foreground">Copy & paste into any no-code builder</span>
                  </div>
                </div>
                <Button 
                  onClick={() => onSelectFlow('import')}
                  variant="outline"
                  className="w-full border-green-500 text-green-400 hover:bg-green-500 hover:text-white" 
                  size="lg"
                >
                  Start Import
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* UAP Export/Import */}
          <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-[hsl(var(--gono-coral))] to-orange-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground">🔄 UAP Export / Import</h3>
                <p className="text-muted-foreground text-lg">
                  Upload extractor files or export NoCodeBridge data
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-sm space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-[hsl(var(--gono-coral))] rounded-full"></div>
                    <span className="text-muted-foreground">Upload .uap, .json, or .md files</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-[hsl(var(--gono-coral))] rounded-full"></div>
                    <span className="text-muted-foreground">View project summaries</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-[hsl(var(--gono-coral))] rounded-full"></div>
                    <span className="text-muted-foreground">Export as UAP format</span>
                  </div>
                </div>
                <Button 
                  asChild
                  variant="outline"
                  className="w-full border-[hsl(var(--gono-coral))] text-[hsl(var(--gono-coral))] hover:bg-[hsl(var(--gono-coral))] hover:text-white" 
                  size="lg"
                >
                  <Link to="/export">
                    Open UAP Tool
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Supported Platforms */}
        <Card className="bg-card border-border max-w-4xl mx-auto">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Works with Multiple No-Code Builders
            </h3>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="px-4 py-2 bg-accent rounded-full">Lovable</span>
              <span className="px-4 py-2 bg-accent rounded-full">Webflow</span>
              <span className="px-4 py-2 bg-accent rounded-full">Bubble</span>
              <span className="px-4 py-2 bg-accent rounded-full">And More</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Button variant="outline" asChild>
            <Link to="/howto" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              How AEIOU Works
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/style-preview" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              View Theme
            </Link>
          </Button>
        </div>

        {/* Benefits */}
        <Card className="bg-gradient-to-r from-accent to-secondary border-border max-w-5xl mx-auto">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <Sparkles className="w-8 h-8 text-[hsl(var(--gono-lime))] mx-auto mb-3" />
              <h3 className="text-xl font-['Outfit'] font-semibold text-foreground">AEIOU-Powered Workflow</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center font-['Inter']">
              <div className="space-y-2">
                <div className="text-[hsl(var(--gono-blue))] font-semibold">Save Credits</div>
                <p className="text-sm text-muted-foreground">
                  Export once, iterate offline without burning through credits
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-[hsl(var(--gono-lime))] font-semibold">AI-Enhanced</div>
                <p className="text-sm text-muted-foreground">
                  Use any AI tool to refine your project structure
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-[hsl(var(--gono-coral))] font-semibold">Universal Format</div>
                <p className="text-sm text-muted-foreground">
                  UAP format works across platforms - no vendor lock-in
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-muted-foreground font-['Inter'] text-sm">
            🚀 Powered by GoNoCoMoCo + AEIOU Framework
          </p>
        </div>
      </div>
    </div>
  );
};