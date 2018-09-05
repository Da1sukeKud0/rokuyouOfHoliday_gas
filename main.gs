//
// Google Apps script
//
// 祝祭日と土日の六曜をカレンダーに追加する関数

function addRokuyouToCalendar(year) {
  try{
    var date = new Date();
    var ret = date.getHolidays(Number(year));
    var ret2 = date.getDonichi(Number(year));
    // 祝祭日の六曜を追加
    for (var key in ret){
      var date = new Date(key);
      // 祝祭日が土日であった場合スキップ
      if (date.getDay() === 0 || date.getDay() ===6){
        continue;
      }
      //Logger.log(key + " " + new Date(key).getRokuyo(1));
      createAllDayEvent(key, date.getRokuyo(1));
    }
    // 土日の六曜を追加
    for (var key in ret2){
      //Logger.log(key + " " + new Date(key).getRokuyo(1));
      createAllDayEvent(key, new Date(key).getRokuyo(1));
    }
  }catch(e){
    Logger.log("西暦として正しい数値を入力してください" + e);
  }
}
function test_addRokuyouToCalendar(){
  //2018年でテスト
  addRokuyouToCalendar(2018);
}
