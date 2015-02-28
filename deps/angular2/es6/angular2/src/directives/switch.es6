import {assert} from "rtts_assert/rtts_assert";
import {Decorator,
  Viewport} from 'angular2/src/core/annotations/annotations';
import {ViewContainer} from 'angular2/src/core/compiler/view_container';
import {NgElement} from 'angular2/src/core/dom/element';
import {isPresent,
  isBlank,
  normalizeBlank} from 'angular2/src/facade/lang';
import {ListWrapper,
  List,
  MapWrapper,
  Map} from 'angular2/src/facade/collection';
import {Parent} from 'angular2/src/core/annotations/visibility';
export class Switch {
  constructor() {
    this._valueViewContainers = MapWrapper.create();
    this._activeViewContainers = ListWrapper.create();
    this._useDefault = false;
  }
  set value(value) {
    this._emptyAllActiveViewContainers();
    this._useDefault = false;
    var containers = MapWrapper.get(this._valueViewContainers, value);
    if (isBlank(containers)) {
      this._useDefault = true;
      containers = normalizeBlank(MapWrapper.get(this._valueViewContainers, _whenDefault));
    }
    this._activateViewContainers(containers);
    this._switchValue = value;
  }
  _onWhenValueChanged(oldWhen, newWhen, viewContainer) {
    assert.argumentTypes(oldWhen, assert.type.any, newWhen, assert.type.any, viewContainer, ViewContainer);
    this._deregisterViewContainer(oldWhen, viewContainer);
    this._registerViewContainer(newWhen, viewContainer);
    if (oldWhen === this._switchValue) {
      viewContainer.remove();
      ListWrapper.remove(this._activeViewContainers, viewContainer);
    } else if (newWhen === this._switchValue) {
      if (this._useDefault) {
        this._useDefault = false;
        this._emptyAllActiveViewContainers();
      }
      viewContainer.create();
      ListWrapper.push(this._activeViewContainers, viewContainer);
    }
    if (this._activeViewContainers.length === 0 && !this._useDefault) {
      this._useDefault = true;
      this._activateViewContainers(MapWrapper.get(this._valueViewContainers, _whenDefault));
    }
  }
  _emptyAllActiveViewContainers() {
    var activeContainers = this._activeViewContainers;
    for (var i = 0; i < activeContainers.length; i++) {
      activeContainers[i].remove();
    }
    this._activeViewContainers = ListWrapper.create();
  }
  _activateViewContainers(containers) {
    assert.argumentTypes(containers, assert.genericType(List, ViewContainer));
    if (isPresent(containers)) {
      for (var i = 0; i < containers.length; i++) {
        containers[i].create();
      }
      this._activeViewContainers = containers;
    }
  }
  _registerViewContainer(value, container) {
    assert.argumentTypes(value, assert.type.any, container, ViewContainer);
    var containers = MapWrapper.get(this._valueViewContainers, value);
    if (isBlank(containers)) {
      containers = ListWrapper.create();
      MapWrapper.set(this._valueViewContainers, value, containers);
    }
    ListWrapper.push(containers, container);
  }
  _deregisterViewContainer(value, container) {
    assert.argumentTypes(value, assert.type.any, container, ViewContainer);
    if (value == _whenDefault)
      return ;
    var containers = MapWrapper.get(this._valueViewContainers, value);
    if (containers.length == 1) {
      MapWrapper.delete(this._valueViewContainers, value);
    } else {
      ListWrapper.remove(containers, container);
    }
  }
}
Object.defineProperty(Switch, "annotations", {get: function() {
    return [new Decorator({
      selector: '[switch]',
      bind: {'value': 'switch'}
    })];
  }});
Object.defineProperty(Switch.prototype._onWhenValueChanged, "parameters", {get: function() {
    return [[], [], [ViewContainer]];
  }});
Object.defineProperty(Switch.prototype._activateViewContainers, "parameters", {get: function() {
    return [[assert.genericType(List, ViewContainer)]];
  }});
Object.defineProperty(Switch.prototype._registerViewContainer, "parameters", {get: function() {
    return [[], [ViewContainer]];
  }});
Object.defineProperty(Switch.prototype._deregisterViewContainer, "parameters", {get: function() {
    return [[], [ViewContainer]];
  }});
export class SwitchWhen {
  constructor(el, viewContainer, sswitch) {
    assert.argumentTypes(el, NgElement, viewContainer, ViewContainer, sswitch, Switch);
    this._value = _whenDefault;
    this._switch = sswitch;
    this._viewContainer = viewContainer;
  }
  set when(value) {
    this._switch._onWhenValueChanged(this._value, value, this._viewContainer);
    this._value = value;
  }
}
Object.defineProperty(SwitchWhen, "annotations", {get: function() {
    return [new Viewport({
      selector: '[switch-when]',
      bind: {'when': 'switch-when'}
    })];
  }});
Object.defineProperty(SwitchWhen, "parameters", {get: function() {
    return [[NgElement], [ViewContainer], [Switch, new Parent()]];
  }});
export class SwitchDefault {
  constructor(viewContainer, sswitch) {
    assert.argumentTypes(viewContainer, ViewContainer, sswitch, Switch);
    sswitch._registerViewContainer(_whenDefault, viewContainer);
  }
}
Object.defineProperty(SwitchDefault, "annotations", {get: function() {
    return [new Viewport({selector: '[switch-default]'})];
  }});
Object.defineProperty(SwitchDefault, "parameters", {get: function() {
    return [[ViewContainer], [Switch, new Parent()]];
  }});
var _whenDefault = new Object();

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/directives/switch.map

//# sourceMappingURL=./switch.map