import {assert} from "rtts_assert/rtts_assert";
import {isPresent,
  BaseException} from 'angular2/src/facade/lang';
import {ListWrapper,
  MapWrapper} from 'angular2/src/facade/collection';
import {ProtoView} from '../view';
import {ChangeDetection} from 'angular2/change_detection';
import {CompileStep} from './compile_step';
import {CompileElement} from './compile_element';
import {CompileControl} from './compile_control';
import {ShadowDomStrategy} from '../shadow_dom_strategy';
export class ProtoViewBuilder extends CompileStep {
  constructor(changeDetection, shadowDomStrategy) {
    assert.argumentTypes(changeDetection, ChangeDetection, shadowDomStrategy, ShadowDomStrategy);
    super();
    this._shadowDomStrategy = shadowDomStrategy;
    this.changeDetection = changeDetection;
  }
  process(parent, current, control) {
    assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
    var inheritedProtoView = null;
    if (current.isViewRoot) {
      var protoChangeDetector = this.changeDetection.createProtoChangeDetector('dummy');
      inheritedProtoView = new ProtoView(current.element, protoChangeDetector, this._shadowDomStrategy);
      if (isPresent(parent)) {
        if (isPresent(parent.inheritedElementBinder.nestedProtoView)) {
          throw new BaseException('Only one nested view per element is allowed');
        }
        parent.inheritedElementBinder.nestedProtoView = inheritedProtoView;
        if (isPresent(parent.variableBindings)) {
          MapWrapper.forEach(parent.variableBindings, (mappedName, varName) => {
            inheritedProtoView.bindVariable(varName, mappedName);
          });
        }
      }
    } else if (isPresent(parent)) {
      inheritedProtoView = parent.inheritedProtoView;
    }
    if (isPresent(current.variableBindings)) {
      MapWrapper.forEach(current.variableBindings, (mappedName, varName) => {
        MapWrapper.set(inheritedProtoView.protoContextLocals, mappedName, null);
      });
    }
    current.inheritedProtoView = inheritedProtoView;
  }
}
Object.defineProperty(ProtoViewBuilder, "parameters", {get: function() {
    return [[ChangeDetection], [ShadowDomStrategy]];
  }});
Object.defineProperty(ProtoViewBuilder.prototype.process, "parameters", {get: function() {
    return [[CompileElement], [CompileElement], [CompileControl]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/compiler/pipeline/proto_view_builder.map

//# sourceMappingURL=./proto_view_builder.map