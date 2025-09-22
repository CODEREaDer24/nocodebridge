import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, ArrowRight, Sparkles, RefreshCw } from "lucide-react";
import { FlowType } from "@/types/project";
import { IterationFlowStep } from "./wizard/IterationFlowStep";

interface StartScreenProps {
  onSelectFlow: (flow: FlowType) => void;
}

export const StartScreen = ({ onSelectFlow }: StartScreenProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Project Bridge MVP
        </h1>
        <p className="text-2xl text-muted-foreground max-w-4xl mx-auto">
          The easiest way to iterate on Lovable projects using AI. No code required.
        </p>
      </div>

      <IterationFlowStep 
        onStartExport={() => onSelectFlow('export')}
        onStartImport={() => onSelectFlow('import')}
      />

      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-100">🎯 Perfect for Iteration</h3>
            <p className="text-slate-300 mb-4">
              Streamlined workflow for refining and improving your Lovable projects
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="px-3 py-1 bg-blue-600 text-blue-100 rounded-full">Export</span>
              <span className="px-3 py-1 bg-purple-600 text-purple-100 rounded-full">Refine</span>
              <span className="px-3 py-1 bg-green-600 text-green-100 rounded-full">Import</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};