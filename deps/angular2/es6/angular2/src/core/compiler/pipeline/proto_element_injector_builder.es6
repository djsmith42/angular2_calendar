import {assert} from "rtts_assert/rtts_assert";
import {isPresent,
  isBlank} from 'angular2/src/facade/lang';
import {ListWrapper,
  MapWrapper} from 'angular2/src/facade/collection';
import {ProtoElementInjector,
  ComponentKeyMetaData,
  DirectiveBinding} from '../element_injector';
import {CompileStep} from './compile_step';
import {CompileElement} from './compile_element';
import {CompileControl} from './compile_control';
import {DirectiveMetadata} from '../directive_metadata';
export class ProtoElementInjectorBuilder extends CompileStep {
  internalCreateProtoElementInjector(parent, index, directives, firstBindingIsComponent, distance) {
    return new ProtoElementInjector(parent, index, directives, firstBindingIsComponent, distance);
  }
  process(parent, current, control) {
    assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
    var distanceToParentInjector = this._getDistanceToParentInjector(parent, current);
    var parentProtoElementInjector = this._getParentProtoElementInjector(parent, current);
    var injectorBindings = ListWrapper.map(current.getAllDirectives(), this._createBinding);
    if (injectorBindings.length > 0 || isPresent(current.variableBindings)) {
      var protoView = current.inheritedProtoView;
      var hasComponent = isPresent(current.componentDirective);
      current.inheritedProtoElementInjector = this.internalCreateProtoElementInjector(parentProtoElementInjector, protoView.elementBinders.length, injectorBindings, hasComponent, distanceToParentInjector);
      current.distanceToParentInjector = 0;
      if (isPresent(current.variableBindings) && !isPresent(current.viewportDirective)) {
        current.inheritedProtoElementInjector.exportComponent = hasComponent;
        current.inheritedProtoElementInjector.exportElement = !hasComponent;
        var exportImplicitName = MapWrapper.get(current.variableBindings, '\$implicit');
        if (isPresent(exportImplicitName)) {
          current.inheritedProtoElementInjector.exportImplicitName = exportImplicitName;
        }
      }
    } else {
      current.inheritedProtoElementInjector = parentProtoElementInjector;
      current.distanceToParentInjector = distanceToParentInjector;
    }
  }
  _getDistanceToParentInjector(parent, current) {
    return isPresent(parent) ? parent.distanceToParentInjector + 1 : 0;
  }
  _getParentProtoElementInjector(parent, current) {
    if (isPresent(parent) && !current.isViewRoot) {
      return parent.inheritedProtoElementInjector;
    }
    return null;
  }
  _createBinding(d) {
    assert.argumentTypes(d, DirectiveMetadata);
    return assert.returnType((DirectiveBinding.createFromType(d.type, d.annotation)), DirectiveBinding);
  }
}
Object.defineProperty(ProtoElementInjectorBuilder.prototype.process, "parameters", {get: function() {
    return [[CompileElement], [CompileElement], [CompileControl]];
  }});
Object.defineProperty(ProtoElementInjectorBuilder.prototype._createBinding, "parameters", {get: function() {
    return [[DirectiveMetadata]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/compiler/pipeline/proto_element_injector_builder.map

//# sourceMappingURL=./proto_element_injector_builder.map