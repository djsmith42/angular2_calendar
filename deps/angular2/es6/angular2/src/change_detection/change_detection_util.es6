import {assert} from "rtts_assert/rtts_assert";
import {isPresent,
  isBlank,
  BaseException,
  Type} from 'angular2/src/facade/lang';
import {List,
  ListWrapper,
  MapWrapper,
  StringMapWrapper} from 'angular2/src/facade/collection';
import {ContextWithVariableBindings} from './parser/context_with_variable_bindings';
import {ProtoRecord} from './proto_record';
import {ExpressionChangedAfterItHasBeenChecked} from './exceptions';
import {NO_CHANGE} from './pipes/pipe';
import {ChangeRecord,
  ChangeDetector,
  CHECK_ALWAYS,
  CHECK_ONCE,
  CHECKED,
  DETACHED} from './interfaces';
export var uninitialized = new Object();
export class SimpleChange {
  constructor(previousValue, currentValue) {
    assert.argumentTypes(previousValue, assert.type.any, currentValue, assert.type.any);
    this.previousValue = previousValue;
    this.currentValue = currentValue;
  }
}
Object.defineProperty(SimpleChange, "parameters", {get: function() {
    return [[assert.type.any], [assert.type.any]];
  }});
var _simpleChangesIndex = 0;
var _simpleChanges = [new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null)];
var _changeRecordsIndex = 0;
var _changeRecords = [new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null), new ChangeRecord(null, null)];
function _simpleChange(previousValue, currentValue) {
  var index = _simpleChangesIndex++ % 20;
  var s = _simpleChanges[index];
  s.previousValue = previousValue;
  s.currentValue = currentValue;
  return s;
}
function _changeRecord(bindingMemento, change) {
  var index = _changeRecordsIndex++ % 20;
  var s = _changeRecords[index];
  s.bindingMemento = bindingMemento;
  s.change = change;
  return s;
}
var _singleElementList = [null];
export class ChangeDetectionUtil {
  static unitialized() {
    return uninitialized;
  }
  static arrayFn0() {
    return [];
  }
  static arrayFn1(a1) {
    return [a1];
  }
  static arrayFn2(a1, a2) {
    return [a1, a2];
  }
  static arrayFn3(a1, a2, a3) {
    return [a1, a2, a3];
  }
  static arrayFn4(a1, a2, a3, a4) {
    return [a1, a2, a3, a4];
  }
  static arrayFn5(a1, a2, a3, a4, a5) {
    return [a1, a2, a3, a4, a5];
  }
  static arrayFn6(a1, a2, a3, a4, a5, a6) {
    return [a1, a2, a3, a4, a5, a6];
  }
  static arrayFn7(a1, a2, a3, a4, a5, a6, a7) {
    return [a1, a2, a3, a4, a5, a6, a7];
  }
  static arrayFn8(a1, a2, a3, a4, a5, a6, a7, a8) {
    return [a1, a2, a3, a4, a5, a6, a7, a8];
  }
  static arrayFn9(a1, a2, a3, a4, a5, a6, a7, a8, a9) {
    return [a1, a2, a3, a4, a5, a6, a7, a8, a9];
  }
  static operation_negate(value) {
    return !value;
  }
  static operation_add(left, right) {
    return left + right;
  }
  static operation_subtract(left, right) {
    return left - right;
  }
  static operation_multiply(left, right) {
    return left * right;
  }
  static operation_divide(left, right) {
    return left / right;
  }
  static operation_remainder(left, right) {
    return left % right;
  }
  static operation_equals(left, right) {
    return left == right;
  }
  static operation_not_equals(left, right) {
    return left != right;
  }
  static operation_less_then(left, right) {
    return left < right;
  }
  static operation_greater_then(left, right) {
    return left > right;
  }
  static operation_less_or_equals_then(left, right) {
    return left <= right;
  }
  static operation_greater_or_equals_then(left, right) {
    return left >= right;
  }
  static operation_logical_and(left, right) {
    return left && right;
  }
  static operation_logical_or(left, right) {
    return left || right;
  }
  static cond(cond, trueVal, falseVal) {
    return cond ? trueVal : falseVal;
  }
  static mapFn(keys) {
    function buildMap(values) {
      var res = StringMapWrapper.create();
      for (var i = 0; i < keys.length; ++i) {
        StringMapWrapper.set(res, keys[i], values[i]);
      }
      return res;
    }
    switch (keys.length) {
      case 0:
        return () => [];
      case 1:
        return (a1) => buildMap([a1]);
      case 2:
        return (a1, a2) => buildMap([a1, a2]);
      case 3:
        return (a1, a2, a3) => buildMap([a1, a2, a3]);
      case 4:
        return (a1, a2, a3, a4) => buildMap([a1, a2, a3, a4]);
      case 5:
        return (a1, a2, a3, a4, a5) => buildMap([a1, a2, a3, a4, a5]);
      case 6:
        return (a1, a2, a3, a4, a5, a6) => buildMap([a1, a2, a3, a4, a5, a6]);
      case 7:
        return (a1, a2, a3, a4, a5, a6, a7) => buildMap([a1, a2, a3, a4, a5, a6, a7]);
      case 8:
        return (a1, a2, a3, a4, a5, a6, a7, a8) => buildMap([a1, a2, a3, a4, a5, a6, a7, a8]);
      case 9:
        return (a1, a2, a3, a4, a5, a6, a7, a8, a9) => buildMap([a1, a2, a3, a4, a5, a6, a7, a8, a9]);
      default:
        throw new BaseException(`Does not support literal maps with more than 9 elements`);
    }
  }
  static keyedAccess(obj, args) {
    return obj[args[0]];
  }
  static findContext(name, c) {
    assert.argumentTypes(name, assert.type.string, c, assert.type.any);
    while (c instanceof ContextWithVariableBindings) {
      if (c.hasBinding(name)) {
        return c;
      }
      c = c.parent;
    }
    return c;
  }
  static noChangeMarker(value) {
    return assert.returnType((value === NO_CHANGE), assert.type.boolean);
  }
  static throwOnChange(proto, change) {
    assert.argumentTypes(proto, ProtoRecord, change, assert.type.any);
    throw new ExpressionChangedAfterItHasBeenChecked(proto, change);
  }
  static simpleChange(previousValue, currentValue) {
    assert.argumentTypes(previousValue, assert.type.any, currentValue, assert.type.any);
    return assert.returnType((_simpleChange(previousValue, currentValue)), SimpleChange);
  }
  static changeRecord(memento, change) {
    assert.argumentTypes(memento, assert.type.any, change, assert.type.any);
    return assert.returnType((_changeRecord(memento, change)), ChangeRecord);
  }
  static simpleChangeRecord(memento, previousValue, currentValue) {
    assert.argumentTypes(memento, assert.type.any, previousValue, assert.type.any, currentValue, assert.type.any);
    return assert.returnType((_changeRecord(memento, _simpleChange(previousValue, currentValue))), ChangeRecord);
  }
  static addRecord(updatedRecords, changeRecord) {
    assert.argumentTypes(updatedRecords, List, changeRecord, ChangeRecord);
    if (isBlank(updatedRecords)) {
      updatedRecords = _singleElementList;
      updatedRecords[0] = changeRecord;
    } else if (updatedRecords === _singleElementList) {
      updatedRecords = [_singleElementList[0], changeRecord];
    } else {
      ListWrapper.push(updatedRecords, changeRecord);
    }
    return assert.returnType((updatedRecords), List);
  }
}
Object.defineProperty(ChangeDetectionUtil.mapFn, "parameters", {get: function() {
    return [[List]];
  }});
Object.defineProperty(ChangeDetectionUtil.findContext, "parameters", {get: function() {
    return [[assert.type.string], []];
  }});
Object.defineProperty(ChangeDetectionUtil.throwOnChange, "parameters", {get: function() {
    return [[ProtoRecord], []];
  }});
Object.defineProperty(ChangeDetectionUtil.simpleChange, "parameters", {get: function() {
    return [[assert.type.any], [assert.type.any]];
  }});
Object.defineProperty(ChangeDetectionUtil.changeRecord, "parameters", {get: function() {
    return [[assert.type.any], [assert.type.any]];
  }});
Object.defineProperty(ChangeDetectionUtil.simpleChangeRecord, "parameters", {get: function() {
    return [[assert.type.any], [assert.type.any], [assert.type.any]];
  }});
Object.defineProperty(ChangeDetectionUtil.addRecord, "parameters", {get: function() {
    return [[List], [ChangeRecord]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/change_detection/change_detection_util.map

//# sourceMappingURL=./change_detection_util.map