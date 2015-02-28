System.register(["rtts_assert/rtts_assert", "angular2/di", "angular2/src/facade/collection", "angular2/src/facade/async", "../measure_values", "../reporter"], function($__export) {
  "use strict";
  var assert,
      bind,
      Injector,
      OpaqueToken,
      List,
      ListWrapper,
      Promise,
      PromiseWrapper,
      MeasureValues,
      Reporter,
      MultiReporter,
      _CHILDREN;
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
    }, function($__m) {
      Promise = $__m.Promise;
      PromiseWrapper = $__m.PromiseWrapper;
    }, function($__m) {
      MeasureValues = $__m.MeasureValues;
    }, function($__m) {
      Reporter = $__m.Reporter;
    }],
    execute: function() {
      MultiReporter = $__export("MultiReporter", (function($__super) {
        var MultiReporter = function MultiReporter(reporters) {
          $traceurRuntime.superConstructor(MultiReporter).call(this);
          this._reporters = reporters;
        };
        return ($traceurRuntime.createClass)(MultiReporter, {
          reportMeasureValues: function(values) {
            return assert.returnType((PromiseWrapper.all(ListWrapper.map(this._reporters, (function(reporter) {
              return reporter.reportMeasureValues(values);
            })))), Promise);
          },
          reportSample: function(completeSample, validSample) {
            return assert.returnType((PromiseWrapper.all(ListWrapper.map(this._reporters, (function(reporter) {
              return reporter.reportSample(completeSample, validSample);
            })))), Promise);
          }
        }, {createBindings: function(childTokens) {
            return [bind(_CHILDREN).toAsyncFactory((function(injector) {
              return PromiseWrapper.all(ListWrapper.map(childTokens, (function(token) {
                return injector.asyncGet(token);
              })));
            }), [Injector]), bind(MultiReporter).toFactory((function(children) {
              return new MultiReporter(children);
            }), [_CHILDREN])];
          }}, $__super);
      }(Reporter)));
      Object.defineProperty(MultiReporter.prototype.reportMeasureValues, "parameters", {get: function() {
          return [[MeasureValues]];
        }});
      Object.defineProperty(MultiReporter.prototype.reportSample, "parameters", {get: function() {
          return [[assert.genericType(List, MeasureValues)], [assert.genericType(List, MeasureValues)]];
        }});
      _CHILDREN = new OpaqueToken('MultiReporter.children');
    }
  };
});

//# sourceMappingURL=benchpress/src/reporter/multi_reporter.map

//# sourceMappingURL=../../../benchpress/src/reporter/multi_reporter.js.map