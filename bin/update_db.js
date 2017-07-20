var connectdb=require('../model/connectdb.js');
var fs = require("fs");
var async=require('async');


exports.insertData=function(data){
  console.log('updating table');
  updateTable(data);
};


function updateTable(data){
  connectdb.query('select * from govmusic',function(err,rows ){
    if(rows.length!==0){
      connectdb.query('delete from govmusic where id between 1 and '+rows[rows.length-1].id);
      connectdb.query('TRUNCATE TABLE govmusic');  //重整自動增長id
      insertData(data);
    }
    else{
      connectdb.query('TRUNCATE TABLE govmusic');  //重整自動增長id
      insertData(data);
    }
  });
}

//將最新所需值更新DB
function insertData(data){
  var temp={};
  for(var i in data){
    temp={
      Title:data[i].Title,
      Auth:data[i].Auth,
      time:data[i].time,
      price:data[i].price,
      locationName:data[i].locationName,
      location:data[i].location,
      latitude:data[i].latitude,
      longitude:data[i].longitude,
      onSale:data[i].isSale,
      webSale:data[i].webSale,
      photo:data[i].pic,
      describe:data[i].describe,
      popular:0
    };
    connectdb.query('insert into govmusic set ?',temp);
  }
}
