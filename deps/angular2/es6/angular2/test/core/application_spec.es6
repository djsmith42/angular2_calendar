import {describe,
  ddescribe,
  it,
  iit,
  xit,
  xdescribe,
  expect,
  beforeEach} from 'angular2/test_lib';
import {bootstrap,
  appDocumentToken,
  appElementToken} from 'angular2/src/core/application';
import {Component} from 'angular2/src/core/annotations/annotations';
import {DOM} from 'angular2/src/facade/dom';
import {ListWrapper} from 'angular2/src/facade/collection';
import {PromiseWrapper} from 'angular2/src/facade/async';
import {bind,
  Inject} from 'angular2/di';
import {Template} from 'angular2/src/core/annotations/template';
import {LifeCycle} from 'angular2/src/core/life_cycle/life_cycle';
class HelloRootCmp {
  constructor() {
    this.greeting = 'hello';
  }
}
Object.defineProperty(HelloRootCmp, "annotations", {get: function() {
    return [new Component({selector: 'hello-app'}), new Template({inline: '{{greeting}} world!'})];
  }});
class HelloRootCmp2 {
  constructor() {
    this.greeting = 'hello';
  }
}
Object.defineProperty(HelloRootCmp2, "annotations", {get: function() {
    return [new Component({selector: 'hello-app-2'}), new Template({inline: '{{greeting}} world, again!'})];
  }});
class HelloRootCmp3 {
  constructor(appBinding) {
    this.appBinding = appBinding;
  }
}
Object.defineProperty(HelloRootCmp3, "annotations", {get: function() {
    return [new Component({selector: 'hello-app'}), new Template({inline: ''})];
  }});
Object.defineProperty(HelloRootCmp3, "parameters", {get: function() {
    return [[new Inject("appBinding")]];
  }});
class HelloRootCmp4 {
  constructor(lc) {
    this.lc = lc;
  }
}
Object.defineProperty(HelloRootCmp4, "annotations", {get: function() {
    return [new Component({selector: 'hello-app'}), new Template({inline: ''})];
  }});
Object.defineProperty(HelloRootCmp4, "parameters", {get: function() {
    return [[new Inject(LifeCycle)]];
  }});
export function main() {
  var fakeDoc,
      el,
      el2,
      testBindings;
  beforeEach(() => {
    fakeDoc = DOM.createHtmlDocument();
    el = DOM.createElement('hello-app', fakeDoc);
    el2 = DOM.createElement('hello-app-2', fakeDoc);
    DOM.appendChild(fakeDoc.body, el);
    DOM.appendChild(fakeDoc.body, el2);
    testBindings = [bind(appDocumentToken).toValue(fakeDoc)];
  });
  describe('bootstrap factory method', () => {
    it('should throw if no element is found', (done) => {
      var injectorPromise = bootstrap(HelloRootCmp, [], (e, t) => {
        throw e;
      });
      PromiseWrapper.then(injectorPromise, null, (reason) => {
        expect(reason.message).toContain('The app selector "hello-app" did not match any elements');
        done();
      });
    });
    it('should create an injector promise', () => {
      var injectorPromise = bootstrap(HelloRootCmp, testBindings);
      expect(injectorPromise).not.toBe(null);
    });
    it('should resolve an injector promise and contain bindings', (done) => {
      var injectorPromise = bootstrap(HelloRootCmp, testBindings);
      injectorPromise.then((injector) => {
        expect(injector.get(appElementToken)).toBe(el);
        done();
      });
    });
    it('should provide the application component in the injector', (done) => {
      var injectorPromise = bootstrap(HelloRootCmp, testBindings);
      injectorPromise.then((injector) => {
        expect(injector.get(HelloRootCmp)).toBeAnInstanceOf(HelloRootCmp);
        done();
      });
    });
    it('should display hello world', (done) => {
      var injectorPromise = bootstrap(HelloRootCmp, testBindings);
      injectorPromise.then((injector) => {
        expect(injector.get(appElementToken).shadowRoot.childNodes[0].nodeValue).toEqual('hello world!');
        done();
      });
    });
    it('should support multiple calls to bootstrap', (done) => {
      var injectorPromise1 = bootstrap(HelloRootCmp, testBindings);
      var injectorPromise2 = bootstrap(HelloRootCmp2, testBindings);
      PromiseWrapper.all([injectorPromise1, injectorPromise2]).then((injectors) => {
        expect(injectors[0].get(appElementToken).shadowRoot.childNodes[0].nodeValue).toEqual('hello world!');
        expect(injectors[1].get(appElementToken).shadowRoot.childNodes[0].nodeValue).toEqual('hello world, again!');
        done();
      });
    });
    it("should make the provided bindings available to the application component", (done) => {
      var injectorPromise = bootstrap(HelloRootCmp3, [testBindings, bind("appBinding").toValue("BoundValue")]);
      injectorPromise.then((injector) => {
        expect(injector.get(HelloRootCmp3).appBinding).toEqual("BoundValue");
        done();
      });
    });
    it("should avoid cyclic dependencies when root component requires Lifecycle through DI", (done) => {
      var injectorPromise = bootstrap(HelloRootCmp4, testBindings);
      injectorPromise.then((injector) => {
        expect(injector.get(HelloRootCmp4).lc).toBe(injector.get(LifeCycle));
        done();
      });
    });
  });
}

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/test/core/application_spec.map

//# sourceMappingURL=./application_spec.map