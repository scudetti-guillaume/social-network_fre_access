const express = require("express")
const router = express.Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller')

//auth\\
router.post("/register", authController.signUp);
//user  \\
router.get('/', userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.userDelete);
router.patch('/follow/:id', userController.follow);
router.patch('/unfollow/:id', userController.unfollow);





module.exports = router;