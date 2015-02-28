import {assert} from "rtts_assert/rtts_assert";
export class OpaqueToken {
  constructor(desc) {
    assert.argumentTypes(desc, assert.type.string);
    this._desc = `Token(${desc})`;
  }
  toString() {
    return this._desc;
  }
}
Object.defineProperty(OpaqueToken, "parameters", {get: function() {
    return [[assert.type.string]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/di/opaque_token.map

//# sourceMappingURL=./opaque_token.map