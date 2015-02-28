import {assert} from "rtts_assert/rtts_assert";
import {isBlank,
  BaseException,
  isPresent} from 'angular2/src/facade/lang';
import {DOM,
  Element} from 'angular2/src/facade/dom';
import {List,
  ListWrapper,
  MapWrapper} from 'angular2/src/facade/collection';
import {VmTurnZone} from 'angular2/src/core/zone/vm_turn_zone';
export class EventManager {
  constructor(plugins, zone) {
    assert.argumentTypes(plugins, assert.genericType(List, EventManagerPlugin), zone, VmTurnZone);
    this._zone = zone;
    this._plugins = plugins;
    for (var i = 0; i < plugins.length; i++) {
      plugins[i].manager = this;
    }
  }
  addEventListener(element, eventName, handler) {
    assert.argumentTypes(element, Element, eventName, assert.type.string, handler, Function);
    var plugin = this._findPluginFor(eventName);
    if (isPresent(plugin)) {
      plugin.addEventListener(element, eventName, handler);
    } else {
      this._addNativeEventListener(element, eventName, handler);
    }
  }
  getZone() {
    return assert.returnType((this._zone), VmTurnZone);
  }
  _findPluginFor(eventName) {
    assert.argumentTypes(eventName, assert.type.string);
    var plugins = this._plugins;
    for (var i = 0; i < plugins.length; i++) {
      var plugin = plugins[i];
      if (plugin.supports(eventName)) {
        return assert.returnType((plugin), EventManagerPlugin);
      }
    }
    return assert.returnType((null), EventManagerPlugin);
  }
  _addNativeEventListener(element, eventName, handler) {
    assert.argumentTypes(element, Element, eventName, assert.type.string, handler, Function);
    this._zone.runOutsideAngular(() => {
      DOM.on(element, eventName, (event) => {
        if (event.target === element) {
          this._zone.run(function() {
            handler(event);
          });
        }
      });
    });
  }
}
Object.defineProperty(EventManager, "parameters", {get: function() {
    return [[assert.genericType(List, EventManagerPlugin)], [VmTurnZone]];
  }});
Object.defineProperty(EventManager.prototype.addEventListener, "parameters", {get: function() {
    return [[Element], [assert.type.string], [Function]];
  }});
Object.defineProperty(EventManager.prototype._findPluginFor, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(EventManager.prototype._addNativeEventListener, "parameters", {get: function() {
    return [[Element], [assert.type.string], [Function]];
  }});
export class EventManagerPlugin {
  supports(eventName) {
    assert.argumentTypes(eventName, assert.type.string);
    return assert.returnType((false), assert.type.boolean);
  }
  addEventListener(element, eventName, handler) {
    assert.argumentTypes(element, Element, eventName, assert.type.string, handler, Function);
    throw "not implemented";
  }
}
Object.defineProperty(EventManagerPlugin.prototype.supports, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(EventManagerPlugin.prototype.addEventListener, "parameters", {get: function() {
    return [[Element], [assert.type.string], [Function]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/events/event_manager.map

//# sourceMappingURL=./event_manager.map