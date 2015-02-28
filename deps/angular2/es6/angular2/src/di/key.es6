import {assert} from "rtts_assert/rtts_assert";
import {KeyMetadataError} from './exceptions';
import {MapWrapper,
  Map} from 'angular2/src/facade/collection';
import {FIELD,
  int,
  isPresent} from 'angular2/src/facade/lang';
export class Key {
  constructor(token, id) {
    assert.argumentTypes(token, assert.type.any, id, int);
    this.token = token;
    this.id = id;
    this.metadata = null;
  }
  static setMetadata(key, metadata) {
    assert.argumentTypes(key, Key, metadata, assert.type.any);
    if (isPresent(key.metadata) && key.metadata !== metadata) {
      throw new KeyMetadataError();
    }
    key.metadata = metadata;
    return assert.returnType((key), Key);
  }
  static get(token) {
    return assert.returnType((_globalKeyRegistry.get(token)), Key);
  }
  static get numberOfKeys() {
    return assert.returnType((_globalKeyRegistry.numberOfKeys), int);
  }
}
Object.defineProperty(Key, "parameters", {get: function() {
    return [[], [int]];
  }});
Object.defineProperty(Key.setMetadata, "parameters", {get: function() {
    return [[Key], []];
  }});
export class KeyRegistry {
  constructor() {
    this._allKeys = MapWrapper.create();
  }
  get(token) {
    if (token instanceof Key)
      return assert.returnType((token), Key);
    if (MapWrapper.contains(this._allKeys, token)) {
      return assert.returnType((MapWrapper.get(this._allKeys, token)), Key);
    }
    var newKey = new Key(token, Key.numberOfKeys);
    MapWrapper.set(this._allKeys, token, newKey);
    return assert.returnType((newKey), Key);
  }
  get numberOfKeys() {
    return assert.returnType((MapWrapper.size(this._allKeys)), int);
  }
}
var _globalKeyRegistry = new KeyRegistry();

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/di/key.map

//# sourceMappingURL=./key.map