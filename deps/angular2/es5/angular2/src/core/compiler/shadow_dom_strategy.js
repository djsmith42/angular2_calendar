System.register(["rtts_assert/rtts_assert", "angular2/src/facade/lang", "angular2/src/facade/dom", "angular2/src/facade/collection", "./view", "./shadow_dom_emulation/content_tag", "./shadow_dom_emulation/light_dom", "./shadow_dom_emulation/shim_component"], function($__export) {
  "use strict";
  var assert,
      Type,
      isBlank,
      isPresent,
      DOM,
      Element,
      List,
      ListWrapper,
      View,
      Content,
      LightDom,
      ShimComponent,
      ShimEmulatedComponent,
      ShimNativeComponent,
      ShadowDomStrategy,
      EmulatedShadowDomStrategy,
      NativeShadowDomStrategy;
  function moveViewNodesIntoParent(parent, view) {
    for (var i = 0; i < view.nodes.length; ++i) {
      DOM.appendChild(parent, view.nodes[i]);
    }
  }
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Type = $__m.Type;
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
    }, function($__m) {
      DOM = $__m.DOM;
      Element = $__m.Element;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      View = $__m.View;
    }, function($__m) {
      Content = $__m.Content;
    }, function($__m) {
      LightDom = $__m.LightDom;
    }, function($__m) {
      ShimComponent = $__m.ShimComponent;
      ShimEmulatedComponent = $__m.ShimEmulatedComponent;
      ShimNativeComponent = $__m.ShimNativeComponent;
    }],
    execute: function() {
      ShadowDomStrategy = $__export("ShadowDomStrategy", (function() {
        var ShadowDomStrategy = function ShadowDomStrategy() {};
        return ($traceurRuntime.createClass)(ShadowDomStrategy, {
          attachTemplate: function(el, view) {
            assert.argumentTypes(el, Element, view, View);
          },
          constructLightDom: function(lightDomView, shadowDomView, el) {
            assert.argumentTypes(lightDomView, View, shadowDomView, View, el, Element);
          },
          polyfillDirectives: function() {
            return assert.returnType((null), assert.genericType(List, Type));
          },
          extractStyles: function() {
            return assert.returnType((false), assert.type.boolean);
          },
          getShimComponent: function(component) {
            assert.argumentTypes(component, Type);
            return assert.returnType((null), ShimComponent);
          }
        }, {});
      }()));
      Object.defineProperty(ShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
          return [[Element], [View]];
        }});
      Object.defineProperty(ShadowDomStrategy.prototype.constructLightDom, "parameters", {get: function() {
          return [[View], [View], [Element]];
        }});
      Object.defineProperty(ShadowDomStrategy.prototype.getShimComponent, "parameters", {get: function() {
          return [[Type]];
        }});
      EmulatedShadowDomStrategy = $__export("EmulatedShadowDomStrategy", (function($__super) {
        var EmulatedShadowDomStrategy = function EmulatedShadowDomStrategy() {
          $traceurRuntime.superConstructor(EmulatedShadowDomStrategy).call(this);
        };
        return ($traceurRuntime.createClass)(EmulatedShadowDomStrategy, {
          attachTemplate: function(el, view) {
            assert.argumentTypes(el, Element, view, View);
            DOM.clearNodes(el);
            moveViewNodesIntoParent(el, view);
          },
          constructLightDom: function(lightDomView, shadowDomView, el) {
            assert.argumentTypes(lightDomView, View, shadowDomView, View, el, Element);
            return new LightDom(lightDomView, shadowDomView, el);
          },
          polyfillDirectives: function() {
            return assert.returnType(([Content]), assert.genericType(List, Type));
          },
          extractStyles: function() {
            return assert.returnType((true), assert.type.boolean);
          },
          getShimComponent: function(component) {
            assert.argumentTypes(component, Type);
            return assert.returnType((new ShimEmulatedComponent(component)), ShimComponent);
          }
        }, {}, $__super);
      }(ShadowDomStrategy)));
      Object.defineProperty(EmulatedShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
          return [[Element], [View]];
        }});
      Object.defineProperty(EmulatedShadowDomStrategy.prototype.constructLightDom, "parameters", {get: function() {
          return [[View], [View], [Element]];
        }});
      Object.defineProperty(EmulatedShadowDomStrategy.prototype.getShimComponent, "parameters", {get: function() {
          return [[Type]];
        }});
      NativeShadowDomStrategy = $__export("NativeShadowDomStrategy", (function($__super) {
        var NativeShadowDomStrategy = function NativeShadowDomStrategy() {
          $traceurRuntime.superConstructor(NativeShadowDomStrategy).call(this);
        };
        return ($traceurRuntime.createClass)(NativeShadowDomStrategy, {
          attachTemplate: function(el, view) {
            assert.argumentTypes(el, Element, view, View);
            moveViewNodesIntoParent(el.createShadowRoot(), view);
          },
          constructLightDom: function(lightDomView, shadowDomView, el) {
            assert.argumentTypes(lightDomView, View, shadowDomView, View, el, Element);
            return null;
          },
          polyfillDirectives: function() {
            return assert.returnType(([]), assert.genericType(List, Type));
          },
          extractStyles: function() {
            return assert.returnType((false), assert.type.boolean);
          },
          getShimComponent: function(component) {
            assert.argumentTypes(component, Type);
            return assert.returnType((new ShimNativeComponent(component)), ShimComponent);
          }
        }, {}, $__super);
      }(ShadowDomStrategy)));
      Object.defineProperty(NativeShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
          return [[Element], [View]];
        }});
      Object.defineProperty(NativeShadowDomStrategy.prototype.constructLightDom, "parameters", {get: function() {
          return [[View], [View], [Element]];
        }});
      Object.defineProperty(NativeShadowDomStrategy.prototype.getShimComponent, "parameters", {get: function() {
          return [[Type]];
        }});
    }
  };
});

//# sourceMappingURL=angular2/src/core/compiler/shadow_dom_strategy.map

//# sourceMappingURL=../../../../angular2/src/core/compiler/shadow_dom_strategy.js.map