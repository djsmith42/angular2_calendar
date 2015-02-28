System.register(["rtts_assert/rtts_assert", "angular2/src/facade/dom", "angular2/src/facade/collection", "angular2/src/facade/lang", "./shadow_css"], function($__export) {
  "use strict";
  var assert,
      Element,
      DOM,
      Map,
      MapWrapper,
      int,
      isBlank,
      Type,
      ShadowCss,
      ShimComponent,
      ShimNativeComponent,
      _componentCache,
      _componentId,
      ShimEmulatedComponent;
  function resetShimComponentCache() {
    MapWrapper.clear(_componentCache);
    _componentId = 0;
  }
  $__export("resetShimComponentCache", resetShimComponentCache);
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Element = $__m.Element;
      DOM = $__m.DOM;
    }, function($__m) {
      Map = $__m.Map;
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      int = $__m.int;
      isBlank = $__m.isBlank;
      Type = $__m.Type;
    }, function($__m) {
      ShadowCss = $__m.ShadowCss;
    }],
    execute: function() {
      ShimComponent = $__export("ShimComponent", (function() {
        var ShimComponent = function ShimComponent(component) {
          assert.argumentTypes(component, Type);
        };
        return ($traceurRuntime.createClass)(ShimComponent, {
          shimCssText: function(cssText) {
            assert.argumentTypes(cssText, assert.type.string);
            return assert.returnType((null), assert.type.string);
          },
          shimContentElement: function(element) {
            assert.argumentTypes(element, Element);
          },
          shimHostElement: function(element) {
            assert.argumentTypes(element, Element);
          }
        }, {});
      }()));
      Object.defineProperty(ShimComponent, "parameters", {get: function() {
          return [[Type]];
        }});
      Object.defineProperty(ShimComponent.prototype.shimCssText, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ShimComponent.prototype.shimContentElement, "parameters", {get: function() {
          return [[Element]];
        }});
      Object.defineProperty(ShimComponent.prototype.shimHostElement, "parameters", {get: function() {
          return [[Element]];
        }});
      ShimNativeComponent = $__export("ShimNativeComponent", (function($__super) {
        var ShimNativeComponent = function ShimNativeComponent(component) {
          assert.argumentTypes(component, Type);
          $traceurRuntime.superConstructor(ShimNativeComponent).call(this, component);
        };
        return ($traceurRuntime.createClass)(ShimNativeComponent, {
          shimCssText: function(cssText) {
            assert.argumentTypes(cssText, assert.type.string);
            return assert.returnType((cssText), assert.type.string);
          },
          shimContentElement: function(element) {
            assert.argumentTypes(element, Element);
          },
          shimHostElement: function(element) {
            assert.argumentTypes(element, Element);
          }
        }, {}, $__super);
      }(ShimComponent)));
      Object.defineProperty(ShimNativeComponent, "parameters", {get: function() {
          return [[Type]];
        }});
      Object.defineProperty(ShimNativeComponent.prototype.shimCssText, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ShimNativeComponent.prototype.shimContentElement, "parameters", {get: function() {
          return [[Element]];
        }});
      Object.defineProperty(ShimNativeComponent.prototype.shimHostElement, "parameters", {get: function() {
          return [[Element]];
        }});
      _componentCache = assert.type(MapWrapper.create(), assert.genericType(Map, Type, int));
      _componentId = assert.type(0, int);
      ShimEmulatedComponent = $__export("ShimEmulatedComponent", (function($__super) {
        var ShimEmulatedComponent = function ShimEmulatedComponent(component) {
          assert.argumentTypes(component, Type);
          $traceurRuntime.superConstructor(ShimEmulatedComponent).call(this, component);
          var componentId = MapWrapper.get(_componentCache, component);
          if (isBlank(componentId)) {
            componentId = _componentId++;
            MapWrapper.set(_componentCache, component, componentId);
          }
          this._cmpId = componentId;
        };
        return ($traceurRuntime.createClass)(ShimEmulatedComponent, {
          shimCssText: function(cssText) {
            assert.argumentTypes(cssText, assert.type.string);
            var shadowCss = new ShadowCss();
            return assert.returnType((shadowCss.shimCssText(cssText, this._getContentAttribute(), this._getHostAttribute())), assert.type.string);
          },
          shimContentElement: function(element) {
            assert.argumentTypes(element, Element);
            DOM.setAttribute(element, this._getContentAttribute(), '');
          },
          shimHostElement: function(element) {
            assert.argumentTypes(element, Element);
            DOM.setAttribute(element, this._getHostAttribute(), '');
          },
          _getHostAttribute: function() {
            return ("_nghost-" + this._cmpId);
          },
          _getContentAttribute: function() {
            return ("_ngcontent-" + this._cmpId);
          }
        }, {}, $__super);
      }(ShimComponent)));
      Object.defineProperty(ShimEmulatedComponent, "parameters", {get: function() {
          return [[Type]];
        }});
      Object.defineProperty(ShimEmulatedComponent.prototype.shimCssText, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ShimEmulatedComponent.prototype.shimContentElement, "parameters", {get: function() {
          return [[Element]];
        }});
      Object.defineProperty(ShimEmulatedComponent.prototype.shimHostElement, "parameters", {get: function() {
          return [[Element]];
        }});
    }
  };
});

//# sourceMappingURL=angular2/src/core/compiler/shadow_dom_emulation/shim_component.map

//# sourceMappingURL=../../../../../angular2/src/core/compiler/shadow_dom_emulation/shim_component.js.map