/**
 * JssJurisReadComponent
 * 
 * Read component for displaying Jss objects from JssStore
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
 * Factory function for JssJurisReadComponent
 */
export function JssJurisReadComponent(config: CrudConfig): JurisComponent {
  return (props: JurisComponentProps, context: JurisContext) => {
    const { getState, setState } = context;
    const base = new BaseJurisCrudComponent(config);

    return {
      render: (): ObjectDOMElement => {
        return {
          div: {
            className: 'jss-juris-read-component',
            children: () => {
              const objectData = getState('_objectData', null);
              const fields = getState('_fields', []);

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
                    text: 'View Item'
                  }
                },
                {
                  div: {
                    className: 'data-display',
                    children: fields.map((field: any) => ({
                      div: {
                        className: 'data-field',
                        children: [
                          {
                            dt: {
                              text: field.label
                            }
                          },
                          {
                            dd: {
                              text: () => {
                                const data = getState('_objectData', {});
                                return data[field.name] || '-';
                              }
                            }
                          }
                        ]
                      }
                    }))
                  }
                },
                {
                  div: {
                    className: 'form-actions',
                    children: [
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
                    ]
                  }
                }
              ];
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
            setState('_fields', fields);
            
            // Render object values in HTML
            const dataDisplay = element.querySelector('.data-display');
            
            if (dataDisplay && obj) {
              dataDisplay.innerHTML = '';
              
              fields.forEach(field => {
                const fieldElement = document.createElement('div');
                fieldElement.className = 'data-field';
                
                const dt = document.createElement('dt');
                dt.textContent = field.label;
                
                const dd = document.createElement('dd');
                dd.textContent = obj[field.name] || '-';
                
                fieldElement.appendChild(dt);
                fieldElement.appendChild(dd);
                dataDisplay.appendChild(fieldElement);
              });
            }
          }
        }
      }
    };
  };
}
