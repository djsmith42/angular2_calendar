import {assert} from "rtts_assert/rtts_assert";
import {int,
  global} from 'angular2/src/facade/lang';
import {List} from 'angular2/src/facade/collection';
export var Promise = global.Promise;
export class PromiseWrapper {
  static resolve(obj) {
    return assert.returnType((Promise.resolve(obj)), Promise);
  }
  static reject(obj) {
    return assert.returnType((Promise.reject(obj)), Promise);
  }
  static all(promises) {
    assert.argumentTypes(promises, List);
    if (promises.length == 0)
      return assert.returnType((Promise.resolve([])), Promise);
    return assert.returnType((Promise.all(promises)), Promise);
  }
  static then(promise, success, rejection) {
    assert.argumentTypes(promise, Promise, success, Function, rejection, Function);
    return assert.returnType((promise.then(success, rejection)), Promise);
  }
  static completer() {
    var resolve;
    var reject;
    var p = new Promise(function(res, rej) {
      resolve = res;
      reject = rej;
    });
    return {
      promise: p,
      complete: resolve,
      reject: reject
    };
  }
  static setTimeout(fn, millis) {
    assert.argumentTypes(fn, Function, millis, int);
    global.setTimeout(fn, millis);
  }
  static isPromise(maybePromise) {
    return assert.returnType((maybePromise instanceof Promise), assert.type.boolean);
  }
}
Object.defineProperty(PromiseWrapper.all, "parameters", {get: function() {
    return [[List]];
  }});
Object.defineProperty(PromiseWrapper.then, "parameters", {get: function() {
    return [[Promise], [Function], [Function]];
  }});
Object.defineProperty(PromiseWrapper.setTimeout, "parameters", {get: function() {
    return [[Function], [int]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/facade/async.map

//# sourceMappingURL=./async.map