import {assert} from "rtts_assert/rtts_assert";
import {Decorator} from '../../annotations/annotations';
import {SourceLightDom,
  DestinationLightDom,
  LightDom} from './light_dom';
import {Inject} from 'angular2/di';
import {Element,
  Node,
  DOM} from 'angular2/src/facade/dom';
import {isPresent} from 'angular2/src/facade/lang';
import {List,
  ListWrapper} from 'angular2/src/facade/collection';
import {NgElement} from 'angular2/src/core/dom/element';
var _scriptTemplate = DOM.createScriptTag('type', 'ng/content');
class ContentStrategy {
  insert(nodes) {
    assert.argumentTypes(nodes, assert.genericType(List, Node));
  }
}
Object.defineProperty(ContentStrategy.prototype.insert, "parameters", {get: function() {
    return [[assert.genericType(List, Node)]];
  }});
class RenderedContent extends ContentStrategy {
  constructor(contentEl) {
    assert.argumentTypes(contentEl, Element);
    super();
    this._replaceContentElementWithScriptTags(contentEl);
    this.nodes = [];
  }
  insert(nodes) {
    assert.argumentTypes(nodes, assert.genericType(List, Node));
    this.nodes = nodes;
    DOM.insertAllBefore(this.endScript, nodes);
    this._removeNodesUntil(ListWrapper.isEmpty(nodes) ? this.endScript : nodes[0]);
  }
  _replaceContentElementWithScriptTags(contentEl) {
    assert.argumentTypes(contentEl, Element);
    this.beginScript = DOM.clone(_scriptTemplate);
    this.endScript = DOM.clone(_scriptTemplate);
    DOM.insertBefore(contentEl, this.beginScript);
    DOM.insertBefore(contentEl, this.endScript);
    DOM.removeChild(DOM.parentElement(contentEl), contentEl);
  }
  _removeNodesUntil(node) {
    assert.argumentTypes(node, Node);
    var p = DOM.parentElement(this.beginScript);
    for (var next = DOM.nextSibling(this.beginScript); next !== node; next = DOM.nextSibling(this.beginScript)) {
      DOM.removeChild(p, next);
    }
  }
}
Object.defineProperty(RenderedContent, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(RenderedContent.prototype.insert, "parameters", {get: function() {
    return [[assert.genericType(List, Node)]];
  }});
Object.defineProperty(RenderedContent.prototype._replaceContentElementWithScriptTags, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(RenderedContent.prototype._removeNodesUntil, "parameters", {get: function() {
    return [[Node]];
  }});
class IntermediateContent extends ContentStrategy {
  constructor(destinationLightDom) {
    assert.argumentTypes(destinationLightDom, LightDom);
    super();
    this.destinationLightDom = destinationLightDom;
    this.nodes = [];
  }
  insert(nodes) {
    assert.argumentTypes(nodes, assert.genericType(List, Node));
    this.nodes = nodes;
    this.destinationLightDom.redistribute();
  }
}
Object.defineProperty(IntermediateContent, "parameters", {get: function() {
    return [[LightDom]];
  }});
Object.defineProperty(IntermediateContent.prototype.insert, "parameters", {get: function() {
    return [[assert.genericType(List, Node)]];
  }});
export class Content {
  constructor(destinationLightDom, contentEl) {
    assert.argumentTypes(destinationLightDom, assert.type.any, contentEl, NgElement);
    this.select = contentEl.getAttribute('select');
    this._strategy = isPresent(destinationLightDom) ? new IntermediateContent(destinationLightDom) : new RenderedContent(contentEl.domElement);
  }
  nodes() {
    return assert.returnType((this._strategy.nodes), assert.genericType(List, Node));
  }
  insert(nodes) {
    assert.argumentTypes(nodes, assert.genericType(List, Node));
    this._strategy.insert(nodes);
  }
}
Object.defineProperty(Content, "annotations", {get: function() {
    return [new Decorator({selector: 'content'})];
  }});
Object.defineProperty(Content, "parameters", {get: function() {
    return [[new Inject(DestinationLightDom)], [NgElement]];
  }});
Object.defineProperty(Content.prototype.insert, "parameters", {get: function() {
    return [[assert.genericType(List, Node)]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/compiler/shadow_dom_emulation/content_tag.map

//# sourceMappingURL=./content_tag.map