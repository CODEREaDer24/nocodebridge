import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, Save, FileJson } from "lucide-react";

const Schema = () => {
  const [schema, setSchema] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const currentSchema = localStorage.getItem("currentSchema");
    if (currentSchema) {
      setSchema(JSON.stringify(JSON.parse(currentSchema), null, 2));
    }
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(schema);
    toast({
      title: "Copied!",
      description: "Schema copied to clipboard",
    });
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(schema);
      localStorage.setItem("currentSchema", JSON.stringify(parsed));
      setIsEditing(false);
      toast({
        title: "Saved!",
        description: "Schema saved successfully",
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please check your schema format",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileJson className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">App Schema</h1>
              <p className="text-sm text-muted-foreground">
                View and edit your generated app structure
              </p>
            </div>
          </div>
        </div>

        <Card className="p-6 border-primary/30">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">JSON Schema</label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel Edit" : "Edit"}
              </Button>
            </div>

            <Textarea
              value={schema}
              onChange={(e) => setSchema(e.target.value)}
              readOnly={!isEditing}
              className="min-h-[500px] font-mono text-sm bg-muted"
            />

            <div className="flex gap-2">
              <Button onClick={handleCopy} className="gap-2">
                <Copy className="w-4 h-4" />
                Copy Lovable JSON
              </Button>
              {isEditing && (
                <Button onClick={handleSave} variant="outline" className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        </Card>

        <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border/50">
          Export. Teleport. Collaborate. — AEIOU by GoNoCoMoCo
        </div>
      </div>
    </div>
  );
};

export default Schema;
