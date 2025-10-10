import { ProjectStructure } from "@/types/project";
import { ProjectAnalysis } from "@/utils/projectAnalyzer";

/**
 * Converts a ProjectStructure (from wizard analysis) to ProjectAnalysis format
 */
export function convertProjectToAnalysis(project: ProjectStructure): ProjectAnalysis {
  return {
    appName: project.name || "UnnamedApp",
    description: `Analyzed project: ${project.name || "UnnamedApp"}`,
    name: project.name,
    metadata: {
      projectId: project.id,
      sourceUrl: project.url || null,
      sourceType: project.sourceType || "unknown",
      analyzedAt: new Date().toISOString(),
    },
    techStack: {
      frontend: detectFrontendStack(project),
      backend: detectBackendStack(project),
      ai: [],
      database: [],
      styling: detectStylingStack(project),
      ui: detectUIStack(project),
    },
    architecture: {
      structure: generateStructure(project),
      patterns: detectPatterns(project),
      dataFlow: detectDataFlow(project),
    },
    pages: project.pages.map(page => ({
      name: page.name,
      path: page.path,
      file: `src/pages/${page.name}.tsx`,
      description: `${page.name} page`,
      components: page.components,
      features: [],
    })),
    components: project.components.map(comp => ({
      name: comp.name,
      type: comp.type,
      file: `src/components/${comp.name}.tsx`,
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
}

/**
 * Helpers (assume implemented elsewhere)
 */
function detectFrontendStack(project: ProjectStructure) {
  return ["React", "TypeScript", "Vite"];
}

function detectBackendStack(project: ProjectStructure) {
  return project.sourceType === "web" ? ["Node.js"] : [];
}

function detectStylingStack(project: ProjectStructure) {
  return ["Tailwind CSS"];
}

function detectUIStack(project: ProjectStructure) {
  return ["shadcn/ui"];
}

function generateStructure(project: ProjectStructure) {
  return {
    pages: project.pages.length,
    components: project.components.length,
    dataModels: project.dataModels.length,
    workflows: project.workflows?.length || 0,
  };
}

function detectPatterns(project: ProjectStructure) {
  return ["Component-based architecture", "Data-driven UI"];
}

function detectDataFlow(project: ProjectStructure) {
  return "Unidirectional (props/state)";
}
