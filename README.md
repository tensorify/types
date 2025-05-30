# @tensorify/types

Official TypeScript type definitions for Tensorify plugin development.

## Installation

```bash
npm install @tensorify/types
# or
yarn add @tensorify/types
```

## Usage

```typescript
import { 
  NodeDefinition, 
  EnhancedNodeSchema, 
  CodeFragment, 
  GenerationContext,
  NodeType,
  PluginHelpers,
  CommonSchemas
} from '@tensorify/types';

export class MyCustomNode implements NodeDefinition {
  name = "My Custom Node";
  nodeType = NodeType.CUSTOM;
  inputLines = 1;
  outputLinesCount = 1;
  secondaryInputLinesCount = 0;
  translationTemplate = "";
  
  settings = {
    nodeName: "my_node",
    customParam: "default_value"
  };
  
  schema: EnhancedNodeSchema = {
    properties: {
      nodeName: CommonSchemas.variableName("my_node", "Variable name for this node"),
      customParam: PluginHelpers.createProperty('string', 'default_value', 'Your custom parameter')
    },
    required: ['nodeName']
  };
  
  codeGeneration = {
    generateCode: (settings: any, context: GenerationContext): CodeFragment => ({
      imports: ['import torch'],
      definitions: [],
      instantiations: [`${settings.nodeName} = torch.tensor([1, 2, 3])`],
      usage: {
        forward: `${context.outputVar} = ${settings.nodeName}`,
        parameters: `# Custom node with ${settings.customParam}`,
        named_parameters: `('${settings.nodeName}', ${settings.nodeName})`
      }
    }),
    getDependencies: () => [],
    getOutputs: (settings) => [`custom_${settings.nodeName}`],
    validateConnections: () => true
  };
  
  security = {
    allowedImports: ['torch'],
    maxExecutionTime: 30000,
    memoryLimit: 1024 * 1024 * 100,
    sandbox: true
  };
  
  quality = {
    testCoverage: 0.9,
    documentation: "# My Custom Node\n\nDoes something awesome.",
    examples: [{
      title: "Basic Usage",
      description: "Simple example",
      settings: { nodeName: "test", customParam: "example" },
      expectedOutput: "test = torch.tensor([1, 2, 3])"
    }],
    version: "1.0.0"
  };
}
```

## API Reference

### Core Interfaces

- **`NodeDefinition`** - Main interface for plugin nodes
- **`INode<T>`** - Base node interface  
- **`Layer`** - Layer structure definition
- **`PropertySchema`** - Schema for node properties
- **`EnhancedNodeSchema`** - Complete schema with validation
- **`CodeFragment`** - Structure for generated code
- **`GenerationContext`** - Context for code generation

### Enums

- **`NodeType`** - Available node types (CUSTOM, LAYER, OPTIMIZER, etc.)

### Utilities

- **`PluginHelpers`** - Helper functions for plugin development
  - `createProperty()` - Create property schemas
  - `createEnum()` - Create enum properties  
  - `validatePythonIdentifier()` - Validate Python variable names
  - `validateClassName()` - Validate Python class names
  - `generateParams()` - Generate parameter strings

- **`CommonSchemas`** - Pre-built schema patterns
  - `variableName()` - Python variable name schema
  - `className()` - Python class name schema
  - `integerRange()` - Integer with min/max validation
  - `activationFunction()` - Activation function enum
  - `optimizerType()` - Optimizer type enum

### Plugin Structure

- **`PluginExport`** - Structure for plugin exports
- **`NodeInstance`** - Runtime node instance
- **`Connection`** - Node connections

## Examples

See the [Tensorify Plugin Development Guide](https://docs.tensorify.io/plugins) for comprehensive examples and tutorials.

## Type Guards

```typescript
import { isNodeDefinition, isValidPluginExport } from '@tensorify/types';

// Check if object implements NodeDefinition
if (isNodeDefinition(myObject)) {
  // TypeScript knows myObject is NodeDefinition
  const fragment = myObject.codeGeneration.generateCode(settings, context);
}

// Check if plugin export is valid
if (isValidPluginExport(pluginObject)) {
  // Safe to use plugin
  const nodeClass = pluginObject.nodes['MyNode'];
}
```

## Compatibility

- **Node.js**: >= 14.0.0
- **TypeScript**: >= 4.0.0
- **Package Managers**: npm, yarn, pnpm

## Support

- **Documentation**: [https://docs.tensorify.io/types](https://docs.tensorify.io/types)
- **Plugin Guide**: [https://docs.tensorify.io/plugins](https://docs.tensorify.io/plugins)
- **Issues**: [https://github.com/tensorify/types/issues](https://github.com/tensorify/types/issues)

## License

MIT © Tensorify Team
