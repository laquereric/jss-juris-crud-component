/**
 * Example usage of JssJurisCrudComponent
 */

import { JssJurisCrudComponent } from '../src';

// Example 1: Basic CRUD component creation
const shaclUrl = './schemas/person-shape.ttl';
const personCrud = JssJurisCrudComponent.crud(shaclUrl);

// Get individual CRUD components
const CreatePersonComponent = personCrud.get_create_component();
const ReadPersonComponent = personCrud.get_read_component();
const UpdatePersonComponent = personCrud.get_update_component();
const DeletePersonComponent = personCrud.get_delete_component();

// Example 2: Using with Juris.js
declare const Juris: any;

const app = new Juris({
  components: {
    CreatePerson: CreatePersonComponent,
    ReadPerson: ReadPersonComponent,
    UpdatePerson: UpdatePersonComponent,
    DeletePerson: DeletePersonComponent
  },
  layout: {
    div: {
      children: [
        { CreatePerson: { jssStatePath: 'persons.new' } },
        { ReadPerson: { jssStatePath: 'persons.john' } },
        { UpdatePerson: { jssStatePath: 'persons.john' } },
        { DeletePerson: { jssStatePath: 'persons.john' } }
      ]
    }
  }
});

app.render('#app');

// Example 3: Progressive Enhancement
// HTML: <div id="person-form" JssStatePath="persons.new"></div>

const enhanceForm = () => {
  const formElement = document.getElementById('person-form');
  
  if (formElement) {
    const context = {
      getState: (path: string, defaultValue?: any) => {
        // Implement state management
        return defaultValue;
      },
      setState: (path: string, value: any) => {
        // Implement state management
        console.log('State updated:', path, value);
      }
    };
    
    const component = CreatePersonComponent({}, context);
    
    if (component.enhance) {
      component.enhance(formElement);
    }
  }
};

// Example 4: With callbacks
const CreateWithCallbacks = personCrud.get_create_component();

const componentWithCallbacks = CreateWithCallbacks(
  {
    jssStatePath: 'persons.new',
    onSuccess: (data: any) => {
      console.log('Person created successfully:', data);
      // Navigate to list view or show success message
    },
    onCancel: () => {
      console.log('Creation cancelled');
      // Navigate back or clear form
    }
  },
  {
    getState: (path: string, defaultValue?: any) => defaultValue,
    setState: (path: string, value: any) => console.log('State:', path, value)
  }
);

// Example 5: Multiple entity types
const productCrud = JssJurisCrudComponent.crud('./schemas/product-shape.ttl');
const orderCrud = JssJurisCrudComponent.crud('./schemas/order-shape.ttl');

const multiEntityApp = new Juris({
  components: {
    CreateProduct: productCrud.get_create_component(),
    ReadProduct: productCrud.get_read_component(),
    UpdateProduct: productCrud.get_update_component(),
    DeleteProduct: productCrud.get_delete_component(),
    
    CreateOrder: orderCrud.get_create_component(),
    ReadOrder: orderCrud.get_read_component(),
    UpdateOrder: orderCrud.get_update_component(),
    DeleteOrder: orderCrud.get_delete_component()
  }
});

// Example 6: Working with JssStore directly
declare const JssStore: any;

// Create a new person
JssStore.persons.alice({
  id: '2',
  name: 'Alice Smith',
  email: 'alice@example.com',
  age: 28
});

// Read person data
const alice = JssStore.persons.alice;
console.log('Alice:', alice);

// Update person data
JssStore.persons.alice({
  ...alice,
  age: 29
});

// Delete person data
JssStore.delete('persons.alice');
// Or set to null
JssStore.persons.alice(null);

// Example 7: Form validation with SHACL
const validatedCrud = JssJurisCrudComponent.crud('./schemas/validated-person-shape.ttl');

// The components will automatically validate input based on SHACL constraints
const ValidatedCreateComponent = validatedCrud.get_create_component();

// Example 8: Custom styling
const styledComponent = CreatePersonComponent(
  {
    jssStatePath: 'persons.new',
    className: 'custom-form-style',
    onSuccess: (data: any) => {
      console.log('Created:', data);
    }
  },
  {
    getState: (path: string, defaultValue?: any) => defaultValue,
    setState: (path: string, value: any) => {}
  }
);

export {
  personCrud,
  CreatePersonComponent,
  ReadPersonComponent,
  UpdatePersonComponent,
  DeletePersonComponent
};
