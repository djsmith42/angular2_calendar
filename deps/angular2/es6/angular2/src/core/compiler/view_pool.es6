import {assert} from "rtts_assert/rtts_assert";
import {ListWrapper,
  MapWrapper,
  StringMapWrapper,
  List} from 'angular2/src/facade/collection';
import * as viewModule from './view';
export class ViewPool {
  constructor(capacity) {
    assert.argumentTypes(capacity, assert.type.number);
    this._views = [];
    this._capacity = capacity;
  }
  pop() {
    return assert.returnType((ListWrapper.isEmpty(this._views) ? null : ListWrapper.removeLast(this._views)), viewModule.View);
  }
  push(view) {
    assert.argumentTypes(view, viewModule.View);
    if (this._views.length < this._capacity) {
      ListWrapper.push(this._views, view);
    }
  }
  length() {
    return this._views.length;
  }
}
Object.defineProperty(ViewPool, "parameters", {get: function() {
    return [[assert.type.number]];
  }});
Object.defineProperty(ViewPool.prototype.push, "parameters", {get: function() {
    return [[viewModule.View]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/compiler/view_pool.map

//# sourceMappingURL=./view_pool.map