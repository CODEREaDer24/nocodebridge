import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectStructure } from "@/types/project";
import { FileText, Component, Database, Workflow, ArrowRight } from "lucide-react";

interface PreviewStepProps {
  project: ProjectStructure;
}

export const PreviewStep = ({ project }: PreviewStepProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Project Structure</CardTitle>
          <CardDescription>
            Review your project details before exporting
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Pages ({project.pages.length})
          </TabsTrigger>
          <TabsTrigger value="components" className="flex items-center gap-2">
            <Component className="w-4 h-4" />
            Components ({project.components.length})
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Data Models ({project.dataModels.length})
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Workflow className="w-4 h-4" />
            Workflows ({project.workflows.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <div className="grid gap-4">
            {project.pages.map((page, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{page.name}</h3>
                      <p className="text-sm text-muted-foreground">{page.path}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{page.components.length} components</Badge>
                    </div>
                  </div>
                  {page.components.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {page.components.slice(0, 5).map((comp, compIndex) => (
                        <Badge key={compIndex} variant="secondary" className="text-xs">
                          {comp}
                        </Badge>
                      ))}
                      {page.components.length > 5 && (
                        <Badge variant="secondary" className="text-xs">
                          +{page.components.length - 5} more
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="components" className="space-y-4">
          <div className="grid gap-4">
            {project.components.map((component, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{component.name}</h3>
                      <Badge variant="outline" className="mt-1 capitalize">
                        {component.type}
                      </Badge>
                    </div>
                    <div className="text-right">
                      {component.props && (
                        <p className="text-sm text-muted-foreground">
                          {component.props.length} props
                        </p>
                      )}
                      {component.dependencies && (
                        <p className="text-sm text-muted-foreground">
                          {component.dependencies.length} dependencies
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <div className="grid gap-4">
            {project.dataModels.map((model, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{model.name}</h3>
                    <Badge variant="outline">{model.fields.length} fields</Badge>
                  </div>
                  <div className="space-y-2">
                    {model.fields.slice(0, 4).map((field, fieldIndex) => (
                      <div key={fieldIndex} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{field.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{field.type}</Badge>
                          {field.required && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {model.fields.length > 4 && (
                      <p className="text-xs text-muted-foreground">
                        +{model.fields.length - 4} more fields
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid gap-4">
            {project.workflows.map((workflow, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{workflow.name}</h3>
                      <Badge variant="outline">{workflow.actions.length} actions</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="text-xs">{workflow.trigger}</Badge>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <div className="flex gap-1">
                        {workflow.actions.slice(0, 3).map((action, actionIndex) => (
                          <Badge key={actionIndex} variant="secondary" className="text-xs">
                            {action}
                          </Badge>
                        ))}
                        {workflow.actions.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{workflow.actions.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {workflow.description && (
                      <p className="text-sm text-muted-foreground">{workflow.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};