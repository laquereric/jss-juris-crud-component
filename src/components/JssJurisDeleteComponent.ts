/**
 * JssJurisDeleteComponent
 * 
 * Delete component for removing Jss objects from JssStore
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
 * Factory function for JssJurisDeleteComponent
 */
export function JssJurisDeleteComponent(config: CrudConfig): JurisComponent {
  return (props: JurisComponentProps, context: JurisContext) => {
    const { getState, setState } = context;
    const base = new BaseJurisCrudComponent(config);

    return {
      render: (): ObjectDOMElement => {
        return {
          div: {
            className: 'jss-juris-delete-component',
            children: () => {
              const objectData = getState('_objectData', null);
              const confirmDelete = getState('_confirmDelete', false);
              const errors = getState('_formErrors', []);

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
                    text: 'Delete Item'
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
                !confirmDelete ? {
                  div: {
                    className: 'data-display',
                    children: [
                      {
                        p: {
                          text: 'Are you sure you want to delete this item?'
                        }
                      },
                      {
                        div: {
                          id: 'item-preview',
                          className: 'item-preview'
                          // Will be populated via enhance
                        }
                      }
                    ]
                  }
                } : {
                  div: {
                    className: 'delete-confirmation',
                    children: [
                      {
                        p: {
                          className: 'warning',
                          text: '⚠️ This action cannot be undone. Are you absolutely sure?'
                        }
                      }
                    ]
                  }
                },
                {
                  div: {
                    className: 'form-actions',
                    children: () => {
                      const needsConfirm = getState('_confirmDelete', false);
                      
                      if (!needsConfirm) {
                        return [
                          {
                            button: {
                              type: 'button',
                              text: 'Delete',
                              className: 'btn btn-danger',
                              onclick: () => {
                                setState('_confirmDelete', true);
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
                            type: 'button',
                            text: 'Confirm Delete',
                            className: 'btn btn-danger',
                            onclick: () => {
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

                              try {
                                // Delete from store (put nil/null)
                                base['putToStore'](JssStore, statePath, null);
                                // Or use delete method
                                // base['deleteFromStore'](JssStore, statePath);
                                
                                // Clear local state
                                setState('_objectData', null);
                                setState('_confirmDelete', false);
                                setState('_formErrors', []);
                                
                                // Trigger success callback if provided
                                if (props.onSuccess) {
                                  props.onSuccess(null);
                                }
                              } catch (error: any) {
                                setState('_formErrors', [error.message]);
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
                              setState('_confirmDelete', false);
                            }
                          }
                        }
                      ];
                    }
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
              
              // Load form fields from SHACL definition
              const fields = await base['getFormFields']();
              
              // Display item preview
              const previewContainer = element.querySelector('#item-preview');
              
              if (previewContainer) {
                fields.forEach(field => {
                  const fieldElement = document.createElement('div');
                  fieldElement.className = 'preview-field';
                  
                  const label = document.createElement('strong');
                  label.textContent = field.label + ': ';
                  
                  const value = document.createElement('span');
                  value.textContent = obj[field.name] || '-';
                  
                  fieldElement.appendChild(label);
                  fieldElement.appendChild(value);
                  previewContainer.appendChild(fieldElement);
                });
              }
            }
          }
        }
      }
    };
  };
}
