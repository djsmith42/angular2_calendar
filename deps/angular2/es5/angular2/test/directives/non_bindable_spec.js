System.register(["rtts_assert/rtts_assert", "angular2/test_lib", "angular2/src/facade/dom", "angular2/di", "angular2/change_detection", "angular2/src/core/compiler/compiler", "angular2/src/core/compiler/directive_metadata_reader", "angular2/src/core/compiler/shadow_dom_strategy", "angular2/src/core/annotations/annotations", "angular2/src/core/annotations/template", "angular2/src/core/compiler/template_loader", "angular2/src/core/dom/element", "angular2/src/directives/non_bindable", "angular2/src/mock/template_resolver_mock"], function($__export) {
  "use strict";
  var assert,
      describe,
      xit,
      it,
      expect,
      beforeEach,
      ddescribe,
      iit,
      el,
      DOM,
      Injector,
      Lexer,
      Parser,
      ChangeDetector,
      dynamicChangeDetection,
      Compiler,
      CompilerCache,
      DirectiveMetadataReader,
      NativeShadowDomStrategy,
      Decorator,
      Component,
      Template,
      TemplateLoader,
      NgElement,
      NonBindable,
      MockTemplateResolver,
      TestComponent,
      TestDecorator;
  function main() {
    describe('non-bindable', (function() {
      var view,
          cd,
          compiler,
          component,
          tplResolver;
      beforeEach((function() {
        tplResolver = new MockTemplateResolver();
        compiler = new Compiler(dynamicChangeDetection, new TemplateLoader(null), new DirectiveMetadataReader(), new Parser(new Lexer()), new CompilerCache(), new NativeShadowDomStrategy(), tplResolver);
      }));
      function createView(pv) {
        component = new TestComponent();
        view = pv.instantiate(null, null);
        view.hydrate(new Injector([]), null, component);
        cd = view.changeDetector;
      }
      function compileWithTemplate(html) {
        var template = new Template({
          inline: html,
          directives: [NonBindable, TestDecorator]
        });
        tplResolver.setTemplate(TestComponent, template);
        return compiler.compile(TestComponent);
      }
      it('should not interpolate children', (function(done) {
        var template = '<div>{{text}}<span non-bindable>{{text}}</span></div>';
        compileWithTemplate(template).then((function(pv) {
          createView(pv);
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('foo{{text}}');
          done();
        }));
      }));
      it('should ignore directives on child nodes', (function(done) {
        var template = '<div non-bindable><span id=child test-dec>{{text}}</span></div>';
        compileWithTemplate(template).then((function(pv) {
          createView(pv);
          cd.detectChanges();
          var span = DOM.querySelector(view.nodes[0], '#child');
          expect(DOM.hasClass(span, 'compiled')).toBeFalsy();
          done();
        }));
      }));
      it('should trigger directives on the same node', (function(done) {
        var template = '<div><span id=child non-bindable test-dec>{{text}}</span></div>';
        compileWithTemplate(template).then((function(pv) {
          createView(pv);
          cd.detectChanges();
          var span = DOM.querySelector(view.nodes[0], '#child');
          expect(DOM.hasClass(span, 'compiled')).toBeTruthy();
          done();
        }));
      }));
    }));
  }
  $__export("main", main);
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      describe = $__m.describe;
      xit = $__m.xit;
      it = $__m.it;
      expect = $__m.expect;
      beforeEach = $__m.beforeEach;
      ddescribe = $__m.ddescribe;
      iit = $__m.iit;
      el = $__m.el;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      Injector = $__m.Injector;
    }, function($__m) {
      Lexer = $__m.Lexer;
      Parser = $__m.Parser;
      ChangeDetector = $__m.ChangeDetector;
      dynamicChangeDetection = $__m.dynamicChangeDetection;
    }, function($__m) {
      Compiler = $__m.Compiler;
      CompilerCache = $__m.CompilerCache;
    }, function($__m) {
      DirectiveMetadataReader = $__m.DirectiveMetadataReader;
    }, function($__m) {
      NativeShadowDomStrategy = $__m.NativeShadowDomStrategy;
    }, function($__m) {
      Decorator = $__m.Decorator;
      Component = $__m.Component;
    }, function($__m) {
      Template = $__m.Template;
    }, function($__m) {
      TemplateLoader = $__m.TemplateLoader;
    }, function($__m) {
      NgElement = $__m.NgElement;
    }, function($__m) {
      NonBindable = $__m.NonBindable;
    }, function($__m) {
      MockTemplateResolver = $__m.MockTemplateResolver;
    }],
    execute: function() {
      TestComponent = (function() {
        var TestComponent = function TestComponent() {
          this.text = 'foo';
        };
        return ($traceurRuntime.createClass)(TestComponent, {}, {});
      }());
      Object.defineProperty(TestComponent, "annotations", {get: function() {
          return [new Component({selector: 'test-cmp'})];
        }});
      TestDecorator = (function() {
        var TestDecorator = function TestDecorator(el) {
          assert.argumentTypes(el, NgElement);
          DOM.addClass(el.domElement, 'compiled');
        };
        return ($traceurRuntime.createClass)(TestDecorator, {}, {});
      }());
      Object.defineProperty(TestDecorator, "annotations", {get: function() {
          return [new Decorator({selector: '[test-dec]'})];
        }});
      Object.defineProperty(TestDecorator, "parameters", {get: function() {
          return [[NgElement]];
        }});
    }
  };
});

//# sourceMappingURL=angular2/test/directives/non_bindable_spec.map

//# sourceMappingURL=../../../angular2/test/directives/non_bindable_spec.js.map