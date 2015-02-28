System.register(["rtts_assert/rtts_assert", "angular2/test_lib", "angular2/src/facade/collection", "angular2/src/facade/async", "benchpress/benchpress", "../trace_event_factory"], function($__export) {
  "use strict";
  var assert,
      ddescribe,
      describe,
      it,
      iit,
      xit,
      expect,
      beforeEach,
      afterEach,
      List,
      ListWrapper,
      PromiseWrapper,
      Promise,
      Metric,
      PerflogMetric,
      WebDriverExtension,
      bind,
      Injector,
      TraceEventFactory,
      MockDriverExtension;
  function main() {
    var commandLog;
    var eventFactory = new TraceEventFactory('timeline', 'pid0');
    function createMetric(perfLogs) {
      commandLog = [];
      return new Injector([PerflogMetric.BINDINGS, bind(PerflogMetric.SET_TIMEOUT).toValue((function(fn, millis) {
        ListWrapper.push(commandLog, ['setTimeout', millis]);
        fn();
      })), bind(WebDriverExtension).toValue(new MockDriverExtension(perfLogs, commandLog))]).get(PerflogMetric);
    }
    describe('perflog metric', (function() {
      it('should describe itself', (function() {
        expect(createMetric([[]]).describe()['script']).toBe('script execution time in ms');
      }));
      describe('beginMeasure', (function() {
        it('should mark the timeline', (function(done) {
          var metric = createMetric([[]]);
          metric.beginMeasure().then((function(_) {
            expect(commandLog).toEqual([['timeBegin', 'benchpress0']]);
            done();
          }));
        }));
      }));
      describe('endMeasure', (function() {
        it('should mark and aggregate events in between the marks', (function(done) {
          var events = [[eventFactory.markStart('benchpress0', 0), eventFactory.start('script', 4), eventFactory.end('script', 6), eventFactory.markEnd('benchpress0', 10)]];
          var metric = createMetric(events);
          metric.beginMeasure().then((function(_) {
            return metric.endMeasure(false);
          })).then((function(data) {
            expect(commandLog).toEqual([['timeBegin', 'benchpress0'], ['timeEnd', 'benchpress0', null], 'readPerfLog']);
            expect(data['script']).toBe(2);
            done();
          }));
        }));
        it('should restart timing', (function(done) {
          var events = [[eventFactory.markStart('benchpress0', 0), eventFactory.markEnd('benchpress0', 1), eventFactory.markStart('benchpress1', 2)], [eventFactory.markEnd('benchpress1', 3)]];
          var metric = createMetric(events);
          metric.beginMeasure().then((function(_) {
            return metric.endMeasure(true);
          })).then((function(_) {
            return metric.endMeasure(true);
          })).then((function(_) {
            expect(commandLog).toEqual([['timeBegin', 'benchpress0'], ['timeEnd', 'benchpress0', 'benchpress1'], 'readPerfLog', ['timeEnd', 'benchpress1', 'benchpress2'], 'readPerfLog']);
            done();
          }));
        }));
        it('should loop and aggregate until the end mark is present', (function(done) {
          var events = [[eventFactory.markStart('benchpress0', 0), eventFactory.start('script', 1)], [eventFactory.end('script', 2)], [eventFactory.start('script', 3), eventFactory.end('script', 5), eventFactory.markEnd('benchpress0', 10)]];
          var metric = createMetric(events);
          metric.beginMeasure().then((function(_) {
            return metric.endMeasure(false);
          })).then((function(data) {
            expect(commandLog).toEqual([['timeBegin', 'benchpress0'], ['timeEnd', 'benchpress0', null], 'readPerfLog', ['setTimeout', 100], 'readPerfLog', ['setTimeout', 100], 'readPerfLog']);
            expect(data['script']).toBe(3);
            done();
          }));
        }));
        it('should store events after the end mark for the next call', (function(done) {
          var events = [[eventFactory.markStart('benchpress0', 0), eventFactory.markEnd('benchpress0', 1), eventFactory.markStart('benchpress1', 1), eventFactory.start('script', 1), eventFactory.end('script', 2)], [eventFactory.start('script', 3), eventFactory.end('script', 5), eventFactory.markEnd('benchpress1', 6)]];
          var metric = createMetric(events);
          metric.beginMeasure().then((function(_) {
            return metric.endMeasure(true);
          })).then((function(data) {
            expect(data['script']).toBe(0);
            return metric.endMeasure(true);
          })).then((function(data) {
            expect(commandLog).toEqual([['timeBegin', 'benchpress0'], ['timeEnd', 'benchpress0', 'benchpress1'], 'readPerfLog', ['timeEnd', 'benchpress1', 'benchpress2'], 'readPerfLog']);
            expect(data['script']).toBe(3);
            done();
          }));
        }));
      }));
      describe('aggregation', (function() {
        function aggregate(events) {
          ListWrapper.insert(events, 0, eventFactory.markStart('benchpress0', 0));
          ListWrapper.push(events, eventFactory.markEnd('benchpress0', 10));
          var metric = createMetric([events]);
          return metric.beginMeasure().then((function(_) {
            return metric.endMeasure(false);
          }));
        }
        it('should report a single interval', (function(done) {
          aggregate([eventFactory.start('script', 0), eventFactory.end('script', 5)]).then((function(data) {
            expect(data['script']).toBe(5);
            done();
          }));
        }));
        it('should sum up multiple intervals', (function(done) {
          aggregate([eventFactory.start('script', 0), eventFactory.end('script', 5), eventFactory.start('script', 10), eventFactory.end('script', 17)]).then((function(data) {
            expect(data['script']).toBe(12);
            done();
          }));
        }));
        it('should ignore not started intervals', (function(done) {
          aggregate([eventFactory.end('script', 10)]).then((function(data) {
            expect(data['script']).toBe(0);
            done();
          }));
        }));
        it('should ignore not ended intervals', (function(done) {
          aggregate([eventFactory.start('script', 10)]).then((function(data) {
            expect(data['script']).toBe(0);
            done();
          }));
        }));
        it('should ignore events from different processed as the start mark', (function(done) {
          var otherProcessEventFactory = new TraceEventFactory('timeline', 'pid1');
          var metric = createMetric([[eventFactory.markStart('benchpress0', 0), eventFactory.start('script', 0, null), eventFactory.end('script', 5, null), otherProcessEventFactory.start('script', 10, null), otherProcessEventFactory.end('script', 17, null), eventFactory.markEnd('benchpress0', 20)]]);
          metric.beginMeasure().then((function(_) {
            return metric.endMeasure(false);
          })).then((function(data) {
            expect(data['script']).toBe(5);
            done();
          }));
        }));
        ['script', 'gcTime', 'render'].forEach((function(metricName) {
          it(("should support " + metricName + " metric"), (function(done) {
            aggregate([eventFactory.start(metricName, 0), eventFactory.end(metricName, 5)]).then((function(data) {
              expect(data[metricName]).toBe(5);
              done();
            }));
          }));
        }));
        it('should support gcAmount metric', (function(done) {
          aggregate([eventFactory.start('gc', 0, {'usedHeapSize': 2500}), eventFactory.end('gc', 5, {'usedHeapSize': 1000})]).then((function(data) {
            expect(data['gcAmount']).toBe(1.5);
            done();
          }));
        }));
        it('should subtract gcTime in script from script time', (function(done) {
          aggregate([eventFactory.start('script', 0), eventFactory.start('gc', 1, {'usedHeapSize': 1000}), eventFactory.end('gc', 4, {'usedHeapSize': 0}), eventFactory.end('script', 5)]).then((function(data) {
            expect(data['script']).toBe(2);
            done();
          }));
        }));
        describe('gcTimeInScript / gcAmountInScript', (function() {
          it('should detect gc during script execution with begin/end events', (function(done) {
            aggregate([eventFactory.start('script', 0), eventFactory.start('gc', 1, {'usedHeapSize': 10000}), eventFactory.end('gc', 4, {'usedHeapSize': 0}), eventFactory.end('script', 5)]).then((function(data) {
              expect(data['gcTimeInScript']).toBe(3);
              expect(data['gcAmountInScript']).toBe(10.0);
              done();
            }));
          }));
          it('should detect gc during script execution with complete events', (function(done) {
            aggregate([eventFactory.complete('script', 0, 5), eventFactory.start('gc', 1, {'usedHeapSize': 10000}), eventFactory.end('gc', 4, {'usedHeapSize': 0})]).then((function(data) {
              expect(data['gcTimeInScript']).toBe(3);
              expect(data['gcAmountInScript']).toBe(10.0);
              done();
            }));
          }));
          it('should ignore gc outside of script execution', (function(done) {
            aggregate([eventFactory.start('gc', 1, {'usedHeapSize': 10}), eventFactory.end('gc', 4, {'usedHeapSize': 0}), eventFactory.start('script', 0), eventFactory.end('script', 5)]).then((function(data) {
              expect(data['gcTimeInScript']).toEqual(0.0);
              expect(data['gcAmountInScript']).toEqual(0.0);
              done();
            }));
          }));
        }));
      }));
    }));
  }
  $__export("main", main);
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      ddescribe = $__m.ddescribe;
      describe = $__m.describe;
      it = $__m.it;
      iit = $__m.iit;
      xit = $__m.xit;
      expect = $__m.expect;
      beforeEach = $__m.beforeEach;
      afterEach = $__m.afterEach;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      PromiseWrapper = $__m.PromiseWrapper;
      Promise = $__m.Promise;
    }, function($__m) {
      Metric = $__m.Metric;
      PerflogMetric = $__m.PerflogMetric;
      WebDriverExtension = $__m.WebDriverExtension;
      bind = $__m.bind;
      Injector = $__m.Injector;
    }, function($__m) {
      TraceEventFactory = $__m.TraceEventFactory;
    }],
    execute: function() {
      MockDriverExtension = (function($__super) {
        var MockDriverExtension = function MockDriverExtension(perfLogs, commandLog) {
          $traceurRuntime.superConstructor(MockDriverExtension).call(this);
          this._perfLogs = perfLogs;
          this._commandLog = commandLog;
        };
        return ($traceurRuntime.createClass)(MockDriverExtension, {
          timeBegin: function(name) {
            ListWrapper.push(this._commandLog, ['timeBegin', name]);
            return assert.returnType((PromiseWrapper.resolve(null)), Promise);
          },
          timeEnd: function(name, restartName) {
            ListWrapper.push(this._commandLog, ['timeEnd', name, restartName]);
            return assert.returnType((PromiseWrapper.resolve(null)), Promise);
          },
          readPerfLog: function() {
            ListWrapper.push(this._commandLog, 'readPerfLog');
            if (this._perfLogs.length > 0) {
              var next = this._perfLogs[0];
              ListWrapper.removeAt(this._perfLogs, 0);
              return assert.returnType((PromiseWrapper.resolve(next)), Promise);
            } else {
              return assert.returnType((PromiseWrapper.resolve([])), Promise);
            }
          }
        }, {}, $__super);
      }(WebDriverExtension));
    }
  };
});

//# sourceMappingURL=benchpress/test/metric/perflog_metric_spec.map

//# sourceMappingURL=../../../benchpress/test/metric/perflog_metric_spec.js.map