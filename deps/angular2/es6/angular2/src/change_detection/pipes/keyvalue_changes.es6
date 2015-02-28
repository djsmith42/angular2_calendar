import {assert} from "rtts_assert/rtts_assert";
import {ListWrapper,
  MapWrapper,
  StringMapWrapper} from 'angular2/src/facade/collection';
import {stringify,
  looseIdentical,
  isJsObject} from 'angular2/src/facade/lang';
export class KeyValueChanges {
  constructor() {
    this._records = MapWrapper.create();
    this._mapHead = null;
    this._previousMapHead = null;
    this._changesHead = null;
    this._changesTail = null;
    this._additionsHead = null;
    this._additionsTail = null;
    this._removalsHead = null;
    this._removalsTail = null;
  }
  static supports(obj) {
    return assert.returnType((obj instanceof Map || isJsObject(obj)), assert.type.boolean);
  }
  supportsObj(obj) {
    return assert.returnType((KeyValueChanges.supports(obj)), assert.type.boolean);
  }
  get isDirty() {
    return assert.returnType((this._additionsHead !== null || this._changesHead !== null || this._removalsHead !== null), assert.type.boolean);
  }
  forEachItem(fn) {
    assert.argumentTypes(fn, Function);
    var record;
    for (record = this._mapHead; record !== null; record = record._next) {
      fn(record);
    }
  }
  forEachPreviousItem(fn) {
    assert.argumentTypes(fn, Function);
    var record;
    for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
      fn(record);
    }
  }
  forEachChangedItem(fn) {
    assert.argumentTypes(fn, Function);
    var record;
    for (record = this._changesHead; record !== null; record = record._nextChanged) {
      fn(record);
    }
  }
  forEachAddedItem(fn) {
    assert.argumentTypes(fn, Function);
    var record;
    for (record = this._additionsHead; record !== null; record = record._nextAdded) {
      fn(record);
    }
  }
  forEachRemovedItem(fn) {
    assert.argumentTypes(fn, Function);
    var record;
    for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
      fn(record);
    }
  }
  check(map) {
    this._reset();
    var records = this._records;
    var oldSeqRecord = assert.type(this._mapHead, KVChangeRecord);
    var lastOldSeqRecord = assert.type(null, KVChangeRecord);
    var lastNewSeqRecord = assert.type(null, KVChangeRecord);
    var seqChanged = assert.type(false, assert.type.boolean);
    this._forEach(map, (value, key) => {
      var newSeqRecord;
      if (oldSeqRecord !== null && key === oldSeqRecord.key) {
        newSeqRecord = oldSeqRecord;
        if (!looseIdentical(value, oldSeqRecord._currentValue)) {
          oldSeqRecord._previousValue = oldSeqRecord._currentValue;
          oldSeqRecord._currentValue = value;
          this._addToChanges(oldSeqRecord);
        }
      } else {
        seqChanged = true;
        if (oldSeqRecord !== null) {
          oldSeqRecord._next = null;
          this._removeFromSeq(lastOldSeqRecord, oldSeqRecord);
          this._addToRemovals(oldSeqRecord);
        }
        if (MapWrapper.contains(records, key)) {
          newSeqRecord = MapWrapper.get(records, key);
        } else {
          newSeqRecord = new KVChangeRecord(key);
          MapWrapper.set(records, key, newSeqRecord);
          newSeqRecord._currentValue = value;
          this._addToAdditions(newSeqRecord);
        }
      }
      if (seqChanged) {
        if (this._isInRemovals(newSeqRecord)) {
          this._removeFromRemovals(newSeqRecord);
        }
        if (lastNewSeqRecord == null) {
          this._mapHead = newSeqRecord;
        } else {
          lastNewSeqRecord._next = newSeqRecord;
        }
      }
      lastOldSeqRecord = oldSeqRecord;
      lastNewSeqRecord = newSeqRecord;
      oldSeqRecord = oldSeqRecord === null ? null : oldSeqRecord._next;
    });
    this._truncate(lastOldSeqRecord, oldSeqRecord);
    return assert.returnType((this.isDirty), assert.type.boolean);
  }
  _reset() {
    if (this.isDirty) {
      var record;
      for (record = this._previousMapHead = this._mapHead; record !== null; record = record._next) {
        record._nextPrevious = record._next;
      }
      for (record = this._changesHead; record !== null; record = record._nextChanged) {
        record._previousValue = record._currentValue;
      }
      for (record = this._additionsHead; record != null; record = record._nextAdded) {
        record._previousValue = record._currentValue;
      }
      this._changesHead = this._changesTail = null;
      this._additionsHead = this._additionsTail = null;
      this._removalsHead = this._removalsTail = null;
    }
  }
  _truncate(lastRecord, record) {
    assert.argumentTypes(lastRecord, KVChangeRecord, record, KVChangeRecord);
    while (record !== null) {
      if (lastRecord === null) {
        this._mapHead = null;
      } else {
        lastRecord._next = null;
      }
      var nextRecord = record._next;
      this._addToRemovals(record);
      lastRecord = record;
      record = nextRecord;
    }
    for (var rec = assert.type(this._removalsHead, KVChangeRecord); rec !== null; rec = rec._nextRemoved) {
      rec._previousValue = rec._currentValue;
      rec._currentValue = null;
      MapWrapper.delete(this._records, rec.key);
    }
  }
  _isInRemovals(record) {
    assert.argumentTypes(record, KVChangeRecord);
    return record === this._removalsHead || record._nextRemoved !== null || record._prevRemoved !== null;
  }
  _addToRemovals(record) {
    assert.argumentTypes(record, KVChangeRecord);
    if (this._removalsHead === null) {
      this._removalsHead = this._removalsTail = record;
    } else {
      this._removalsTail._nextRemoved = record;
      record._prevRemoved = this._removalsTail;
      this._removalsTail = record;
    }
  }
  _removeFromSeq(prev, record) {
    assert.argumentTypes(prev, KVChangeRecord, record, KVChangeRecord);
    var next = record._next;
    if (prev === null) {
      this._mapHead = next;
    } else {
      prev._next = next;
    }
  }
  _removeFromRemovals(record) {
    assert.argumentTypes(record, KVChangeRecord);
    var prev = record._prevRemoved;
    var next = record._nextRemoved;
    if (prev === null) {
      this._removalsHead = next;
    } else {
      prev._nextRemoved = next;
    }
    if (next === null) {
      this._removalsTail = prev;
    } else {
      next._prevRemoved = prev;
    }
    record._prevRemoved = record._nextRemoved = null;
  }
  _addToAdditions(record) {
    assert.argumentTypes(record, KVChangeRecord);
    if (this._additionsHead === null) {
      this._additionsHead = this._additionsTail = record;
    } else {
      this._additionsTail._nextAdded = record;
      this._additionsTail = record;
    }
  }
  _addToChanges(record) {
    assert.argumentTypes(record, KVChangeRecord);
    if (this._changesHead === null) {
      this._changesHead = this._changesTail = record;
    } else {
      this._changesTail._nextChanged = record;
      this._changesTail = record;
    }
  }
  toString() {
    var items = [];
    var previous = [];
    var changes = [];
    var additions = [];
    var removals = [];
    var record;
    for (record = this._mapHead; record !== null; record = record._next) {
      ListWrapper.push(items, stringify(record));
    }
    for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
      ListWrapper.push(previous, stringify(record));
    }
    for (record = this._changesHead; record !== null; record = record._nextChanged) {
      ListWrapper.push(changes, stringify(record));
    }
    for (record = this._additionsHead; record !== null; record = record._nextAdded) {
      ListWrapper.push(additions, stringify(record));
    }
    for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
      ListWrapper.push(removals, stringify(record));
    }
    return assert.returnType(("map: " + items.join(', ') + "\n" + "previous: " + previous.join(', ') + "\n" + "additions: " + additions.join(', ') + "\n" + "changes: " + changes.join(', ') + "\n" + "removals: " + removals.join(', ') + "\n"), assert.type.string);
  }
  _forEach(obj, fn) {
    assert.argumentTypes(obj, assert.type.any, fn, Function);
    if (obj instanceof Map) {
      MapWrapper.forEach(obj, fn);
    } else {
      StringMapWrapper.forEach(obj, fn);
    }
  }
}
Object.defineProperty(KeyValueChanges.prototype.forEachItem, "parameters", {get: function() {
    return [[Function]];
  }});
Object.defineProperty(KeyValueChanges.prototype.forEachPreviousItem, "parameters", {get: function() {
    return [[Function]];
  }});
Object.defineProperty(KeyValueChanges.prototype.forEachChangedItem, "parameters", {get: function() {
    return [[Function]];
  }});
Object.defineProperty(KeyValueChanges.prototype.forEachAddedItem, "parameters", {get: function() {
    return [[Function]];
  }});
Object.defineProperty(KeyValueChanges.prototype.forEachRemovedItem, "parameters", {get: function() {
    return [[Function]];
  }});
Object.defineProperty(KeyValueChanges.prototype._truncate, "parameters", {get: function() {
    return [[KVChangeRecord], [KVChangeRecord]];
  }});
Object.defineProperty(KeyValueChanges.prototype._isInRemovals, "parameters", {get: function() {
    return [[KVChangeRecord]];
  }});
Object.defineProperty(KeyValueChanges.prototype._addToRemovals, "parameters", {get: function() {
    return [[KVChangeRecord]];
  }});
Object.defineProperty(KeyValueChanges.prototype._removeFromSeq, "parameters", {get: function() {
    return [[KVChangeRecord], [KVChangeRecord]];
  }});
Object.defineProperty(KeyValueChanges.prototype._removeFromRemovals, "parameters", {get: function() {
    return [[KVChangeRecord]];
  }});
Object.defineProperty(KeyValueChanges.prototype._addToAdditions, "parameters", {get: function() {
    return [[KVChangeRecord]];
  }});
Object.defineProperty(KeyValueChanges.prototype._addToChanges, "parameters", {get: function() {
    return [[KVChangeRecord]];
  }});
Object.defineProperty(KeyValueChanges.prototype._forEach, "parameters", {get: function() {
    return [[], [Function]];
  }});
export class KVChangeRecord {
  constructor(key) {
    this.key = key;
    this._previousValue = null;
    this._currentValue = null;
    this._nextPrevious = null;
    this._next = null;
    this._nextAdded = null;
    this._nextRemoved = null;
    this._prevRemoved = null;
    this._nextChanged = null;
  }
  toString() {
    return assert.returnType((looseIdentical(this._previousValue, this._currentValue) ? stringify(this.key) : (stringify(this.key) + '[' + stringify(this._previousValue) + '->' + stringify(this._currentValue) + ']')), assert.type.string);
  }
}

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/change_detection/pipes/keyvalue_changes.map

//# sourceMappingURL=./keyvalue_changes.map