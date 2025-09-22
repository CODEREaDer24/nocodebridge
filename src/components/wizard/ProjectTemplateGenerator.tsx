import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Download } from "lucide-react";
import { useState } from "react";
import { ProjectStructure } from "@/types/project";
import { useToast } from "@/hooks/use-toast";

interface ProjectTemplateGeneratorProps {
  onGenerate: (json: string) => void;
}

export const ProjectTemplateGenerator = ({ onGenerate }: ProjectTemplateGeneratorProps) => {
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [pages, setPages] = useState<string[]>([""]);
  const [components, setComponents] = useState<string[]>([""]);
  const { toast } = useToast();

  const addPage = () => setPages([...pages, ""]);
  const removePage = (index: number) => setPages(pages.filter((_, i) => i !== index));
  const updatePage = (index: number, value: string) => {
    const newPages = [...pages];
    newPages[index] = value;
    setPages(newPages);
  };

  const addComponent = () => setComponents([...components, ""]);
  const removeComponent = (index: number) => setComponents(components.filter((_, i) => i !== index));
  const updateComponent = (index: number, value: string) => {
    const newComponents = [...components];
    newComponents[index] = value;
    setComponents(newComponents);
  };

  const generateTemplate = () => {
    if (!projectName.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a project name",
        variant: "destructive",
      });
      return;
    }

    const validPages = pages.filter(p => p.trim());
    const validComponents = components.filter(c => c.trim());

    const template: ProjectStructure = {
      id: `project-${Date.now()}`,
      name: projectName,
      sourceType: "other",
      pages: validPages.map(page => ({
        name: page,
        path: page === "Home" ? "/" : `/${page.toLowerCase().replace(/\s+/g, "-")}`,
        components: validComponents.slice(0, 2) // Include first 2 components as example
      })),
      components: validComponents.map(comp => ({
        name: comp,
        type: "custom" as const,
        props: ["className", "children"],
        dependencies: []
      })),
      dataModels: projectType === "e-commerce" ? [
        {
          name: "Product",
          fields: [
            { name: "id", type: "string", required: true, description: "Unique identifier" },
            { name: "name", type: "string", required: true, description: "Product name" },
            { name: "price", type: "number", required: true, description: "Price in cents" }
          ]
        }
      ] : projectType === "blog" ? [
        {
          name: "Post",
          fields: [
            { name: "id", type: "string", required: true, description: "Unique identifier" },
            { name: "title", type: "string", required: true, description: "Post title" },
            { name: "content", type: "string", required: true, description: "Post content" }
          ]
        }
      ] : [],
      workflows: projectType === "e-commerce" ? [
        {
          name: "Purchase Flow",
          trigger: "Add to cart button",
          actions: ["Add to cart", "Navigate to checkout", "Process payment"]
        }
      ] : projectType === "blog" ? [
        {
          name: "Content Publishing",
          trigger: "Publish button",
          actions: ["Validate content", "Save to database", "Generate SEO meta"]
        }
      ] : [],
      createdAt: new Date(),
      confidence: 0.8
    };

    const jsonString = JSON.stringify(template, null, 2);
    onGenerate(jsonString);
    
    toast({
      title: "Template generated!",
      description: "Basic project template has been created",
    });
  };

  const projectTypes = [
    { value: "e-commerce", label: "E-commerce Store" },
    { value: "blog", label: "Blog/Content Site" },
    { value: "dashboard", label: "Admin Dashboard" },
    { value: "portfolio", label: "Portfolio Site" },
    { value: "saas", label: "SaaS Application" },
    { value: "custom", label: "Custom Application" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Template Generator</CardTitle>
        <CardDescription>
          Generate a basic JSON template that ChatGPT can then enhance and refine
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder="My Awesome App"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-type">Project Type</Label>
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {projectTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Pages</Label>
            <Button variant="outline" size="sm" onClick={addPage}>
              <Plus className="w-4 h-4 mr-1" />
              Add Page
            </Button>
          </div>
          <div className="space-y-2">
            {pages.map((page, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Page name (e.g., Home, About, Contact)"
                  value={page}
                  onChange={(e) => updatePage(index, e.target.value)}
                />
                {pages.length > 1 && (
                  <Button variant="outline" size="sm" onClick={() => removePage(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Components</Label>
            <Button variant="outline" size="sm" onClick={addComponent}>
              <Plus className="w-4 h-4 mr-1" />
              Add Component
            </Button>
          </div>
          <div className="space-y-2">
            {components.map((component, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Component name (e.g., Header, ProductCard, ContactForm)"
                  value={component}
                  onChange={(e) => updateComponent(index, e.target.value)}
                />
                {components.length > 1 && (
                  <Button variant="outline" size="sm" onClick={() => removeComponent(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {projectType && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm font-medium mb-2">Template will include:</div>
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary">Basic structure</Badge>
              {projectType === "e-commerce" && (
                <>
                  <Badge variant="secondary">Product model</Badge>
                  <Badge variant="secondary">Purchase workflow</Badge>
                </>
              )}
              {projectType === "blog" && (
                <>
                  <Badge variant="secondary">Post model</Badge>
                  <Badge variant="secondary">Publishing workflow</Badge>
                </>
              )}
              <Badge variant="secondary">Sample components</Badge>
            </div>
          </div>
        )}

        <Button 
          onClick={generateTemplate} 
          className="w-full flex items-center gap-2"
          disabled={!projectName.trim()}
        >
          <Download className="w-4 h-4" />
          Generate Template
        </Button>
      </CardContent>
    </Card>
  );
};