import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Zap, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateAppFromIdea } from "@/utils/appGenerator";

const Home = () => {
  const [idea, setIdea] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!idea.trim()) {
      toast({
        title: "Idea required",
        description: "Please describe your app idea first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const schema = await generateAppFromIdea(idea);
      localStorage.setItem("currentSchema", JSON.stringify(schema));
      
      // Add to history
      const history = JSON.parse(localStorage.getItem("appHistory") || "[]");
      history.unshift({
        id: Date.now().toString(),
        idea,
        schema,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("appHistory", JSON.stringify(history.slice(0, 20)));

      toast({
        title: "App generated!",
        description: "Your app schema is ready",
      });

      navigate("/schema");
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 pt-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-12 h-12 text-primary animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              App-Maker AEIOU
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Describe your idea in plain English and generate your app instantly.
          </p>
          <p className="text-sm text-primary/80 font-medium">
            Artificial Environment Enabling Interoperable Osmosis & Universalization
          </p>
        </div>

        {/* Main Input Card */}
        <Card className="p-8 border-primary/30 bg-card/50 backdrop-blur">
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">Your App Idea</label>
            <Textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Type your idea… (e.g., 'A task manager with categories, due dates, and priority levels')"
              className="min-h-[200px] text-base resize-none"
            />
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              size="lg"
              className="w-full gap-2"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate App
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-6 border-primary/20 bg-primary/5">
          <div className="flex items-start gap-4">
            <Database className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Each App Includes AEIOU Exporter</h3>
              <p className="text-sm text-muted-foreground">
                Every generated app automatically includes the AEIOU Export Tool, enabling you to:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Export complete app schema in JSON format</li>
                <li>• Generate AI-readable Markdown documentation</li>
                <li>• Create Universal App Profile (UAP) for interoperability</li>
                <li>• Share and collaborate with AI assistants</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border/50">
          Export. Teleport. Collaborate. — AEIOU by GoNoCoMoCo
        </div>
      </div>
    </div>
  );
};

export default Home;
