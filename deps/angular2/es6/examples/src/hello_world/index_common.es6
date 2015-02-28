import {assert} from "rtts_assert/rtts_assert";
import {bootstrap,
  Component,
  Decorator,
  Template,
  NgElement} from 'angular2/angular2';
class HelloCmp {
  constructor(service) {
    assert.argumentTypes(service, GreetingService);
    this.greeting = service.greeting;
  }
  changeGreeting() {
    this.greeting = 'howdy';
  }
}
Object.defineProperty(HelloCmp, "annotations", {get: function() {
    return [new Component({
      selector: 'hello-app',
      componentServices: [GreetingService]
    }), new Template({
      inline: `<div class="greeting">{{greeting}} <span red>world</span>!</div>
           <button class="changeButton" (click)="changeGreeting()">change greeting</button>`,
      directives: [RedDec]
    })];
  }});
Object.defineProperty(HelloCmp, "parameters", {get: function() {
    return [[GreetingService]];
  }});
class RedDec {
  constructor(el) {
    assert.argumentTypes(el, NgElement);
    el.domElement.style.color = 'red';
  }
}
Object.defineProperty(RedDec, "annotations", {get: function() {
    return [new Decorator({selector: '[red]'})];
  }});
Object.defineProperty(RedDec, "parameters", {get: function() {
    return [[NgElement]];
  }});
class GreetingService {
  constructor() {
    this.greeting = 'hello';
  }
}
export function main() {
  bootstrap(HelloCmp);
}

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/examples/src/hello_world/index_common.map

//# sourceMappingURL=./index_common.map