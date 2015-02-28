import {assert} from "rtts_assert/rtts_assert";
import {Element,
  DOM} from 'angular2/src/facade/dom';
import {Map,
  MapWrapper} from 'angular2/src/facade/collection';
import {int,
  isBlank,
  Type} from 'angular2/src/facade/lang';
import {ShadowCss} from './shadow_css';
export class ShimComponent {
  constructor(component) {
    assert.argumentTypes(component, Type);
  }
  shimCssText(cssText) {
    assert.argumentTypes(cssText, assert.type.string);
    return assert.returnType((null), assert.type.string);
  }
  shimContentElement(element) {
    assert.argumentTypes(element, Element);
  }
  shimHostElement(element) {
    assert.argumentTypes(element, Element);
  }
}
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
export class ShimNativeComponent extends ShimComponent {
  constructor(component) {
    assert.argumentTypes(component, Type);
    super(component);
  }
  shimCssText(cssText) {
    assert.argumentTypes(cssText, assert.type.string);
    return assert.returnType((cssText), assert.type.string);
  }
  shimContentElement(element) {
    assert.argumentTypes(element, Element);
  }
  shimHostElement(element) {
    assert.argumentTypes(element, Element);
  }
}
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
var _componentCache = assert.type(MapWrapper.create(), assert.genericType(Map, Type, int));
var _componentId = assert.type(0, int);
export function resetShimComponentCache() {
  MapWrapper.clear(_componentCache);
  _componentId = 0;
}
export class ShimEmulatedComponent extends ShimComponent {
  constructor(component) {
    assert.argumentTypes(component, Type);
    super(component);
    var componentId = MapWrapper.get(_componentCache, component);
    if (isBlank(componentId)) {
      componentId = _componentId++;
      MapWrapper.set(_componentCache, component, componentId);
    }
    this._cmpId = componentId;
  }
  shimCssText(cssText) {
    assert.argumentTypes(cssText, assert.type.string);
    var shadowCss = new ShadowCss();
    return assert.returnType((shadowCss.shimCssText(cssText, this._getContentAttribute(), this._getHostAttribute())), assert.type.string);
  }
  shimContentElement(element) {
    assert.argumentTypes(element, Element);
    DOM.setAttribute(element, this._getContentAttribute(), '');
  }
  shimHostElement(element) {
    assert.argumentTypes(element, Element);
    DOM.setAttribute(element, this._getHostAttribute(), '');
  }
  _getHostAttribute() {
    return `_nghost-${this._cmpId}`;
  }
  _getContentAttribute() {
    return `_ngcontent-${this._cmpId}`;
  }
}
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

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/compiler/shadow_dom_emulation/shim_component.map

//# sourceMappingURL=./shim_component.map