import {assert} from "rtts_assert/rtts_assert";
import {List,
  ListWrapper,
  StringMap} from 'angular2/src/facade/collection';
import {bind,
  OpaqueToken} from 'angular2/di';
import {Validator} from '../validator';
import {MeasureValues} from '../measure_values';
export class SizeValidator extends Validator {
  static get BINDINGS() {
    return _BINDINGS;
  }
  static get SAMPLE_SIZE() {
    return _SAMPLE_SIZE;
  }
  constructor(size) {
    super();
    this._sampleSize = size;
  }
  describe() {
    return assert.returnType(({'sampleSize': this._sampleSize}), StringMap);
  }
  validate(completeSample) {
    assert.argumentTypes(completeSample, assert.genericType(List, MeasureValues));
    if (completeSample.length >= this._sampleSize) {
      return assert.returnType((ListWrapper.slice(completeSample, completeSample.length - this._sampleSize, completeSample.length)), assert.genericType(List, MeasureValues));
    } else {
      return assert.returnType((null), assert.genericType(List, MeasureValues));
    }
  }
}
Object.defineProperty(SizeValidator.prototype.validate, "parameters", {get: function() {
    return [[assert.genericType(List, MeasureValues)]];
  }});
var _SAMPLE_SIZE = new OpaqueToken('SizeValidator.sampleSize');
var _BINDINGS = [bind(SizeValidator).toFactory((size) => new SizeValidator(size), [_SAMPLE_SIZE]), bind(_SAMPLE_SIZE).toValue(10)];

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/benchpress/src/validator/size_validator.map

//# sourceMappingURL=./size_validator.map