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
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Project Bridge
          </h1>
          <p className="text-3xl font-semibold text-foreground mb-2">
            Perfect your projects with AI. Export now. Refine with AI. Import later.
          </p>
          <div className="flex items-center justify-center gap-2 text-lg text-muted-foreground">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span>Export once to save credits. Refine offline. Reimport when ready.</span>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
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
        </div>

        {/* View Analysis Output */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/50 max-w-4xl mx-auto">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-foreground">
                See Analysis Output Demo
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              View real-time analysis of this project - pages, components, data models, and user flows
            </p>
            <Link to="/output-demo">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                View Live Analysis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

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

        {/* Benefits */}
        <Card className="bg-gradient-to-r from-accent to-secondary border-border max-w-5xl mx-auto">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-foreground">Independent Flows</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-primary font-semibold">Save Credits</div>
                <p className="text-sm text-muted-foreground">
                  Export once, iterate offline without burning through credits
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-primary font-semibold">AI-Powered</div>
                <p className="text-sm text-muted-foreground">
                  Use any AI tool to refine your project structure
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-primary font-semibold">Platform Agnostic</div>
                <p className="text-sm text-muted-foreground">
                  Works with multiple no-code builders, not just one
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};