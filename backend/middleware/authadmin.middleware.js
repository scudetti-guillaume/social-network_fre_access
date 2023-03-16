const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");


const durationTokenLogout = 1;

exports.requireAuthAdmin = (req, res, next) => {
  const auth = req.headers.cookie;
  // const tokenAdmin = auth && auth.split("=")[0];
  const token = auth && auth.split("=")[1];

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.status(401).send("token not found");
      } else {
        UserModel.findOne({ _id: decodedToken.id, ban: true }, (err, doc) => {
          if (doc) {
            res.cookie("jwt", "", { maxAge: durationTokenLogout }),
              res.status(400).json("utilisateur banni");
          } else {
            UserModel.findOne({ _id: decodedToken.id ,role : undefined} ,(err,doc)=>{
              if (doc == null) {
                req.role = "admin"
                req.user = decodedToken.id;
                next()
              } else {
              res.cookie("jwt", "", { maxAge: durationTokenLogout }),
              res.status(400).json("utilisateur banni");
                }
            })
          
          }
        });
      }
    });
  } else {
    req.role = ""
    req.user = "";
    console.log("access denied invalid token ");
    next();
  }
};

