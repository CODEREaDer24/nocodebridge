import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

interface AISidebarProps {
  detectedPlatform?: string;
  isAnalyzing?: boolean;
}

export const AISidebar = ({ detectedPlatform, isAnalyzing }: AISidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getTips = () => {
    if (isAnalyzing) {
      return [
        "🔍 Scanning your input...",
        "💡 Auto-detecting platform type",
      ];
    }

    if (detectedPlatform) {
      return [
        `✨ Working with ${detectedPlatform}`,
        "📦 Ready to export to UAP format",
        "🔄 All platforms normalize to the same schema",
      ];
    }

    return [
      "👋 Welcome to NoCodeBridge!",
      "📋 Paste a URL or upload a file to begin",
      "🌉 We'll detect your platform automatically",
      "💾 Export to JSON, Markdown, ZIP, or UAP",
    ];
  };

  const tips = getTips();

  if (isCollapsed) {
    return (
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
        <Button
          onClick={() => setIsCollapsed(false)}
          variant="outline"
          size="sm"
          className="rounded-l-lg rounded-r-none h-24 px-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 w-80 animate-slide-in-right">
      <Card className="mr-4 shadow-lg border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary animate-pulse" />
              Gemini Assistant
            </CardTitle>
            <Button
              onClick={() => setIsCollapsed(true)}
              variant="ghost"
              size="sm"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-2 rounded-lg bg-primary/5 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">{tip}</p>
            </div>
          ))}
          
          <div className="pt-3 border-t text-xs text-muted-foreground">
            <p>💡 Context-aware tips without using credits</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
