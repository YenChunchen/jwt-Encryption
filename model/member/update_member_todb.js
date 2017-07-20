var connectdb=require('../connectdb');
var crypto = require('crypto');   //加解密module
var fs=require('fs');

module.exports=function(changeInfo) {
  return new Promise(function(resolve,reject){
    // console.log(changeInfo);
    var selectStr='select * from member where id= '+(changeInfo.memberId).toString();
    connectdb.query(selectStr,function(err,rows){
      var oldPhotoName=rows[0].photo.substring(28,100);//取得舊圖檔檔名
      // console.log(oldPhotoName);
      if(oldPhotoName!=='default.jpeg'){  //如果原圖不為預設圖
        fs.unlink('./pic/member/'+oldPhotoName);  //則刪除舊檔
      }
      var sha256 = crypto.createHash('sha256');  //sha256編碼
      var updateMember={
        account:changeInfo.newAccount,
        pwd:sha256.update(changeInfo.newPwd).digest('hex'),  //將新改的密碼加密儲存
        nickName:changeInfo.newNickName,
        photo:changeInfo.newPhotoPath
      };
      // console.log(updateMember);
      connectdb.query('update member set ? where id=?',[updateMember,changeInfo.memberId]);
      resolve('更新成功');
    });
  });
};
