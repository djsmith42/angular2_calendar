import {assert} from "rtts_assert/rtts_assert";
import {describe,
  beforeEach,
  it,
  expect,
  iit,
  ddescribe,
  el} from 'angular2/test_lib';
import {isPresent} from 'angular2/src/facade/lang';
import {ListWrapper,
  MapWrapper,
  StringMapWrapper} from 'angular2/src/facade/collection';
import {DirectiveParser} from 'angular2/src/core/compiler/pipeline/directive_parser';
import {CompilePipeline} from 'angular2/src/core/compiler/pipeline/compile_pipeline';
import {CompileStep} from 'angular2/src/core/compiler/pipeline/compile_step';
import {CompileElement} from 'angular2/src/core/compiler/pipeline/compile_element';
import {CompileControl} from 'angular2/src/core/compiler/pipeline/compile_control';
import {Component,
  Decorator,
  Viewport} from 'angular2/src/core/annotations/annotations';
import {Template} from 'angular2/src/core/annotations/template';
import {DirectiveMetadataReader} from 'angular2/src/core/compiler/directive_metadata_reader';
import {Lexer,
  Parser} from 'angular2/change_detection';
export function main() {
  describe('DirectiveParser', () => {
    var reader,
        directives;
    beforeEach(() => {
      reader = new DirectiveMetadataReader();
      directives = [SomeDecorator, SomeDecoratorIgnoringChildren, SomeDecoratorWithBinding, SomeViewport, SomeViewport2, SomeComponent, SomeComponent2];
    });
    function createPipeline({propertyBindings,
      variableBindings} = {}) {
      var parser = new Parser(new Lexer());
      var annotatedDirectives = ListWrapper.create();
      for (var i = 0; i < directives.length; i++) {
        ListWrapper.push(annotatedDirectives, reader.read(directives[i]));
      }
      return new CompilePipeline([new MockStep((parent, current, control) => {
        if (isPresent(propertyBindings)) {
          StringMapWrapper.forEach(propertyBindings, (v, k) => {
            current.addPropertyBinding(k, parser.parseBinding(v, null));
          });
        }
        if (isPresent(variableBindings)) {
          current.variableBindings = MapWrapper.createFromStringMap(variableBindings);
        }
      }), new DirectiveParser(annotatedDirectives)]);
    }
    it('should not add directives if they are not used', () => {
      var results = createPipeline().process(el('<div></div>'));
      expect(results[0].decoratorDirectives).toBe(null);
      expect(results[0].componentDirective).toBe(null);
      expect(results[0].viewportDirective).toBe(null);
    });
    describe('component directives', () => {
      it('should detect them in attributes', () => {
        var results = createPipeline().process(el('<div some-comp></div>'));
        expect(results[0].componentDirective).toEqual(reader.read(SomeComponent));
      });
      it('component directives must be first in collected directives', () => {
        var results = createPipeline().process(el('<div some-comp some-decor></div>'));
        var dirs = results[0].getAllDirectives();
        expect(dirs.length).toEqual(2);
        expect(dirs[0]).toEqual(reader.read(SomeComponent));
        expect(dirs[1]).toEqual(reader.read(SomeDecorator));
      });
      it('should detect them in property bindings', () => {
        var pipeline = createPipeline({propertyBindings: {'some-comp': 'someExpr'}});
        var results = pipeline.process(el('<div></div>'));
        expect(results[0].componentDirective).toEqual(reader.read(SomeComponent));
      });
      it('should detect them in variable bindings', () => {
        var pipeline = createPipeline({variableBindings: {'some-comp': 'someExpr'}});
        var results = pipeline.process(el('<div></div>'));
        expect(results[0].componentDirective).toEqual(reader.read(SomeComponent));
      });
      it('should not allow multiple component directives on the same element', () => {
        expect(() => {
          createPipeline().process(el('<div some-comp some-comp2></div>'));
        }).toThrowError('Only one component directive per element is allowed!');
      });
      it('should not allow component directives on <template> elements', () => {
        expect(() => {
          createPipeline().process(el('<template some-comp></template>'));
        }).toThrowError('Only template directives are allowed on <template> elements!');
      });
    });
    describe('viewport directives', () => {
      it('should detect them in attributes', () => {
        var results = createPipeline().process(el('<template some-templ></template>'));
        expect(results[0].viewportDirective).toEqual(reader.read(SomeViewport));
      });
      it('should detect them in property bindings', () => {
        var pipeline = createPipeline({propertyBindings: {'some-templ': 'someExpr'}});
        var results = pipeline.process(el('<template></template>'));
        expect(results[0].viewportDirective).toEqual(reader.read(SomeViewport));
      });
      it('should detect them in variable bindings', () => {
        var pipeline = createPipeline({variableBindings: {'some-templ': 'someExpr'}});
        var results = pipeline.process(el('<template></template>'));
        expect(results[0].viewportDirective).toEqual(reader.read(SomeViewport));
      });
      it('should not allow multiple viewport directives on the same element', () => {
        expect(() => {
          createPipeline().process(el('<template some-templ some-templ2></template>'));
        }).toThrowError('Only one template directive per element is allowed!');
      });
      it('should not allow viewport directives on non <template> elements', () => {
        expect(() => {
          createPipeline().process(el('<div some-templ></div>'));
        }).toThrowError('Viewport directives need to be placed on <template> elements or elements with template attribute!');
      });
    });
    describe('decorator directives', () => {
      it('should detect them in attributes', () => {
        var results = createPipeline().process(el('<div some-decor></div>'));
        expect(results[0].decoratorDirectives).toEqual([reader.read(SomeDecorator)]);
      });
      it('should detect them in property bindings', () => {
        var pipeline = createPipeline({propertyBindings: {'some-decor': 'someExpr'}});
        var results = pipeline.process(el('<div></div>'));
        expect(results[0].decoratorDirectives).toEqual([reader.read(SomeDecorator)]);
      });
      it('should compile children by default', () => {
        var results = createPipeline().process(el('<div some-decor></div>'));
        expect(results[0].compileChildren).toEqual(true);
      });
      it('should stop compiling children when specified in the decorator config', () => {
        var results = createPipeline().process(el('<div some-decor-ignoring-children></div>'));
        expect(results[0].compileChildren).toEqual(false);
      });
      it('should detect them in variable bindings', () => {
        var pipeline = createPipeline({variableBindings: {'some-decor': 'someExpr'}});
        var results = pipeline.process(el('<div></div>'));
        expect(results[0].decoratorDirectives).toEqual([reader.read(SomeDecorator)]);
      });
      it('should not allow decorator directives on <template> elements', () => {
        expect(() => {
          createPipeline().process(el('<template some-decor></template>'));
        }).toThrowError('Only template directives are allowed on <template> elements!');
      });
      it('should not instantiate decorator directive twice', () => {
        var pipeline = createPipeline({propertyBindings: {'some-decor-with-binding': 'someExpr'}});
        var results = pipeline.process(el('<div some-decor-with-binding="foo"></div>'));
        expect(results[0].decoratorDirectives.length).toEqual(1);
        expect(results[0].decoratorDirectives).toEqual([reader.read(SomeDecoratorWithBinding)]);
      });
    });
  });
}
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
class SomeDecorator {}
Object.defineProperty(SomeDecorator, "annotations", {get: function() {
    return [new Decorator({selector: '[some-decor]'})];
  }});
class SomeDecoratorIgnoringChildren {}
Object.defineProperty(SomeDecoratorIgnoringChildren, "annotations", {get: function() {
    return [new Decorator({
      selector: '[some-decor-ignoring-children]',
      compileChildren: false
    })];
  }});
class SomeDecoratorWithBinding {}
Object.defineProperty(SomeDecoratorWithBinding, "annotations", {get: function() {
    return [new Decorator({
      selector: '[some-decor-with-binding]',
      bind: {'some-decor-with-binding': 'foo'}
    })];
  }});
class SomeViewport {}
Object.defineProperty(SomeViewport, "annotations", {get: function() {
    return [new Viewport({selector: '[some-templ]'})];
  }});
class SomeViewport2 {}
Object.defineProperty(SomeViewport2, "annotations", {get: function() {
    return [new Viewport({selector: '[some-templ2]'})];
  }});
class SomeComponent {}
Object.defineProperty(SomeComponent, "annotations", {get: function() {
    return [new Component({selector: '[some-comp]'})];
  }});
class SomeComponent2 {}
Object.defineProperty(SomeComponent2, "annotations", {get: function() {
    return [new Component({selector: '[some-comp2]'})];
  }});
class MyComp {}
Object.defineProperty(MyComp, "annotations", {get: function() {
    return [new Component(), new Template({directives: [SomeDecorator, SomeViewport, SomeViewport2, SomeComponent, SomeComponent2]})];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/test/core/compiler/pipeline/directive_parser_spec.map

//# sourceMappingURL=./directive_parser_spec.map