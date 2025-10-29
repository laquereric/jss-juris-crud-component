/**
 * BaseJurisCrudComponent
 * 
 * Base class providing shared functionality for all CRUD components
 */

import {
  CrudConfig,
  JurisContext,
  EnhancedElementAttributes,
  JssStoreInterface,
  JssValidator,
  FormField
} from '../types';

/**
 * Base CRUD component functionality
 */
export class BaseJurisCrudComponent {
  protected config: CrudConfig;
  protected jssValidator: JssValidator | null = null;

  constructor(config: CrudConfig) {
    this.config = config;
  }

  /**
   * Get JssStatePath from element attributes
   */
  protected getJssStatePath(element: HTMLElement): string | null {
    return element.getAttribute('JssStatePath') || 
           element.getAttribute('jss-state-path') ||
           element.getAttribute('data-jss-state-path');
  }

  /**
   * Get object from JssStore at the given path
   */
  protected getFromStore(JssStore: JssStoreInterface, path: string): any {
    const pathParts = path.split('.');
    let current: any = JssStore;
    
    for (const part of pathParts) {
      if (current && typeof current === 'object') {
        current = current[part];
      } else {
        return undefined;
      }
    }
    
    return current;
  }

  /**
   * Put object to JssStore at the given path
   */
  protected putToStore(JssStore: JssStoreInterface, path: string, value: any): void {
    const pathParts = path.split('.');
    const lastPart = pathParts.pop();
    
    if (!lastPart) return;
    
    let current: any = JssStore;
    
    // Navigate to the parent object
    for (const part of pathParts) {
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
    
    // Set the value using function call (JssStore's dual get/put behavior)
    if (typeof current[lastPart] === 'function') {
      current[lastPart](value);
    } else {
      // Create the property as a function for future use
      const storedValue = value;
      Object.defineProperty(current, lastPart, {
        get: () => storedValue,
        set: (newValue) => {
          // This allows both property access and function call
          current[lastPart](newValue);
        },
        enumerable: true,
        configurable: true
      });
    }
  }

  /**
   * Delete object from JssStore at the given path
   */
  protected deleteFromStore(JssStore: JssStoreInterface, path: string): void {
    JssStore.delete(path);
  }

  /**
   * Load and initialize Jss validator from SHACL URL
   */
  protected async loadJssValidator(): Promise<JssValidator | null> {
    if (this.jssValidator) {
      return this.jssValidator;
    }

    try {
      // This is a placeholder - actual implementation would load Jss library
      // and create validator from SHACL definition
      // const Jss = await import('jss');
      // this.jssValidator = await Jss.create(this.config.shaclUrl);
      
      // For now, return a mock validator
      this.jssValidator = {
        to_jss: (data: any) => data,
        validate: (data: any) => true
      };
      
      return this.jssValidator;
    } catch (error) {
      console.error('Failed to load Jss validator:', error);
      return null;
    }
  }

  /**
   * Validate data using Jss validator
   */
  protected async validateData(data: any): Promise<{ valid: boolean; errors?: string[] }> {
    const validator = await this.loadJssValidator();
    
    if (!validator) {
      return { valid: false, errors: ['Validator not available'] };
    }

    try {
      const isValid = validator.validate(data);
      return { valid: isValid };
    } catch (error: any) {
      return { valid: false, errors: [error.message] };
    }
  }

  /**
   * Extract form fields from SHACL definition
   * This is a placeholder - actual implementation would parse SHACL
   */
  protected async getFormFields(): Promise<FormField[]> {
    // Placeholder implementation
    // Actual implementation would parse SHACL definition to extract fields
    return [
      { name: 'id', label: 'ID', type: 'text', required: false },
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: false }
    ];
  }

  /**
   * Create form element from field definition
   */
  protected createFormField(field: FormField, value: any = ''): any {
    const inputType = field.type === 'textarea' ? 'textarea' : 'input';
    
    return {
      div: {
        className: 'form-field',
        children: [
          {
            label: {
              text: field.label + (field.required ? ' *' : ''),
              htmlFor: field.name
            }
          },
          {
            [inputType]: {
              id: field.name,
              name: field.name,
              type: field.type !== 'textarea' ? field.type : undefined,
              value: value || field.defaultValue || '',
              required: field.required || false,
              className: 'form-input'
            }
          }
        ]
      }
    };
  }
}
