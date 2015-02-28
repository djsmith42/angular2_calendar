import {assert} from "rtts_assert/rtts_assert";
import {Viewport} from 'angular2/src/core/annotations/annotations';
import {ViewContainer} from 'angular2/src/core/compiler/view_container';
import {View} from 'angular2/src/core/compiler/view';
import {isPresent,
  isBlank} from 'angular2/src/facade/lang';
import {ListWrapper} from 'angular2/src/facade/collection';
export class Foreach {
  constructor(viewContainer) {
    assert.argumentTypes(viewContainer, ViewContainer);
    super();
    this.viewContainer = viewContainer;
  }
  set iterableChanges(changes) {
    if (isBlank(changes)) {
      this.viewContainer.clear();
      return ;
    }
    var recordViewTuples = [];
    changes.forEachRemovedItem((removedRecord) => ListWrapper.push(recordViewTuples, new RecordViewTuple(removedRecord, null)));
    changes.forEachMovedItem((movedRecord) => ListWrapper.push(recordViewTuples, new RecordViewTuple(movedRecord, null)));
    var insertTuples = Foreach.bulkRemove(recordViewTuples, this.viewContainer);
    changes.forEachAddedItem((addedRecord) => ListWrapper.push(insertTuples, new RecordViewTuple(addedRecord, null)));
    Foreach.bulkInsert(insertTuples, this.viewContainer);
    for (var i = 0; i < insertTuples.length; i++) {
      this.perViewChange(insertTuples[i].view, insertTuples[i].record);
    }
  }
  perViewChange(view, record) {
    view.setLocal('\$implicit', record.item);
    view.setLocal('index', record.currentIndex);
  }
  static bulkRemove(tuples, viewContainer) {
    tuples.sort((a, b) => a.record.previousIndex - b.record.previousIndex);
    var movedTuples = [];
    for (var i = tuples.length - 1; i >= 0; i--) {
      var tuple = tuples[i];
      if (isPresent(tuple.record.currentIndex)) {
        tuple.view = viewContainer.detach(tuple.record.previousIndex);
        ListWrapper.push(movedTuples, tuple);
      } else {
        viewContainer.remove(tuple.record.previousIndex);
      }
    }
    return movedTuples;
  }
  static bulkInsert(tuples, viewContainer) {
    tuples.sort((a, b) => a.record.currentIndex - b.record.currentIndex);
    for (var i = 0; i < tuples.length; i++) {
      var tuple = tuples[i];
      if (isPresent(tuple.view)) {
        viewContainer.insert(tuple.view, tuple.record.currentIndex);
      } else {
        tuple.view = viewContainer.create(tuple.record.currentIndex);
      }
    }
    return tuples;
  }
}
Object.defineProperty(Foreach, "annotations", {get: function() {
    return [new Viewport({
      selector: '[foreach][in]',
      bind: {'iterableChanges': 'in | iterableDiff'}
    })];
  }});
Object.defineProperty(Foreach, "parameters", {get: function() {
    return [[ViewContainer]];
  }});
class RecordViewTuple {
  constructor(record, view) {
    this.record = record;
    this.view = view;
  }
}

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/directives/foreach.map

//# sourceMappingURL=./foreach.map