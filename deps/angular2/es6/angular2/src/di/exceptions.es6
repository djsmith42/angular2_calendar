import {assert} from "rtts_assert/rtts_assert";
import {ListWrapper,
  List} from 'angular2/src/facade/collection';
import {stringify} from 'angular2/src/facade/lang';
function findFirstClosedCycle(keys) {
  assert.argumentTypes(keys, List);
  var res = [];
  for (var i = 0; i < keys.length; ++i) {
    if (ListWrapper.contains(res, keys[i])) {
      ListWrapper.push(res, keys[i]);
      return res;
    } else {
      ListWrapper.push(res, keys[i]);
    }
  }
  return res;
}
Object.defineProperty(findFirstClosedCycle, "parameters", {get: function() {
    return [[List]];
  }});
function constructResolvingPath(keys) {
  if (keys.length > 1) {
    var reversed = findFirstClosedCycle(ListWrapper.reversed(keys));
    var tokenStrs = ListWrapper.map(reversed, (k) => stringify(k.token));
    return " (" + tokenStrs.join(' -> ') + ")";
  } else {
    return "";
  }
}
Object.defineProperty(constructResolvingPath, "parameters", {get: function() {
    return [[List]];
  }});
export class KeyMetadataError extends Error {}
export class ProviderError extends Error {
  constructor(key, constructResolvingMessage) {
    assert.argumentTypes(key, assert.type.any, constructResolvingMessage, Function);
    super();
    this.keys = [key];
    this.constructResolvingMessage = constructResolvingMessage;
    this.message = this.constructResolvingMessage(this.keys);
  }
  addKey(key) {
    ListWrapper.push(this.keys, key);
    this.message = this.constructResolvingMessage(this.keys);
  }
  toString() {
    return this.message;
  }
}
Object.defineProperty(ProviderError, "parameters", {get: function() {
    return [[], [Function]];
  }});
export class NoProviderError extends ProviderError {
  constructor(key) {
    super(key, function(keys) {
      assert.argumentTypes(keys, List);
      var first = stringify(ListWrapper.first(keys).token);
      return `No provider for ${first}!${constructResolvingPath(keys)}`;
    });
  }
}
export class AsyncBindingError extends ProviderError {
  constructor(key) {
    super(key, function(keys) {
      assert.argumentTypes(keys, List);
      var first = stringify(ListWrapper.first(keys).token);
      return `Cannot instantiate ${first} synchronously. ` + `It is provided as a promise!${constructResolvingPath(keys)}`;
    });
  }
}
export class CyclicDependencyError extends ProviderError {
  constructor(key) {
    super(key, function(keys) {
      assert.argumentTypes(keys, List);
      return `Cannot instantiate cyclic dependency!${constructResolvingPath(keys)}`;
    });
  }
}
export class InstantiationError extends ProviderError {
  constructor(originalException, key) {
    super(key, function(keys) {
      assert.argumentTypes(keys, List);
      var first = stringify(ListWrapper.first(keys).token);
      return `Error during instantiation of ${first}!${constructResolvingPath(keys)}.` + ` ORIGINAL ERROR: ${originalException}`;
    });
  }
}
export class InvalidBindingError extends Error {
  constructor(binding) {
    super();
    this.message = `Invalid binding ${binding}`;
  }
  toString() {
    return this.message;
  }
}
export class NoAnnotationError extends Error {
  constructor(typeOrFunc) {
    super();
    this.message = `Cannot resolve all parameters for ${stringify(typeOrFunc)}`;
  }
  toString() {
    return this.message;
  }
}

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/di/exceptions.map

//# sourceMappingURL=./exceptions.map