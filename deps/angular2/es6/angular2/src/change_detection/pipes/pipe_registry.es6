import {assert} from "rtts_assert/rtts_assert";
import {List,
  ListWrapper} from 'angular2/src/facade/collection';
import {isBlank,
  isPresent,
  BaseException,
  CONST} from 'angular2/src/facade/lang';
import {Pipe} from './pipe';
export class PipeRegistry {
  constructor(config) {
    this.config = config;
  }
  get(type, obj) {
    var listOfConfigs = this.config[type];
    if (isBlank(listOfConfigs)) {
      throw new BaseException(`Cannot find a pipe for type '${type}' object '${obj}'`);
    }
    var matchingConfig = ListWrapper.find(listOfConfigs, (pipeConfig) => pipeConfig.supports(obj));
    if (isBlank(matchingConfig)) {
      throw new BaseException(`Cannot find a pipe for type '${type}' object '${obj}'`);
    }
    return assert.returnType((matchingConfig.create()), Pipe);
  }
}
Object.defineProperty(PipeRegistry.prototype.get, "parameters", {get: function() {
    return [[assert.type.string], []];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/change_detection/pipes/pipe_registry.map

//# sourceMappingURL=./pipe_registry.map