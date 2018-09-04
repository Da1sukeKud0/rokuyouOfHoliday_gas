//
// Google Apps script
// Quote:http://d.hatena.ne.jp/babu_babu_baboo/20100111/1263171414
//
// Date オブジェクトを拡張して、六曜を返すようにする

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

//1年単位で六曜を取得
//for(var i=0;i<12;i++){
//  var day = new Date(2018,i,1);
//  var time = (new Date).getTime();
//  //今月の末日を取得する
//  var lastday = new Date(day.getFullYear(), day.getMonth()+1, 0).getDate();
//
//  for(var j=1;j<=lastday;j++){
//    day.setDate(j);
//    //document.write( day +"/"+ day.getRokuyo(1)+"<br>" );
//    Logger.log( day +"/"+ day.getRokuyo(1) );
//    //console.log( day +"/"+ day.getRokuyo(1) );
//  }
//}
//alert( ((new Date).getTime() - time) / 1000 );ß