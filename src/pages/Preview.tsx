import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, RefreshCw, Smartphone } from "lucide-react";

interface AppSchema {
  name: string;
  description: string;
  pages: Array<{
    name: string;
    route: string;
    components: string[];
  }>;
  theme: {
    primaryColor: string;
    typography: string;
  };
}

const Preview = () => {
  const [schema, setSchema] = useState<AppSchema | null>(null);

  useEffect(() => {
    const currentSchema = localStorage.getItem("currentSchema");
    if (currentSchema) {
      setSchema(JSON.parse(currentSchema));
    }
  }, []);

  const handleRegenerate = () => {
    window.location.href = "/";
  };

  if (!schema) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10 p-6 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No app schema found. Generate one first!</p>
          <Button onClick={() => window.location.href = "/"} className="mt-4">
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Live Preview</h1>
              <p className="text-sm text-muted-foreground">
                Visual mock preview of your app
              </p>
            </div>
          </div>
          <Button onClick={handleRegenerate} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Re-generate
          </Button>
        </div>

        <Card className="p-6 border-primary/30">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <Smartphone className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">{schema.name}</h2>
                <p className="text-sm text-muted-foreground">{schema.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Pages Flow</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {schema.pages.map((page, index) => (
                  <Card
                    key={index}
                    className="p-4 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{page.name}</h4>
                        <span className="text-xs text-muted-foreground">{page.route}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium mb-1">Components:</p>
                        <ul className="space-y-1">
                          {page.components.map((comp, i) => (
                            <li key={i} className="text-xs">• {comp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {schema.theme && (
              <div className="space-y-2 pt-4 border-t border-border">
                <h3 className="font-semibold">Theme</h3>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Primary Color:</span>{" "}
                    <span className="font-medium">{schema.theme.primaryColor}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Typography:</span>{" "}
                    <span className="font-medium">{schema.theme.typography}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border/50">
          Export. Teleport. Collaborate. — AEIOU by GoNoCoMoCo
        </div>
      </div>
    </div>
  );
};

export default Preview;
