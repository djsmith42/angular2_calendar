import {Component, Foreach, Template, If} from 'angular2/angular2';
import {CalendarCell} from 'components/calendar-cell/calendar-cell';
import {searchAllCells} from 'stores/registry';

var HOURS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
var DAYS  = ["1 October", "2 October", "3 October", "4 October", "5 October", "6 October", "7 October", "8 OCtober", "9 October", "10 October", "11 October", "12  October", "13 October", "14 October", "15 October", "16 October", "17 October", "18 October", "19 October", "20 October", "21 October", "22 October", "23 October", "24 October", "25 October", "26 October", "27 October", "28 October", "29 October", "30 October", "31 October"];

@Component({
  selector: 'calendar',
})
@Template({
  url: System.baseURL+'app/components/calendar/calendar.html',
  directives: [
    Foreach,
    If,
    CalendarCell
  ]
})
export class Calendar {
  constructor() {
    this.hours = HOURS;
    this.days = DAYS;
    this.isLoaded = false;
  }
  load() {
    this.isLoaded = true;
  }
  searchAll() {
    searchAllCells();
  }
  dayHeaderClicked() {
    alert('dayHeaderClicked()');
  }
}
