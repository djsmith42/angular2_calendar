import {assert} from "rtts_assert/rtts_assert";
import {isPresent,
  isBlank,
  Date,
  DateWrapper} from 'angular2/src/facade/lang';
import {Promise,
  PromiseWrapper} from 'angular2/src/facade/async';
import {StringMapWrapper,
  StringMap,
  List,
  ListWrapper} from 'angular2/src/facade/collection';
import {bind,
  OpaqueToken} from 'angular2/di';
import {Metric} from './metric';
import {Validator} from './validator';
import {Reporter} from './reporter';
import {WebDriverExtension} from './web_driver_extension';
import {WebDriverAdapter} from './web_driver_adapter';
import {Options} from './sample_options';
import {MeasureValues} from './measure_values';
export class Sampler {
  static get BINDINGS() {
    return _BINDINGS;
  }
  static get TIME() {
    return _TIME;
  }
  constructor({driver,
    driverExtension,
    metric,
    reporter,
    validator,
    forceGc,
    prepare,
    execute,
    time} = {}) {
    this._driver = driver;
    this._driverExtension = driverExtension;
    this._metric = metric;
    this._reporter = reporter;
    this._validator = validator;
    this._forceGc = forceGc;
    this._prepare = prepare;
    this._execute = execute;
    this._time = time;
  }
  sample() {
    var loop;
    loop = (lastState) => {
      return this._iterate(lastState).then((newState) => {
        if (isPresent(newState.validSample)) {
          return newState;
        } else {
          return loop(newState);
        }
      });
    };
    return assert.returnType((this._gcIfNeeded().then((_) => loop(new SampleState([], null)))), assert.genericType(Promise, SampleState));
  }
  _gcIfNeeded() {
    if (this._forceGc) {
      return this._driverExtension.gc();
    } else {
      return PromiseWrapper.resolve(null);
    }
  }
  _iterate(lastState) {
    var resultPromise;
    if (isPresent(this._prepare)) {
      resultPromise = this._driver.waitFor(this._prepare).then((_) => this._gcIfNeeded());
    } else {
      resultPromise = PromiseWrapper.resolve(null);
    }
    if (isPresent(this._prepare) || lastState.completeSample.length === 0) {
      resultPromise = resultPromise.then((_) => this._metric.beginMeasure());
    }
    return resultPromise.then((_) => this._driver.waitFor(this._execute)).then((_) => this._gcIfNeeded()).then((_) => this._metric.endMeasure(isBlank(this._prepare))).then((measureValues) => this._report(lastState, measureValues));
  }
  _report(state, metricValues) {
    var measureValues = new MeasureValues(state.completeSample.length, this._time(), metricValues);
    var completeSample = ListWrapper.concat(state.completeSample, [measureValues]);
    var validSample = this._validator.validate(completeSample);
    var resultPromise = this._reporter.reportMeasureValues(measureValues);
    if (isPresent(validSample)) {
      resultPromise = resultPromise.then((_) => this._reporter.reportSample(completeSample, validSample));
    }
    return assert.returnType((resultPromise.then((_) => new SampleState(completeSample, validSample))), assert.genericType(Promise, SampleState));
  }
}
Object.defineProperty(Sampler.prototype._report, "parameters", {get: function() {
    return [[SampleState], [StringMap]];
  }});
export class SampleState {
  constructor(completeSample, validSample) {
    assert.argumentTypes(completeSample, List, validSample, List);
    this.completeSample = completeSample;
    this.validSample = validSample;
  }
}
Object.defineProperty(SampleState, "parameters", {get: function() {
    return [[List], [List]];
  }});
var _TIME = new OpaqueToken('Sampler.time');
var _BINDINGS = [bind(Sampler).toFactory((driver, driverExtension, metric, reporter, validator, forceGc, prepare, execute, time) => new Sampler({
  driver: driver,
  driverExtension: driverExtension,
  reporter: reporter,
  validator: validator,
  metric: metric,
  forceGc: forceGc,
  prepare: prepare !== false ? prepare : null,
  execute: execute,
  time: time
}), [WebDriverAdapter, WebDriverExtension, Metric, Reporter, Validator, Options.FORCE_GC, Options.PREPARE, Options.EXECUTE, _TIME]), bind(Options.FORCE_GC).toValue(false), bind(Options.PREPARE).toValue(false), bind(_TIME).toValue(() => DateWrapper.now())];

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/benchpress/src/sampler.map

//# sourceMappingURL=./sampler.map