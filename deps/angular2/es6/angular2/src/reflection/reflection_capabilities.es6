import {assert} from "rtts_assert/rtts_assert";
import {Type,
  isPresent} from 'angular2/src/facade/lang';
import {List,
  ListWrapper} from 'angular2/src/facade/collection';
import {GetterFn,
  SetterFn,
  MethodFn} from './types';
export class ReflectionCapabilities {
  factory(type) {
    assert.argumentTypes(type, Type);
    switch (type.length) {
      case 0:
        return assert.returnType((function() {
          return new type();
        }), Function);
      case 1:
        return assert.returnType((function(a1) {
          return new type(a1);
        }), Function);
      case 2:
        return assert.returnType((function(a1, a2) {
          return new type(a1, a2);
        }), Function);
      case 3:
        return assert.returnType((function(a1, a2, a3) {
          return new type(a1, a2, a3);
        }), Function);
      case 4:
        return assert.returnType((function(a1, a2, a3, a4) {
          return new type(a1, a2, a3, a4);
        }), Function);
      case 5:
        return assert.returnType((function(a1, a2, a3, a4, a5) {
          return new type(a1, a2, a3, a4, a5);
        }), Function);
      case 6:
        return assert.returnType((function(a1, a2, a3, a4, a5, a6) {
          return new type(a1, a2, a3, a4, a5, a6);
        }), Function);
      case 7:
        return assert.returnType((function(a1, a2, a3, a4, a5, a6, a7) {
          return new type(a1, a2, a3, a4, a5, a6, a7);
        }), Function);
      case 8:
        return assert.returnType((function(a1, a2, a3, a4, a5, a6, a7, a8) {
          return new type(a1, a2, a3, a4, a5, a6, a7, a8);
        }), Function);
      case 9:
        return assert.returnType((function(a1, a2, a3, a4, a5, a6, a7, a8, a9) {
          return new type(a1, a2, a3, a4, a5, a6, a7, a8, a9);
        }), Function);
      case 10:
        return assert.returnType((function(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
          return new type(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
        }), Function);
    }
    ;
    throw new Error("Factory cannot take more than 10 arguments");
  }
  parameters(typeOfFunc) {
    return assert.returnType((isPresent(typeOfFunc.parameters) ? typeOfFunc.parameters : ListWrapper.createFixedSize(typeOfFunc.length)), assert.genericType(List, List));
  }
  annotations(typeOfFunc) {
    return assert.returnType((isPresent(typeOfFunc.annotations) ? typeOfFunc.annotations : []), List);
  }
  getter(name) {
    assert.argumentTypes(name, assert.type.string);
    return assert.returnType((new Function('o', 'return o.' + name + ';')), GetterFn);
  }
  setter(name) {
    assert.argumentTypes(name, assert.type.string);
    return assert.returnType((new Function('o', 'v', 'return o.' + name + ' = v;')), SetterFn);
  }
  method(name) {
    assert.argumentTypes(name, assert.type.string);
    var method = `o.${name}`;
    return assert.returnType((new Function('o', 'args', `if (!${method}) throw new Error('"${name}" is undefined');` + `return ${method}.apply(o, args);`)), MethodFn);
  }
}
Object.defineProperty(ReflectionCapabilities.prototype.factory, "parameters", {get: function() {
    return [[Type]];
  }});
Object.defineProperty(ReflectionCapabilities.prototype.getter, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(ReflectionCapabilities.prototype.setter, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(ReflectionCapabilities.prototype.method, "parameters", {get: function() {
    return [[assert.type.string]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/reflection/reflection_capabilities.map

//# sourceMappingURL=./reflection_capabilities.map