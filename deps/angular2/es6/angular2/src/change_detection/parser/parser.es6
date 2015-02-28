import {assert} from "rtts_assert/rtts_assert";
import {FIELD,
  int,
  isBlank,
  isPresent,
  BaseException,
  StringWrapper,
  RegExpWrapper} from 'angular2/src/facade/lang';
import {ListWrapper,
  List} from 'angular2/src/facade/collection';
import {Lexer,
  EOF,
  Token,
  $PERIOD,
  $COLON,
  $SEMICOLON,
  $LBRACKET,
  $RBRACKET,
  $COMMA,
  $LBRACE,
  $RBRACE,
  $LPAREN,
  $RPAREN} from './lexer';
import {reflector,
  Reflector} from 'angular2/src/reflection/reflection';
import {AST,
  EmptyExpr,
  ImplicitReceiver,
  AccessMember,
  LiteralPrimitive,
  Expression,
  Binary,
  PrefixNot,
  Conditional,
  Pipe,
  Assignment,
  Chain,
  KeyedAccess,
  LiteralArray,
  LiteralMap,
  Interpolation,
  MethodCall,
  FunctionCall,
  TemplateBindings,
  TemplateBinding,
  ASTWithSource} from './ast';
var _implicitReceiver = new ImplicitReceiver();
var INTERPOLATION_REGEXP = RegExpWrapper.create('\\{\\{(.*?)\\}\\}');
var QUOTE_REGEXP = RegExpWrapper.create("'");
export class Parser {
  constructor(lexer, providedReflector = null) {
    assert.argumentTypes(lexer, Lexer, providedReflector, Reflector);
    this._lexer = lexer;
    this._reflector = isPresent(providedReflector) ? providedReflector : reflector;
  }
  parseAction(input, location) {
    assert.argumentTypes(input, assert.type.string, location, assert.type.any);
    var tokens = this._lexer.tokenize(input);
    var ast = new _ParseAST(input, location, tokens, this._reflector, true).parseChain();
    return assert.returnType((new ASTWithSource(ast, input, location)), ASTWithSource);
  }
  parseBinding(input, location) {
    assert.argumentTypes(input, assert.type.string, location, assert.type.any);
    var tokens = this._lexer.tokenize(input);
    var ast = new _ParseAST(input, location, tokens, this._reflector, false).parseChain();
    return assert.returnType((new ASTWithSource(ast, input, location)), ASTWithSource);
  }
  addPipes(bindingAst, pipes) {
    if (ListWrapper.isEmpty(pipes))
      return assert.returnType((bindingAst), ASTWithSource);
    var res = ListWrapper.reduce(pipes, (result, currentPipeName) => new Pipe(result, currentPipeName, []), bindingAst.ast);
    return assert.returnType((new ASTWithSource(res, bindingAst.source, bindingAst.location)), ASTWithSource);
  }
  parseTemplateBindings(input, location) {
    assert.argumentTypes(input, assert.type.string, location, assert.type.any);
    var tokens = this._lexer.tokenize(input);
    return assert.returnType((new _ParseAST(input, location, tokens, this._reflector, false).parseTemplateBindings()), assert.genericType(List, TemplateBinding));
  }
  parseInterpolation(input, location) {
    assert.argumentTypes(input, assert.type.string, location, assert.type.any);
    var parts = StringWrapper.split(input, INTERPOLATION_REGEXP);
    if (parts.length <= 1) {
      return assert.returnType((null), ASTWithSource);
    }
    var strings = [];
    var expressions = [];
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      if (i % 2 === 0) {
        ListWrapper.push(strings, part);
      } else {
        var tokens = this._lexer.tokenize(part);
        var ast = new _ParseAST(input, location, tokens, this._reflector, false).parseChain();
        ListWrapper.push(expressions, ast);
      }
    }
    return assert.returnType((new ASTWithSource(new Interpolation(strings, expressions), input, location)), ASTWithSource);
  }
  wrapLiteralPrimitive(input, location) {
    assert.argumentTypes(input, assert.type.string, location, assert.type.any);
    return assert.returnType((new ASTWithSource(new LiteralPrimitive(input), input, location)), ASTWithSource);
  }
}
Object.defineProperty(Parser, "parameters", {get: function() {
    return [[Lexer], [Reflector]];
  }});
Object.defineProperty(Parser.prototype.parseAction, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.any]];
  }});
Object.defineProperty(Parser.prototype.parseBinding, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.any]];
  }});
Object.defineProperty(Parser.prototype.addPipes, "parameters", {get: function() {
    return [[ASTWithSource], [assert.genericType(List, String)]];
  }});
Object.defineProperty(Parser.prototype.parseTemplateBindings, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.any]];
  }});
Object.defineProperty(Parser.prototype.parseInterpolation, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.any]];
  }});
Object.defineProperty(Parser.prototype.wrapLiteralPrimitive, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.any]];
  }});
class _ParseAST {
  constructor(input, location, tokens, reflector, parseAction) {
    assert.argumentTypes(input, assert.type.string, location, assert.type.any, tokens, List, reflector, Reflector, parseAction, assert.type.boolean);
    this.input = input;
    this.location = location;
    this.tokens = tokens;
    this.index = 0;
    this.reflector = reflector;
    this.parseAction = parseAction;
  }
  peek(offset) {
    assert.argumentTypes(offset, int);
    var i = this.index + offset;
    return assert.returnType((i < this.tokens.length ? this.tokens[i] : EOF), Token);
  }
  get next() {
    return assert.returnType((this.peek(0)), Token);
  }
  get inputIndex() {
    return assert.returnType(((this.index < this.tokens.length) ? this.next.index : this.input.length), int);
  }
  advance() {
    this.index++;
  }
  optionalCharacter(code) {
    assert.argumentTypes(code, int);
    if (this.next.isCharacter(code)) {
      this.advance();
      return assert.returnType((true), assert.type.boolean);
    } else {
      return assert.returnType((false), assert.type.boolean);
    }
  }
  optionalKeywordVar() {
    if (this.peekKeywordVar()) {
      this.advance();
      return assert.returnType((true), assert.type.boolean);
    } else {
      return assert.returnType((false), assert.type.boolean);
    }
  }
  peekKeywordVar() {
    return assert.returnType((this.next.isKeywordVar() || this.next.isOperator('#')), assert.type.boolean);
  }
  expectCharacter(code) {
    assert.argumentTypes(code, int);
    if (this.optionalCharacter(code))
      return ;
    this.error(`Missing expected ${StringWrapper.fromCharCode(code)}`);
  }
  optionalOperator(op) {
    assert.argumentTypes(op, assert.type.string);
    if (this.next.isOperator(op)) {
      this.advance();
      return assert.returnType((true), assert.type.boolean);
    } else {
      return assert.returnType((false), assert.type.boolean);
    }
  }
  expectOperator(operator) {
    assert.argumentTypes(operator, assert.type.string);
    if (this.optionalOperator(operator))
      return ;
    this.error(`Missing expected operator ${operator}`);
  }
  expectIdentifierOrKeyword() {
    var n = this.next;
    if (!n.isIdentifier() && !n.isKeyword()) {
      this.error(`Unexpected token ${n}, expected identifier or keyword`);
    }
    this.advance();
    return assert.returnType((n.toString()), assert.type.string);
  }
  expectIdentifierOrKeywordOrString() {
    var n = this.next;
    if (!n.isIdentifier() && !n.isKeyword() && !n.isString()) {
      this.error(`Unexpected token ${n}, expected identifier, keyword, or string`);
    }
    this.advance();
    return assert.returnType((n.toString()), assert.type.string);
  }
  parseChain() {
    var exprs = [];
    while (this.index < this.tokens.length) {
      var expr = this.parsePipe();
      ListWrapper.push(exprs, expr);
      if (this.optionalCharacter($SEMICOLON)) {
        if (!this.parseAction) {
          this.error("Binding expression cannot contain chained expression");
        }
        while (this.optionalCharacter($SEMICOLON)) {}
      } else if (this.index < this.tokens.length) {
        this.error(`Unexpected token '${this.next}'`);
      }
    }
    if (exprs.length == 0)
      return assert.returnType((new EmptyExpr()), AST);
    if (exprs.length == 1)
      return assert.returnType((exprs[0]), AST);
    return assert.returnType((new Chain(exprs)), AST);
  }
  parsePipe() {
    var result = this.parseExpression();
    while (this.optionalOperator("|")) {
      if (this.parseAction) {
        this.error("Cannot have a pipe in an action expression");
      }
      var name = this.expectIdentifierOrKeyword();
      var args = ListWrapper.create();
      while (this.optionalCharacter($COLON)) {
        ListWrapper.push(args, this.parseExpression());
      }
      result = new Pipe(result, name, args);
    }
    return result;
  }
  parseExpression() {
    var start = this.inputIndex;
    var result = this.parseConditional();
    while (this.next.isOperator('=')) {
      if (!result.isAssignable) {
        var end = this.inputIndex;
        var expression = this.input.substring(start, end);
        this.error(`Expression ${expression} is not assignable`);
      }
      if (!this.parseAction) {
        this.error("Binding expression cannot contain assignments");
      }
      this.expectOperator('=');
      result = new Assignment(result, this.parseConditional());
    }
    return result;
  }
  parseConditional() {
    var start = this.inputIndex;
    var result = this.parseLogicalOr();
    if (this.optionalOperator('?')) {
      var yes = this.parseExpression();
      if (!this.optionalCharacter($COLON)) {
        var end = this.inputIndex;
        var expression = this.input.substring(start, end);
        this.error(`Conditional expression ${expression} requires all 3 expressions`);
      }
      var no = this.parseExpression();
      return new Conditional(result, yes, no);
    } else {
      return result;
    }
  }
  parseLogicalOr() {
    var result = this.parseLogicalAnd();
    while (this.optionalOperator('||')) {
      result = new Binary('||', result, this.parseLogicalAnd());
    }
    return result;
  }
  parseLogicalAnd() {
    var result = this.parseEquality();
    while (this.optionalOperator('&&')) {
      result = new Binary('&&', result, this.parseEquality());
    }
    return result;
  }
  parseEquality() {
    var result = this.parseRelational();
    while (true) {
      if (this.optionalOperator('==')) {
        result = new Binary('==', result, this.parseRelational());
      } else if (this.optionalOperator('!=')) {
        result = new Binary('!=', result, this.parseRelational());
      } else {
        return result;
      }
    }
  }
  parseRelational() {
    var result = this.parseAdditive();
    while (true) {
      if (this.optionalOperator('<')) {
        result = new Binary('<', result, this.parseAdditive());
      } else if (this.optionalOperator('>')) {
        result = new Binary('>', result, this.parseAdditive());
      } else if (this.optionalOperator('<=')) {
        result = new Binary('<=', result, this.parseAdditive());
      } else if (this.optionalOperator('>=')) {
        result = new Binary('>=', result, this.parseAdditive());
      } else {
        return result;
      }
    }
  }
  parseAdditive() {
    var result = this.parseMultiplicative();
    while (true) {
      if (this.optionalOperator('+')) {
        result = new Binary('+', result, this.parseMultiplicative());
      } else if (this.optionalOperator('-')) {
        result = new Binary('-', result, this.parseMultiplicative());
      } else {
        return result;
      }
    }
  }
  parseMultiplicative() {
    var result = this.parsePrefix();
    while (true) {
      if (this.optionalOperator('*')) {
        result = new Binary('*', result, this.parsePrefix());
      } else if (this.optionalOperator('%')) {
        result = new Binary('%', result, this.parsePrefix());
      } else if (this.optionalOperator('/')) {
        result = new Binary('/', result, this.parsePrefix());
      } else {
        return result;
      }
    }
  }
  parsePrefix() {
    if (this.optionalOperator('+')) {
      return this.parsePrefix();
    } else if (this.optionalOperator('-')) {
      return new Binary('-', new LiteralPrimitive(0), this.parsePrefix());
    } else if (this.optionalOperator('!')) {
      return new PrefixNot(this.parsePrefix());
    } else {
      return this.parseCallChain();
    }
  }
  parseCallChain() {
    var result = this.parsePrimary();
    while (true) {
      if (this.optionalCharacter($PERIOD)) {
        result = this.parseAccessMemberOrMethodCall(result);
      } else if (this.optionalCharacter($LBRACKET)) {
        var key = this.parseExpression();
        this.expectCharacter($RBRACKET);
        result = new KeyedAccess(result, key);
      } else if (this.optionalCharacter($LPAREN)) {
        var args = this.parseCallArguments();
        this.expectCharacter($RPAREN);
        result = new FunctionCall(result, args);
      } else {
        return assert.returnType((result), AST);
      }
    }
  }
  parsePrimary() {
    if (this.optionalCharacter($LPAREN)) {
      var result = this.parsePipe();
      this.expectCharacter($RPAREN);
      return result;
    } else if (this.next.isKeywordNull() || this.next.isKeywordUndefined()) {
      this.advance();
      return new LiteralPrimitive(null);
    } else if (this.next.isKeywordTrue()) {
      this.advance();
      return new LiteralPrimitive(true);
    } else if (this.next.isKeywordFalse()) {
      this.advance();
      return new LiteralPrimitive(false);
    } else if (this.optionalCharacter($LBRACKET)) {
      var elements = this.parseExpressionList($RBRACKET);
      this.expectCharacter($RBRACKET);
      return new LiteralArray(elements);
    } else if (this.next.isCharacter($LBRACE)) {
      return this.parseLiteralMap();
    } else if (this.next.isIdentifier()) {
      return this.parseAccessMemberOrMethodCall(_implicitReceiver);
    } else if (this.next.isNumber()) {
      var value = this.next.toNumber();
      this.advance();
      return new LiteralPrimitive(value);
    } else if (this.next.isString()) {
      var value = this.next.toString();
      this.advance();
      return new LiteralPrimitive(value);
    } else if (this.index >= this.tokens.length) {
      this.error(`Unexpected end of expression: ${this.input}`);
    } else {
      this.error(`Unexpected token ${this.next}`);
    }
  }
  parseExpressionList(terminator) {
    assert.argumentTypes(terminator, int);
    var result = [];
    if (!this.next.isCharacter(terminator)) {
      do {
        ListWrapper.push(result, this.parseExpression());
      } while (this.optionalCharacter($COMMA));
    }
    return assert.returnType((result), List);
  }
  parseLiteralMap() {
    var keys = [];
    var values = [];
    this.expectCharacter($LBRACE);
    if (!this.optionalCharacter($RBRACE)) {
      do {
        var key = this.expectIdentifierOrKeywordOrString();
        ListWrapper.push(keys, key);
        this.expectCharacter($COLON);
        ListWrapper.push(values, this.parseExpression());
      } while (this.optionalCharacter($COMMA));
      this.expectCharacter($RBRACE);
    }
    return new LiteralMap(keys, values);
  }
  parseAccessMemberOrMethodCall(receiver) {
    var id = this.expectIdentifierOrKeyword();
    if (this.optionalCharacter($LPAREN)) {
      var args = this.parseCallArguments();
      this.expectCharacter($RPAREN);
      var fn = this.reflector.method(id);
      return assert.returnType((new MethodCall(receiver, id, fn, args)), AST);
    } else {
      var getter = this.reflector.getter(id);
      var setter = this.reflector.setter(id);
      return assert.returnType((new AccessMember(receiver, id, getter, setter)), AST);
    }
  }
  parseCallArguments() {
    if (this.next.isCharacter($RPAREN))
      return [];
    var positionals = [];
    do {
      ListWrapper.push(positionals, this.parseExpression());
    } while (this.optionalCharacter($COMMA));
    return positionals;
  }
  expectTemplateBindingKey() {
    var result = '';
    var operatorFound = false;
    do {
      result += this.expectIdentifierOrKeywordOrString();
      operatorFound = this.optionalOperator('-');
      if (operatorFound) {
        result += '-';
      }
    } while (operatorFound);
    return result.toString();
  }
  parseTemplateBindings() {
    var bindings = [];
    while (this.index < this.tokens.length) {
      var keyIsVar = assert.type(this.optionalKeywordVar(), assert.type.boolean);
      var key = this.expectTemplateBindingKey();
      this.optionalCharacter($COLON);
      var name = null;
      var expression = null;
      if (this.next !== EOF) {
        if (keyIsVar) {
          if (this.optionalOperator("=")) {
            name = this.expectTemplateBindingKey();
          } else {
            name = '\$implicit';
          }
        } else if (!this.peekKeywordVar()) {
          var start = this.inputIndex;
          var ast = this.parseExpression();
          var source = this.input.substring(start, this.inputIndex);
          expression = new ASTWithSource(ast, source, this.location);
        }
      }
      ListWrapper.push(bindings, new TemplateBinding(key, keyIsVar, name, expression));
      if (!this.optionalCharacter($SEMICOLON)) {
        this.optionalCharacter($COMMA);
      }
      ;
    }
    return bindings;
  }
  error(message, index = null) {
    assert.argumentTypes(message, assert.type.string, index, int);
    if (isBlank(index))
      index = this.index;
    var location = (index < this.tokens.length) ? `at column ${this.tokens[index].index + 1} in` : `at the end of the expression`;
    throw new BaseException(`Parser Error: ${message} ${location} [${this.input}] in ${this.location}`);
  }
}
Object.defineProperty(_ParseAST, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.any], [List], [Reflector], [assert.type.boolean]];
  }});
Object.defineProperty(_ParseAST.prototype.peek, "parameters", {get: function() {
    return [[int]];
  }});
Object.defineProperty(_ParseAST.prototype.optionalCharacter, "parameters", {get: function() {
    return [[int]];
  }});
Object.defineProperty(_ParseAST.prototype.expectCharacter, "parameters", {get: function() {
    return [[int]];
  }});
Object.defineProperty(_ParseAST.prototype.optionalOperator, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(_ParseAST.prototype.expectOperator, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(_ParseAST.prototype.parseExpressionList, "parameters", {get: function() {
    return [[int]];
  }});
Object.defineProperty(_ParseAST.prototype.error, "parameters", {get: function() {
    return [[assert.type.string], [int]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/change_detection/parser/parser.map

//# sourceMappingURL=./parser.map