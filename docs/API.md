# API Documentation

## Table of Contents

1. [JssJurisCrudComponent](#jssjuriscrudcomponent)
2. [CRUD Components](#crud-components)
   - [JssJurisCreateComponent](#jssjuriscreatecomponent)
   - [JssJurisReadComponent](#jssjurisreadcomponent)
   - [JssJurisUpdateComponent](#jssjurisupdatecomponent)
   - [JssJurisDeleteComponent](#jssjurisdeletecomponent)
3. [Base Component](#base-component)
4. [Type Definitions](#type-definitions)

---

## JssJurisCrudComponent

Main factory class for creating CRUD components.

### Methods

#### `crud(shaclUrl: string): CrudComponentMethods`

Creates CRUD components for a given SHACL data definition.

**Parameters:**
- `shaclUrl` (string): Path to the SHACL data definition file

**Returns:** `CrudComponentMethods` object with:
- `get_create_component(): JurisComponent`
- `get_read_component(): JurisComponent`
- `get_update_component(): JurisComponent`
- `get_delete_component(): JurisComponent`

**Example:**
```typescript
const crud = JssJurisCrudComponent.crud('./person-shape.ttl');
const CreateComponent = crud.get_create_component();
```

---

## CRUD Components

All CRUD components follow the Juris component pattern and support the enhance API.

### Component Structure

Each component is a function that takes `props` and `context` and returns an object with:
- `render()`: Function that returns Object DOM structure
- `enhance(element: HTMLElement)`: Optional function for progressive enhancement

### Common Props

All CRUD components accept these props:

- `jssStatePath` (string): Path in JssStore where the object is stored
- `onSuccess` (function): Callback called after successful operation
- `onCancel` (function): Callback called when user cancels

### Common Context

All components receive a Juris context with:

- `getState(path: string, defaultValue?: any): any` - Get reactive state
- `setState(path: string, value: any): void` - Set state value

---

## JssJurisCreateComponent

Component for creating new objects.

### Behavior

1. Gets object from JssStatePath (creates new if doesn't exist)
2. Generates HTML form from SHACL definition
3. Accepts user input
4. Validates input on submit
5. Stores validated object in JssStore

### Props

```typescript
interface CreateComponentProps {
  jssStatePath?: string;
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  className?: string;
}
```

### Usage

```typescript
const CreateComponent = crud.get_create_component();

const component = CreateComponent(
  {
    jssStatePath: 'users.new',
    onSuccess: (data) => console.log('Created:', data),
    onCancel: () => console.log('Cancelled')
  },
  context
);
```

### HTML Structure

```html
<div class="jss-juris-create-component">
  <h2>Create New Item</h2>
  <form id="create-form" class="crud-form">
    <div id="form-fields" class="form-fields">
      <!-- Dynamically generated fields -->
    </div>
    <div class="form-actions">
      <button type="submit" class="btn btn-primary">Submit</button>
      <button type="button" class="btn btn-secondary">Cancel</button>
    </div>
  </form>
</div>
```

---

## JssJurisReadComponent

Component for displaying objects in read-only mode.

### Behavior

1. Retrieves object from JssStore at JssStatePath
2. Renders object values in HTML
3. Displays fields based on SHACL definition

### Props

```typescript
interface ReadComponentProps {
  jssStatePath?: string;
  onCancel?: () => void;
  className?: string;
}
```

### Usage

```typescript
const ReadComponent = crud.get_read_component();

const component = ReadComponent(
  {
    jssStatePath: 'users.john',
    onCancel: () => console.log('Cancelled')
  },
  context
);
```

### HTML Structure

```html
<div class="jss-juris-read-component">
  <h2>View Item</h2>
  <div class="data-display">
    <!-- Dynamically generated field displays -->
  </div>
  <div class="form-actions">
    <button type="button" class="btn btn-secondary">Cancel</button>
  </div>
</div>
```

---

## JssJurisUpdateComponent

Component for updating existing objects.

### Behavior

1. Retrieves object from JssStore at JssStatePath
2. Renders fields in disabled mode initially
3. Enables editing when 'Edit' button is clicked
4. Validates changes on save
5. Updates object in JssStore

### Props

```typescript
interface UpdateComponentProps {
  jssStatePath?: string;
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  className?: string;
}
```

### Usage

```typescript
const UpdateComponent = crud.get_update_component();

const component = UpdateComponent(
  {
    jssStatePath: 'users.john',
    onSuccess: (data) => console.log('Updated:', data),
    onCancel: () => console.log('Cancelled')
  },
  context
);
```

### HTML Structure

```html
<div class="jss-juris-update-component">
  <h2>Update Item</h2>
  <form id="update-form" class="crud-form">
    <div id="form-fields" class="form-fields">
      <!-- Dynamically generated fields (initially disabled) -->
    </div>
    <div class="form-actions">
      <button type="button" class="btn btn-primary">Edit</button>
      <button type="button" class="btn btn-secondary">Cancel</button>
    </div>
  </form>
</div>
```

---

## JssJurisDeleteComponent

Component for deleting objects with confirmation.

### Behavior

1. Retrieves object from JssStore at JssStatePath
2. Displays object preview
3. Requires confirmation before deletion
4. Sets object to null in JssStore on confirmed deletion

### Props

```typescript
interface DeleteComponentProps {
  jssStatePath?: string;
  onSuccess?: (data: null) => void;
  onCancel?: () => void;
  className?: string;
}
```

### Usage

```typescript
const DeleteComponent = crud.get_delete_component();

const component = DeleteComponent(
  {
    jssStatePath: 'users.john',
    onSuccess: () => console.log('Deleted'),
    onCancel: () => console.log('Cancelled')
  },
  context
);
```

### HTML Structure

```html
<div class="jss-juris-delete-component">
  <h2>Delete Item</h2>
  <div class="data-display">
    <p>Are you sure you want to delete this item?</p>
    <div id="item-preview" class="item-preview">
      <!-- Object preview -->
    </div>
  </div>
  <div class="form-actions">
    <button type="button" class="btn btn-danger">Delete</button>
    <button type="button" class="btn btn-secondary">Cancel</button>
  </div>
</div>
```

---

## Base Component

`BaseJurisCrudComponent` provides shared functionality for all CRUD components.

### Protected Methods

#### `getJssStatePath(element: HTMLElement): string | null`

Extracts JssStatePath from element attributes.

Checks for:
- `JssStatePath` attribute
- `jss-state-path` attribute
- `data-jss-state-path` attribute

#### `getFromStore(JssStore, path: string): any`

Retrieves object from JssStore at the given path.

#### `putToStore(JssStore, path: string, value: any): void`

Stores object in JssStore at the given path.

#### `deleteFromStore(JssStore, path: string): void`

Deletes object from JssStore at the given path.

#### `loadJssValidator(): Promise<JssValidator | null>`

Loads and initializes Jss validator from SHACL URL.

#### `validateData(data: any): Promise<{ valid: boolean; errors?: string[] }>`

Validates data using Jss validator.

#### `getFormFields(): Promise<FormField[]>`

Extracts form fields from SHACL definition.

#### `createFormField(field: FormField, value: any): any`

Creates Object DOM structure for a form field.

---

## Type Definitions

### JurisContext

```typescript
interface JurisContext {
  getState: (path: string, defaultValue?: any) => any;
  setState: (path: string, value: any) => void;
}
```

### JurisComponent

```typescript
interface JurisComponent {
  (props: JurisComponentProps, context: JurisContext): {
    render: () => any;
    enhance?: (element: HTMLElement) => void;
  };
}
```

### CrudConfig

```typescript
interface CrudConfig {
  shaclUrl: string;
}
```

### FormField

```typescript
interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  defaultValue?: any;
}
```

### JssStoreInterface

```typescript
interface JssStoreInterface {
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
```

### JssValidator

```typescript
interface JssValidator {
  to_jss(data: any): any;
  validate(data: any): boolean;
}
```

---

## Progressive Enhancement

All components support the enhance API for progressive enhancement of existing HTML.

### HTML Attributes

The enhance method looks for the `JssStatePath` attribute on the enhanced element:

```html
<div id="my-form" JssStatePath="users.new"></div>
```

Alternative attribute names:
- `jss-state-path`
- `data-jss-state-path`

### Enhance Workflow

1. Component's `enhance(element)` method is called
2. JssStatePath is extracted from element attributes
3. Object is retrieved from (or created in) JssStore
4. Form fields are dynamically generated based on SHACL definition
5. Event handlers are attached
6. Component becomes fully reactive

### Example

```javascript
const element = document.getElementById('my-form');
const component = CreateComponent({}, context);
component.enhance(element);
```

---

## Error Handling

All components handle errors gracefully:

- Validation errors are displayed in the UI
- Missing JssStore shows error message
- Missing JssStatePath shows error message
- SHACL loading errors are logged and handled

Errors are stored in component state as `_formErrors` array.

---

## State Management

Components use internal state keys prefixed with `_`:

- `_formData`: Current form data
- `_formErrors`: Array of error messages
- `_objectData`: Retrieved object data
- `_jssStatePath`: Resolved JssStatePath
- `_fields`: Loaded form fields
- `_isEditing`: Edit mode flag (Update component)
- `_confirmDelete`: Delete confirmation flag (Delete component)

---

## Styling

Components use semantic CSS classes for easy styling:

- `.jss-juris-create-component`
- `.jss-juris-read-component`
- `.jss-juris-update-component`
- `.jss-juris-delete-component`
- `.crud-form`
- `.form-field`
- `.form-input`
- `.form-actions`
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`
- `.error-messages`, `.error`
- `.data-display`, `.data-field`

See `examples/enhance-example.html` for example styles.
