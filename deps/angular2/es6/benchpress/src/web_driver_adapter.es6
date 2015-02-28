import {assert} from "rtts_assert/rtts_assert";
import {bind} from 'angular2/di';
import {Promise} from 'angular2/src/facade/async';
import {BaseException,
  ABSTRACT} from 'angular2/src/facade/lang';
import {List,
  Map} from 'angular2/src/facade/collection';
export class WebDriverAdapter {
  static bindTo(delegateToken) {
    return [bind(WebDriverAdapter).toFactory((delegate) => delegate, [delegateToken])];
  }
  waitFor(callback) {
    assert.argumentTypes(callback, Function);
    throw new BaseException('NYI');
  }
  executeScript(script) {
    assert.argumentTypes(script, assert.type.string);
    throw new BaseException('NYI');
  }
  capabilities() {
    throw new BaseException('NYI');
  }
  logs(type) {
    assert.argumentTypes(type, assert.type.string);
    throw new BaseException('NYI');
  }
}
Object.defineProperty(WebDriverAdapter, "annotations", {get: function() {
    return [new ABSTRACT()];
  }});
Object.defineProperty(WebDriverAdapter.prototype.waitFor, "parameters", {get: function() {
    return [[Function]];
  }});
Object.defineProperty(WebDriverAdapter.prototype.executeScript, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(WebDriverAdapter.prototype.logs, "parameters", {get: function() {
    return [[assert.type.string]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/benchpress/src/web_driver_adapter.map

//# sourceMappingURL=./web_driver_adapter.map