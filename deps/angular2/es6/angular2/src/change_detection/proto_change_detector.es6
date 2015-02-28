import {assert} from "rtts_assert/rtts_assert";
import {isPresent,
  isBlank,
  BaseException,
  Type,
  isString} from 'angular2/src/facade/lang';
import {List,
  ListWrapper,
  MapWrapper,
  StringMapWrapper} from 'angular2/src/facade/collection';
import {AccessMember,
  Assignment,
  AST,
  ASTWithSource,
  AstVisitor,
  Binary,
  Chain,
  Conditional,
  Pipe,
  FunctionCall,
  ImplicitReceiver,
  Interpolation,
  KeyedAccess,
  LiteralArray,
  LiteralMap,
  LiteralPrimitive,
  MethodCall,
  PrefixNot} from './parser/ast';
import {ChangeRecord,
  ChangeDispatcher,
  ChangeDetector} from './interfaces';
import {ChangeDetectionUtil} from './change_detection_util';
import {DynamicChangeDetector} from './dynamic_change_detector';
import {ChangeDetectorJITGenerator} from './change_detection_jit_generator';
import {PipeRegistry} from './pipes/pipe_registry';
import {coalesce} from './coalesce';
import {ProtoRecord,
  RECORD_TYPE_SELF,
  RECORD_TYPE_PROPERTY,
  RECORD_TYPE_INVOKE_METHOD,
  RECORD_TYPE_CONST,
  RECORD_TYPE_INVOKE_CLOSURE,
  RECORD_TYPE_PRIMITIVE_OP,
  RECORD_TYPE_KEYED_ACCESS,
  RECORD_TYPE_PIPE,
  RECORD_TYPE_INTERPOLATE} from './proto_record';
export class ProtoChangeDetector {
  addAst(ast, bindingMemento, directiveMemento = null) {
    assert.argumentTypes(ast, AST, bindingMemento, assert.type.any, directiveMemento, assert.type.any);
  }
  instantiate(dispatcher) {
    assert.argumentTypes(dispatcher, assert.type.any);
    return assert.returnType((null), ChangeDetector);
  }
}
Object.defineProperty(ProtoChangeDetector.prototype.addAst, "parameters", {get: function() {
    return [[AST], [assert.type.any], [assert.type.any]];
  }});
Object.defineProperty(ProtoChangeDetector.prototype.instantiate, "parameters", {get: function() {
    return [[assert.type.any]];
  }});
export class DynamicProtoChangeDetector extends ProtoChangeDetector {
  constructor(pipeRegistry) {
    assert.argumentTypes(pipeRegistry, PipeRegistry);
    super();
    this._pipeRegistry = pipeRegistry;
    this._records = null;
    this._recordBuilder = new ProtoRecordBuilder();
  }
  addAst(ast, bindingMemento, directiveMemento = null) {
    assert.argumentTypes(ast, AST, bindingMemento, assert.type.any, directiveMemento, assert.type.any);
    this._recordBuilder.addAst(ast, bindingMemento, directiveMemento);
  }
  instantiate(dispatcher) {
    assert.argumentTypes(dispatcher, assert.type.any);
    this._createRecordsIfNecessary();
    return new DynamicChangeDetector(dispatcher, this._pipeRegistry, this._records);
  }
  _createRecordsIfNecessary() {
    if (isBlank(this._records)) {
      var records = this._recordBuilder.records;
      this._records = coalesce(records);
    }
  }
}
Object.defineProperty(DynamicProtoChangeDetector, "parameters", {get: function() {
    return [[PipeRegistry]];
  }});
Object.defineProperty(DynamicProtoChangeDetector.prototype.addAst, "parameters", {get: function() {
    return [[AST], [assert.type.any], [assert.type.any]];
  }});
Object.defineProperty(DynamicProtoChangeDetector.prototype.instantiate, "parameters", {get: function() {
    return [[assert.type.any]];
  }});
var _jitProtoChangeDetectorClassCounter = assert.type(0, assert.type.number);
export class JitProtoChangeDetector extends ProtoChangeDetector {
  constructor(pipeRegistry) {
    super();
    this._pipeRegistry = pipeRegistry;
    this._factory = null;
    this._recordBuilder = new ProtoRecordBuilder();
  }
  addAst(ast, bindingMemento, directiveMemento = null) {
    assert.argumentTypes(ast, AST, bindingMemento, assert.type.any, directiveMemento, assert.type.any);
    this._recordBuilder.addAst(ast, bindingMemento, directiveMemento);
  }
  instantiate(dispatcher) {
    assert.argumentTypes(dispatcher, assert.type.any);
    this._createFactoryIfNecessary();
    return this._factory(dispatcher, this._pipeRegistry);
  }
  _createFactoryIfNecessary() {
    if (isBlank(this._factory)) {
      var c = _jitProtoChangeDetectorClassCounter++;
      var records = coalesce(this._recordBuilder.records);
      var typeName = `ChangeDetector${c}`;
      this._factory = new ChangeDetectorJITGenerator(typeName, records).generate();
    }
  }
}
Object.defineProperty(JitProtoChangeDetector.prototype.addAst, "parameters", {get: function() {
    return [[AST], [assert.type.any], [assert.type.any]];
  }});
Object.defineProperty(JitProtoChangeDetector.prototype.instantiate, "parameters", {get: function() {
    return [[assert.type.any]];
  }});
class ProtoRecordBuilder {
  constructor() {
    this.records = [];
  }
  addAst(ast, bindingMemento, directiveMemento = null) {
    assert.argumentTypes(ast, AST, bindingMemento, assert.type.any, directiveMemento, assert.type.any);
    var last = ListWrapper.last(this.records);
    if (isPresent(last) && last.directiveMemento == directiveMemento) {
      last.lastInDirective = false;
    }
    var pr = _ConvertAstIntoProtoRecords.convert(ast, bindingMemento, directiveMemento, this.records.length);
    if (!ListWrapper.isEmpty(pr)) {
      var last = ListWrapper.last(pr);
      last.lastInBinding = true;
      last.lastInDirective = true;
      this.records = ListWrapper.concat(this.records, pr);
    }
  }
}
Object.defineProperty(ProtoRecordBuilder.prototype.addAst, "parameters", {get: function() {
    return [[AST], [assert.type.any], [assert.type.any]];
  }});
class _ConvertAstIntoProtoRecords {
  constructor(bindingMemento, directiveMemento, contextIndex, expressionAsString) {
    assert.argumentTypes(bindingMemento, assert.type.any, directiveMemento, assert.type.any, contextIndex, assert.type.number, expressionAsString, assert.type.string);
    this.protoRecords = [];
    this.bindingMemento = bindingMemento;
    this.directiveMemento = directiveMemento;
    this.contextIndex = contextIndex;
    this.expressionAsString = expressionAsString;
  }
  static convert(ast, bindingMemento, directiveMemento, contextIndex) {
    assert.argumentTypes(ast, AST, bindingMemento, assert.type.any, directiveMemento, assert.type.any, contextIndex, assert.type.number);
    var c = new _ConvertAstIntoProtoRecords(bindingMemento, directiveMemento, contextIndex, ast.toString());
    ast.visit(c);
    return c.protoRecords;
  }
  visitImplicitReceiver(ast) {
    assert.argumentTypes(ast, ImplicitReceiver);
    return 0;
  }
  visitInterpolation(ast) {
    assert.argumentTypes(ast, Interpolation);
    var args = this._visitAll(ast.expressions);
    return this._addRecord(RECORD_TYPE_INTERPOLATE, "interpolate", _interpolationFn(ast.strings), args, ast.strings, 0);
  }
  visitLiteralPrimitive(ast) {
    assert.argumentTypes(ast, LiteralPrimitive);
    return this._addRecord(RECORD_TYPE_CONST, "literal", ast.value, [], null, 0);
  }
  visitAccessMember(ast) {
    assert.argumentTypes(ast, AccessMember);
    var receiver = ast.receiver.visit(this);
    return this._addRecord(RECORD_TYPE_PROPERTY, ast.name, ast.getter, [], null, receiver);
  }
  visitMethodCall(ast) {
    assert.argumentTypes(ast, MethodCall);
    var receiver = ast.receiver.visit(this);
    var args = this._visitAll(ast.args);
    return this._addRecord(RECORD_TYPE_INVOKE_METHOD, ast.name, ast.fn, args, null, receiver);
  }
  visitFunctionCall(ast) {
    assert.argumentTypes(ast, FunctionCall);
    var target = ast.target.visit(this);
    var args = this._visitAll(ast.args);
    return this._addRecord(RECORD_TYPE_INVOKE_CLOSURE, "closure", null, args, null, target);
  }
  visitLiteralArray(ast) {
    assert.argumentTypes(ast, LiteralArray);
    var primitiveName = `arrayFn${ast.expressions.length}`;
    return this._addRecord(RECORD_TYPE_PRIMITIVE_OP, primitiveName, _arrayFn(ast.expressions.length), this._visitAll(ast.expressions), null, 0);
  }
  visitLiteralMap(ast) {
    assert.argumentTypes(ast, LiteralMap);
    return this._addRecord(RECORD_TYPE_PRIMITIVE_OP, _mapPrimitiveName(ast.keys), ChangeDetectionUtil.mapFn(ast.keys), this._visitAll(ast.values), null, 0);
  }
  visitBinary(ast) {
    assert.argumentTypes(ast, Binary);
    var left = ast.left.visit(this);
    var right = ast.right.visit(this);
    return this._addRecord(RECORD_TYPE_PRIMITIVE_OP, _operationToPrimitiveName(ast.operation), _operationToFunction(ast.operation), [left, right], null, 0);
  }
  visitPrefixNot(ast) {
    assert.argumentTypes(ast, PrefixNot);
    var exp = ast.expression.visit(this);
    return this._addRecord(RECORD_TYPE_PRIMITIVE_OP, "operation_negate", ChangeDetectionUtil.operation_negate, [exp], null, 0);
  }
  visitConditional(ast) {
    assert.argumentTypes(ast, Conditional);
    var c = ast.condition.visit(this);
    var t = ast.trueExp.visit(this);
    var f = ast.falseExp.visit(this);
    return this._addRecord(RECORD_TYPE_PRIMITIVE_OP, "cond", ChangeDetectionUtil.cond, [c, t, f], null, 0);
  }
  visitPipe(ast) {
    assert.argumentTypes(ast, Pipe);
    var value = ast.exp.visit(this);
    return this._addRecord(RECORD_TYPE_PIPE, ast.name, ast.name, [], null, value);
  }
  visitKeyedAccess(ast) {
    assert.argumentTypes(ast, KeyedAccess);
    var obj = ast.obj.visit(this);
    var key = ast.key.visit(this);
    return this._addRecord(RECORD_TYPE_KEYED_ACCESS, "keyedAccess", ChangeDetectionUtil.keyedAccess, [key], null, obj);
  }
  _visitAll(asts) {
    assert.argumentTypes(asts, List);
    var res = ListWrapper.createFixedSize(asts.length);
    for (var i = 0; i < asts.length; ++i) {
      res[i] = asts[i].visit(this);
    }
    return res;
  }
  _addRecord(type, name, funcOrValue, args, fixedArgs, context) {
    var selfIndex = ++this.contextIndex;
    ListWrapper.push(this.protoRecords, new ProtoRecord(type, name, funcOrValue, args, fixedArgs, context, selfIndex, this.bindingMemento, this.directiveMemento, this.expressionAsString, false, false));
    return selfIndex;
  }
}
Object.defineProperty(_ConvertAstIntoProtoRecords, "parameters", {get: function() {
    return [[assert.type.any], [assert.type.any], [assert.type.number], [assert.type.string]];
  }});
Object.defineProperty(_ConvertAstIntoProtoRecords.convert, "parameters", {get: function() {
    return [[AST], [assert.type.any], [assert.type.any], [assert.type.number]];
  }});
Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitImplicitReceiver, "parameters", {get: function() {
    return [[ImplicitReceiver]];
  }});
Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitInterpolation, "parameters", {get: function() {
    return [[Interpolation]];
  }});
Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitLiteralPrimitive, "parameters", {get: function() {
    return [[LiteralPrimitive]];
  }});
Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitAccessMember, "parameters", {get: function() {
    return [[AccessMember]];
  }});
Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitMethodCall, "parameters", {get: function() {
    return [[MethodCall]];
  }});
Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitFunctionCall, "parameters", {get: function() {
    return [[FunctionCall]];
  }});
Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitLiteralArray, "parameters", {get: function() {
    return [[LiteralArray]];
  }});
Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitLiteralMap, "parameters", {get: function() {
    return [[LiteralMap]];
  }});
Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitBinary, "parameters", {get: function() {
    return [[Binary]];
  }});
Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitPrefixNot, "parameters", {get: function() {
    return [[PrefixNot]];
  }});
Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitConditional, "parameters", {get: function() {
    return [[Conditional]];
  }});
Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitPipe, "parameters", {get: function() {
    return [[Pipe]];
  }});
Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitKeyedAccess, "parameters", {get: function() {
    return [[KeyedAccess]];
  }});
Object.defineProperty(_ConvertAstIntoProtoRecords.prototype._visitAll, "parameters", {get: function() {
    return [[List]];
  }});
function _arrayFn(length) {
  assert.argumentTypes(length, assert.type.number);
  switch (length) {
    case 0:
      return assert.returnType((ChangeDetectionUtil.arrayFn0), Function);
    case 1:
      return assert.returnType((ChangeDetectionUtil.arrayFn1), Function);
    case 2:
      return assert.returnType((ChangeDetectionUtil.arrayFn2), Function);
    case 3:
      return assert.returnType((ChangeDetectionUtil.arrayFn3), Function);
    case 4:
      return assert.returnType((ChangeDetectionUtil.arrayFn4), Function);
    case 5:
      return assert.returnType((ChangeDetectionUtil.arrayFn5), Function);
    case 6:
      return assert.returnType((ChangeDetectionUtil.arrayFn6), Function);
    case 7:
      return assert.returnType((ChangeDetectionUtil.arrayFn7), Function);
    case 8:
      return assert.returnType((ChangeDetectionUtil.arrayFn8), Function);
    case 9:
      return assert.returnType((ChangeDetectionUtil.arrayFn9), Function);
    default:
      throw new BaseException(`Does not support literal maps with more than 9 elements`);
  }
}
Object.defineProperty(_arrayFn, "parameters", {get: function() {
    return [[assert.type.number]];
  }});
function _mapPrimitiveName(keys) {
  var stringifiedKeys = ListWrapper.join(ListWrapper.map(keys, (k) => isString(k) ? `"${k}"` : `${k}`), ", ");
  return `mapFn([${stringifiedKeys}])`;
}
Object.defineProperty(_mapPrimitiveName, "parameters", {get: function() {
    return [[List]];
  }});
function _operationToPrimitiveName(operation) {
  assert.argumentTypes(operation, assert.type.string);
  switch (operation) {
    case '+':
      return assert.returnType(("operation_add"), assert.type.string);
    case '-':
      return assert.returnType(("operation_subtract"), assert.type.string);
    case '*':
      return assert.returnType(("operation_multiply"), assert.type.string);
    case '/':
      return assert.returnType(("operation_divide"), assert.type.string);
    case '%':
      return assert.returnType(("operation_remainder"), assert.type.string);
    case '==':
      return assert.returnType(("operation_equals"), assert.type.string);
    case '!=':
      return assert.returnType(("operation_not_equals"), assert.type.string);
    case '<':
      return assert.returnType(("operation_less_then"), assert.type.string);
    case '>':
      return assert.returnType(("operation_greater_then"), assert.type.string);
    case '<=':
      return assert.returnType(("operation_less_or_equals_then"), assert.type.string);
    case '>=':
      return assert.returnType(("operation_greater_or_equals_then"), assert.type.string);
    case '&&':
      return assert.returnType(("operation_logical_and"), assert.type.string);
    case '||':
      return assert.returnType(("operation_logical_or"), assert.type.string);
    default:
      throw new BaseException(`Unsupported operation ${operation}`);
  }
}
Object.defineProperty(_operationToPrimitiveName, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
function _operationToFunction(operation) {
  assert.argumentTypes(operation, assert.type.string);
  switch (operation) {
    case '+':
      return assert.returnType((ChangeDetectionUtil.operation_add), Function);
    case '-':
      return assert.returnType((ChangeDetectionUtil.operation_subtract), Function);
    case '*':
      return assert.returnType((ChangeDetectionUtil.operation_multiply), Function);
    case '/':
      return assert.returnType((ChangeDetectionUtil.operation_divide), Function);
    case '%':
      return assert.returnType((ChangeDetectionUtil.operation_remainder), Function);
    case '==':
      return assert.returnType((ChangeDetectionUtil.operation_equals), Function);
    case '!=':
      return assert.returnType((ChangeDetectionUtil.operation_not_equals), Function);
    case '<':
      return assert.returnType((ChangeDetectionUtil.operation_less_then), Function);
    case '>':
      return assert.returnType((ChangeDetectionUtil.operation_greater_then), Function);
    case '<=':
      return assert.returnType((ChangeDetectionUtil.operation_less_or_equals_then), Function);
    case '>=':
      return assert.returnType((ChangeDetectionUtil.operation_greater_or_equals_then), Function);
    case '&&':
      return assert.returnType((ChangeDetectionUtil.operation_logical_and), Function);
    case '||':
      return assert.returnType((ChangeDetectionUtil.operation_logical_or), Function);
    default:
      throw new BaseException(`Unsupported operation ${operation}`);
  }
}
Object.defineProperty(_operationToFunction, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
function s(v) {
  return isPresent(v) ? `${v}` : '';
}
function _interpolationFn(strings) {
  var length = strings.length;
  var c0 = length > 0 ? strings[0] : null;
  var c1 = length > 1 ? strings[1] : null;
  var c2 = length > 2 ? strings[2] : null;
  var c3 = length > 3 ? strings[3] : null;
  var c4 = length > 4 ? strings[4] : null;
  var c5 = length > 5 ? strings[5] : null;
  var c6 = length > 6 ? strings[6] : null;
  var c7 = length > 7 ? strings[7] : null;
  var c8 = length > 8 ? strings[8] : null;
  var c9 = length > 9 ? strings[9] : null;
  switch (length - 1) {
    case 1:
      return (a1) => c0 + s(a1) + c1;
    case 2:
      return (a1, a2) => c0 + s(a1) + c1 + s(a2) + c2;
    case 3:
      return (a1, a2, a3) => c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3;
    case 4:
      return (a1, a2, a3, a4) => c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) + c4;
    case 5:
      return (a1, a2, a3, a4, a5) => c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) + c4 + s(a5) + c5;
    case 6:
      return (a1, a2, a3, a4, a5, a6) => c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) + c4 + s(a5) + c5 + s(a6) + c6;
    case 7:
      return (a1, a2, a3, a4, a5, a6, a7) => c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) + c4 + s(a5) + c5 + s(a6) + c6 + s(a7) + c7;
    case 8:
      return (a1, a2, a3, a4, a5, a6, a7, a8) => c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) + c4 + s(a5) + c5 + s(a6) + c6 + s(a7) + c7 + s(a8) + c8;
    case 9:
      return (a1, a2, a3, a4, a5, a6, a7, a8, a9) => c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) + c4 + s(a5) + c5 + s(a6) + c6 + s(a7) + c7 + s(a8) + c8 + s(a9) + c9;
    default:
      throw new BaseException(`Does not support more than 9 expressions`);
  }
}
Object.defineProperty(_interpolationFn, "parameters", {get: function() {
    return [[List]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/change_detection/proto_change_detector.map

//# sourceMappingURL=./proto_change_detector.map