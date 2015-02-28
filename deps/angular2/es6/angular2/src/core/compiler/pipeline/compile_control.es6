import {assert} from "rtts_assert/rtts_assert";
import {isBlank} from 'angular2/src/facade/lang';
import {List,
  ListWrapper} from 'angular2/src/facade/collection';
import {CompileElement} from './compile_element';
import {CompileStep} from './compile_step';
export class CompileControl {
  constructor(steps) {
    this._steps = steps;
    this._currentStepIndex = 0;
    this._parent = null;
    this._results = null;
    this._additionalChildren = null;
  }
  internalProcess(results, startStepIndex, parent, current) {
    assert.argumentTypes(results, assert.type.any, startStepIndex, assert.type.any, parent, CompileElement, current, CompileElement);
    this._results = results;
    var previousStepIndex = this._currentStepIndex;
    var previousParent = this._parent;
    for (var i = startStepIndex; i < this._steps.length; i++) {
      var step = this._steps[i];
      this._parent = parent;
      this._currentStepIndex = i;
      step.process(parent, current, this);
      parent = this._parent;
    }
    ListWrapper.push(results, current);
    this._currentStepIndex = previousStepIndex;
    this._parent = previousParent;
    var localAdditionalChildren = this._additionalChildren;
    this._additionalChildren = null;
    return localAdditionalChildren;
  }
  addParent(newElement) {
    assert.argumentTypes(newElement, CompileElement);
    this.internalProcess(this._results, this._currentStepIndex + 1, this._parent, newElement);
    this._parent = newElement;
  }
  addChild(element) {
    assert.argumentTypes(element, CompileElement);
    if (isBlank(this._additionalChildren)) {
      this._additionalChildren = ListWrapper.create();
    }
    ListWrapper.push(this._additionalChildren, element);
  }
}
Object.defineProperty(CompileControl.prototype.internalProcess, "parameters", {get: function() {
    return [[], [], [CompileElement], [CompileElement]];
  }});
Object.defineProperty(CompileControl.prototype.addParent, "parameters", {get: function() {
    return [[CompileElement]];
  }});
Object.defineProperty(CompileControl.prototype.addChild, "parameters", {get: function() {
    return [[CompileElement]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/compiler/pipeline/compile_control.map

//# sourceMappingURL=./compile_control.map