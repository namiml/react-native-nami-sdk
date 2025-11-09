export interface LaunchContextConfig {
  $schema?: string;
  id?: string;
  version?: string;
  meta?: MetaConfig;
  defaultTag?: string;
  showTags?: boolean;
  productGroups?: ProductGroupsConfig;
  customObject?: CustomObjectConfig;
  customAttributes?: CustomAttributesConfig;
}

export interface MetaConfig {
  title?: string;
  description?: string;
  author?: string;
  created?: string;
  modified?: string;
}

export interface ProductGroupsConfig {
  label?: string;
  description?: string;
  enabledByDefault?: boolean;
  allowMultiple?: boolean;
  autoPopulateFromPaywall?: boolean;
  choices?: string[];
  defaultSelection?: string[];
  tags?: string[];
}

export interface CustomObjectConfig {
  label?: string;
  description?: string;
  enabledByDefault?: boolean;
  defaultSelection?: string;
  choices?: CustomObjectChoice[];
  tags?: string[];
}

export interface CustomObjectChoice {
  id: string;
  label: string;
  tags?: string[];
  value: Record<string, any>;
}

export interface CustomAttributesConfig {
  label?: string;
  description?: string;
  enabledByDefault?: boolean;
  presets?: AttributePreset[];
  attributes?: AttributeConfig[];
}

export interface AttributePreset {
  id: string;
  label: string;
  description?: string;
  tags?: string[];
  values: Record<string, any>;
}

export type AttributeType = 'string' | 'number' | 'boolean' | 'enum';

export interface AttributeConfig {
  key: string;
  label: string;
  description?: string;
  type: AttributeType;
  required?: boolean;
  defaultValue?: any;
  tags?: string[];
  values?: string[];
  valueLabels?: Record<string, string>;
  placeholder?: string;
  enabledByDefault?: boolean;
  min?: number;
  max?: number;
}

export interface LaunchContextSelection {
  productGroupsEnabled: boolean;
  selectedProductGroupIds: Set<string>;
  customObjectEnabled: boolean;
  selectedCustomObjectId?: string;
  customAttributesEnabled: boolean;
  attributeValues: Record<string, any>;
  appliedPresetId?: string;
  currentTag: string;
}

export interface LaunchContextResult {
  customAttributes: Record<string, string>;
  productGroups?: string[];
  customObject?: Record<string, any>;
}
