import {assert} from "rtts_assert/rtts_assert";
import {ddescribe,
  describe,
  it,
  iit,
  xit,
  expect,
  beforeEach,
  afterEach} from 'angular2/test_lib';
import {PipeRegistry} from 'angular2/src/change_detection/pipes/pipe_registry';
import {Pipe} from 'angular2/src/change_detection/pipes/pipe';
export function main() {
  describe("pipe registry", () => {
    var firstPipe = new Pipe();
    var secondPipe = new Pipe();
    it("should return the first pipe supporting the data type", () => {
      var r = new PipeRegistry({"type": [new PipeFactory(false, firstPipe), new PipeFactory(true, secondPipe)]});
      expect(r.get("type", "some object")).toBe(secondPipe);
    });
    it("should throw when no matching type", () => {
      var r = new PipeRegistry({});
      expect(() => r.get("unknown", "some object")).toThrowError(`Cannot find a pipe for type 'unknown' object 'some object'`);
    });
    it("should throw when no matching pipe", () => {
      var r = new PipeRegistry({"type": []});
      expect(() => r.get("type", "some object")).toThrowError(`Cannot find a pipe for type 'type' object 'some object'`);
    });
  });
}
class PipeFactory {
  constructor(shouldSupport, pipe) {
    assert.argumentTypes(shouldSupport, assert.type.boolean, pipe, assert.type.any);
    this.shouldSupport = shouldSupport;
    this.pipe = pipe;
  }
  supports(obj) {
    return assert.returnType((this.shouldSupport), assert.type.boolean);
  }
  create() {
    return assert.returnType((this.pipe), Pipe);
  }
}
Object.defineProperty(PipeFactory, "parameters", {get: function() {
    return [[assert.type.boolean], [assert.type.any]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/test/change_detection/pipe_registry_spec.map

//# sourceMappingURL=./pipe_registry_spec.map