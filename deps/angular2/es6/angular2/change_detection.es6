import {assert} from "rtts_assert/rtts_assert";
export {AST} from './src/change_detection/parser/ast';
export {Lexer} from './src/change_detection/parser/lexer';
export {Parser} from './src/change_detection/parser/parser';
export {ContextWithVariableBindings} from './src/change_detection/parser/context_with_variable_bindings';
export {ExpressionChangedAfterItHasBeenChecked, ChangeDetectionError} from './src/change_detection/exceptions';
export {ChangeRecord, ChangeDispatcher, ChangeDetector, CHECK_ONCE, CHECK_ALWAYS, DETACHED, CHECKED} from './src/change_detection/interfaces';
export {ProtoChangeDetector, DynamicProtoChangeDetector, JitProtoChangeDetector} from './src/change_detection/proto_change_detector';
export {DynamicChangeDetector} from './src/change_detection/dynamic_change_detector';
export * from './src/change_detection/pipes/pipe_registry';
export * from './src/change_detection/pipes/pipe';
import {ProtoChangeDetector,
  DynamicProtoChangeDetector,
  JitProtoChangeDetector} from './src/change_detection/proto_change_detector';
import {PipeRegistry} from './src/change_detection/pipes/pipe_registry';
import {ArrayChangesFactory} from './src/change_detection/pipes/array_changes';
import {NullPipeFactory} from './src/change_detection/pipes/null_pipe';
export class ChangeDetection {
  createProtoChangeDetector(name) {
    assert.argumentTypes(name, assert.type.string);
    return assert.returnType((null), ProtoChangeDetector);
  }
}
Object.defineProperty(ChangeDetection.prototype.createProtoChangeDetector, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export var defaultPipes = {"iterableDiff": [new ArrayChangesFactory(), new NullPipeFactory()]};
export class DynamicChangeDetection extends ChangeDetection {
  constructor(registry) {
    assert.argumentTypes(registry, PipeRegistry);
    super();
    this.registry = registry;
  }
  createProtoChangeDetector(name) {
    assert.argumentTypes(name, assert.type.string);
    return assert.returnType((new DynamicProtoChangeDetector(this.registry)), ProtoChangeDetector);
  }
}
Object.defineProperty(DynamicChangeDetection, "parameters", {get: function() {
    return [[PipeRegistry]];
  }});
Object.defineProperty(DynamicChangeDetection.prototype.createProtoChangeDetector, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export class JitChangeDetection extends ChangeDetection {
  constructor(registry) {
    assert.argumentTypes(registry, PipeRegistry);
    super();
    this.registry = registry;
  }
  createProtoChangeDetector(name) {
    assert.argumentTypes(name, assert.type.string);
    return assert.returnType((new JitProtoChangeDetector(this.registry)), ProtoChangeDetector);
  }
}
Object.defineProperty(JitChangeDetection, "parameters", {get: function() {
    return [[PipeRegistry]];
  }});
Object.defineProperty(JitChangeDetection.prototype.createProtoChangeDetector, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
var _registry = new PipeRegistry(defaultPipes);
export var dynamicChangeDetection = new DynamicChangeDetection(_registry);
export var jitChangeDetection = new JitChangeDetection(_registry);

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/change_detection.map

//# sourceMappingURL=./change_detection.map