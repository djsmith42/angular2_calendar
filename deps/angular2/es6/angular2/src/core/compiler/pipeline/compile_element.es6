import {assert} from "rtts_assert/rtts_assert";
import {List,
  Map,
  ListWrapper,
  MapWrapper} from 'angular2/src/facade/collection';
import {Element,
  DOM} from 'angular2/src/facade/dom';
import {int,
  isBlank,
  isPresent,
  Type} from 'angular2/src/facade/lang';
import {DirectiveMetadata} from '../directive_metadata';
import {Decorator,
  Component,
  Viewport} from '../../annotations/annotations';
import {ElementBinder} from '../element_binder';
import {ProtoElementInjector} from '../element_injector';
import {ProtoView} from '../view';
import {AST} from 'angular2/change_detection';
export class CompileElement {
  constructor(element) {
    assert.argumentTypes(element, Element);
    this.element = element;
    this._attrs = null;
    this._classList = null;
    this.textNodeBindings = null;
    this.propertyBindings = null;
    this.eventBindings = null;
    this.variableBindings = null;
    this.decoratorDirectives = null;
    this.viewportDirective = null;
    this.componentDirective = null;
    this._allDirectives = null;
    this.isViewRoot = false;
    this.hasBindings = false;
    this.inheritedProtoView = null;
    this.inheritedProtoElementInjector = null;
    this.inheritedElementBinder = null;
    this.distanceToParentInjector = 0;
    this.compileChildren = true;
    this.ignoreBindings = false;
  }
  refreshAttrs() {
    this._attrs = null;
  }
  attrs() {
    if (isBlank(this._attrs)) {
      this._attrs = DOM.attributeMap(this.element);
    }
    return assert.returnType((this._attrs), assert.genericType(Map, assert.type.string, assert.type.string));
  }
  refreshClassList() {
    this._classList = null;
  }
  classList() {
    if (isBlank(this._classList)) {
      this._classList = ListWrapper.create();
      var elClassList = DOM.classList(this.element);
      for (var i = 0; i < elClassList.length; i++) {
        ListWrapper.push(this._classList, elClassList[i]);
      }
    }
    return assert.returnType((this._classList), assert.genericType(List, assert.type.string));
  }
  addTextNodeBinding(indexInParent, expression) {
    assert.argumentTypes(indexInParent, int, expression, AST);
    if (isBlank(this.textNodeBindings)) {
      this.textNodeBindings = MapWrapper.create();
    }
    MapWrapper.set(this.textNodeBindings, indexInParent, expression);
  }
  addPropertyBinding(property, expression) {
    assert.argumentTypes(property, assert.type.string, expression, AST);
    if (isBlank(this.propertyBindings)) {
      this.propertyBindings = MapWrapper.create();
    }
    MapWrapper.set(this.propertyBindings, property, expression);
  }
  addVariableBinding(variableName, variableValue) {
    assert.argumentTypes(variableName, assert.type.string, variableValue, assert.type.string);
    if (isBlank(this.variableBindings)) {
      this.variableBindings = MapWrapper.create();
    }
    MapWrapper.set(this.variableBindings, variableValue, variableName);
  }
  addEventBinding(eventName, expression) {
    assert.argumentTypes(eventName, assert.type.string, expression, AST);
    if (isBlank(this.eventBindings)) {
      this.eventBindings = MapWrapper.create();
    }
    MapWrapper.set(this.eventBindings, eventName, expression);
  }
  addDirective(directive) {
    assert.argumentTypes(directive, DirectiveMetadata);
    var annotation = directive.annotation;
    this._allDirectives = null;
    if (annotation instanceof Decorator) {
      if (isBlank(this.decoratorDirectives)) {
        this.decoratorDirectives = ListWrapper.create();
      }
      ListWrapper.push(this.decoratorDirectives, directive);
      if (!annotation.compileChildren) {
        this.compileChildren = false;
      }
    } else if (annotation instanceof Viewport) {
      this.viewportDirective = directive;
    } else if (annotation instanceof Component) {
      this.componentDirective = directive;
    }
  }
  getAllDirectives() {
    if (this._allDirectives === null) {
      var directives = ListWrapper.create();
      if (isPresent(this.componentDirective)) {
        ListWrapper.push(directives, this.componentDirective);
      }
      if (isPresent(this.viewportDirective)) {
        ListWrapper.push(directives, this.viewportDirective);
      }
      if (isPresent(this.decoratorDirectives)) {
        directives = ListWrapper.concat(directives, this.decoratorDirectives);
      }
      this._allDirectives = directives;
    }
    return assert.returnType((this._allDirectives), assert.genericType(List, DirectiveMetadata));
  }
}
Object.defineProperty(CompileElement, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(CompileElement.prototype.addTextNodeBinding, "parameters", {get: function() {
    return [[int], [AST]];
  }});
Object.defineProperty(CompileElement.prototype.addPropertyBinding, "parameters", {get: function() {
    return [[assert.type.string], [AST]];
  }});
Object.defineProperty(CompileElement.prototype.addVariableBinding, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string]];
  }});
Object.defineProperty(CompileElement.prototype.addEventBinding, "parameters", {get: function() {
    return [[assert.type.string], [AST]];
  }});
Object.defineProperty(CompileElement.prototype.addDirective, "parameters", {get: function() {
    return [[DirectiveMetadata]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/compiler/pipeline/compile_element.map

//# sourceMappingURL=./compile_element.map