// Google Apps script
function addRokuyouToCalendar() {
  var date = new Date();
  var ret = date.getHolidays(2018);
  var ret2 = date.getDonichi(2018);
  for (var key in ret){
    //Logger.log(key + " " + new Date(key).getRokuyo(1));
    createAllDayEvent(key,new Date(key).getRokuyo(1));
  }
  for (var key in ret2){
    //Logger.log(key + " " + new Date(key).getRokuyo(1));
    createAllDayEvent(key,new Date(key).getRokuyo(1));
  }
}