/**
 * JssJurisCrudComponent
 * 
 * Main class that provides CRUD component factory methods for Jss objects
 * stored in JssStore, integrated with Juris.js reactive components.
 */

import {
  CrudConfig,
  CrudComponentMethods,
  JurisComponent,
  JurisContext,
  JurisComponentProps
} from './types';
import { JssJurisCreateComponent } from './components/JssJurisCreateComponent';
import { JssJurisReadComponent } from './components/JssJurisReadComponent';
import { JssJurisUpdateComponent } from './components/JssJurisUpdateComponent';
import { JssJurisDeleteComponent } from './components/JssJurisDeleteComponent';

/**
 * JssJurisCrudComponent class
 * 
 * Factory class for creating CRUD components that work with JssStore and Juris.js
 */
export class JssJurisCrudComponent {
  /**
   * Create CRUD components for a given SHACL data definition
   * 
   * @param shaclUrl - Path to the SHACL data definition file
   * @returns Object with methods to get each CRUD component
   */
  static crud(shaclUrl: string): CrudComponentMethods {
    const config: CrudConfig = { shaclUrl };

    return {
      /**
       * Get the Create component
       */
      get_create_component: (): JurisComponent => {
        return JssJurisCreateComponent(config);
      },

      /**
       * Get the Read component
       */
      get_read_component: (): JurisComponent => {
        return JssJurisReadComponent(config);
      },

      /**
       * Get the Update component
       */
      get_update_component: (): JurisComponent => {
        return JssJurisUpdateComponent(config);
      },

      /**
       * Get the Delete component
       */
      get_delete_component: (): JurisComponent => {
        return JssJurisDeleteComponent(config);
      }
    };
  }
}

export default JssJurisCrudComponent;
