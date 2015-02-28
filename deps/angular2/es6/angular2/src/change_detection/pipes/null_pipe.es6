import {assert} from "rtts_assert/rtts_assert";
import {isBlank} from 'angular2/src/facade/lang';
import {Pipe,
  NO_CHANGE} from './pipe';
export class NullPipeFactory {
  supports(obj) {
    return assert.returnType((NullPipe.supportsObj(obj)), assert.type.boolean);
  }
  create() {
    return assert.returnType((new NullPipe()), Pipe);
  }
}
export class NullPipe extends Pipe {
  constructor() {
    super();
    this.called = false;
  }
  static supportsObj(obj) {
    return assert.returnType((isBlank(obj)), assert.type.boolean);
  }
  supports(obj) {
    return NullPipe.supportsObj(obj);
  }
  transform(value) {
    if (!this.called) {
      this.called = true;
      return null;
    } else {
      return NO_CHANGE;
    }
  }
}

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/change_detection/pipes/null_pipe.map

//# sourceMappingURL=./null_pipe.map