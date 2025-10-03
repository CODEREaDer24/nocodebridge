export interface ProjectStructure {
  name: string;
  description?: string;
  components?: any[];
  pages?: any[];
  data?: Record<string, any>;
  // Extra catch-all so imports never break if fields change
  [key: string]: any;
}
