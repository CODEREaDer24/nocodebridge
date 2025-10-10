import { ProjectStructure } from "@/types/project";
import JSZip from "jszip";

/**
 * Generate AI Collaboration JSON - machine-readable format
 * Contains complete app structure for AI to collaborate
 */
export function generateAICollabJSON(project: ProjectStructure): string {
  const collabData = {
    metadata: {
      projectName: project.name,
      projectId: project.id,
      sourceType: project.sourceType,
      sourceUrl: project.url || null,
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
        required: field.required,
        description: field.description || null,
      })),
      relationships: model.relationships || [],
    })),
    workflows: project.workflows.map(workflow => ({
      name: workflow.name,
      trigger: workflow.trigger,
      actions: workflow.actions,
      description: workflow.description || null,
    })),
  };

  return JSON.stringify(collabData, null, 2);
}

/**
 * Generate AI Collaboration Markdown - human-readable format
 * Formatted sections for easy reference
 */
export function generateAICollabMarkdown(project: ProjectStructure): string {
  const lines: string[] = [];

  // Header
  lines.push(`# AI Collaboration Document: ${project.name}`);
  lines.push('');
  lines.push(`**Project ID:** ${project.id}`);
  lines.push(`**Source Type:** ${project.sourceType}`);
  if (project.url) lines.push(`**Source URL:** ${project.url}`);
  lines.push(`**Analyzed:** ${new Date().toISOString()}`);
  if (project.confidence) lines.push(`**Confidence:** ${(project.confidence * 100).toFixed(1)}%`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Pages Section
  lines.push('## 📄 Pages & Routes');
  lines.push('');
  if (project.pages.length === 0) {
    lines.push('*No pages detected*');
  } else {
    project.pages.forEach(page => {
      lines.push(`### ${page.name}`);
      lines.push(`- **Path:** \`${page.path}\``);
      lines.push(`- **Components:** ${page.components.join(', ')}`);
      lines.push('');
    });
  }
  lines.push('---');
  lines.push('');

  // Components Section
  lines.push('## 🧩 Components');
  lines.push('');
  if (project.components.length === 0) {
    lines.push('*No components detected*');
  } else {
    project.components.forEach(comp => {
      lines.push(`### ${comp.name}`);
      lines.push(`- **Type:** ${comp.type}`);
      if (comp.props && comp.props.length > 0) {
        lines.push(`- **Props:** ${comp.props.join(', ')}`);
      }
      if (comp.dependencies && comp.dependencies.length > 0) {
        lines.push(`- **Dependencies:** ${comp.dependencies.join(', ')}`);
      }
      lines.push('');
    });
  }
  lines.push('---');
  lines.push('');

  // Data Models Section
  lines.push('## 🗄️ Data Models');
  lines.push('');
  if (project.dataModels.length === 0) {
    lines.push('*No data models detected*');
  } else {
    project.dataModels.forEach(model => {
      lines.push(`### ${model.name}`);
      lines.push('');
      lines.push('**Fields:**');
      model.fields.forEach(field => {
        const required = field.required ? '*(required)*' : '*(optional)*';
        const desc = field.description ? ` - ${field.description}` : '';
        lines.push(`- **${field.name}** (\`${field.type}\`) ${required}${desc}`);
      });
      if (model.relationships && model.relationships.length > 0) {
        lines.push('');
        lines.push(`**Relationships:** ${model.relationships.join(', ')}`);
      }
      lines.push('');
    });
  }
  lines.push('---');
  lines.push('');

  // Workflows Section
  lines.push('## ⚡ Workflows');
  lines.push('');
  if (project.workflows.length === 0) {
    lines.push('*No workflows detected*');
  } else {
    project.workflows.forEach(workflow => {
      lines.push(`### ${workflow.name}`);
      lines.push(`- **Trigger:** ${workflow.trigger}`);
      lines.push(`- **Actions:** ${workflow.actions.join(' → ')}`);
      if (workflow.description) {
        lines.push(`- **Description:** ${workflow.description}`);
      }
      lines.push('');
    });
  }
  lines.push('---');
  lines.push('');

  // Footer
  lines.push('## 📝 Usage Instructions');
  lines.push('');
  lines.push('This document contains the complete structure of the analyzed application.');
  lines.push('Use this for:');
  lines.push('- AI collaboration and ideation');
  lines.push('- Understanding app architecture');
  lines.push('- Planning modifications or enhancements');
  lines.push('- Documentation and reference');
  lines.push('');
  lines.push('**Note:** This export is generated by Project Bridge for seamless collaboration with AI assistants.');
  lines.push('');

  return lines.join('\n');
}

/**
 * Generate ZIP bundle containing both JSON and Markdown
 */
export async function generateAICollabZIP(project: ProjectStructure): Promise<Blob> {
  const zip = new JSZip();
  
  const json = generateAICollabJSON(project);
  const markdown = generateAICollabMarkdown(project);
  
  const timestamp = new Date().toISOString().split('T')[0];
  const projectSlug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  zip.file(`${projectSlug}-ai-collab-${timestamp}.json`, json);
  zip.file(`${projectSlug}-ai-collab-${timestamp}.md`, markdown);
  
  return await zip.generateAsync({ type: 'blob' });
}

/**
 * Download file helper
 */
export function downloadFile(content: string | Blob, filename: string, mimeType: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download AI Collab JSON
 */
export function downloadAICollabJSON(project: ProjectStructure) {
  const json = generateAICollabJSON(project);
  const timestamp = new Date().toISOString().split('T')[0];
  const projectSlug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  downloadFile(json, `${projectSlug}-ai-collab-${timestamp}.json`, 'application/json');
}

/**
 * Download AI Collab Markdown
 */
export function downloadAICollabMarkdown(project: ProjectStructure) {
  const markdown = generateAICollabMarkdown(project);
  const timestamp = new Date().toISOString().split('T')[0];
  const projectSlug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  downloadFile(markdown, `${projectSlug}-ai-collab-${timestamp}.md`, 'text/markdown');
}

/**
 * Download AI Collab ZIP bundle
 */
export async function downloadAICollabZIP(project: ProjectStructure) {
  const zipBlob = await generateAICollabZIP(project);
  const timestamp = new Date().toISOString().split('T')[0];
  const projectSlug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  downloadFile(zipBlob, `${projectSlug}-ai-collab-${timestamp}.zip`, 'application/zip');
}
