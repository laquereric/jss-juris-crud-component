/**
 * Tests for JssJurisCrudComponent
 */

import { JssJurisCrudComponent } from '../src/JssJurisCrudComponent';

describe('JssJurisCrudComponent', () => {
  const shaclUrl = './test-shape.ttl';

  describe('crud()', () => {
    it('should return an object with CRUD component methods', () => {
      const crud = JssJurisCrudComponent.crud(shaclUrl);

      expect(crud).toHaveProperty('get_create_component');
      expect(crud).toHaveProperty('get_read_component');
      expect(crud).toHaveProperty('get_update_component');
      expect(crud).toHaveProperty('get_delete_component');
    });

    it('should return functions for each CRUD method', () => {
      const crud = JssJurisCrudComponent.crud(shaclUrl);

      expect(typeof crud.get_create_component).toBe('function');
      expect(typeof crud.get_read_component).toBe('function');
      expect(typeof crud.get_update_component).toBe('function');
      expect(typeof crud.get_delete_component).toBe('function');
    });
  });

  describe('get_create_component()', () => {
    it('should return a Juris component function', () => {
      const crud = JssJurisCrudComponent.crud(shaclUrl);
      const CreateComponent = crud.get_create_component();

      expect(typeof CreateComponent).toBe('function');
    });

    it('should return a component with render method', () => {
      const crud = JssJurisCrudComponent.crud(shaclUrl);
      const CreateComponent = crud.get_create_component();

      const mockContext = {
        getState: jest.fn((path, defaultValue) => defaultValue),
        setState: jest.fn()
      };

      const component = CreateComponent({}, mockContext);

      expect(component).toHaveProperty('render');
      expect(typeof component.render).toBe('function');
    });

    it('should return a component with enhance method', () => {
      const crud = JssJurisCrudComponent.crud(shaclUrl);
      const CreateComponent = crud.get_create_component();

      const mockContext = {
        getState: jest.fn((path, defaultValue) => defaultValue),
        setState: jest.fn()
      };

      const component = CreateComponent({}, mockContext);

      expect(component).toHaveProperty('enhance');
      expect(typeof component.enhance).toBe('function');
    });
  });

  describe('get_read_component()', () => {
    it('should return a Juris component function', () => {
      const crud = JssJurisCrudComponent.crud(shaclUrl);
      const ReadComponent = crud.get_read_component();

      expect(typeof ReadComponent).toBe('function');
    });

    it('should return a component with render and enhance methods', () => {
      const crud = JssJurisCrudComponent.crud(shaclUrl);
      const ReadComponent = crud.get_read_component();

      const mockContext = {
        getState: jest.fn((path, defaultValue) => defaultValue),
        setState: jest.fn()
      };

      const component = ReadComponent({}, mockContext);

      expect(component).toHaveProperty('render');
      expect(component).toHaveProperty('enhance');
    });
  });

  describe('get_update_component()', () => {
    it('should return a Juris component function', () => {
      const crud = JssJurisCrudComponent.crud(shaclUrl);
      const UpdateComponent = crud.get_update_component();

      expect(typeof UpdateComponent).toBe('function');
    });

    it('should return a component with render and enhance methods', () => {
      const crud = JssJurisCrudComponent.crud(shaclUrl);
      const UpdateComponent = crud.get_update_component();

      const mockContext = {
        getState: jest.fn((path, defaultValue) => defaultValue),
        setState: jest.fn()
      };

      const component = UpdateComponent({}, mockContext);

      expect(component).toHaveProperty('render');
      expect(component).toHaveProperty('enhance');
    });
  });

  describe('get_delete_component()', () => {
    it('should return a Juris component function', () => {
      const crud = JssJurisCrudComponent.crud(shaclUrl);
      const DeleteComponent = crud.get_delete_component();

      expect(typeof DeleteComponent).toBe('function');
    });

    it('should return a component with render and enhance methods', () => {
      const crud = JssJurisCrudComponent.crud(shaclUrl);
      const DeleteComponent = crud.get_delete_component();

      const mockContext = {
        getState: jest.fn((path, defaultValue) => defaultValue),
        setState: jest.fn()
      };

      const component = DeleteComponent({}, mockContext);

      expect(component).toHaveProperty('render');
      expect(component).toHaveProperty('enhance');
    });
  });
});
