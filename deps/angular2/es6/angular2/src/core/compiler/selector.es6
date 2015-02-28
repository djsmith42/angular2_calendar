import {assert} from "rtts_assert/rtts_assert";
import {List,
  Map,
  ListWrapper,
  MapWrapper} from 'angular2/src/facade/collection';
import {isPresent,
  isBlank,
  RegExpWrapper,
  RegExpMatcherWrapper,
  StringWrapper} from 'angular2/src/facade/lang';
const _EMPTY_ATTR_VALUE = '';
var _SELECTOR_REGEXP = RegExpWrapper.create('^([-\\w]+)|' + '(?:\\.([-\\w]+))|' + '(?:\\[([-\\w*]+)(?:=([^\\]]*))?\\])');
export class CssSelector {
  static parse(selector) {
    assert.argumentTypes(selector, assert.type.string);
    var cssSelector = new CssSelector();
    var matcher = RegExpWrapper.matcher(_SELECTOR_REGEXP, selector);
    var match;
    while (isPresent(match = RegExpMatcherWrapper.next(matcher))) {
      if (isPresent(match[1])) {
        cssSelector.setElement(match[1]);
      }
      if (isPresent(match[2])) {
        cssSelector.addClassName(match[2]);
      }
      if (isPresent(match[3])) {
        cssSelector.addAttribute(match[3], match[4]);
      }
    }
    return assert.returnType((cssSelector), CssSelector);
  }
  constructor() {
    this.element = null;
    this.classNames = ListWrapper.create();
    this.attrs = ListWrapper.create();
  }
  setElement(element = null) {
    assert.argumentTypes(element, assert.type.string);
    if (isPresent(element)) {
      element = element.toLowerCase();
    }
    this.element = element;
  }
  addAttribute(name, value = _EMPTY_ATTR_VALUE) {
    assert.argumentTypes(name, assert.type.string, value, assert.type.string);
    ListWrapper.push(this.attrs, name.toLowerCase());
    if (isPresent(value)) {
      value = value.toLowerCase();
    } else {
      value = _EMPTY_ATTR_VALUE;
    }
    ListWrapper.push(this.attrs, value);
  }
  addClassName(name) {
    assert.argumentTypes(name, assert.type.string);
    ListWrapper.push(this.classNames, name.toLowerCase());
  }
  toString() {
    var res = '';
    if (isPresent(this.element)) {
      res += this.element;
    }
    if (isPresent(this.classNames)) {
      for (var i = 0; i < this.classNames.length; i++) {
        res += '.' + this.classNames[i];
      }
    }
    if (isPresent(this.attrs)) {
      for (var i = 0; i < this.attrs.length; ) {
        var attrName = this.attrs[i++];
        var attrValue = this.attrs[i++];
        res += '[' + attrName;
        if (attrValue.length > 0) {
          res += '=' + attrValue;
        }
        res += ']';
      }
    }
    return assert.returnType((res), assert.type.string);
  }
}
Object.defineProperty(CssSelector.parse, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(CssSelector.prototype.setElement, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(CssSelector.prototype.addAttribute, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string]];
  }});
Object.defineProperty(CssSelector.prototype.addClassName, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export class SelectorMatcher {
  constructor() {
    this._elementMap = MapWrapper.create();
    this._elementPartialMap = MapWrapper.create();
    this._classMap = MapWrapper.create();
    this._classPartialMap = MapWrapper.create();
    this._attrValueMap = MapWrapper.create();
    this._attrValuePartialMap = MapWrapper.create();
  }
  addSelectable(cssSelector, selectable) {
    assert.argumentTypes(cssSelector, CssSelector, selectable, assert.type.any);
    var matcher = this;
    var element = cssSelector.element;
    var classNames = cssSelector.classNames;
    var attrs = cssSelector.attrs;
    if (isPresent(element)) {
      var isTerminal = attrs.length === 0 && classNames.length === 0;
      if (isTerminal) {
        this._addTerminal(matcher._elementMap, element, selectable);
      } else {
        matcher = this._addPartial(matcher._elementPartialMap, element);
      }
    }
    if (isPresent(classNames)) {
      for (var index = 0; index < classNames.length; index++) {
        var isTerminal = attrs.length === 0 && index === classNames.length - 1;
        var className = classNames[index];
        if (isTerminal) {
          this._addTerminal(matcher._classMap, className, selectable);
        } else {
          matcher = this._addPartial(matcher._classPartialMap, className);
        }
      }
    }
    if (isPresent(attrs)) {
      for (var index = 0; index < attrs.length; ) {
        var isTerminal = index === attrs.length - 2;
        var attrName = attrs[index++];
        var attrValue = attrs[index++];
        var map = isTerminal ? matcher._attrValueMap : matcher._attrValuePartialMap;
        var valuesMap = MapWrapper.get(map, attrName);
        if (isBlank(valuesMap)) {
          valuesMap = MapWrapper.create();
          MapWrapper.set(map, attrName, valuesMap);
        }
        if (isTerminal) {
          this._addTerminal(valuesMap, attrValue, selectable);
        } else {
          matcher = this._addPartial(valuesMap, attrValue);
        }
      }
    }
  }
  _addTerminal(map, name, selectable) {
    assert.argumentTypes(map, assert.genericType(Map, assert.type.string, assert.type.string), name, assert.type.string, selectable, assert.type.any);
    var terminalList = MapWrapper.get(map, name);
    if (isBlank(terminalList)) {
      terminalList = ListWrapper.create();
      MapWrapper.set(map, name, terminalList);
    }
    ListWrapper.push(terminalList, selectable);
  }
  _addPartial(map, name) {
    assert.argumentTypes(map, assert.genericType(Map, assert.type.string, assert.type.string), name, assert.type.string);
    var matcher = MapWrapper.get(map, name);
    if (isBlank(matcher)) {
      matcher = new SelectorMatcher();
      MapWrapper.set(map, name, matcher);
    }
    return matcher;
  }
  match(cssSelector, matchedCallback) {
    assert.argumentTypes(cssSelector, CssSelector, matchedCallback, Function);
    var element = cssSelector.element;
    var classNames = cssSelector.classNames;
    var attrs = cssSelector.attrs;
    this._matchTerminal(this._elementMap, element, matchedCallback);
    this._matchPartial(this._elementPartialMap, element, cssSelector, matchedCallback);
    if (isPresent(classNames)) {
      for (var index = 0; index < classNames.length; index++) {
        var className = classNames[index];
        this._matchTerminal(this._classMap, className, matchedCallback);
        this._matchPartial(this._classPartialMap, className, cssSelector, matchedCallback);
      }
    }
    if (isPresent(attrs)) {
      for (var index = 0; index < attrs.length; ) {
        var attrName = attrs[index++];
        var attrValue = attrs[index++];
        var valuesMap = MapWrapper.get(this._attrValueMap, attrName);
        if (!StringWrapper.equals(attrValue, _EMPTY_ATTR_VALUE)) {
          this._matchTerminal(valuesMap, _EMPTY_ATTR_VALUE, matchedCallback);
        }
        this._matchTerminal(valuesMap, attrValue, matchedCallback);
        valuesMap = MapWrapper.get(this._attrValuePartialMap, attrName);
        this._matchPartial(valuesMap, attrValue, cssSelector, matchedCallback);
      }
    }
  }
  _matchTerminal(map = null, name, matchedCallback) {
    assert.argumentTypes(map, assert.genericType(Map, assert.type.string, assert.type.string), name, assert.type.any, matchedCallback, assert.type.any);
    if (isBlank(map) || isBlank(name)) {
      return ;
    }
    var selectables = MapWrapper.get(map, name);
    if (isBlank(selectables)) {
      return ;
    }
    for (var index = 0; index < selectables.length; index++) {
      matchedCallback(selectables[index]);
    }
  }
  _matchPartial(map = null, name, cssSelector, matchedCallback) {
    assert.argumentTypes(map, assert.genericType(Map, assert.type.string, assert.type.string), name, assert.type.any, cssSelector, assert.type.any, matchedCallback, assert.type.any);
    if (isBlank(map) || isBlank(name)) {
      return ;
    }
    var nestedSelector = MapWrapper.get(map, name);
    if (isBlank(nestedSelector)) {
      return ;
    }
    nestedSelector.match(cssSelector, matchedCallback);
  }
}
Object.defineProperty(SelectorMatcher.prototype.addSelectable, "parameters", {get: function() {
    return [[CssSelector], []];
  }});
Object.defineProperty(SelectorMatcher.prototype._addTerminal, "parameters", {get: function() {
    return [[assert.genericType(Map, assert.type.string, assert.type.string)], [assert.type.string], []];
  }});
Object.defineProperty(SelectorMatcher.prototype._addPartial, "parameters", {get: function() {
    return [[assert.genericType(Map, assert.type.string, assert.type.string)], [assert.type.string]];
  }});
Object.defineProperty(SelectorMatcher.prototype.match, "parameters", {get: function() {
    return [[CssSelector], [Function]];
  }});
Object.defineProperty(SelectorMatcher.prototype._matchTerminal, "parameters", {get: function() {
    return [[assert.genericType(Map, assert.type.string, assert.type.string)], [], []];
  }});
Object.defineProperty(SelectorMatcher.prototype._matchPartial, "parameters", {get: function() {
    return [[assert.genericType(Map, assert.type.string, assert.type.string)], [], [], []];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/compiler/selector.map

//# sourceMappingURL=./selector.map