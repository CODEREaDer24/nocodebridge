import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UnifiedWorkflow } from "@/components/UnifiedWorkflow";

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-5xl mx-auto space-y-6 px-4 py-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-gray-900">
              No-Code Bridge
            </CardTitle>
            <CardDescription className="mt-4 text-gray-600">
              Paste your app URL or upload your JSON export.
              <br />
              Export, import, and collaborate with Universal App Profiles (UAP).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 text-center text-sm">
              Built with ❤️ by <span className="font-semibold">GoNoCodeMode</span> (GoNoCoMoCo)
            </p>
          </CardContent>
        </Card>

        <UnifiedWorkflow />

        <div className="text-center space-y-2 pt-8 pb-4">
          <p className="text-xs text-gray-500">
            Powered by <span className="font-semibold">UAP + IBE</span>
          </p>
          <p className="text-xs text-gray-500 italic">
            "The bridge between all no-code and AI tools."
          </p>
        </div>
      </div>
    </div>
  );
}
