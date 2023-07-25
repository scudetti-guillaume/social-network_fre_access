const express = require("express");
const image = require("../middleware/photo.user.middleware");
const { multerErrors } = require("../utils/errors.utils");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authAdminController = require("../controllers/authadmin.controller");
const userController = require("../controllers/user.controller");
const uploadController = require("../controllers/upload.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { requireAuthAdmin } = require("../middleware/authadmin.middleware");

router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.post("/loginadmin",requireAuth, authAdminController.signIn);
router.get("/logout", authController.logout);

//user  \\

router.get("/", userController.getAllUsers);
router.get('/:id',requireAuthAdmin, userController.userInfo);
router.put("/:id",requireAuth,(req, res, next) => {image(req, res, function (err) {if (err) {console.log(err.message); const errors = multerErrors(err);res.status(400).json({ errors });
} else {next();}
  });
}, userController.updateUser);
router.patch("/banuser/:id",requireAuth,userController.banuser)
router.patch("/unbanuser/:id",requireAuth,userController.unbanuser)
router.patch("/signalUser/:id",requireAuth,userController.signalUser)
router.patch("/follow/:id",requireAuth, userController.follow);
router.patch("/unfollow/:id",requireAuth, userController.unfollow);


router.post(
  "/:id",requireAuth, 
  (req, res, next) => {image(req, res, function (err) {if (err) {console.log(err.message); const errors = multerErrors(err);res.status(400).json({ errors });
  } else {next();}
    });
  }
  ,uploadController.uploadProfil);

  module.exports = router;