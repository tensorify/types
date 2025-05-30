// ===============================================
// @tensorify/types - COMPLETE TYPE DEFINITIONS
// ===============================================

// ===============================================
// GLOBAL TYPES (from ../types/global)
// ===============================================

export interface Layer {
  type: string;
  child?: Layer | Layer[];
  settings?:
    | { [key: string]: string | number }
    | {
        layers: Layer[]; // Nested layers
        dataFlow: string; // Data flow instructions
      };
}

export interface Model {
  layers: Layer[];
}

export type Children = Layer | Layer[] | null;

// ===============================================
// NODE TYPES AND INTERFACES (from interfaces/INode.ts)
// ===============================================

export enum NodeType {
  CUSTOM = "custom",
  TRAINER = "trainer",
  EVALUATOR = "evaluator", 
  MODEL = "model",
  MODEL_LAYER = "model_layer",
  DATALOADER = "dataloader",
  OPTIMIZER = "optimizer",
  REPORT = "report",
  FUNCTION = "function",
  PIPELINE = "pipeline",
  AUGMENTATION_STACK = "augmentation_stack",
  DATASET = "dataset",
  LOSS = "loss",
  ACTIVATION = "activation"
}

export interface NodeMetadata {
  requiredImports?: string[];
  dependencies?: string[];
  category?: string;
  description?: string;
  version?: string;
}

export interface TranslationResult {
  code: string;
  metadata?: NodeMetadata;
}

export default interface INode<TSettings = any> {
  /** Name of the node */
  name: string;
  /** Template used for translation */
  translationTemplate: string;
  /** Number of input lines */
  inputLines: number;
  /** Number of output lines */
  outputLinesCount: number;
  /** Number of secondary input lines */
  secondaryInputLinesCount: number;
  /** Type of the node */
  nodeType: NodeType;
  /** Settings for the node */
  settings: TSettings;
  /** Child */
  child?: Layer | Layer[] | null;
  /** Optional metadata for enhanced functionality */
  metadata?: NodeMetadata;
}

// Re-export as named export for easier importing
export interface INodeInterface<TSettings = any> extends INode<TSettings> {}

// ===============================================
// ENHANCED NODE TYPES (from node definition file)
// ===============================================

export interface PropertySchema {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  default?: any;
  enum?: any[];
  minimum?: number;
  maximum?: number;
  description: string;
  required?: boolean;
  validation?: (value: any, allSettings?: any) => boolean | string;
}

export interface EnhancedNodeSchema {
  properties: Record<string, PropertySchema>;
  required: string[];
  dependencies?: Record<string, any>;
}

export interface CodeFragment {
  imports: string[];
  definitions: string[];
  instantiations: string[];
  usage: Record<string, string>;
}

export interface GenerationContext {
  nodeId: string;
  nodeType: string;
  layerName: string;
  inputVar: string;
  outputVar: string;
  existingVariables: string[];
  dependencies: Record<string, any>;
}

export interface CodeExample {
  title: string;
  description: string;
  settings: any;
  expectedOutput: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface NodeDefinition extends INode<any> {
  /** Enhanced schema for validation */
  schema: EnhancedNodeSchema;
  /** Dynamic code generation capabilities */
  codeGeneration: {
    generateCode: (settings: any, context: GenerationContext) => CodeFragment;
    getDependencies: (settings: any) => string[];
    getOutputs: (settings: any) => string[];
    validateConnections: (sourceOutputs: string[], targetInputs: string[]) => boolean;
  };
  /** Security configuration */
  security: {
    allowedImports: string[];
    maxExecutionTime: number;
    memoryLimit: number;
    sandbox: boolean;
  };
  /** Quality metrics and documentation */
  quality: {
    testCoverage: number;
    documentation: string;
    examples: CodeExample[];
    version: string;
  };
}

export interface NodeInstance {
  id: string;
  type: string;
  settings: any;
}

export interface Connection {
  source: string;
  target: string;
  sourceOutput?: string;
  targetInput?: string;
}

export interface GeneratedPyTorchCode {
  code: string;
  metadata: {
    nodeCount: number;
    imports: string[];
    hasTraining: boolean;
    generatedAt: Date;
  };
}

export class CodeGenerationError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'CodeGenerationError';
  }
}

// ===============================================
// HELPER UTILITIES FOR PLUGIN DEVELOPERS
// ===============================================

export class PluginHelpers {
  /**
   * Create a standard property schema
   */
  static createProperty(
    type: PropertySchema['type'], 
    defaultValue: any, 
    description: string,
    options: Partial<PropertySchema> = {}
  ): PropertySchema {
    return {
      type,
      default: defaultValue,
      description,
      ...options
    };
  }
  
  /**
   * Create enum property schema
   */
  static createEnum(
    values: any[], 
    defaultValue: any, 
    description: string
  ): PropertySchema {
    return {
      type: typeof defaultValue as PropertySchema['type'],
      enum: values,
      default: defaultValue,
      description
    };
  }
  
  /**
   * Validate Python identifier
   */
  static validatePythonIdentifier(value: string): boolean | string {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
      return 'Must be a valid Python identifier (letters, numbers, underscore, cannot start with number)';
    }
    return true;
  }
  
  /**
   * Validate class name (starts with uppercase)
   */
  static validateClassName(value: string): boolean | string {
    if (!/^[A-Z][a-zA-Z0-9_]*$/.test(value)) {
      return 'Class name must start with uppercase letter and contain only alphanumeric characters and underscores';
    }
    return true;
  }
  
  /**
   * Generate parameter string from object
   */
  static generateParams(
    params: Record<string, any>, 
    excludeDefaults: Record<string, any> = {}
  ): string {
    return Object.entries(params)
      .filter(([key, value]) => value !== excludeDefaults[key])
      .map(([key, value]) => {
        if (typeof value === 'string') return `${key}="${value}"`;
        if (typeof value === 'boolean') return `${key}=${value ? 'True' : 'False'}`;
        return `${key}=${value}`;
      })
      .join(', ');
  }
}

// ===============================================
// COMMON SCHEMA PATTERNS
// ===============================================

export const CommonSchemas = {
  // Variable name property
  variableName: (defaultName: string, description: string): PropertySchema => ({
    type: 'string',
    default: defaultName,
    description,
    required: true,
    validation: PluginHelpers.validatePythonIdentifier
  }),
  
  // Class name property  
  className: (defaultName: string, description: string): PropertySchema => ({
    type: 'string',
    default: defaultName,
    description,
    required: true,
    validation: PluginHelpers.validateClassName
  }),
  
  // Integer with range
  integerRange: (min: number, max: number, defaultValue: number, description: string): PropertySchema => ({
    type: 'number',
    minimum: min,
    maximum: max,
    default: defaultValue,
    description,
    validation: (value: number) => Number.isInteger(value) || 'Must be an integer'
  }),
  
  // Activation function
  activationFunction: (defaultValue: string = 'ReLU'): PropertySchema => ({
    type: 'string',
    enum: ['ReLU', 'Sigmoid', 'Tanh', 'LeakyReLU', 'ELU', 'GELU', 'Swish'],
    default: defaultValue,
    description: 'Activation function to use'
  }),
  
  // Optimizer type
  optimizerType: (defaultValue: string = 'Adam'): PropertySchema => ({
    type: 'string',
    enum: ['Adam', 'SGD', 'AdamW', 'RMSprop', 'Adagrad'],
    default: defaultValue,
    description: 'Type of optimizer'
  })
};

// ===============================================
// PLUGIN STRUCTURE INTERFACES
// ===============================================

export interface PluginExport {
  name: string;
  version: string;
  description: string;
  author?: string;
  nodes: Record<string, new () => NodeDefinition>;
  config?: {
    requiredEnvironmentVars?: string[];
    recommendedMemory?: string;
    supportedPythonVersions?: string[];
  };
}

// ===============================================
// VERSION INFO
// ===============================================

export const TENSORIFY_TYPES_VERSION = "1.0.0";

// ===============================================
// TYPE GUARDS
// ===============================================

export function isNodeDefinition(obj: any): obj is NodeDefinition {
  return obj && 
    typeof obj.name === 'string' &&
    typeof obj.nodeType !== 'undefined' &&
    typeof obj.schema === 'object' &&
    typeof obj.codeGeneration === 'object' &&
    typeof obj.security === 'object' &&
    typeof obj.quality === 'object';
}

export function isValidPluginExport(obj: any): obj is PluginExport {
  return obj &&
    typeof obj.name === 'string' &&
    typeof obj.version === 'string' &&
    typeof obj.nodes === 'object';
}
