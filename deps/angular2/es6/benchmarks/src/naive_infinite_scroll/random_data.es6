import {assert} from "rtts_assert/rtts_assert";
import {int,
  StringWrapper} from 'angular2/src/facade/lang';
import {List,
  ListWrapper} from 'angular2/src/facade/collection';
import {CustomDate,
  Offering,
  Company,
  Opportunity,
  Account,
  STATUS_LIST,
  AAT_STATUS_LIST} from './common';
export function generateOfferings(count) {
  assert.argumentTypes(count, int);
  var res = [];
  for (var i = 0; i < count; i++) {
    ListWrapper.push(res, generateOffering(i));
  }
  return assert.returnType((res), assert.genericType(List, Offering));
}
Object.defineProperty(generateOfferings, "parameters", {get: function() {
    return [[int]];
  }});
export function generateOffering(seed) {
  assert.argumentTypes(seed, int);
  var res = new Offering();
  res.name = generateName(seed++);
  res.company = generateCompany(seed++);
  res.opportunity = generateOpportunity(seed++);
  res.account = generateAccount(seed++);
  res.basePoints = seed % 10;
  res.kickerPoints = seed % 4;
  res.status = STATUS_LIST[seed % STATUS_LIST.length];
  res.bundles = randomString(seed++);
  res.dueDate = randomDate(seed++);
  res.endDate = randomDate(seed++, res.dueDate);
  res.aatStatus = AAT_STATUS_LIST[seed % AAT_STATUS_LIST.length];
  return assert.returnType((res), Offering);
}
Object.defineProperty(generateOffering, "parameters", {get: function() {
    return [[int]];
  }});
export function generateCompany(seed) {
  assert.argumentTypes(seed, int);
  var res = new Company();
  res.name = generateName(seed);
  return assert.returnType((res), Company);
}
Object.defineProperty(generateCompany, "parameters", {get: function() {
    return [[int]];
  }});
export function generateOpportunity(seed) {
  assert.argumentTypes(seed, int);
  var res = new Opportunity();
  res.name = generateName(seed);
  return assert.returnType((res), Opportunity);
}
Object.defineProperty(generateOpportunity, "parameters", {get: function() {
    return [[int]];
  }});
export function generateAccount(seed) {
  assert.argumentTypes(seed, int);
  var res = new Account();
  res.accountId = seed;
  return assert.returnType((res), Account);
}
Object.defineProperty(generateAccount, "parameters", {get: function() {
    return [[int]];
  }});
var names = ['Foo', 'Bar', 'Baz', 'Qux', 'Quux', 'Garply', 'Waldo', 'Fred', 'Plugh', 'Xyzzy', 'Thud', 'Cruft', 'Stuff'];
function generateName(seed) {
  assert.argumentTypes(seed, int);
  return assert.returnType((names[seed % names.length]), assert.type.string);
}
Object.defineProperty(generateName, "parameters", {get: function() {
    return [[int]];
  }});
var offsets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
function randomDate(seed, minDate = null) {
  assert.argumentTypes(seed, int, minDate, CustomDate);
  if (minDate == null) {
    minDate = CustomDate.now();
  }
  return assert.returnType((minDate.addDays(offsets[seed % offsets.length])), CustomDate);
}
Object.defineProperty(randomDate, "parameters", {get: function() {
    return [[int], [CustomDate]];
  }});
var stringLengths = [5, 7, 9, 11, 13];
var charCodeOffsets = [0, 1, 2, 3, 4, 5, 6, 7, 8];
function randomString(seed) {
  assert.argumentTypes(seed, int);
  var len = stringLengths[seed % 5];
  var str = '';
  for (var i = 0; i < len; i++) {
    str += StringWrapper.fromCharCode(97 + charCodeOffsets[seed % 9] + i);
  }
  return assert.returnType((str), assert.type.string);
}
Object.defineProperty(randomString, "parameters", {get: function() {
    return [[int]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/benchmarks/src/naive_infinite_scroll/random_data.map

//# sourceMappingURL=./random_data.map