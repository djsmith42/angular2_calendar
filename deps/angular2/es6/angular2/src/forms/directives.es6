import {assert} from "rtts_assert/rtts_assert";
import {Template,
  Component,
  Decorator,
  NgElement,
  Ancestor,
  onChange} from 'angular2/core';
import {DOM} from 'angular2/src/facade/dom';
import {isBlank,
  isPresent,
  CONST} from 'angular2/src/facade/lang';
import {StringMapWrapper,
  ListWrapper} from 'angular2/src/facade/collection';
import {ControlGroup,
  Control} from './model';
class ControlGroupDirectiveBase {
  addDirective(directive) {}
  findControl(name) {
    assert.argumentTypes(name, assert.type.string);
    return assert.returnType((null), Control);
  }
}
Object.defineProperty(ControlGroupDirectiveBase.prototype.findControl, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export class ControlValueAccessor {
  readValue(el) {}
  writeValue(el, value) {}
}
Object.defineProperty(ControlValueAccessor, "annotations", {get: function() {
    return [new CONST()];
  }});
class DefaultControlValueAccessor extends ControlValueAccessor {
  constructor() {
    super();
  }
  readValue(el) {
    return DOM.getValue(el);
  }
  writeValue(el, value) {
    DOM.setValue(el, value);
  }
}
Object.defineProperty(DefaultControlValueAccessor, "annotations", {get: function() {
    return [new CONST()];
  }});
class CheckboxControlValueAccessor extends ControlValueAccessor {
  constructor() {
    super();
  }
  readValue(el) {
    return assert.returnType((DOM.getChecked(el)), assert.type.boolean);
  }
  writeValue(el, value) {
    assert.argumentTypes(el, assert.type.any, value, assert.type.boolean);
    DOM.setChecked(el, value);
  }
}
Object.defineProperty(CheckboxControlValueAccessor, "annotations", {get: function() {
    return [new CONST()];
  }});
Object.defineProperty(CheckboxControlValueAccessor.prototype.writeValue, "parameters", {get: function() {
    return [[], [assert.type.boolean]];
  }});
var controlValueAccessors = {
  "checkbox": new CheckboxControlValueAccessor(),
  "text": new DefaultControlValueAccessor()
};
function controlValueAccessorFor(controlType) {
  assert.argumentTypes(controlType, assert.type.string);
  var accessor = StringMapWrapper.get(controlValueAccessors, controlType);
  if (isPresent(accessor)) {
    return assert.returnType((accessor), ControlValueAccessor);
  } else {
    return assert.returnType((StringMapWrapper.get(controlValueAccessors, "text")), ControlValueAccessor);
  }
}
Object.defineProperty(controlValueAccessorFor, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export class ControlDirectiveBase {
  constructor(groupDecorator, el) {
    assert.argumentTypes(groupDecorator, assert.type.any, el, NgElement);
    this._groupDecorator = groupDecorator;
    this._el = el;
  }
  _initialize() {
    if (isBlank(this.valueAccessor)) {
      this.valueAccessor = controlValueAccessorFor(this.type);
    }
    this._groupDecorator.addDirective(this);
    this._updateDomValue();
    DOM.on(this._el.domElement, "change", (_) => this._updateControlValue());
  }
  _updateDomValue() {
    this.valueAccessor.writeValue(this._el.domElement, this._control().value);
  }
  _updateControlValue() {
    this._control().value = this.valueAccessor.readValue(this._el.domElement);
  }
  _control() {
    return this._groupDecorator.findControl(this.controlName);
  }
}
Object.defineProperty(ControlDirectiveBase, "parameters", {get: function() {
    return [[], [NgElement]];
  }});
export class ControlNameDirective extends ControlDirectiveBase {
  constructor(groupDecorator, el) {
    assert.argumentTypes(groupDecorator, ControlGroupDirective, el, NgElement);
    super(groupDecorator, el);
  }
  onChange(_) {
    this._initialize();
  }
}
Object.defineProperty(ControlNameDirective, "annotations", {get: function() {
    return [new Decorator({
      lifecycle: [onChange],
      selector: '[control-name]',
      bind: {
        'controlName': 'control-name',
        'type': 'type'
      }
    })];
  }});
Object.defineProperty(ControlNameDirective, "parameters", {get: function() {
    return [[ControlGroupDirective, new Ancestor()], [NgElement]];
  }});
export class ControlDirective extends ControlDirectiveBase {
  constructor(groupDecorator, el) {
    assert.argumentTypes(groupDecorator, NewControlGroupDirective, el, NgElement);
    super(groupDecorator, el);
  }
  onChange(_) {
    this._initialize();
  }
}
Object.defineProperty(ControlDirective, "annotations", {get: function() {
    return [new Decorator({
      lifecycle: [onChange],
      selector: '[control]',
      bind: {
        'controlName': 'control',
        'type': 'type'
      }
    })];
  }});
Object.defineProperty(ControlDirective, "parameters", {get: function() {
    return [[NewControlGroupDirective, new Ancestor()], [NgElement]];
  }});
export class ControlGroupDirective extends ControlGroupDirectiveBase {
  constructor() {
    super();
    this._directives = ListWrapper.create();
  }
  set controlGroup(controlGroup) {
    this._controlGroup = controlGroup;
    ListWrapper.forEach(this._directives, (cd) => cd._updateDomValue());
  }
  addDirective(c) {
    assert.argumentTypes(c, ControlNameDirective);
    ListWrapper.push(this._directives, c);
  }
  findControl(name) {
    assert.argumentTypes(name, assert.type.string);
    return assert.returnType((this._controlGroup.controls[name]), Control);
  }
}
Object.defineProperty(ControlGroupDirective, "annotations", {get: function() {
    return [new Decorator({
      selector: '[control-group]',
      bind: {'controlGroup': 'control-group'}
    })];
  }});
Object.defineProperty(Object.getOwnPropertyDescriptor(ControlGroupDirective.prototype, "controlGroup").set, "parameters", {get: function() {
    return [[ControlGroup]];
  }});
Object.defineProperty(ControlGroupDirective.prototype.addDirective, "parameters", {get: function() {
    return [[ControlNameDirective]];
  }});
Object.defineProperty(ControlGroupDirective.prototype.findControl, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export class NewControlGroupDirective extends ControlGroupDirectiveBase {
  constructor() {
    super();
    this._directives = ListWrapper.create();
  }
  set initData(value) {
    this._initData = value;
  }
  addDirective(c) {
    assert.argumentTypes(c, ControlDirective);
    ListWrapper.push(this._directives, c);
    this._controlGroup = null;
  }
  findControl(name) {
    assert.argumentTypes(name, assert.type.string);
    if (isBlank(this._controlGroup)) {
      this._controlGroup = this._createControlGroup();
    }
    return assert.returnType((this._controlGroup.controls[name]), Control);
  }
  _createControlGroup() {
    var controls = ListWrapper.reduce(this._directives, (memo, cd) => {
      var initControlValue = this._initData[cd.controlName];
      memo[cd.controlName] = new Control(initControlValue);
      return memo;
    }, {});
    return assert.returnType((new ControlGroup(controls)), ControlGroup);
  }
  get value() {
    return this._controlGroup.value;
  }
}
Object.defineProperty(NewControlGroupDirective, "annotations", {get: function() {
    return [new Component({
      selector: '[new-control-group]',
      bind: {'initData': 'new-control-group'}
    }), new Template({inline: '<content>'})];
  }});
Object.defineProperty(NewControlGroupDirective.prototype.addDirective, "parameters", {get: function() {
    return [[ControlDirective]];
  }});
Object.defineProperty(NewControlGroupDirective.prototype.findControl, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export var FormDirectives = [ControlGroupDirective, ControlNameDirective, ControlDirective, NewControlGroupDirective];

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/forms/directives.map

//# sourceMappingURL=./directives.map