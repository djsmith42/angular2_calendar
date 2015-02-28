import {CONST} from 'angular2/src/facade/lang';
import {DependencyAnnotation} from 'angular2/di';
export class EventEmitter extends DependencyAnnotation {
  constructor(eventName) {
    super();
    this.eventName = eventName;
  }
}
Object.defineProperty(EventEmitter, "annotations", {get: function() {
    return [new CONST()];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/annotations/events.map

//# sourceMappingURL=./events.map