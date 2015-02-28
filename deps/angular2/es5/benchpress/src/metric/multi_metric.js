System.register(["rtts_assert/rtts_assert", "angular2/di", "angular2/src/facade/collection", "angular2/src/facade/async", "../metric"], function($__export) {
  "use strict";
  var assert,
      bind,
      Injector,
      OpaqueToken,
      List,
      ListWrapper,
      StringMapWrapper,
      StringMap,
      Promise,
      PromiseWrapper,
      Metric,
      MultiMetric,
      _CHILDREN;
  function mergeStringMaps(maps) {
    var result = {};
    ListWrapper.forEach(maps, (function(map) {
      StringMapWrapper.forEach(map, (function(value, prop) {
        result[prop] = value;
      }));
    }));
    return result;
  }
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      bind = $__m.bind;
      Injector = $__m.Injector;
      OpaqueToken = $__m.OpaqueToken;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
      StringMap = $__m.StringMap;
    }, function($__m) {
      Promise = $__m.Promise;
      PromiseWrapper = $__m.PromiseWrapper;
    }, function($__m) {
      Metric = $__m.Metric;
    }],
    execute: function() {
      MultiMetric = $__export("MultiMetric", (function($__super) {
        var MultiMetric = function MultiMetric(metrics) {
          $traceurRuntime.superConstructor(MultiMetric).call(this);
          this._metrics = metrics;
        };
        return ($traceurRuntime.createClass)(MultiMetric, {
          beginMeasure: function() {
            return assert.returnType((PromiseWrapper.all(ListWrapper.map(this._metrics, (function(metric) {
              return metric.beginMeasure();
            })))), Promise);
          },
          endMeasure: function(restart) {
            return assert.returnType((PromiseWrapper.all(ListWrapper.map(this._metrics, (function(metric) {
              return metric.endMeasure(restart);
            }))).then((function(values) {
              return mergeStringMaps(values);
            }))), assert.genericType(Promise, StringMap));
          },
          describe: function() {
            return assert.returnType((mergeStringMaps(this._metrics.map((function(metric) {
              return metric.describe();
            })))), StringMap);
          }
        }, {createBindings: function(childTokens) {
            return [bind(_CHILDREN).toAsyncFactory((function(injector) {
              return PromiseWrapper.all(ListWrapper.map(childTokens, (function(token) {
                return injector.asyncGet(token);
              })));
            }), [Injector]), bind(MultiMetric).toFactory((function(children) {
              return new MultiMetric(children);
            }), [_CHILDREN])];
          }}, $__super);
      }(Metric)));
      Object.defineProperty(MultiMetric.prototype.endMeasure, "parameters", {get: function() {
          return [[assert.type.boolean]];
        }});
      _CHILDREN = new OpaqueToken('MultiMetric.children');
    }
  };
});

//# sourceMappingURL=benchpress/src/metric/multi_metric.map

//# sourceMappingURL=../../../benchpress/src/metric/multi_metric.js.map