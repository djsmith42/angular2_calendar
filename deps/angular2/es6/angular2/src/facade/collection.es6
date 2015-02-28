import {assert} from "rtts_assert/rtts_assert";
import {int,
  isJsObject,
  global} from 'angular2/src/facade/lang';
export var List = global.Array;
export var Map = global.Map;
export var Set = global.Set;
export var StringMap = global.Object;
export class MapWrapper {
  static create() {
    return assert.returnType((new Map()), Map);
  }
  static clone(m) {
    assert.argumentTypes(m, Map);
    return assert.returnType((new Map(m)), Map);
  }
  static createFromStringMap(stringMap) {
    var result = MapWrapper.create();
    for (var prop in stringMap) {
      MapWrapper.set(result, prop, stringMap[prop]);
    }
    return assert.returnType((result), Map);
  }
  static createFromPairs(pairs) {
    assert.argumentTypes(pairs, List);
    return assert.returnType((new Map(pairs)), Map);
  }
  static get(m, k) {
    return m.get(k);
  }
  static set(m, k, v) {
    m.set(k, v);
  }
  static contains(m, k) {
    return m.has(k);
  }
  static forEach(m, fn) {
    m.forEach(fn);
  }
  static size(m) {
    return m.size;
  }
  static delete(m, k) {
    m.delete(k);
  }
  static clear(m) {
    m.clear();
  }
  static iterable(m) {
    return m;
  }
  static keys(m) {
    return m.keys();
  }
  static values(m) {
    return m.values();
  }
}
Object.defineProperty(MapWrapper.clone, "parameters", {get: function() {
    return [[Map]];
  }});
Object.defineProperty(MapWrapper.createFromPairs, "parameters", {get: function() {
    return [[List]];
  }});
export class StringMapWrapper {
  static create() {
    return assert.returnType(({}), Object);
  }
  static contains(map, key) {
    return map.hasOwnProperty(key);
  }
  static get(map, key) {
    return map.hasOwnProperty(key) ? map[key] : undefined;
  }
  static set(map, key, value) {
    map[key] = value;
  }
  static isEmpty(map) {
    for (var prop in map) {
      return false;
    }
    return true;
  }
  static forEach(map, callback) {
    for (var prop in map) {
      if (map.hasOwnProperty(prop)) {
        callback(map[prop], prop);
      }
    }
  }
  static merge(m1, m2) {
    var m = {};
    for (var attr in m1) {
      if (m1.hasOwnProperty(attr)) {
        m[attr] = m1[attr];
      }
    }
    for (var attr in m2) {
      if (m2.hasOwnProperty(attr)) {
        m[attr] = m2[attr];
      }
    }
    return m;
  }
}
export class ListWrapper {
  static create() {
    return assert.returnType((new List()), List);
  }
  static createFixedSize(size) {
    return assert.returnType((new List(size)), List);
  }
  static get(m, k) {
    return m[k];
  }
  static set(m, k, v) {
    m[k] = v;
  }
  static clone(array) {
    assert.argumentTypes(array, List);
    return array.slice(0);
  }
  static map(array, fn) {
    return array.map(fn);
  }
  static forEach(array, fn) {
    for (var p of array) {
      fn(p);
    }
  }
  static push(array, el) {
    array.push(el);
  }
  static first(array) {
    if (!array)
      return null;
    return array[0];
  }
  static last(array) {
    if (!array || array.length == 0)
      return null;
    return array[array.length - 1];
  }
  static find(list, pred) {
    assert.argumentTypes(list, List, pred, Function);
    for (var i = 0; i < list.length; ++i) {
      if (pred(list[i]))
        return list[i];
    }
    return null;
  }
  static reduce(list, fn, init) {
    assert.argumentTypes(list, List, fn, Function, init, assert.type.any);
    return list.reduce(fn, init);
  }
  static filter(array, pred) {
    assert.argumentTypes(array, assert.type.any, pred, Function);
    return array.filter(pred);
  }
  static any(list, pred) {
    assert.argumentTypes(list, List, pred, Function);
    for (var i = 0; i < list.length; ++i) {
      if (pred(list[i]))
        return true;
    }
    return false;
  }
  static contains(list, el) {
    assert.argumentTypes(list, List, el, assert.type.any);
    return list.indexOf(el) !== -1;
  }
  static reversed(array) {
    var a = ListWrapper.clone(array);
    return a.reverse();
  }
  static concat(a, b) {
    return a.concat(b);
  }
  static isList(list) {
    return Array.isArray(list);
  }
  static insert(list, index, value) {
    assert.argumentTypes(list, assert.type.any, index, int, value, assert.type.any);
    list.splice(index, 0, value);
  }
  static removeAt(list, index) {
    assert.argumentTypes(list, assert.type.any, index, int);
    var res = list[index];
    list.splice(index, 1);
    return res;
  }
  static removeAll(list, items) {
    for (var i = 0; i < items.length; ++i) {
      var index = list.indexOf(items[i]);
      list.splice(index, 1);
    }
  }
  static removeLast(list) {
    assert.argumentTypes(list, List);
    return list.pop();
  }
  static remove(list, el) {
    var index = list.indexOf(el);
    if (index > -1) {
      list.splice(index, 1);
      return assert.returnType((true), assert.type.boolean);
    }
    return assert.returnType((false), assert.type.boolean);
  }
  static clear(list) {
    list.splice(0, list.length);
  }
  static join(list, s) {
    return list.join(s);
  }
  static isEmpty(list) {
    return list.length == 0;
  }
  static fill(list, value, start = 0, end = null) {
    assert.argumentTypes(list, List, value, assert.type.any, start, int, end, int);
    list.fill(value, start, end === null ? undefined : end);
  }
  static equals(a, b) {
    assert.argumentTypes(a, List, b, List);
    if (a.length != b.length)
      return assert.returnType((false), assert.type.boolean);
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i])
        return assert.returnType((false), assert.type.boolean);
    }
    return assert.returnType((true), assert.type.boolean);
  }
  static slice(l, from, to) {
    assert.argumentTypes(l, List, from, int, to, int);
    return assert.returnType((l.slice(from, to)), List);
  }
  static sort(l, compareFn) {
    assert.argumentTypes(l, List, compareFn, Function);
    l.sort(compareFn);
  }
}
Object.defineProperty(ListWrapper.clone, "parameters", {get: function() {
    return [[List]];
  }});
Object.defineProperty(ListWrapper.find, "parameters", {get: function() {
    return [[List], [Function]];
  }});
Object.defineProperty(ListWrapper.reduce, "parameters", {get: function() {
    return [[List], [Function], []];
  }});
Object.defineProperty(ListWrapper.filter, "parameters", {get: function() {
    return [[], [Function]];
  }});
Object.defineProperty(ListWrapper.any, "parameters", {get: function() {
    return [[List], [Function]];
  }});
Object.defineProperty(ListWrapper.contains, "parameters", {get: function() {
    return [[List], []];
  }});
Object.defineProperty(ListWrapper.insert, "parameters", {get: function() {
    return [[], [int], []];
  }});
Object.defineProperty(ListWrapper.removeAt, "parameters", {get: function() {
    return [[], [int]];
  }});
Object.defineProperty(ListWrapper.removeLast, "parameters", {get: function() {
    return [[List]];
  }});
Object.defineProperty(ListWrapper.fill, "parameters", {get: function() {
    return [[List], [], [int], [int]];
  }});
Object.defineProperty(ListWrapper.equals, "parameters", {get: function() {
    return [[List], [List]];
  }});
Object.defineProperty(ListWrapper.slice, "parameters", {get: function() {
    return [[List], [int], [int]];
  }});
Object.defineProperty(ListWrapper.sort, "parameters", {get: function() {
    return [[List], [Function]];
  }});
export function isListLikeIterable(obj) {
  if (!isJsObject(obj))
    return assert.returnType((false), assert.type.boolean);
  return assert.returnType((ListWrapper.isList(obj) || (!(obj instanceof Map) && Symbol.iterator in obj)), assert.type.boolean);
}
export function iterateListLike(obj, fn) {
  assert.argumentTypes(obj, assert.type.any, fn, Function);
  for (var item of obj) {
    fn(item);
  }
}
Object.defineProperty(iterateListLike, "parameters", {get: function() {
    return [[], [Function]];
  }});
export class SetWrapper {
  static createFromList(lst) {
    assert.argumentTypes(lst, List);
    return new Set(lst);
  }
  static has(s, key) {
    assert.argumentTypes(s, Set, key, assert.type.any);
    return assert.returnType((s.has(key)), assert.type.boolean);
  }
}
Object.defineProperty(SetWrapper.createFromList, "parameters", {get: function() {
    return [[List]];
  }});
Object.defineProperty(SetWrapper.has, "parameters", {get: function() {
    return [[Set], []];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/facade/collection.map

//# sourceMappingURL=./collection.map