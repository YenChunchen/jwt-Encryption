var express = require('express');
var router = express.Router();
var createMemberTodb=require('../model/member/create_member_todb');
var showMemberTodb=require('../model/member/show_member_todb');
var loginMemberTodb=require('../model/member/login_member_todb');
var updateMemberTodb=require('../model/member/update_member_todb');
var jwtAuth=require('../model/jwt_auth');
var fs=require('fs');

module.exports= class member{
  showAllMember(req,res){
    showMemberTodb.showAllMemberTodb().then(
      function(result){
        res.json({list:result});
      }
    ).catch(function(result){
        res.json({message:result});
    });
  }
  showMyself(req,res){
    var authResult=jwtAuth.jwtAuth(req);
    if(isNaN(authResult)){   //如果會員id錯誤
      res.json({message:authResult});
    }else{
      showMemberTodb.showOneMember(authResult).then(function(list){
          res.status(200).json({list:list});
      });
    }
  }

  createMember(req,res){
    var account=req.body.account;
    var pwd=req.body.pwd;
    var nickName=req.body.nickName;
    var image=req.photo;
    var hostname=req.hostname;
    var result=checkValidInfo(account,pwd,image,hostname);
    if(result.indexOf('/pic/member/')!==-1){  //檢查欄位是否有誤
      var photoPath=result;
      createMemberTodb(account,pwd,nickName,photoPath).then(
        function(success){
          res.status(200).json({message:success});
      }).catch(function(err){
          res.json({message:err});
          return;
      });
    }else{   //檢查欄位有誤
      res.status(400).json({meaagse:result});
      return;
    }
  }

  memberLogin(req,res){
    var account=req.body.account;
    var pwd=req.body.pwd;
    if(checkFieldMember(account,pwd)===false){
      res.json({message:'請輸入帳號密碼'});
      return;
    }else{
      loginMemberTodb(account,pwd).then(function(result){
        // console.log(result);
        res.writeHead(200,{"x-access-token": result.token,"expires":result.expires});
        var message={
          message:result.message
        };
        message=JSON.stringify(message);  //將message轉JSON
        res.write(message);
        res.end();
      }).catch(function(result){
          res.json({message:result});
      });
    }
  }
  updateMember(req,res){
    if(isNaN(authResult)){   //如果會員id錯誤(先檢查是否為會員)
      res.json({message:authResult});
    }else{  //是會員
      var changeAccount=req.body.changeAccount;  //本次要更改的account
      var changePwd=req.body.changePwd;
      var changeNickName=req.body.changeNickName;
      var changeImage=req.photo;  //本次要更改的圖片
      var hostname=req.hostname;
      var authResult=jwtAuth.jwtAuth(req);
      var result=checkValidInfo(changeAccount,changePwd,changeImage,hostname);
      if(result.indexOf('/pic/member/')!==-1){//檢查欄位是否有誤
        var photoPath=result;
        var changeInfo={
          memberId:authResult,
          newAccount:changeAccount,
          newPwd:changePwd,
          newNickName:changeNickName,
          newPhotoPath:photoPath,
        };
        updateMemberTodb(changeInfo).then(
          function(success){
            res.status(200).json({message:success});
        }).catch(function(err){
            res.json({message:err});
            return;
        });
      }else{    //檢查欄位有誤
        res.json({meaagse:result});
        return;
      }
    }
  }
};







function checkFieldLoginMember(account,pwd){   //檢查有無輸入帳號密碼
  if((account==='')||(account===undefined)||(pwd==='')||(pwd===undefined)){
    return false;
  }else{
    return true;
  }
}

function checkFieldMember(account,pwd){   //檢查帳號密碼是否合法
  if(account!==''&&account!==undefined&&pwd!==''&&pwd!==undefined){
    var Reg = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9._%-]+\.[a-zA-Z]{2,4}$/;
    if(!account.match(Reg)){
      return false;
    }else{
      return true;
    }
  }else{
    return false;
  }
}
function checkImageLimit(image){   //檢查圖檔是否合法
  var maxSize=2*1000*1000;
  if(image.mimetype!=='image/png'){
    fs.unlink('./pic/member/'+image.filename);
    return false;
  }else{
    if(image.size>maxSize){
      fs.unlink('./pic/member/'+image.filename);
      return false;
    }else{
      return true;
    }
  }
}
function checkValidInfo(account,pwd,image,hostname){  //整理所有欄位訊息
  var message;
  if(checkFieldMember(account,pwd)===false){ //檢查欄位
    if(image!==undefined){  //如果欄位錯誤但有上傳圖檔,則刪除
      fs.unlink('./pic/member/'+image.filename);
    }
    return '請輸入正確欄位';
  }else{  //欄位正確
    if(image===undefined){  //如未上傳圖片則用預設圖檔
      message='http://'+hostname+'/pic/member/default.jpeg';
    }else{  //否則使用該次上傳圖檔
      message='http://'+hostname+'/pic/member/'+image.filename;
      if(checkImageLimit(image)===false){  //篩選檔案大小,型態
        return '請符合檔案限制(小於2M PNG檔)';
      }
    }
  }
  return message;
}
