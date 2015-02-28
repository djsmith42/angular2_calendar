import {assert} from "rtts_assert/rtts_assert";
import {CompileStep} from './compile_step';
import {CompileElement} from './compile_element';
import {CompileControl} from './compile_control';
import {DirectiveMetadata} from 'angular2/src/core/compiler/directive_metadata';
import {ShadowDomStrategy} from 'angular2/src/core/compiler/shadow_dom_strategy';
import {DOM,
  Element} from 'angular2/src/facade/dom';
import {isPresent,
  isBlank,
  Type} from 'angular2/src/facade/lang';
export class ShimShadowCss extends CompileStep {
  constructor(cmpMetadata, strategy, styleHost) {
    assert.argumentTypes(cmpMetadata, DirectiveMetadata, strategy, ShadowDomStrategy, styleHost, Element);
    super();
    this._strategy = strategy;
    this._component = cmpMetadata.type;
    this._styleHost = styleHost;
    this._lastInsertedStyle = null;
  }
  process(parent, current, control) {
    assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
    if (DOM.tagName(current.element) == 'STYLE') {
      current.ignoreBindings = true;
      if (this._strategy.extractStyles()) {
        DOM.remove(current.element);
        var css = DOM.getText(current.element);
        var shimComponent = this._strategy.getShimComponent(this._component);
        css = shimComponent.shimCssText(css);
        this._insertStyle(this._styleHost, css);
      }
    }
  }
  _insertStyle(el, css) {
    assert.argumentTypes(el, Element, css, assert.type.string);
    var style = DOM.createStyleElement(css);
    if (isBlank(this._lastInsertedStyle)) {
      var firstChild = DOM.firstChild(el);
      if (isPresent(firstChild)) {
        DOM.insertBefore(firstChild, style);
      } else {
        DOM.appendChild(el, style);
      }
    } else {
      DOM.insertAfter(this._lastInsertedStyle, style);
    }
    this._lastInsertedStyle = style;
  }
}
Object.defineProperty(ShimShadowCss, "parameters", {get: function() {
    return [[DirectiveMetadata], [ShadowDomStrategy], [Element]];
  }});
Object.defineProperty(ShimShadowCss.prototype.process, "parameters", {get: function() {
    return [[CompileElement], [CompileElement], [CompileControl]];
  }});
Object.defineProperty(ShimShadowCss.prototype._insertStyle, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/compiler/pipeline/shim_shadow_css.map

//# sourceMappingURL=./shim_shadow_css.map