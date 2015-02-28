import {assert} from "rtts_assert/rtts_assert";
import {MapWrapper} from 'angular2/src/facade/collection';
import {BaseException} from 'angular2/src/facade/lang';
export class ContextWithVariableBindings {
  constructor(parent, varBindings) {
    assert.argumentTypes(parent, assert.type.any, varBindings, Map);
    this.parent = parent;
    this.varBindings = varBindings;
  }
  hasBinding(name) {
    assert.argumentTypes(name, assert.type.string);
    return assert.returnType((MapWrapper.contains(this.varBindings, name)), assert.type.boolean);
  }
  get(name) {
    assert.argumentTypes(name, assert.type.string);
    return MapWrapper.get(this.varBindings, name);
  }
  set(name, value) {
    assert.argumentTypes(name, assert.type.string, value, assert.type.any);
    if (this.hasBinding(name)) {
      MapWrapper.set(this.varBindings, name, value);
    } else {
      throw new BaseException('VariableBindings do not support setting of new keys post-construction.');
    }
  }
  clearValues() {
    for (var k of MapWrapper.keys(this.varBindings)) {
      MapWrapper.set(this.varBindings, k, null);
    }
  }
}
Object.defineProperty(ContextWithVariableBindings, "parameters", {get: function() {
    return [[assert.type.any], [Map]];
  }});
Object.defineProperty(ContextWithVariableBindings.prototype.hasBinding, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(ContextWithVariableBindings.prototype.get, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(ContextWithVariableBindings.prototype.set, "parameters", {get: function() {
    return [[assert.type.string], []];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/change_detection/parser/context_with_variable_bindings.map

//# sourceMappingURL=./context_with_variable_bindings.map