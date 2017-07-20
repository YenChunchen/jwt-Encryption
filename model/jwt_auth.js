var express = require('express');
var jwt = require('jwt-simple');
var app = express();
app.set('jwtTokenSecret', 'test jwt string');  //jwt key


exports.jwtAuth=function(req){
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];  //取得token值
    if (token) {  //如果token正常解析
      try {
        var decoded=jwt.decode(token,app.get('jwtTokenSecret'));//將token解譯
        if (decoded.exp <= Date.now()) {  //如果token過期
          return '請重新登入會員';
        }else{   //如果token沒過期
          return decoded.iss;  //成功回應解碼出的會員id
        }
      } catch (err) {    //如果token解析錯誤
         return '會員帳號密碼錯誤';
      }
    }else {    //如果沒有token
      return '請登入會員';
    }
};
