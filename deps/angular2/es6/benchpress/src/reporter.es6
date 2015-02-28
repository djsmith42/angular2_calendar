import {assert} from "rtts_assert/rtts_assert";
import {bind} from 'angular2/di';
import {Promise,
  PromiseWrapper} from 'angular2/src/facade/async';
import {ABSTRACT,
  BaseException} from 'angular2/src/facade/lang';
import {MeasureValues} from './measure_values';
export class Reporter {
  static bindTo(delegateToken) {
    return [bind(Reporter).toFactory((delegate) => delegate, [delegateToken])];
  }
  reportMeasureValues(values) {
    assert.argumentTypes(values, MeasureValues);
    throw new BaseException('NYI');
  }
  reportSample(completeSample, validSample) {
    assert.argumentTypes(completeSample, assert.genericType(List, MeasureValues), validSample, assert.genericType(List, MeasureValues));
    throw new BaseException('NYI');
  }
}
Object.defineProperty(Reporter, "annotations", {get: function() {
    return [new ABSTRACT()];
  }});
Object.defineProperty(Reporter.prototype.reportMeasureValues, "parameters", {get: function() {
    return [[MeasureValues]];
  }});
Object.defineProperty(Reporter.prototype.reportSample, "parameters", {get: function() {
    return [[assert.genericType(List, MeasureValues)], [assert.genericType(List, MeasureValues)]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/benchpress/src/reporter.map

//# sourceMappingURL=./reporter.map