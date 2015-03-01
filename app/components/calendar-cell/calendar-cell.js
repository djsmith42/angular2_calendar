import {Component, Foreach, Template, If} from 'angular2/angular2';
import {addCell} from 'stores/registry';

var randomMillis = function() {
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

  constructor() {
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
      setTimeout(() => {
        self.status.isSearching = false;
        self.status.searchResults.options = Math.floor(Math.random() * 5);
      }, randomMillis());
    }
  }
  hideSpinner() {
    return !this.status.isSearching;
  }
  hideTime() {
    return this.status.isSearching || this.status.searchResults.options !== null;
  }
  hideSearchResults() {
    return this.status.isSearching || this.status.searchResults.options === null;
  }
}

