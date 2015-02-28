import {assert} from "rtts_assert/rtts_assert";
import {describe,
  beforeEach,
  it,
  expect,
  ddescribe,
  iit,
  el,
  IS_DARTIUM} from 'angular2/test_lib';
import {XHRMock} from 'angular2/src/mock/xhr_mock';
import {PromiseWrapper,
  Promise} from 'angular2/src/facade/async';
import {isPresent} from 'angular2/src/facade/lang';
export function main() {
  describe('XHRMock', () => {
    var xhr;
    beforeEach(() => {
      xhr = new XHRMock();
    });
    function expectResponse(request, url, response, done = null) {
      assert.argumentTypes(request, Promise, url, assert.type.string, response, assert.type.string, done, assert.type.any);
      function onResponse(text) {
        assert.argumentTypes(text, assert.type.string);
        if (response === null) {
          throw `Unexpected response ${url} -> ${text}`;
        } else {
          expect(text).toEqual(response);
          if (isPresent(done))
            done();
        }
      }
      Object.defineProperty(onResponse, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      function onError(error) {
        assert.argumentTypes(error, assert.type.string);
        if (response !== null) {
          throw `Unexpected error ${url}`;
        } else {
          expect(error).toEqual(`Failed to load ${url}`);
          if (isPresent(done))
            done();
        }
      }
      Object.defineProperty(onError, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      PromiseWrapper.then(request, onResponse, onError);
    }
    Object.defineProperty(expectResponse, "parameters", {get: function() {
        return [[Promise], [assert.type.string], [assert.type.string], []];
      }});
    it('should return a response from the definitions', (done) => {
      var url = '/foo';
      var response = 'bar';
      xhr.when(url, response);
      expectResponse(xhr.get(url), url, response, done);
      xhr.flush();
    });
    it('should return an error from the definitions', (done) => {
      var url = '/foo';
      var response = null;
      xhr.when(url, response);
      expectResponse(xhr.get(url), url, response, done);
      xhr.flush();
    });
    it('should return a response from the expectations', (done) => {
      var url = '/foo';
      var response = 'bar';
      xhr.expect(url, response);
      expectResponse(xhr.get(url), url, response, done);
      xhr.flush();
    });
    it('should return an error from the expectations', (done) => {
      var url = '/foo';
      var response = null;
      xhr.expect(url, response);
      expectResponse(xhr.get(url), url, response, done);
      xhr.flush();
    });
    it('should not reuse expectations', () => {
      var url = '/foo';
      var response = 'bar';
      xhr.expect(url, response);
      xhr.get(url);
      xhr.get(url);
      expect(() => {
        xhr.flush();
      }).toThrowError('Unexpected request /foo');
    });
    it('should return expectations before definitions', (done) => {
      var url = '/foo';
      xhr.when(url, 'when');
      xhr.expect(url, 'expect');
      expectResponse(xhr.get(url), url, 'expect');
      expectResponse(xhr.get(url), url, 'when', done);
      xhr.flush();
    });
    it('should throw when there is no definitions or expectations', () => {
      xhr.get('/foo');
      expect(() => {
        xhr.flush();
      }).toThrowError('Unexpected request /foo');
    });
    it('should throw when flush is called without any pending requests', () => {
      expect(() => {
        xhr.flush();
      }).toThrowError('No pending requests to flush');
    });
    it('should throw on unstatisfied expectations', () => {
      xhr.expect('/foo', 'bar');
      xhr.when('/bar', 'foo');
      xhr.get('/bar');
      expect(() => {
        xhr.flush();
      }).toThrowError('Unsatisfied requests: /foo');
    });
  });
}

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/test/mock/xhr_mock_spec.map

//# sourceMappingURL=./xhr_mock_spec.map