import {assert} from "rtts_assert/rtts_assert";
import {isPresent} from 'angular2/src/facade/lang';
import {List,
  ListWrapper} from 'angular2/src/facade/collection';
import {Element,
  DOM} from 'angular2/src/facade/dom';
import {CompileElement} from './compile_element';
import {CompileControl} from './compile_control';
import {CompileStep} from './compile_step';
export class CompilePipeline {
  constructor(steps) {
    assert.argumentTypes(steps, assert.genericType(List, CompileStep));
    this._control = new CompileControl(steps);
  }
  process(rootElement) {
    assert.argumentTypes(rootElement, Element);
    var results = ListWrapper.create();
    this._process(results, null, new CompileElement(rootElement));
    return assert.returnType((results), List);
  }
  _process(results, parent, current) {
    assert.argumentTypes(results, assert.type.any, parent, CompileElement, current, CompileElement);
    var additionalChildren = this._control.internalProcess(results, 0, parent, current);
    if (current.compileChildren) {
      var node = DOM.firstChild(DOM.templateAwareRoot(current.element));
      while (isPresent(node)) {
        var nextNode = DOM.nextSibling(node);
        if (DOM.isElementNode(node)) {
          this._process(results, current, new CompileElement(node));
        }
        node = nextNode;
      }
    }
    if (isPresent(additionalChildren)) {
      for (var i = 0; i < additionalChildren.length; i++) {
        this._process(results, current, additionalChildren[i]);
      }
    }
  }
}
Object.defineProperty(CompilePipeline, "parameters", {get: function() {
    return [[assert.genericType(List, CompileStep)]];
  }});
Object.defineProperty(CompilePipeline.prototype.process, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(CompilePipeline.prototype._process, "parameters", {get: function() {
    return [[], [CompileElement], [CompileElement]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/compiler/pipeline/compile_pipeline.map

//# sourceMappingURL=./compile_pipeline.map