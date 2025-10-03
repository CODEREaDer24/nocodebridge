import { ProjectStructure } from "@/types/project";
import JSZip from "jszip";

/**
 * Generate AI Collaboration JSON - machine-readable format
 * Contains complete app structure for AI to collaborate
 * Also doubles as the Universal App Profile (UAP) export
 */
export function generateAICollabJSON(project: ProjectStructure): string {
  const collabData = {
    appName: project.name || "UnnamedApp",
    version: "1.0",
    sourceUrl: project.url || null, // 👈 added for web apps
    metadata: {
      projectName: project.name,
      projectId: project.id,
      sourceType: project.sourceType,
      analyzedAt: new Date().toISOString(),
      confidence: project.confidence || null,
    },
    pages: project.pages.map(page => ({
      name: page.name,
      path: page.path,
      components: page.components,
    })),
    components: project.components.map(comp => ({
      name: comp.name,
      type: comp.type,
      props: comp.props || [],
      dependencies: comp.dependencies || [],
    })),
    dataModels: project.dataModels.map(model => ({
      name: model.name,
      fields: model.fields.map(field => ({
        name: field.name,
        type: field.type,
        required: field.required || false,
      })),
    })),
    workflows: project.workflows
      ? project.workflows.map(flow => ({
          name: flow.name,
          trigger: flow.trigger,
          actions: flow.actions,
        }))
      : [],
    endpoints: project.endpoints
      ? project.endpoints.map(ep => ({
          path: ep.path,
          method: ep.method,
          usage: ep.usage || null,
        }))
      : [],
  };

  return JSON.stringify(collabData, null, 2);
}

/**
 * Generate UAP Export as a ZIP containing JSON + Markdown
 */
export async function generateAICollabExport(
  project: ProjectStructure
): Promise<Blob> {
  const zip = new JSZip();

  const jsonExport = generateAICollabJSON(project);
  zip.file("uap-export.json", jsonExport);

  const markdownExport = `# Universal App Profile (UAP) Export
**App Name**: ${project.name || "UnnamedApp"}
**Project ID**: ${project.id}
**Source URL**: ${project.url || "N/A"}
**Analyzed At**: ${new Date().toISOString()}

## Pages
${project.pages.map(p => `- ${p.name} (${p.path})`).join("\n")}

## Components
${project.components.map(c => `- ${c.name} (${c.type})`).join("\n")}

## Data Models
${project.dataModels.map(m => `- ${m.name}`).join("\n")}
`;

  zip.file("uap-export.md", markdownExport);

  const blob = await zip.generateAsync({ type: "blob" });
  return blob;
}
