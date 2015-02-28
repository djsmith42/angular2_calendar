import {assert} from "rtts_assert/rtts_assert";
import {List} from 'angular2/src/facade/collection';
export class ChangeRecord {
  constructor(bindingMemento, change) {
    this.bindingMemento = bindingMemento;
    this.change = change;
  }
  get currentValue() {
    return this.change.currentValue;
  }
  get previousValue() {
    return this.change.previousValue;
  }
}
export const CHECK_ONCE = "CHECK_ONCE";
export const CHECKED = "CHECKED";
export const CHECK_ALWAYS = "ALWAYS_CHECK";
export const DETACHED = "DETACHED";
export class ChangeDispatcher {
  onRecordChange(directiveMemento, records) {
    assert.argumentTypes(directiveMemento, assert.type.any, records, assert.genericType(List, ChangeRecord));
  }
}
Object.defineProperty(ChangeDispatcher.prototype.onRecordChange, "parameters", {get: function() {
    return [[], [assert.genericType(List, ChangeRecord)]];
  }});
export class ChangeDetector {
  addChild(cd) {
    assert.argumentTypes(cd, ChangeDetector);
  }
  removeChild(cd) {
    assert.argumentTypes(cd, ChangeDetector);
  }
  remove() {}
  setContext(context) {
    assert.argumentTypes(context, assert.type.any);
  }
  markPathToRootAsCheckOnce() {}
  detectChanges() {}
  checkNoChanges() {}
}
Object.defineProperty(ChangeDetector.prototype.addChild, "parameters", {get: function() {
    return [[ChangeDetector]];
  }});
Object.defineProperty(ChangeDetector.prototype.removeChild, "parameters", {get: function() {
    return [[ChangeDetector]];
  }});
Object.defineProperty(ChangeDetector.prototype.setContext, "parameters", {get: function() {
    return [[assert.type.any]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/change_detection/interfaces.map

//# sourceMappingURL=./interfaces.map