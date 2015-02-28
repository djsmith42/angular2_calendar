import {bootstrap} from 'angular2/angular2';
import {Calendar} from 'components/calendar/calendar';
import {CalendarCell} from 'components/calendar-cell/calendar-cell';

export function main() {
  return bootstrap(Calendar);
}
