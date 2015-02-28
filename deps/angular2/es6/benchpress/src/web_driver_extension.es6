import {assert} from "rtts_assert/rtts_assert";
import {bind,
  Injector,
  OpaqueToken} from 'angular2/di';
import {BaseException,
  ABSTRACT,
  isBlank} from 'angular2/src/facade/lang';
import {Promise,
  PromiseWrapper} from 'angular2/src/facade/async';
import {List,
  ListWrapper,
  StringMap} from 'angular2/src/facade/collection';
import {Options} from './sample_options';
export class WebDriverExtension {
  static bindTo(childTokens) {
    return [bind(_CHILDREN).toAsyncFactory((injector) => PromiseWrapper.all(ListWrapper.map(childTokens, (token) => injector.asyncGet(token))), [Injector]), bind(WebDriverExtension).toFactory((children, capabilities) => {
      var delegate;
      ListWrapper.forEach(children, (extension) => {
        if (extension.supports(capabilities)) {
          delegate = extension;
        }
      });
      if (isBlank(delegate)) {
        throw new BaseException('Could not find a delegate for given capabilities!');
      }
      return delegate;
    }, [_CHILDREN, Options.CAPABILITIES])];
  }
  gc() {
    throw new BaseException('NYI');
  }
  timeBegin(name) {
    throw new BaseException('NYI');
  }
  timeEnd(name, restart) {
    assert.argumentTypes(name, assert.type.any, restart, assert.type.boolean);
    throw new BaseException('NYI');
  }
  readPerfLog() {
    throw new BaseException('NYI');
  }
  supports(capabilities) {
    assert.argumentTypes(capabilities, StringMap);
    return assert.returnType((true), assert.type.boolean);
  }
}
Object.defineProperty(WebDriverExtension, "annotations", {get: function() {
    return [new ABSTRACT()];
  }});
Object.defineProperty(WebDriverExtension.prototype.timeEnd, "parameters", {get: function() {
    return [[], [assert.type.boolean]];
  }});
Object.defineProperty(WebDriverExtension.prototype.supports, "parameters", {get: function() {
    return [[StringMap]];
  }});
var _CHILDREN = new OpaqueToken('WebDriverExtension.children');

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/benchpress/src/web_driver_extension.map

//# sourceMappingURL=./web_driver_extension.map