var connectdb=require('../connectdb');
var moment = require('moment');
var popularCount=0;
//取得所有表演
exports.showAllInfo=function(){
  return new Promise(function(resolve,reject){
    connectdb.query('SELECT * FROM govmusic order by time',function(err,rows){
      if(err)
        reject(err);
      else
        resolve(rows);
    });
  });
};
//取得一筆表演
exports.showOneInfo=function(id){
  return new Promise(function(resolve,reject){
    connectdb.query('SELECT * FROM govmusic where id =?',[id],function(err,rows){
      if(err)
        reject(err);
      else{
        popularCount++;
        connectdb.query('update govmusic set popular=? where id=?',[popularCount,id]);
        console.log(popularCount);
        resolve(rows);
      }
    });
  });
};
//取得熱門top10表演
exports.showTop10Info=function(){
  return new Promise(function(resolve,reject){
    connectdb.query('select *  from govmusic order by popular desc limit 10',function(err,rows){
      if(err)
        reject(err);
      else
        resolve(rows);
    });
  });
};
//用所在城市篩選取得表演
exports.findShowByCity=function(thisCity){
  return new Promise(function(resolve,reject){
    connectdb.query('SELECT * FROM govmusic order by time',function(err,rows){
      if(err)
        reject(err);
      else{
        var correctShow=[];
        for(var i in rows){
          if(thisCity===rows[i].location.substring(0,3))
            correctShow.push(rows[i]);
        }
        resolve(correctShow);
      }
    });
  });
};
//用關鍵字(Title,Auth)篩選取得表演
exports.findShowByRelative=function(keyword){
  keyword="'%"+keyword+"%'";
  console.log(keyword);
  var searchByRelative='select * from govmusic where Title LIKE '+keyword+' OR Auth LIKE '+keyword+' order by time';
  return new Promise(function(resolve,reject){
    console.log(keyword);
    connectdb.query(searchByRelative,function(err,rows){
      if(err)
        reject(err);
      else
        resolve(rows);
    });
  });
};
//用日期篩選取得往後七天表演
exports.findShowByDate=function(findByYear,findByMonth,findByDay){
  var week = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  var thisMonthOfDays=week[findByMonth-1];
    console.log(week,thisMonthOfDays);
  return new Promise(function(resolve,reject){
    connectdb.query('SELECT * FROM govmusic order by time',function(err,rows){
      if(err)
        reject(err);
      else{
        var correctShow=[],findByMonthNextMonth;
        if(findByDay+7>thisMonthOfDays){  //判斷是否為月底
          findByMonthNextMonth=findByMonth+1;
        }
        for(var i in rows){
          var showDate=rows[i].time.substring(0,10).toString();
          var yearOfShow=parseInt(showDate.substring(0,4));
          var monthOfShow=parseInt(showDate.substring(6,7));
          var dayOfShow=parseInt(showDate.substring(8,10));
          if(findByMonthNextMonth===undefined){  //不為月底
            if(yearOfShow===findByYear&&monthOfShow===findByMonth&&dayOfShow>=findByDay&&dayOfShow<=findByDay+7){
              correctShow.push(rows[i]);
            }
          }else{  //月底
            if(yearOfShow===findByYear&&dayOfShow>=findByDay&&dayOfShow<=thisMonthOfDays&&monthOfShow===findByMonth){
              correctShow.push(rows[i]);  //取得當日至月底表演
            }
            if(yearOfShow===findByYear&&dayOfShow<=findByDay+7-thisMonthOfDays&&monthOfShow===findByMonthNextMonth){
              correctShow.push(rows[i]);  //取得當日往後推下月剩於日期表演
            }
          }
        }
        resolve(correctShow);
      }
    });
  });
};
//用使用者附近取得表演
exports.nearlyShow=function(lon1,lat1,lon2,lat2){
  return new Promise(function(resolve,reject){
    connectdb.query('SELECT * FROM govmusic',function(err,rows){
      var arr=[];
      if(err)
        reject(err);
      for(var i in rows){
        var checklon=parseFloat(rows[i].longitude);
        var checklat=parseFloat(rows[i].latitude);
        if((checklon!=='')&&(checklat!=='')){  //判斷該筆資料是否有經緯度  (左上  右下)
          if((checklon<=lon2)&&(checklon>=lon1)&&(checklat<=lat1)&&(checklat>=lat2)){//如果該筆點在範圍內
            arr.push(rows[i]);
          }
        }
        else
          continue;
        if((checklon!=='')&&(checklat!=='')){  //判斷該筆資料是否有經緯度   (左下  右上)
          if((checklon<=lon2)&&(checklon>=lon1)&&(checklat>=lat1)&&(checklat<=lat2)){//如果該筆點在範圍內
            arr.push(rows[i]);
          }
        }
        else
          continue;
      }
      resolve(arr);
    });
  });
};
