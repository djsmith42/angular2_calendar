import {assert} from "rtts_assert/rtts_assert";
import {Element,
  Node,
  DOM} from 'angular2/src/facade/dom';
import {List,
  ListWrapper} from 'angular2/src/facade/collection';
import {isBlank,
  isPresent} from 'angular2/src/facade/lang';
import {View} from '../view';
import {ElementInjector} from '../element_injector';
import {ViewContainer} from '../view_container';
import {Content} from './content_tag';
export class SourceLightDom {}
export class DestinationLightDom {}
class _Root {
  constructor(node, injector) {
    this.node = node;
    this.injector = injector;
  }
}
export class LightDom {
  constructor(lightDomView, shadowDomView, element) {
    assert.argumentTypes(lightDomView, View, shadowDomView, View, element, Element);
    this.lightDomView = lightDomView;
    this.shadowDomView = shadowDomView;
    this.nodes = DOM.childNodesAsList(element);
    this.roots = null;
  }
  redistribute() {
    var tags = this.contentTags();
    if (tags.length > 0) {
      redistributeNodes(tags, this.expandedDomNodes());
    }
  }
  contentTags() {
    return assert.returnType((this._collectAllContentTags(this.shadowDomView, [])), assert.genericType(List, Content));
  }
  _collectAllContentTags(view, acc) {
    assert.argumentTypes(view, View, acc, assert.genericType(List, Content));
    var eis = view.elementInjectors;
    for (var i = 0; i < eis.length; ++i) {
      var ei = eis[i];
      if (isBlank(ei))
        continue;
      if (ei.hasDirective(Content)) {
        ListWrapper.push(acc, ei.get(Content));
      } else if (ei.hasPreBuiltObject(ViewContainer)) {
        var vc = ei.get(ViewContainer);
        ListWrapper.forEach(vc.contentTagContainers(), (view) => {
          this._collectAllContentTags(view, acc);
        });
      }
    }
    return assert.returnType((acc), assert.genericType(List, Content));
  }
  expandedDomNodes() {
    var res = [];
    var roots = this._roots();
    for (var i = 0; i < roots.length; ++i) {
      var root = roots[i];
      var ei = root.injector;
      if (isPresent(ei) && ei.hasPreBuiltObject(ViewContainer)) {
        var vc = root.injector.get(ViewContainer);
        res = ListWrapper.concat(res, vc.nodes());
      } else if (isPresent(ei) && ei.hasDirective(Content)) {
        var content = root.injector.get(Content);
        res = ListWrapper.concat(res, content.nodes());
      } else {
        ListWrapper.push(res, root.node);
      }
    }
    return assert.returnType((res), List);
  }
  _roots() {
    if (isPresent(this.roots))
      return this.roots;
    var viewInj = this.lightDomView.elementInjectors;
    this.roots = ListWrapper.map(this.nodes, (n) => new _Root(n, ListWrapper.find(viewInj, (inj) => isPresent(inj) ? inj.forElement(n) : false)));
    return this.roots;
  }
}
Object.defineProperty(LightDom, "parameters", {get: function() {
    return [[View], [View], [Element]];
  }});
Object.defineProperty(LightDom.prototype._collectAllContentTags, "parameters", {get: function() {
    return [[View], [assert.genericType(List, Content)]];
  }});
function redistributeNodes(contents, nodes) {
  for (var i = 0; i < contents.length; ++i) {
    var content = contents[i];
    var select = content.select;
    var matchSelector = (n) => DOM.elementMatches(n, select);
    if (isBlank(select)) {
      content.insert(nodes);
      ListWrapper.clear(nodes);
    } else {
      var matchingNodes = ListWrapper.filter(nodes, matchSelector);
      content.insert(matchingNodes);
      ListWrapper.removeAll(nodes, matchingNodes);
    }
  }
}
Object.defineProperty(redistributeNodes, "parameters", {get: function() {
    return [[assert.genericType(List, Content)], [assert.genericType(List, Node)]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/compiler/shadow_dom_emulation/light_dom.map

//# sourceMappingURL=./light_dom.map