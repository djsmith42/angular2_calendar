import {Component, Foreach, Template, If} from 'angular2/angular2';
import {addCell} from 'stores/registry';
import {BindingPropagationConfig} from 'angular2/core';

var randomMillis = function() {
  //return 0;
  return Math.floor(Math.random() * 500);
}

@Component({
  selector: 'calendar-cell',
  bind: {
    hour: 'hour',
    day: 'day'
  }
})
@Template({
  url: System.baseURL+'app/components/calendar-cell/calendar-cell.html',
  directives: [
    Foreach, If
  ]
})
export class CalendarCell {
	bpc;

  constructor(bpc:BindingPropagationConfig) {
    this.isPure = true;
    this.bpc = bpc;
    if (this.isPure) this.bpc.shouldBePropagated();

    addCell(this);
    this.status = {
      isSearching: false,
      searchResults: {
        options: null
      }
    }
  }
  cellClicked() {
    var alreadySearching = this.status.isSearching;
    this.status.searchResults.options = null;
    this.status.isSearching = !alreadySearching;
    if (!alreadySearching) {
      // Simulate an AJAX request:
      var self = this;
      self.isSearching = true;
      if (this.isPure) this.bpc.shouldBePropagated();
      setTimeout(() => {
        self.status.isSearching = false;
        self.status.searchResults.options = Math.floor(Math.random() * 5);
        if (this.isPure) this.bpc.shouldBePropagated();
      }, randomMillis());
    }
  }
  showSpinner() {
    return this.status.isSearching;
  }
  hideSpinner() {
    return !this.status.isSearching;
  }
  showTime() {
    return !this.status.isSearching && this.status.searchResults.options === null;
  }
  showSearchResults() {
    return !this.status.isSearching && this.status.searchResults.options !== null;
  }
}

