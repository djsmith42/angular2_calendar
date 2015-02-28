import {assert} from "rtts_assert/rtts_assert";
import {Promise,
  PromiseWrapper} from 'angular2/src/facade/async';
import {bind} from 'angular2/di';
import {WebDriverAdapter} from '../web_driver_adapter';
import webdriver from 'selenium-webdriver';
export class SeleniumWebDriverAdapter extends WebDriverAdapter {
  constructor(driver) {
    super();
    this._driver = driver;
  }
  _convertPromise(thenable) {
    var completer = PromiseWrapper.completer();
    thenable.then((data) => completer.complete(convertToLocalProcess(data)), completer.reject);
    return completer.promise;
  }
  waitFor(callback) {
    return assert.returnType((this._convertPromise(this._driver.controlFlow().execute(callback))), Promise);
  }
  executeScript(script) {
    assert.argumentTypes(script, assert.type.string);
    return assert.returnType((this._convertPromise(this._driver.executeScript(script))), Promise);
  }
  capabilities() {
    return assert.returnType((this._convertPromise(this._driver.getCapabilities().then((capsObject) => capsObject.toJSON()))), Promise);
  }
  logs(type) {
    assert.argumentTypes(type, assert.type.string);
    return assert.returnType((this._convertPromise(this._driver.schedule(new webdriver.Command(webdriver.CommandName.GET_LOG).setParameter('type', type), 'WebDriver.manage().logs().get(' + type + ')'))), Promise);
  }
}
Object.defineProperty(SeleniumWebDriverAdapter.prototype.executeScript, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(SeleniumWebDriverAdapter.prototype.logs, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
function convertToLocalProcess(data) {
  var serialized = JSON.stringify(data);
  if ('' + serialized === 'undefined') {
    return undefined;
  }
  return JSON.parse(serialized);
}

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/benchpress/src/webdriver/selenium_webdriver_adapter.map

//# sourceMappingURL=./selenium_webdriver_adapter.map