const express = require('express');
const router = express.Router();
const msgController = require(`../controllers/msgController`);

router.post('/regtoken', msgController.regToken);
router.post('/sendnotifchat', msgController.sendNotificationChat);


module.exports = router;