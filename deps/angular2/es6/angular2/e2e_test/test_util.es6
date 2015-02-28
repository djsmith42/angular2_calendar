var webdriver = require('selenium-webdriver');
module.exports = {
  verifyNoBrowserErrors: verifyNoBrowserErrors,
  clickAll: clickAll
};
function clickAll(buttonSelectors) {
  buttonSelectors.forEach(function(selector) {
    $(selector).click();
  });
}
function verifyNoBrowserErrors() {
  browser.executeScript('1+1');
  browser.manage().logs().get('browser').then(function(browserLog) {
    var filteredLog = browserLog.filter(function(logEntry) {
      return logEntry.level.value > webdriver.logging.Level.WARNING.value;
    });
    expect(filteredLog.length).toEqual(0);
    if (filteredLog.length) {
      console.log('browser console errors: ' + require('util').inspect(filteredLog));
    }
  });
}

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/e2e_test/test_util.map

//# sourceMappingURL=./test_util.map