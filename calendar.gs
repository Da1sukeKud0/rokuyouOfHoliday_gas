function createAllDayEvent(date,title){
  var calendar = CalendarApp.getCalendarById('calendarId');
  calendar.createAllDayEvent(title, new Date(date));
}