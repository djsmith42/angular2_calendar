import {assert} from "rtts_assert/rtts_assert";
import {isPresent,
  isBlank,
  RegExpWrapper,
  BaseException} from 'angular2/src/facade/lang';
import {MapWrapper} from 'angular2/src/facade/collection';
import {Parser,
  AST,
  ExpressionWithSource} from 'angular2/change_detection';
import {CompileStep} from './compile_step';
import {CompileElement} from './compile_element';
import {CompileControl} from './compile_control';
var BIND_NAME_REGEXP = RegExpWrapper.create('^(?:(?:(bind)|(var)|(on))-(.+))|\\[([^\\]]+)\\]|\\(([^\\)]+)\\)|(#)(.+)');
export class PropertyBindingParser extends CompileStep {
  constructor(parser, compilationUnit) {
    assert.argumentTypes(parser, Parser, compilationUnit, assert.type.any);
    super();
    this._parser = parser;
    this._compilationUnit = compilationUnit;
  }
  process(parent, current, control) {
    assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
    if (current.ignoreBindings) {
      return ;
    }
    var attrs = current.attrs();
    MapWrapper.forEach(attrs, (attrValue, attrName) => {
      var bindParts = RegExpWrapper.firstMatch(BIND_NAME_REGEXP, attrName);
      if (isPresent(bindParts)) {
        if (isPresent(bindParts[1])) {
          current.addPropertyBinding(bindParts[4], this._parseBinding(attrValue));
        } else if (isPresent(bindParts[2]) || isPresent(bindParts[7])) {
          var identifier = (isPresent(bindParts[4]) && bindParts[4] !== '') ? bindParts[4] : bindParts[8];
          var value = attrValue == '' ? '\$implicit' : attrValue;
          current.addVariableBinding(identifier, value);
        } else if (isPresent(bindParts[3])) {
          current.addEventBinding(bindParts[4], this._parseAction(attrValue));
        } else if (isPresent(bindParts[5])) {
          current.addPropertyBinding(bindParts[5], this._parseBinding(attrValue));
        } else if (isPresent(bindParts[6])) {
          current.addEventBinding(bindParts[6], this._parseBinding(attrValue));
        }
      } else {
        var ast = this._parseInterpolation(attrValue);
        if (isPresent(ast)) {
          current.addPropertyBinding(attrName, ast);
        }
      }
    });
  }
  _parseInterpolation(input) {
    assert.argumentTypes(input, assert.type.string);
    return assert.returnType((this._parser.parseInterpolation(input, this._compilationUnit)), AST);
  }
  _parseBinding(input) {
    assert.argumentTypes(input, assert.type.string);
    return assert.returnType((this._parser.parseBinding(input, this._compilationUnit)), AST);
  }
  _parseAction(input) {
    assert.argumentTypes(input, assert.type.string);
    return assert.returnType((this._parser.parseAction(input, this._compilationUnit)), AST);
  }
}
Object.defineProperty(PropertyBindingParser, "parameters", {get: function() {
    return [[Parser], [assert.type.any]];
  }});
Object.defineProperty(PropertyBindingParser.prototype.process, "parameters", {get: function() {
    return [[CompileElement], [CompileElement], [CompileControl]];
  }});
Object.defineProperty(PropertyBindingParser.prototype._parseInterpolation, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(PropertyBindingParser.prototype._parseBinding, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(PropertyBindingParser.prototype._parseAction, "parameters", {get: function() {
    return [[assert.type.string]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/compiler/pipeline/property_binding_parser.map

//# sourceMappingURL=./property_binding_parser.map