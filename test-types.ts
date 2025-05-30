// Simple test to verify types work correctly
import { 
  NodeDefinition, 
  NodeType, 
  PluginHelpers, 
  CommonSchemas,
  CodeFragment,
  GenerationContext
} from './src/index';

// Test type compilation
const testSchema = CommonSchemas.variableName("test", "Test variable");
const testProperty = PluginHelpers.createProperty('string', 'default', 'Test property');

console.log('✓ Type definitions compile successfully');
console.log('✓ Imports work correctly');
console.log('✓ Helper functions are accessible');

export {}; // Make this a module
