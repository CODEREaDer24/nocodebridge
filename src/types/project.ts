export interface ProjectStructure {
  name: string;
  description?: string;
  components?: any[];
  pages?: any[];
  data?: Record<string, any>;
  // Extra catch-all so imports never break if fields change
  [key: string]: any;
}

export interface PageInfo {
  name: string;
  path: string;
  components?: string[];
  file?: string;
  description?: string;
  features?: string[];
}

export interface ComponentInfo {
  name: string;
  type: string;
  props?: string[];
  dependencies?: string[];
  description?: string;
}

export interface DataModelInfo {
  name: string;
  fields?: any[];
}

export interface WorkflowInfo {
  name: string;
  steps?: string[];
  trigger?: string;
  actions?: string[];
}

export type WizardStep = 
  | 'start'
  | 'input'
  | 'detect'
  | 'upload'
  | 'detection'
  | 'preview'
  | 'export'
  | 'import'
  | 'import-preview'
  | 'ai-refinement'
  | 'export-prompt'
  | 'iteration-flow';

export type FlowType = 'export' | 'import';

export interface ProjectAnalysis {
  id?: string;
  name?: string;
  appName?: string;
  description?: string;
  url?: string;
  sourceType?: 'web' | 'file';
  pages?: PageInfo[];
  components?: ComponentInfo[];
  dataModels?: DataModelInfo[];
  workflows?: WorkflowInfo[];
  endpoints?: any[];
  confidence?: number;
  techStack?: {
    frontend?: string[];
    backend?: string[];
    styling?: string[];
    ui?: string[];
    ai?: string[];
    database?: string[];
  };
  architecture?: {
    structure?: any;
    patterns?: string[];
    dataFlow?: string;
  };
  features?: any[];
  routes?: any[];
  metadata?: any;
}
