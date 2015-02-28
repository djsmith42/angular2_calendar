import {assert} from "rtts_assert/rtts_assert";
import {ChangeDetection,
  Parser} from 'angular2/change_detection';
import {List,
  ListWrapper} from 'angular2/src/facade/collection';
import {PropertyBindingParser} from './property_binding_parser';
import {TextInterpolationParser} from './text_interpolation_parser';
import {DirectiveParser} from './directive_parser';
import {ViewSplitter} from './view_splitter';
import {ElementBindingMarker} from './element_binding_marker';
import {ProtoViewBuilder} from './proto_view_builder';
import {ProtoElementInjectorBuilder} from './proto_element_injector_builder';
import {ElementBinderBuilder} from './element_binder_builder';
import {ShimShadowCss} from './shim_shadow_css';
import {ShimShadowDom} from './shim_shadow_dom';
import {DirectiveMetadata} from 'angular2/src/core/compiler/directive_metadata';
import {ShadowDomStrategy,
  EmulatedShadowDomStrategy} from 'angular2/src/core/compiler/shadow_dom_strategy';
import {stringify} from 'angular2/src/facade/lang';
import {DOM} from 'angular2/src/facade/dom';
export function createDefaultSteps(changeDetection, parser, compiledComponent, directives, shadowDomStrategy) {
  assert.argumentTypes(changeDetection, ChangeDetection, parser, Parser, compiledComponent, DirectiveMetadata, directives, assert.genericType(List, DirectiveMetadata), shadowDomStrategy, ShadowDomStrategy);
  var compilationUnit = stringify(compiledComponent.type);
  var steps = [new ViewSplitter(parser, compilationUnit)];
  if (shadowDomStrategy instanceof EmulatedShadowDomStrategy) {
    var step = new ShimShadowCss(compiledComponent, shadowDomStrategy, DOM.defaultDoc().head);
    ListWrapper.push(steps, step);
  }
  steps = ListWrapper.concat(steps, [new PropertyBindingParser(parser, compilationUnit), new DirectiveParser(directives), new TextInterpolationParser(parser, compilationUnit), new ElementBindingMarker(), new ProtoViewBuilder(changeDetection, shadowDomStrategy), new ProtoElementInjectorBuilder(), new ElementBinderBuilder(parser, compilationUnit)]);
  if (shadowDomStrategy instanceof EmulatedShadowDomStrategy) {
    var step = new ShimShadowDom(compiledComponent, shadowDomStrategy);
    ListWrapper.push(steps, step);
  }
  return steps;
}
Object.defineProperty(createDefaultSteps, "parameters", {get: function() {
    return [[ChangeDetection], [Parser], [DirectiveMetadata], [assert.genericType(List, DirectiveMetadata)], [ShadowDomStrategy]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/compiler/pipeline/default_steps.map

//# sourceMappingURL=./default_steps.map