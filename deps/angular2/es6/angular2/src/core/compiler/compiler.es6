import {assert} from "rtts_assert/rtts_assert";
import {Type,
  isBlank,
  isPresent,
  BaseException,
  normalizeBlank,
  stringify} from 'angular2/src/facade/lang';
import {Promise,
  PromiseWrapper} from 'angular2/src/facade/async';
import {List,
  ListWrapper,
  Map,
  MapWrapper} from 'angular2/src/facade/collection';
import {DOM,
  Element} from 'angular2/src/facade/dom';
import {ChangeDetection,
  Parser} from 'angular2/change_detection';
import {DirectiveMetadataReader} from './directive_metadata_reader';
import {ProtoView} from './view';
import {CompilePipeline} from './pipeline/compile_pipeline';
import {CompileElement} from './pipeline/compile_element';
import {createDefaultSteps} from './pipeline/default_steps';
import {TemplateLoader} from './template_loader';
import {TemplateResolver} from './template_resolver';
import {DirectiveMetadata} from './directive_metadata';
import {Template} from '../annotations/template';
import {ShadowDomStrategy} from './shadow_dom_strategy';
import {CompileStep} from './pipeline/compile_step';
export class CompilerCache {
  constructor() {
    this._cache = MapWrapper.create();
  }
  set(component, protoView) {
    assert.argumentTypes(component, Type, protoView, ProtoView);
    MapWrapper.set(this._cache, component, protoView);
  }
  get(component) {
    assert.argumentTypes(component, Type);
    var result = MapWrapper.get(this._cache, component);
    return assert.returnType((normalizeBlank(result)), ProtoView);
  }
  clear() {
    MapWrapper.clear(this._cache);
  }
}
Object.defineProperty(CompilerCache.prototype.set, "parameters", {get: function() {
    return [[Type], [ProtoView]];
  }});
Object.defineProperty(CompilerCache.prototype.get, "parameters", {get: function() {
    return [[Type]];
  }});
export class Compiler {
  constructor(changeDetection, templateLoader, reader, parser, cache, shadowDomStrategy, templateResolver) {
    assert.argumentTypes(changeDetection, ChangeDetection, templateLoader, TemplateLoader, reader, DirectiveMetadataReader, parser, Parser, cache, CompilerCache, shadowDomStrategy, ShadowDomStrategy, templateResolver, TemplateResolver);
    this._changeDetection = changeDetection;
    this._reader = reader;
    this._parser = parser;
    this._compilerCache = cache;
    this._templateLoader = templateLoader;
    this._compiling = MapWrapper.create();
    this._shadowDomStrategy = shadowDomStrategy;
    this._shadowDomDirectives = [];
    var types = shadowDomStrategy.polyfillDirectives();
    for (var i = 0; i < types.length; i++) {
      ListWrapper.push(this._shadowDomDirectives, reader.read(types[i]));
    }
    this._templateResolver = templateResolver;
  }
  createSteps(component, template) {
    var dirMetadata = [];
    var tplMetadata = ListWrapper.map(this._flattenDirectives(template), (d) => this._reader.read(d));
    dirMetadata = ListWrapper.concat(dirMetadata, tplMetadata);
    dirMetadata = ListWrapper.concat(dirMetadata, this._shadowDomDirectives);
    var cmpMetadata = this._reader.read(component);
    return assert.returnType((createDefaultSteps(this._changeDetection, this._parser, cmpMetadata, dirMetadata, this._shadowDomStrategy)), assert.genericType(List, CompileStep));
  }
  compile(component) {
    assert.argumentTypes(component, Type);
    var protoView = this._compile(component);
    return assert.returnType((PromiseWrapper.isPromise(protoView) ? protoView : PromiseWrapper.resolve(protoView)), assert.genericType(Promise, ProtoView));
  }
  _compile(component) {
    var protoView = this._compilerCache.get(component);
    if (isPresent(protoView)) {
      return protoView;
    }
    var pvPromise = MapWrapper.get(this._compiling, component);
    if (isPresent(pvPromise)) {
      return pvPromise;
    }
    var template = this._templateResolver.resolve(component);
    var tplElement = this._templateLoader.load(template);
    if (PromiseWrapper.isPromise(tplElement)) {
      pvPromise = PromiseWrapper.then(tplElement, (el) => this._compileTemplate(template, el, component), (_) => {
        throw new BaseException(`Failed to load the template for ${stringify(component)}`);
      });
      MapWrapper.set(this._compiling, component, pvPromise);
      return pvPromise;
    }
    return this._compileTemplate(template, tplElement, component);
  }
  _compileTemplate(template, tplElement, component) {
    var pipeline = new CompilePipeline(this.createSteps(component, template));
    var compileElements = pipeline.process(tplElement);
    var protoView = compileElements[0].inheritedProtoView;
    this._compilerCache.set(component, protoView);
    MapWrapper.delete(this._compiling, component);
    var nestedPVPromises = [];
    for (var i = 0; i < compileElements.length; i++) {
      var ce = compileElements[i];
      if (isPresent(ce.componentDirective)) {
        this._compileNestedProtoView(ce, nestedPVPromises);
      }
    }
    if (nestedPVPromises.length > 0) {
      return PromiseWrapper.then(PromiseWrapper.all(nestedPVPromises), (_) => protoView, (e) => {
        throw new BaseException(`${e.message} -> Failed to compile ${stringify(component)}`);
      });
    }
    return protoView;
  }
  _compileNestedProtoView(ce, promises) {
    assert.argumentTypes(ce, CompileElement, promises, assert.genericType(List, Promise));
    var protoView = this._compile(ce.componentDirective.type);
    if (PromiseWrapper.isPromise(protoView)) {
      ListWrapper.push(promises, protoView);
      protoView.then(function(protoView) {
        ce.inheritedElementBinder.nestedProtoView = protoView;
      });
    } else {
      ce.inheritedElementBinder.nestedProtoView = protoView;
    }
  }
  _flattenDirectives(template) {
    assert.argumentTypes(template, Template);
    if (isBlank(template.directives))
      return assert.returnType(([]), assert.genericType(List, Type));
    var directives = [];
    this._flattenList(template.directives, directives);
    return assert.returnType((directives), assert.genericType(List, Type));
  }
  _flattenList(tree, out) {
    assert.argumentTypes(tree, assert.genericType(List, assert.type.any), out, assert.genericType(List, Type));
    for (var i = 0; i < tree.length; i++) {
      var item = tree[i];
      if (ListWrapper.isList(item)) {
        this._flattenList(item, out);
      } else {
        ListWrapper.push(out, item);
      }
    }
  }
}
Object.defineProperty(Compiler, "parameters", {get: function() {
    return [[ChangeDetection], [TemplateLoader], [DirectiveMetadataReader], [Parser], [CompilerCache], [ShadowDomStrategy], [TemplateResolver]];
  }});
Object.defineProperty(Compiler.prototype.createSteps, "parameters", {get: function() {
    return [[Type], [Template]];
  }});
Object.defineProperty(Compiler.prototype.compile, "parameters", {get: function() {
    return [[Type]];
  }});
Object.defineProperty(Compiler.prototype._compile, "parameters", {get: function() {
    return [[Type]];
  }});
Object.defineProperty(Compiler.prototype._compileTemplate, "parameters", {get: function() {
    return [[Template], [Element], [Type]];
  }});
Object.defineProperty(Compiler.prototype._compileNestedProtoView, "parameters", {get: function() {
    return [[CompileElement], [assert.genericType(List, Promise)]];
  }});
Object.defineProperty(Compiler.prototype._flattenDirectives, "parameters", {get: function() {
    return [[Template]];
  }});
Object.defineProperty(Compiler.prototype._flattenList, "parameters", {get: function() {
    return [[assert.genericType(List, assert.type.any)], [assert.genericType(List, Type)]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/compiler/compiler.map

//# sourceMappingURL=./compiler.map