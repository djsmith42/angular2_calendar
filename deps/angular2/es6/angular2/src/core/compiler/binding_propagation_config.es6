import {assert} from "rtts_assert/rtts_assert";
import {ChangeDetector,
  CHECK_ONCE,
  DETACHED,
  CHECK_ALWAYS} from 'angular2/change_detection';
export class BindingPropagationConfig {
  constructor(cd) {
    assert.argumentTypes(cd, ChangeDetector);
    this._cd = cd;
  }
  shouldBePropagated() {
    this._cd.mode = CHECK_ONCE;
  }
  shouldBePropagatedFromRoot() {
    this._cd.markPathToRootAsCheckOnce();
  }
  shouldNotPropagate() {
    this._cd.mode = DETACHED;
  }
  shouldAlwaysPropagate() {
    this._cd.mode = CHECK_ALWAYS;
  }
}
Object.defineProperty(BindingPropagationConfig, "parameters", {get: function() {
    return [[ChangeDetector]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/compiler/binding_propagation_config.map

//# sourceMappingURL=./binding_propagation_config.map