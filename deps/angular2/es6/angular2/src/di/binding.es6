import {assert} from "rtts_assert/rtts_assert";
import {FIELD,
  Type,
  isBlank,
  isPresent} from 'angular2/src/facade/lang';
import {List,
  MapWrapper,
  ListWrapper} from 'angular2/src/facade/collection';
import {reflector} from 'angular2/src/reflection/reflection';
import {Key} from './key';
import {Inject,
  InjectLazy,
  InjectPromise,
  DependencyAnnotation} from './annotations';
import {NoAnnotationError} from './exceptions';
export class Dependency {
  constructor(key, asPromise, lazy, properties) {
    assert.argumentTypes(key, Key, asPromise, assert.type.boolean, lazy, assert.type.boolean, properties, List);
    this.key = key;
    this.asPromise = asPromise;
    this.lazy = lazy;
    this.properties = properties;
  }
}
Object.defineProperty(Dependency, "parameters", {get: function() {
    return [[Key], [assert.type.boolean], [assert.type.boolean], [List]];
  }});
export class Binding {
  constructor(key, factory, dependencies, providedAsPromise) {
    assert.argumentTypes(key, Key, factory, Function, dependencies, List, providedAsPromise, assert.type.boolean);
    this.key = key;
    this.factory = factory;
    this.dependencies = dependencies;
    this.providedAsPromise = providedAsPromise;
  }
}
Object.defineProperty(Binding, "parameters", {get: function() {
    return [[Key], [Function], [List], [assert.type.boolean]];
  }});
export function bind(token) {
  return assert.returnType((new BindingBuilder(token)), BindingBuilder);
}
export class BindingBuilder {
  constructor(token) {
    this.token = token;
  }
  toClass(type) {
    assert.argumentTypes(type, Type);
    return assert.returnType((new Binding(Key.get(this.token), reflector.factory(type), _dependenciesFor(type), false)), Binding);
  }
  toValue(value) {
    return assert.returnType((new Binding(Key.get(this.token), () => value, [], false)), Binding);
  }
  toAlias(aliasToken) {
    return assert.returnType((new Binding(Key.get(this.token), (aliasInstance) => aliasInstance, [new Dependency(Key.get(aliasToken), false, false, [])], false)), Binding);
  }
  toFactory(factoryFunction, dependencies = null) {
    assert.argumentTypes(factoryFunction, Function, dependencies, List);
    return assert.returnType((new Binding(Key.get(this.token), factoryFunction, this._constructDependencies(factoryFunction, dependencies), false)), Binding);
  }
  toAsyncFactory(factoryFunction, dependencies = null) {
    assert.argumentTypes(factoryFunction, Function, dependencies, List);
    return assert.returnType((new Binding(Key.get(this.token), factoryFunction, this._constructDependencies(factoryFunction, dependencies), true)), Binding);
  }
  _constructDependencies(factoryFunction, dependencies) {
    return isBlank(dependencies) ? _dependenciesFor(factoryFunction) : ListWrapper.map(dependencies, (t) => new Dependency(Key.get(t), false, false, []));
  }
}
Object.defineProperty(BindingBuilder.prototype.toClass, "parameters", {get: function() {
    return [[Type]];
  }});
Object.defineProperty(BindingBuilder.prototype.toFactory, "parameters", {get: function() {
    return [[Function], [List]];
  }});
Object.defineProperty(BindingBuilder.prototype.toAsyncFactory, "parameters", {get: function() {
    return [[Function], [List]];
  }});
Object.defineProperty(BindingBuilder.prototype._constructDependencies, "parameters", {get: function() {
    return [[Function], [List]];
  }});
function _dependenciesFor(typeOrFunc) {
  var params = reflector.parameters(typeOrFunc);
  if (isBlank(params))
    return assert.returnType(([]), List);
  if (ListWrapper.any(params, (p) => isBlank(p)))
    throw new NoAnnotationError(typeOrFunc);
  return assert.returnType((ListWrapper.map(params, (p) => _extractToken(typeOrFunc, p))), List);
}
function _extractToken(typeOrFunc, annotations) {
  var type;
  var depProps = [];
  for (var i = 0; i < annotations.length; ++i) {
    var paramAnnotation = annotations[i];
    if (paramAnnotation instanceof Type) {
      type = paramAnnotation;
    } else if (paramAnnotation instanceof Inject) {
      return _createDependency(paramAnnotation.token, false, false, []);
    } else if (paramAnnotation instanceof InjectPromise) {
      return _createDependency(paramAnnotation.token, true, false, []);
    } else if (paramAnnotation instanceof InjectLazy) {
      return _createDependency(paramAnnotation.token, false, true, []);
    } else if (paramAnnotation instanceof DependencyAnnotation) {
      ListWrapper.push(depProps, paramAnnotation);
    }
  }
  if (isPresent(type)) {
    return _createDependency(type, false, false, depProps);
  } else {
    throw new NoAnnotationError(typeOrFunc);
  }
}
function _createDependency(token, asPromise, lazy, depProps) {
  return assert.returnType((new Dependency(Key.get(token), asPromise, lazy, depProps)), Dependency);
}

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/di/binding.map

//# sourceMappingURL=./binding.map