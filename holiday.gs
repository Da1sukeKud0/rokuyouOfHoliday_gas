// 
// Google Apps script
// Quote:https://qiita.com/hrdaya/items/34ac4ab06a97debb1ffc
//
// 指定した年の祝祭日一覧を取得する関数（修正版）

/**
* @param {Number} year 取得する年（西暦）指定されていない場合は今年
* @return {Object} 取得した祝祭日の一覧
*/
Date.prototype.getHolidays = function(year) {
    "use strict";
    // 戻り値となるオブジェクト
    var ret = {};
    
    // yearは文字列で指定されるかもしれないことを想定して整数に変換しておく
    year = parseInt(year, 10);
    
    // yearが指定されていない場合は今年にする
    year = isNaN(year) ? new Date().getFullYear() : year;
    
    // getHoliday内で使用する定数
    var consts = {
      strFurikae:  "振替休日", // 振替休日用の文字列
      dateFurikae: new Date(1973, 3, 12), // 振替休日の施行日
      strKokumin:  "国民の休日", // 国民の休日用の文字列
      dateKokumin: new Date(1985, 11, 27), // 国民の休日の施行日
      strDonichi: "土日", //土曜および日曜用の文字列
    };
    
    
    // getHoliday内で使用するヘルパー関数
    var func = {
      /**
      * 2桁に0埋めした文字列を返す
      *
      * @param {Number} val 0埋めする数字
      * @return {String} 0埋めした文字列
      */
      pad: function(val) {
        // 要素数2の配列を0で結合し（出来るのは"0"）
        // Array(2).join("0")とvalを結合
        // 出来た文字列の右側から二文字を切り出す
        return (new Array(2).join("0") + val).slice(-2);
        
        // やっていることは下記と同じ
        // return ("0" + val).slice(-2);
      },
      
      /**
      * キーに使用する文字列を返す(yyyy/MM/dd)
      *
      * @param {Date} date フォーマットする日付
      * @return {String} フォーマットした文字列
      */
      format: function(date) {
        return date.getFullYear() + "/" +
          this.pad(date.getMonth() + 1) + "/" +
            this.pad(date.getDate());
      },
      
      /**
      * 1月第2月曜日などの移動日の日付にセットする
      *
      * @param {Date} date 取得する月の1日にセットした日付
      * @param {Number} count 何回目
      * @param {Number} day 曜日（0:日曜日～6:土曜日）
      */
      setDayCountsInMonth: function(date, count, day) {
        // 第1回目の日付の取得
        // その月の第1週目の「day」で指定した曜日の日付を取得する
        var days = day - date.getDay() + 1;
        
        // 日付が1より小さい時は「day」で指定した曜日が2週目から始まる
        days += days < 1 ? count * 7 : (count - 1) * 7;
        
        // 取得した日付にセットする
        date.setDate(days);
      },
      
      /**
      * 春分の日の日付にセットする
      * http://www.wikiwand.com/ja/%E6%98%A5%E5%88%86%E3%81%AE%E6%97%A5
      * http://www.wikiwand.com/ja/%E6%98%A5%E5%88%86
      *
      * @param {Date} date 日付をセットするDateオブジェクト
      * @param {Number} year 取得する年
      */
      setSyunbun: function(date, year) {
        // 年を4で割った時の余り
        var surplus = year % 4;
        
        // 取得する日（範囲外の時はとりあえず20日）
        var day = 20;
        if (1800 <= year && year <= 1827) {
          day = 21;
        } else if (1828 <= year && year <= 1859) {
          day = surplus < 1 ? 20 : 21;
        } else if (1860 <= year && year <= 1891) {
          day = surplus < 2 ? 20 : 21;
        } else if (1892 <= year && year <= 1899) {
          day = surplus < 3 ? 20 : 21;
        } else if (1900 <= year && year <= 1923) {
          day = surplus < 3 ? 21 : 22;
        } else if (1924 <= year && year <= 1959) {
          day = 21;
        } else if (1960 <= year && year <= 1991) {
          day = surplus < 1 ? 20 : 21;
        } else if (1992 <= year && year <= 2023) {
          day = surplus < 2 ? 20 : 21;
        } else if (2024 <= year && year <= 2055) {
          day = surplus < 3 ? 20 : 21;
        } else if (2056 <= year && year <= 2091) {
          day = 20;
        } else if (2092 <= year && year <= 2099) {
          day = surplus < 1 ? 19 : 20;
        } else if (2100 <= year && year <= 2123) {
          day = surplus < 1 ? 20 : 21;
        } else if (2124 <= year && year <= 2155) {
          day = surplus < 2 ? 20 : 21;
        } else if (2156 <= year && year <= 2187) {
          day = surplus < 3 ? 20 : 21;
        } else if (2188 <= year && year <= 2199) {
          day = 20;
        }
        
        // 取得した日付にセットする
        date.setDate(day);
      },
      
      /**
      * 秋分の日の日付にセットする
      * http://www.wikiwand.com/ja/%E7%A7%8B%E5%88%86%E3%81%AE%E6%97%A5
      * http://www.wikiwand.com/ja/%E7%A7%8B%E5%88%86
      *
      * @param {Date} date 日付をセットするDateオブジェクト
      * @param {Number} year 取得する年
      */
      setSyuubun: function(date, year) {
        // 年を4で割った時の余り
        var surplus = year % 4;
        
        // 取得する日（範囲外の時はとりあえず23日）
        var day = 23;
        if (1800 <= year && year <= 1823) {
          day = surplus < 2 ? 23 : 24;
        } else if (1824 <= year && year <= 1851) {
          day = surplus < 3 ? 23 : 24;
        } else if (1852 <= year && year <= 1887) {
          day = 23;
        } else if (1888 <= year && year <= 1899) {
          day = surplus < 1 ? 22 : 23;
        } else if (1900 <= year && year <= 1919) {
          day = surplus < 1 ? 23 : 24;
        } else if (1920 <= year && year <= 1947) {
          day = surplus < 2 ? 23 : 24;
        } else if (1948 <= year && year <= 1979) {
          day = surplus < 3 ? 23 : 24;
        } else if (1980 <= year && year <= 2011) {
          day = 23;
        } else if (2012 <= year && year <= 2043) {
          day = surplus < 1 ? 22 : 23;
        } else if (2044 <= year && year <= 2075) {
          day = surplus < 2 ? 22 : 23;
        } else if (2076 <= year && year <= 2099) {
          day = surplus < 3 ? 22 : 23;
        } else if (2100 <= year && year <= 2103) {
          day = surplus < 3 ? 23 : 24;
        } else if (2104 <= year && year <= 2139) {
          day = 23;
        } else if (2140 <= year && year <= 2167) {
          day = surplus < 1 ? 22 : 23;
        } else if (2168 <= year && year <= 2199) {
          day = surplus < 2 ? 22 : 23;
        }
        
        // 取得した日付にセットする
        date.setDate(day);
      },
      
      /**
      * 振替休日を戻り値のオブジェクトにセットする
      *
      * 1973年4月12日以降で、日曜日に当たる場合は該当日の翌日以降の平日を振替休日にする
      *
      * @param {Date} date 祝祭日にセットされた日付
      */
      setFurikae: function(date) {
        // 1973年4月12日以降で、日曜日に当たる場合は翌日を振替休日にする
        if (date.getDay() === 0 && date >= consts.dateFurikae) {
          // 該当日が戻り値のオブジェクトに含まれている
          // もしくは日曜日の間日付を追加
          while (this.inObject(date) || date.getDay() === 0) {
            date.setDate(date.getDate() + 1);
          }
          
          // 戻り値のオブジェクトに値をセット
          this.setObject(date, consts.strFurikae);
        }
      },
      
      /**
      * 国民の休日を戻り値のオブジェクトにセットする
      * 
      * 1985年12月27日以降で祝日と祝日に挟まれた平日の場合は挟まれた平日を国民の休日にする
      *
      * @param {Date} date 祝祭日にセットされた日付
      */
      setKokumin: function(date) {
        // 日付を二日前にセット
        date.setDate(date.getDate() - 2);
        
        // 1985年12月27日以降の時に二日前に祝日が存在する場合
        if (this.inObject(date) && date >= consts.dateKokumin) {
          // 日付を1日後（祝日と祝日の間の日）に移す
          date.setDate(date.getDate() + 1);
          
          // 挟まれた平日が休日なので該当日が火曜日以降の時に戻り値に値をセットする
          // 該当日が月曜日の場合は振替休日となっている
          // 連続した祝日の時は国民の休日とならないためすでに祝日が含まれているか確認する
          if (date.getDay() > 1 && !this.inObject(date)) {
            // 戻り値のオブジェクトに値をセット
            this.setObject(date, consts.strKokumin);
          }
        }
      },
      
      /**
      * 土曜,日曜を戻り値のオブジェクトにセットする
      *
      * @param {Date} date 祝祭日にセットされた日付
      */
      setDonichi: function(date) {
        //土曜もしくは日曜に当たる場合
        if (date.getDay() === 0 || date.getDay() === 6) {
          // 戻り値のオブジェクトに値をセット
          this.setObject(date, consts.strDonichi);
        }
      },
      
      /**
      * 祝祭日をセットする
      * 
      * @param {Date} date 祝祭日の設定に使用するDateオブジェクト
      * @param {Number} year 祝祭日を設定する年
      * @param {Number} month 祝祭日を設定する月
      * @param {Number|Array|String} dateVal 数字：固定日付
      *                                      配列：[count,day]形式の配列
      *                                      文字列：日付を取得する関数
      * @param {String} name 祝祭日名
      */
      setHoliday: function(date, year, month, dateVal, name) {
        // とりあえず1日にセット
        date.setFullYear(year, month, 1);
        // 型によって処理の切り替え
        switch (Object.prototype.toString.call(dateVal)) {
          case "[object Number]":
            // 固定値の時の処理
            date.setDate(dateVal);
            break;
          case "[object Array]":
            // 配列の時の処理
            this.setDayCountsInMonth(date, dateVal[0], dateVal[1]);
            break;
          case "[object String]":
            // 文字列の時の処理
            if (this.hasOwnProperty(dateVal) && 
                Object.prototype.toString.call(this[dateVal]) === "[object Function]") {
              // 「func」に関数が定義されている時
              this[dateVal](date, year);
            } else {
              // 「func」に関数が定義されていない時は例外をスローする
              throw new Error("指定の関数が存在しません");
            }
            break;
          default:
            // 「holidays」の設定ミスの場合は例外をスローする
            throw new Error("引数のデータ型がおかしいです");
        }
        
        // 戻り値に値をセット
        this.setObject(date, name);
      },
      
      /**
      * 祝祭日を戻り値のオブジェクトにセットする
      * 
      * @param {Date} date 祝祭日の設定に使用するDateオブジェクト
      * @param {String} name 祝祭日名
      */
      setObject: function(date, name) {
        // 戻り値に値をセット
        ret[this.format(date)] = name;
      },
      
      /**
      * 該当する日付が戻り値に存在するかどうか
      * 
      * @param {Date} date 存在の確認に使用するDateオブジェクト
      * @return {Boolean} 
      */
      inObject: function(date) {
        return ret.hasOwnProperty(this.format(date));
      }
    };
    
    /**
    * 祝祭日の配列
    *
    * [開始年、終了年、月、日、祝祭日名]
    * 日は数字ならその日、配列なら[何回目、曜日]、文字列なら実行する関数名
    */
    var holidays = [
      [1874, 1948, 1, 1, "四方節"],
      [1949, 9999, 1, 1, "元日"],
      [1874, 1948, 1, 3, "元始祭"],
      [1874, 1948, 1, 5, "新年宴会"],
      [1949, 1999, 1, 15, "成人の日"],
      [2000, 9999, 1, [2, 1], "成人の日"],
      [1874, 1912, 1, 30, "孝明天皇祭"],
      [1874, 1948, 2, 11, "紀元節"],
      [1967, 9999, 2, 11, "建国記念の日"],
      [1989, 1989, 2, 24, "昭和天皇の大喪の礼"],
      [1879, 1948, 3, "setSyunbun", "春季皇霊祭"],
      [1949, 2199, 3, "setSyunbun", "春分の日"],
      [1874, 1948, 4, 3, "神武天皇祭"],
      [1959, 1959, 4, 10, "皇太子・明仁親王の結婚の儀"],
      [1927, 1948, 4, 29, "天長節"],
      [1949, 1988, 4, 29, "天皇誕生日"],
      [1989, 2006, 4, 29, "みどりの日"],
      [2007, 9999, 4, 29, "昭和の日"],
      [1949, 9999, 5, 3, "憲法記念日"],
      [2007, 9999, 5, 4, "みどりの日"],
      [1949, 9999, 5, 5, "こどもの日"],
      [1993, 1993, 6, 9, "皇太子・徳仁親王の結婚の儀"],
      [1996, 2002, 7, 20, "海の日"],
      [2003, 9999, 7, [3, 1], "海の日"],
      [1913, 1926, 7, 30, "明治天皇祭"],
      [2016, 9999, 8, 11, "山の日"],
      [1913, 1926, 8, 31, "天長節"],
      [1966, 2002, 9, 15, "敬老の日"],
      [2003, 9999, 9, [3, 1], "敬老の日"],
      [1874, 1878, 9, 17, "神嘗祭"],
      [1878, 1947, 9, "setSyuubun", "秋季皇霊祭"],
      [1948, 2199, 9, "setSyuubun", "秋分の日"],
      [1966, 1999, 10, 10, "体育の日"],
      [2000, 9999, 10, [2, 1], "体育の日"],
      [1873, 1879, 10, 17, "神嘗祭"],
      [1913, 1926, 10, 31, "天長節祝日"],
      [1873, 1911, 11, 3, "天長節"],
      [1927, 1947, 11, 3, "明治節"],
      [1948, 9999, 11, 3, "文化の日"],
      [1990, 1990, 11, 12, "即位の礼正殿の儀"],
      [1873, 1947, 11, 23, "新嘗祭"],
      [1948, 9999, 11, 23, "勤労感謝の日"],
      [1915, 1915, 11, 10, "即位の礼"],
      [1915, 1915, 11, 14, "大嘗祭"],
      [1915, 1915, 11, 16, "大饗第1日"],
      [1928, 1928, 11, 10, "即位の礼"],
      [1928, 1928, 11, 14, "大嘗祭"],
      [1928, 1928, 11, 16, "大饗第1日"],
      [1989, 9999, 12, 23, "天皇誕生日"],
      [1927, 1947, 12, 25, "大正天皇祭"]
    ];
    
    // 日付を1月1日にセットする
    var date = new Date(year, 0, 1);
    
    // ループ用変数
    var i, len;
    
    // holidaysを元に戻り値を作成
    for (i = 0, len = holidays.length; i < len; i++) {
      // 開始年、終了年の間におさまっている場合に祝祭日のオブジェクトを作成
      if (holidays[i][0] <= year && year <= holidays[i][1]) {
        // setHoliday関数を実行します
        func.setHoliday(
          date,               // Dateオブジェクト
          year,               // 年
          holidays[i][2] - 1, // 月（日付のセット用に「-1」）
          holidays[i][3],     // 日 
          holidays[i][4]      // 祝祭日名
        );
      }
    }
    
    // 戻り値のオブジェクトのキー一覧を取得し並べ替える
    var keys = Object.keys(ret).sort();
    
    // 戻り値の内容から振替休日と国民の休日を設定していく
    for (i = 0, len = keys.length; i < len; i++) {
      // 該当する日付をパースして、ミリ秒の時間を取得
      var parse = Date.parse(keys[i] + " 00:00:00");
      
      // // 日付を再セット
      // date.setTime(parse);
      
      // // 土日の関数実行
      // func.setDonichi(date);
      
      // 日付をセット
      date.setTime(parse);
      
      // 振替休日の関数実行
      func.setFurikae(date);
      
      
      // 日付を再セット
      date.setTime(parse);
      
      // 国民の休日の関数実行
      func.setKokumin(date);
      
    }
    
    // 作成したオブジェクトを返す
    return ret;
  };
  
  Date.prototype.getDonichi = function(year) {
    // 戻り値となるオブジェクト
    var ret2 = {};
    
    //
    for(var i=0;i<12;i++){
      var date = new Date(year,i,1);
      //今月の末日を取得する
      var lastday = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
      for(var j=1;j<=lastday;j++){
        date.setDate(j);
        if(date.getDay() === 6){
          ret2[date.getFullYear() + "/" +
               (date.getMonth() + 1) + "/" +
               date.getDate()] = "土曜日";
        }
        else if(date.getDay() === 0){
          ret2[date.getFullYear() + "/" +
               (date.getMonth() + 1) + "/" +
               date.getDate()] = "日曜日";
        }
      }
    }
    return ret2;
  };
  

  //rokuyou.js
  Date.prototype.getQreki = (function (  ) { //旧暦の、年 月 日 閏月 の順で返す
  
    function func ( p0, p1, hosei, min ) {
      var q0 = 365.2 / 360;
      return function ( tm ) {
        var t1 = tm |0;
        var t2 = tm - t1 - hosei;
        var d1 = 0, d2 = 1, d3, t;
        var lsun = p0 * ( sun( ( t2 + .5 ) / 36525 + ( t1 - 2451545 ) / 36525 ) / p0 |0);
        
        while( Math.abs( d1 + d2 ) > min ) {
          d3 = sun( ( t2 + .5 ) / 36525 + ( t1 - 2451545 ) / 36525 ) - lsun;
          d3 += d3 > 180 ? -360: d3 < -180 ? 360: 0;
          t = d3 * q0;
          t1 -= ( d1 = t |0);
          t2 -= ( d2 = t / p1 - d1 );
          t2 < 0 && ( t2 += 1, t1 -= 1 );
        }
        return [ t1 + t2 + hosei , lsun ];
      };
    }
    
    var hosei = 9 / 24;
    var min = 1 / 86400;
    var deg = Math.PI / 180;
    var chuki = func( 30, 1, hosei, min );
    var nibun = func( 90, 360, hosei, min );
    
    
    var julius = (function ( ) {
      var q0 = 29.530589 / 360;
      
      return function ( tm ) {
        var t1 = tm |0, t2 = tm - t1 - hosei;
        var cnt = 1, d1 = 0, d2 = 1, d3, t, lsun, lmoon;
        
        while( Math.abs( d1 + d2 ) > min ) {
          t = ( t2 + .5 ) / 36525 + ( t1 - 2451545 ) / 36525;
          d3 = ( lmoon = moon( t ) ) - ( lsun = sun( t ) );
          t = ( d3 < 0 ? 360: 0 ) + d3 % 360;
          
          if( cnt == 1 && d3 < 0 ) d3 = t;
          else if( lsun >= 0 && lsun <= 20 && lmoon >= 300 ) d3 = 360 - t;
          else if( Math.abs( d3 ) > 40 ) d3 = t;
          
          t = d3 * q0;
          t1 -= ( d1 = t |0 );
          t2 -= ( d2 = t - d1 );
          t2 < 0 && ( t2 += 1, t1 -= 1 );
          
          if( Math.abs( d1 + d2 ) > min ) {
            if( cnt == 15 ) t1 = tm - 26 | (t2 = 0);
            else if( cnt > 30 ) return tm + hosei;
          }
          cnt++;
        }
        return  t2 + t1 + hosei;
      };
    })();
    
    
    var ymd_jd = (function ( ) {
      return function ( y, m, d ) {
        m < 3 && ( y -= 1, m += 12 );
        return (365.25 * y |0) + (y / 400 |0) - (y / 100 |0) + (30.59 * ( m - 2 ) |0) + 1721088 + d;
      };
    })();
    
    
    var jd_ymd = (function ( ) {
      return function ( jd ) {
        var tm = 86400 * ( jd % 1 ), x0, x1, x2, x3, x4, x5, x6, y, m, d;
        
        x0 = jd + 68570 |0;
        x1 = x0 / 36524.25 |0;
        x2 = ( x0 -  36524.25 * x1 + .75 ) |0;
        x3 = ( x2 + 1 ) / 365.2425 |0;
        x4 = x2 - ( 365.25 * x3 |0) + 31;
        x5 = ( x4 |0) / 30.59 |0;
        x6 = ( x5 |0) / 11 |0;
        
        y = 100 * ( x1 - 49 ) + x3 + x6;
        m = x5 - 12 * x6 + 2;
        d = x4 - 30.59 * x5 |0;
        m == 2 && d > 28 && ( d = y % ( y % 100 > 0 ? 4: 400 ) ? 28: 29 );
        
        return [ y, m, d ];
      };
    })();
    
    
    var sun = (function ( pr0, pr1, pr2 ) {
      return function( t ) {
        for( var i = 0, th = 0, b; i < 15; i++ )
          th += ( b = Math.cos( ( pr0[i] * t + pr1[i] ) * deg ) ) * pr2[i];
        
        return ( b = ( pr0[i] * t + pr1[i] + th + b * pr2[i] * t ) % 360 ) < 0 ? 360 + b: b;
      };
    })( [31557,29930,2281,155,33718,9038,3035,65929,22519,45038,445267,19,32964,71998.1,35999.05,36000.7695],
       [161,48,221,118,316,64,110,45,352,254,208,159,158,265.1,267.52,280.4659],
       [.0004,.0004,.0005,.0005,.0006,.0007,.0007,.0007,.0013,.0015,.0018,.0018,.002,.02,1.9147,-0.0048] );
    
    
    var moon = (function ( pr0, pr1, pr2 ) {
      return function ( t ) {
        for( var i = 0, th = 0, b; i < 61; i++ )
          th += Math.cos( ( pr0[i] * t + pr1[i] ) * deg ) * pr2[i];
        
        return ( b = ( pr0[i] * t + pr1[i] + th ) % 360 ) < 0 ? 360 + b: b;
      };
    })( [ 2322131,4067,549197,1808933,349472,381404,958465,12006,39871,509131,1745069,1908795,2258267,
         111869,27864,485333,405201,790672,1403732,858602,1920802,1267871,1856938,401329,341337,71998,
         990397,818536,922466,99863,1379739,918399,1934,541062,1781068,133,1844932,1331734,481266,
         31932,926533,449334,826671,1431597,1303870,489205,1443603,75870,513197.9,445267.1,441199.8,
         854535.2,1367733.1,377336.3,63863.5,966404,35999.05,954397.74,890534.22,413335.35,477198.868,
         481267.8809 ],
       [ 191,70,220,58,337,354,340,187,223,242,24,90,156,38,127,186,50,114,98,129,186,249,152,274,16,
        85,357,151,163,122,17,182,145,259,21,29,56,283,205,107,323,188,111,315,246,142,52,41,222.5,
        27.9,47.4,148.2,280.7,13.2,124.2,276.5,87.53,179.93,145.7,10.74,44.963,218.3162 ],
       [ .0003,.0003,.0003,.0003,.0003,.0003,.0003,.0004,.0004,0.0005,0.0005,0.0005,0.0006,0.0006,
        .0007,.0007,.0007,.0007,.0008,.0009,.0011,.0012,.0016,.0018,.0021,.0021,.0021,.0022,.0023,
        .0024,.0026,.0027,.0028,.0037,.0038,.004,.004,.004,.005,.0052,.0068,.0079,.0085,.01,.0107,
        .011,.0125,.0154,.0304,.0347,.0409,.0458,.0533,.0571,.0588,.1144,.1851,.2136,.6583,1.274,6.2888 ] );
    
    
    return function ( ) {
      var tm0 = ymd_jd( this.getFullYear(), this.getMonth() + 1, this.getDate() );
      var chu = [ nibun( tm0 ) ], saku = [ ], qreki = [ ], m = [ ];
      var state = 0, it = tm0 | 0, j = 0, tmp, tmp1, i, lap, a;
      
      for( i = 1; i < 4; i++ )
        chu[i] = chuki( chu[ i - 1 ][0] + 32 );
      
      saku[0] = julius( chu[0][0] );
      
      for( i = 1; i < 5; i++ ) {
        tmp = saku[ i - 1 ];
        saku[i] = julius( tmp + 30 );
        if( Math.abs( ( tmp |0) - ( saku[i] |0) ) <= 26 )
        saku[i] = julius( tmp + 35 );
      }
      
      if( ( saku[1] |0) <= ( chu[0][0] |0) ) {
        saku[0] = saku[1]; saku[1] = saku[2]; saku[2] = saku[3]; saku[3] = saku[4];
        saku[4] = julius( saku[3] + 35 );
      } else if( ( saku[0] |0) > ( chu[0][0] |0) ) {
        saku[4] = saku[3]; saku[3] = saku[2]; saku[2] = saku[1]; saku[1] = saku[0];
        saku[0] = julius( saku[0] - 27 );
      }
      
      lap = saku[4] <= chu[3][0] ? 1: 0;
      m[0] = [ ( chu[0][1] / 30 |0) + 2, 0, saku[0] |0 ];
      
      for( i = 1; i < 5; i++ ) {
        if( lap == 1 && i != 1 ) {
          if( chu[j][0] <= saku[j] || chu[j][0] >= saku[i] ) {
            m[j] = [ m[ i - 2 ][0], 1, saku[j]|0];
            lap = 0;
          }
        }
        m[i] = [ m[j][0] + 1, 0, saku[i] |0 ];
        m[i][0] > 12 && ( m[i][0] -= 12 );
        j = i;
      }
      for( i = 0; i < 5; i++ ) {
        tmp1 = m[i][2] |0;
        if( it < tmp1 ) { state = 1; break; }
        if( it == tmp1 ) { state = 2; break; }
      }
      
      2 > state && i--;
      tmp = m[i][0];
      a = jd_ymd( tm0 );
      tmp > 9 && tmp > a[1] && a[0]--;
      
      return [ a[0], tmp,  it - ( m[i][2] |0) + 1, m[i][1] ];
    };
  })();
  
  Date.prototype.getRokuyo = (function ( rokuyo ) { //六曜を返す
    return function ( sw ) {
      var a = this.getQreki(), w = ( a[1] + a[2] ) % 6;
      return sw ? rokuyo[ w ]: w;
    };
  })( [ '大安', '赤口', '先勝', '友引', '先負', '仏滅' ] );
  //rokuyo.js 

  //main.gs
  //d = new Date();
  //console.log(d.getDonichi(2018));
  //var ret = Object.assign(d.getHolidays(2018),d.getDonichi(2018));
  //console.log(ret);
//  for (var key in ret){
//      console.log(key + " " + new Date(key).getRokuyo(1));
//  }