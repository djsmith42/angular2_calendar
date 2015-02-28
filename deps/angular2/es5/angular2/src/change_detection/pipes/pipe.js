System.register(["rtts_assert/rtts_assert"], function($__export) {
  "use strict";
  var assert,
      NO_CHANGE,
      Pipe;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }],
    execute: function() {
      NO_CHANGE = $__export("NO_CHANGE", new Object());
      Pipe = $__export("Pipe", (function() {
        var Pipe = function Pipe() {};
        return ($traceurRuntime.createClass)(Pipe, {
          supports: function(obj) {
            return assert.returnType((false), assert.type.boolean);
          },
          transform: function(value) {
            assert.argumentTypes(value, assert.type.any);
            return assert.returnType((null), assert.type.any);
          }
        }, {});
      }()));
      Object.defineProperty(Pipe.prototype.transform, "parameters", {get: function() {
          return [[assert.type.any]];
        }});
    }
  };
});

//# sourceMappingURL=angular2/src/change_detection/pipes/pipe.map

//# sourceMappingURL=../../../../angular2/src/change_detection/pipes/pipe.js.map