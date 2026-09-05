import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import { registerBlockDefinitions } from '../index';
import {
  validateInterfaceMembers,
  validateEnumMembers,
  validateMethodBody,
  validateSuperConstructorCall,
} from './index';

function getBlockWarningText(block: Blockly.Block): string | null {
  const b = block as unknown as Record<string, unknown>;

  if (typeof b.getWarningText === 'function') {
    const res = (b.getWarningText as () => string | null)();
    if (res) return String(res);
  }
  if (b.warning && typeof (b.warning as Record<string, unknown>).getText === 'function') {
    const res = ((b.warning as Record<string, unknown>).getText as () => string | null)();
    if (res) return String(res);
  }
  if (typeof b.warning === 'string') return b.warning;
  if (typeof b.warningText_ === 'string') return b.warningText_;
  if (typeof b.warningText === 'string') return b.warningText;
  return null;
}

describe('Phase 4.2 - Section 8.2: OOP Block Construction Comprehensive Test Suite', () => {
  let workspace: Blockly.Workspace;

  beforeEach(() => {
    registerBlockDefinitions();
    workspace = new Blockly.Workspace();
  });

  afterEach(() => {
    if (workspace) {
      workspace.dispose();
    }
  });

  // ===========================================================================
  // 1. Multi-Level Class Inheritance, Fields, Constructor & Methods
  // ===========================================================================
  describe('1. Class Declaration with Multi-Level Inheritance, Fields, Constructor & Methods', () => {
    it('should construct a multi-level inheritance hierarchy (BaseEntity -> Character -> Hero)', () => {
      // 1. Base Class: BaseEntity (Abstract)
      const baseClass = workspace.newBlock('class_declaration');
      (baseClass.getField('CLASS_NAME') as Blockly.FieldTextInput).setValue('BaseEntity');
      (baseClass.getField('ACCESS') as Blockly.FieldDropdown).setValue('PUBLIC');
      (baseClass.getField('MODIFIER') as Blockly.FieldDropdown).setValue('ABSTRACT');

      // Base field: id: String
      const baseField = workspace.newBlock('class_property_declaration');
      (baseField.getField('PROP_NAME') as Blockly.FieldTextInput).setValue('id');
      (baseField.getField('ACCESS_MODE') as Blockly.FieldDropdown).setValue('DEFAULT_NULL');
      const strType = workspace.newBlock('type_primitive');
      (strType.getField('TYPE') as Blockly.FieldDropdown).setValue('STRING');
      baseField.getInput('TYPE_ANNOTATION')?.connection?.connect(strType.outputConnection!);
      baseClass.getInput('FIELDS')?.connection?.connect(baseField.previousConnection!);

      // 2. Middle Class: Character extends BaseEntity
      const charClass = workspace.newBlock('class_declaration');
      (charClass.getField('CLASS_NAME') as Blockly.FieldTextInput).setValue('Character');
      (charClass.getField('EXTENDS_CLASS') as Blockly.FieldTextInput).setValue('BaseEntity');

      // Character Constructor with super(id)
      const charCtor = workspace.newBlock('class_constructor_declaration');
      const superCall1 = workspace.newBlock('super_constructor_call');
      charCtor.getInput('BODY')?.connection?.connect(superCall1.previousConnection!);
      charClass.getInput('CONSTRUCTOR')?.connection?.connect(charCtor.previousConnection!);

      // 3. Derived Class: Hero extends Character implements IControllable, IDamageable
      const heroClass = workspace.newBlock('class_declaration');
      (heroClass.getField('CLASS_NAME') as Blockly.FieldTextInput).setValue('Hero');
      (heroClass.getField('EXTENDS_CLASS') as Blockly.FieldTextInput).setValue('Character');
      (heroClass.getField('IMPLEMENTS_INTERFACES') as Blockly.FieldTextInput).setValue(
        'IControllable, IDamageable',
      );

      // Hero field: level: Int = 1
      const heroField = workspace.newBlock('class_property_declaration');
      (heroField.getField('PROP_NAME') as Blockly.FieldTextInput).setValue('level');
      const intType = workspace.newBlock('type_primitive');
      (intType.getField('TYPE') as Blockly.FieldDropdown).setValue('INT');
      const valOne = workspace.newBlock('math_number');
      (valOne.getField('NUM') as Blockly.FieldNumber).setValue(1);
      heroField.getInput('TYPE_ANNOTATION')?.connection?.connect(intType.outputConnection!);
      heroField.getInput('INITIAL_VALUE')?.connection?.connect(valOne.outputConnection!);
      heroClass.getInput('FIELDS')?.connection?.connect(heroField.previousConnection!);

      // Hero Constructor with super()
      const heroCtor = workspace.newBlock('class_constructor_declaration');
      const superCall2 = workspace.newBlock('super_constructor_call');
      heroCtor.getInput('BODY')?.connection?.connect(superCall2.previousConnection!);
      heroClass.getInput('CONSTRUCTOR')?.connection?.connect(heroCtor.previousConnection!);

      // Hero Method: public override function update(delta: Float): Void
      const heroMethod = workspace.newBlock('class_method_declaration');
      (heroMethod.getField('ACCESS') as Blockly.FieldDropdown).setValue('PUBLIC');
      (heroMethod.getField('MODIFIER') as Blockly.FieldDropdown).setValue('OVERRIDE');
      (heroMethod.getField('METHOD_NAME') as Blockly.FieldTextInput).setValue('update');

      const deltaParam = workspace.newBlock('method_param_item');
      (deltaParam.getField('PARAM_NAME') as Blockly.FieldTextInput).setValue('delta');
      const floatType = workspace.newBlock('type_primitive');
      (floatType.getField('TYPE') as Blockly.FieldDropdown).setValue('FLOAT');
      deltaParam.getInput('PARAM_TYPE')?.connection?.connect(floatType.outputConnection!);
      heroMethod.getInput('PARAMS')?.connection?.connect(deltaParam.previousConnection!);

      const voidType = workspace.newBlock('type_primitive');
      (voidType.getField('TYPE') as Blockly.FieldDropdown).setValue('VOID');
      heroMethod.getInput('RETURN_TYPE')?.connection?.connect(voidType.outputConnection!);

      heroClass.getInput('METHODS')?.connection?.connect(heroMethod.previousConnection!);

      // Assert complete tree structure and fields
      expect(baseClass.getField('CLASS_NAME')?.getText()).toBe('BaseEntity');
      expect(charClass.getField('EXTENDS_CLASS')?.getText()).toBe('BaseEntity');
      expect(heroClass.getField('EXTENDS_CLASS')?.getText()).toBe('Character');
      expect(heroClass.getField('IMPLEMENTS_INTERFACES')?.getText()).toBe(
        'IControllable, IDamageable',
      );

      expect(heroClass.getChildren(false).length).toBe(3); // FIELDS, CONSTRUCTOR, METHODS
      expect(heroMethod.getChildren(false).length).toBe(2); // PARAMS, RETURN_TYPE
    });

    it('should validate and sanitize class identifier, superclass, and interface fields', () => {
      const classBlock = workspace.newBlock('class_declaration');
      const nameField = classBlock.getField('CLASS_NAME') as Blockly.FieldTextInput;
      const extendsField = classBlock.getField('EXTENDS_CLASS') as Blockly.FieldTextInput;
      const implementsField = classBlock.getField('IMPLEMENTS_INTERFACES') as Blockly.FieldTextInput;

      // Valid class name
      nameField.setValue('GameManager');
      expect(nameField.getValue()).toBe('GameManager');
      expect(getBlockWarningText(classBlock)).toBeNull();

      // Sanitized superclass and interfaces
      extendsField.setValue('  com..game...BaseEntity  ');
      implementsField.setValue(' IObserver,   , IEventListener  ');

      expect(extendsField.getValue()).toBe('com.game.BaseEntity');
      expect(implementsField.getValue()).toBe('IObserver, IEventListener');
    });
  });

  // ===========================================================================
  // 2. Interface Declarations & Signature Constraints
  // ===========================================================================
  describe('2. Interface Declaration & Method Signature Constraints', () => {
    it('should construct interface with multiple super-interfaces, method signatures, and property contracts', () => {
      const interfaceBlock = workspace.newBlock('interface_declaration');
      (interfaceBlock.getField('ACCESS') as Blockly.FieldDropdown).setValue('PUBLIC');
      (interfaceBlock.getField('INTERFACE_NAME') as Blockly.FieldTextInput).setValue('ICombatEntity');
      (interfaceBlock.getField('EXTENDS_INTERFACES') as Blockly.FieldTextInput).setValue(
        'IDamageable, IAttacker',
      );

      // Method Signature 1: takeDamage(amount: Float): Bool;
      const methodSig = workspace.newBlock('interface_method_signature');
      (methodSig.getField('METHOD_NAME') as Blockly.FieldTextInput).setValue('takeDamage');
      const paramAmount = workspace.newBlock('function_param_item');
      (paramAmount.getField('PARAM_NAME') as Blockly.FieldTextInput).setValue('amount');
      methodSig.getInput('PARAMS')?.connection?.connect(paramAmount.previousConnection!);
      const boolType = workspace.newBlock('type_primitive');
      (boolType.getField('TYPE') as Blockly.FieldDropdown).setValue('BOOL');
      methodSig.getInput('RETURN_TYPE')?.connection?.connect(boolType.outputConnection!);

      // Property Signature 2: var isAlive(default, null): Bool;
      const propSig = workspace.newBlock('interface_property_signature');
      (propSig.getField('PROPERTY_NAME') as Blockly.FieldTextInput).setValue('isAlive');
      (propSig.getField('READ_ACCESS') as Blockly.FieldDropdown).setValue('DEFAULT');
      (propSig.getField('WRITE_ACCESS') as Blockly.FieldDropdown).setValue('NULL');
      const boolType2 = workspace.newBlock('type_primitive');
      (boolType2.getField('TYPE') as Blockly.FieldDropdown).setValue('BOOL');
      propSig.getInput('PROPERTY_TYPE')?.connection?.connect(boolType2.outputConnection!);

      // Chain signatures inside interface MEMBERS slot
      interfaceBlock.getInput('MEMBERS')?.connection?.connect(methodSig.previousConnection!);
      methodSig.nextConnection?.connect(propSig.previousConnection!);

      const result = validateInterfaceMembers(interfaceBlock);
      expect(result.valid).toBe(true);
      expect(result.invalidBlockTypes).toEqual([]);
      expect(getBlockWarningText(interfaceBlock)).toBeNull();
    });

    it('should reject concrete function bodies or statements inside interface declaration', () => {
      const interfaceBlock = workspace.newBlock('interface_declaration');
      const concreteMethod = workspace.newBlock('function_def_typed');
      const returnStmt = workspace.newBlock('return_bare');

      concreteMethod.getInput('BODY')?.connection?.connect(returnStmt.previousConnection!);
      interfaceBlock.getInput('MEMBERS')?.connection?.connect(concreteMethod.previousConnection!);

      const result = validateInterfaceMembers(interfaceBlock);
      expect(result.valid).toBe(false);
      expect(result.invalidBlockTypes).toContain('function_def_typed');

      expect(getBlockWarningText(interfaceBlock)).toContain('Interface contains invalid concrete members');
      expect(getBlockWarningText(concreteMethod)).toContain('not allowed in an interface');
    });
  });

  // ===========================================================================
  // 3. Enum Declarations (Scalar & Parameterized ADTs)
  // ===========================================================================
  describe('3. Enum Declarations (Scalar & Parameterized Algebraic Data Types)', () => {
    it('should construct Enum with scalar variants and parameterized ADT constructors', () => {
      const enumBlock = workspace.newBlock('enum_declaration');
      (enumBlock.getField('ENUM_NAME') as Blockly.FieldTextInput).setValue('PlayerAction');

      // Scalar variant: IDLE;
      const idleVariant = workspace.newBlock('enum_constructor_item');
      (idleVariant.getField('VARIANT_NAME') as Blockly.FieldTextInput).setValue('IDLE');

      // ADT variant: MOVE(x: Float, y: Float);
      const moveVariant = workspace.newBlock('enum_constructor_parameterized');
      (moveVariant.getField('VARIANT_NAME') as Blockly.FieldTextInput).setValue('MOVE');
      const paramX = workspace.newBlock('function_param_item');
      (paramX.getField('PARAM_NAME') as Blockly.FieldTextInput).setValue('x');
      const paramY = workspace.newBlock('function_param_item');
      (paramY.getField('PARAM_NAME') as Blockly.FieldTextInput).setValue('y');
      paramX.nextConnection?.connect(paramY.previousConnection!);
      moveVariant.getInput('PARAMS')?.connection?.connect(paramX.previousConnection!);

      // Connect variants inside enum
      enumBlock.getInput('VARIANTS')?.connection?.connect(idleVariant.previousConnection!);
      idleVariant.nextConnection?.connect(moveVariant.previousConnection!);

      const validation = validateEnumMembers(enumBlock);
      expect(validation.valid).toBe(true);
      expect(getBlockWarningText(enumBlock)).toBeNull();
    });

    it('should construct enum_value_reference expression and enum_pattern_match block', () => {
      // 1. Enum value reference: PlayerAction.MOVE(10, 20)
      const refBlock = workspace.newBlock('enum_value_reference');
      (refBlock.getField('ENUM_NAME') as Blockly.FieldTextInput).setValue('PlayerAction');
      (refBlock.getField('VARIANT_NAME') as Blockly.FieldTextInput).setValue('MOVE');

      const arg0 = workspace.newBlock('math_number');
      (arg0.getField('NUM') as Blockly.FieldNumber).setValue(10);
      const arg1 = workspace.newBlock('math_number');
      (arg1.getField('NUM') as Blockly.FieldNumber).setValue(20);

      refBlock.getInput('ARG0')?.connection?.connect(arg0.outputConnection!);
      refBlock.getInput('ARG1')?.connection?.connect(arg1.outputConnection!);

      expect(refBlock.outputConnection).not.toBeNull();
      expect(refBlock.getChildren(false).length).toBe(2);

      // 2. Pattern Match Switch Block: match action case MOVE(x, y) => do something
      const matchBlock = workspace.newBlock('enum_pattern_match');
      matchBlock.getInput('TARGET')?.connection?.connect(refBlock.outputConnection!);
      (matchBlock.getField('MATCH_CASE') as Blockly.FieldTextInput).setValue('MOVE');
      (matchBlock.getField('BINDINGS') as Blockly.FieldTextInput).setValue('x, y');

      const doStmt = workspace.newBlock('return_bare');
      matchBlock.getInput('DO')?.connection?.connect(doStmt.previousConnection!);

      expect(matchBlock.previousConnection).not.toBeNull();
      expect(matchBlock.nextConnection).not.toBeNull();
      expect(matchBlock.getChildren(false).length).toBe(2);
    });

    it('should reject non-variant blocks inside Enum container', () => {
      const enumBlock = workspace.newBlock('enum_declaration');
      const invalidVar = workspace.newBlock('variable_declare_typed');

      enumBlock.getInput('VARIANTS')?.connection?.connect(invalidVar.previousConnection!);

      const result = validateEnumMembers(enumBlock);
      expect(result.valid).toBe(false);
      expect(result.invalidBlockTypes).toContain('variable_declare_typed');
      expect(getBlockWarningText(enumBlock)).toContain('Enum contains invalid member blocks');
    });
  });

  // ===========================================================================
  // 4. Property Getters, Setters & Access Modifiers
  // ===========================================================================
  describe('4. Scoped Property Getters, Setters & Access Modifiers', () => {
    it('should configure class_property_declaration with all 8 accessor mode combinations', () => {
      const propBlock = workspace.newBlock('class_property_declaration');
      const modeField = propBlock.getField('ACCESS_MODE') as Blockly.FieldDropdown;
      const specField = propBlock.getField('SPECIFIER') as Blockly.FieldDropdown;

      const modes = [
        'DEFAULT_DEFAULT',
        'DEFAULT_NULL',
        'GET_SET',
        'NEVER_NEVER',
        'GET_NULL',
        'GET_NEVER',
        'DEFAULT_NEVER',
        'NULL_DEFAULT',
      ];

      modes.forEach((mode) => {
        modeField.setValue(mode);
        expect(modeField.getValue()).toBe(mode);
      });

      const specifiers = ['NONE', 'STATIC', 'INLINE', 'FINAL', 'STATIC_INLINE'];
      specifiers.forEach((spec) => {
        specField.setValue(spec);
        expect(specField.getValue()).toBe(spec);
      });
    });

    it('should construct dedicated property_getter_def and property_setter_def methods', () => {
      // Getter: get_score(): Int { return this._score; }
      const getter = workspace.newBlock('property_getter_def');
      (getter.getField('PROP_NAME') as Blockly.FieldTextInput).setValue('score');
      const retType = workspace.newBlock('type_primitive');
      (retType.getField('TYPE') as Blockly.FieldDropdown).setValue('INT');
      getter.getInput('RETURN_TYPE')?.connection?.connect(retType.outputConnection!);

      const getBody = workspace.newBlock('return_bare');
      getter.getInput('BODY')?.connection?.connect(getBody.previousConnection!);

      // Setter: set_score(val: Int): Int { this._score = val; return val; }
      const setter = workspace.newBlock('property_setter_def');
      (setter.getField('PROP_NAME') as Blockly.FieldTextInput).setValue('score');
      (setter.getField('PARAM_NAME') as Blockly.FieldTextInput).setValue('val');
      const paramType = workspace.newBlock('type_primitive');
      (paramType.getField('TYPE') as Blockly.FieldDropdown).setValue('INT');
      setter.getInput('PARAM_TYPE')?.connection?.connect(paramType.outputConnection!);

      const setBody = workspace.newBlock('return_bare');
      setter.getInput('BODY')?.connection?.connect(setBody.previousConnection!);

      expect(getter.getChildren(false).length).toBe(2);
      expect(setter.getChildren(false).length).toBe(2);
    });

    it('should enforce abstract method constraint prohibiting implementation bodies', () => {
      const method = workspace.newBlock('class_method_declaration');
      (method.getField('MODIFIER') as Blockly.FieldDropdown).setValue('ABSTRACT');

      // Abstract without body is valid
      const validResult = validateMethodBody(method);
      expect(validResult.valid).toBe(true);
      expect(getBlockWarningText(method)).toBeNull();

      // Attaching body to abstract method fails validation
      const bodyStmt = workspace.newBlock('return_bare');
      method.getInput('BODY')?.connection?.connect(bodyStmt.previousConnection!);

      const invalidResult = validateMethodBody(method);
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.error).toContain('Abstract methods cannot have an implementation body');
      expect(getBlockWarningText(method)).toContain('Abstract methods cannot have an implementation body');
    });
  });

  // ===========================================================================
  // 5. super() Constructor Validation & Instantiations
  // ===========================================================================
  describe('5. super() Constructor Validation in Derived Classes & Instantiation', () => {
    it('should validate that base classes without superclass pass super() validation', () => {
      const baseClass = workspace.newBlock('class_declaration');
      (baseClass.getField('CLASS_NAME') as Blockly.FieldTextInput).setValue('RootEntity');
      (baseClass.getField('EXTENDS_CLASS') as Blockly.FieldTextInput).setValue('');

      const ctor = workspace.newBlock('class_constructor_declaration');
      baseClass.getInput('CONSTRUCTOR')?.connection?.connect(ctor.previousConnection!);

      const result = validateSuperConstructorCall(baseClass);
      expect(result.valid).toBe(true);
      expect(result.hasSuperclass).toBe(false);
      expect(result.hasSuperCall).toBe(false);
      expect(getBlockWarningText(ctor)).toBeNull();
    });

    it('should pass validation when derived class constructor explicitly invokes super(...)', () => {
      const derivedClass = workspace.newBlock('class_declaration');
      (derivedClass.getField('CLASS_NAME') as Blockly.FieldTextInput).setValue('Warrior');
      (derivedClass.getField('EXTENDS_CLASS') as Blockly.FieldTextInput).setValue('Character');

      const ctor = workspace.newBlock('class_constructor_declaration');
      const superCall = workspace.newBlock('super_constructor_call');
      ctor.getInput('BODY')?.connection?.connect(superCall.previousConnection!);
      derivedClass.getInput('CONSTRUCTOR')?.connection?.connect(ctor.previousConnection!);

      const result = validateSuperConstructorCall(derivedClass);
      expect(result.valid).toBe(true);
      expect(result.hasSuperclass).toBe(true);
      expect(result.hasSuperCall).toBe(true);
      expect(getBlockWarningText(ctor)).toBeNull();
    });

    it('should detect violation and flag warning when derived class constructor is missing super(...) call', () => {
      const derivedClass = workspace.newBlock('class_declaration');
      (derivedClass.getField('CLASS_NAME') as Blockly.FieldTextInput).setValue('Mage');
      (derivedClass.getField('EXTENDS_CLASS') as Blockly.FieldTextInput).setValue('Character');

      const ctor = workspace.newBlock('class_constructor_declaration');
      // Constructor body does not contain super()
      const regularStmt = workspace.newBlock('return_bare');
      ctor.getInput('BODY')?.connection?.connect(regularStmt.previousConnection!);
      derivedClass.getInput('CONSTRUCTOR')?.connection?.connect(ctor.previousConnection!);

      const result = validateSuperConstructorCall(derivedClass);
      expect(result.valid).toBe(false);
      expect(result.hasSuperclass).toBe(true);
      expect(result.hasSuperCall).toBe(false);
      expect(result.warning).toContain("missing an explicit 'super(...)' call");
      expect(getBlockWarningText(ctor)).toContain("missing an explicit 'super(...)' call");

      // Adding superCall restores valid state
      const superCall = workspace.newBlock('super_constructor_call');
      ctor.getInput('BODY')?.connection?.connect(superCall.previousConnection!);
      superCall.nextConnection?.connect(regularStmt.previousConnection!);

      const fixedResult = validateSuperConstructorCall(derivedClass);
      expect(fixedResult.valid).toBe(true);
      expect(fixedResult.hasSuperCall).toBe(true);
      expect(getBlockWarningText(ctor)).toBeNull();
    });

    it('should instantiate instance_instantiation expression (new ClassName(args))', () => {
      const newBlock = workspace.newBlock('instance_instantiation');
      (newBlock.getField('CLASS_NAME') as Blockly.FieldTextInput).setValue('Warrior');

      const argHp = workspace.newBlock('math_number');
      (argHp.getField('NUM') as Blockly.FieldNumber).setValue(150);

      const argName = workspace.newBlock('text_literal');
      (argName.getField('TEXT') as Blockly.FieldTextInput).setValue('Sir Lancelot');

      newBlock.getInput('ARG0')?.connection?.connect(argHp.outputConnection!);
      newBlock.getInput('ARG1')?.connection?.connect(argName.outputConnection!);

      expect(newBlock.outputConnection).not.toBeNull();
      expect(newBlock.getChildren(false).length).toBe(2);
      expect(newBlock.getField('CLASS_NAME')?.getText()).toBe('Warrior');
    });
  });
});
