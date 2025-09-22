import { ProjectStructure } from "@/types/project";

export const parseProjectFile = async (file: File): Promise<ProjectStructure | null> => {
  try {
    if (file.name.endsWith('.json')) {
      const text = await file.text();
      const parsed = JSON.parse(text);
      
      // Validate the structure and enhance with missing fields
      if (parsed && typeof parsed === 'object') {
        return {
          id: parsed.id || `imported_${Date.now()}`,
          name: parsed.name || file.name.replace('.json', ''),
          url: parsed.url,
          sourceType: parsed.sourceType || 'other',
          pages: Array.isArray(parsed.pages) ? parsed.pages : [],
          components: Array.isArray(parsed.components) ? parsed.components : [],
          dataModels: Array.isArray(parsed.dataModels) ? parsed.dataModels : [],
          workflows: Array.isArray(parsed.workflows) ? parsed.workflows : [],
          createdAt: parsed.createdAt ? new Date(parsed.createdAt) : new Date(),
          confidence: parsed.confidence || 0.8
        };
      }
    }
    
    if (file.name.endsWith('.zip') || file.name.endsWith('.uap')) {
      // For ZIP/UAP files, we'll need to extract and parse the contents
      // This is a simplified implementation - in production, use JSZip
      const arrayBuffer = await file.arrayBuffer();
      return await parseArchiveFile(arrayBuffer, file.name);
    }

    // For other text files, try to extract project information
    if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
      return await extractProjectFromTextFile(file);
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing project file:', error);
    return null;
  }
};

const parseArchiveFile = async (arrayBuffer: ArrayBuffer, filename: string): Promise<ProjectStructure | null> => {
  try {
    // This is a simplified approach - in a real implementation, you'd use JSZip
    // For now, we'll return a basic structure
    const projectName = filename.replace(/\.(zip|uap)$/, '');
    
    return {
      id: `archive_${Date.now()}`,
      name: projectName,
      sourceType: filename.endsWith('.uap') ? 'other' : 'other',
      pages: [{ name: 'Home', path: '/', components: ['App'] }],
      components: [{ name: 'App', type: 'page' }],
      dataModels: [],
      workflows: [],
      createdAt: new Date(),
      confidence: 0.5
    };
  } catch (error) {
    console.error('Error parsing archive file:', error);
    return null;
  }
};

const extractProjectFromTextFile = async (file: File): Promise<ProjectStructure | null> => {
  try {
    const content = await file.text();
    const projectName = file.name.replace(/\.(md|txt)$/, '');
    
    // Extract components mentioned in the text
    const componentMatches = content.match(/(?:component|Component)\s+([A-Z][a-zA-Z0-9]*)/g) || [];
    const components = [...new Set(componentMatches.map(match => {
      const name = match.split(/\s+/).pop();
      return { name: name || 'Component', type: 'custom' as const };
    }))];
    
    // Extract pages/routes mentioned
    const pageMatches = content.match(/(?:page|Page|route|Route)\s+([A-Z][a-zA-Z0-9]*)/g) || [];
    const pages = [...new Set(pageMatches.map(match => {
      const name = match.split(/\s+/).pop();
      return { 
        name: name || 'Page', 
        path: `/${(name || 'page').toLowerCase()}`, 
        components: ['Header', name || 'Page', 'Footer'] 
      };
    }))];
    
    // If no specific structure found, create a basic one
    if (components.length === 0 && pages.length === 0) {
      return {
        id: `text_${Date.now()}`,
        name: projectName,
        sourceType: 'other',
        pages: [{ name: 'Home', path: '/', components: ['App'] }],
        components: [{ name: 'App', type: 'page' }],
        dataModels: [],
        workflows: [],
        createdAt: new Date(),
        confidence: 0.4
      };
    }
    
    return {
      id: `text_${Date.now()}`,
      name: projectName,
      sourceType: 'other',
      pages: pages.length > 0 ? pages : [{ name: 'Home', path: '/', components: ['App'] }],
      components: components.length > 0 ? components : [{ name: 'App', type: 'page' }],
      dataModels: [],
      workflows: [],
      createdAt: new Date(),
      confidence: 0.6
    };
  } catch (error) {
    console.error('Error extracting from text file:', error);
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