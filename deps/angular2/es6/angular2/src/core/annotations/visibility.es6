import {CONST} from 'angular2/src/facade/lang';
import {DependencyAnnotation} from 'angular2/di';
export class Parent extends DependencyAnnotation {
  constructor() {
    super();
  }
}
Object.defineProperty(Parent, "annotations", {get: function() {
    return [new CONST()];
  }});
export class Ancestor extends DependencyAnnotation {
  constructor() {
    super();
  }
}
Object.defineProperty(Ancestor, "annotations", {get: function() {
    return [new CONST()];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/annotations/visibility.map

//# sourceMappingURL=./visibility.map