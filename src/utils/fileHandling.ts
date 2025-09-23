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
  format: 'json' | 'zip' | 'markdown' | 'uap' | 'ai-collaboration',
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
      
    case 'zip':
      // For ZIP, create a comprehensive bundle with all project data
      const zipBundleData = {
        'project.json': project,
        'documentation.md': generateMarkdownContent(project, refinementData),
        'README.md': generateReadmeContent(project),
        'structure.txt': generateProjectStructure(project),
        'meta.json': {
          exportedAt: new Date().toISOString(),
          format: format,
          version: '1.0.0',
          refinementInstructions: refinementData || null,
          totalPages: project.pages.length,
          totalComponents: project.components.length
        }
      };
      return {
        data: JSON.stringify(zipBundleData, null, 2),
        filename: `${safeName}_complete_${timestamp}.zip`,
        mimeType: 'application/zip'
      };
      
    case 'ai-collaboration':
      return {
        data: generateAICollaborationPackage(project, refinementData),
        filename: `${safeName}_ai_collaboration_${timestamp}.md`,
        mimeType: 'text/markdown'
      };
      
    case 'uap':
      // For UAP, we'll create a JSON bundle with metadata (disabled for now)
      const uapBundleData = {
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
        data: JSON.stringify(uapBundleData, null, 2),
        filename: `${safeName}_${timestamp}.${format}`,
        mimeType: 'application/uap'
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

const generateReadmeContent = (project: ProjectStructure): string => {
  return `# ${project.name}

## Overview
This project was exported from Project Bridge MVP and contains ${project.pages.length} pages and ${project.components.length} components.

## Quick Start
1. Import the \`project.json\` file into your development environment
2. Review the \`documentation.md\` for detailed project structure
3. Check \`structure.txt\` for a quick overview of the project hierarchy

## Project Structure
- **Pages**: ${project.pages.length} total
- **Components**: ${project.components.length} total
- **Data Models**: ${project.dataModels.length} total
- **Workflows**: ${project.workflows.length} total

## Files Included
- \`project.json\` - Complete project data
- \`documentation.md\` - Detailed documentation
- \`README.md\` - This file
- \`structure.txt\` - Project structure overview
- \`meta.json\` - Export metadata

Generated on: ${new Date().toISOString()}
`;
};

const generateProjectStructure = (project: ProjectStructure): string => {
  return `${project.name}/
├── Pages (${project.pages.length})
${project.pages.map(page => `│   ├── ${page.name} (${page.path})`).join('\n')}
├── Components (${project.components.length})
${project.components.map(comp => `│   ├── ${comp.name} (${comp.type})`).join('\n')}
├── Data Models (${project.dataModels.length})
${project.dataModels.map(model => `│   ├── ${model.name}`).join('\n')}
└── Workflows (${project.workflows.length})
${project.workflows.map(workflow => `    ├── ${workflow.name}`).join('\n')}

Export Summary:
- Source: ${project.sourceType}
- Confidence: ${Math.round((project.confidence || 0) * 100)}%
- Exported: ${new Date().toISOString()}
`;
};

const generateAICollaborationPackage = (project: ProjectStructure, refinementData?: string): string => {
  return `# ${project.name} - Complete Source Code for AI Collaboration

## 🤖 AI Collaboration Instructions

**This package contains complete, runnable source code designed for ChatGPT collaboration.**

### How to use with ChatGPT:
1. Copy this entire markdown file
2. Paste it into ChatGPT with a message like: "Here's my React app. I want to [describe your goal]"
3. ChatGPT can now see your complete app structure and help you iterate

${refinementData ? `### Special Instructions:\n${refinementData}\n` : ''}

---

## 📁 Complete Project Structure

\`\`\`
${project.name}/
├── src/
│   ├── components/
${project.components.map(comp => `│   │   └── ${comp.name}.tsx`).join('\n')}
│   ├── pages/
${project.pages.map(page => `│   │   └── ${page.name}.tsx`).join('\n')}
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
\`\`\`

---

## 🚀 Generated Source Code Files

### package.json
\`\`\`json
{
  "name": "${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "lucide-react": "^0.263.1",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}
\`\`\`

### src/main.tsx
\`\`\`tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
\`\`\`

### src/App.tsx
\`\`\`tsx
import { Routes, Route } from 'react-router-dom'
${project.pages.map(page => `import ${page.name} from './pages/${page.name}'`).join('\n')}

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
${project.pages.map(page => `        <Route path="${page.path}" element={<${page.name} />} />`).join('\n')}
        <Route path="*" element={<div className="flex items-center justify-center min-h-screen">404 - Page Not Found</div>} />
      </Routes>
    </div>
  )
}

export default App
\`\`\`

### src/index.css
\`\`\`css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
\`\`\`

${project.pages.map(page => `
### src/pages/${page.name}.tsx
\`\`\`tsx
import React from 'react'
${page.components.filter(comp => comp !== page.name).map(comp => 
  `import ${comp} from '../components/${comp}'`
).join('\n')}

const ${page.name} = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">${page.name}</h1>
          <p className="text-muted-foreground">Welcome to the ${page.name.toLowerCase()} page</p>
        </header>
        
        <main className="space-y-8">
          ${page.components.filter(comp => comp !== page.name).map(comp => 
            `<${comp} />`
          ).join('\n          ')}
          
          <section className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">Page Content</h2>
            <p className="text-muted-foreground">
              This is the main content area for ${page.name}. 
              Add your specific content and functionality here.
            </p>
          </section>
        </main>
      </div>
    </div>
  )
}

export default ${page.name}
\`\`\`
`).join('')}

${project.components.map(comp => `
### src/components/${comp.name}.tsx
\`\`\`tsx
import React from 'react'

interface ${comp.name}Props {
  ${comp.props?.map(prop => `${prop}?: string`).join('\n  ') || 'className?: string'}
}

const ${comp.name}: React.FC<${comp.name}Props> = ({ 
  ${comp.props?.join(', ') || 'className'}
}) => {
  return (
    <div className={\`${comp.type === 'ui' ? 'inline-flex items-center' : 'w-full'} \${className}\`}>
      <div className="${comp.type === 'ui' ? 'p-2 border rounded' : 'space-y-4'}">
        <h3 className="font-medium">${comp.name}</h3>
        <p className="text-sm text-muted-foreground">
          ${comp.type === 'ui' ? 'UI Component' : 'Custom Component'} - ${comp.name}
        </p>
        ${comp.type === 'layout' ? `
        <div className="grid gap-4">
          {/* Layout content goes here */}
        </div>` : ''}
      </div>
    </div>
  )
}

export default ${comp.name}
\`\`\`
`).join('')}

### src/types/index.ts
\`\`\`typescript
${project.dataModels.map(model => `
export interface ${model.name} {
${model.fields.map(field => `  ${field.name}${field.required ? '' : '?'}: ${field.type};`).join('\n')}
}
`).join('')}

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}
\`\`\`

### src/utils/index.ts
\`\`\`typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

${project.workflows.map(workflow => `
// ${workflow.name} workflow
export const ${workflow.name.toLowerCase().replace(/[^a-z0-9]/g, '')} = {
  trigger: "${workflow.trigger}",
  actions: [${workflow.actions.map(action => `"${action}"`).join(', ')}],
  description: "${workflow.description || 'No description'}"
};
`).join('')}
\`\`\`

### vite.config.ts
\`\`\`typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
\`\`\`

### tailwind.config.ts
\`\`\`typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
\`\`\`

### tsconfig.json
\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
\`\`\`

---

## 📊 Project Analysis Summary

- **Total Pages**: ${project.pages.length}
- **Total Components**: ${project.components.length}
- **Data Models**: ${project.dataModels.length}
- **Workflows**: ${project.workflows.length}
- **Source Type**: ${project.sourceType}
- **Analysis Confidence**: ${Math.round((project.confidence || 0) * 100)}%

## 🎯 Ready for ChatGPT Collaboration

This complete source code package is now ready for ChatGPT collaboration! ChatGPT can:

✅ **Understand your entire app structure**
✅ **Modify existing components**
✅ **Add new features**
✅ **Fix bugs and issues**
✅ **Suggest improvements**
✅ **Help with testing and deployment**

Simply copy this entire markdown file and paste it into ChatGPT with your specific request!

---

*Generated by Project Bridge MVP - ${new Date().toISOString()}*
`;
};