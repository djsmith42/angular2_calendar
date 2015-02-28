import {assert} from "rtts_assert/rtts_assert";
import {describe,
  xit,
  it,
  expect,
  beforeEach,
  ddescribe,
  iit,
  el} from 'angular2/test_lib';
import {StringMapWrapper,
  List} from 'angular2/src/facade/collection';
import {Type} from 'angular2/src/facade/lang';
import {Injector} from 'angular2/di';
import {Lexer,
  Parser,
  ChangeDetector,
  dynamicChangeDetection} from 'angular2/change_detection';
import {ExceptionHandler} from 'angular2/src/core/exception_handler';
import {Compiler,
  CompilerCache} from 'angular2/src/core/compiler/compiler';
import {LifeCycle} from 'angular2/src/core/life_cycle/life_cycle';
import {DirectiveMetadataReader} from 'angular2/src/core/compiler/directive_metadata_reader';
import {ShadowDomStrategy,
  NativeShadowDomStrategy,
  EmulatedShadowDomStrategy} from 'angular2/src/core/compiler/shadow_dom_strategy';
import {TemplateLoader} from 'angular2/src/core/compiler/template_loader';
import {MockTemplateResolver} from 'angular2/src/mock/template_resolver_mock';
import {Decorator,
  Component,
  Viewport} from 'angular2/src/core/annotations/annotations';
import {Template} from 'angular2/src/core/annotations/template';
import {ViewContainer} from 'angular2/src/core/compiler/view_container';
export function main() {
  describe('integration tests', function() {
    StringMapWrapper.forEach({
      "native": new NativeShadowDomStrategy(),
      "emulated": new EmulatedShadowDomStrategy()
    }, (strategy, name) => {
      describe(`${name} shadow dom strategy`, () => {
        var compiler,
            tplResolver;
        beforeEach(() => {
          tplResolver = new MockTemplateResolver();
          compiler = new Compiler(dynamicChangeDetection, new TemplateLoader(null), new DirectiveMetadataReader(), new Parser(new Lexer()), new CompilerCache(), strategy, tplResolver);
        });
        function compile(template, directives, assertions) {
          assert.argumentTypes(template, assert.type.any, directives, assert.genericType(List, Type), assertions, assert.type.any);
          tplResolver.setTemplate(MyComp, new Template({
            inline: template,
            directives: directives
          }));
          compiler.compile(MyComp).then(createView).then((view) => {
            var lc = new LifeCycle(new ExceptionHandler(), view.changeDetector, false);
            assertions(view, lc);
          });
        }
        Object.defineProperty(compile, "parameters", {get: function() {
            return [[], [assert.genericType(List, Type)], []];
          }});
        it('should support multiple content tags', (done) => {
          var temp = '<multiple-content-tags>' + '<div>B</div>' + '<div>C</div>' + '<div class="left">A</div>' + '</multiple-content-tags>';
          compile(temp, [MultipleContentTagsComponent], (view, lc) => {
            expect(view.nodes).toHaveText('(A, BC)');
            done();
          });
        });
        it('should redistribute only direct children', (done) => {
          var temp = '<multiple-content-tags>' + '<div>B<div class="left">A</div></div>' + '<div>C</div>' + '</multiple-content-tags>';
          compile(temp, [MultipleContentTagsComponent], (view, lc) => {
            expect(view.nodes).toHaveText('(, BAC)');
            done();
          });
        });
        it("should redistribute direct child viewcontainers when the light dom changes", (done) => {
          var temp = '<multiple-content-tags>' + '<div><div template="manual" class="left">A</div></div>' + '<div>B</div>' + '</multiple-content-tags>';
          compile(temp, [MultipleContentTagsComponent, ManualViewportDirective], (view, lc) => {
            var dir = view.elementInjectors[1].get(ManualViewportDirective);
            expect(view.nodes).toHaveText('(, B)');
            dir.show();
            lc.tick();
            expect(view.nodes).toHaveText('(, AB)');
            dir.hide();
            lc.tick();
            expect(view.nodes).toHaveText('(, B)');
            done();
          });
        });
        it("should redistribute when the light dom changes", (done) => {
          var temp = '<multiple-content-tags>' + '<div template="manual" class="left">A</div>' + '<div>B</div>' + '</multiple-content-tags>';
          compile(temp, [MultipleContentTagsComponent, ManualViewportDirective], (view, lc) => {
            var dir = view.elementInjectors[1].get(ManualViewportDirective);
            expect(view.nodes).toHaveText('(, B)');
            dir.show();
            lc.tick();
            expect(view.nodes).toHaveText('(A, B)');
            dir.hide();
            lc.tick();
            expect(view.nodes).toHaveText('(, B)');
            done();
          });
        });
        it("should support nested components", (done) => {
          var temp = '<outer-with-indirect-nested>' + '<div>A</div>' + '<div>B</div>' + '</outer-with-indirect-nested>';
          compile(temp, [OuterWithIndirectNestedComponent], (view, lc) => {
            expect(view.nodes).toHaveText('OUTER(SIMPLE(AB))');
            done();
          });
        });
        it("should support nesting with content being direct child of a nested component", (done) => {
          var temp = '<outer>' + '<div template="manual" class="left">A</div>' + '<div>B</div>' + '<div>C</div>' + '</outer>';
          compile(temp, [OuterComponent, ManualViewportDirective], (view, lc) => {
            var dir = view.elementInjectors[1].get(ManualViewportDirective);
            expect(view.nodes).toHaveText('OUTER(INNER(INNERINNER(,BC)))');
            dir.show();
            lc.tick();
            expect(view.nodes).toHaveText('OUTER(INNER(INNERINNER(A,BC)))');
            done();
          });
        });
      });
    });
  });
}
class TestDirectiveMetadataReader extends DirectiveMetadataReader {
  constructor(shadowDomStrategy) {
    super();
    this.shadowDomStrategy = shadowDomStrategy;
  }
  parseShadowDomStrategy(annotation) {
    assert.argumentTypes(annotation, Component);
    return assert.returnType((this.shadowDomStrategy), ShadowDomStrategy);
  }
}
Object.defineProperty(TestDirectiveMetadataReader.prototype.parseShadowDomStrategy, "parameters", {get: function() {
    return [[Component]];
  }});
class ManualViewportDirective {
  constructor(viewContainer) {
    assert.argumentTypes(viewContainer, ViewContainer);
    this.viewContainer = viewContainer;
  }
  show() {
    this.viewContainer.create();
  }
  hide() {
    this.viewContainer.remove(0);
  }
}
Object.defineProperty(ManualViewportDirective, "annotations", {get: function() {
    return [new Viewport({selector: '[manual]'})];
  }});
Object.defineProperty(ManualViewportDirective, "parameters", {get: function() {
    return [[ViewContainer]];
  }});
class AutoViewportDirective {
  constructor(viewContainer) {
    assert.argumentTypes(viewContainer, ViewContainer);
    this.viewContainer = viewContainer;
  }
  set auto(newValue) {
    assert.argumentTypes(newValue, assert.type.boolean);
    if (newValue) {
      this.viewContainer.create();
    } else {
      this.viewContainer.remove(0);
    }
  }
}
Object.defineProperty(AutoViewportDirective, "annotations", {get: function() {
    return [new Viewport({
      selector: '[auto]',
      bind: {'auto': 'auto'}
    })];
  }});
Object.defineProperty(AutoViewportDirective, "parameters", {get: function() {
    return [[ViewContainer]];
  }});
Object.defineProperty(Object.getOwnPropertyDescriptor(AutoViewportDirective.prototype, "auto").set, "parameters", {get: function() {
    return [[assert.type.boolean]];
  }});
class Simple {}
Object.defineProperty(Simple, "annotations", {get: function() {
    return [new Component({selector: 'simple'}), new Template({inline: 'SIMPLE(<content></content>)'})];
  }});
class MultipleContentTagsComponent {}
Object.defineProperty(MultipleContentTagsComponent, "annotations", {get: function() {
    return [new Component({selector: 'multiple-content-tags'}), new Template({inline: '(<content select=".left"></content>, <content></content>)'})];
  }});
class ConditionalContentComponent {
  constructor() {
    this.cond = false;
  }
  showLeft() {
    this.cond = true;
  }
  hideLeft() {
    this.cond = false;
  }
}
Object.defineProperty(ConditionalContentComponent, "annotations", {get: function() {
    return [new Component({selector: 'conditional-content'}), new Template({
      inline: '<div>(<div template="auto: cond"><content select=".left"></content></div>, <content></content>)</div>',
      directives: [AutoViewportDirective]
    })];
  }});
class OuterWithIndirectNestedComponent {}
Object.defineProperty(OuterWithIndirectNestedComponent, "annotations", {get: function() {
    return [new Component({selector: 'outer-with-indirect-nested'}), new Template({
      inline: 'OUTER(<simple><div><content></content></div></simple>)',
      directives: [Simple]
    })];
  }});
class OuterComponent {}
Object.defineProperty(OuterComponent, "annotations", {get: function() {
    return [new Component({selector: 'outer'}), new Template({
      inline: 'OUTER(<inner><content></content></inner>)',
      directives: [InnerComponent]
    })];
  }});
class InnerComponent {}
Object.defineProperty(InnerComponent, "annotations", {get: function() {
    return [new Component({selector: 'inner'}), new Template({
      inline: 'INNER(<innerinner><content></content></innerinner>)',
      directives: [InnerInnerComponent]
    })];
  }});
class InnerInnerComponent {}
Object.defineProperty(InnerInnerComponent, "annotations", {get: function() {
    return [new Component({selector: 'innerinner'}), new Template({inline: 'INNERINNER(<content select=".left"></content>,<content></content>)'})];
  }});
class MyComp {}
Object.defineProperty(MyComp, "annotations", {get: function() {
    return [new Component({selector: 'my-comp'}), new Template({directives: [MultipleContentTagsComponent, ManualViewportDirective, ConditionalContentComponent, OuterWithIndirectNestedComponent, OuterComponent]})];
  }});
function createView(pv) {
  var view = pv.instantiate(null, null);
  view.hydrate(new Injector([]), null, {});
  return view;
}

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/test/core/compiler/shadow_dom/shadow_dom_emulation_integration_spec.map

//# sourceMappingURL=./shadow_dom_emulation_integration_spec.map