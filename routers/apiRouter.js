const express = require(`express`);
const router = express.Router();
const apiController = require(`../controllers/apiController`);

router.get(`/getuser`, apiController.getUser);
router.get(`/getuserslist`, apiController.getUsersList);
router.get(`/getuserinfo`, apiController.getUserInfo);
router.post(`/saveuser`, apiController.saveUser);
router.get('/memberinfo', apiController.getMemberInfo);
router.post('/sendreport', apiController.sendReport);
router.get('/getreg', apiController.getReg);
router.get('/getallreg', apiController.getAllReg);
router.post('/deleteuser', apiController.deleteAccount);
router.get('/getmemberslist', apiController.getMembersList);
router.post('/savemember', apiController.saveMember);
router.post('/deletemember', apiController.deleteMember);
router.post('/deletereg', apiController.deleteReg);
router.get('/posts', apiController.getPosts);
router.post(`/savepost`, apiController.savePost);
router.get(`/getpost`, apiController.getPost);
router.post(`/deletepost`, apiController.deletePost);
router.get(`/getchats`, apiController.getChats);
router.post(`/addchat`, apiController.addChat);
router.get(`/getchat`, apiController.getChat);


module.exports = router;