export interface ProjectStructure {
  id: string;
  name: string;
  url?: string;
  sourceType: 'lovable' | 'other';
  pages: PageInfo[];
  components: ComponentInfo[];
  dataModels: DataModelInfo[];
  workflows: WorkflowInfo[];
  createdAt: Date;
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

export interface ExportRecord {
  id: string;
  projectId: string;
  format: 'json' | 'zip' | 'markdown' | 'uap';
  createdAt: Date;
  size?: number;
}

export interface ImportRecord {
  id: string;
  projectId: string;
  source: 'json' | 'zip' | 'url' | 'uap';
  createdAt: Date;
  success: boolean;
}

export type WizardStep = 'start' | 'input' | 'detect' | 'preview' | 'export' | 'import' | 'import-preview' | 'ai-refinement' | 'export-prompt';
export type FlowType = 'export' | 'import';