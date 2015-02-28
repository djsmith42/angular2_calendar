System.register(["rtts_assert/rtts_assert", "angular2/test_lib", "angular2/src/facade/dom", "angular2/di", "angular2/change_detection", "angular2/src/core/compiler/compiler", "angular2/src/core/compiler/directive_metadata_reader", "angular2/src/core/compiler/shadow_dom_strategy", "angular2/src/core/compiler/template_loader", "angular2/src/mock/template_resolver_mock", "angular2/src/core/compiler/binding_propagation_config", "angular2/src/core/annotations/annotations", "angular2/src/core/annotations/template", "angular2/src/core/annotations/visibility", "angular2/src/core/compiler/view_container"], function($__export) {
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
      DynamicChangeDetection,
      Pipe,
      PipeRegistry,
      Compiler,
      CompilerCache,
      DirectiveMetadataReader,
      NativeShadowDomStrategy,
      TemplateLoader,
      MockTemplateResolver,
      BindingPropagationConfig,
      Decorator,
      Component,
      Viewport,
      Template,
      Parent,
      Ancestor,
      ViewContainer,
      MyDir,
      PushBasedComp,
      MyComp,
      ComponentWithPipes,
      ChildComp,
      SomeDirective,
      CompWithParent,
      CompWithAncestor,
      SomeViewport,
      MyService,
      DoublePipe,
      DoublePipeFactory;
  function main() {
    describe('integration tests', function() {
      var compiler,
          tplResolver;
      function createCompiler(tplResolver, changedDetection) {
        return new Compiler(changedDetection, new TemplateLoader(null), new DirectiveMetadataReader(), new Parser(new Lexer()), new CompilerCache(), new NativeShadowDomStrategy(), tplResolver);
      }
      beforeEach((function() {
        tplResolver = new MockTemplateResolver();
        compiler = createCompiler(tplResolver, dynamicChangeDetection);
      }));
      describe('react to record changes', function() {
        var view,
            ctx,
            cd;
        function createView(pv) {
          ctx = new MyComp();
          view = pv.instantiate(null, null);
          view.hydrate(new Injector([]), null, ctx);
          cd = view.changeDetector;
        }
        it('should consume text node changes', (function(done) {
          tplResolver.setTemplate(MyComp, new Template({inline: '<div>{{ctxProp}}</div>'}));
          compiler.compile(MyComp).then((function(pv) {
            createView(pv);
            ctx.ctxProp = 'Hello World!';
            cd.detectChanges();
            expect(DOM.getInnerHTML(view.nodes[0])).toEqual('Hello World!');
            done();
          }));
        }));
        it('should consume element binding changes', (function(done) {
          tplResolver.setTemplate(MyComp, new Template({inline: '<div [id]="ctxProp"></div>'}));
          compiler.compile(MyComp).then((function(pv) {
            createView(pv);
            ctx.ctxProp = 'Hello World!';
            cd.detectChanges();
            expect(view.nodes[0].id).toEqual('Hello World!');
            done();
          }));
        }));
        it('should consume binding to aria-* attributes', (function(done) {
          tplResolver.setTemplate(MyComp, new Template({inline: '<div [aria-label]="ctxProp"></div>'}));
          compiler.compile(MyComp).then((function(pv) {
            createView(pv);
            ctx.ctxProp = 'Initial aria label';
            cd.detectChanges();
            expect(DOM.getAttribute(view.nodes[0], 'aria-label')).toEqual('Initial aria label');
            ctx.ctxProp = 'Changed aria label';
            cd.detectChanges();
            expect(DOM.getAttribute(view.nodes[0], 'aria-label')).toEqual('Changed aria label');
            done();
          }));
        }));
        it('should consume directive watch expression change.', (function(done) {
          var tpl = '<div>' + '<div my-dir [elprop]="ctxProp"></div>' + '<div my-dir elprop="Hi there!"></div>' + '<div my-dir elprop="Hi {{\'there!\'}}"></div>' + '<div my-dir elprop="One more {{ctxProp}}"></div>' + '</div>';
          tplResolver.setTemplate(MyComp, new Template({
            inline: tpl,
            directives: [MyDir]
          }));
          compiler.compile(MyComp).then((function(pv) {
            createView(pv);
            ctx.ctxProp = 'Hello World!';
            cd.detectChanges();
            expect(view.elementInjectors[0].get(MyDir).dirProp).toEqual('Hello World!');
            expect(view.elementInjectors[1].get(MyDir).dirProp).toEqual('Hi there!');
            expect(view.elementInjectors[2].get(MyDir).dirProp).toEqual('Hi there!');
            expect(view.elementInjectors[3].get(MyDir).dirProp).toEqual('One more Hello World!');
            done();
          }));
        }));
        it("should support pipes in bindings and bind config", (function(done) {
          tplResolver.setTemplate(MyComp, new Template({
            inline: '<component-with-pipes #comp [prop]="ctxProp | double"></component-with-pipes>',
            directives: [ComponentWithPipes]
          }));
          var registry = new PipeRegistry({"double": [new DoublePipeFactory()]});
          var changeDetection = new DynamicChangeDetection(registry);
          var compiler = createCompiler(tplResolver, changeDetection);
          compiler.compile(MyComp).then((function(pv) {
            createView(pv);
            ctx.ctxProp = 'a';
            cd.detectChanges();
            var comp = view.contextWithLocals.get("comp");
            expect(comp.prop).toEqual('aaaa');
            done();
          }));
        }));
        it('should support nested components.', (function(done) {
          tplResolver.setTemplate(MyComp, new Template({
            inline: '<child-cmp></child-cmp>',
            directives: [ChildComp]
          }));
          compiler.compile(MyComp).then((function(pv) {
            createView(pv);
            cd.detectChanges();
            expect(view.nodes[0].shadowRoot.childNodes[0].nodeValue).toEqual('hello');
            done();
          }));
        }));
        it('should support different directive types on a single node', (function(done) {
          tplResolver.setTemplate(MyComp, new Template({
            inline: '<child-cmp my-dir [elprop]="ctxProp"></child-cmp>',
            directives: [MyDir, ChildComp]
          }));
          compiler.compile(MyComp).then((function(pv) {
            createView(pv);
            ctx.ctxProp = 'Hello World!';
            cd.detectChanges();
            var elInj = view.elementInjectors[0];
            expect(elInj.get(MyDir).dirProp).toEqual('Hello World!');
            expect(elInj.get(ChildComp).dirProp).toEqual(null);
            done();
          }));
        }));
        it('should support directives where a binding attribute is not given', function(done) {
          tplResolver.setTemplate(MyComp, new Template({
            inline: '<p my-dir></p>',
            directives: [MyDir]
          }));
          compiler.compile(MyComp).then((function(pv) {
            createView(pv);
            done();
          }));
        });
        it('should support template directives via `<template>` elements.', (function(done) {
          tplResolver.setTemplate(MyComp, new Template({
            inline: '<div><template some-viewport var-greeting="some-tmpl"><copy-me>{{greeting}}</copy-me></template></div>',
            directives: [SomeViewport]
          }));
          compiler.compile(MyComp).then((function(pv) {
            createView(pv);
            cd.detectChanges();
            var childNodesOfWrapper = view.nodes[0].childNodes;
            expect(childNodesOfWrapper.length).toBe(3);
            expect(childNodesOfWrapper[1].childNodes[0].nodeValue).toEqual('hello');
            expect(childNodesOfWrapper[2].childNodes[0].nodeValue).toEqual('again');
            done();
          }));
        }));
        it('should support template directives via `template` attribute.', (function(done) {
          tplResolver.setTemplate(MyComp, new Template({
            inline: '<div><copy-me template="some-viewport: var greeting=some-tmpl">{{greeting}}</copy-me></div>',
            directives: [SomeViewport]
          }));
          compiler.compile(MyComp).then((function(pv) {
            createView(pv);
            cd.detectChanges();
            var childNodesOfWrapper = view.nodes[0].childNodes;
            expect(childNodesOfWrapper.length).toBe(3);
            expect(childNodesOfWrapper[1].childNodes[0].nodeValue).toEqual('hello');
            expect(childNodesOfWrapper[2].childNodes[0].nodeValue).toEqual('again');
            done();
          }));
        }));
        it('should assign the component instance to a var-', (function(done) {
          tplResolver.setTemplate(MyComp, new Template({
            inline: '<p><child-cmp var-alice></child-cmp></p>',
            directives: [ChildComp]
          }));
          compiler.compile(MyComp).then((function(pv) {
            createView(pv);
            expect(view.contextWithLocals).not.toBe(null);
            expect(view.contextWithLocals.get('alice')).toBeAnInstanceOf(ChildComp);
            done();
          }));
        }));
        it('should assign two component instances each with a var-', (function(done) {
          tplResolver.setTemplate(MyComp, new Template({
            inline: '<p><child-cmp var-alice></child-cmp><child-cmp var-bob></p>',
            directives: [ChildComp]
          }));
          compiler.compile(MyComp).then((function(pv) {
            createView(pv);
            expect(view.contextWithLocals).not.toBe(null);
            expect(view.contextWithLocals.get('alice')).toBeAnInstanceOf(ChildComp);
            expect(view.contextWithLocals.get('bob')).toBeAnInstanceOf(ChildComp);
            expect(view.contextWithLocals.get('alice')).not.toBe(view.contextWithLocals.get('bob'));
            done();
          }));
        }));
        it('should assign the component instance to a var- with shorthand syntax', (function(done) {
          tplResolver.setTemplate(MyComp, new Template({
            inline: '<child-cmp #alice></child-cmp>',
            directives: [ChildComp]
          }));
          compiler.compile(MyComp).then((function(pv) {
            createView(pv);
            expect(view.contextWithLocals).not.toBe(null);
            expect(view.contextWithLocals.get('alice')).toBeAnInstanceOf(ChildComp);
            done();
          }));
        }));
        it('should assign the element instance to a user-defined variable', (function(done) {
          tplResolver.setTemplate(MyComp, new Template({inline: '<p><div var-alice><i>Hello</i></div></p>'}));
          compiler.compile(MyComp).then((function(pv) {
            createView(pv);
            expect(view.contextWithLocals).not.toBe(null);
            var value = view.contextWithLocals.get('alice');
            expect(value).not.toBe(null);
            expect(value.tagName).toEqual('DIV');
            done();
          }));
        }));
        it('should provide binding configuration config to the component', (function(done) {
          tplResolver.setTemplate(MyComp, new Template({
            inline: '<push-cmp #cmp></push-cmp>',
            directives: [[[PushBasedComp]]]
          }));
          compiler.compile(MyComp).then((function(pv) {
            createView(pv);
            var cmp = view.contextWithLocals.get('cmp');
            cd.detectChanges();
            expect(cmp.numberOfChecks).toEqual(1);
            cd.detectChanges();
            expect(cmp.numberOfChecks).toEqual(1);
            cmp.propagate();
            cd.detectChanges();
            expect(cmp.numberOfChecks).toEqual(2);
            done();
          }));
        }));
        it('should create a component that injects a @Parent', (function(done) {
          tplResolver.setTemplate(MyComp, new Template({
            inline: '<some-directive><cmp-with-parent #child></cmp-with-parent></some-directive>',
            directives: [SomeDirective, CompWithParent]
          }));
          compiler.compile(MyComp).then((function(pv) {
            createView(pv);
            var childComponent = view.contextWithLocals.get('child');
            expect(childComponent.myParent).toBeAnInstanceOf(SomeDirective);
            done();
          }));
        }));
        it('should create a component that injects an @Ancestor', (function(done) {
          tplResolver.setTemplate(MyComp, new Template({
            inline: "\n            <some-directive>\n              <p>\n                <cmp-with-ancestor #child></cmp-with-ancestor>\n              </p>\n            </some-directive>",
            directives: [SomeDirective, CompWithAncestor]
          }));
          compiler.compile(MyComp).then((function(pv) {
            createView(pv);
            var childComponent = view.contextWithLocals.get('child');
            expect(childComponent.myAncestor).toBeAnInstanceOf(SomeDirective);
            done();
          }));
        }));
      });
    });
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
      DynamicChangeDetection = $__m.DynamicChangeDetection;
      Pipe = $__m.Pipe;
      PipeRegistry = $__m.PipeRegistry;
    }, function($__m) {
      Compiler = $__m.Compiler;
      CompilerCache = $__m.CompilerCache;
    }, function($__m) {
      DirectiveMetadataReader = $__m.DirectiveMetadataReader;
    }, function($__m) {
      NativeShadowDomStrategy = $__m.NativeShadowDomStrategy;
    }, function($__m) {
      TemplateLoader = $__m.TemplateLoader;
    }, function($__m) {
      MockTemplateResolver = $__m.MockTemplateResolver;
    }, function($__m) {
      BindingPropagationConfig = $__m.BindingPropagationConfig;
    }, function($__m) {
      Decorator = $__m.Decorator;
      Component = $__m.Component;
      Viewport = $__m.Viewport;
    }, function($__m) {
      Template = $__m.Template;
    }, function($__m) {
      Parent = $__m.Parent;
      Ancestor = $__m.Ancestor;
    }, function($__m) {
      ViewContainer = $__m.ViewContainer;
    }],
    execute: function() {
      MyDir = (function() {
        var MyDir = function MyDir() {
          this.dirProp = '';
        };
        return ($traceurRuntime.createClass)(MyDir, {}, {});
      }());
      Object.defineProperty(MyDir, "annotations", {get: function() {
          return [new Decorator({
            selector: '[my-dir]',
            bind: {'dirProp': 'elprop'}
          })];
        }});
      PushBasedComp = (function() {
        var PushBasedComp = function PushBasedComp(bpc) {
          assert.argumentTypes(bpc, BindingPropagationConfig);
          this.numberOfChecks = 0;
          this.bpc = bpc;
          bpc.shouldBePropagated();
        };
        return ($traceurRuntime.createClass)(PushBasedComp, {
          get field() {
            this.numberOfChecks++;
            return "fixed";
          },
          propagate: function() {
            this.bpc.shouldBePropagatedFromRoot();
          }
        }, {});
      }());
      Object.defineProperty(PushBasedComp, "annotations", {get: function() {
          return [new Component({selector: 'push-cmp'}), new Template({inline: '{{field}}'})];
        }});
      Object.defineProperty(PushBasedComp, "parameters", {get: function() {
          return [[BindingPropagationConfig]];
        }});
      MyComp = (function() {
        var MyComp = function MyComp() {
          this.ctxProp = 'initial value';
        };
        return ($traceurRuntime.createClass)(MyComp, {}, {});
      }());
      Object.defineProperty(MyComp, "annotations", {get: function() {
          return [new Component()];
        }});
      ComponentWithPipes = (function() {
        var ComponentWithPipes = function ComponentWithPipes() {};
        return ($traceurRuntime.createClass)(ComponentWithPipes, {}, {});
      }());
      Object.defineProperty(ComponentWithPipes, "annotations", {get: function() {
          return [new Component({
            selector: 'component-with-pipes',
            bind: {"prop": "prop | double"}
          }), new Template({inline: ''})];
        }});
      ChildComp = (function() {
        var ChildComp = function ChildComp(service) {
          assert.argumentTypes(service, MyService);
          this.ctxProp = service.greeting;
          this.dirProp = null;
        };
        return ($traceurRuntime.createClass)(ChildComp, {}, {});
      }());
      Object.defineProperty(ChildComp, "annotations", {get: function() {
          return [new Component({
            selector: 'child-cmp',
            componentServices: [MyService]
          }), new Template({
            directives: [MyDir],
            inline: '{{ctxProp}}'
          })];
        }});
      Object.defineProperty(ChildComp, "parameters", {get: function() {
          return [[MyService]];
        }});
      SomeDirective = (function() {
        var SomeDirective = function SomeDirective() {};
        return ($traceurRuntime.createClass)(SomeDirective, {}, {});
      }());
      Object.defineProperty(SomeDirective, "annotations", {get: function() {
          return [new Decorator({selector: 'some-directive'})];
        }});
      CompWithParent = (function() {
        var CompWithParent = function CompWithParent(someComp) {
          assert.argumentTypes(someComp, SomeDirective);
          this.myParent = someComp;
        };
        return ($traceurRuntime.createClass)(CompWithParent, {}, {});
      }());
      Object.defineProperty(CompWithParent, "annotations", {get: function() {
          return [new Component({selector: 'cmp-with-parent'}), new Template({
            inline: '<p>Component with an injected parent</p>',
            directives: [SomeDirective]
          })];
        }});
      Object.defineProperty(CompWithParent, "parameters", {get: function() {
          return [[SomeDirective, new Parent()]];
        }});
      CompWithAncestor = (function() {
        var CompWithAncestor = function CompWithAncestor(someComp) {
          assert.argumentTypes(someComp, SomeDirective);
          this.myAncestor = someComp;
        };
        return ($traceurRuntime.createClass)(CompWithAncestor, {}, {});
      }());
      Object.defineProperty(CompWithAncestor, "annotations", {get: function() {
          return [new Component({selector: 'cmp-with-ancestor'}), new Template({
            inline: '<p>Component with an injected ancestor</p>',
            directives: [SomeDirective]
          })];
        }});
      Object.defineProperty(CompWithAncestor, "parameters", {get: function() {
          return [[SomeDirective, new Ancestor()]];
        }});
      SomeViewport = (function() {
        var SomeViewport = function SomeViewport(container) {
          assert.argumentTypes(container, ViewContainer);
          container.create().setLocal('some-tmpl', 'hello');
          container.create().setLocal('some-tmpl', 'again');
        };
        return ($traceurRuntime.createClass)(SomeViewport, {}, {});
      }());
      Object.defineProperty(SomeViewport, "annotations", {get: function() {
          return [new Viewport({selector: '[some-viewport]'})];
        }});
      Object.defineProperty(SomeViewport, "parameters", {get: function() {
          return [[ViewContainer]];
        }});
      MyService = (function() {
        var MyService = function MyService() {
          this.greeting = 'hello';
        };
        return ($traceurRuntime.createClass)(MyService, {}, {});
      }());
      DoublePipe = (function($__super) {
        var DoublePipe = function DoublePipe() {
          $traceurRuntime.superConstructor(DoublePipe).apply(this, arguments);
        };
        return ($traceurRuntime.createClass)(DoublePipe, {
          supports: function(obj) {
            return true;
          },
          transform: function(value) {
            return ("" + value + value);
          }
        }, {}, $__super);
      }(Pipe));
      DoublePipeFactory = (function() {
        var DoublePipeFactory = function DoublePipeFactory() {};
        return ($traceurRuntime.createClass)(DoublePipeFactory, {
          supports: function(obj) {
            return true;
          },
          create: function() {
            return new DoublePipe();
          }
        }, {});
      }());
    }
  };
});

//# sourceMappingURL=angular2/test/core/compiler/integration_spec.map

//# sourceMappingURL=../../../../angular2/test/core/compiler/integration_spec.js.map