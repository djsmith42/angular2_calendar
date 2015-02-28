import {assert} from "rtts_assert/rtts_assert";
import {isPresent,
  isBlank,
  BaseException} from 'angular2/src/facade/lang';
import {List,
  MapWrapper} from 'angular2/src/facade/collection';
import {DOM} from 'angular2/src/facade/dom';
import {SelectorMatcher} from '../selector';
import {CssSelector} from '../selector';
import {DirectiveMetadata} from '../directive_metadata';
import {Component,
  Viewport} from '../../annotations/annotations';
import {CompileStep} from './compile_step';
import {CompileElement} from './compile_element';
import {CompileControl} from './compile_control';
export class DirectiveParser extends CompileStep {
  constructor(directives) {
    assert.argumentTypes(directives, assert.genericType(List, DirectiveMetadata));
    super();
    this._selectorMatcher = new SelectorMatcher();
    for (var i = 0; i < directives.length; i++) {
      var directiveMetadata = directives[i];
      this._selectorMatcher.addSelectable(CssSelector.parse(directiveMetadata.annotation.selector), directiveMetadata);
    }
  }
  process(parent, current, control) {
    assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
    var attrs = current.attrs();
    var classList = current.classList();
    var cssSelector = new CssSelector();
    cssSelector.setElement(DOM.nodeName(current.element));
    for (var i = 0; i < classList.length; i++) {
      cssSelector.addClassName(classList[i]);
    }
    MapWrapper.forEach(attrs, (attrValue, attrName) => {
      if (isBlank(current.propertyBindings) || isPresent(current.propertyBindings) && !MapWrapper.contains(current.propertyBindings, attrName)) {
        cssSelector.addAttribute(attrName, attrValue);
      }
    });
    if (isPresent(current.propertyBindings)) {
      MapWrapper.forEach(current.propertyBindings, (expression, prop) => {
        cssSelector.addAttribute(prop, expression.source);
      });
    }
    if (isPresent(current.variableBindings)) {
      MapWrapper.forEach(current.variableBindings, (value, name) => {
        cssSelector.addAttribute(name, value);
      });
    }
    var isTemplateElement = DOM.isTemplateElement(current.element);
    this._selectorMatcher.match(cssSelector, (directive) => {
      if (directive.annotation instanceof Viewport) {
        if (!isTemplateElement) {
          throw new BaseException('Viewport directives need to be placed on <template> elements or elements with template attribute!');
        } else if (isPresent(current.viewportDirective)) {
          throw new BaseException('Only one template directive per element is allowed!');
        }
      } else if (isTemplateElement) {
        throw new BaseException('Only template directives are allowed on <template> elements!');
      } else if ((directive.annotation instanceof Component) && isPresent(current.componentDirective)) {
        throw new BaseException('Only one component directive per element is allowed!');
      }
      current.addDirective(directive);
    });
  }
}
Object.defineProperty(DirectiveParser, "parameters", {get: function() {
    return [[assert.genericType(List, DirectiveMetadata)]];
  }});
Object.defineProperty(DirectiveParser.prototype.process, "parameters", {get: function() {
    return [[CompileElement], [CompileElement], [CompileControl]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/compiler/pipeline/directive_parser.map

//# sourceMappingURL=./directive_parser.map