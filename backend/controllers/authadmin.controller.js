const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { signUpErrors, signInErrors } = require("../utils/errors.utils");

const durationTokenLogin1 = 1*1*60 * 60 * 1000;
const durationTokenLogout = 1;

const createToken = (id,email,badge) => {
  return jwt.sign({ id,email,badge}, process.env.TOKEN_SECRET, {
    expiresIn: "1h", // securité sur la durée du token (journée de travail) //
  });
};


exports.signIn = async (req, res) => {
  const { email, badge, password } = req.body;
  try {
    const user = await UserModel.login(email, badge, password);
    const token = createToken(user._id);
    res.cookie("jwtadmin", token, {
      // SameSite : None,
      session: false,
      maxAge: durationTokenLogin1,
      secure: false,
      httpOnly: true,
    });
    UserModel.findOne({ _id: process.env.ADMINID, ban: false, role:'admin' }, (err, doc) => {
      if (doc) {
         res.status(200).json({ user: user._id, token });
      } else {
           res.cookie("jwtadmin", "", { maxAge: durationTokenLogout }),
        res.status(400).json("admin banni");
      
      }
    });
  } catch (err) {
    const errors = signInErrors(err);
    res.status(401).send({ errors });
  }
};

// logout end point \\

exports.logout = (req, res) => {
  res.cookie("jwtadmin", "", { maxAge: durationTokenLogout });
  res.redirect("./");
};