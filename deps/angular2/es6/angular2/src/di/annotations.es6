import {CONST} from "angular2/src/facade/lang";
export class Inject {
  constructor(token) {
    this.token = token;
  }
}
Object.defineProperty(Inject, "annotations", {get: function() {
    return [new CONST()];
  }});
export class InjectPromise {
  constructor(token) {
    this.token = token;
  }
}
Object.defineProperty(InjectPromise, "annotations", {get: function() {
    return [new CONST()];
  }});
export class InjectLazy {
  constructor(token) {
    this.token = token;
  }
}
Object.defineProperty(InjectLazy, "annotations", {get: function() {
    return [new CONST()];
  }});
export class DependencyAnnotation {
  constructor() {}
}
Object.defineProperty(DependencyAnnotation, "annotations", {get: function() {
    return [new CONST()];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/di/annotations.map

//# sourceMappingURL=./annotations.map