/**
 * Type definitions for JssJurisCrudComponent
 */

/**
 * Juris component context interface
 */
export interface JurisContext {
  getState: (path: string, defaultValue?: any) => any;
  setState: (path: string, value: any) => void;
}

/**
 * Juris component props interface
 */
export interface JurisComponentProps {
  [key: string]: any;
}

/**
 * Juris component interface
 */
export interface JurisComponent {
  (props: JurisComponentProps, context: JurisContext): {
    render: () => any;
    enhance?: (element: HTMLElement) => void;
  };
}

/**
 * Object DOM element structure
 */
export type ObjectDOMElement = {
  [tagName: string]: any;
};

/**
 * CRUD component configuration
 */
export interface CrudConfig {
  shaclUrl: string;
}

/**
 * CRUD component methods interface
 */
export interface CrudComponentMethods {
  get_create_component: () => JurisComponent;
  get_read_component: () => JurisComponent;
  get_update_component: () => JurisComponent;
  get_delete_component: () => JurisComponent;
}

/**
 * JssStore interface (based on jss-store package)
 */
export interface JssStoreInterface {
  has(path: string | string[]): boolean;
  delete(path: string | string[]): void;
  clear(): void;
  keys(): string[][];
  toJSON(): any;
  fromJSON(data: any): void;
  find(predicate: (value: any, path: string[]) => boolean): any[];
  getMetadata(path: string | string[]): any;
  getRawStore(): any;
  [key: string]: any;
}

/**
 * Jss validator interface (for SHACL validation)
 */
export interface JssValidator {
  to_jss(data: any): any;
  validate(data: any): boolean;
}

/**
 * Enhanced element attributes
 */
export interface EnhancedElementAttributes {
  JssStatePath?: string;
  [key: string]: any;
}

/**
 * Form field definition
 */
export interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  defaultValue?: any;
}

/**
 * CRUD operation types
 */
export type CrudOperation = 'create' | 'read' | 'update' | 'delete';
