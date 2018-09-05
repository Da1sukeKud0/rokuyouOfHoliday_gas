# RokuyouOfHoliday_gas
結婚式が挙げられることの多い土日祝日における六曜をGoogleカレンダーに表示するGoogleAppsScriptです。  
ブライダルバイト民がシフト計画を立てる際の参考にでもなればいいなと思っています。  
既存コードの改変・転用をかなり雑に処理してしまったので、後ほど改善する予定です。

googleカレンダーで2018,2019年度版を公開しています。  
https://calendar.google.com/calendar/embed?src=icqe4kvkba0pi1v8fp13sv2j6s%40group.calendar.google.com&ctz=Asia%2FTokyo  

## scriptを実行する方へ
calendar.gs内のCalendarApp.getCalendarById('calendarId')関数の引数を変更し、main.gs内のtest_addRokuyouToCalendar()関数内にて年度を変更し実行してください。  

## 公開されているカレンダーをiPhoneに追加し表示する方法
googleアカウントでログイン後、以下のURLを開きページ下部の追加ボタンを選択してください。  
https://calendar.google.com/calendar/embed?src=icqe4kvkba0pi1v8fp13sv2j6s%40group.calendar.google.com&ctz=Asia%2FTokyo  
![fig01](https://github.com/Da1sukeKud0/rokuyouOfHoliday_gas/blob/master/img/fig01.jpg "fig01")

GoogleカレンダーをiPhoneのカレンダーアプリに表示する方法については以下を参照してください。  
https://iphone-mania.jp/manual/standardappli-155812/
