import {assert} from "rtts_assert/rtts_assert";
import {DOM,
  Element} from 'angular2/src/facade/dom';
import {normalizeBlank} from 'angular2/src/facade/lang';
export class NgElement {
  constructor(domElement) {
    assert.argumentTypes(domElement, Element);
    this.domElement = domElement;
  }
  getAttribute(name) {
    assert.argumentTypes(name, assert.type.string);
    return normalizeBlank(DOM.getAttribute(this.domElement, name));
  }
}
Object.defineProperty(NgElement, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(NgElement.prototype.getAttribute, "parameters", {get: function() {
    return [[assert.type.string]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/dom/element.map

//# sourceMappingURL=./element.map