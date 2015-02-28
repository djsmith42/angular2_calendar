import {assert} from "rtts_assert/rtts_assert";
import {describe,
  beforeEach,
  expect,
  it,
  iit,
  ddescribe,
  el} from 'angular2/test_lib';
import {CompilePipeline} from 'angular2/src/core/compiler/pipeline/compile_pipeline';
import {ShimShadowDom} from 'angular2/src/core/compiler/pipeline/shim_shadow_dom';
import {CompileElement} from 'angular2/src/core/compiler/pipeline/compile_element';
import {CompileStep} from 'angular2/src/core/compiler/pipeline/compile_step';
import {CompileControl} from 'angular2/src/core/compiler/pipeline/compile_control';
import {ShimComponent} from 'angular2/src/core/compiler/shadow_dom_emulation/shim_component';
import {Component} from 'angular2/src/core/annotations/annotations';
import {DirectiveMetadata} from 'angular2/src/core/compiler/directive_metadata';
import {ShadowDomStrategy} from 'angular2/src/core/compiler/shadow_dom_strategy';
import {Type,
  isBlank} from 'angular2/src/facade/lang';
import {DOM,
  Element} from 'angular2/src/facade/dom';
export function main() {
  describe('ShimShadowDom', () => {
    function createPipeline(ignoreBindings) {
      assert.argumentTypes(ignoreBindings, assert.type.boolean);
      var component = new Component({selector: 'selector'});
      var meta = new DirectiveMetadata(null, component);
      var shimShadowDom = new ShimShadowDom(meta, new FakeStrategy());
      return new CompilePipeline([new MockStep((parent, current, control) => {
        current.ignoreBindings = ignoreBindings;
      }), new MockStep((parent, current, control) => {
        var el = current.element;
        if (DOM.hasClass(el, 'host')) {
          current.componentDirective = new DirectiveMetadata(SomeComponent, null);
        }
      }), shimShadowDom]);
    }
    Object.defineProperty(createPipeline, "parameters", {get: function() {
        return [[assert.type.boolean]];
      }});
    it('should add the content attribute to content element', () => {
      var pipeline = createPipeline(false);
      var results = pipeline.process(el('<div></div>'));
      expect(DOM.getAttribute(results[0].element, '_ngcontent')).toEqual('content');
      expect(isBlank(DOM.getAttribute(results[0].element, '_nghost'))).toBeTruthy();
    });
    it('should add both the content and host attributes to host element', () => {
      var pipeline = createPipeline(false);
      var results = pipeline.process(el('<div class="host"></div>'));
      expect(DOM.getAttribute(results[0].element, '_ngcontent')).toEqual('content');
      expect(DOM.getAttribute(results[0].element, '_nghost')).toEqual('host');
    });
    it('should do nothing when ignoreBindings is true', () => {
      var pipeline = createPipeline(true);
      var results = pipeline.process(el('<div class="host"></div>'));
      expect(isBlank(DOM.getAttribute(results[0].element, '_ngcontent'))).toBeTruthy();
      expect(isBlank(DOM.getAttribute(results[0].element, '_nghost'))).toBeTruthy();
    });
  });
}
class FakeStrategy extends ShadowDomStrategy {
  constructor() {
    super();
  }
  getShimComponent(component) {
    assert.argumentTypes(component, Type);
    return assert.returnType((new FakeShimComponent(component)), ShimComponent);
  }
}
Object.defineProperty(FakeStrategy.prototype.getShimComponent, "parameters", {get: function() {
    return [[Type]];
  }});
class FakeShimComponent extends ShimComponent {
  constructor(component) {
    assert.argumentTypes(component, Type);
    super(component);
  }
  shimContentElement(element) {
    assert.argumentTypes(element, Element);
    DOM.setAttribute(element, '_ngcontent', 'content');
  }
  shimHostElement(element) {
    assert.argumentTypes(element, Element);
    DOM.setAttribute(element, '_nghost', 'host');
  }
}
Object.defineProperty(FakeShimComponent, "parameters", {get: function() {
    return [[Type]];
  }});
Object.defineProperty(FakeShimComponent.prototype.shimContentElement, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(FakeShimComponent.prototype.shimHostElement, "parameters", {get: function() {
    return [[Element]];
  }});
class MockStep extends CompileStep {
  constructor(process) {
    super();
    this.processClosure = process;
  }
  process(parent, current, control) {
    assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
    this.processClosure(parent, current, control);
  }
}
Object.defineProperty(MockStep.prototype.process, "parameters", {get: function() {
    return [[CompileElement], [CompileElement], [CompileControl]];
  }});
class SomeComponent {}

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/test/core/compiler/pipeline/shim_shadow_dom_spec.map

//# sourceMappingURL=./shim_shadow_dom_spec.map