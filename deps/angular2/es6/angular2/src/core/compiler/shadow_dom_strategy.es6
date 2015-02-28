import {assert} from "rtts_assert/rtts_assert";
import {Type,
  isBlank,
  isPresent} from 'angular2/src/facade/lang';
import {DOM,
  Element} from 'angular2/src/facade/dom';
import {List,
  ListWrapper} from 'angular2/src/facade/collection';
import {View} from './view';
import {Content} from './shadow_dom_emulation/content_tag';
import {LightDom} from './shadow_dom_emulation/light_dom';
import {ShimComponent,
  ShimEmulatedComponent,
  ShimNativeComponent} from './shadow_dom_emulation/shim_component';
export class ShadowDomStrategy {
  attachTemplate(el, view) {
    assert.argumentTypes(el, Element, view, View);
  }
  constructLightDom(lightDomView, shadowDomView, el) {
    assert.argumentTypes(lightDomView, View, shadowDomView, View, el, Element);
  }
  polyfillDirectives() {
    return assert.returnType((null), assert.genericType(List, Type));
  }
  extractStyles() {
    return assert.returnType((false), assert.type.boolean);
  }
  getShimComponent(component) {
    assert.argumentTypes(component, Type);
    return assert.returnType((null), ShimComponent);
  }
}
Object.defineProperty(ShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
    return [[Element], [View]];
  }});
Object.defineProperty(ShadowDomStrategy.prototype.constructLightDom, "parameters", {get: function() {
    return [[View], [View], [Element]];
  }});
Object.defineProperty(ShadowDomStrategy.prototype.getShimComponent, "parameters", {get: function() {
    return [[Type]];
  }});
export class EmulatedShadowDomStrategy extends ShadowDomStrategy {
  constructor() {
    super();
  }
  attachTemplate(el, view) {
    assert.argumentTypes(el, Element, view, View);
    DOM.clearNodes(el);
    moveViewNodesIntoParent(el, view);
  }
  constructLightDom(lightDomView, shadowDomView, el) {
    assert.argumentTypes(lightDomView, View, shadowDomView, View, el, Element);
    return new LightDom(lightDomView, shadowDomView, el);
  }
  polyfillDirectives() {
    return assert.returnType(([Content]), assert.genericType(List, Type));
  }
  extractStyles() {
    return assert.returnType((true), assert.type.boolean);
  }
  getShimComponent(component) {
    assert.argumentTypes(component, Type);
    return assert.returnType((new ShimEmulatedComponent(component)), ShimComponent);
  }
}
Object.defineProperty(EmulatedShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
    return [[Element], [View]];
  }});
Object.defineProperty(EmulatedShadowDomStrategy.prototype.constructLightDom, "parameters", {get: function() {
    return [[View], [View], [Element]];
  }});
Object.defineProperty(EmulatedShadowDomStrategy.prototype.getShimComponent, "parameters", {get: function() {
    return [[Type]];
  }});
export class NativeShadowDomStrategy extends ShadowDomStrategy {
  constructor() {
    super();
  }
  attachTemplate(el, view) {
    assert.argumentTypes(el, Element, view, View);
    moveViewNodesIntoParent(el.createShadowRoot(), view);
  }
  constructLightDom(lightDomView, shadowDomView, el) {
    assert.argumentTypes(lightDomView, View, shadowDomView, View, el, Element);
    return null;
  }
  polyfillDirectives() {
    return assert.returnType(([]), assert.genericType(List, Type));
  }
  extractStyles() {
    return assert.returnType((false), assert.type.boolean);
  }
  getShimComponent(component) {
    assert.argumentTypes(component, Type);
    return assert.returnType((new ShimNativeComponent(component)), ShimComponent);
  }
}
Object.defineProperty(NativeShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
    return [[Element], [View]];
  }});
Object.defineProperty(NativeShadowDomStrategy.prototype.constructLightDom, "parameters", {get: function() {
    return [[View], [View], [Element]];
  }});
Object.defineProperty(NativeShadowDomStrategy.prototype.getShimComponent, "parameters", {get: function() {
    return [[Type]];
  }});
function moveViewNodesIntoParent(parent, view) {
  for (var i = 0; i < view.nodes.length; ++i) {
    DOM.appendChild(parent, view.nodes[i]);
  }
}

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/compiler/shadow_dom_strategy.map

//# sourceMappingURL=./shadow_dom_strategy.map