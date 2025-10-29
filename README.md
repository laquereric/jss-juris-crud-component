# JssJurisCrudComponent

A TypeScript package that extends [Juris.js](https://jurisjs.com) components to work with Jss and [JssStore](https://github.com/laquereric/jss-store), providing CRUD components for Jss objects stored in a JssStore.

## Features

- **CRUD Components**: Pre-built Create, Read, Update, and Delete components
- **Reactive Forms**: Extends Juris Reactive Real-World Form Component pattern
- **JssStore Integration**: Seamless integration with JssStore for state management
- **SHACL Validation**: Supports SHACL-based data validation
- **Progressive Enhancement**: Full support for Juris enhance() API
- **TypeScript**: Full TypeScript support with comprehensive type definitions
- **Zero Dependencies**: No external runtime dependencies (except peer dependencies)

## Installation

```bash
yarn add jss-juris-crud-component
```

Or with npm:

```bash
npm install jss-juris-crud-component
```

## Quick Start

```typescript
import { JssJurisCrudComponent } from 'jss-juris-crud-component';

// Create CRUD components for a SHACL data definition
const shaclUrl = './person-shape.ttl';
const crud = JssJurisCrudComponent.crud(shaclUrl);

// Get individual components
const CreateComponent = crud.get_create_component();
const ReadComponent = crud.get_read_component();
const UpdateComponent = crud.get_update_component();
const DeleteComponent = crud.get_delete_component();
```

## Usage

### With Juris.js

```typescript
import { JssJurisCrudComponent } from 'jss-juris-crud-component';

const personCrud = JssJurisCrudComponent.crud('./person-shape.ttl');

const app = new Juris({
  components: {
    CreatePerson: personCrud.get_create_component(),
    ReadPerson: personCrud.get_read_component(),
    UpdatePerson: personCrud.get_update_component(),
    DeletePerson: personCrud.get_delete_component()
  },
  layout: {
    div: {
      children: [
        { CreatePerson: { jssStatePath: 'persons.new' } },
        { ReadPerson: { jssStatePath: 'persons.john' } }
      ]
    }
  }
});

app.render('#app');
```

### Progressive Enhancement

```html
<!-- HTML -->
<div id="person-form" JssStatePath="persons.new"></div>
```

```javascript
// JavaScript
const crud = JssJurisCrudComponent.crud('./person-shape.ttl');
const CreateComponent = crud.get_create_component();

const formElement = document.getElementById('person-form');
const context = {
  getState: (path, defaultValue) => defaultValue,
  setState: (path, value) => console.log('State:', path, value)
};

const component = CreateComponent({}, context);
component.enhance(formElement);
```

## API Reference

### JssJurisCrudComponent.crud(shaclUrl)

Creates a CRUD component factory for a given SHACL data definition.

**Parameters:**
- `shaclUrl` (string): Path to the SHACL data definition file

**Returns:** Object with the following methods:
- `get_create_component()`: Returns JssJurisCreateComponent
- `get_read_component()`: Returns JssJurisReadComponent
- `get_update_component()`: Returns JssJurisUpdateComponent
- `get_delete_component()`: Returns JssJurisDeleteComponent

### JssJurisCreateComponent

Creates a form component for creating new objects.

**Behavior:**
1. Gets object from JssStatePath (a new object)
2. Creates an HTML form
3. Accepts user input updating that object
4. Offers 'Cancel' or 'Submit' buttons
5. On Submit: Validates the new object then puts the object to JssStatePath

**Props:**
- `jssStatePath` (string): Path in JssStore where the object will be stored
- `onSuccess` (function): Callback called after successful creation
- `onCancel` (function): Callback called when user cancels

### JssJurisReadComponent

Displays object values in read-only mode.

**Behavior:**
1. Renders object values in HTML
2. Offers 'Cancel' button

**Props:**
- `jssStatePath` (string): Path in JssStore to read the object from
- `onCancel` (function): Callback called when user cancels

### JssJurisUpdateComponent

Allows updating existing objects.

**Behavior:**
1. Renders object values in HTML
2. Allows update when 'Edit' button is clicked
3. Offers 'Cancel' or 'Save' buttons
4. Validates before saving

**Props:**
- `jssStatePath` (string): Path in JssStore to the object to update
- `onSuccess` (function): Callback called after successful update
- `onCancel` (function): Callback called when user cancels

### JssJurisDeleteComponent

Handles object deletion with confirmation.

**Behavior:**
1. Shows object preview
2. Requires confirmation before deletion
3. On Delete: Puts nil in the store at the specified path

**Props:**
- `jssStatePath` (string): Path in JssStore to the object to delete
- `onSuccess` (function): Callback called after successful deletion
- `onCancel` (function): Callback called when user cancels

## JssStatePath Attribute

The `JssStatePath` attribute specifies the path in JssStore where the object is stored or will be stored. It can be specified in three ways:

1. **HTML attribute**: `<div JssStatePath="users.john"></div>`
2. **Data attribute**: `<div data-jss-state-path="users.john"></div>`
3. **Component prop**: `{ CreatePerson: { jssStatePath: 'users.john' } }`

## Working with JssStore

JssStore provides a Proxy-based interface for storing and retrieving objects:

```javascript
// Store an object
JssStore.users.john({
  id: '1',
  name: 'John Doe',
  email: 'john@example.com'
});

// Retrieve an object
const user = JssStore.users.john;

// Update an object
JssStore.users.john({
  ...user,
  email: 'newemail@example.com'
});

// Delete an object
JssStore.delete('users.john');
// Or set to null
JssStore.users.john(null);
```

## SHACL Validation

Components automatically validate data based on SHACL constraints defined in the SHACL URL. The validation happens before submitting (Create) or saving (Update) data.

Example SHACL definition:

```turtle
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix ex: <http://example.org/> .

ex:PersonShape
  a sh:NodeShape ;
  sh:targetClass ex:Person ;
  sh:property [
    sh:path ex:name ;
    sh:datatype xsd:string ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
  ] ;
  sh:property [
    sh:path ex:email ;
    sh:datatype xsd:string ;
    sh:pattern "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" ;
  ] .
```

## Component Lifecycle

### Create Component
1. Component initialized with SHACL URL
2. `enhance()` called on DOM element
3. JssStatePath extracted from element attributes
4. Form fields generated from SHACL definition
5. User fills form
6. On submit: Data validated and stored in JssStore

### Read Component
1. Component initialized with SHACL URL
2. `enhance()` called on DOM element
3. JssStatePath extracted from element attributes
4. Object retrieved from JssStore
5. Fields rendered in read-only mode

### Update Component
1. Component initialized with SHACL URL
2. `enhance()` called on DOM element
3. JssStatePath extracted from element attributes
4. Object retrieved from JssStore
5. Fields rendered in disabled mode
6. User clicks 'Edit' to enable fields
7. User modifies data
8. On save: Data validated and updated in JssStore

### Delete Component
1. Component initialized with SHACL URL
2. `enhance()` called on DOM element
3. JssStatePath extracted from element attributes
4. Object retrieved from JssStore
5. Object preview displayed
6. User confirms deletion
7. Object removed from JssStore (set to null)

## Examples

See the `examples/` directory for complete examples:

- `enhance-example.html`: Progressive enhancement example
- `usage-example.ts`: TypeScript usage examples

## Development

```bash
# Install dependencies
yarn install

# Build the package
yarn build

# Run tests
yarn test

# Watch mode for tests
yarn test:watch
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Links

- [Juris.js Documentation](https://jurisjs.com/#/docs)
- [JssStore Repository](https://github.com/laquereric/jss-store)
- [SHACL Specification](https://www.w3.org/TR/shacl/)
