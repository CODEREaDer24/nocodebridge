import { ProjectStructure } from "@/types/project";

export const parseProjectFile = async (file: File): Promise<ProjectStructure | null> => {
  try {
    if (file.name.endsWith('.json')) {
      const text = await file.text();
      return JSON.parse(text);
    }
    
    if (file.name.endsWith('.zip') || file.name.endsWith('.uap')) {
      // For now, we'll simulate ZIP/UAP parsing
      // In a real implementation, you'd use a library like JSZip
      const text = await file.text();
      try {
        // Try to parse as JSON first (simplified approach)
        return JSON.parse(text);
      } catch {
        // If it's not JSON, return null for now
        // In real implementation, you'd extract and parse project.json from the ZIP
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing project file:', error);
    return null;
  }
};

export const generateProjectBundle = (
  project: ProjectStructure, 
  format: 'json' | 'zip' | 'markdown' | 'uap',
  refinementData?: string
): { data: string; filename: string; mimeType: string } => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
  const safeName = project.name.replace(/[^a-zA-Z0-9]/g, '_');

  switch (format) {
    case 'json':
      const jsonData = refinementData 
        ? { ...project, refinementInstructions: refinementData }
        : project;
      return {
        data: JSON.stringify(jsonData, null, 2),
        filename: `${safeName}_${timestamp}.json`,
        mimeType: 'application/json'
      };
      
    case 'markdown':
      return {
        data: generateMarkdownContent(project, refinementData),
        filename: `${safeName}_${timestamp}.md`,
        mimeType: 'text/markdown'
      };
      
    case 'uap':
    case 'zip':
      // For UAP/ZIP, we'll create a JSON bundle with metadata
      // In a real implementation, this would create an actual ZIP file
      const bundleData = {
        'project.json': project,
        'project.md': generateMarkdownContent(project, refinementData),
        'meta.json': {
          exportedAt: new Date().toISOString(),
          format: format,
          version: '1.0.0',
          refinementInstructions: refinementData || null
        }
      };
      return {
        data: JSON.stringify(bundleData, null, 2),
        filename: `${safeName}_${timestamp}.${format}`,
        mimeType: format === 'uap' ? 'application/uap' : 'application/zip'
      };
      
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
};

const generateMarkdownContent = (project: ProjectStructure, refinementData?: string): string => {
  return `# ${project.name}

## Project Overview
- **Source**: ${project.sourceType}
- **Pages**: ${project.pages.length}
- **Components**: ${project.components.length}
- **Data Models**: ${project.dataModels.length}
- **Workflows**: ${project.workflows.length}
- **Exported**: ${new Date().toISOString()}

## Pages
${project.pages.map(page => `
### ${page.name}
- **Path**: ${page.path}
- **Components**: ${page.components.join(', ')}
`).join('')}

## Components
${project.components.map(comp => `
### ${comp.name}
- **Type**: ${comp.type}
- **Props**: ${comp.props?.join(', ') || 'None'}
`).join('')}

## Data Models
${project.dataModels.map(model => `
### ${model.name}
${model.fields.map(field => `- **${field.name}**: ${field.type}${field.required ? ' (required)' : ''}`).join('\n')}
`).join('')}

## Workflows
${project.workflows.map(workflow => `
### ${workflow.name}
- **Trigger**: ${workflow.trigger}
- **Actions**: ${workflow.actions.join(' → ')}
- **Description**: ${workflow.description || 'No description'}
`).join('')}

${refinementData ? `\n## Refinement Instructions\n${refinementData}\n` : ''}

---
*Exported from Project Bridge MVP*
`;
};