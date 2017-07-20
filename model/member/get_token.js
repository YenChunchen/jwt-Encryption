var express = require('express');
var jwt = require('jwt-simple');
var moment = require('moment');
var app = express();

exports.getToken=function(thismember){
  app.set('jwtTokenSecret', 'test jwt string');
  var expires = moment().add( 7,'days').valueOf();
  var token = jwt.encode({  //將key值 時間  會員id編碼產生token
    iss: thismember.id,
    exp: expires
  }, app.get('jwtTokenSecret'));
  var thisToken={
    token:token,
    expires:expires
  };
  return thisToken ;
};
