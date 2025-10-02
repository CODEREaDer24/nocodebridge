import { ProjectStructure } from "@/types/project";
import { ProjectAnalysis } from "@/utils/projectAnalyzer";

/**
 * Converts a ProjectStructure (from wizard analysis) to ProjectAnalysis format
 */
export function convertProjectToAnalysis(project: ProjectStructure): ProjectAnalysis {
  return {
    name: project.name,
    description: `Analyzed project: ${project.name}`,
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
      path: `src/components/${comp.name}.tsx`,
      type: comp.type,
      description: `${comp.name} component`,
      props: comp.props || [],
      dependencies: comp.dependencies || [],
    })),
    features: detectFeatures(project),
    routes: project.pages.map(page => ({
      path: page.path,
      component: page.name,
      protected: false,
    })),
    dependencies: {},
  };
}

function detectFrontendStack(project: ProjectStructure): string[] {
  const stack = ['React'];
  if (project.sourceType === 'lovable') {
    stack.push('TypeScript', 'Vite');
  }
  return stack;
}

function detectBackendStack(project: ProjectStructure): string[] {
  if (project.dataModels.length > 0) {
    return ['Backend API', 'Database'];
  }
  return [];
}

function detectStylingStack(project: ProjectStructure): string[] {
  const hasUIComponents = project.components.some(c => c.type === 'ui');
  if (hasUIComponents || project.sourceType === 'lovable') {
    return ['Tailwind CSS', 'CSS Modules'];
  }
  return ['CSS'];
}

function detectUIStack(project: ProjectStructure): string[] {
  const uiComponents = project.components.filter(c => c.type === 'ui');
  if (uiComponents.length > 0) {
    return ['Custom UI Components', 'Design System'];
  }
  return [];
}

function generateStructure(project: ProjectStructure): string {
  return `
project/
├── src/
│   ├── components/      # ${project.components.length} components
│   ├── pages/          # ${project.pages.length} pages
${project.dataModels.length > 0 ? '│   ├── models/         # Data models\n' : ''}
${project.workflows.length > 0 ? '│   └── workflows/      # Business logic\n' : ''}
└── public/             # Static assets
  `.trim();
}

function detectPatterns(project: ProjectStructure): string[] {
  const patterns = ['Component-based architecture'];
  
  if (project.dataModels.length > 0) {
    patterns.push('Data model separation');
  }
  
  if (project.workflows.length > 0) {
    patterns.push('Workflow-driven architecture');
  }
  
  if (project.components.some(c => c.type === 'layout')) {
    patterns.push('Layout components pattern');
  }
  
  return patterns;
}

function detectDataFlow(project: ProjectStructure): string[] {
  const flows = ['User interaction triggers events'];
  
  if (project.workflows.length > 0) {
    flows.push('Workflows handle business logic');
  }
  
  if (project.dataModels.length > 0) {
    flows.push('Data models manage state');
  }
  
  flows.push('Components re-render on state changes');
  
  return flows;
}

function detectFeatures(project: ProjectStructure): Array<{
  name: string;
  location: string;
  description: string;
  capabilities: string[];
  components: string[];
}> {
  const features: Array<{
    name: string;
    location: string;
    description: string;
    capabilities: string[];
    components: string[];
  }> = [];
  
  // Features from workflows
  project.workflows.forEach(workflow => {
    features.push({
      name: workflow.name,
      location: 'Application-wide',
      description: workflow.description || workflow.name,
      capabilities: workflow.actions,
      components: [],
    });
  });
  
  // Features from pages
  project.pages.forEach(page => {
    if (page.components.length > 2) {
      features.push({
        name: `${page.name} Page`,
        location: page.path,
        description: `Main ${page.name.toLowerCase()} functionality`,
        capabilities: ['User interface', 'Navigation', 'Content display'],
        components: page.components,
      });
    }
  });
  
  return features;
}
