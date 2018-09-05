function createAllDayEvent(date,title){
  //var calendar = CalendarApp.getCalendarById('icqe4kvkba0pi1v8fp13sv2j6s@group.calendar.google.com');
  var calendar = CalendarApp.getCalendarById('83tvsnkv29vrg9gkenbt1n3tsk@group.calendar.google.com');
  calendar.createAllDayEvent(title, new Date(date));
}