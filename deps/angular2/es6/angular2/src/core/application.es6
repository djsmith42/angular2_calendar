import {assert} from "rtts_assert/rtts_assert";
import {Injector,
  bind,
  OpaqueToken} from 'angular2/di';
import {Type,
  FIELD,
  isBlank,
  isPresent,
  BaseException,
  assertionsEnabled,
  print} from 'angular2/src/facade/lang';
import {DOM,
  Element} from 'angular2/src/facade/dom';
import {Compiler,
  CompilerCache} from './compiler/compiler';
import {ProtoView} from './compiler/view';
import {Reflector,
  reflector} from 'angular2/src/reflection/reflection';
import {Parser,
  Lexer,
  ChangeDetection,
  dynamicChangeDetection,
  jitChangeDetection} from 'angular2/change_detection';
import {ExceptionHandler} from './exception_handler';
import {TemplateLoader} from './compiler/template_loader';
import {TemplateResolver} from './compiler/template_resolver';
import {DirectiveMetadataReader} from './compiler/directive_metadata_reader';
import {List,
  ListWrapper} from 'angular2/src/facade/collection';
import {Promise,
  PromiseWrapper} from 'angular2/src/facade/async';
import {VmTurnZone} from 'angular2/src/core/zone/vm_turn_zone';
import {LifeCycle} from 'angular2/src/core/life_cycle/life_cycle';
import {ShadowDomStrategy,
  NativeShadowDomStrategy} from 'angular2/src/core/compiler/shadow_dom_strategy';
import {XHR} from 'angular2/src/core/compiler/xhr/xhr';
import {XHRImpl} from 'angular2/src/core/compiler/xhr/xhr_impl';
import {EventManager} from 'angular2/src/core/events/event_manager';
import {HammerGesturesPlugin} from 'angular2/src/core/events/hammer_gestures';
import {Binding} from 'angular2/src/di/binding';
var _rootInjector;
var _rootBindings = [bind(Reflector).toValue(reflector)];
export var appViewToken = new OpaqueToken('AppView');
export var appChangeDetectorToken = new OpaqueToken('AppChangeDetector');
export var appElementToken = new OpaqueToken('AppElement');
export var appComponentAnnotatedTypeToken = new OpaqueToken('AppComponentAnnotatedType');
export var appDocumentToken = new OpaqueToken('AppDocument');
function _injectorBindings(appComponentType) {
  return assert.returnType(([bind(appDocumentToken).toValue(DOM.defaultDoc()), bind(appComponentAnnotatedTypeToken).toFactory((reader) => {
    return reader.read(appComponentType);
  }, [DirectiveMetadataReader]), bind(appElementToken).toFactory((appComponentAnnotatedType, appDocument) => {
    var selector = appComponentAnnotatedType.annotation.selector;
    var element = DOM.querySelector(appDocument, selector);
    if (isBlank(element)) {
      throw new BaseException(`The app selector "${selector}" did not match any elements`);
    }
    return element;
  }, [appComponentAnnotatedTypeToken, appDocumentToken]), bind(appViewToken).toAsyncFactory((changeDetection, compiler, injector, appElement, appComponentAnnotatedType, strategy, eventManager) => {
    return compiler.compile(appComponentAnnotatedType.type).then((protoView) => {
      var appProtoView = ProtoView.createRootProtoView(protoView, appElement, appComponentAnnotatedType, changeDetection.createProtoChangeDetector('root'), strategy);
      var view = appProtoView.instantiate(null, eventManager);
      view.hydrate(injector, null, new Object());
      return view;
    });
  }, [ChangeDetection, Compiler, Injector, appElementToken, appComponentAnnotatedTypeToken, ShadowDomStrategy, EventManager]), bind(appChangeDetectorToken).toFactory((rootView) => rootView.changeDetector, [appViewToken]), bind(appComponentType).toFactory((rootView) => rootView.elementInjectors[0].getComponent(), [appViewToken]), bind(LifeCycle).toFactory((exceptionHandler) => new LifeCycle(exceptionHandler, null, assertionsEnabled()), [ExceptionHandler]), bind(EventManager).toFactory((zone) => {
    var plugins = [new HammerGesturesPlugin()];
    return new EventManager(plugins, zone);
  }, [VmTurnZone]), bind(ShadowDomStrategy).toValue(new NativeShadowDomStrategy()), Compiler, CompilerCache, TemplateResolver, bind(ChangeDetection).toValue(dynamicChangeDetection), TemplateLoader, DirectiveMetadataReader, Parser, Lexer, ExceptionHandler, bind(XHR).toValue(new XHRImpl())]), assert.genericType(List, Binding));
}
function _createVmZone(givenReporter) {
  assert.argumentTypes(givenReporter, Function);
  var defaultErrorReporter = (exception, stackTrace) => {
    var longStackTrace = ListWrapper.join(stackTrace, "\n\n-----async gap-----\n");
    print(`${exception}\n\n${longStackTrace}`);
    throw exception;
  };
  var reporter = isPresent(givenReporter) ? givenReporter : defaultErrorReporter;
  var zone = new VmTurnZone({enableLongStackTrace: assertionsEnabled()});
  zone.initCallbacks({onErrorHandler: reporter});
  return assert.returnType((zone), VmTurnZone);
}
Object.defineProperty(_createVmZone, "parameters", {get: function() {
    return [[Function]];
  }});
export function bootstrap(appComponentType, bindings = null, givenBootstrapErrorReporter = null) {
  assert.argumentTypes(appComponentType, Type, bindings, assert.genericType(List, Binding), givenBootstrapErrorReporter, Function);
  var bootstrapProcess = PromiseWrapper.completer();
  var zone = _createVmZone(givenBootstrapErrorReporter);
  zone.run(() => {
    var appInjector = _createAppInjector(appComponentType, bindings, zone);
    PromiseWrapper.then(appInjector.asyncGet(appViewToken), (rootView) => {
      var lc = appInjector.get(LifeCycle);
      lc.registerWith(zone, rootView.changeDetector);
      lc.tick();
      bootstrapProcess.complete(appInjector);
    }, (err) => {
      bootstrapProcess.reject(err);
    });
  });
  return assert.returnType((bootstrapProcess.promise), Promise);
}
Object.defineProperty(bootstrap, "parameters", {get: function() {
    return [[Type], [assert.genericType(List, Binding)], [Function]];
  }});
function _createAppInjector(appComponentType, bindings, zone) {
  assert.argumentTypes(appComponentType, Type, bindings, assert.genericType(List, Binding), zone, VmTurnZone);
  if (isBlank(_rootInjector))
    _rootInjector = new Injector(_rootBindings);
  var mergedBindings = isPresent(bindings) ? ListWrapper.concat(_injectorBindings(appComponentType), bindings) : _injectorBindings(appComponentType);
  ListWrapper.push(mergedBindings, bind(VmTurnZone).toValue(zone));
  return assert.returnType((_rootInjector.createChild(mergedBindings)), Injector);
}
Object.defineProperty(_createAppInjector, "parameters", {get: function() {
    return [[Type], [assert.genericType(List, Binding)], [VmTurnZone]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/application.map

//# sourceMappingURL=./application.map