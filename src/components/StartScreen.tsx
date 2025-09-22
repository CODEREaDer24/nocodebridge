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
        <Card className="bg-gradient-to-r from-indigo-50 to-cyan-50 border-indigo-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">🎯 Perfect for Non-Coders</h3>
            <p className="text-muted-foreground mb-4">
              Big buttons, clear steps, AI assistance - no technical knowledge required
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">Simple Wizard</span>
              <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full">AI Powered</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">No Code</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};