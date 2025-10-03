export interface ProjectStructure {
  name: string;
  description?: string;
  components?: any[];
  pages?: any[];
  data?: Record<string, any>;
  [key: string]: any;
}
