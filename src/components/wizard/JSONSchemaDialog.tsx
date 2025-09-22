import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Code, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const EXAMPLE_JSON = `{
  "id": "project-001",
  "name": "E-commerce Platform",
  "url": "https://mystore.com",
  "sourceType": "other",
  "pages": [
    {
      "name": "Home",
      "path": "/",
      "components": ["Hero", "ProductGrid", "Footer"]
    },
    {
      "name": "Product Detail",
      "path": "/product/:id",
      "components": ["ProductImage", "ProductInfo", "Reviews"]
    }
  ],
  "components": [
    {
      "name": "Hero",
      "type": "ui",
      "props": ["title", "subtitle", "ctaText"],
      "dependencies": ["Button"]
    },
    {
      "name": "ProductGrid",
      "type": "custom",
      "props": ["products", "onProductClick"],
      "dependencies": ["ProductCard", "Pagination"]
    }
  ],
  "dataModels": [
    {
      "name": "Product",
      "fields": [
        {
          "name": "id",
          "type": "string",
          "required": true,
          "description": "Unique product identifier"
        },
        {
          "name": "name",
          "type": "string",
          "required": true,
          "description": "Product name"
        },
        {
          "name": "price",
          "type": "number",
          "required": true,
          "description": "Product price in cents"
        }
      ],
      "relationships": ["Category", "Reviews"]
    }
  ],
  "workflows": [
    {
      "name": "Purchase Flow",
      "trigger": "Add to Cart button click",
      "actions": ["Validate inventory", "Update cart", "Navigate to checkout"],
      "description": "Complete purchase workflow from cart to payment"
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "confidence": 0.95
}`;

interface JSONSchemaDialogProps {
  trigger?: React.ReactNode;
}

export const JSONSchemaDialog = ({ trigger }: JSONSchemaDialogProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EXAMPLE_JSON);
      setCopied(true);
      toast({
        title: "Schema copied!",
        description: "Example JSON schema copied to clipboard",
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
            <Code className="w-4 h-4 mr-2" />
            Show Expected Format
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Expected JSON Schema</DialogTitle>
          <DialogDescription>
            This is the exact format ChatGPT should follow when generating your project JSON.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">Example Structure</h4>
            <Button
              variant="outline"
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
                  Copy Example
                </>
              )}
            </Button>
          </div>
          
          <div className="bg-muted p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {EXAMPLE_JSON}
            </pre>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <h5 className="font-semibold text-foreground">Key Requirements:</h5>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>pages</strong>: Array of page objects with name, path, and components</li>
              <li><strong>components</strong>: Array of component objects with name, type, props, and dependencies</li>
              <li><strong>dataModels</strong>: Array of data model objects with fields and relationships</li>
              <li><strong>workflows</strong>: Array of workflow objects with triggers and actions</li>
              <li><strong>createdAt</strong>: ISO 8601 date string</li>
              <li><strong>confidence</strong>: Optional number between 0 and 1</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};