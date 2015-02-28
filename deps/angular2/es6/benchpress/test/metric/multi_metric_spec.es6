import {assert} from "rtts_assert/rtts_assert";
import {ddescribe,
  describe,
  it,
  iit,
  xit,
  expect,
  beforeEach,
  afterEach} from 'angular2/test_lib';
import {List,
  ListWrapper,
  StringMap} from 'angular2/src/facade/collection';
import {PromiseWrapper,
  Promise} from 'angular2/src/facade/async';
import {Metric,
  MultiMetric,
  bind,
  Injector} from 'benchpress/benchpress';
export function main() {
  function createMetric(ids) {
    return new Injector([ListWrapper.map(ids, (id) => bind(id).toValue(new MockMetric(id))), MultiMetric.createBindings(ids)]).asyncGet(MultiMetric);
  }
  describe('multi metric', () => {
    it('should merge descriptions', (done) => {
      createMetric(['m1', 'm2']).then((m) => {
        expect(m.describe()).toEqual({
          'm1': 'describe',
          'm2': 'describe'
        });
        done();
      });
    });
    it('should merge all beginMeasure calls', (done) => {
      createMetric(['m1', 'm2']).then((m) => m.beginMeasure()).then((values) => {
        expect(values).toEqual(['m1_beginMeasure', 'm2_beginMeasure']);
        done();
      });
    });
    [false, true].forEach((restartFlag) => {
      it(`should merge all endMeasure calls for restart=${restartFlag}`, (done) => {
        createMetric(['m1', 'm2']).then((m) => m.endMeasure(restartFlag)).then((values) => {
          expect(values).toEqual({
            'm1': {'restart': restartFlag},
            'm2': {'restart': restartFlag}
          });
          done();
        });
      });
    });
  });
}
class MockMetric extends Metric {
  constructor(id) {
    super();
    this._id = id;
  }
  beginMeasure() {
    return assert.returnType((PromiseWrapper.resolve(`${this._id}_beginMeasure`)), Promise);
  }
  endMeasure(restart) {
    assert.argumentTypes(restart, assert.type.boolean);
    var result = {};
    result[this._id] = {'restart': restart};
    return assert.returnType((PromiseWrapper.resolve(result)), assert.genericType(Promise, StringMap));
  }
  describe() {
    var result = {};
    result[this._id] = 'describe';
    return assert.returnType((result), StringMap);
  }
}
Object.defineProperty(MockMetric.prototype.endMeasure, "parameters", {get: function() {
    return [[assert.type.boolean]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/benchpress/test/metric/multi_metric_spec.map

//# sourceMappingURL=./multi_metric_spec.map