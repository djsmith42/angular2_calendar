System.register(["rtts_assert/rtts_assert", "angular2/di", "angular2/src/facade/lang", "angular2/src/facade/async", "angular2/src/facade/collection", "./sample_options"], function($__export) {
  "use strict";
  var assert,
      bind,
      Injector,
      OpaqueToken,
      BaseException,
      ABSTRACT,
      isBlank,
      Promise,
      PromiseWrapper,
      List,
      ListWrapper,
      StringMap,
      Options,
      WebDriverExtension,
      _CHILDREN;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      bind = $__m.bind;
      Injector = $__m.Injector;
      OpaqueToken = $__m.OpaqueToken;
    }, function($__m) {
      BaseException = $__m.BaseException;
      ABSTRACT = $__m.ABSTRACT;
      isBlank = $__m.isBlank;
    }, function($__m) {
      Promise = $__m.Promise;
      PromiseWrapper = $__m.PromiseWrapper;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      StringMap = $__m.StringMap;
    }, function($__m) {
      Options = $__m.Options;
    }],
    execute: function() {
      WebDriverExtension = $__export("WebDriverExtension", (function() {
        var WebDriverExtension = function WebDriverExtension() {};
        return ($traceurRuntime.createClass)(WebDriverExtension, {
          gc: function() {
            throw new BaseException('NYI');
          },
          timeBegin: function(name) {
            throw new BaseException('NYI');
          },
          timeEnd: function(name, restart) {
            assert.argumentTypes(name, assert.type.any, restart, assert.type.boolean);
            throw new BaseException('NYI');
          },
          readPerfLog: function() {
            throw new BaseException('NYI');
          },
          supports: function(capabilities) {
            assert.argumentTypes(capabilities, StringMap);
            return assert.returnType((true), assert.type.boolean);
          }
        }, {bindTo: function(childTokens) {
            return [bind(_CHILDREN).toAsyncFactory((function(injector) {
              return PromiseWrapper.all(ListWrapper.map(childTokens, (function(token) {
                return injector.asyncGet(token);
              })));
            }), [Injector]), bind(WebDriverExtension).toFactory((function(children, capabilities) {
              var delegate;
              ListWrapper.forEach(children, (function(extension) {
                if (extension.supports(capabilities)) {
                  delegate = extension;
                }
              }));
              if (isBlank(delegate)) {
                throw new BaseException('Could not find a delegate for given capabilities!');
              }
              return delegate;
            }), [_CHILDREN, Options.CAPABILITIES])];
          }});
      }()));
      Object.defineProperty(WebDriverExtension, "annotations", {get: function() {
          return [new ABSTRACT()];
        }});
      Object.defineProperty(WebDriverExtension.prototype.timeEnd, "parameters", {get: function() {
          return [[], [assert.type.boolean]];
        }});
      Object.defineProperty(WebDriverExtension.prototype.supports, "parameters", {get: function() {
          return [[StringMap]];
        }});
      _CHILDREN = new OpaqueToken('WebDriverExtension.children');
    }
  };
});

//# sourceMappingURL=benchpress/src/web_driver_extension.map

//# sourceMappingURL=../../benchpress/src/web_driver_extension.js.map