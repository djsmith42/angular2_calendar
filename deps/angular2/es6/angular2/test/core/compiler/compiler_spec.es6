import {assert} from "rtts_assert/rtts_assert";
import {describe,
  beforeEach,
  it,
  expect,
  ddescribe,
  iit,
  el,
  IS_DARTIUM} from 'angular2/test_lib';
import {DOM,
  Element,
  TemplateElement} from 'angular2/src/facade/dom';
import {List,
  ListWrapper,
  Map,
  MapWrapper,
  StringMapWrapper} from 'angular2/src/facade/collection';
import {Type,
  isBlank,
  stringify,
  isPresent} from 'angular2/src/facade/lang';
import {PromiseWrapper} from 'angular2/src/facade/async';
import {Compiler,
  CompilerCache} from 'angular2/src/core/compiler/compiler';
import {ProtoView} from 'angular2/src/core/compiler/view';
import {DirectiveMetadataReader} from 'angular2/src/core/compiler/directive_metadata_reader';
import {Component} from 'angular2/src/core/annotations/annotations';
import {Template} from 'angular2/src/core/annotations/template';
import {CompileElement} from 'angular2/src/core/compiler/pipeline/compile_element';
import {CompileStep} from 'angular2/src/core/compiler/pipeline/compile_step';
import {CompileControl} from 'angular2/src/core/compiler/pipeline/compile_control';
import {TemplateLoader} from 'angular2/src/core/compiler/template_loader';
import {TemplateResolver} from 'angular2/src/core/compiler/template_resolver';
import {Lexer,
  Parser,
  dynamicChangeDetection} from 'angular2/change_detection';
import {ShadowDomStrategy,
  NativeShadowDomStrategy} from 'angular2/src/core/compiler/shadow_dom_strategy';
export function main() {
  describe('compiler', function() {
    StringMapWrapper.forEach({
      '(sync TemplateLoader)': true,
      '(async TemplateLoader)': false
    }, (sync, name) => {
      var reader,
          tplResolver;
      beforeEach(() => {
        reader = new DirectiveMetadataReader();
        tplResolver = new FakeTemplateResolver();
        if (sync) {
          tplResolver.forceSync();
        } else {
          tplResolver.forceAsync();
        }
      });
      describe(name, () => {
        function createCompiler(processClosure) {
          var steps = [new MockStep(processClosure)];
          return new TestableCompiler(reader, steps, new FakeTemplateLoader(), tplResolver);
        }
        it('should run the steps and return the ProtoView of the root element', (done) => {
          var rootProtoView = new ProtoView(null, null, null);
          var compiler = createCompiler((parent, current, control) => {
            current.inheritedProtoView = rootProtoView;
          });
          tplResolver.setTemplate(MainComponent, new Template({inline: '<div></div>'}));
          compiler.compile(MainComponent).then((protoView) => {
            expect(protoView).toBe(rootProtoView);
            done();
          });
        });
        it('should use the inline template', (done) => {
          var compiler = createCompiler((parent, current, control) => {
            current.inheritedProtoView = new ProtoView(current.element, null, null);
          });
          compiler.compile(MainComponent).then((protoView) => {
            expect(DOM.getInnerHTML(protoView.element)).toEqual('inline component');
            done();
          });
        });
        it('should load nested components', (done) => {
          var compiler = createCompiler((parent, current, control) => {
            if (DOM.hasClass(current.element, 'nested')) {
              current.componentDirective = reader.read(NestedComponent);
              current.inheritedProtoView = parent.inheritedProtoView;
              current.inheritedElementBinder = current.inheritedProtoView.bindElement(null);
            } else {
              current.inheritedProtoView = new ProtoView(current.element, null, null);
            }
          });
          tplResolver.setTemplate(MainComponent, new Template({inline: '<div class="nested"></div>'}));
          compiler.compile(MainComponent).then((protoView) => {
            var nestedView = protoView.elementBinders[0].nestedProtoView;
            expect(DOM.getInnerHTML(nestedView.element)).toEqual('nested component');
            done();
          });
        });
        it('should cache compiled components', (done) => {
          var compiler = createCompiler((parent, current, control) => {
            current.inheritedProtoView = new ProtoView(current.element, null, null);
          });
          var firstProtoView;
          tplResolver.setTemplate(MainComponent, new Template({inline: '<div></div>'}));
          compiler.compile(MainComponent).then((protoView) => {
            firstProtoView = protoView;
            return compiler.compile(MainComponent);
          }).then((protoView) => {
            expect(firstProtoView).toBe(protoView);
            done();
          });
        });
        it('should re-use components being compiled', (done) => {
          var nestedElBinders = [];
          var compiler = createCompiler((parent, current, control) => {
            if (DOM.hasClass(current.element, 'nested')) {
              current.inheritedProtoView = new ProtoView(current.element, null, null);
              current.inheritedElementBinder = current.inheritedProtoView.bindElement(null);
              current.componentDirective = reader.read(NestedComponent);
              ListWrapper.push(nestedElBinders, current.inheritedElementBinder);
            }
          });
          tplResolver.setTemplate(MainComponent, new Template({inline: '<div><div class="nested"></div><div class="nested"></div></div>'}));
          compiler.compile(MainComponent).then((protoView) => {
            expect(nestedElBinders[0].nestedProtoView).toBe(nestedElBinders[1].nestedProtoView);
            done();
          });
        });
        it('should allow recursive components', (done) => {
          var compiler = createCompiler((parent, current, control) => {
            current.inheritedProtoView = new ProtoView(current.element, null, null);
            current.inheritedElementBinder = current.inheritedProtoView.bindElement(null);
            current.componentDirective = reader.read(RecursiveComponent);
          });
          compiler.compile(RecursiveComponent).then((protoView) => {
            expect(protoView.elementBinders[0].nestedProtoView).toBe(protoView);
            done();
          });
        });
      });
    });
    describe('(mixed async, sync TemplateLoader)', () => {
      var reader = new DirectiveMetadataReader();
      function createCompiler(processClosure, resolver) {
        assert.argumentTypes(processClosure, assert.type.any, resolver, TemplateResolver);
        var steps = [new MockStep(processClosure)];
        return new TestableCompiler(reader, steps, new FakeTemplateLoader(), resolver);
      }
      Object.defineProperty(createCompiler, "parameters", {get: function() {
          return [[], [TemplateResolver]];
        }});
      function createNestedComponentSpec(name, resolver, error = null) {
        assert.argumentTypes(name, assert.type.any, resolver, TemplateResolver, error, assert.type.string);
        it(`should load nested components ${name}`, (done) => {
          var compiler = createCompiler((parent, current, control) => {
            if (DOM.hasClass(current.element, 'parent')) {
              current.componentDirective = reader.read(NestedComponent);
              current.inheritedProtoView = parent.inheritedProtoView;
              current.inheritedElementBinder = current.inheritedProtoView.bindElement(null);
            } else {
              current.inheritedProtoView = new ProtoView(current.element, null, null);
            }
          }, resolver);
          PromiseWrapper.then(compiler.compile(ParentComponent), function(protoView) {
            var nestedView = protoView.elementBinders[0].nestedProtoView;
            expect(error).toBeNull();
            expect(DOM.getInnerHTML(nestedView.element)).toEqual('nested component');
            done();
          }, function(compileError) {
            expect(compileError.message).toEqual(error);
            done();
          });
        });
      }
      Object.defineProperty(createNestedComponentSpec, "parameters", {get: function() {
          return [[], [TemplateResolver], [assert.type.string]];
        }});
      var resolver = new FakeTemplateResolver();
      resolver.setSync(ParentComponent);
      resolver.setSync(NestedComponent);
      createNestedComponentSpec('(sync -> sync)', resolver);
      resolver = new FakeTemplateResolver();
      resolver.setAsync(ParentComponent);
      resolver.setSync(NestedComponent);
      createNestedComponentSpec('(async -> sync)', resolver);
      resolver = new FakeTemplateResolver();
      resolver.setSync(ParentComponent);
      resolver.setAsync(NestedComponent);
      createNestedComponentSpec('(sync -> async)', resolver);
      resolver = new FakeTemplateResolver();
      resolver.setAsync(ParentComponent);
      resolver.setAsync(NestedComponent);
      createNestedComponentSpec('(async -> async)', resolver);
      resolver = new FakeTemplateResolver();
      resolver.setError(ParentComponent);
      resolver.setSync(NestedComponent);
      createNestedComponentSpec('(error -> sync)', resolver, 'Failed to load the template for ParentComponent');
    });
  });
}
class ParentComponent {}
Object.defineProperty(ParentComponent, "annotations", {get: function() {
    return [new Component(), new Template({inline: '<div class="parent"></div>'})];
  }});
class MainComponent {}
Object.defineProperty(MainComponent, "annotations", {get: function() {
    return [new Component(), new Template({inline: 'inline component'})];
  }});
class NestedComponent {}
Object.defineProperty(NestedComponent, "annotations", {get: function() {
    return [new Component(), new Template({inline: 'nested component'})];
  }});
class RecursiveComponent {}
Object.defineProperty(RecursiveComponent, "annotations", {get: function() {
    return [new Component({selector: 'rec-comp'}), new Template({inline: '<div rec-comp></div>'})];
  }});
class TestableCompiler extends Compiler {
  constructor(reader, steps, loader, resolver) {
    assert.argumentTypes(reader, DirectiveMetadataReader, steps, assert.genericType(List, CompileStep), loader, TemplateLoader, resolver, TemplateResolver);
    super(dynamicChangeDetection, loader, reader, new Parser(new Lexer()), new CompilerCache(), new NativeShadowDomStrategy(), resolver);
    this.steps = steps;
  }
  createSteps(component, template) {
    assert.argumentTypes(component, Type, template, Template);
    return assert.returnType((this.steps), assert.genericType(List, CompileStep));
  }
}
Object.defineProperty(TestableCompiler, "parameters", {get: function() {
    return [[DirectiveMetadataReader], [assert.genericType(List, CompileStep)], [TemplateLoader], [TemplateResolver]];
  }});
Object.defineProperty(TestableCompiler.prototype.createSteps, "parameters", {get: function() {
    return [[Type], [Template]];
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
class FakeTemplateLoader extends TemplateLoader {
  constructor() {
    super(null);
  }
  load(template) {
    assert.argumentTypes(template, Template);
    if (isPresent(template.inline)) {
      return DOM.createTemplate(template.inline);
    }
    if (isPresent(template.url)) {
      var tplElement = DOM.createTemplate(template.url);
      return PromiseWrapper.resolve(tplElement);
    }
    return PromiseWrapper.reject('Fail to load');
  }
}
Object.defineProperty(FakeTemplateLoader.prototype.load, "parameters", {get: function() {
    return [[Template]];
  }});
class FakeTemplateResolver extends TemplateResolver {
  constructor() {
    super();
    this._forceSync = false;
    this._forceAsync = false;
    this._syncCmp = [];
    this._asyncCmp = [];
    this._errorCmp = [];
    this._cmpTemplates = MapWrapper.create();
  }
  resolve(component) {
    assert.argumentTypes(component, Type);
    var template = MapWrapper.get(this._cmpTemplates, component);
    if (isBlank(template)) {
      template = super.resolve(component);
    }
    var html = template.inline;
    if (isBlank(template.inline)) {
      throw 'The tested component must define an inline template';
    }
    if (ListWrapper.contains(this._errorCmp, component)) {
      return assert.returnType((new Template({
        url: null,
        inline: null
      })), Template);
    }
    if (ListWrapper.contains(this._syncCmp, component)) {
      return assert.returnType((new Template({inline: html})), Template);
    }
    if (ListWrapper.contains(this._asyncCmp, component)) {
      return assert.returnType((new Template({url: html})), Template);
    }
    if (this._forceSync)
      return assert.returnType((new Template({inline: html})), Template);
    if (this._forceAsync)
      return assert.returnType((new Template({url: html})), Template);
    throw 'No template';
  }
  forceSync() {
    this._forceSync = true;
    this._forceAsync = false;
  }
  forceAsync() {
    this._forceAsync = true;
    this._forceSync = false;
  }
  setSync(component) {
    assert.argumentTypes(component, Type);
    ListWrapper.push(this._syncCmp, component);
  }
  setAsync(component) {
    assert.argumentTypes(component, Type);
    ListWrapper.push(this._asyncCmp, component);
  }
  setError(component) {
    assert.argumentTypes(component, Type);
    ListWrapper.push(this._errorCmp, component);
  }
  setTemplate(component, template) {
    assert.argumentTypes(component, Type, template, Template);
    MapWrapper.set(this._cmpTemplates, component, template);
  }
}
Object.defineProperty(FakeTemplateResolver.prototype.resolve, "parameters", {get: function() {
    return [[Type]];
  }});
Object.defineProperty(FakeTemplateResolver.prototype.setSync, "parameters", {get: function() {
    return [[Type]];
  }});
Object.defineProperty(FakeTemplateResolver.prototype.setAsync, "parameters", {get: function() {
    return [[Type]];
  }});
Object.defineProperty(FakeTemplateResolver.prototype.setError, "parameters", {get: function() {
    return [[Type]];
  }});
Object.defineProperty(FakeTemplateResolver.prototype.setTemplate, "parameters", {get: function() {
    return [[Type], [Template]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/test/core/compiler/compiler_spec.map

//# sourceMappingURL=./compiler_spec.map