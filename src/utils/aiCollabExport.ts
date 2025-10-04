import JSZip from "jszip";

/**
 * Generates export bundles in multiple formats
 * Used by ExportStep / ExportPromptStep / IterationFlowStep
 */
export async function generateExport(
  project: any,
  format: "json" | "markdown" | "zip" | "ai-collaboration" | "uap"
): Promise<Blob> {
  switch (format) {
    case "json": {
      const jsonString = JSON.stringify(project, null, 2);
      return new Blob([jsonString], { type: "application/json" });
    }

    case "markdown": {
      const md = `# ${project.name || "Project Export"}\n\n\`\`\`json\n${JSON.stringify(
        project,
        null,
        2
      )}\n\`\`\``;
      return new Blob([md], { type: "text/markdown" });
    }

    case "zip": {
      const zip = new JSZip();
      zip.file(
        "project.json",
        JSON.stringify(project, null, 2),
        { createFolders: true }
      );
      // Add placeholder README
      zip.file(
        "README.md",
        `# ${project.name || "Project"}\n\nExported as ZIP from NoCodeBridge.`
      );
      return await zip.generateAsync({ type: "blob" });
    }

    case "ai-collaboration": {
      const collabMd = [
        `# ${project.name || "AI Collaboration Package"}`,
        `## Overview`,
        `This package is optimized for use with ChatGPT, Claude, DeepSeek, etc.`,
        "```json",
        JSON.stringify(project, null, 2),
        "```",
      ].join("\n\n");
      return new Blob([collabMd], { type: "text/markdown" });
    }

    case "uap": {
      // Universal App Profile → JSON + Markdown in one bundle
      const zip = new JSZip();

      // JSON core
      zip.file(
        "uap.json",
        JSON.stringify(
          {
            meta: {
              type: "Universal App Profile",
              version: "1.0.0",
              source: "NoCodeBridge",
              exportedAt: new Date().toISOString(),
            },
            project,
          },
          null,
          2
        )
      );

      // Markdown documentation
      const md = [
        `# Universal App Profile Export`,
        `**App Name:** ${project.name || "Unnamed App"}`,
        `**Exported:** ${new Date().toLocaleString()}`,
        "",
        "## Project Snapshot",
        "```json",
        JSON.stringify(project, null, 2),
        "```",
        "",
        "## Notes",
        "- This UAP bundle is designed for both AI assistants and NoCodeBridge re-import.",
      ].join("\n");

      zip.file("uap.md", md);

      return await zip.generateAsync({ type: "blob" });
    }

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

// Helper functions for backward compatibility
export async function downloadAICollabJSON(project: any, filename: string) {
  const blob = await generateExport(project, "json");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `${project.name || "project"}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadAICollabMarkdown(project: any, filename: string) {
  const blob = await generateExport(project, "markdown");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `${project.name || "project"}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadAICollabZIP(project: any, filename: string) {
  const blob = await generateExport(project, "zip");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `${project.name || "project"}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
