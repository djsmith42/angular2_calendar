import {assert} from "rtts_assert/rtts_assert";
import {FIELD,
  autoConvertAdd,
  isBlank,
  isPresent,
  FunctionWrapper,
  BaseException} from "angular2/src/facade/lang";
import {List,
  Map,
  ListWrapper,
  StringMapWrapper} from "angular2/src/facade/collection";
import {ContextWithVariableBindings} from "./context_with_variable_bindings";
export class AST {
  eval(context) {
    throw new BaseException("Not supported");
  }
  get isAssignable() {
    return false;
  }
  assign(context, value) {
    throw new BaseException("Not supported");
  }
  visit(visitor) {}
  toString() {
    return assert.returnType(("AST"), assert.type.string);
  }
}
export class EmptyExpr extends AST {
  eval(context) {
    return null;
  }
  visit(visitor) {}
}
export class ImplicitReceiver extends AST {
  eval(context) {
    return context;
  }
  visit(visitor) {
    return visitor.visitImplicitReceiver(this);
  }
}
export class Chain extends AST {
  constructor(expressions) {
    assert.argumentTypes(expressions, List);
    super();
    this.expressions = expressions;
  }
  eval(context) {
    var result;
    for (var i = 0; i < this.expressions.length; i++) {
      var last = this.expressions[i].eval(context);
      if (isPresent(last))
        result = last;
    }
    return result;
  }
  visit(visitor) {
    return visitor.visitChain(this);
  }
}
Object.defineProperty(Chain, "parameters", {get: function() {
    return [[List]];
  }});
export class Conditional extends AST {
  constructor(condition, trueExp, falseExp) {
    assert.argumentTypes(condition, AST, trueExp, AST, falseExp, AST);
    super();
    this.condition = condition;
    this.trueExp = trueExp;
    this.falseExp = falseExp;
  }
  eval(context) {
    if (this.condition.eval(context)) {
      return this.trueExp.eval(context);
    } else {
      return this.falseExp.eval(context);
    }
  }
  visit(visitor) {
    return visitor.visitConditional(this);
  }
}
Object.defineProperty(Conditional, "parameters", {get: function() {
    return [[AST], [AST], [AST]];
  }});
export class AccessMember extends AST {
  constructor(receiver, name, getter, setter) {
    assert.argumentTypes(receiver, AST, name, assert.type.string, getter, Function, setter, Function);
    super();
    this.receiver = receiver;
    this.name = name;
    this.getter = getter;
    this.setter = setter;
  }
  eval(context) {
    var evaluatedContext = this.receiver.eval(context);
    while (evaluatedContext instanceof ContextWithVariableBindings) {
      if (evaluatedContext.hasBinding(this.name)) {
        return evaluatedContext.get(this.name);
      }
      evaluatedContext = evaluatedContext.parent;
    }
    return this.getter(evaluatedContext);
  }
  get isAssignable() {
    return true;
  }
  assign(context, value) {
    var evaluatedContext = this.receiver.eval(context);
    while (evaluatedContext instanceof ContextWithVariableBindings) {
      if (evaluatedContext.hasBinding(this.name)) {
        throw new BaseException(`Cannot reassign a variable binding ${this.name}`);
      }
      evaluatedContext = evaluatedContext.parent;
    }
    return this.setter(evaluatedContext, value);
  }
  visit(visitor) {
    return visitor.visitAccessMember(this);
  }
}
Object.defineProperty(AccessMember, "parameters", {get: function() {
    return [[AST], [assert.type.string], [Function], [Function]];
  }});
export class KeyedAccess extends AST {
  constructor(obj, key) {
    assert.argumentTypes(obj, AST, key, AST);
    super();
    this.obj = obj;
    this.key = key;
  }
  eval(context) {
    var obj = this.obj.eval(context);
    var key = this.key.eval(context);
    return obj[key];
  }
  get isAssignable() {
    return true;
  }
  assign(context, value) {
    var obj = this.obj.eval(context);
    var key = this.key.eval(context);
    obj[key] = value;
    return value;
  }
  visit(visitor) {
    return visitor.visitKeyedAccess(this);
  }
}
Object.defineProperty(KeyedAccess, "parameters", {get: function() {
    return [[AST], [AST]];
  }});
export class Pipe extends AST {
  constructor(exp, name, args) {
    assert.argumentTypes(exp, AST, name, assert.type.string, args, List);
    super();
    this.exp = exp;
    this.name = name;
    this.args = args;
  }
  visit(visitor) {
    return visitor.visitPipe(this);
  }
}
Object.defineProperty(Pipe, "parameters", {get: function() {
    return [[AST], [assert.type.string], [List]];
  }});
export class LiteralPrimitive extends AST {
  constructor(value) {
    super();
    this.value = value;
  }
  eval(context) {
    return this.value;
  }
  visit(visitor) {
    return visitor.visitLiteralPrimitive(this);
  }
}
export class LiteralArray extends AST {
  constructor(expressions) {
    assert.argumentTypes(expressions, List);
    super();
    this.expressions = expressions;
  }
  eval(context) {
    return ListWrapper.map(this.expressions, (e) => e.eval(context));
  }
  visit(visitor) {
    return visitor.visitLiteralArray(this);
  }
}
Object.defineProperty(LiteralArray, "parameters", {get: function() {
    return [[List]];
  }});
export class LiteralMap extends AST {
  constructor(keys, values) {
    assert.argumentTypes(keys, List, values, List);
    super();
    this.keys = keys;
    this.values = values;
  }
  eval(context) {
    var res = StringMapWrapper.create();
    for (var i = 0; i < this.keys.length; ++i) {
      StringMapWrapper.set(res, this.keys[i], this.values[i].eval(context));
    }
    return res;
  }
  visit(visitor) {
    return visitor.visitLiteralMap(this);
  }
}
Object.defineProperty(LiteralMap, "parameters", {get: function() {
    return [[List], [List]];
  }});
export class Interpolation extends AST {
  constructor(strings, expressions) {
    assert.argumentTypes(strings, List, expressions, List);
    super();
    this.strings = strings;
    this.expressions = expressions;
  }
  eval(context) {
    throw new BaseException("evaluating an Interpolation is not supported");
  }
  visit(visitor) {
    visitor.visitInterpolation(this);
  }
}
Object.defineProperty(Interpolation, "parameters", {get: function() {
    return [[List], [List]];
  }});
export class Binary extends AST {
  constructor(operation, left, right) {
    assert.argumentTypes(operation, assert.type.string, left, AST, right, AST);
    super();
    this.operation = operation;
    this.left = left;
    this.right = right;
  }
  eval(context) {
    var left = this.left.eval(context);
    switch (this.operation) {
      case '&&':
        return left && this.right.eval(context);
      case '||':
        return left || this.right.eval(context);
    }
    var right = this.right.eval(context);
    switch (this.operation) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        return left / right;
      case '%':
        return left % right;
      case '==':
        return left == right;
      case '!=':
        return left != right;
      case '<':
        return left < right;
      case '>':
        return left > right;
      case '<=':
        return left <= right;
      case '>=':
        return left >= right;
      case '^':
        return left ^ right;
      case '&':
        return left & right;
    }
    throw 'Internal error [$operation] not handled';
  }
  visit(visitor) {
    return visitor.visitBinary(this);
  }
}
Object.defineProperty(Binary, "parameters", {get: function() {
    return [[assert.type.string], [AST], [AST]];
  }});
export class PrefixNot extends AST {
  constructor(expression) {
    assert.argumentTypes(expression, AST);
    super();
    this.expression = expression;
  }
  eval(context) {
    return !this.expression.eval(context);
  }
  visit(visitor) {
    return visitor.visitPrefixNot(this);
  }
}
Object.defineProperty(PrefixNot, "parameters", {get: function() {
    return [[AST]];
  }});
export class Assignment extends AST {
  constructor(target, value) {
    assert.argumentTypes(target, AST, value, AST);
    super();
    this.target = target;
    this.value = value;
  }
  eval(context) {
    return this.target.assign(context, this.value.eval(context));
  }
  visit(visitor) {
    return visitor.visitAssignment(this);
  }
}
Object.defineProperty(Assignment, "parameters", {get: function() {
    return [[AST], [AST]];
  }});
export class MethodCall extends AST {
  constructor(receiver, name, fn, args) {
    assert.argumentTypes(receiver, AST, name, assert.type.string, fn, Function, args, List);
    super();
    this.receiver = receiver;
    this.fn = fn;
    this.args = args;
    this.name = name;
  }
  eval(context) {
    var evaluatedContext = this.receiver.eval(context);
    var evaluatedArgs = evalList(context, this.args);
    while (evaluatedContext instanceof ContextWithVariableBindings) {
      if (evaluatedContext.hasBinding(this.name)) {
        var fn = evaluatedContext.get(this.name);
        return FunctionWrapper.apply(fn, evaluatedArgs);
      }
      evaluatedContext = evaluatedContext.parent;
    }
    return this.fn(evaluatedContext, evaluatedArgs);
  }
  visit(visitor) {
    return visitor.visitMethodCall(this);
  }
}
Object.defineProperty(MethodCall, "parameters", {get: function() {
    return [[AST], [assert.type.string], [Function], [List]];
  }});
export class FunctionCall extends AST {
  constructor(target, args) {
    assert.argumentTypes(target, AST, args, List);
    super();
    this.target = target;
    this.args = args;
  }
  eval(context) {
    var obj = this.target.eval(context);
    if (!(obj instanceof Function)) {
      throw new BaseException(`${obj} is not a function`);
    }
    return FunctionWrapper.apply(obj, evalList(context, this.args));
  }
  visit(visitor) {
    return visitor.visitFunctionCall(this);
  }
}
Object.defineProperty(FunctionCall, "parameters", {get: function() {
    return [[AST], [List]];
  }});
export class ASTWithSource extends AST {
  constructor(ast, source, location) {
    assert.argumentTypes(ast, AST, source, assert.type.string, location, assert.type.string);
    super();
    this.source = source;
    this.location = location;
    this.ast = ast;
  }
  eval(context) {
    return this.ast.eval(context);
  }
  get isAssignable() {
    return this.ast.isAssignable;
  }
  assign(context, value) {
    return this.ast.assign(context, value);
  }
  visit(visitor) {
    return this.ast.visit(visitor);
  }
  toString() {
    return assert.returnType((`${this.source} in ${this.location}`), assert.type.string);
  }
}
Object.defineProperty(ASTWithSource, "parameters", {get: function() {
    return [[AST], [assert.type.string], [assert.type.string]];
  }});
export class TemplateBinding {
  constructor(key, keyIsVar, name, expression) {
    assert.argumentTypes(key, assert.type.string, keyIsVar, assert.type.boolean, name, assert.type.string, expression, ASTWithSource);
    super();
    this.key = key;
    this.keyIsVar = keyIsVar;
    this.name = name;
    this.expression = expression;
  }
}
Object.defineProperty(TemplateBinding, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.boolean], [assert.type.string], [ASTWithSource]];
  }});
export class AstVisitor {
  visitAccessMember(ast) {
    assert.argumentTypes(ast, AccessMember);
  }
  visitAssignment(ast) {
    assert.argumentTypes(ast, Assignment);
  }
  visitBinary(ast) {
    assert.argumentTypes(ast, Binary);
  }
  visitChain(ast) {
    assert.argumentTypes(ast, Chain);
  }
  visitConditional(ast) {
    assert.argumentTypes(ast, Conditional);
  }
  visitPipe(ast) {
    assert.argumentTypes(ast, Pipe);
  }
  visitFunctionCall(ast) {
    assert.argumentTypes(ast, FunctionCall);
  }
  visitImplicitReceiver(ast) {
    assert.argumentTypes(ast, ImplicitReceiver);
  }
  visitKeyedAccess(ast) {
    assert.argumentTypes(ast, KeyedAccess);
  }
  visitLiteralArray(ast) {
    assert.argumentTypes(ast, LiteralArray);
  }
  visitLiteralMap(ast) {
    assert.argumentTypes(ast, LiteralMap);
  }
  visitLiteralPrimitive(ast) {
    assert.argumentTypes(ast, LiteralPrimitive);
  }
  visitMethodCall(ast) {
    assert.argumentTypes(ast, MethodCall);
  }
  visitPrefixNot(ast) {
    assert.argumentTypes(ast, PrefixNot);
  }
}
Object.defineProperty(AstVisitor.prototype.visitAccessMember, "parameters", {get: function() {
    return [[AccessMember]];
  }});
Object.defineProperty(AstVisitor.prototype.visitAssignment, "parameters", {get: function() {
    return [[Assignment]];
  }});
Object.defineProperty(AstVisitor.prototype.visitBinary, "parameters", {get: function() {
    return [[Binary]];
  }});
Object.defineProperty(AstVisitor.prototype.visitChain, "parameters", {get: function() {
    return [[Chain]];
  }});
Object.defineProperty(AstVisitor.prototype.visitConditional, "parameters", {get: function() {
    return [[Conditional]];
  }});
Object.defineProperty(AstVisitor.prototype.visitPipe, "parameters", {get: function() {
    return [[Pipe]];
  }});
Object.defineProperty(AstVisitor.prototype.visitFunctionCall, "parameters", {get: function() {
    return [[FunctionCall]];
  }});
Object.defineProperty(AstVisitor.prototype.visitImplicitReceiver, "parameters", {get: function() {
    return [[ImplicitReceiver]];
  }});
Object.defineProperty(AstVisitor.prototype.visitKeyedAccess, "parameters", {get: function() {
    return [[KeyedAccess]];
  }});
Object.defineProperty(AstVisitor.prototype.visitLiteralArray, "parameters", {get: function() {
    return [[LiteralArray]];
  }});
Object.defineProperty(AstVisitor.prototype.visitLiteralMap, "parameters", {get: function() {
    return [[LiteralMap]];
  }});
Object.defineProperty(AstVisitor.prototype.visitLiteralPrimitive, "parameters", {get: function() {
    return [[LiteralPrimitive]];
  }});
Object.defineProperty(AstVisitor.prototype.visitMethodCall, "parameters", {get: function() {
    return [[MethodCall]];
  }});
Object.defineProperty(AstVisitor.prototype.visitPrefixNot, "parameters", {get: function() {
    return [[PrefixNot]];
  }});
var _evalListCache = [[], [0], [0, 0], [0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0, 0]];
function evalList(context, exps) {
  assert.argumentTypes(context, assert.type.any, exps, List);
  var length = exps.length;
  var result = _evalListCache[length];
  for (var i = 0; i < length; i++) {
    result[i] = exps[i].eval(context);
  }
  return result;
}
Object.defineProperty(evalList, "parameters", {get: function() {
    return [[], [List]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/change_detection/parser/ast.map

//# sourceMappingURL=./ast.map