import {assert} from "rtts_assert/rtts_assert";
import {Map,
  MapWrapper,
  ListWrapper} from 'angular2/src/facade/collection';
import {Type,
  isPresent} from 'angular2/src/facade/lang';
import {Template} from 'angular2/src/core/annotations/template';
import {TemplateResolver} from 'angular2/src/core/compiler/template_resolver';
export class MockTemplateResolver extends TemplateResolver {
  constructor() {
    super();
    this._cmpTemplates = MapWrapper.create();
  }
  setTemplate(component, template) {
    assert.argumentTypes(component, Type, template, Template);
    MapWrapper.set(this._cmpTemplates, component, template);
  }
  resolve(component) {
    assert.argumentTypes(component, Type);
    var override = MapWrapper.get(this._cmpTemplates, component);
    if (isPresent(override)) {
      return assert.returnType((override), Template);
    }
    return assert.returnType((super.resolve(component)), Template);
  }
}
Object.defineProperty(MockTemplateResolver.prototype.setTemplate, "parameters", {get: function() {
    return [[Type], [Template]];
  }});
Object.defineProperty(MockTemplateResolver.prototype.resolve, "parameters", {get: function() {
    return [[Type]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/mock/template_resolver_mock.map

//# sourceMappingURL=./template_resolver_mock.map