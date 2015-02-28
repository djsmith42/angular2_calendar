import {assert} from "rtts_assert/rtts_assert";
import {CompileStep} from './compile_step';
import {CompileElement} from './compile_element';
import {CompileControl} from './compile_control';
import {isPresent} from 'angular2/src/facade/lang';
import {DirectiveMetadata} from 'angular2/src/core/compiler/directive_metadata';
import {ShadowDomStrategy} from 'angular2/src/core/compiler/shadow_dom_strategy';
import {ShimComponent} from 'angular2/src/core/compiler/shadow_dom_emulation/shim_component';
export class ShimShadowDom extends CompileStep {
  constructor(cmpMetadata, strategy) {
    assert.argumentTypes(cmpMetadata, DirectiveMetadata, strategy, ShadowDomStrategy);
    super();
    this._strategy = strategy;
    this._shimComponent = strategy.getShimComponent(cmpMetadata.type);
  }
  process(parent, current, control) {
    assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
    if (current.ignoreBindings) {
      return ;
    }
    this._shimComponent.shimContentElement(current.element);
    var host = current.componentDirective;
    if (isPresent(host)) {
      var shimComponent = this._strategy.getShimComponent(host.type);
      shimComponent.shimHostElement(current.element);
    }
  }
}
Object.defineProperty(ShimShadowDom, "parameters", {get: function() {
    return [[DirectiveMetadata], [ShadowDomStrategy]];
  }});
Object.defineProperty(ShimShadowDom.prototype.process, "parameters", {get: function() {
    return [[CompileElement], [CompileElement], [CompileControl]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/compiler/pipeline/shim_shadow_dom.map

//# sourceMappingURL=./shim_shadow_dom.map