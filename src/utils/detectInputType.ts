export interface DetectionResult {
  type: string;
  confidence: number;
  isUrl: boolean;
  hasFullData: boolean;
  projectName?: string;
  components?: any[];
  pages?: any[];
  data?: Record<string, any>;
}

export async function detectInputType(
  input: string,
  filename?: string
): Promise<DetectionResult> {
  const trimmed = input.trim();

  // Check if it's a URL
  const urlPattern = /^https?:\/\//i;
  if (urlPattern.test(trimmed)) {
    return detectUrlType(trimmed);
  }

  // Check if it's JSON
  try {
    const parsed = JSON.parse(trimmed);
    return detectJsonType(parsed, filename);
  } catch {
    // Not JSON, check for Markdown
    if (trimmed.includes("```") || trimmed.startsWith("#")) {
      return detectMarkdownType(trimmed);
    }
  }

  return {
    type: "Unknown",
    confidence: 0,
    isUrl: false,
    hasFullData: false,
  };
}

function detectUrlType(url: string): DetectionResult {
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes("lovable.app") || lowerUrl.includes("lovable.dev")) {
    return {
      type: "Lovable URL",
      confidence: 95,
      isUrl: true,
      hasFullData: false,
      projectName: extractProjectNameFromUrl(url),
    };
  }

  if (lowerUrl.includes("bubble.io")) {
    return {
      type: "Bubble URL",
      confidence: 90,
      isUrl: true,
      hasFullData: false,
      projectName: "Bubble App",
    };
  }

  if (lowerUrl.includes("base44") || lowerUrl.includes("base-44")) {
    return {
      type: "Base44 URL",
      confidence: 90,
      isUrl: true,
      hasFullData: false,
      projectName: "Base44 App",
    };
  }

  if (lowerUrl.includes("bolt.new") || lowerUrl.includes("stackblitz")) {
    return {
      type: "Bolt URL",
      confidence: 85,
      isUrl: true,
      hasFullData: false,
      projectName: "Bolt Project",
    };
  }

  return {
    type: "Generic URL",
    confidence: 50,
    isUrl: true,
    hasFullData: false,
  };
}

function detectJsonType(data: any, filename?: string): DetectionResult {
  // Check for UAP format
  if (data.meta?.type === "Universal App Profile") {
    return {
      type: "UAP JSON",
      confidence: 100,
      isUrl: false,
      hasFullData: true,
      projectName: data.project?.name || "UAP Project",
      components: data.project?.components || [],
      pages: data.project?.pages || [],
      data: data.project?.data || {},
    };
  }

  // Check for Lovable export
  if (data.name && data.components && data.pages) {
    return {
      type: "Lovable JSON",
      confidence: 95,
      isUrl: false,
      hasFullData: true,
      projectName: data.name,
      components: data.components,
      pages: data.pages,
      data: data.data || {},
    };
  }

  // Check for Bubble export
  if (data.workflows || data.database) {
    return {
      type: "Bubble JSON",
      confidence: 85,
      isUrl: false,
      hasFullData: true,
      projectName: data.application_name || "Bubble App",
      components: extractBubbleComponents(data),
      pages: extractBubblePages(data),
      data: data.database || {},
    };
  }

  return {
    type: "Generic JSON",
    confidence: 60,
    isUrl: false,
    hasFullData: true,
    projectName: filename?.replace(/\.json$/, "") || "Imported Project",
    components: [],
    pages: [],
    data: data,
  };
}

function detectMarkdownType(content: string): DetectionResult {
  const hasUapHeader = content.includes("Universal App Profile");
  const hasCodeBlocks = content.includes("```json");

  if (hasUapHeader) {
    return {
      type: "UAP Markdown",
      confidence: 95,
      isUrl: false,
      hasFullData: true,
      projectName: extractProjectNameFromMarkdown(content),
    };
  }

  if (hasCodeBlocks) {
    return {
      type: "AI Collaboration Markdown",
      confidence: 80,
      isUrl: false,
      hasFullData: true,
      projectName: extractProjectNameFromMarkdown(content),
    };
  }

  return {
    type: "Generic Markdown",
    confidence: 50,
    isUrl: false,
    hasFullData: false,
  };
}

function extractProjectNameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    return pathParts[pathParts.length - 1] || "Project";
  } catch {
    return "Project";
  }
}

function extractProjectNameFromMarkdown(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : "Markdown Project";
}

function extractBubbleComponents(data: any): any[] {
  const components: any[] = [];
  
  if (data.elements) {
    Object.entries(data.elements).forEach(([key, value]: [string, any]) => {
      components.push({
        name: key,
        type: value.type || "element",
        props: value.properties || [],
      });
    });
  }

  return components;
}

function extractBubblePages(data: any): any[] {
  const pages: any[] = [];
  
  if (data.pages) {
    Object.entries(data.pages).forEach(([key, value]: [string, any]) => {
      pages.push({
        name: key,
        path: `/${key.toLowerCase()}`,
        components: value.elements || [],
      });
    });
  }

  return pages;
}
