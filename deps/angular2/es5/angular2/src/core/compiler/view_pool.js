System.register(["rtts_assert/rtts_assert", "angular2/src/facade/collection", "./view"], function($__export) {
  "use strict";
  var assert,
      ListWrapper,
      MapWrapper,
      StringMapWrapper,
      List,
      viewModule,
      ViewPool;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
      List = $__m.List;
    }, function($__m) {
      viewModule = $__m;
    }],
    execute: function() {
      ViewPool = $__export("ViewPool", (function() {
        var ViewPool = function ViewPool(capacity) {
          assert.argumentTypes(capacity, assert.type.number);
          this._views = [];
          this._capacity = capacity;
        };
        return ($traceurRuntime.createClass)(ViewPool, {
          pop: function() {
            return assert.returnType((ListWrapper.isEmpty(this._views) ? null : ListWrapper.removeLast(this._views)), viewModule.View);
          },
          push: function(view) {
            assert.argumentTypes(view, viewModule.View);
            if (this._views.length < this._capacity) {
              ListWrapper.push(this._views, view);
            }
          },
          length: function() {
            return this._views.length;
          }
        }, {});
      }()));
      Object.defineProperty(ViewPool, "parameters", {get: function() {
          return [[assert.type.number]];
        }});
      Object.defineProperty(ViewPool.prototype.push, "parameters", {get: function() {
          return [[viewModule.View]];
        }});
    }
  };
});

//# sourceMappingURL=angular2/src/core/compiler/view_pool.map

//# sourceMappingURL=../../../../angular2/src/core/compiler/view_pool.js.map