import {assert} from "rtts_assert/rtts_assert";
import {List,
  ListWrapper,
  StringMap} from 'angular2/src/facade/collection';
import {bind,
  OpaqueToken} from 'angular2/di';
import {Validator} from '../validator';
import {Statistic} from '../statistic';
import {MeasureValues} from '../measure_values';
export class RegressionSlopeValidator extends Validator {
  static get SAMPLE_SIZE() {
    return _SAMPLE_SIZE;
  }
  static get METRIC() {
    return _METRIC;
  }
  static get BINDINGS() {
    return _BINDINGS;
  }
  constructor(sampleSize, metric) {
    super();
    this._sampleSize = sampleSize;
    this._metric = metric;
  }
  describe() {
    return assert.returnType(({
      'sampleSize': this._sampleSize,
      'regressionSlopeMetric': this._metric
    }), StringMap);
  }
  validate(completeSample) {
    assert.argumentTypes(completeSample, assert.genericType(List, MeasureValues));
    if (completeSample.length >= this._sampleSize) {
      var latestSample = ListWrapper.slice(completeSample, completeSample.length - this._sampleSize, completeSample.length);
      var xValues = [];
      var yValues = [];
      for (var i = 0; i < latestSample.length; i++) {
        ListWrapper.push(xValues, i);
        ListWrapper.push(yValues, latestSample[i].values[this._metric]);
      }
      var regressionSlope = Statistic.calculateRegressionSlope(xValues, Statistic.calculateMean(xValues), yValues, Statistic.calculateMean(yValues));
      return assert.returnType((regressionSlope >= 0 ? latestSample : null), assert.genericType(List, MeasureValues));
    } else {
      return assert.returnType((null), assert.genericType(List, MeasureValues));
    }
  }
}
Object.defineProperty(RegressionSlopeValidator.prototype.validate, "parameters", {get: function() {
    return [[assert.genericType(List, MeasureValues)]];
  }});
var _SAMPLE_SIZE = new OpaqueToken('RegressionSlopeValidator.sampleSize');
var _METRIC = new OpaqueToken('RegressionSlopeValidator.metric');
var _BINDINGS = [bind(RegressionSlopeValidator).toFactory((sampleSize, metric) => new RegressionSlopeValidator(sampleSize, metric), [_SAMPLE_SIZE, _METRIC]), bind(_SAMPLE_SIZE).toValue(10), bind(_METRIC).toValue('script')];

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/benchpress/src/validator/regression_slope_validator.map

//# sourceMappingURL=./regression_slope_validator.map