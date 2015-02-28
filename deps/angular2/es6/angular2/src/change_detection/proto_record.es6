import {assert} from "rtts_assert/rtts_assert";
import {List} from 'angular2/src/facade/collection';
export const RECORD_TYPE_SELF = 0;
export const RECORD_TYPE_CONST = 1;
export const RECORD_TYPE_PRIMITIVE_OP = 2;
export const RECORD_TYPE_PROPERTY = 3;
export const RECORD_TYPE_INVOKE_METHOD = 4;
export const RECORD_TYPE_INVOKE_CLOSURE = 5;
export const RECORD_TYPE_KEYED_ACCESS = 6;
export const RECORD_TYPE_PIPE = 8;
export const RECORD_TYPE_INTERPOLATE = 9;
export class ProtoRecord {
  constructor(mode, name, funcOrValue, args, fixedArgs, contextIndex, selfIndex, bindingMemento, directiveMemento, expressionAsString, lastInBinding, lastInDirective) {
    assert.argumentTypes(mode, assert.type.number, name, assert.type.string, funcOrValue, assert.type.any, args, List, fixedArgs, List, contextIndex, assert.type.number, selfIndex, assert.type.number, bindingMemento, assert.type.any, directiveMemento, assert.type.any, expressionAsString, assert.type.string, lastInBinding, assert.type.boolean, lastInDirective, assert.type.boolean);
    this.mode = mode;
    this.name = name;
    this.funcOrValue = funcOrValue;
    this.args = args;
    this.fixedArgs = fixedArgs;
    this.contextIndex = contextIndex;
    this.selfIndex = selfIndex;
    this.bindingMemento = bindingMemento;
    this.directiveMemento = directiveMemento;
    this.lastInBinding = lastInBinding;
    this.lastInDirective = lastInDirective;
    this.expressionAsString = expressionAsString;
  }
  isPureFunction() {
    return assert.returnType((this.mode === RECORD_TYPE_INTERPOLATE || this.mode === RECORD_TYPE_PRIMITIVE_OP), assert.type.boolean);
  }
}
Object.defineProperty(ProtoRecord, "parameters", {get: function() {
    return [[assert.type.number], [assert.type.string], [], [List], [List], [assert.type.number], [assert.type.number], [assert.type.any], [assert.type.any], [assert.type.string], [assert.type.boolean], [assert.type.boolean]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/change_detection/proto_record.map

//# sourceMappingURL=./proto_record.map