import {assert} from "rtts_assert/rtts_assert";
import {Type,
  isPresent,
  stringify,
  BaseException} from 'angular2/src/facade/lang';
import {List,
  ListWrapper,
  Map,
  MapWrapper,
  StringMapWrapper} from 'angular2/src/facade/collection';
import {SetterFn,
  GetterFn,
  MethodFn} from './types';
export {SetterFn, GetterFn, MethodFn} from './types';
export class Reflector {
  constructor(reflectionCapabilities) {
    this._typeInfo = MapWrapper.create();
    this._getters = MapWrapper.create();
    this._setters = MapWrapper.create();
    this._methods = MapWrapper.create();
    this.reflectionCapabilities = reflectionCapabilities;
  }
  registerType(type, typeInfo) {
    MapWrapper.set(this._typeInfo, type, typeInfo);
  }
  registerGetters(getters) {
    _mergeMaps(this._getters, getters);
  }
  registerSetters(setters) {
    _mergeMaps(this._setters, setters);
  }
  registerMethods(methods) {
    _mergeMaps(this._methods, methods);
  }
  factory(type) {
    assert.argumentTypes(type, Type);
    if (MapWrapper.contains(this._typeInfo, type)) {
      return assert.returnType((MapWrapper.get(this._typeInfo, type)["factory"]), Function);
    } else {
      return assert.returnType((this.reflectionCapabilities.factory(type)), Function);
    }
  }
  parameters(typeOfFunc) {
    if (MapWrapper.contains(this._typeInfo, typeOfFunc)) {
      return assert.returnType((MapWrapper.get(this._typeInfo, typeOfFunc)["parameters"]), List);
    } else {
      return assert.returnType((this.reflectionCapabilities.parameters(typeOfFunc)), List);
    }
  }
  annotations(typeOfFunc) {
    if (MapWrapper.contains(this._typeInfo, typeOfFunc)) {
      return assert.returnType((MapWrapper.get(this._typeInfo, typeOfFunc)["annotations"]), List);
    } else {
      return assert.returnType((this.reflectionCapabilities.annotations(typeOfFunc)), List);
    }
  }
  getter(name) {
    assert.argumentTypes(name, assert.type.string);
    if (MapWrapper.contains(this._getters, name)) {
      return assert.returnType((MapWrapper.get(this._getters, name)), GetterFn);
    } else {
      return assert.returnType((this.reflectionCapabilities.getter(name)), GetterFn);
    }
  }
  setter(name) {
    assert.argumentTypes(name, assert.type.string);
    if (MapWrapper.contains(this._setters, name)) {
      return assert.returnType((MapWrapper.get(this._setters, name)), SetterFn);
    } else {
      return assert.returnType((this.reflectionCapabilities.setter(name)), SetterFn);
    }
  }
  method(name) {
    assert.argumentTypes(name, assert.type.string);
    if (MapWrapper.contains(this._methods, name)) {
      return assert.returnType((MapWrapper.get(this._methods, name)), MethodFn);
    } else {
      return assert.returnType((this.reflectionCapabilities.method(name)), MethodFn);
    }
  }
}
Object.defineProperty(Reflector.prototype.factory, "parameters", {get: function() {
    return [[Type]];
  }});
Object.defineProperty(Reflector.prototype.getter, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(Reflector.prototype.setter, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(Reflector.prototype.method, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
function _mergeMaps(target, config) {
  StringMapWrapper.forEach(config, (v, k) => MapWrapper.set(target, k, v));
}
Object.defineProperty(_mergeMaps, "parameters", {get: function() {
    return [[Map], []];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/reflection/reflector.map

//# sourceMappingURL=./reflector.map