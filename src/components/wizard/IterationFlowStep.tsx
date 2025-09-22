import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw, Download, Upload, MessageSquare } from "lucide-react";

interface IterationFlowStepProps {
  onStartExport: () => void;
  onStartImport: () => void;
}

export const IterationFlowStep = ({ onStartExport, onStartImport }: IterationFlowStepProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">🔄 Project Iteration Flow</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Perfect your Lovable projects through an iterative cycle: Export → Refine with AI → Import back to Lovable
        </p>
      </div>

      {/* Flow Visualization */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">1. Export</h3>
              <p className="text-sm text-muted-foreground">
                Take your Lovable project URL and export as JSON
              </p>
            </div>
            
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-blue-400" />
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">2. Refine</h3>
              <p className="text-sm text-muted-foreground">
                Use AI tools to improve, modify, or enhance your project structure
              </p>
            </div>
            
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-purple-400" />
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">3. Import</h3>
              <p className="text-sm text-muted-foreground">
                Import refined JSON back to create your improved Lovable project
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-all border-blue-200 hover:border-blue-300">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">🚀 Start with Export</h3>
            <p className="text-muted-foreground mb-6">
              Have an existing Lovable project? Start here to export and refine it.
            </p>
            <Button 
              onClick={onStartExport}
              className="w-full" 
              size="lg"
            >
              Export Existing Project
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all border-green-200 hover:border-green-300">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">📥 Import Refined JSON</h3>
            <p className="text-muted-foreground mb-6">
              Already have a refined JSON from AI tools? Import it to create your Lovable prompt.
            </p>
            <Button 
              onClick={onStartImport}
              variant="outline" 
              className="w-full border-green-300 hover:bg-green-50" 
              size="lg"
            >
              Import JSON
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-amber-900">💡 Why Use This Flow?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong className="text-amber-800">No Code Required:</strong>
              <p className="text-amber-700">Simple wizard interface, big buttons, clear steps</p>
            </div>
            <div>
              <strong className="text-amber-800">AI-Powered Refinement:</strong>
              <p className="text-amber-700">Use AI tools to improve your projects</p>
            </div>
            <div>
              <strong className="text-amber-800">Rapid Iteration:</strong>
              <p className="text-amber-700">Quickly test and refine ideas without starting from scratch</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};