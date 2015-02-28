import {assert} from "rtts_assert/rtts_assert";
import {ProtoRecord} from './proto_record';
export class ExpressionChangedAfterItHasBeenChecked extends Error {
  constructor(proto, change) {
    assert.argumentTypes(proto, ProtoRecord, change, assert.type.any);
    super();
    this.message = `Expression '${proto.expressionAsString}' has changed after it was checked. ` + `Previous value: '${change.previousValue}'. Current value: '${change.currentValue}'`;
  }
  toString() {
    return assert.returnType((this.message), assert.type.string);
  }
}
Object.defineProperty(ExpressionChangedAfterItHasBeenChecked, "parameters", {get: function() {
    return [[ProtoRecord], [assert.type.any]];
  }});
export class ChangeDetectionError extends Error {
  constructor(proto, originalException) {
    assert.argumentTypes(proto, ProtoRecord, originalException, assert.type.any);
    super();
    this.originalException = originalException;
    this.location = proto.expressionAsString;
    this.message = `${this.originalException} in [${this.location}]`;
  }
  toString() {
    return assert.returnType((this.message), assert.type.string);
  }
}
Object.defineProperty(ChangeDetectionError, "parameters", {get: function() {
    return [[ProtoRecord], [assert.type.any]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/change_detection/exceptions.map

//# sourceMappingURL=./exceptions.map