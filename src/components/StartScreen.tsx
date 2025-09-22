import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Download, ArrowRight } from "lucide-react";

interface StartScreenProps {
  onSelectFlow: (flow: 'export' | 'import') => void;
}

export const StartScreen = ({ onSelectFlow }: StartScreenProps) => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Project Bridge MVP</CardTitle>
        <CardDescription className="text-lg">
          Export, refine, and re-import your Lovable projects with precision
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Project Button */}
          <Card className="cursor-pointer transition-all hover:shadow-lg border-2 hover:border-primary">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Export Project</h3>
              <p className="text-muted-foreground mb-6">
                Download your Lovable project as JSON, Markdown, or bundled UAP format for backup or collaboration.
              </p>
              <Button 
                size="lg" 
                className="w-full flex items-center gap-2"
                onClick={() => onSelectFlow('export')}
              >
                Start Export
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Import Project Button */}
          <Card className="cursor-pointer transition-all hover:shadow-lg border-2 hover:border-primary">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Import Project</h3>
              <p className="text-muted-foreground mb-6">
                Import a project from URL or file (JSON, ZIP, UAP) to create a new Lovable project.
              </p>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full flex items-center gap-2 border-success text-success hover:bg-success hover:text-white"
                onClick={() => onSelectFlow('import')}
              >
                Start Import
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Recommended:</strong> Use .uap format for best compatibility and file sharing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};