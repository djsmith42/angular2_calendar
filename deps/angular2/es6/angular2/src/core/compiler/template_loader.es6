import {assert} from "rtts_assert/rtts_assert";
import {isBlank,
  isPresent,
  BaseException,
  stringify} from 'angular2/src/facade/lang';
import {DOM,
  Element} from 'angular2/src/facade/dom';
import {StringMapWrapper,
  StringMap} from 'angular2/src/facade/collection';
import {XHR} from './xhr/xhr';
import {Template} from 'angular2/src/core/annotations/template';
export class TemplateLoader {
  constructor(xhr) {
    assert.argumentTypes(xhr, XHR);
    this._xhr = xhr;
    this._cache = StringMapWrapper.create();
  }
  load(template) {
    assert.argumentTypes(template, Template);
    if (isPresent(template.inline)) {
      return DOM.createTemplate(template.inline);
    }
    if (isPresent(template.url)) {
      var url = template.url;
      var promise = StringMapWrapper.get(this._cache, url);
      if (isBlank(promise)) {
        promise = this._xhr.get(url).then(function(html) {
          var template = DOM.createTemplate(html);
          return template;
        });
        StringMapWrapper.set(this._cache, url, promise);
      }
      return promise;
    }
    throw new BaseException(`Templates should have either their url or inline property set`);
  }
}
Object.defineProperty(TemplateLoader, "parameters", {get: function() {
    return [[XHR]];
  }});
Object.defineProperty(TemplateLoader.prototype.load, "parameters", {get: function() {
    return [[Template]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/core/compiler/template_loader.map

//# sourceMappingURL=./template_loader.map