import {Decorator} from 'angular2/src/core/annotations/annotations';
export class NonBindable {}
Object.defineProperty(NonBindable, "annotations", {get: function() {
    return [new Decorator({
      selector: '[non-bindable]',
      compileChildren: false
    })];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/directives/non_bindable.map

//# sourceMappingURL=./non_bindable.map