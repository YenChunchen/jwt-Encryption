var connectdb=require('../connectdb');
var crypto = require('crypto');   //加解密module
var getToken=require('./get_token');


module.exports=function (account,pwd) {
  return new Promise(function(resolve,reject){
    var sha256 = crypto.createHash('sha256');  //產生hash sha256編碼
    pwd=sha256.update(pwd).digest('hex'); //將密碼編碼sha-256轉16進制和DB比對
    console.log(pwd);
    connectdb.query('select * from member where account=? and pwd=?',[account,pwd],function(err,rows){
      if(rows.length===0){
        reject('帳號或密碼錯誤');
      }
      else{
        var token=getToken.getToken(rows[0]);  //取得該次token
        console.log(token);
        var success={
          message:'你好 '+rows[0].nickName,
          list:rows[0],
          token:token.token,
          expires:token.expires
        };
        resolve(success);
      }
    });
  });
};
