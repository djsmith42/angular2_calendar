import {assert} from "rtts_assert/rtts_assert";
import {HammerGesturesPluginCommon} from './hammer_common';
import {Element} from 'angular2/src/facade/dom';
import {isPresent,
  BaseException} from 'angular2/src/facade/lang';
export class HammerGesturesPlugin extends HammerGesturesPluginCommon {
  constructor() {
    super();
  }
  supports(eventName) {
    assert.argumentTypes(eventName, assert.type.string);
    if (!super.supports(eventName))
      return assert.returnType((false), assert.type.boolean);
    if (!isPresent(window.Hammer)) {
      throw new BaseException(`Hammer.js is not loaded, can not bind ${eventName} event`);
    }
    return assert.returnType((true), assert.type.boolean);
  }
  addEventListener(element, eventName, handler) {
    assert.argumentTypes(element, Element, eventName, assert.type.string, handler, Function);
    var zone = this.manager.getZone();
    eventName = eventName.toLowerCase();
    zone.runOutsideAngular(function() {
      var mc = new Hammer(element);
      mc.get('pinch').set({enable: true});
      mc.get('rotate').set({enable: true});
      mc.on(eventName, function(eventObj) {
        zone.run(function() {
          handler(eventObj);
        });
      });
    });
  }
}
Object.defineProperty(HammerGesturesPlugin.prototype.supports, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(HammerGesturesPlugin.prototype.addEventListener, "parameters", {get: function() {
    return [[Element], [assert.type.string], [Function]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/events/hammer_gestures.map

//# sourceMappingURL=./hammer_gestures.map