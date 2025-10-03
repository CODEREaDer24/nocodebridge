import {
  ProjectStructure,
  PageInfo,
  ComponentInfo,
  DataModelInfo,
  WorkflowInfo,
} from "@/types/project";

export interface AnalysisOptions {
  includeStyles?: boolean;
  includeDataFlow?: boolean;
  maxDepth?: number;
}

/**
 * Analyze a project from a given URL and return a structured Project object
 */
export const analyzeProjectFromUrl = async (
  url: string,
  options: AnalysisOptions = {}
): Promise<ProjectStructure> => {
  try {
    console.log(`Analyzing project: ${url}`);

    // Fetch HTML (with fallback to CORS proxy if blocked)
    let html = "";
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "User-Agent":
            "Mozilla/5.0 (compatible; ProjectAnalyzer/1.0)",
        },
      });
      html = await response.text();
    } catch (corsError) {
      console.log("CORS blocked, using CORS proxy...");
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
        url
      )}`;
      const proxyResponse = await fetch(proxyUrl);
      const proxyData = await proxyResponse.json();
      html = proxyData.contents;
    }

    // Extract <title> as project name
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const projectName = titleMatch ? titleMatch[1].trim() : "UnnamedApp";

    // Stub out pages/components until deeper analysis is implemented
    const pages: PageInfo[] = [
      {
        name: "Home",
        path: "/",
        components: ["NavBar", "Hero", "Footer"],
      },
    ];

    const components: ComponentInfo[] = [
      { name: "NavBar", type: "layout", props: ["links", "authState"] },
      { name: "Hero", type: "section", props: ["headline", "cta"] },
      { name: "Footer", type: "layout", props: ["links"] },
    ];

    const dataModels: DataModelInfo[] = [];
    const workflows: WorkflowInfo[] = [];

    const project: ProjectStructure = {
      id: `proj-${Date.now()}`,
      name: projectName,
      url: url,
      sourceType: "web",
      pages,
      components,
      dataModels,
      workflows,
      endpoints: [],
      confidence: 0.8,
    };

    return project;
  } catch (error) {
    console.error("Error analyzing project:", error);
    throw error;
  }
};
