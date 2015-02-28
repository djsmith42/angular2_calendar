import {assert} from "rtts_assert/rtts_assert";
import {List,
  MapWrapper,
  ListWrapper} from 'angular2/src/facade/collection';
export var window = frames.window;
export var DocumentFragment = window.DocumentFragment;
export var Node = window.Node;
export var NodeList = window.NodeList;
export var Text = window.Text;
export var Element = window.HTMLElement;
export var TemplateElement = window.HTMLTemplateElement;
export var StyleElement = window.HTMLStyleElement;
export var document = window.document;
export var location = window.location;
export var gc = window.gc ? () => window.gc() : () => null;
export var CssRule = window.CSSRule;
export var CssKeyframesRule = window.CSSKeyframesRule;
export class DOM {
  static query(selector) {
    return document.querySelector(selector);
  }
  static querySelector(el, selector) {
    assert.argumentTypes(el, assert.type.any, selector, assert.type.string);
    return assert.returnType((el.querySelector(selector)), Node);
  }
  static querySelectorAll(el, selector) {
    assert.argumentTypes(el, assert.type.any, selector, assert.type.string);
    return assert.returnType((el.querySelectorAll(selector)), NodeList);
  }
  static on(el, evt, listener) {
    el.addEventListener(evt, listener, false);
  }
  static dispatchEvent(el, evt) {
    el.dispatchEvent(evt);
  }
  static createMouseEvent(eventType) {
    var evt = new MouseEvent(eventType);
    evt.initEvent(eventType, true, true);
    return evt;
  }
  static createEvent(eventType) {
    return new Event(eventType, true);
  }
  static getInnerHTML(el) {
    return el.innerHTML;
  }
  static getOuterHTML(el) {
    return el.outerHTML;
  }
  static nodeName(node) {
    assert.argumentTypes(node, Node);
    return assert.returnType((node.nodeName), assert.type.string);
  }
  static nodeValue(node) {
    assert.argumentTypes(node, Node);
    return assert.returnType((node.nodeValue), assert.type.string);
  }
  static type(node) {
    assert.argumentTypes(node, Element);
    return assert.returnType((node.type), assert.type.string);
  }
  static content(node) {
    assert.argumentTypes(node, TemplateElement);
    return assert.returnType((node.content), Node);
  }
  static firstChild(el) {
    return assert.returnType((el.firstChild), Node);
  }
  static nextSibling(el) {
    return assert.returnType((el.nextSibling), Node);
  }
  static parentElement(el) {
    return el.parentElement;
  }
  static childNodes(el) {
    return assert.returnType((el.childNodes), NodeList);
  }
  static childNodesAsList(el) {
    var childNodes = el.childNodes;
    var res = ListWrapper.createFixedSize(childNodes.length);
    for (var i = 0; i < childNodes.length; i++) {
      res[i] = childNodes[i];
    }
    return assert.returnType((res), List);
  }
  static clearNodes(el) {
    el.innerHTML = "";
  }
  static appendChild(el, node) {
    el.appendChild(node);
  }
  static removeChild(el, node) {
    el.removeChild(node);
  }
  static remove(el) {
    assert.argumentTypes(el, Element);
    var parent = el.parentNode;
    parent.removeChild(el);
    return assert.returnType((el), Element);
  }
  static insertBefore(el, node) {
    el.parentNode.insertBefore(node, el);
  }
  static insertAllBefore(el, nodes) {
    ListWrapper.forEach(nodes, (n) => {
      el.parentNode.insertBefore(n, el);
    });
  }
  static insertAfter(el, node) {
    el.parentNode.insertBefore(node, el.nextSibling);
  }
  static setInnerHTML(el, value) {
    el.innerHTML = value;
  }
  static getText(el) {
    assert.argumentTypes(el, Element);
    return el.textContent;
  }
  static setText(el, value) {
    assert.argumentTypes(el, assert.type.any, value, assert.type.string);
    el.textContent = value;
  }
  static getValue(el) {
    assert.argumentTypes(el, Element);
    return el.value;
  }
  static setValue(el, value) {
    assert.argumentTypes(el, Element, value, assert.type.string);
    el.value = value;
  }
  static getChecked(el) {
    assert.argumentTypes(el, Element);
    return el.checked;
  }
  static setChecked(el, value) {
    assert.argumentTypes(el, Element, value, assert.type.boolean);
    el.checked = value;
  }
  static createTemplate(html) {
    var t = document.createElement('template');
    t.innerHTML = html;
    return t;
  }
  static createElement(tagName, doc = document) {
    return doc.createElement(tagName);
  }
  static createTextNode(text, doc = document) {
    assert.argumentTypes(text, assert.type.string, doc, assert.type.any);
    return doc.createTextNode(text);
  }
  static createScriptTag(attrName, attrValue, doc = document) {
    assert.argumentTypes(attrName, assert.type.string, attrValue, assert.type.string, doc, assert.type.any);
    var el = doc.createElement("SCRIPT");
    el.setAttribute(attrName, attrValue);
    return el;
  }
  static createStyleElement(css, doc = document) {
    assert.argumentTypes(css, assert.type.string, doc, assert.type.any);
    var style = doc.createElement('STYLE');
    style.innerText = css;
    return assert.returnType((style), StyleElement);
  }
  static clone(node) {
    assert.argumentTypes(node, Node);
    return node.cloneNode(true);
  }
  static hasProperty(element, name) {
    assert.argumentTypes(element, Element, name, assert.type.string);
    return name in element;
  }
  static getElementsByClassName(element, name) {
    assert.argumentTypes(element, Element, name, assert.type.string);
    return element.getElementsByClassName(name);
  }
  static getElementsByTagName(element, name) {
    assert.argumentTypes(element, Element, name, assert.type.string);
    return element.getElementsByTagName(name);
  }
  static classList(element) {
    assert.argumentTypes(element, Element);
    return assert.returnType((Array.prototype.slice.call(element.classList, 0)), List);
  }
  static addClass(element, classname) {
    assert.argumentTypes(element, Element, classname, assert.type.string);
    element.classList.add(classname);
  }
  static removeClass(element, classname) {
    assert.argumentTypes(element, Element, classname, assert.type.string);
    element.classList.remove(classname);
  }
  static hasClass(element, classname) {
    assert.argumentTypes(element, Element, classname, assert.type.string);
    return element.classList.contains(classname);
  }
  static setStyle(element, stylename, stylevalue) {
    assert.argumentTypes(element, Element, stylename, assert.type.string, stylevalue, assert.type.string);
    element.style[stylename] = stylevalue;
  }
  static removeStyle(element, stylename) {
    assert.argumentTypes(element, Element, stylename, assert.type.string);
    element.style[stylename] = null;
  }
  static getStyle(element, stylename) {
    assert.argumentTypes(element, Element, stylename, assert.type.string);
    return element.style[stylename];
  }
  static tagName(element) {
    assert.argumentTypes(element, Element);
    return assert.returnType((element.tagName), assert.type.string);
  }
  static attributeMap(element) {
    assert.argumentTypes(element, Element);
    var res = MapWrapper.create();
    var elAttrs = element.attributes;
    for (var i = 0; i < elAttrs.length; i++) {
      var attrib = elAttrs[i];
      MapWrapper.set(res, attrib.name, attrib.value);
    }
    return res;
  }
  static getAttribute(element, attribute) {
    assert.argumentTypes(element, Element, attribute, assert.type.string);
    return element.getAttribute(attribute);
  }
  static setAttribute(element, name, value) {
    assert.argumentTypes(element, Element, name, assert.type.string, value, assert.type.string);
    element.setAttribute(name, value);
  }
  static removeAttribute(element, attribute) {
    assert.argumentTypes(element, Element, attribute, assert.type.string);
    return element.removeAttribute(attribute);
  }
  static templateAwareRoot(el) {
    assert.argumentTypes(el, Element);
    return assert.returnType((el instanceof TemplateElement ? el.content : el), Node);
  }
  static createHtmlDocument() {
    return document.implementation.createHTMLDocument();
  }
  static defaultDoc() {
    return document;
  }
  static elementMatches(n, selector) {
    assert.argumentTypes(n, assert.type.any, selector, assert.type.string);
    return assert.returnType((n instanceof Element && n.matches(selector)), assert.type.boolean);
  }
  static isTemplateElement(el) {
    assert.argumentTypes(el, assert.type.any);
    return assert.returnType((el instanceof TemplateElement), assert.type.boolean);
  }
  static isTextNode(node) {
    assert.argumentTypes(node, Node);
    return assert.returnType((node.nodeType === Node.TEXT_NODE), assert.type.boolean);
  }
  static isElementNode(node) {
    assert.argumentTypes(node, Node);
    return assert.returnType((node.nodeType === Node.ELEMENT_NODE), assert.type.boolean);
  }
  static importIntoDoc(node) {
    assert.argumentTypes(node, Node);
    return document.importNode(node, true);
  }
}
Object.defineProperty(DOM.querySelector, "parameters", {get: function() {
    return [[], [assert.type.string]];
  }});
Object.defineProperty(DOM.querySelectorAll, "parameters", {get: function() {
    return [[], [assert.type.string]];
  }});
Object.defineProperty(DOM.nodeName, "parameters", {get: function() {
    return [[Node]];
  }});
Object.defineProperty(DOM.nodeValue, "parameters", {get: function() {
    return [[Node]];
  }});
Object.defineProperty(DOM.type, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(DOM.content, "parameters", {get: function() {
    return [[TemplateElement]];
  }});
Object.defineProperty(DOM.remove, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(DOM.getText, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(DOM.setText, "parameters", {get: function() {
    return [[], [assert.type.string]];
  }});
Object.defineProperty(DOM.getValue, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(DOM.setValue, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});
Object.defineProperty(DOM.getChecked, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(DOM.setChecked, "parameters", {get: function() {
    return [[Element], [assert.type.boolean]];
  }});
Object.defineProperty(DOM.createTextNode, "parameters", {get: function() {
    return [[assert.type.string], []];
  }});
Object.defineProperty(DOM.createScriptTag, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string], []];
  }});
Object.defineProperty(DOM.createStyleElement, "parameters", {get: function() {
    return [[assert.type.string], []];
  }});
Object.defineProperty(DOM.clone, "parameters", {get: function() {
    return [[Node]];
  }});
Object.defineProperty(DOM.hasProperty, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});
Object.defineProperty(DOM.getElementsByClassName, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});
Object.defineProperty(DOM.getElementsByTagName, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});
Object.defineProperty(DOM.classList, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(DOM.addClass, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});
Object.defineProperty(DOM.removeClass, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});
Object.defineProperty(DOM.hasClass, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});
Object.defineProperty(DOM.setStyle, "parameters", {get: function() {
    return [[Element], [assert.type.string], [assert.type.string]];
  }});
Object.defineProperty(DOM.removeStyle, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});
Object.defineProperty(DOM.getStyle, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});
Object.defineProperty(DOM.tagName, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(DOM.attributeMap, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(DOM.getAttribute, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});
Object.defineProperty(DOM.setAttribute, "parameters", {get: function() {
    return [[Element], [assert.type.string], [assert.type.string]];
  }});
Object.defineProperty(DOM.removeAttribute, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});
Object.defineProperty(DOM.templateAwareRoot, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(DOM.elementMatches, "parameters", {get: function() {
    return [[], [assert.type.string]];
  }});
Object.defineProperty(DOM.isTemplateElement, "parameters", {get: function() {
    return [[assert.type.any]];
  }});
Object.defineProperty(DOM.isTextNode, "parameters", {get: function() {
    return [[Node]];
  }});
Object.defineProperty(DOM.isElementNode, "parameters", {get: function() {
    return [[Node]];
  }});
Object.defineProperty(DOM.importIntoDoc, "parameters", {get: function() {
    return [[Node]];
  }});
export class CSSRuleWrapper {
  static isPageRule(rule) {
    return rule.type === CSSRule.PAGE_RULE;
  }
  static isStyleRule(rule) {
    return rule.type === CSSRule.STYLE_RULE;
  }
  static isMediaRule(rule) {
    return rule.type === CSSRule.MEDIA_RULE;
  }
  static isKeyframesRule(rule) {
    return rule.type === CSSRule.KEYFRAMES_RULE;
  }
}

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/facade/dom.map

//# sourceMappingURL=./dom.map