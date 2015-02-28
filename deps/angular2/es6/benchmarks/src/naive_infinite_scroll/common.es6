import {assert} from "rtts_assert/rtts_assert";
import {int} from 'angular2/src/facade/lang';
import {Math} from 'angular2/src/facade/math';
import {PromiseWrapper} from 'angular2/src/facade/async';
import {ListWrapper,
  MapWrapper} from 'angular2/src/facade/collection';
export var ITEMS = 1000;
export var ITEM_HEIGHT = 40;
export var VISIBLE_ITEMS = 17;
export var HEIGHT = ITEMS * ITEM_HEIGHT;
export var VIEW_PORT_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
export var COMPANY_NAME_WIDTH = 100;
export var OPPORTUNITY_NAME_WIDTH = 100;
export var OFFERING_NAME_WIDTH = 100;
export var ACCOUNT_CELL_WIDTH = 50;
export var BASE_POINTS_WIDTH = 50;
export var KICKER_POINTS_WIDTH = 50;
export var STAGE_BUTTONS_WIDTH = 220;
export var BUNDLES_WIDTH = 120;
export var DUE_DATE_WIDTH = 100;
export var END_DATE_WIDTH = 100;
export var AAT_STATUS_WIDTH = 100;
export var ROW_WIDTH = COMPANY_NAME_WIDTH + OPPORTUNITY_NAME_WIDTH + OFFERING_NAME_WIDTH + ACCOUNT_CELL_WIDTH + BASE_POINTS_WIDTH + KICKER_POINTS_WIDTH + STAGE_BUTTONS_WIDTH + BUNDLES_WIDTH + DUE_DATE_WIDTH + END_DATE_WIDTH + AAT_STATUS_WIDTH;
export var STATUS_LIST = ['Planned', 'Pitched', 'Won', 'Lost'];
export var AAT_STATUS_LIST = ['Active', 'Passive', 'Abandoned'];
export class CustomDate {
  constructor(y, m, d) {
    assert.argumentTypes(y, int, m, int, d, int);
    this.year = y;
    this.month = m;
    this.day = d;
  }
  addDays(days) {
    assert.argumentTypes(days, int);
    var newDay = this.day + days;
    var newMonth = this.month + Math.floor(newDay / 30);
    newDay = newDay % 30;
    var newYear = this.year + Math.floor(newMonth / 12);
    return assert.returnType((new CustomDate(newYear, newMonth, newDay)), CustomDate);
  }
  static now() {
    return assert.returnType((new CustomDate(2014, 1, 28)), CustomDate);
  }
}
Object.defineProperty(CustomDate, "parameters", {get: function() {
    return [[int], [int], [int]];
  }});
Object.defineProperty(CustomDate.prototype.addDays, "parameters", {get: function() {
    return [[int]];
  }});
export class RawEntity {
  constructor() {
    this._data = MapWrapper.create();
  }
  get(key) {
    assert.argumentTypes(key, assert.type.string);
    if (key.indexOf('.') == -1) {
      return this._data[key];
    }
    var pieces = key.split('.');
    var last = ListWrapper.last(pieces);
    pieces.length = pieces.length - 1;
    var target = _resolve(pieces, this);
    if (target == null) {
      return null;
    }
    return target[last];
  }
  set(key, value) {
    assert.argumentTypes(key, assert.type.string, value, assert.type.any);
    if (key.indexOf('.') == -1) {
      this._data[key] = value;
      return ;
    }
    var pieces = key.split('.');
    var last = ListWrapper.last(pieces);
    pieces.length = pieces.length - 1;
    var target = _resolve(pieces, this);
    target[last] = value;
  }
  remove(key) {
    assert.argumentTypes(key, assert.type.string);
    if (!key.contains('.')) {
      return this._data.remove(key);
    }
    var pieces = key.split('.');
    var last = ListWrapper.last(pieces);
    pieces.length = pieces.length - 1;
    var target = _resolve(pieces, this);
    return target.remove(last);
  }
  _resolve(pieces, start) {
    var cur = start;
    for (var i = 0; i < pieces.length; i++) {
      cur = cur[pieces[i]];
      if (cur == null) {
        return null;
      }
    }
    return cur;
  }
}
Object.defineProperty(RawEntity.prototype.get, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(RawEntity.prototype.set, "parameters", {get: function() {
    return [[assert.type.string], []];
  }});
Object.defineProperty(RawEntity.prototype.remove, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export class Company extends RawEntity {
  get name() {
    return assert.returnType((this.get('name')), assert.type.string);
  }
  set name(val) {
    assert.argumentTypes(val, assert.type.string);
    this.set('name', val);
  }
}
Object.defineProperty(Object.getOwnPropertyDescriptor(Company.prototype, "name").set, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export class Offering extends RawEntity {
  get name() {
    return assert.returnType((this.get('name')), assert.type.string);
  }
  set name(val) {
    assert.argumentTypes(val, assert.type.string);
    this.set('name', val);
  }
  get company() {
    return assert.returnType((this.get('company')), Company);
  }
  set company(val) {
    assert.argumentTypes(val, Company);
    this.set('company', val);
  }
  get opportunity() {
    return assert.returnType((this.get('opportunity')), Opportunity);
  }
  set opportunity(val) {
    assert.argumentTypes(val, Opportunity);
    this.set('opportunity', val);
  }
  get account() {
    return assert.returnType((this.get('account')), Account);
  }
  set account(val) {
    assert.argumentTypes(val, Account);
    this.set('account', val);
  }
  get basePoints() {
    return assert.returnType((this.get('basePoints')), int);
  }
  set basePoints(val) {
    assert.argumentTypes(val, int);
    this.set('basePoints', val);
  }
  get kickerPoints() {
    return assert.returnType((this.get('kickerPoints')), int);
  }
  set kickerPoints(val) {
    assert.argumentTypes(val, int);
    this.set('kickerPoints', val);
  }
  get status() {
    return assert.returnType((this.get('status')), assert.type.string);
  }
  set status(val) {
    assert.argumentTypes(val, assert.type.string);
    this.set('status', val);
  }
  get bundles() {
    return assert.returnType((this.get('bundles')), assert.type.string);
  }
  set bundles(val) {
    assert.argumentTypes(val, assert.type.string);
    this.set('bundles', val);
  }
  get dueDate() {
    return assert.returnType((this.get('dueDate')), CustomDate);
  }
  set dueDate(val) {
    assert.argumentTypes(val, CustomDate);
    this.set('dueDate', val);
  }
  get endDate() {
    return assert.returnType((this.get('endDate')), CustomDate);
  }
  set endDate(val) {
    assert.argumentTypes(val, CustomDate);
    this.set('endDate', val);
  }
  get aatStatus() {
    return assert.returnType((this.get('aatStatus')), assert.type.string);
  }
  set aatStatus(val) {
    assert.argumentTypes(val, assert.type.string);
    this.set('aatStatus', val);
  }
}
Object.defineProperty(Object.getOwnPropertyDescriptor(Offering.prototype, "name").set, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(Object.getOwnPropertyDescriptor(Offering.prototype, "company").set, "parameters", {get: function() {
    return [[Company]];
  }});
Object.defineProperty(Object.getOwnPropertyDescriptor(Offering.prototype, "opportunity").set, "parameters", {get: function() {
    return [[Opportunity]];
  }});
Object.defineProperty(Object.getOwnPropertyDescriptor(Offering.prototype, "account").set, "parameters", {get: function() {
    return [[Account]];
  }});
Object.defineProperty(Object.getOwnPropertyDescriptor(Offering.prototype, "basePoints").set, "parameters", {get: function() {
    return [[int]];
  }});
Object.defineProperty(Object.getOwnPropertyDescriptor(Offering.prototype, "kickerPoints").set, "parameters", {get: function() {
    return [[int]];
  }});
Object.defineProperty(Object.getOwnPropertyDescriptor(Offering.prototype, "status").set, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(Object.getOwnPropertyDescriptor(Offering.prototype, "bundles").set, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(Object.getOwnPropertyDescriptor(Offering.prototype, "dueDate").set, "parameters", {get: function() {
    return [[CustomDate]];
  }});
Object.defineProperty(Object.getOwnPropertyDescriptor(Offering.prototype, "endDate").set, "parameters", {get: function() {
    return [[CustomDate]];
  }});
Object.defineProperty(Object.getOwnPropertyDescriptor(Offering.prototype, "aatStatus").set, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export class Opportunity extends RawEntity {
  get name() {
    return assert.returnType((this.get('name')), assert.type.string);
  }
  set name(val) {
    assert.argumentTypes(val, assert.type.string);
    this.set('name', val);
  }
}
Object.defineProperty(Object.getOwnPropertyDescriptor(Opportunity.prototype, "name").set, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export class Account extends RawEntity {
  get accountId() {
    return assert.returnType((this.get('accountId')), int);
  }
  set accountId(val) {
    assert.argumentTypes(val, int);
    this.set('accountId', val);
  }
}
Object.defineProperty(Object.getOwnPropertyDescriptor(Account.prototype, "accountId").set, "parameters", {get: function() {
    return [[int]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/benchmarks/src/naive_infinite_scroll/common.map

//# sourceMappingURL=./common.map