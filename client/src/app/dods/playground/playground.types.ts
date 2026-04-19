export type DodsControlType = 'text' | 'number' | 'boolean' | 'select' | 'color';

export interface DodsControlOption {
  value: unknown;
  label: string;
}

export interface DodsControlDef {
  key: string;
  label: string;
  type: DodsControlType;
  defaultValue: unknown;
  options?: DodsControlOption[];
  description?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface DodsStoryMeta {
  id: string;
  name: string;
  group: string;
  icon?: string;
  description?: string;
}
