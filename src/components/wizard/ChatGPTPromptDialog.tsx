import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CHATGPT_PROMPT = `I need you to generate a project structure JSON for my web application. Please follow this exact schema:

{
  "id": "unique-project-id",
  "name": "Project Name",
  "url": "https://example.com (optional)",
  "sourceType": "other",
  "pages": [
    {
      "name": "Page Name",
      "path": "/route-path",
      "components": ["ComponentName1", "ComponentName2"]
    }
  ],
  "components": [
    {
      "name": "ComponentName",
      "type": "ui" | "page" | "layout" | "custom",
      "props": ["prop1", "prop2"],
      "dependencies": ["OtherComponent"]
    }
  ],
  "dataModels": [
    {
      "name": "ModelName",
      "fields": [
        {
          "name": "fieldName",
          "type": "string" | "number" | "boolean" | "date" | "array" | "object",
          "required": true | false,
          "description": "Field description"
        }
      ],
      "relationships": ["RelatedModel"]
    }
  ],
  "workflows": [
    {
      "name": "Workflow Name",
      "trigger": "What triggers this workflow",
      "actions": ["Action 1", "Action 2"],
      "description": "Workflow description"
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "confidence": 0.95
}

My project description: [DESCRIBE YOUR PROJECT HERE]

Please generate a complete JSON structure that matches this schema exactly. Include realistic pages, components, data models, and workflows that would be needed for this type of application.`;

interface ChatGPTPromptDialogProps {
  trigger?: React.ReactNode;
}

export const ChatGPTPromptDialog = ({ trigger }: ChatGPTPromptDialogProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CHATGPT_PROMPT);
      setCopied(true);
      toast({
        title: "Prompt copied!",
        description: "ChatGPT prompt copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Bot className="w-4 h-4 mr-2" />
            Generate ChatGPT Prompt
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ChatGPT Prompt Generator</DialogTitle>
          <DialogDescription>
            Copy this prompt and paste it into ChatGPT to generate a properly structured project JSON.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">Ready-to-Use Prompt</h4>
            <Button
              variant="default"
              size="sm"
              onClick={handleCopy}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Prompt
                </>
              )}
            </Button>
          </div>
          
          <Textarea
            value={CHATGPT_PROMPT}
            readOnly
            className="min-h-[400px] font-mono text-sm"
          />
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <h5 className="font-semibold text-foreground">Instructions:</h5>
            <ol className="list-decimal list-inside space-y-1">
              <li>Copy the prompt above</li>
              <li>Replace "[DESCRIBE YOUR PROJECT HERE]" with your actual project description</li>
              <li>Paste the entire prompt into ChatGPT</li>
              <li>Copy the JSON response and paste it back into the import field</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};