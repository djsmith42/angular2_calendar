import {bind,
  OpaqueToken} from 'angular2/di';
export class Options {
  static get SAMPLE_ID() {
    return _SAMPLE_ID;
  }
  static get DEFAULT_DESCRIPTION() {
    return _DEFAULT_DESCRIPTION;
  }
  static get SAMPLE_DESCRIPTION() {
    return _SAMPLE_DESCRIPTION;
  }
  static get FORCE_GC() {
    return _FORCE_GC;
  }
  static get PREPARE() {
    return _PREPARE;
  }
  static get EXECUTE() {
    return _EXECUTE;
  }
  static get CAPABILITIES() {
    return _CAPABILITIES;
  }
  static get USER_AGENT() {
    return _USER_AGENT;
  }
}
var _SAMPLE_ID = new OpaqueToken('Options.sampleId');
var _DEFAULT_DESCRIPTION = new OpaqueToken('Options.defaultDescription');
var _SAMPLE_DESCRIPTION = new OpaqueToken('Options.sampleDescription');
var _FORCE_GC = new OpaqueToken('Options.forceGc');
var _PREPARE = new OpaqueToken('Options.prepare');
var _EXECUTE = new OpaqueToken('Options.execute');
var _CAPABILITIES = new OpaqueToken('Options.capabilities');
var _USER_AGENT = new OpaqueToken('Options.userAgent');

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/benchpress/src/sample_options.map

//# sourceMappingURL=./sample_options.map