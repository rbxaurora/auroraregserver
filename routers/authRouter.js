const express = require(`express`);
const router = express.Router();
const authController = require(`../controllers/authController`);
const { check } = require(`express-validator`);
const authMiddleware = require(`../middlewares/authMiddleware`);
const roleMiddleware = require(`../middlewares/roleMiddleware`);

router.post(`/login`, authController.login);
router.post(`/registration`, [
	check('username', 'Имя пользователя не может быть пустым!').notEmpty(),
	check('password', 'Пароль не может быть пустым!').isLength({ min: 4, max: 32 })
	], authController.registration);
router.get(`/users`, roleMiddleware(['OWNER']), authController.getUsers);


module.exports = router;