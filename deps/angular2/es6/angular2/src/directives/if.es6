import {assert} from "rtts_assert/rtts_assert";
import {Viewport} from 'angular2/src/core/annotations/annotations';
import {ViewContainer} from 'angular2/src/core/compiler/view_container';
import {isBlank} from 'angular2/src/facade/lang';
export class If {
  constructor(viewContainer) {
    assert.argumentTypes(viewContainer, ViewContainer);
    this.viewContainer = viewContainer;
    this.prevCondition = null;
  }
  set condition(newCondition) {
    if (newCondition && (isBlank(this.prevCondition) || !this.prevCondition)) {
      this.prevCondition = true;
      this.viewContainer.create();
    } else if (!newCondition && (isBlank(this.prevCondition) || this.prevCondition)) {
      this.prevCondition = false;
      this.viewContainer.clear();
    }
  }
}
Object.defineProperty(If, "annotations", {get: function() {
    return [new Viewport({
      selector: '[if]',
      bind: {'condition': 'if'}
    })];
  }});
Object.defineProperty(If, "parameters", {get: function() {
    return [[ViewContainer]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/directives/if.map

//# sourceMappingURL=./if.map