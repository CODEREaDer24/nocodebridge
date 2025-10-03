import { ProjectStructure, PageInfo, ComponentInfo } from "@/types/project";

export const analyzeReactFile = (content: string, filename: string): ProjectStructure => {
  const componentName = filename.replace(/\.(tsx|jsx)$/, '');
  
  // Extract imports
  const imports = content.match(/import.*from.*['"`]([^'"`]+)['"`]/g) || [];
  const dependencies = imports.map(imp => {
    const match = imp.match(/from.*['"`]([^'"`]+)['"`]/);
    return match ? match[1] : '';
  }).filter(dep => dep.startsWith('./') || dep.startsWith('../'));
  
  // Extract component exports
  const exportMatches = content.match(/export.*(?:function|const|class)\s+([A-Z][a-zA-Z0-9]*)/g) || [];
  const components: ComponentInfo[] = exportMatches.map(match => {
    const name = match.match(/([A-Z][a-zA-Z0-9]*)/)?.[1] || 'Unknown';
    const type: ComponentInfo['type'] = name.toLowerCase().includes('page') ? 'page' : 'custom';
    return {
      name,
      type,
      props: extractProps(content, name),
      dependencies: []
    };
  });
  
  // Extract routes if this is a routing file
  const routeMatches = content.match(/<Route[^>]*path=["']([^"']+)["']/g) || [];
  const pages: PageInfo[] = routeMatches.map(match => {
    const path = match.match(/path=["']([^"']+)["']/)?.[1] || '/';
    const name = path === '/' ? 'Home' : path.split('/').pop() || 'Page';
    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      path,
      components: [componentName]
    };
  });
  
  return {
    id: `react_${Date.now()}`,
    name: componentName,
    sourceType: 'other',
    pages: pages.length > 0 ? pages : [{ name: componentName, path: '/', components: [componentName] }],
    components: components.length > 0 ? components : [{ name: componentName, type: 'custom', props: [], dependencies: [] }],
    dataModels: [],
    workflows: [],
    createdAt: new Date(),
    confidence: 0.7
  };
};

export const analyzeHtmlFile = (content: string, filename: string): ProjectStructure => {
  const title = content.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || filename;
  
  // Extract script tags that might contain React
  const scriptTags = content.match(/<script[^>]*>(.*?)<\/script>/gs) || [];
  const hasReact = scriptTags.some(script => script.includes('React') || script.includes('react'));
  
  // Extract components from React in script tags
  const components: ComponentInfo[] = [];
  if (hasReact) {
    scriptTags.forEach(script => {
      const componentMatches = script.match(/(?:function|const|class)\s+([A-Z][a-zA-Z0-9]*)/g) || [];
      componentMatches.forEach(match => {
        const name = match.split(/\s+/).pop();
        if (name) {
          components.push({
            name,
            type: 'custom',
            props: [],
            dependencies: []
          });
        }
      });
    });
  }
  
  return {
    id: `html_${Date.now()}`,
    name: title,
    sourceType: 'other',
    pages: [{ name: 'Home', path: '/', components: components.map(c => c.name) }],
    components: components.length > 0 ? components : [{ name: 'App', type: 'page', props: [], dependencies: [] }],
    dataModels: [],
    workflows: [],
    createdAt: new Date(),
    confidence: hasReact ? 0.6 : 0.4
  };
};

export const analyzePackageJson = (content: string): ProjectStructure => {
  const packageData = JSON.parse(content);
  const projectName = packageData.name || 'Unknown Project';
  
  // Analyze dependencies to determine project structure
  const deps = { ...packageData.dependencies, ...packageData.devDependencies };
  const hasReact = deps.react || deps['@types/react'];
  
  let confidence = 0.4;
  let sourceType: 'lovable' | 'other' = 'other';
  
  if (hasReact) confidence += 0.3;
  if (deps.lovable) {
    sourceType = 'lovable';
    confidence += 0.3;
  }
  
  return {
    id: `package_${Date.now()}`,
    name: projectName,
    sourceType,
    pages: [],
    components: [],
    dataModels: [],
    workflows: [],
    createdAt: new Date(),
    confidence
  };
};

const extractProps = (content: string, componentName: string): string[] => {
  // Look for props in component definition
  const propsMatch = content.match(new RegExp(`${componentName}[^{]*{([^}]*)}`, 's'));
  if (!propsMatch) return [];
  
  const propsString = propsMatch[1];
  const propMatches = propsString.match(/(\w+)(?:\s*:|\s*,|\s*})/g) || [];
  
  return propMatches.map(match => match.replace(/[:\s,}]/g, '')).filter(prop => prop.length > 0);
};