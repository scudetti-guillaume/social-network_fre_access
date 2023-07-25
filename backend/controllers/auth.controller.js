const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { signUpErrors, signInErrors } = require("../utils/errors.utils");


// valid token jwt duration \\

const durationTokenLogin24 = 1 * 24 * 60 * 60 * 1000;
const durationTokenLogin12 = 1 * 12 * 60 * 60 * 1000;
const durationTokenLogout = 1;

// create token end point \\

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: "12h", // securité sur la durée du token (journée de travail) //
  });
};


// logout end point \\

exports.logout = (req, res) => {
  res.cookie("jwt_soc_free", "", { maxAge: durationTokenLogout });
  res.cookie("jwtadmin_free", "", { maxAge: durationTokenLogout });
  res.redirect("./");
};

// ======================== login and signup without badge and employees model ============================\\


// const logStream = fs.createWriteStream('../../lesiteduscudo.com/soc_free/log.log');
// console.log = (message) => {
//   logStream.write(`${message}\n`);
//   process.stdout.write(`${message}\n`);
// };

exports.signUp = async (req, res, next) => {
  console.log(req.body);
  const { lastname, firstname, email, password } = req.body;
    try {
      const userNew = new UserModel({
        lastname: lastname,
        firstname: firstname,
        email: email,
        password: password,
      });
     
      await userNew.save();
      res.status(201).json(userNew);
  
    } catch (error) {
      const errors = signUpErrors(error);
      res.status(401).send({errors});
    }
};



exports.signIn = async (req, res) => {
  const { email,password } = req.body;
  try {
    const ban = UserModel.findById();
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt_soc_free", token, {
      session: false,
      maxAge: durationTokenLogin12,
      secure: false,
      httpOnly: true,
    });
    UserModel.findOne({ _id: user, ban: true }, (err, doc) => {
      if (doc) {
        res.cookie("jwt_soc_free", "", { maxAge: durationTokenLogout }),
        res.status(400).json("utilisateur banni");
      } else {
        res.status(200).json({ user: user._id, token });
      }
    });
  } catch (err) {
    const errors = signInErrors(err);
    res.status(401).send({ errors });
  }
};



