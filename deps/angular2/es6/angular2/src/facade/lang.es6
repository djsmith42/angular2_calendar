import {assert} from "rtts_assert/rtts_assert";
var _global = typeof window === 'undefined' ? global : window;
export {_global as global};
export var Type = Function;
export var Math = _global.Math;
export var Date = _global.Date;
var assertionsEnabled_ = typeof assert !== 'undefined';
var int;
if (assertionsEnabled_) {
  _global.assert = assert;
  int = assert.define('int', function(value) {
    return typeof value === 'number' && value % 1 === 0;
  });
} else {
  int = {};
  _global.assert = function() {};
}
export {int};
export class FIELD {
  constructor(definition) {
    this.definition = definition;
  }
}
export class CONST {}
export class ABSTRACT {}
export class IMPLEMENTS {}
export function isPresent(obj) {
  return assert.returnType((obj !== undefined && obj !== null), assert.type.boolean);
}
export function isBlank(obj) {
  return assert.returnType((obj === undefined || obj === null), assert.type.boolean);
}
export function isString(obj) {
  return assert.returnType((typeof obj === "string"), assert.type.boolean);
}
export function stringify(token) {
  if (typeof token === 'string') {
    return assert.returnType((token), assert.type.string);
  }
  if (token === undefined || token === null) {
    return assert.returnType(('' + token), assert.type.string);
  }
  if (token.name) {
    return assert.returnType((token.name), assert.type.string);
  }
  return assert.returnType((token.toString()), assert.type.string);
}
export class StringWrapper {
  static fromCharCode(code) {
    assert.argumentTypes(code, int);
    return assert.returnType((String.fromCharCode(code)), assert.type.string);
  }
  static charCodeAt(s, index) {
    assert.argumentTypes(s, assert.type.string, index, int);
    return s.charCodeAt(index);
  }
  static split(s, regExp) {
    assert.argumentTypes(s, assert.type.string, regExp, RegExp);
    return s.split(regExp.multiple);
  }
  static equals(s, s2) {
    assert.argumentTypes(s, assert.type.string, s2, assert.type.string);
    return assert.returnType((s === s2), assert.type.boolean);
  }
  static replace(s, from, replace) {
    assert.argumentTypes(s, assert.type.string, from, assert.type.any, replace, assert.type.string);
    if (typeof(from) === "string") {
      return assert.returnType((s.replace(from, replace)), assert.type.string);
    } else {
      return assert.returnType((s.replace(from.single, replace)), assert.type.string);
    }
  }
  static replaceAll(s, from, replace) {
    assert.argumentTypes(s, assert.type.string, from, RegExp, replace, assert.type.string);
    return assert.returnType((s.replace(from.multiple, replace)), assert.type.string);
  }
  static startsWith(s, start) {
    assert.argumentTypes(s, assert.type.string, start, assert.type.string);
    return s.startsWith(start);
  }
  static substring(s, start, end = null) {
    assert.argumentTypes(s, assert.type.string, start, int, end, int);
    return s.substring(start, end === null ? undefined : end);
  }
  static replaceAllMapped(s, from, cb) {
    assert.argumentTypes(s, assert.type.string, from, RegExp, cb, Function);
    return assert.returnType((s.replace(from.multiple, function(...matches) {
      matches.splice(-2, 2);
      return cb(matches);
    })), assert.type.string);
  }
  static contains(s, substr) {
    assert.argumentTypes(s, assert.type.string, substr, assert.type.string);
    return assert.returnType((s.indexOf(substr) != -1), assert.type.boolean);
  }
}
Object.defineProperty(StringWrapper.fromCharCode, "parameters", {get: function() {
    return [[int]];
  }});
Object.defineProperty(StringWrapper.charCodeAt, "parameters", {get: function() {
    return [[assert.type.string], [int]];
  }});
Object.defineProperty(StringWrapper.split, "parameters", {get: function() {
    return [[assert.type.string], [RegExp]];
  }});
Object.defineProperty(StringWrapper.equals, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string]];
  }});
Object.defineProperty(StringWrapper.replace, "parameters", {get: function() {
    return [[assert.type.string], [], [assert.type.string]];
  }});
Object.defineProperty(StringWrapper.replaceAll, "parameters", {get: function() {
    return [[assert.type.string], [RegExp], [assert.type.string]];
  }});
Object.defineProperty(StringWrapper.startsWith, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string]];
  }});
Object.defineProperty(StringWrapper.substring, "parameters", {get: function() {
    return [[assert.type.string], [int], [int]];
  }});
Object.defineProperty(StringWrapper.replaceAllMapped, "parameters", {get: function() {
    return [[assert.type.string], [RegExp], [Function]];
  }});
Object.defineProperty(StringWrapper.contains, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string]];
  }});
export class StringJoiner {
  constructor() {
    this.parts = [];
  }
  add(part) {
    assert.argumentTypes(part, assert.type.string);
    this.parts.push(part);
  }
  toString() {
    return assert.returnType((this.parts.join("")), assert.type.string);
  }
}
Object.defineProperty(StringJoiner.prototype.add, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export class NumberParseError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
  toString() {
    return this.message;
  }
}
export class NumberWrapper {
  static toFixed(n, fractionDigits) {
    assert.argumentTypes(n, assert.type.number, fractionDigits, int);
    return assert.returnType((n.toFixed(fractionDigits)), assert.type.string);
  }
  static equal(a, b) {
    return assert.returnType((a === b), assert.type.boolean);
  }
  static parseIntAutoRadix(text) {
    assert.argumentTypes(text, assert.type.string);
    var result = assert.type(parseInt(text), int);
    if (isNaN(result)) {
      throw new NumberParseError("Invalid integer literal when parsing " + text);
    }
    return assert.returnType((result), int);
  }
  static parseInt(text, radix) {
    assert.argumentTypes(text, assert.type.string, radix, int);
    if (radix == 10) {
      if (/^(\-|\+)?[0-9]+$/.test(text)) {
        return assert.returnType((parseInt(text, radix)), int);
      }
    } else if (radix == 16) {
      if (/^(\-|\+)?[0-9ABCDEFabcdef]+$/.test(text)) {
        return assert.returnType((parseInt(text, radix)), int);
      }
    } else {
      var result = assert.type(parseInt(text, radix), int);
      if (!isNaN(result)) {
        return assert.returnType((result), int);
      }
    }
    throw new NumberParseError("Invalid integer literal when parsing " + text + " in base " + radix);
  }
  static parseFloat(text) {
    assert.argumentTypes(text, assert.type.string);
    return assert.returnType((parseFloat(text)), assert.type.number);
  }
  static get NaN() {
    return assert.returnType((NaN), assert.type.number);
  }
  static isNaN(value) {
    return assert.returnType((isNaN(value)), assert.type.boolean);
  }
  static isInteger(value) {
    return assert.returnType((Number.isInteger(value)), assert.type.boolean);
  }
}
Object.defineProperty(NumberWrapper.toFixed, "parameters", {get: function() {
    return [[assert.type.number], [int]];
  }});
Object.defineProperty(NumberWrapper.parseIntAutoRadix, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(NumberWrapper.parseInt, "parameters", {get: function() {
    return [[assert.type.string], [int]];
  }});
Object.defineProperty(NumberWrapper.parseFloat, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export var RegExp;
if (assertionsEnabled_) {
  RegExp = assert.define('RegExp', function(obj) {
    assert(obj).is(assert.structure({
      single: _global.RegExp,
      multiple: _global.RegExp
    }));
  });
} else {
  RegExp = {};
}
export class RegExpWrapper {
  static create(regExpStr, flags = '') {
    assert.argumentTypes(regExpStr, assert.type.any, flags, assert.type.string);
    flags = flags.replace(/g/g, '');
    return assert.returnType(({
      multiple: new _global.RegExp(regExpStr, flags + 'g'),
      single: new _global.RegExp(regExpStr, flags)
    }), RegExp);
  }
  static firstMatch(regExp, input) {
    return input.match(regExp.single);
  }
  static matcher(regExp, input) {
    return {
      re: regExp.multiple,
      input: input
    };
  }
}
Object.defineProperty(RegExpWrapper.create, "parameters", {get: function() {
    return [[], [assert.type.string]];
  }});
export class RegExpMatcherWrapper {
  static next(matcher) {
    return matcher.re.exec(matcher.input);
  }
}
export class FunctionWrapper {
  static apply(fn, posArgs) {
    assert.argumentTypes(fn, Function, posArgs, assert.type.any);
    return fn.apply(null, posArgs);
  }
}
Object.defineProperty(FunctionWrapper.apply, "parameters", {get: function() {
    return [[Function], []];
  }});
export var BaseException = Error;
export function looseIdentical(a, b) {
  return assert.returnType((a === b || typeof a === "number" && typeof b === "number" && isNaN(a) && isNaN(b)), assert.type.boolean);
}
export function getMapKey(value) {
  return value;
}
export function normalizeBlank(obj) {
  return isBlank(obj) ? null : obj;
}
export function isJsObject(o) {
  return assert.returnType((o !== null && (typeof o === "function" || typeof o === "object")), assert.type.boolean);
}
export function assertionsEnabled() {
  return assert.returnType((assertionsEnabled_), assert.type.boolean);
}
export function print(obj) {
  if (obj instanceof Error) {
    console.log(obj.stack);
  } else {
    console.log(obj);
  }
}
export var Json = _global.JSON;
export class DateWrapper {
  static fromMillis(ms) {
    return new Date(ms);
  }
  static now() {
    return new Date();
  }
}

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/facade/lang.map

//# sourceMappingURL=./lang.map