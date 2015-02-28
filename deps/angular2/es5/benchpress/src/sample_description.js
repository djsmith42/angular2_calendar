System.register(["rtts_assert/rtts_assert", "angular2/src/facade/collection", "angular2/di", "./validator", "./metric", "./sample_options"], function($__export) {
  "use strict";
  var assert,
      StringMapWrapper,
      ListWrapper,
      StringMap,
      bind,
      OpaqueToken,
      Validator,
      Metric,
      Options,
      SampleDescription,
      _BINDINGS;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      StringMapWrapper = $__m.StringMapWrapper;
      ListWrapper = $__m.ListWrapper;
      StringMap = $__m.StringMap;
    }, function($__m) {
      bind = $__m.bind;
      OpaqueToken = $__m.OpaqueToken;
    }, function($__m) {
      Validator = $__m.Validator;
    }, function($__m) {
      Metric = $__m.Metric;
    }, function($__m) {
      Options = $__m.Options;
    }],
    execute: function() {
      SampleDescription = $__export("SampleDescription", (function() {
        var SampleDescription = function SampleDescription(id, descriptions, metrics) {
          var $__0 = this;
          this.id = id;
          this.metrics = metrics;
          this.description = {};
          ListWrapper.forEach(descriptions, (function(description) {
            StringMapWrapper.forEach(description, (function(value, prop) {
              return $__0.description[prop] = value;
            }));
          }));
        };
        return ($traceurRuntime.createClass)(SampleDescription, {}, {get BINDINGS() {
            return _BINDINGS;
          }});
      }()));
      Object.defineProperty(SampleDescription, "parameters", {get: function() {
          return [[], [assert.genericType(List, StringMap)], [StringMap]];
        }});
      _BINDINGS = [bind(SampleDescription).toFactory((function(metric, id, forceGc, userAgent, validator, defaultDesc, userDesc) {
        return new SampleDescription(id, [{
          'forceGc': forceGc,
          'userAgent': userAgent
        }, validator.describe(), defaultDesc, userDesc], metric.describe());
      }), [Metric, Options.SAMPLE_ID, Options.FORCE_GC, Options.USER_AGENT, Validator, Options.DEFAULT_DESCRIPTION, Options.SAMPLE_DESCRIPTION]), bind(Options.DEFAULT_DESCRIPTION).toValue({}), bind(Options.SAMPLE_DESCRIPTION).toValue({})];
    }
  };
});

//# sourceMappingURL=benchpress/src/sample_description.map

//# sourceMappingURL=../../benchpress/src/sample_description.js.map