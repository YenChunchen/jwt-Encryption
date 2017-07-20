var express = require('express');
var router = express.Router();
var upload=require('../controller/member_form_data_upload_multer.js');
var Member=require('../controller/member.js');
var member=new Member();
router.get('/all' , member.showAllMember);
router.post('/create',upload.single('photo'), member.createMember);
router.put('/update',upload.single('photo'), member.updateMember);
router.post('/login', member.memberLogin);
router.get('/me' , member.showMyself);

module.exports = router;
