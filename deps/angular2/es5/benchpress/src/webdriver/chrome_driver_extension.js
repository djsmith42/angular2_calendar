System.register(["rtts_assert/rtts_assert", "angular2/di", "angular2/src/facade/collection", "angular2/src/facade/lang", "../web_driver_extension", "../web_driver_adapter", "angular2/src/facade/async"], function($__export) {
  "use strict";
  var assert,
      bind,
      ListWrapper,
      StringMapWrapper,
      StringMap,
      Json,
      isPresent,
      isBlank,
      RegExpWrapper,
      StringWrapper,
      BaseException,
      NumberWrapper,
      WebDriverExtension,
      WebDriverAdapter,
      Promise,
      ChromeDriverExtension,
      _BINDINGS;
  function normalizeEvent(chromeEvent, data) {
    var ph = chromeEvent['ph'];
    if (StringWrapper.equals(ph, 'S')) {
      ph = 'b';
    } else if (StringWrapper.equals(ph, 'F')) {
      ph = 'e';
    }
    var result = {
      'pid': chromeEvent['pid'],
      'ph': ph,
      'cat': 'timeline',
      'ts': chromeEvent['ts'] / 1000
    };
    if (chromeEvent['ph'] === 'X') {
      var dur = chromeEvent['dur'];
      if (isBlank(dur)) {
        dur = chromeEvent['tdur'];
      }
      result['dur'] = isBlank(dur) ? 0.0 : dur / 1000;
    }
    StringMapWrapper.forEach(data, (function(value, prop) {
      result[prop] = value;
    }));
    return result;
  }
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      bind = $__m.bind;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
      StringMap = $__m.StringMap;
    }, function($__m) {
      Json = $__m.Json;
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      RegExpWrapper = $__m.RegExpWrapper;
      StringWrapper = $__m.StringWrapper;
      BaseException = $__m.BaseException;
      NumberWrapper = $__m.NumberWrapper;
    }, function($__m) {
      WebDriverExtension = $__m.WebDriverExtension;
    }, function($__m) {
      WebDriverAdapter = $__m.WebDriverAdapter;
    }, function($__m) {
      Promise = $__m.Promise;
    }],
    execute: function() {
      ChromeDriverExtension = $__export("ChromeDriverExtension", (function($__super) {
        var ChromeDriverExtension = function ChromeDriverExtension(driver) {
          assert.argumentTypes(driver, WebDriverAdapter);
          $traceurRuntime.superConstructor(ChromeDriverExtension).call(this);
          this._driver = driver;
        };
        return ($traceurRuntime.createClass)(ChromeDriverExtension, {
          gc: function() {
            return this._driver.executeScript('window.gc()');
          },
          timeBegin: function(name) {
            assert.argumentTypes(name, assert.type.string);
            return assert.returnType((this._driver.executeScript(("console.time('" + name + "');"))), Promise);
          },
          timeEnd: function(name) {
            var restartName = arguments[1] !== (void 0) ? arguments[1] : null;
            assert.argumentTypes(name, assert.type.string, restartName, assert.type.string);
            var script = ("console.timeEnd('" + name + "');");
            if (isPresent(restartName)) {
              script += ("console.time('" + restartName + "');");
            }
            return assert.returnType((this._driver.executeScript(script)), Promise);
          },
          readPerfLog: function() {
            var $__0 = this;
            return this._driver.executeScript('1+1').then((function(_) {
              return $__0._driver.logs('performance');
            })).then((function(entries) {
              var events = [];
              ListWrapper.forEach(entries, function(entry) {
                var message = Json.parse(entry['message'])['message'];
                if (StringWrapper.equals(message['method'], 'Tracing.dataCollected')) {
                  ListWrapper.push(events, message['params']);
                }
                if (StringWrapper.equals(message['method'], 'Tracing.bufferUsage')) {
                  throw new BaseException('The DevTools trace buffer filled during the test!');
                }
              });
              return $__0._convertPerfRecordsToEvents(events);
            }));
          },
          _convertPerfRecordsToEvents: function(chromeEvents) {
            var normalizedEvents = arguments[1] !== (void 0) ? arguments[1] : null;
            if (isBlank(normalizedEvents)) {
              normalizedEvents = [];
            }
            chromeEvents.forEach((function(event) {
              var cat = event['cat'];
              var name = event['name'];
              var args = event['args'];
              if (StringWrapper.equals(cat, 'disabled-by-default-devtools.timeline')) {
                if (StringWrapper.equals(name, 'FunctionCall') && (isBlank(args) || isBlank(args['data']) || !StringWrapper.equals(args['data']['scriptName'], 'InjectedScript'))) {
                  ListWrapper.push(normalizedEvents, normalizeEvent(event, {'name': 'script'}));
                } else if (StringWrapper.equals(name, 'RecalculateStyles') || StringWrapper.equals(name, 'Layout') || StringWrapper.equals(name, 'UpdateLayerTree') || StringWrapper.equals(name, 'Paint') || StringWrapper.equals(name, 'Rasterize') || StringWrapper.equals(name, 'CompositeLayers')) {
                  ListWrapper.push(normalizedEvents, normalizeEvent(event, {'name': 'render'}));
                } else if (StringWrapper.equals(name, 'GCEvent')) {
                  ListWrapper.push(normalizedEvents, normalizeEvent(event, {
                    'name': 'gc',
                    'args': {'usedHeapSize': isPresent(args['usedHeapSizeAfter']) ? args['usedHeapSizeAfter'] : args['usedHeapSizeBefore']}
                  }));
                }
              } else if (StringWrapper.equals(cat, 'blink.console')) {
                ListWrapper.push(normalizedEvents, normalizeEvent(event, {'name': name}));
              }
            }));
            return normalizedEvents;
          },
          supports: function(capabilities) {
            assert.argumentTypes(capabilities, StringMap);
            return assert.returnType((StringWrapper.equals(capabilities['browserName'].toLowerCase(), 'chrome')), assert.type.boolean);
          }
        }, {get BINDINGS() {
            return _BINDINGS;
          }}, $__super);
      }(WebDriverExtension)));
      Object.defineProperty(ChromeDriverExtension, "parameters", {get: function() {
          return [[WebDriverAdapter]];
        }});
      Object.defineProperty(ChromeDriverExtension.prototype.timeBegin, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ChromeDriverExtension.prototype.timeEnd, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ChromeDriverExtension.prototype.supports, "parameters", {get: function() {
          return [[StringMap]];
        }});
      _BINDINGS = [bind(ChromeDriverExtension).toFactory((function(driver) {
        return new ChromeDriverExtension(driver);
      }), [WebDriverAdapter])];
    }
  };
});

//# sourceMappingURL=benchpress/src/webdriver/chrome_driver_extension.map

//# sourceMappingURL=../../../benchpress/src/webdriver/chrome_driver_extension.js.map