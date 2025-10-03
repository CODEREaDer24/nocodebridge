export interface ProjectStructure {
  id: string;
  name: string;
  appName?: string; // 👈 root-level app name for UAP/exports
  url?: string;     // 👈 optional source URL (web apps, repos, etc.)
  sourceType: 'lovable' | 'web' | 'other';
  pages: PageInfo[];
  components: ComponentInfo[];
  dataModels: DataModelInfo[];
  workflows: WorkflowInfo[];
  endpoints?: EndpointInfo[];
  createdAt?: Date;
  confidence?: number;
}

export interface PageInfo {
  name: string;
  path: string;
  components: string[];
}

export interface ComponentInfo {
  name: string;
  type: 'ui' | 'page' | 'layout' | 'custom';
  props?: string[];
  dependencies?: string[];
}

export interface DataModelInfo {
  name: string;
  fields: FieldInfo[];
  relationships?: string[];
}

export interface FieldInfo {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

export interface WorkflowInfo {
  name: string;
  trigger: string;
  actions: string[];
  description?: string;
}

export interface EndpointInfo {
  path: string;
  method: string;
  usage?: string;
}

export interface ExportRecord {
  id: string;
  projectId: string;
  format: 'json' | 'zip' | 'markdown' | 'uap' | 'ai-collaboration';
  createdAt: Date;
  size?: number;
}
