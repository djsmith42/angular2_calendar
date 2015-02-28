System.register(["angular2/di"], function($__export) {
  "use strict";
  var bind,
      OpaqueToken,
      Options,
      _SAMPLE_ID,
      _DEFAULT_DESCRIPTION,
      _SAMPLE_DESCRIPTION,
      _FORCE_GC,
      _PREPARE,
      _EXECUTE,
      _CAPABILITIES,
      _USER_AGENT;
  return {
    setters: [function($__m) {
      bind = $__m.bind;
      OpaqueToken = $__m.OpaqueToken;
    }],
    execute: function() {
      Options = $__export("Options", (function() {
        var Options = function Options() {};
        return ($traceurRuntime.createClass)(Options, {}, {
          get SAMPLE_ID() {
            return _SAMPLE_ID;
          },
          get DEFAULT_DESCRIPTION() {
            return _DEFAULT_DESCRIPTION;
          },
          get SAMPLE_DESCRIPTION() {
            return _SAMPLE_DESCRIPTION;
          },
          get FORCE_GC() {
            return _FORCE_GC;
          },
          get PREPARE() {
            return _PREPARE;
          },
          get EXECUTE() {
            return _EXECUTE;
          },
          get CAPABILITIES() {
            return _CAPABILITIES;
          },
          get USER_AGENT() {
            return _USER_AGENT;
          }
        });
      }()));
      _SAMPLE_ID = new OpaqueToken('Options.sampleId');
      _DEFAULT_DESCRIPTION = new OpaqueToken('Options.defaultDescription');
      _SAMPLE_DESCRIPTION = new OpaqueToken('Options.sampleDescription');
      _FORCE_GC = new OpaqueToken('Options.forceGc');
      _PREPARE = new OpaqueToken('Options.prepare');
      _EXECUTE = new OpaqueToken('Options.execute');
      _CAPABILITIES = new OpaqueToken('Options.capabilities');
      _USER_AGENT = new OpaqueToken('Options.userAgent');
    }
  };
});

//# sourceMappingURL=benchpress/src/sample_options.map

//# sourceMappingURL=../../benchpress/src/sample_options.js.map