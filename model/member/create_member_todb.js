var connectdb=require('../connectdb');
var crypto = require('crypto');   //加解密module
var fs=require('fs');

module.exports=function(account,pwd,nickName,photoPath) {
  return new Promise(function(resolve,reject){
    var temp={};  //暫存會員資料物件
    temp.account=account;
    var sha256 = crypto.createHash('sha256');  //將pwd轉hash sha256編碼
    temp.pwd=sha256.update(pwd).digest('hex'); //將pwd編碼轉16進制儲存
    if((nickName==='')||(nickName===undefined)){
      temp.nickName=account;  //如nickname未輸入以account為主
    }
    else{
      temp.nickName=nickName;
    }
    connectdb.query("SELECT * FROM member where account=?",[account], function(err, rows) {  //create newaccount
        if(err){
            reject(err);
        }
        if(rows.length!==0)   //判斷帳號是否重複
         {
          //  console.log(photoPath.indexOf('photo'));
          //  console.log(photoPath.substring(28,100));
           var photoName=photoPath.substring(28,100);
           if(photoName!=='default.jpeg'){
             fs.unlink('../opendata/pic/member/'+photoName);
           }
           reject('該會員已存在');
         }
         else{
           var newMember={   //存放合法資料物件
             account:temp.account,
             pwd:temp.pwd,
             nickName:temp.nickName,
             photo:photoPath
           };
          connectdb.query("INSERT INTO member SET ?",newMember);  //沒重複建立
          resolve('會員創建成功');
         }
      });
  });
};
