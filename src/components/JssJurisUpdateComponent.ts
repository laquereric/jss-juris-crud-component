/**
 * JssJurisUpdateComponent
 * 
 * Update component for modifying existing Jss objects in JssStore
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
 * Factory function for JssJurisUpdateComponent
 */
export function JssJurisUpdateComponent(config: CrudConfig): JurisComponent {
  return (props: JurisComponentProps, context: JurisContext) => {
    const { getState, setState } = context;
    const base = new BaseJurisCrudComponent(config);

    return {
      render: (): ObjectDOMElement => {
        return {
          div: {
            className: 'jss-juris-update-component',
            children: () => {
              const objectData = getState('_objectData', null);
              const errors = getState('_formErrors', []);
              const isEditing = getState('_isEditing', false);

              if (!objectData) {
                return [
                  {
                    p: {
                      className: 'no-data',
                      text: 'No data available'
                    }
                  }
                ];
              }

              return [
                {
                  h2: {
                    text: 'Update Item'
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
                    id: 'update-form',
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

                      // Get JssStore from global scope
                      const JssStore = (window as any).JssStore;
                      
                      if (!JssStore) {
                        setState('_formErrors', ['JssStore not available']);
                        return;
                      }

                      // Get the state path
                      const statePath = getState('_jssStatePath') || props.jssStatePath;
                      
                      if (!statePath) {
                        setState('_formErrors', ['JssStatePath not specified']);
                        return;
                      }

                      // Update the object in JssStore
                      try {
                        base['putToStore'](JssStore, statePath, data);
                        
                        // Update local state
                        setState('_objectData', data);
                        setState('_formErrors', []);
                        setState('_isEditing', false);
                        
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
                          children: () => {
                            const editing = getState('_isEditing', false);
                            
                            if (!editing) {
                              return [
                                {
                                  button: {
                                    type: 'button',
                                    text: 'Edit',
                                    className: 'btn btn-primary',
                                    onclick: () => {
                                      setState('_isEditing', true);
                                      
                                      // Enable form fields
                                      const form = document.getElementById('update-form') as HTMLFormElement;
                                      if (form) {
                                        const inputs = form.querySelectorAll('input, textarea, select');
                                        inputs.forEach(input => {
                                          (input as HTMLInputElement).disabled = false;
                                        });
                                      }
                                    }
                                  }
                                },
                                {
                                  button: {
                                    type: 'button',
                                    text: 'Cancel',
                                    className: 'btn btn-secondary',
                                    onclick: () => {
                                      if (props.onCancel) {
                                        props.onCancel();
                                      }
                                    }
                                  }
                                }
                              ];
                            }
                            
                            return [
                              {
                                button: {
                                  type: 'submit',
                                  text: 'Save',
                                  className: 'btn btn-primary'
                                }
                              },
                              {
                                button: {
                                  type: 'button',
                                  text: 'Cancel Edit',
                                  className: 'btn btn-secondary',
                                  onclick: () => {
                                    setState('_isEditing', false);
                                    setState('_formErrors', []);
                                    
                                    // Disable form fields and reset values
                                    const form = document.getElementById('update-form') as HTMLFormElement;
                                    if (form) {
                                      form.reset();
                                      const inputs = form.querySelectorAll('input, textarea, select');
                                      inputs.forEach(input => {
                                        (input as HTMLInputElement).disabled = true;
                                      });
                                    }
                                  }
                                }
                              }
                            ];
                          }
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
            // Get object from store
            const obj = base['getFromStore'](JssStore, jssStatePath);
            
            if (obj) {
              setState('_objectData', obj);
            }
            
            // Load form fields from SHACL definition
            const fields = await base['getFormFields']();
            
            // Dynamically create form fields
            const formFieldsContainer = element.querySelector('#form-fields');
            
            if (formFieldsContainer && obj) {
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
                input.disabled = true; // Start in read-only mode
                
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
