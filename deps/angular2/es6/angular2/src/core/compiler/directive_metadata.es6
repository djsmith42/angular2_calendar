import {assert} from "rtts_assert/rtts_assert";
import {Type} from 'angular2/src/facade/lang';
import {Directive} from 'angular2/src/core/annotations/annotations';
export class DirectiveMetadata {
  constructor(type, annotation) {
    assert.argumentTypes(type, Type, annotation, Directive);
    this.annotation = annotation;
    this.type = type;
  }
}
Object.defineProperty(DirectiveMetadata, "parameters", {get: function() {
    return [[Type], [Directive]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/compiler/directive_metadata.map

//# sourceMappingURL=./directive_metadata.map