/*multer 上傳檔案相關資訊*/
var multer  = require('multer');
var ran=Math.round(Math.random()*1000000);
var storage = multer.diskStorage({  //檔案儲存
  destination: function (req, file, cb) {  //檔案位置
    cb(null, 'pic/member');
  },
  filename: function (req, file, cb) {    //檔案名稱
    var extname; //暫存副檔名
    // if(file.mimetype === 'image/jpeg') extname='.jpeg';  //判斷型態添加副檔名
    if(file.mimetype === 'image/png') extname='.png';
    cb(null, file.fieldname + '-' + Date.now()+ran+extname); //以時間(ms)加隨機數重命名
  }
});
var maxSize=2*1000*1000;
var upload = multer({
  storage: storage,   //上傳檔案儲存
  // limits: { fileSize: maxSize },  //限制檔案大小
  // fileFilter: function (req, file, cb) {  //上傳檔案條件
  //     console.log(file.size);
  //     // if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
  //     if (file.mimetype === 'image/png' ) {
  //      cb(null, true);
  //     }
  //     else {
  //       cb(null, false);
  //     }
  // }
});

module.exports=upload;
