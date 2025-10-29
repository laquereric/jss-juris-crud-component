/**
 * JssJurisCreateComponent
 * 
 * Create component for adding new Jss objects to JssStore
 */

import {
  CrudConfig,
  JurisComponent,
  JurisContext,
  JurisComponentProps,
  ObjectDOMElement
} from '../types';
import { BaseJurisCrudComponent } from './BaseJurisCrudComponent';

/**
 * Factory function for JssJurisCreateComponent
 */
export function JssJurisCreateComponent(config: CrudConfig): JurisComponent {
  return (props: JurisComponentProps, context: JurisContext) => {
    const { getState, setState } = context;
    const base = new BaseJurisCrudComponent(config);

    return {
      render: (): ObjectDOMElement => {
        return {
          div: {
            className: 'jss-juris-create-component',
            children: () => {
              const formData = getState('_formData', {});
              const errors = getState('_formErrors', []);

              return [
                {
                  h2: {
                    text: 'Create New Item'
                  }
                },
                errors.length > 0 ? {
                  div: {
                    className: 'error-messages',
                    children: errors.map((error: string) => ({
                      p: {
                        className: 'error',
                        text: error
                      }
                    }))
                  }
                } : null,
                {
                  form: {
                    id: 'create-form',
                    className: 'crud-form',
                    onsubmit: async (e: Event) => {
                      e.preventDefault();
                      
                      const form = e.target as HTMLFormElement;
                      const formData = new FormData(form);
                      const data: any = {};
                      
                      formData.forEach((value, key) => {
                        data[key] = value;
                      });

                      // Validate the data
                      const validation = await base['validateData'](data);
                      
                      if (!validation.valid) {
                        setState('_formErrors', validation.errors || ['Validation failed']);
                        return;
                      }

                      // Get JssStore from global scope or context
                      const JssStore = (window as any).JssStore;
                      
                      if (!JssStore) {
                        setState('_formErrors', ['JssStore not available']);
                        return;
                      }

                      // Get the state path from form data or props
                      const statePath = getState('_jssStatePath') || props.jssStatePath;
                      
                      if (!statePath) {
                        setState('_formErrors', ['JssStatePath not specified']);
                        return;
                      }

                      // Put the validated object to JssStore
                      try {
                        base['putToStore'](JssStore, statePath, data);
                        
                        // Clear form and errors
                        setState('_formData', {});
                        setState('_formErrors', []);
                        
                        // Reset form
                        form.reset();
                        
                        // Trigger success callback if provided
                        if (props.onSuccess) {
                          props.onSuccess(data);
                        }
                      } catch (error: any) {
                        setState('_formErrors', [error.message]);
                      }
                    },
                    children: [
                      {
                        div: {
                          id: 'form-fields',
                          className: 'form-fields'
                          // Fields will be dynamically generated via enhance
                        }
                      },
                      {
                        div: {
                          className: 'form-actions',
                          children: [
                            {
                              button: {
                                type: 'submit',
                                text: 'Submit',
                                className: 'btn btn-primary'
                              }
                            },
                            {
                              button: {
                                type: 'button',
                                text: 'Cancel',
                                className: 'btn btn-secondary',
                                onclick: () => {
                                  setState('_formData', {});
                                  setState('_formErrors', []);
                                  
                                  if (props.onCancel) {
                                    props.onCancel();
                                  }
                                }
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ].filter(Boolean);
            }
          }
        };
      },

      /**
       * Enhance method for progressive enhancement
       */
      enhance: async (element: HTMLElement) => {
        const jssStatePath = base['getJssStatePath'](element);
        
        if (jssStatePath) {
          setState('_jssStatePath', jssStatePath);
          
          // Get JssStore
          const JssStore = (window as any).JssStore;
          
          if (JssStore) {
            // Get or create new object at path
            let obj = base['getFromStore'](JssStore, jssStatePath);
            
            if (!obj) {
              obj = {};
              base['putToStore'](JssStore, jssStatePath, obj);
            }
            
            // Load form fields from SHACL definition
            const fields = await base['getFormFields']();
            
            // Dynamically create form fields
            const formFieldsContainer = element.querySelector('#form-fields');
            
            if (formFieldsContainer) {
              fields.forEach(field => {
                const fieldElement = document.createElement('div');
                fieldElement.className = 'form-field';
                
                const label = document.createElement('label');
                label.textContent = field.label + (field.required ? ' *' : '');
                label.htmlFor = field.name;
                
                const input = field.type === 'textarea' 
                  ? document.createElement('textarea')
                  : document.createElement('input');
                  
                input.id = field.name;
                input.name = field.name;
                input.className = 'form-input';
                
                if (field.type !== 'textarea') {
                  (input as HTMLInputElement).type = field.type;
                }
                
                if (field.required) {
                  input.required = true;
                }
                
                if (obj[field.name]) {
                  input.value = obj[field.name];
                }
                
                fieldElement.appendChild(label);
                fieldElement.appendChild(input);
                formFieldsContainer.appendChild(fieldElement);
              });
            }
          }
        }
      }
    };
  };
}
