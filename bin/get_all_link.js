var request = require('request');
var cheerio = require("cheerio");
var fs = require("fs");
var async=require('async');
var getShowInfo=require('./get_one_page');

var date=new Date();
var today=date.getFullYear().toString()+'-'+(date.getMonth()+1).toString()+'-'+date.getDate().toString();
var future=date.getFullYear().toString()+'-'+(date.getMonth()+3).toString()+'-'+date.getDate().toString();
var url="https://www.indievox.com/event/get-more-event-date-list?style=poster&content=event_upcoming&content_container_id=event-ticket-block&start_date="+today+"&end_date="+future+"&key_word=&load_more=1&pagenation_type=full-page-more&pagenation_expand_col=&offset=0&length=30";

var now =new Date();

exports.download=function(){
  getAllLink();
};



function getAllLink(){
  request({
     url: url,//你想抓的網址
     method: "GET"
   },function(err,res,body) { /* Callback 函式 */
    $ = cheerio.load(body);
     var showLink=[];
     console.log('begin download');
     $('h5 a').each(function(){    //取得該區域中元素
       var link = $(this).attr('href').toString();  //取得超連結地址
       link='https://www.indievox.com'+link;
       showLink.push(link);  //依序將地址存入陣列
     });
     for(var i in showLink){
      //  console.log(showLink[i]);
       getShowInfo.getShowInfo(showLink[i],showLink.length);
     }
   });
}
